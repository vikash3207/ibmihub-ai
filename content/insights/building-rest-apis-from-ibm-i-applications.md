Many IBM i applications contain decades of reliable business logic: pricing rules, order processing, inventory checks, credit validation, accounting, and other capabilities that newer applications need.

A REST API lets a web application, mobile application, cloud service, partner system, or workflow platform use those capabilities without knowing how to call an RPG program or access a Db2 for i table directly.

The goal is not simply to place HTTP in front of an old program. A good API creates a stable, secure contract around a carefully selected business capability.

> **Note:** Preserve trusted IBM i business logic, but expose it through an intentional service boundary — not through unrestricted database access or a direct one-to-one copy of a 5250 workflow.

> **Note:** This article is about *exposing* IBM i business logic as a REST API — the server side of the conversation. If you instead need RPG to *call* an external REST API (a payment processor, a shipping carrier, a partner system), see [Modernizing RPG Applications with SQL and APIs](/insights/modernizing-rpg-applications-with-sql-and-apis), which covers that direction. The two are complementary, not interchangeable: a program that calls out to another service and a service that other programs call into have different contracts, different failure modes, and different security responsibilities.

## What You Will Learn

By the end of this article, you will be able to:

- explain how REST requests reach RPG and Db2 for i;
- choose between an IWS ILE service, an IWS SQL service, and a custom API layer;
- design resource-oriented URIs and HTTP methods;
- prepare an RPG program for deployment through Integrated Web Services (IWS);
- map inputs and outputs to a JSON API contract;
- test an endpoint with `curl`;
- handle errors, authority, transactions, and idempotency; and
- identify what must be added before an API is production-ready.

## REST in One Minute

A REST API uses HTTP to operate on resources. The URI identifies the resource, the HTTP method describes the intended action, and JSON commonly carries request or response data.

| HTTP method | Typical meaning | Example |
|---|---|---|
| `GET` | Read a resource | `GET /api/v1/orders/10025` |
| `POST` | Create a resource or start an operation | `POST /api/v1/orders` |
| `PUT` | Replace or fully update a known resource | `PUT /api/v1/orders/10025` |
| `PATCH` | Partially update a resource | `PATCH /api/v1/orders/10025` |
| `DELETE` | Remove a resource | `DELETE /api/v1/orders/10025` |

HTTP methods are not interchangeable labels. For example, a `GET` request should retrieve data and should not secretly update an order or submit a batch job.

## Ways to Build an API on IBM i

IBM i supports more than one valid API architecture.

| Approach | Best fit | Main trade-off |
|---|---|---|
| IWS over an ILE program or service program | Existing RPG, COBOL, or C business logic | Fast enablement, but the callable interface must be designed carefully. |
| IWS over SQL statements | Focused, data-oriented CRUD operations | Very quick for suitable operations; complex business rules do not belong in scattered SQL mappings. |
| Custom API application on IBM i | Full control using Java, Node.js, Python, or an RPG HTTP framework | Greater flexibility, with more code and operational ownership. |
| External API or integration layer | Enterprise gateway, orchestration, OAuth, throttling, or multi-system composition | Adds another platform, but can keep policy and orchestration outside the core system. |

[[FIGURE:approach-comparison]]

The **IBM i Remote System Explorer (RSE) API** — the API layer used by tools such as the IBM i development extensions for VS Code and Merlin, and distinct from the similarly-named RSE API on z/OS — supplies REST APIs for development and system resources such as IFS files, QSYS objects, CL commands, database files, SQL statements, and jobs. It is a development and tooling interface, not a replacement for designing a business API such as `CreateOrder` or `CheckCredit`.

For a team beginning with RPG assets, IWS is often the shortest supported path. IBM describes the IWS server as the integrated runtime used to externalize ILE business logic as services or APIs. IWS can expose programs, service-program procedures, and supported SQL statements.

## Running Example: Order Inquiry

We will design a small order API around this resource:

```text
GET /api/v1/orders/{orderId}
```

A successful response should have a stable JSON contract:

```json
{
  "orderId": 10025,
  "customerName": "Northwind Stores",
  "status": "READY",
  "totalAmount": 742.50,
  "currency": "USD"
}
```

The API contract deliberately uses readable external names. It does not expose an RPG data structure, record-format name, library list, job details, or physical-file implementation.

### Resource Contract

| Operation | Method and URI | Success | Common failure |
|---|---|---|---|
| List orders | `GET /api/v1/orders?limit=25` | `200 OK` | `400 Bad Request` |
| Get one order | `GET /api/v1/orders/{orderId}` | `200 OK` | `404 Not Found` |
| Create an order | `POST /api/v1/orders` | `201 Created` | `400` or `409 Conflict` |
| Update an order | `PUT /api/v1/orders/{orderId}` | `200 OK` | `404` or `409` |
| Cancel an order | `POST /api/v1/orders/{orderId}/cancellation` | `202 Accepted` or `200 OK` | `409 Conflict` |

Notice the final operation. Cancellation is a business action with rules; it is not necessarily the same as deleting an order row.

## Step 1: Create a Small Demonstration Table

The following Db2 for i table keeps the tutorial self-contained. Use a development library and substitute your own schema name.

```sql
CREATE TABLE MYLIB.API_ORDERS (
    ORDER_ID       DECIMAL(9, 0)  NOT NULL,
    CUSTOMER_NAME  VARCHAR(100)   NOT NULL,
    STATUS         VARCHAR(20)    NOT NULL,
    TOTAL_AMOUNT   DECIMAL(11, 2) NOT NULL DEFAULT 0,
    CURRENCY       CHAR(3)        NOT NULL DEFAULT 'USD',
    UPDATED_AT     TIMESTAMP      GENERATED ALWAYS
                                  FOR EACH ROW ON UPDATE
                                  AS ROW CHANGE TIMESTAMP NOT NULL,
    PRIMARY KEY (ORDER_ID)
);

INSERT INTO MYLIB.API_ORDERS
       (ORDER_ID, CUSTOMER_NAME, STATUS, TOTAL_AMOUNT, CURRENCY)
VALUES (10025, 'Northwind Stores', 'READY', 742.50, 'USD');

SELECT ORDER_ID,
       CUSTOMER_NAME,
       STATUS,
       TOTAL_AMOUNT,
       CURRENCY,
       UPDATED_AT
  FROM MYLIB.API_ORDERS
 WHERE ORDER_ID = 10025;
```

The final `SELECT` should return the seeded order. Run it before continuing so that table creation, data insertion, and library qualification are verified independently of the API. `UPDATED_AT` is a Db2 row-change timestamp: Db2 assigns it automatically when a row is inserted and refreshes it automatically whenever that row is updated, so it is never included in the column list of an `INSERT` or set directly by an `UPDATE`.

The table is only a learning aid. In a real application, the API should normally call the existing validation and transaction layer instead of bypassing it with direct table updates.

## Step 2: Create a Callable RPG Boundary

This SQLRPGLE program retrieves one order. It has a small interface designed for service use rather than display-file interaction.

```rpg
**free
ctl-opt dftactgrp(*no)
        actgrp('ORDERAPI')
        option(*srcstmt : *nodebugio)
        pgminfo(*pcml : *module : *v7);

dcl-pi *n;
   inOrderId       packed(9 : 0) const;
   outFound        char(1);
   outCustomerName varchar(100);
   outStatus       varchar(20);
   outTotalAmount  packed(11 : 2);
   outCurrency     char(3);
   outMessage      varchar(256);
end-pi;

dcl-s sqlMessage varchar(32740);

clear outFound;
clear outCustomerName;
clear outStatus;
clear outTotalAmount;
clear outCurrency;
clear outMessage;
clear sqlMessage;

exec sql
   SELECT CUSTOMER_NAME,
          STATUS,
          TOTAL_AMOUNT,
          CURRENCY
     INTO :outCustomerName,
          :outStatus,
          :outTotalAmount,
          :outCurrency
     FROM MYLIB.API_ORDERS
    WHERE ORDER_ID = :inOrderId;

select;
when sqlcod = 0;
   outFound = 'Y';

when sqlcod = 100;
   outFound = 'N';
   outMessage = 'Order not found';

other;
   outFound = 'E';
   exec sql
      GET DIAGNOSTICS CONDITION 1
          :sqlMessage = MESSAGE_TEXT;
   outMessage = 'Unable to retrieve order';
   // Send sqlMessage to an approved internal application logger.
endsl;

*inlr = *on;
return;
```

Compile it as an SQL RPG program:

```cl
CRTSQLRPGI OBJ(MYLIB/GETORDER) SRCFILE(MYLIB/QRPGLESRC) SRCMBR(GETORDER) COMMIT(*NONE) DBGVIEW(*SOURCE)
```

### Why `PGMINFO(*PCML : *MODULE : *V7)` Matters

Program Call Markup Language (PCML) describes the callable program interface: parameter names, types, lengths, and structure. `PGMINFO(*PCML : *MODULE)` embeds that PCML description directly into the compiled module, so IWS has metadata it can read when deploying the program — you do not have to hand-author a separate `.pcml` file to get started. The `*V7` option asks for PCML version 7.0, needed for the compiler to describe varying-length (`VARCHAR`) parameters correctly; this interface uses several, so it belongs on every `PGMINFO` here, not only when a problem appears.

In this interface:

- `inOrderId` is input because it is declared `CONST`;
- the other parameters carry response data;
- `outFound` distinguishes success, not-found, and unexpected-error outcomes; and
- SQL implementation details remain inside the RPG program.

`MESSAGE_TEXT` from `GET DIAGNOSTICS` can be longer than the public 256-character response field. The program therefore retrieves it into a correctly sized internal variable and returns a stable, sanitized message to the API caller. In production, record the diagnostic through an approved internal logger, with sensitive values redacted, rather than exposing database details in the response.

Depending on the IWS level and deployment configuration, parameter usage can also be refined in the deployment mapping. Test the generated request and response contract rather than assuming every RPG declaration will produce the desired public JSON automatically.

> **Best practice:** Prefer an exported procedure in a service program when the capability will be reused by several callers. A small wrapper program is also valid when it delegates to an existing service program or application procedure.

## Step 3: Deploy Through Integrated Web Services

The exact Web Administration panels vary by IBM i release, IWS generation, and HTTP Group PTF level. The durable deployment flow is:

1. Verify the required IBM i options, Java level, and current HTTP and Java Group PTFs.
2. Create or select an Integrated Web Services server in Web Administration for i.
3. Choose **Deploy New Service**, select REST, and choose an ILE program or service program as the implementation.
4. Select `MYLIB/GETORDER` and the callable operation represented by its embedded PCML.
5. Define the URI template and HTTP method.
6. Map the path variable to `inOrderId` and response fields to the output parameters.
7. Configure the service runtime identity and confirm its authority to the program, library, and database objects.
8. Enable HTTPS and the required authentication policy.
9. Deploy, start, and test the service in a non-production environment.

An illustrative mapping is:

| REST element | RPG element |
|---|---|
| `GET` | Order inquiry operation |
| `/api/v1/orders/{orderId}` | URI template |
| `orderId` path value | `inOrderId` |
| `customerName` | `outCustomerName` |
| `status` | `outStatus` |
| `totalAmount` | `outTotalAmount` |
| `currency` | `outCurrency` |
| Error decision | `outFound` and `outMessage` |

The public names do not have to reproduce the RPG parameter names. Treat the public contract as a separate design that can remain stable even if the implementation changes.

### IWS 2.6 and IWS 3.0

IWS 2.6 is the long-established generation, built on Java EE, still in use on many systems today. IWS 3.0 is IBM's newer, Jakarta EE-based generation: it requires Java 17 or later on the system, and enables an OpenAPI description UI by default — capabilities IWS 2.6 does not have. IWS 3.0 is available starting with IBM i 7.4 (HTTP Group PTF SF99662 level 47 or later), 7.5 (SF99952 level 25 or later), and 7.6 (SF99962 level 6 or later); confirm the current minimum level for your target release before planning, since IBM continues to ship updates. IBM has also indicated that a future IBM i release will remove the ability to create new IWS 2.6 servers, so existing IWS 2.6 deployments should have a migration path in mind even if there is no immediate need to move.

Do not upgrade a production server only because a tutorial mentions the newer generation. Follow IBM's current prerequisites, save-and-update guidance, and regression-test deployed APIs and payloads on the target partition before adopting a newer IWS generation.

## What Happens During a Request?

[[FIGURE:request-lifecycle]]

This separation is important:

- HTTP and JSON belong to the API boundary.
- Business validation belongs in the service layer.
- Data access belongs in a controlled program or SQL layer.
- Authentication, transport security, and traffic policy belong at IWS and/or an API gateway.

## Step 4: Test the GET Endpoint

Substitute the host, port, and deployed context path from your IWS server.

```bash
curl --request GET \
  --url 'https://ibmi.example.com:9443/api/v1/orders/10025' \
  --header 'Accept: application/json'
```

If the endpoint uses HTTP Basic authentication during development, use your approved credential-handling method rather than placing credentials in scripts, shell history, screenshots, or source control.

A successful response should use `200 OK` and return the documented order representation. A missing order should become `404 Not Found`, not a successful response containing an RPG-oriented flag such as `"outFound":"N"`.

If the IWS mapping cannot express the exact error contract required by your organization, place a custom API layer or gateway in front of the ILE operation. Do not weaken the contract merely to match the first generated payload.

## Step 5: Design Consistent Errors

Clients need machine-readable errors. Avoid returning only a job-log message, an SQL code, or an HTML error page.

```json
{
  "code": "ORDER_NOT_FOUND",
  "message": "No order exists for the supplied orderId.",
  "correlationId": "7f3b83a1-4c2f-4eb7-b907-a46c835f29bf"
}
```

| Situation | Suitable status | Client meaning |
|---|---:|---|
| Valid read | `200` | Resource returned |
| Resource created | `201` | Creation completed |
| Accepted for later processing | `202` | Work is queued or asynchronous |
| Invalid input | `400` | Correct the request |
| Missing/invalid authentication | `401` | Authenticate correctly |
| Authenticated but not allowed | `403` | Caller lacks permission |
| Resource does not exist | `404` | Identifier was not found |
| State or duplicate conflict | `409` | Resolve business conflict |
| Unexpected server failure | `500` | Retry only according to policy; contact support if persistent |

Do not return sensitive internals such as library lists, SQL statements, source paths, stack traces, or complete job logs. Record detailed diagnostics on the server with the same correlation identifier returned to the client.

## Step 6: Add a Create Operation

A client could submit:

```http
POST /api/v1/orders
Content-Type: application/json
Idempotency-Key: a86ee540-5881-44d3-a8d8-0ac2f38594b9
```

```json
{
  "customerName": "Northwind Stores",
  "totalAmount": 315.75,
  "currency": "USD"
}
```

The implementation should:

1. validate required fields and permitted values;
2. authorize the caller for order creation;
3. assign or validate the order identifier;
4. execute the complete business transaction under commitment control;
5. store or recognize the idempotency key when duplicate submission is possible; and
6. return `201 Created` with the new resource identifier.

Never allow a retry after a timeout to create a second order accidentally. An idempotency strategy or a unique business request identifier makes repeated submissions safe.

## SQL-First Alternative with IWS

For simple data-oriented APIs, IWS can deploy SQL statements and bind parameter markers to REST inputs. For example, the core query for the GET operation could be:

```sql
SELECT ORDER_ID      AS "orderId",
       CUSTOMER_NAME AS "customerName",
       STATUS        AS "status",
       TOTAL_AMOUNT  AS "totalAmount",
       CURRENCY      AS "currency"
  FROM MYLIB.API_ORDERS
 WHERE ORDER_ID = ?;
```

An insert operation could use:

```sql
INSERT INTO MYLIB.API_ORDERS
       (ORDER_ID, CUSTOMER_NAME, STATUS, TOTAL_AMOUNT, CURRENCY)
VALUES (?, ?, 'NEW', ?, ?);
```

The deployment definition associates the `?` parameter markers with path or request values. Double-quoted column aliases (`AS "orderId"`) are valid, case-preserving Db2 for i syntax, but whether IWS carries that exact casing straight through into the JSON response depends on the IWS generation and deployment mapping — verify the generated payload rather than assuming it. If you need guaranteed control over JSON key names and shape, build the JSON explicitly with `JSON_OBJECT` instead of relying on column aliasing. The runtime profile still requires authority to the referenced schema and table.

SQL-based endpoints are useful for controlled queries and straightforward CRUD. Use an RPG service program or another service layer when an operation includes existing business rules, multiple tables, calls to other programs, complex authorization, commitment control, or side effects.

## Security Is Part of the API Design

[[FIGURE:security-layers]]

### Use HTTPS

Protect all credentials and business data with TLS. Configure certificates using IBM i Digital Certificate Manager and use supported TLS levels. Do not expose a production API over plain HTTP.

### Authenticate and Authorize

Authentication establishes who the caller is; authorization determines what that caller may do. An authenticated customer-service application may be allowed to read an order but not change financial status fields.

IWS supports server security capabilities, while an enterprise API gateway can add policies such as OAuth token validation, rate limiting, centralized audit, and threat protection. Choose the pattern that matches your organization's architecture.

### Apply Least Privilege

The runtime profile should have only the object and data authorities the service needs. Avoid using a highly privileged development profile or relying on an uncontrolled library list.

### Validate at the Boundary

Validate identifiers, lengths, decimal ranges, enumerated values, and cross-field rules. Parameterized SQL protects the data-access statement, but it does not replace business validation.

### Control Browser Access

CORS is a browser policy, not an authentication mechanism. Enable only the origins, methods, and headers genuinely required by browser clients.

## Transactions and Job State

IBM i programs were often designed around a long-running interactive job. REST requests are independent and may execute in different server jobs.

Avoid depending on:

- a prior request's library-list change;
- local data areas that hold user conversation state;
- open cursors retained from an earlier request;
- QTEMP content created by another request; or
- activation-group state that assumes one dedicated interactive user.

Each request should establish the context it needs. For update operations, define the commitment boundary explicitly and ensure every success or failure path performs the appropriate commit or rollback.

## Versioning, Pagination, and Compatibility

Use a versioning policy before consumers depend on the service. A URI such as `/api/v1/orders` is simple and visible, although header-based versioning is also possible.

Adding an optional JSON field is usually easier for clients to tolerate than renaming or changing the type of an existing field. Treat field removal, meaning changes, and new mandatory request fields as breaking changes.

Collection endpoints should be bounded:

```text
GET /api/v1/orders?limit=25&afterOrderId=10025
```

Use a validated maximum limit and a stable continuation strategy. Do not return every order because the first test library contains only a few rows.

## Testing Checklist

Test more than the happy path.

| Test | Expected evidence |
|---|---|
| Known order | `200` and contract-valid JSON |
| Unknown order | `404` and stable error code |
| Non-numeric or oversized ID | `400`, without calling unsafe logic |
| Missing credentials | `401` |
| Insufficient authority | `403` or organization-approved equivalent |
| Duplicate create request | One business transaction, not two |
| Db2 or RPG failure | Sanitized `500`; detailed correlated server log |
| Concurrent update | Defined locking or optimistic-concurrency result |
| Slow dependency | Enforced timeout and measured response |
| Existing consumer after deployment | No unintended contract regression |

Test the OpenAPI description when available, but also test the live implementation. A correct description does not prove that authorization, transaction handling, or RPG behavior is correct.

## Observability and Operations

Before production, establish:

- access logging that captures method, path, status, duration, and caller identity where appropriate;
- correlation identifiers across the gateway, IWS, RPG job, and application log;
- metrics for request rate, latency, errors, and saturation;
- alert thresholds that do not expose request secrets;
- a way to locate the serving job and its job log; and
- a rollback or service-version strategy.

Current IWS service levels provide capabilities such as HTTP access logging, message logging, JSON logging, CORS configuration, and HSTS support (available starting IBM i 7.3). Exact availability depends on release and PTF level, so verify the target partition.

## Common Mistakes

- Turning every RPG program parameter into a public JSON field.
- Designing URIs around program names, such as `/callpgm/ORD100R`.
- Allowing `GET` requests to change data.
- Giving the service profile excessive authority.
- Returning `200 OK` for every business and technical failure.
- Exposing raw SQL messages, job-log details, or stack traces.
- Letting API clients update tables while bypassing established business rules.
- Depending on QTEMP or job state created by an earlier request.
- Returning an unbounded result set.
- Publishing directly to the internet without TLS, authentication, traffic controls, and monitoring.
- Treating CORS as security.
- Changing JSON fields without considering existing consumers.

## Choosing the Right Implementation

| Requirement | Strong starting choice |
|---|---|
| Reuse a stable RPG procedure | IWS over an ILE service program |
| Expose a small controlled query | IWS over SQL |
| Precisely control JSON, headers, middleware, and HTTP behavior | Custom API application |
| Apply enterprise OAuth, quotas, analytics, and external exposure | API gateway plus an IBM i service |
| Orchestrate IBM i with several other platforms | External integration or API layer |

A hybrid is common: IWS exposes a narrow internal capability, while an API gateway supplies the external hostname, token validation, throttling, analytics, and consumer-facing lifecycle.

## Final Perspective

Building a REST API from an IBM i application does not require rewriting the application.

Begin with one valuable, well-understood capability. Separate its business logic from screen and job assumptions, give it a clean callable interface, design the HTTP contract independently, and expose it through the implementation approach that fits the requirement.

For an initial project, a read-only order, customer, inventory, or pricing inquiry is safer than a complex financial update. Once the team has proven security, error handling, monitoring, and deployment, expand to transactional operations with explicit commitment and idempotency controls.

The result is not merely an RPG program reachable through HTTP. It is a governed business capability that IBM i can provide to the rest of the enterprise.

## Check Your Understanding

1. What is the difference between an API resource and an RPG program?
2. Why should a `GET` operation avoid changing application data?
3. What information does PCML provide to IWS?
4. When is an IWS SQL service more suitable than an ILE service?
5. Why should a missing order return `404` instead of `200` with an RPG flag?
6. Why can QTEMP and prior job state be unsafe assumptions for REST requests?
7. What problem does an idempotency key solve?
8. Why is CORS not a replacement for authentication?
9. Which details should be logged internally but not returned to a client?
10. When does an API gateway add value in front of IWS?

## Try It Yourself

Build a read-only customer inquiry API:

1. define `GET /api/v1/customers/{customerId}`;
2. document its `200`, `400`, `404`, and `500` responses;
3. create a small SQLRPGLE program or service-program procedure with PCML;
4. deploy it through an IWS development server;
5. test valid, missing, malformed, and unauthorized requests; and
6. verify that client responses contain no job, library, or SQL implementation details.

---

### Sources and further reading

The technical claims in this article — including PCML's role, `CRTSQLRPGI` and `GET DIAGNOSTICS` syntax, Db2 for i row-change timestamp behavior, and IWS generation/version details — were checked against IBM's official documentation and support pages before publishing.

- [IBM: Integrated Web Services for IBM i](https://www.ibm.com/support/pages/integrated-web-services-ibm-i-web-services-made-easy)
- [IBM: Integrated Web Services technology updates](https://www.ibm.com/support/pages/welcome-integrated-web-services-ibm-i-technology-updates)
- [IBM: Introducing IWS 3.0](https://www.ibm.com/support/pages/introducing-iws-30)
- [IBM: Building a REST service with IWS — Part 1](https://www.ibm.com/support/pages/system/files/inline-files/IWS-Building-REST-Service-Part-1-1.pdf)
- [IBM: Building a REST service with IWS — Part 3](https://www.ibm.com/support/pages/system/files/inline-files/IWS-Building-REST-Service-Part-3_0.pdf)
- [IBM: Creating REST APIs based on SQL statements](https://www.ibm.com/support/pages/system/files/inline-files/IWS-REST-Based-On-SQL.pdf)
- [IBM: Create Bound RPG Program and PCML](https://www.ibm.com/docs/en/i/7.5.0?topic=c-create-bound-rpg-program)
- [IBM: GET DIAGNOSTICS](https://www.ibm.com/docs/en/i/7.5.0?topic=statements-get-diagnostics)
- [IBM: Creating a row change timestamp column](https://www.ibm.com/docs/en/ssw_ibm_i_latest/sqlp/rbafysqlprcts.htm)

Service availability, deployment panels, supported mappings, security features, OpenAPI support, and logging options depend on the IBM i release and installed HTTP and Java Group PTF levels. Validate the RPG interface and generated API contract on the target partition before production deployment.
