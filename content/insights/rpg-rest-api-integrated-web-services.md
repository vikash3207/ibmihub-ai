## 1. Why this matters

Most IBM i shops are not short on business logic -- they're short on ways to reach the business logic they already have. A pricing calculation, a credit check, an inventory lookup: the RPG that does this correctly, with the edge cases already worked out, has usually been running in production for years. The problem isn't the logic. It's that a mobile app, a partner integration, or a modern web front end speaks HTTP and JSON, and a green-screen program doesn't.

The instinct is often to rewrite. Pull the logic out, reimplement it in a services layer written in something "web-native," and retire the RPG. That's sometimes the right call -- but it's expensive, it's slow, and it re-introduces risk into logic that was already correct. Every rewrite is a chance to reintroduce a bug that production already taught you to avoid.

Integrated Web Services (IWS) offers a narrower, faster path for a specific and common case: an existing RPG program or service-program procedure that already has a clean, well-defined interface can be *exposed* as a REST endpoint without being rewritten. The business logic stays where it is, keeps running the way it always has, and gets a new front door.

This article is a practical walkthrough of that path: what IWS actually does, how to tell whether a given RPG program is a good candidate, how to design (or redesign) its interface so it behaves well as an API, and what changes once that program is reachable from the public internet instead of only from a 5250 session or a batch job. It assumes you're comfortable with ILE RPG and have at least touched CL-level administration on IBM i; it does not assume you've used IWS before.

## 2. What Integrated Web Services is

Integrated Web Services for i is a no-additional-charge component of IBM i that lets an existing ILE program object (`*PGM`) or service-program procedure (`*SRVPGM`) be published as a SOAP or REST web service, running on IBM's HTTP Server for i (the Apache-based web server that ships with the operating system). It has shipped as part of IBM i for multiple releases; the exact administration screens, PTF requirements, and supported options can differ by release, so treat anything version-specific below as a starting point to confirm against the IBM i documentation for your own release, not a universal constant.

At a mechanical level, IWS does three things:

1. **Hosts a web services server** -- an HTTP Server for i instance configured to accept web service requests and route them to deployed services, created and managed through the **IBM Web Administration for i** browser-based GUI (or, for scripted/repeatable deployments, a set of shell scripts under `/QIBM/ProdData/OS/WebServices/V1/server/bin`, such as `installWebService.sh`).
2. **Maps an HTTP request to a program call.** When a request arrives at a deployed service's endpoint, IWS translates the inbound parameters into the parameter list the RPG program or procedure expects, calls it inside a job on IBM i, and translates the output parameters back into the HTTP response body (JSON, XML, or plain text, depending on how the service was configured).
3. **Uses PCML (Program Call Markup Language) as the parameter contract.** For a program to be deployable through IWS, the compiler needs to have generated PCML describing its parameter list -- types, lengths, and structure -- so IWS knows how to marshal an incoming JSON or XML payload into the exact parameters the program expects, and vice versa on the way out.

**What it does not automatically solve.** IWS is a calling and marshaling mechanism, not an application redesign tool. Deploying a program through IWS does not:

- Give the program a stateless, well-behaved interface if it didn't have one already -- a program written to read from a display file, prompt interactively, or depend on job attributes set by an earlier step in an interactive session will not become well-behaved just because it's reachable over HTTP.
- Add authentication, authorization, or rate limiting on its own -- those are configured at the HTTP Server / web services server layer (and, separately, still enforced by IBM i object and adopted-authority rules underneath).
- Add input validation, versioning, or structured error responses -- if the RPG program returns a blank field instead of a meaningful error on bad input, IWS will faithfully return that blank field as JSON.
- Guarantee good performance under concurrent load -- that still depends on the program's own design (activation group, file open/close pattern, commitment control) exactly as it would if you'd written a native HTTP handler from scratch.

In short: IWS removes the *plumbing* work of building an HTTP listener, a JSON parser, and a request router. It does not remove the *design* work of making sure the thing on the other end of that plumbing behaves like a production API. Sections 6 and 9 cover that design work in detail.

## 3. Choosing a suitable RPG API candidate

Not every RPG program is a good IWS candidate, and picking the wrong one is the single most common way these projects go sideways. Before wrapping anything, check it against these criteria:

- **A clear input/output contract.** The program should already take well-defined parameters and return well-defined parameters (or use a data structure that plays the same role). If the "interface" today is a handful of loosely related fields set by whatever screen or batch job happens to call it, that's a sign the interface needs to be tightened before it's exposed externally -- see Section 6.
- **Limited or no interactive dependencies.** A program that calls `EXFMT` against a display file, reads `*IN` indicators set by 5250 input, or assumes it's running under an interactive job cannot be sensibly exposed as a REST endpoint. IWS calls the program in a job on the web services server -- there is no screen, and there is no user sitting at one.
- **Predictable authority and library-list requirements.** The program will run under whatever user profile and library list the IWS deployment is configured to use (commonly a dedicated service profile, not the caller's own IBM i user profile -- callers are HTTP clients, not signed-on IBM i users). If the program's correct behavior depends on a specific library list, a specific current library, or authority the calling job's profile might not have, that needs to be nailed down as part of deployment, not discovered in production.
- **Statelessness and side-effect awareness.** A REST call is not a session. If the program relies on a data area, a static field, or a file position carried over from a previous call in the same "conversation," that assumption breaks the moment two requests can arrive concurrently -- which, once this is a public API, they will. Each request should be able to stand alone.
- **Program vs. service-program procedure.** IWS can deploy either a standalone `*PGM` object or a procedure exported from a `*SRVPGM`. For anything beyond a single, simple operation, a service-program procedure is usually the better fit: procedures give you a tighter, typed parameter interface (prototypes instead of a program's parameter list), can be reused by other callers besides IWS (batch jobs, other service programs, SQL external procedures), and let you group related operations without one `*PGM` per operation. A single-purpose `*PGM` is still reasonable for a small, self-contained utility.

If a program fails several of these checks, that doesn't rule out IWS -- it usually means writing a small, purpose-built wrapper procedure that calls the existing business logic internally, rather than exposing the original interactive or loosely-scoped program directly. That wrapper becomes the actual API surface, and it's much easier to keep well-behaved than trying to retrofit statelessness onto something that was never designed for it.

## 4. Architecture and request flow

Once a candidate program has a clean interface, the request path from a browser or another application down to Db2 for i and back looks like this:

[[ARCHITECTURE-DIAGRAM]]

Walking through it: a REST client -- a browser, a mobile app, another server -- sends an HTTPS request to IBM i's HTTP Server, on whichever port the web services server is bound to. The HTTP Server, with TLS termination handled through Digital Certificate Manager (DCM), passes matching requests to the IWS runtime. IWS looks up the deployed service mapping for that path and HTTP method -- the configuration created when the service was deployed, tying a URL and verb to a specific program or service-program procedure and its PCML-described parameter list. IWS marshals the request body (and any path/query parameters, depending on how the service was mapped) into that parameter list and calls the RPG program or procedure in a job on the web services server. The program does whatever it always did -- typically reading or writing Db2 for i data, or running whatever business logic it encapsulates -- and returns its output parameters. IWS marshals those back into a JSON (or XML) response body, and the HTTP Server sends it back to the client.

Two details worth calling out because they surprise people coming from other API stacks: first, the "server" that executes your RPG program is a regular IBM i job, subject to the same library list, authority, and activation-group rules any other job is -- it is not a sandboxed or containerized execution environment. Second, there is no implicit session between requests; every request is marshaled, called, and returned independently, which is exactly why the statelessness requirement in Section 3 matters.

## 5. Prerequisites

Confirm each of these against the IBM i documentation for your specific release before starting -- IWS has existed across several releases, and exact PTF groups, Java requirements, and administration screens have shifted over time:

- **A supported IBM i release** with Integrated Web Services available -- check the "Integrated Web Services for i" topic in the IBM i Knowledge Center for your release (see References) for the current release matrix.
- **IBM HTTP Server for i**, configured and running, since the web services server is hosted on it.
- **The current HTTP Server and Java Group PTFs** for your release. IWS relies on Java under the covers (the administration GUI and the web services runtime), so an outdated Java Group PTF is one of the more common causes of a deployment that looks fine but fails at runtime -- verify current PTF levels rather than assuming an existing install is current.
- **Access to IBM Web Administration for i**, the browser-based GUI used to create the web services server and run the service-creation wizard (or, for scripted deployment, shell access to run the `installWebService.sh`-style scripts under `/QIBM/ProdData/OS/WebServices/V1/server/bin`).
- **Authority to create and manage the web services server instance**, and authority (directly or through a dedicated service profile) for that server's job to call the target program and access the objects it touches -- the library list, the Db2 for i files or SQL objects, and any data areas or other resources the logic depends on.
- **PCML generation for the target program or service program**, produced at compile time (commonly via a `PGMINFO` compiler option that tells the compiler to emit a `.pcml` file describing the parameter interface) -- IWS needs this to know how to marshal requests and responses.
- **TLS readiness** if the service will be reachable outside a trusted internal network: a server certificate configured through Digital Certificate Manager (DCM) and bound to the HTTP Server instance the web services server runs on. Section 9 covers why this isn't optional for anything handling real data.

## 6. Designing the RPG interface

This is the section that determines whether the resulting API is pleasant to consume or a source of support tickets. A few concrete practices:

**Use a data structure for anything beyond two or three parameters.** A qualified data structure with named subfields maps cleanly to a JSON object and is far easier to extend later (adding a subfield is additive; inserting a parameter into a flat parameter list is not) than a long, positional parameter list.

**Validate input inside the procedure, and never trust a caller's data types at face value.** A JSON `"customerNumber": "ABC"` sent against a packed-decimal parameter is a marshaling failure IWS will handle at the boundary, but plenty of "technically valid" input -- a negative quantity, a date that doesn't exist, a status code outside the expected set -- will marshal just fine and needs the program's own validation logic to catch.

**Design the output contract to include an explicit status, not just data.** A caller that gets `HTTP 200` with an empty body has no way to distinguish "no results" from "something went wrong that got swallowed." At minimum, return a status/result-code field and a human-readable message field alongside the actual data, so the HTTP layer (Section 9 covers mapping these to real HTTP status codes) and the client both have something concrete to check.

**Assume nothing about how the caller is running.** No `EXFMT`, no reliance on `*IN` indicators from a display file, no dependence on a data area another job is expected to have set up first. If the existing program has any of these, the practical answer is usually a new, thin procedure that owns the validated, stateless interface and internally calls the existing logic -- not modifying the original interactive program to also serve HTTP traffic.

**Keep error information structured and HTTP-consumer-friendly.** A program that signals failure only through an `*IN` indicator or a hard error message queue entry gives IWS nothing useful to return. Return an explicit error code and message as part of the output structure (the worked example in Section 7 shows this concretely), so a failure is a normal, parseable response, not a marshaling exception.

## 7. Worked example

To make this concrete, here's one coherent example carried through the rest of the article: a **customer credit lookup** service. Given a customer number, it returns the customer's name, credit limit, and current balance due -- read-only, single-purpose, and a good first IWS candidate because it has no side effects and a small, well-defined contract.

**The service-program procedure interface** (illustrative -- adapt field lengths and naming to your own shop's conventions):

```rpgle
dcl-pr GetCustomerCredit extpgm;
  custNumber    zoned(7:0) const;
  custInfo      likeds(CustCreditInfo_t);
end-pr;

dcl-ds CustCreditInfo_t qualified template;
  found         ind;
  custName      varchar(50);
  creditLimit   packed(9:2);
  balanceDue    packed(9:2);
  statusCode    char(4);
  statusMessage varchar(100);
end-ds;
```

`GetCustomerCredit` takes one input parameter -- the customer number -- and returns a single output data structure. Notice there's no ambiguity about success or failure: `found` and `statusCode`/`statusMessage` are always populated, whether or not the lookup succeeded, so the caller never has to infer failure from an empty result.

**The procedure body** (trimmed to the parts relevant to interface design; the actual Db2 for i access is a normal embedded-SQL `SELECT INTO`):

```rpgle
dcl-proc GetCustomerCredit export;
  dcl-pi *n extpgm;
    custNumber zoned(7:0) const;
    custInfo   likeds(CustCreditInfo_t);
  end-pi;

  custInfo.found := *off;
  custInfo.statusCode := '0000';
  custInfo.statusMessage := '';

  if custNumber <= 0;
    custInfo.statusCode := '4001';
    custInfo.statusMessage := 'customerNumber must be a positive value.';
    return;
  endif;

  exec sql
    select cust_name, credit_limit, balance_due
      into :custInfo.custName, :custInfo.creditLimit, :custInfo.balanceDue
      from custapi.customer
      where cust_id = :custNumber;

  if sqlcode = 0;
    custInfo.found := *on;
  elseif sqlcode = 100;
    custInfo.statusCode := '4041';
    custInfo.statusMessage := 'No customer found for the given customerNumber.';
  else;
    custInfo.statusCode := '5001';
    custInfo.statusMessage := 'Unable to complete the lookup. SQLCODE ' + %char(sqlcode);
  endif;

end-proc;
```

**The HTTP request**, once this procedure is deployed through IWS and mapped as a `GET` operation with `customerNumber` as a path parameter (the exact path IWS generates depends on how the service is mapped during deployment -- this is illustrative):

```
GET /CustomerAPI/customers/1024/credit HTTP/1.1
Host: iseries.example.com
Accept: application/json
Authorization: Basic <credentials>
```

**A representative success response**, with IWS marshaling the output data structure's subfields into JSON:

```json
{
  "found": true,
  "custName": "Acme Distribution",
  "creditLimit": 25000.00,
  "balanceDue": 4312.75,
  "statusCode": "0000",
  "statusMessage": ""
}
```

**A representative not-found response** -- still `HTTP 200` at the transport level in a default IWS mapping, since the program itself completed successfully; the deployment step in Section 8 covers mapping `statusCode` values like `4041` to a real `404` at the HTTP layer, which is what a well-behaved REST API should actually return:

```json
{
  "found": false,
  "custName": "",
  "creditLimit": 0.00,
  "balanceDue": 0.00,
  "statusCode": "4041",
  "statusMessage": "No customer found for the given customerNumber."
}
```

The mapping to notice: every RPG subfield became a JSON field with the same name and a JSON type appropriate to its RPG type (packed decimal to JSON number, character/varchar to JSON string, indicator to JSON boolean). That correspondence is exactly what the PCML generated at compile time describes to IWS -- it's why getting the interface design right in Section 6 pays off directly here, rather than in some separate mapping-configuration step you'd maintain by hand.

## 8. Deployment walkthrough

The deployment steps below describe the shape of the process using **IBM Web Administration for i**'s wizard-driven flow. Exact screen names, field labels, and wizard steps vary by IBM i release -- confirm the current flow against the IBM i documentation for your release (see References) rather than treating this as a literal script.

1. **Create or select a web services server.** If one doesn't already exist, the Web Administration for i GUI's server-creation wizard sets up an HTTP Server for i instance configured to run web services, bound to a port you choose. An existing server can host multiple services, so most shops create one server per environment (development, test, production) rather than one per service.
2. **Compile the target program or service program with PCML generation enabled**, so a `.pcml` file describing its parameter interface exists for IWS to read. This has to happen before deployment -- IWS deploys against the compiled object and its PCML, not against source.
3. **Run the web-service creation wizard against that program or service-program procedure.** You point it at the `*PGM` or `*SRVPGM` object (and, for a service program, the specific exported procedure), and it uses the PCML to build the parameter mapping automatically.
4. **Map the HTTP method, path, and parameter locations.** Decide which parameters come from the URL path, the query string, or the request body, and which HTTP verb (`GET`, `POST`, and so on) the operation responds to. For a read-only lookup like the worked example, `GET` with the identifier in the path is the conventional REST shape; for anything that changes data, use `POST`/`PUT`/`DELETE` as appropriate rather than `GET`.
5. **Configure the execution profile.** Decide what user profile the deployed service runs under (a dedicated service profile is the common production pattern -- see Section 9), and what library list it uses, since the calling job won't inherit either from the HTTP client.
6. **Activate the service** and confirm it shows as running in the Web Administration console.
7. **Test it.** A `GET`-based, read-only service can often be sanity-checked directly from a browser or a tool like `curl`/Postman before wiring up a real client, which is the fastest way to catch a marshaling mismatch (a field typed differently than the client expects, for instance) early.

Because this is a wizard-driven, GUI-heavy process, it doesn't lend itself to being fully scripted end-to-end the way, say, a CI/CD pipeline for application code would. For repeatable deployments across environments, the scripts under `/QIBM/ProdData/OS/WebServices/V1/server/bin` (`installWebService.sh` and related tooling) let you script the *deployment* of an already-configured service definition, which is worth investigating once you have more than a couple of services to keep in sync across development, test, and production.

## 9. Production concerns

Getting a service to respond correctly in a test call is the easy 80%. These are the concerns that separate a demo from something you'd trust with real traffic:

- **Authentication and authorization.** IWS services can be configured behind HTTP Basic Authentication or other HTTP Server authentication mechanisms; whatever you choose, don't ship a service reachable outside a trusted network without some form of it. Authentication proves who's calling; it doesn't by itself decide what they're allowed to do -- that's still enforced by IBM i object authority under the profile the service runs as.
- **TLS.** Any service handling real customer or business data needs HTTPS, which on IBM i means a certificate configured through Digital Certificate Manager and bound to the HTTP Server instance. Don't deploy a production data-handling service over plain HTTP.
- **Object and data authorities, and adopted-authority implications.** Decide deliberately whether the service runs under a dedicated service profile (recommended for most cases -- it keeps the authority footprint explicit and auditable) or adopts the authority of the program owner. Adopted authority can quietly grant a caller more access than intended if the underlying program was written assuming a trusted, interactive caller.
- **Library lists.** The web services server job's library list is not the caller's library list -- there is no caller-side IBM i session to inherit one from. Pin down the library list the service job uses explicitly as part of deployment, rather than discovering a `*LIBL` object-not-found error in production.
- **CCSIDs and character conversion.** JSON is UTF-8; your RPG program's character fields are in whatever CCSID the job runs under. Confirm the job's CCSID and the field-level CCSIDs are set up for correct conversion, especially for anything beyond plain ASCII text -- this is a common, quiet source of mangled characters in production that never shows up in a same-CCSID development test.
- **Packed decimals.** Packed and zoned decimal fields marshal to and from JSON numbers, but JSON has no native fixed-precision decimal type -- verify precision and rounding behavior end-to-end for anything involving money, not just for a couple of sample values.
- **Dates and timestamps.** Decide on one wire format (ISO 8601 is the conventional REST choice) and convert consistently at the interface boundary, rather than letting IBM i date/time formats leak into the JSON response as-is.
- **Null values and arrays.** Confirm how your IWS configuration represents a null/omitted value and a repeating structure (an RPG array) in JSON -- behavior here is configuration- and release-dependent, and assuming REST-typical conventions without checking is a common source of client-side surprises.
- **RPG errors and HTTP status mapping.** As the worked example showed, a default IWS mapping can return `HTTP 200` even when the underlying operation logically failed (not found, validation error). Map meaningful status codes explicitly (`404` for not found, `400` for validation errors, `500` for unexpected failures) as part of the service configuration wherever your IWS setup supports it, rather than leaving every outcome as `200` with a status field the client has to know to check.
- **Logging and troubleshooting.** HTTP Server access/error logs and the IWS server's own logs are your primary visibility into request failures; know where they are on your system before you need them under pressure, not after.
- **Performance.** A service that opens and closes files or SQL cursors on every call behaves differently under concurrent load than one that reuses an activation group efficiently. If the underlying program was written for occasional interactive use, load-test it under the concurrency pattern a real API actually sees before trusting it in production.
- **Activation groups and state.** Understand what activation group the deployed program or service program runs in, and confirm it doesn't accidentally retain state (open files, static variables) across calls in a way that leaks between unrelated requests.
- **Concurrency and commitment control.** If the operation writes data, decide on commitment control and isolation behavior deliberately -- concurrent REST calls hitting the same rows is a normal, expected case for a public API, not an edge case.
- **API versioning and backward compatibility.** Once external clients depend on a service's request/response shape, changing it is a breaking change for them. Plan for versioning (a version segment in the path, or a new service alongside the old one) before you need to make a breaking change under pressure.

## 10. When IWS is a good fit

IWS is a strong fit when you have existing, correct RPG business logic with (or capable of having) a clean interface, and you need to expose a small to moderate number of operations to external callers without a full rewrite -- the customer-credit-lookup shape of problem, generalized. It's also a reasonable fit for internal integrations between IBM i and other systems in your own environment, where the operational and security concerns in Section 9 are still real but the blast radius of getting something wrong is smaller.

It's a weaker fit when you need a large number of services with sophisticated routing, transformation, or orchestration logic in front of them (an API gateway or integration platform in front of IWS, or in front of a purpose-built services layer, often makes more sense at that scale); when the underlying logic is deeply interactive and would require substantial rework regardless of the exposure mechanism (at that point, compare the cost of that rework against writing a new service from scratch); or when you need protocol features IWS doesn't give you directly, like WebSockets, gRPC, or GraphQL, where a different integration approach is a better starting point than trying to bend IWS to fit.

## 11. Deployment-readiness checklist

- [ ] The target program or service-program procedure has a clean, validated, stateless interface with no interactive (display-file, `*IN`-indicator) dependencies
- [ ] PCML has been generated at compile time and matches the current parameter interface
- [ ] The service is deployed and tested behind HTTPS, with a valid certificate configured through DCM
- [ ] The service runs under a deliberately chosen user profile with a confirmed, explicit library list
- [ ] Object and data authorities have been reviewed, including any adopted-authority implications
- [ ] CCSID/character conversion, packed-decimal precision, and date/timestamp formats have been verified end-to-end, not just spot-checked
- [ ] Error conditions return structured, meaningful output, mapped to appropriate HTTP status codes wherever the IWS configuration supports it
- [ ] The service has been exercised under realistic concurrent load, not just single-call testing
- [ ] Logging locations (HTTP Server and IWS server logs) are known and accessible to whoever will support this in production
- [ ] A versioning approach is agreed on before the first external client takes a dependency on the current request/response shape

## 12. References and further reading

- [Integrated Web Services for i](https://www.ibm.com/docs/en/i/7.4.0?topic=tasks-integrated-web-services-i) -- IBM i 7.4 Knowledge Center task documentation
- [Integrated Web Services for IBM i -- Web services made easy](https://www.ibm.com/support/pages/integrated-web-services-ibm-i-web-services-made-easy) -- IBM Support overview
- [Integrated Web Services for IBM i -- Frequently asked questions](https://www.ibm.com/support/pages/integrated-web-services-ibm-i-frequently-asked-questions) -- IBM Support FAQ covering common setup and deployment questions
- [Part 2: Building a REST service with integrated web services server for IBM i](https://developer.ibm.com/tutorials/i-rest-web-services-server2/) -- IBM Developer tutorial walking through a REST deployment
- [Example of Creating a Web Service from an RPGLE Service Program using the IWS Server Wizard](https://www.ibm.com/support/pages/example-creating-web-service-rpgle-service-program-using-iws-server-wizard) -- IBM Support worked example of the wizard flow

This article is independently written for iRPGenie and is not affiliated with or endorsed by IBM. Confirm release-specific details (PTF levels, wizard steps, supported mapping options) against the current IBM i documentation for your own system before deploying to production.
