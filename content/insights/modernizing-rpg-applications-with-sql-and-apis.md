IBM i applications often contain decades of business knowledge: pricing rules, inventory checks, credit validation, order processing, accounting logic, and countless exceptions learned through real operational experience. That logic is valuable. Modernization should make it easier to use, change, test, and integrate — not discard it simply because the application began on a green screen.

The most practical path is usually incremental:

1. Keep trusted business rules on IBM i.
2. Simplify data access with Db2 for i SQL.
3. Separate reusable logic from display and job-control code.
4. Exchange data using JSON.
5. Expose or consume services through secure APIs.

This approach lets teams modernize one business capability at a time while existing applications continue to run.

> **Note:** Modernization is not defined by the age of the RPG code. It is defined by how easily a business capability can be understood, reused, tested, secured, and connected to other systems.

## What You Will Learn

By the end of this article, you will be able to explain:

- where SQL adds the most value in an RPG application;
- how to separate business logic into reusable RPG procedures;
- how Db2 for i can generate and parse JSON;
- how RPG can call an external REST API; and
- how existing RPG logic can be exposed as a service without a wholesale rewrite.

## The Problem with the Traditional Application Shape

Many long-running RPG applications combine several responsibilities in one program:

- display-file handling;
- record-level database access;
- business validation;
- calculations and updates;
- calls to other programs; and
- user-facing messages.

This design may work reliably, but it creates friction when a web application, mobile application, partner system, or cloud service needs the same capability. Reusing the logic can mean copying it, simulating a 5250 workflow, or adding yet another tightly coupled program call.

A more flexible design separates the application into layers.

[[FIGURE:layered-architecture]]

The 5250 application can remain a consumer of the same business service used by an API. The interface changes; the core rules do not have to be rewritten.

## What SQL Adds to RPG

RPG record-level access remains efficient and appropriate in many programs, especially for a known-key lookup or a simple sequential process. SQL is not automatically better for every operation. Its greatest value appears when the application needs to join, filter, aggregate, transform, or update sets of data.

SQL can help reduce:

- nested read loops;
- repeated calls to retrieve related records;
- manually maintained work files;
- duplicated selection logic; and
- procedural code that describes *how* to navigate data rather than *what result* is required.

Use the access style that best matches the operation:

| Situation | Usually a good starting choice | Why |
|---|---|---|
| One row by a complete known key | Record-level access or SQL | Both can be clear and efficient; consistency with the surrounding code matters. |
| Join data from several tables | SQL | The relationship and selection rules remain visible in one statement. |
| Aggregate, rank, group, or transform many rows | SQL | Set-based operations avoid procedural read-and-accumulate loops. |
| Process records in a strict arrival sequence with existing native logic | Record-level access may remain appropriate | The procedural flow may already express the requirement clearly. |
| Provide a stable data model to several consumers | SQL view or table function | Consumers reuse one definition instead of duplicating joins and filters. |

### Example: Replacing Data-Navigation Logic with Intent

A traditional order enquiry may read an order header, loop through its detail records, chain to the item file, calculate totals, and apply additional conditions inside RPG. SQL can express that relationship as a single request:

```sql
SELECT h.order_id,
       h.customer_id,
       h.order_date,
       SUM(d.quantity * d.unit_price) AS order_total,
       COUNT(*)                       AS line_count
  FROM appdata.orders AS h
  JOIN appdata.order_lines AS d
    ON d.order_id = h.order_id
 WHERE h.order_id = :orderId
 GROUP BY h.order_id,
          h.customer_id,
          h.order_date;
```

Db2 for i determines the access plan. The RPG program focuses on business behavior instead of database navigation.

### Embedded SQL in Modern RPG

SQL fits naturally inside fully free-form RPG:

```rpgle
**free
ctl-opt dftactgrp(*no) option(*srcstmt : *nodebugio);

dcl-s customerId     packed(9 : 0) inz(100245);
dcl-s customerName   varchar(100);
dcl-s creditLimit    packed(11 : 2);
dcl-s customerStatus char(1);

// This read-only example does not use commitment control.
exec sql
   set option commit = *none,
              closqlcsr = *endmod;

exec sql
   select customer_name,
          credit_limit,
          status
     into :customerName,
          :creditLimit,
          :customerStatus
     from appdata.customers
    where customer_id = :customerId;

if SQLSTATE = '00000';
   // Continue with the business process.
elseif SQLSTATE = '02000';
   // Customer was not found.
else;
   // Capture diagnostics and handle the database error.
endif;

*inlr = *on;
```

This does not merely shorten the code. It makes the program's intent easier to see and gives the database optimizer responsibility for choosing an efficient access path.

Because the source contains embedded SQL, build it with the SQL ILE RPG precompiler — for example, with `CRTSQLRPGI` or an equivalent build action in the team's toolchain. The RPG precompiler automatically provides the SQL communication area, including `SQLSTATE` and `SQLCODE`.

> **Commitment-control note:** `COMMIT = *NONE` is appropriate only for the read-only demonstration above. For related production updates, choose a deliberate isolation level, journal the participating tables, and define where `COMMIT` or `ROLLBACK` occurs.

## Move Business Logic Behind a Stable Interface

Changing file access to SQL is useful, but a program is not truly easier to integrate if its rules are still tied to a workstation display or batch job.

The next step is to extract a business capability into a procedure or service program. For example:

```rpgle
dcl-pr calculateOrderTotal packed(13 : 2);
   orderId packed(9 : 0) const;
end-pr;
```

The procedure should accept business inputs and return a clear result or error structure. It should not depend on display-file indicators, interactive messages, or assumptions about a particular job.

A useful service boundary might look like this:

| Concern | Recommended location |
|---|---|
| Screen fields and indicators | 5250 or web presentation layer |
| Business validation and calculations | RPG business service |
| Joins, filtering, aggregation, persistence | SQL data-access layer |
| JSON and HTTP mapping | Integration/API layer |
| Authentication, authorization, throttling | API platform or gateway |

Once this boundary exists, the original 5250 program can call it. A REST service can call it too. That is modernization through reuse rather than duplication.

## Use SQL to Create and Read JSON

REST APIs commonly exchange JSON. Db2 for i provides SQL functions that allow RPG applications to generate and parse JSON without manually concatenating strings or scanning payloads character by character.

### Generate an API Response

The following query creates one order document with an array of line items:

```sql
SELECT JSON_OBJECT(
         'orderId' VALUE h.order_id,
         'customerId' VALUE h.customer_id,
         'status' VALUE TRIM(h.status),
         'lines' VALUE JSON_ARRAYAGG(
           JSON_OBJECT(
             'item' VALUE TRIM(d.item_number),
             'quantity' VALUE d.quantity,
             'unitPrice' VALUE d.unit_price
           ) ORDER BY d.line_number
         )
       ) AS order_json
  FROM appdata.orders AS h
  JOIN appdata.order_lines AS d
    ON d.order_id = h.order_id
 WHERE h.order_id = :orderId
 GROUP BY h.order_id,
          h.customer_id,
          h.status;
```

This approach provides several advantages:

- values are escaped correctly by the JSON functions;
- the relationship between database columns and API fields is explicit;
- nested arrays can be produced in the database; and
- manual comma, quote, and delimiter handling is avoided.

The `ORDER BY` inside `JSON_ARRAYAGG` makes the line sequence deterministic. Without an explicit ordering rule, an SQL result has no guaranteed order. Directly nested JSON publishing functions retain their JSON format. If generated JSON passes through another expression or a subquery before being embedded, `FORMAT JSON` may be required so Db2 treats it as JSON instead of escaping it as an ordinary string.

### Parse an Incoming JSON Request

Use `JSON_TABLE` when several values must be extracted from a document:

```sql
SELECT request.order_id,
       request.requested_by,
       request.priority
  INTO :orderId,
       :requestedBy,
       :priority
  FROM JSON_TABLE(
         :requestBody,
         '$'
         COLUMNS (
           order_id     DECIMAL(9, 0) PATH '$.orderId',
           requested_by VARCHAR(50)   PATH '$.requestedBy',
           priority     VARCHAR(10)   PATH '$.priority'
         )
       ) AS request;
```

Parsing JSON is only the first step. The application must still validate required values, permitted ranges, user authority, and the current business state before changing data.

## Let RPG Consume External APIs

Modernization also works in the opposite direction. An RPG application may need to call a payment service, shipping provider, CRM, tax engine, address validator, or another internal API.

Db2 for i supplies HTTP functions in `QSYS2`, including GET, POST, PUT, PATCH, and DELETE variants. They can be called from SQL or embedded SQL. A simplified POST request looks like this:

```rpgle
dcl-s endpoint     varchar(500);
dcl-s requestBody  sqltype(CLOB : 65535);
dcl-s responseBody sqltype(CLOB : 1048576);
dcl-s responseHdr  sqltype(CLOB : 65535);
dcl-s httpOptions  varchar(2000);

endpoint = 'https://api.example.com/v1/shipments';

exec sql
   set :requestBody = JSON_OBJECT(
      'orderId' VALUE :orderId,
      'postalCode' VALUE TRIM(:postalCode),
      'weight' VALUE :shipmentWeight
   );

httpOptions = '{"header":"Content-Type,application/json",' +
              '"header":"Accept,application/json"}';

exec sql
   select response_message,
          response_http_header
     into :responseBody,
          :responseHdr
     from table(
       QSYS2.HTTP_POST_VERBOSE(
         :endpoint,
         :requestBody,
         :httpOptions
       )
     );
```

The verbose form returns one row containing the response body and response-header information. This is more useful during integration because the application can inspect the HTTP outcome instead of assuming that receiving a payload means the business request succeeded.

Repeating the `"header"` key like this looks like a mistake at first glance — a JSON object cannot normally hold two identical keys — but it is the documented convention this specific IBM i parameter expects: `httpOptions` is parsed by QSYS2's own lenient reader, not general-purpose JSON, and it recognizes each repeated `"header"` entry as one more header to add rather than treating the second as an overwrite of the first.

[[FIGURE:integration-sequence]]

The `QSYS2` HTTP functions require the IBM i licensed program 5770SS1, option 3 (Extended Base Directory Support) and option 34 (Digital Certificate Manager), along with appropriate release support and current PTFs. Confirm these prerequisites on the target partition before choosing this implementation.

In production, the integration needs more than a successful example call:

- use HTTPS and configure trusted certificates through Digital Certificate Manager;
- keep credentials and tokens outside source code;
- set and enforce appropriate connection and read timeouts;
- inspect the HTTP status, response headers, and response body;
- distinguish retryable failures from permanent business failures;
- prevent duplicate processing with an idempotency key or transaction identifier; and
- record enough diagnostic information to support operations without logging secrets.

An external API call also introduces latency and availability outside IBM i. Avoid holding database locks while waiting for a remote service unless the transaction design explicitly requires it.

## Expose Existing RPG Logic as a REST API

IBM i Integrated Web Services (IWS) can externalize ILE programs and exported service-program procedures as web services. Its REST API engine allows a modern client to invoke established RPG logic without rebuilding the business rules in another language. Available functions vary by IBM i release and HTTP group PTF level, so verify the target system before designing the contract.

Consider an order-pricing capability:

```text
POST /api/orders/price

Request
{
  "customerId": 100245,
  "item": "AX-100",
  "quantity": 4
}

Response
{
  "unitPrice": 149.50,
  "extendedPrice": 598.00,
  "currency": "USD"
}
```

Behind this API, an exported RPG procedure can apply the same customer, contract, quantity-break, and effective-date rules already trusted by existing applications.

The high-level process is:

1. Refactor the capability into a program or exported service-program procedure with a clean parameter contract.
2. Remove dependencies on screens, interactive messages, and job-specific state.
3. Define request, response, and error mappings.
4. Map the external resource and HTTP method to the program or procedure, then deploy it through an IWS server.
5. Configure authentication, authorization, and TLS.
6. Test valid requests, invalid data, authority failures, timeouts, and duplicate submissions.

> **Best practice:** An API is a long-lived contract, not simply a new way to call a program. Field names, data types, error responses, compatibility, and versioning should be designed deliberately.

## Design Errors for API Consumers, Not Only RPG Developers

Traditional RPG programs may communicate failures through status codes, indicators, messages, or job-log entries. API consumers need predictable machine-readable responses.

A consistent error model might be:

```json
{
  "code": "CUSTOMER_ON_HOLD",
  "message": "The order cannot be released because the customer is on hold.",
  "correlationId": "8f37a9d2"
}
```

Internally, capture SQL diagnostics and technical details for support. Externally, return a stable business error code and a safe explanation. Do not expose SQL statements, library names, job information, stack traces, or credentials in the response.

For embedded SQL, handle success, no-data, warnings, and errors deliberately. `SQLSTATE` is generally more portable and descriptive than treating every non-zero `SQLCODE` in the same way. `GET DIAGNOSTICS` can provide additional detail when an SQL operation fails.

## Modernization Does Not Remove IBM i Strengths

SQL and APIs complement IBM i capabilities rather than replace them. Modernized applications can continue to benefit from:

- Db2 for i running in the same operating environment;
- commitment control and journaling;
- object-level security and adopted-authority controls;
- ILE programs and service programs;
- mature job management and operational tooling; and
- existing RPG business logic.

The goal is to make these capabilities accessible through clearer interfaces.

## A Safe Incremental Roadmap

None of this needs to be an all-at-once decision. The realistic path is incremental, and a team can comfortably stop at an early stage indefinitely if that's all a given system needs.

### Phase 1: Discover

- Identify a business capability with clear value and manageable scope.
- Trace its programs, files, data areas, calls, side effects, and authority requirements.
- Capture current behavior with representative test cases.
- Measure the baseline: response time, failure rate, maintenance effort, or manual steps.

### Phase 2: Separate

- Extract business rules from display and job-control logic.
- Introduce small procedures with explicit inputs and outputs.
- Place reusable procedures in service programs where appropriate.
- Preserve the existing interface while redirecting it to the new service.

### Phase 3: Simplify Data Access

- Replace suitable loops and repeated lookups with set-based SQL.
- Create views when they give a stable, meaningful data model.
- Use parameter markers or host variables rather than building SQL through string concatenation.
- Review access plans and create indexes based on measured workloads.

### Phase 4: Add the API Boundary

- Define the contract before deployment.
- Map JSON to typed business parameters.
- Add authentication, authorization, validation, timeouts, and logging.
- Use correlation IDs so a request can be traced across layers.

### Phase 5: Operate and Expand

- Run the old and new paths in parallel where practical.
- Compare results before moving critical traffic.
- Monitor performance, failures, and usage.
- Apply the pattern to the next business capability.

[[FIGURE:modernization-roadmap]]

## Common Mistakes to Avoid

### Rewriting Everything at Once

A large rewrite can lose hidden business rules and postpone value for years. Prefer a sequence of small, testable capabilities.

### Converting Every `CHAIN` into `SELECT`

Modernization is not a syntax contest. Retain record-level access where it remains clear and efficient; use SQL where relational and set-based processing offers a real advantage.

### Exposing a Large Program Directly

If a program mixes screens, updates, overrides, data-area state, and calls to many other programs, publishing it as an endpoint preserves the coupling. First create a clean business-service boundary.

### Treating HTTP 200 as the Only Success Criterion

A technically successful response may contain a business rejection. Validate the status, payload, required fields, and business outcome.

### Hard-Coding Secrets

Credentials, API keys, and tokens should not appear in RPG source, SQL scripts, or logs. Use protected configuration and give service identities only the authority they require.

### Ignoring Transaction Boundaries

Local database commitment control cannot automatically roll back a completed action in a remote system. Design compensating actions, retry behavior, and idempotency for multi-system workflows.

## One Capability, Modernized End to End

Suppose a legacy order-entry program calculates a customer-specific price while processing a display-file transaction. A safe modernization slice could be:

| Step | Change | Existing behavior preserved? |
|---|---|---|
| 1 | Capture pricing examples and edge cases as tests. | Yes — the current program remains unchanged. |
| 2 | Extract pricing rules into `calculatePrice()` in an RPG service program. | Yes — the 5250 program calls the new procedure. |
| 3 | Replace repeated item, customer, and contract lookups with one measured SQL query or view. | Yes — compare results against the captured cases. |
| 4 | Expose the procedure through an authenticated IWS REST endpoint. | Yes — the API and 5250 screen use the same rules. |
| 5 | Let a web order-entry page call the API and monitor both paths. | Yes — the old interface can remain available during rollout. |

This vertical slice delivers a usable modern interface while limiting risk to one understood capability. The same pattern can later be applied to availability checks, order creation, invoicing, or other services.

## Check Your Understanding

1. Why is replacing every record-level operation with SQL not a useful modernization goal?
2. What should be separated from RPG business logic before exposing it through an API?
3. When is `JSON_TABLE` preferable to extracting several values independently?
4. Why should an application avoid holding database locks during a remote API call?
5. What problem does idempotency solve in an API-driven workflow?
6. Which IBM i product options are prerequisites for the `QSYS2` HTTP functions?

## Try It Yourself

Take a small RPG enquiry program and redesign it in three layers:

1. an RPG procedure containing the business rules;
2. an SQL query that retrieves the required data; and
3. a JSON request and response contract suitable for a REST API.

## Final Perspective

An RPG application does not need to stop being RPG to become modern.

When business logic is separated into reusable services, SQL expresses data requirements clearly, JSON provides a common exchange format, and APIs create controlled access to capabilities, IBM i can participate naturally in a modern application architecture.

The most successful modernization programs protect what already works while steadily removing the barriers around it. Start with one valuable capability, give it a clean interface, prove the pattern, and expand from there.

---

### Sources and further reading

The technical claims in this article — including the `JSON_OBJECT`, `JSON_ARRAYAGG`, and `JSON_TABLE` syntax, and the QSYS2 HTTP functions' options and prerequisites — were verified against IBM's own documentation and support pages before publishing.

- [IBM: Coding SQL statements in ILE RPG applications](https://www.ibm.com/docs/en/i/7.6.0?topic=programming-coding-sql-statements-in-ile-rpg-applications)
- [IBM: Generating JSON data with Db2 for i SQL](https://www.ibm.com/docs/en/i/7.6.0?topic=data-generating-json)
- [IBM: JSON concepts and JSON_TABLE](https://www.ibm.com/docs/en/i/7.6.0?topic=data-json-concepts)
- [IBM: Db2 for i HTTP functions](https://www.ibm.com/docs/en/i/7.6.0?topic=programming-http-functions-overview)
- [IBM: Integrated Web Services for i](https://www.ibm.com/docs/en/i/7.6.0?topic=tasks-integrated-web-services-i)

Available features, package names, and configuration details evolve; verify current specifics against the official documentation before implementing.
