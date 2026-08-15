AI coding assistants can explain unfamiliar code, suggest focused changes, generate test ideas, improve documentation, and help translate older RPG patterns into modern RPG or SQL. That makes them especially interesting on IBM i, where an application may contain valuable business rules that are difficult to discover from source code alone.

But AI does not understand your production environment by default. It does not automatically know your library list, file overrides, job description, commitment-control boundaries, adopted authority, data-area conventions, calling sequence, or why a particular indicator exists.

The useful question is therefore not, "Can AI write RPG?" It is:

> **Note:** How can an RPG programmer use AI to reduce investigation and coding time while keeping every production decision under human control?

This article provides a repeatable answer.

## What You Will Learn

By the end of this article, you will be able to:

- identify RPG tasks that are well suited to AI assistance;
- provide enough IBM i context without disclosing sensitive information;
- structure prompts that produce smaller, reviewable changes;
- use AI to explain legacy RPG without treating its explanation as fact;
- review generated RPG and embedded SQL for IBM i-specific risks;
- build a practical test matrix from business rules;
- distinguish AI assistance from compilation, testing, and approval; and
- introduce AI into a team workflow with useful guardrails.

## AI Is a Pair Programmer, Not an IBM i Runtime

An AI assistant predicts a useful response from the context it receives. It can recognize language patterns and reason about code, but it does not prove that a program will compile or behave correctly on your partition.

Only the actual toolchain and environment can answer questions such as:

- Does this source compile at the target IBM i release and RPG PTF level?
- Does the program receive the expected library list and object overrides?
- Are the files journaled for the selected commitment-control level?
- Does the runtime user have authority to every called object?
- Will the change preserve record locks, decimal behavior, and message handling?
- Does the code still work with production data volumes and CCSIDs?

This division of responsibility is fundamental:

| AI can assist with | The IBM i environment must verify |
|---|---|
| Explain a procedure or data flow | Actual runtime behavior |
| Suggest a refactoring | Compilation and binding |
| Draft free-form RPG or SQL | Supported syntax and PTF level |
| Generate test cases | Test execution and observed results |
| Identify possible defects | Whether a defect is real in business context |
| Draft documentation | Accuracy approved by a knowledgeable developer |

[[FIGURE:development-lifecycle]]

The AI suggestion is one input to engineering. It is not evidence of correctness.

## Where AI Helps RPG Programmers Most

AI is most valuable when the task is bounded and the result can be checked.

| Use case | Useful AI contribution | Required human check |
|---|---|---|
| Understand an unfamiliar program | Summarize flow, subroutines, calls, files, and possible business rules | Compare with source, called objects, database definitions, and knowledgeable users |
| Modernize syntax | Draft a fixed-form-to-free-form conversion or replace older idioms | Confirm semantics, indicators, data types, operation extenders, and compile options |
| Refactor a large routine | Suggest smaller procedures and clearer names | Check parameter passing, state, activation-group behavior, and error paths |
| Work with embedded SQL | Draft a query or cursor pattern | Validate Db2 for i syntax, null handling, SQLSTATE/SQLCODE, access plan, locking, and commitment control |
| Diagnose a compiler message | Explain the message and propose likely fixes | Use the complete compile listing and confirm the exact failing statement |
| Create tests | Derive boundary, negative, and regression cases | Add missing business scenarios and execute them with controlled data |
| Document legacy code | Produce a first-pass technical description | Remove invented claims and verify every interface and dependency |

Avoid beginning with a production-wide instruction such as "modernize this application." Start with one program, one behavior, and one acceptance criterion.

## The Context Stack: What the Assistant Needs

A good prompt is not merely a longer prompt. It supplies the minimum reliable context required for the decision.

[[FIGURE:context-stack]]

### 1. Business goal

State observable behavior, not just the desired implementation.

Weak:

```text
Improve this RPG program.
```

Better:

```text
Add an eligibility check before an order is released. An order is eligible
only when its status is READY, its total is greater than zero, and the customer
is not on credit hold. Preserve every existing response code.
```

### 2. Platform constraints

Include only what matters, for example:

- target IBM i release and relevant PTF expectations;
- source type such as `RPGLE` or `SQLRPGLE`;
- fully free-form or fixed-form constraints;
- compile command and important options;
- whether commitment control is active;
- expected naming, error-handling, and logging conventions; and
- whether new service-program exports or database changes are allowed.

### 3. Relevant source

Share the smallest complete unit that preserves meaning: the procedure, its prototype, related data structures, and any constants or called interfaces it depends on. A random 30-line fragment may hide the initialization or error path that changes the answer.

### 4. Data contract

State exact data types, lengths, nullability, keys, status values, and decimal rules. Do not ask an assistant to infer a Db2 table from a few field names.

### 5. Validation method

Tell the assistant how the proposal will be checked:

```text
The change must compile with CRTSQLRPGI, preserve the current procedure
interface, and pass every documented test case. Do not change files outside
ORDERSVC.SQLRPGLE. Return a short plan and a minimal diff first.
```

Clear scope and acceptance criteria improve AI-assisted work because they give both the assistant and the reviewer an objective finish line.

## A Practical Running Example

Assume a service procedure calculates an order discount. The rule is intentionally small:

- negative order amounts are invalid;
- orders below 1,000 receive no discount;
- orders from 1,000 through 4,999.99 receive 5%; and
- orders of 5,000 or more receive 7.5%.

The current code is:

```rpg
**free
ctl-opt nomain
        option(*srcstmt : *nodebugio);

dcl-proc CalculateDiscount export;
   dcl-pi *n packed(11 : 2);
      orderAmount packed(11 : 2) const;
      validOrder  ind;
   end-pi;

   dcl-s discount packed(11 : 2) inz(0);

   validOrder = *on;

   if orderAmount < 0;
      validOrder = *off;
      return 0;
   elseif orderAmount >= 5000;
      discount = %dech(orderAmount * 0.075 : 11 : 2);
   elseif orderAmount >= 1000;
      discount = %dech(orderAmount * 0.05 : 11 : 2);
   endif;

   return discount;
end-proc;
```

`%DECH` converts the result to the declared packed-decimal precision using half-adjust (round-half-up) rounding — unlike `%DEC`, which truncates instead of rounding. That is a business-significant choice; an AI-generated replacement using `%DEC`, floating-point arithmetic, or a different scale could change monetary results.

For this stand-alone example, place the source in member `DISCOUNTS` and create a module and service program in a development library:

```cl
CRTRPGMOD MODULE(MYLIB/DISCOUNTS) SRCFILE(MYLIB/QRPGLESRC) SRCMBR(DISCOUNTS) DBGVIEW(*SOURCE)

CRTSRVPGM SRVPGM(MYLIB/DISCOUNTS) MODULE(MYLIB/DISCOUNTS) EXPORT(*ALL)
```

`EXPORT(*ALL)` keeps the exercise short. For a production service program, use binder language to control exports and manage signatures deliberately. A service-program signature represents the exported-symbol interface as a whole; it does **not** validate an individual procedure's parameter interface. If a bound procedure's parameters change incompatibly, a calling program that still binds successfully by signature can nonetheless call it incorrectly — calling modules must be recompiled and the programs or service programs containing them must be re-created.

After creating the service program, confirm that the expected procedure is exported:

```cl
DSPSRVPGM SRVPGM(MYLIB/DISCOUNTS) DETAIL(*PROCEXP)
```

Object creation and export inspection confirm the build structure; they do not execute the discount rules. A caller or test harness is still required to invoke `CalculateDiscount` for every row in the test matrix.

### Prompt 1: Ask for analysis before code

```text
Act as a reviewer of IBM i ILE RPG.

Goal: review the CalculateDiscount procedure below without changing it yet.
Target: fully free-form RPGLE on our supported IBM i release.

Rules:
- A negative amount is invalid.
- 0 through 999.99 receives 0%.
- 1000 through 4999.99 receives 5%.
- 5000 and above receives 7.5%.
- Monetary output must remain PACKED(11:2) with half-adjust rounding.
- The exported interface must not change.

Return:
1. a plain-language flow summary;
2. assumptions or ambiguities;
3. boundary test cases with expected results;
4. possible defects or maintainability concerns.

Do not generate replacement code yet.
```

This separates discovery from implementation. It lets the developer correct a misunderstood rule before accepting code.

### Prompt 2: Request one constrained change

Suppose the team decides that the percentages should be named constants and that the logic should remain otherwise unchanged:

```text
Now produce a minimal patch that replaces the two numeric rate literals with
named constants. Preserve the procedure name, parameters, return type, branch
boundaries, %DECH conversion, and all observable behavior. Do not introduce SQL,
external calls, new files, or a new procedure. Explain each changed line.
```

The constraints prevent an apparently helpful assistant from redesigning the interface or changing the rounding rule.

A suitably minimal result would add constants such as these near the procedure declarations:

```rpg
dcl-c StandardDiscountRate 0.05;
dcl-c HighDiscountRate     0.075;
```

and change only the two calculations:

```rpg
discount = %dech(orderAmount * HighDiscountRate : 11 : 2);

discount = %dech(orderAmount * StandardDiscountRate : 11 : 2);
```

The developer must still compare the complete diff, compile the module, and run the boundary cases. A plausible answer in the chat window is not the completion criterion.

### Expected test matrix

Before accepting any change, the developer should have explicit expected results:

| Case | `orderAmount` | Expected `validOrder` | Expected discount |
|---|---:|---|---:|
| Negative value | `-0.01` | `*OFF` | `0.00` |
| Zero | `0.00` | `*ON` | `0.00` |
| Below first boundary | `999.99` | `*ON` | `0.00` |
| First boundary | `1000.00` | `*ON` | `50.00` |
| Below second boundary | `4999.99` | `*ON` | `250.00` |
| Second boundary | `5000.00` | `*ON` | `375.00` |
| Rounding case | `1000.10` | `*ON` | `50.01` |

The rounding case matters: `1000.10 × 0.05 = 50.005`, which half-adjusts to `50.01` at two decimal places.

## Using AI to Understand Legacy RPG

Legacy analysis is a strong use case, but a summary must be treated as a hypothesis.

Ask the assistant to produce an evidence table:

```text
Explain this program using only evidence visible in the supplied source.
For each claimed business rule, cite the procedure, subroutine, or statement
that supports it. Put anything inferred from names or comments in a separate
"Unverified inference" section. List every external program, service program,
file, data area, data queue, command, and API reference you can identify.
Do not invent the contents of copy members or called programs.
```

Then investigate what source alone cannot reveal:

- `/COPY` and `/INCLUDE` members;
- externally described files and record formats;
- binder source and service-program signatures;
- command processing programs and overrides;
- trigger programs, constraints, and journal configuration;
- job descriptions, library lists, and environment variables;
- dynamic calls assembled at runtime; and
- behavior in programs further down the call chain.

An AI explanation becomes dependable only as its claims are reconciled with these artifacts.

## Using AI with Embedded SQL

SQL suggestions deserve the same scrutiny as RPG suggestions. A syntactically neat query may still return duplicates, mishandle nulls, scan a large table, wait on locks, or run under the wrong isolation level.

Consider a focused read:

```rpg
found = *off;
sqlFailed = *off;

exec sql
   SELECT STATUS,
          TOTAL_AMOUNT
     INTO :orderStatus,
          :orderTotal
     FROM MYLIB.API_ORDERS
    WHERE ORDER_ID = :orderId;

select;
when sqlcod = 0;
   found = *on;
when sqlcod = 100;
   found = *off;
other;
   sqlFailed = *on;
   // Invoke the application's approved SQL error handling.
endsl;
```

This is a review fragment rather than a stand-alone program; it assumes that the host variables and the two indicator flags have been declared. The RPG SQL precompiler automatically provides the SQL communication area, so `SQLCOD` is available without an explicit declaration. A result of `+100` means that no row satisfied the query. If a `SELECT INTO` produces more than one row, Db2 for i reports SQLCODE `-811`, so the error path must remain distinct from not-found handling.

Review at least these questions before accepting AI-generated embedded SQL:

1. **Cardinality:** Does the predicate guarantee at most one row? A `SELECT INTO` must match the intended result shape.
2. **Nullability:** Can a selected expression be null, and does the RPG host variable have an indicator variable where required?
3. **Types:** Do host-variable precision, scale, length, and CCSID match the data?
4. **Qualification:** Is `MYLIB` correct, or does the application intentionally use a naming convention and library list?
5. **Outcome handling:** Are success, no-data, warnings, and errors handled according to the application standard?
6. **Transactions:** Is the compile-time commitment-control option consistent with journaling and the surrounding unit of work?
7. **Concurrency:** Could the statement lock or overwrite data unexpectedly?
8. **Performance:** Are predicates indexable, appropriately selective, and tested with realistic volume?

Never let an assistant casually add `COMMIT` to "fix" a transaction problem. A `COMMIT` finalizes every pending change in the current unit of work — not just the statement the assistant is focused on — so it can prematurely finalize unrelated work performed earlier in the same job or connection. The transaction boundary must come from application design, not prompt convenience.

## The IBM i Review Checklist

Use this checklist on every AI-produced RPG or SQL change.

### Language and interface

- Does the code use syntax supported on the target release and RPG PTF level?
- Are prototypes, procedure interfaces, parameter directions, `CONST`, `VALUE`, `OPTIONS`, and return types preserved?
- Are packed and zoned decimal precision, scale, rounding, overflow, and truncation correct?
- Are character lengths, varying fields, CCSIDs, and blank-versus-empty behavior preserved?
- Are indicators intentionally set on every path?
- Could initialization or retained state differ across calls?

### IBM i runtime behavior

- Does the code assume an unverified library list, current library, override, or QTEMP object?
- Are activation group, static storage, open-data-path, and `*INLR` effects understood?
- Are called programs, service-program signatures, and binder source compatible?
- Are object, row, and adopted-authority requirements preserved?
- Could a long-running server job retain state that an interactive job would not?

### Database behavior

- Are tables and columns real and correctly qualified?
- Are nulls and no-row conditions handled?
- Are commitment control, journaling, isolation, locks, and rollback behavior correct?
- Can the query return more or fewer rows than assumed?
- Was the access plan examined with representative data?

### Operations and security

- Are credentials, customer data, source code, connection strings, and production messages excluded from unapproved AI services?
- Are diagnostic details logged internally rather than exposed to users?
- Can the change be traced to a requirement and reviewed as a normal source change?
- Is there a rollback plan?

## Protect Source Code and Business Data

Before placing code or operational information into any AI tool, follow your organization's approved data-handling policy and the tool's current enterprise settings. Never submit proprietary source, credentials, customer data, or production logs to an AI tool unless your organization and the specific AI environment you are using have explicitly approved that use.

Do not paste unapproved material such as:

- passwords, tokens, certificates, or private keys;
- customer, employee, payment, health, or other regulated data;
- production extracts, job logs, or message data containing identifiers;
- proprietary source beyond the scope approved for the tool; or
- internal host names, addresses, user profiles, or security configuration.

Redaction must preserve the structure needed for reasoning. Replace a customer number consistently with `CUSTOMER_ID`; do not replace every field with an unrelated value that destroys relationships.

| Original category | Safe contextual replacement |
|---|---|
| Production schema or library | `MYLIB` |
| Customer/account number | `CUSTOMER_ID` or a synthetic value |
| Employee or user profile | `APP_USER` |
| Host name or URL | `internal.example` |
| Credential | Remove completely; never substitute a realistic secret |

Enterprise agreements, retention controls, model-training policies, network boundaries, and audit capabilities differ by product and configuration. Confirm them with your security and legal teams instead of inferring them from a product name.

## A Repeatable Team Workflow

The following loop works whether the assistant is embedded in an IDE, accessed through chat, or used by an agent that can edit a repository.

1. **Scope:** Choose one behavior and define acceptance criteria.
2. **Supply context:** Include relevant interfaces, types, rules, and constraints — not the entire production estate.
3. **Question:** Ask for analysis, uncertainties, and a plan before requesting edits.
4. **Minimal change:** Generate a small diff with no unrelated cleanup.
5. **Review:** Inspect every line using the IBM i checklist.
6. **Verify:** Compile, bind, run automated checks where available, and execute positive, negative, boundary, authority, and regression tests.
7. **Record learning:** Update repository guidance, tests, or documentation so the same context does not need to be rediscovered.

### Repository guidance example

Many AI development tools can consume repository-level instructions. The exact filename and feature set depend on the chosen tool, but useful content is tool-independent:

```markdown
# IBM i development guidance

- Target fully free-form RPGLE and SQLRPGLE supported by our documented release.
- Preserve exported procedure signatures unless the task explicitly changes them.
- Never invent IBM i objects, fields, copy members, or status values.
- Keep monetary values in packed decimal; preserve documented rounding rules.
- Do not add COMMIT, ROLLBACK, or isolation clauses without an approved transaction design.
- Qualify database objects according to this repository's naming convention.
- Return a minimal diff and list every assumption.
- Required validation: compile, binding check, unit/regression cases, and human review.
```

Keep these instructions short, accurate, and version controlled. They guide output but do not replace tests or review.

## Match Autonomy to Risk

Not every task needs the same level of control.

[[FIGURE:autonomy-risk]]

An agent capable of editing files or running commands should receive only the permissions and environment access needed for the bounded task. Capability is not authorization.

## Common Failure Patterns

### "It looks like RPG, so it must compile"

Models can mix syntax from different RPG eras, releases, or languages. Always compile with the real target toolchain.

### Invented objects and fields

An assistant may infer `CUSTOMER_MASTER`, `ORDER_STATUS`, or a convenient API that does not exist. Supply definitions and verify every reference.

### Lost business behavior during modernization

An indicator, operation extender, file status check, or unusual branch may encode a real rule. A cleaner-looking rewrite is not automatically equivalent.

### Hidden transaction changes

Adding SQL, changing isolation, or moving a database operation can alter locks and rollback scope even when returned values look correct.

### Over-broad refactoring

Large AI-generated changes are hard to review and diagnose. Ask for one behavior-preserving transformation at a time.

### Trusting an AI review of AI code

A second AI pass can find issues, but it is not independent execution evidence. Human review, compilation, static checks, and tests remain necessary.

### Sending too much context

Large context can include confidential material and distract the model. Relevant context beats maximum context.

## Measuring Whether AI Actually Helps

Avoid judging adoption by generated lines of code. Better measures include:

- time required to understand an unfamiliar program;
- cycle time from scoped task to reviewed change;
- percentage of suggestions accepted without major rework;
- compiler errors and defects found before review;
- escaped defects after release;
- review time and change size;
- test cases added; and
- developer confidence and knowledge transfer.

A faster first draft is not a productivity improvement if review and repair take longer.

## Try It Yourself

Choose a small, non-production RPG procedure that your team understands.

1. Write its business rules and boundary cases without AI.
2. Ask an approved assistant to explain the procedure using source evidence.
3. Mark each response statement as verified, incorrect, or unverified.
4. Ask for a minimal readability improvement with no behavior change.
5. Review the diff using the IBM i checklist.
6. Compile it in a development environment.
7. Run the original and changed versions against the same cases.
8. Record which context improved the response and which assumptions were unsafe.

The purpose is not to prove that the assistant is clever. It is to develop a workflow in which inaccurate output is detected cheaply.

## Final Perspective

AI-assisted RPG development works best when it strengthens — not bypasses — the habits of a good IBM i engineer.

Use AI to accelerate reading, generate alternatives, expose assumptions, draft small changes, and expand tests. Then use source evidence, IBM documentation, compilation, controlled execution, and human knowledge to decide what is true.

The safest and most productive pattern is simple:

> **Give the assistant a bounded problem, require a reviewable answer, and let evidence — not confidence — determine whether the change is ready.**

## Check Your Understanding

1. Why can an AI assistant not prove that RPG code will run correctly on your partition?
2. Which five types of context make an RPG prompt more reliable?
3. Why should analysis and implementation be separate prompt steps?
4. Which IBM i dependencies may be invisible in a source member?
5. Why are `%DECH`, decimal precision, and scale important in monetary code?
6. What must be checked when AI generates a `SELECT INTO` statement?
7. Why is adding `COMMIT` potentially dangerous?
8. How should AI assistance differ for documentation and production data correction?
9. Why is a second AI review not sufficient validation?
10. Which measures show useful AI adoption more accurately than lines generated?

---

### Sources and further reading

The technical claims in this article — including `%DECH` rounding behavior, `CRTRPGMOD`/`CRTSRVPGM`/`DSPSRVPGM` syntax, service-program signature behavior, and Db2 for i SQLCODE meanings — were checked against IBM's official documentation before publishing.

- [IBM: ILE RPG Reference](https://www.ibm.com/docs/en/i/7.5.0?topic=rpg-ile-reference)
- [IBM: RPG conversion operations, including %DECH](https://www.ibm.com/docs/en/i/7.5.0?topic=operations-conversion)
- [IBM: Creating a NOMAIN RPG module](https://www.ibm.com/docs/en/i/7.5.0?topic=command-creating-nomain-module)
- [IBM: Creating a service program with CRTSRVPGM](https://www.ibm.com/docs/en/i/7.5.0?topic=program-creating-service-using-crtsrvpgm)
- [IBM: Service-program signatures](https://www.ibm.com/docs/en/i/7.5.0?topic=language-signature)
- [IBM: Example of SQL statements in ILE RPG programs](https://www.ibm.com/docs/en/i/7.4.0?topic=statements-example-sql-in-ile-rpg-programs)
- [IBM: Retrieving data with SELECT](https://www.ibm.com/docs/en/i/7.5.0?topic=language-retrieving-data-using-select-statement)
- [IBM: SQL messages and codes](https://www.ibm.com/docs/en/i/7.5.0?topic=codes-listing-sql-messages)
- [IBM: Commitment control in Db2 for i SQL](https://www.ibm.com/docs/en/i/7.5.0?topic=integrity-commitment-control)
- [IBM: AI coding assistants](https://www.ibm.com/think/topics/ai-coding-assistant)
- [IBM: AI-assisted RPG modernization](https://www.ibm.com/think/topics/rpg-modernization)
- [GitHub: Prompt engineering for Copilot Chat](https://docs.github.com/copilot/concepts/prompt-engineering-for-copilot-chat)
- [GitHub: Repository custom instructions](https://docs.github.com/copilot/customizing-copilot/adding-custom-instructions-for-github-copilot)
- [GitHub: Reviewing AI-generated code](https://docs.github.com/en/copilot/tutorials/review-ai-generated-code)
- [GitHub: Responsible use of Copilot Chat](https://docs.github.com/en/copilot/responsible-use/chat)

AI product features, supported models, licensing, data controls, and IBM i integrations change over time. Confirm current vendor documentation and your organization's approved configuration before selecting or enabling a tool. Code examples in this article are educational; compile and test them against your target IBM i release, RPG PTF level, compile options, and application conventions before reuse.
