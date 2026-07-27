## Who this is for

This Deep Dive builds on [SQL on IBM i](/deep-dives/sql-on-ibm-i), [Embedded SQL in RPGLE](/deep-dives/embedded-sql-in-rpgle), [SQL Cursors on IBM i](/deep-dives/sql-cursors-on-ibm-i), and [Stored Procedures on IBM i](/deep-dives/stored-procedures-on-ibm-i), and the `SQLTUTOR` schema/data all four create -- work through those first if you haven't. This Deep Dive adds two new tables of its own, `PRODUCT_AUDIT` and `CUSTOMER_HISTORY`, created as we get to them.

You're comfortable with stored procedures -- a named piece of logic a caller chooses to invoke with `CALL`. A **trigger** is the other half of that coin: logic the database invokes *automatically*, whether the caller asked for it or not. This Deep Dive starts from first principles and builds up to the parts of triggers that only show up in production systems -- cascading chains, recursion, transition tables, and legacy system triggers written directly in RPG.

By the end you'll be able to:

- Explain what a trigger is, why it exists, and how it differs fundamentally from a stored procedure
- Recognize when a trigger is the wrong tool, and reach for a constraint, default, or explicit procedure call instead
- Tell **SQL triggers** and **system ("DDS-based") triggers** apart -- what each can and can't do, and which to use for new work
- Choose the right timing (`BEFORE`/`AFTER`/`INSTEAD OF`) and granularity (row vs. statement) for a given job
- Use transition variables and transition tables correctly, including the performance case for each
- Write defensively around cascading triggers and recursion
- Build real audit logging, validation, history-tracking, and table-synchronization triggers
- Read a legacy-style RPGLE trigger program that parses the raw trigger buffer, and know when writing a new one is (and isn't) the right call
- Debug a trigger you didn't know existed, and recognize the outdated patterns still floating around in older IBM i codebases

**On tooling:** the SQL trigger examples run in ACS Run SQL Scripts against an IBM i system where `SQLTUTOR` exists -- ACS is a client, not the database, so an actual IBM i system is still required even though nothing needs compiling. The system (RPGLE/CLLE) trigger examples do require compiling a program on IBM i, same as the external procedure example in Stored Procedures on IBM i.

> **These examples create new objects and modify SQLTUTOR sample data.** This Deep Dive creates `PRODUCT_AUDIT` and `CUSTOMER_HISTORY`, plus triggers on `PRODUCT`, `ORDER_DETAIL`, and `CUSTOMER`. Run everything here only in a practice environment, and reload the `SQLTUTOR` sample data from [SQL on IBM i](/deep-dives/sql-on-ibm-i) if you want a clean slate afterward.

---

## 1. What is a trigger, and why does it exist?

A **trigger** is logic -- written in SQL PL or a compiled program -- that Db2 for i runs automatically whenever a specific event (`INSERT`, `UPDATE`, or `DELETE`) happens to a specific table. Nobody calls it. It just fires, every time, for every caller.

That last part is the entire reason triggers exist, and it's worth sitting with. Stored Procedures on IBM i's `PLACE_ORDER` procedure only enforces its logic if a caller remembers to `CALL` it. But IBM i tables are reachable through *many* doors at once:

```text
        RPG native I/O (CHAIN/WRITE/UPDATE)  --
        Embedded SQL                          |
        Interactive SQL / ACS                 --->  SQLTUTOR.PRODUCT  --->  Trigger fires,
        JDBC / .NET / ODBC clients             |     (one *FILE object)     no matter which
        Another stored procedure               --                          door was used
```

SQL on IBM i established that a SQL table and a DDS physical file are the same underlying `*FILE` object. That fact is *why* triggers work the way they do: a trigger is attached to the object itself, not to any particular access path, so a plain RPG `WRITE` and a `CALL`-based stored procedure and a raw `UPDATE` typed into ACS all fire exactly the same trigger. A stored procedure is opt-in; a trigger is unconditional. That's the trade-off that decides which one you reach for -- and Section 4 goes through that decision in more detail.

---

## 2. How a trigger fires: the execution model

```text
   Client issues INSERT / UPDATE / DELETE
                     |
                     v
        BEFORE trigger(s) fire (if any)
        - can inspect and MODIFY the incoming (NEW) values
        - can reject the operation entirely (SIGNAL)
        - cannot see the row as "already changed" -- nothing is written yet
                     |
                     v
        The actual database change is applied
                     |
                     v
        AFTER trigger(s) fire (if any)
        - the change is already applied (pending commit)
        - can read the final values, and can write to OTHER tables
        - can still cause the whole statement to fail (SIGNAL)
                     |
                     v
        Statement completes; the caller's own COMMIT/ROLLBACK behavior
        applies to the original change AND everything the triggers did --
        it's all one unit of work.
```

The line worth memorizing: **trigger side effects are part of the same unit of work as the statement that fired them.** If a trigger raises an error with `SIGNAL`, the firing `INSERT`/`UPDATE`/`DELETE` fails too -- not just the trigger's own effect. Ordinary caller/job commitment-control behavior applies from there exactly as it would for any other failed statement; a trigger doesn't introduce a separate transaction of its own, and there's no need (or standard reason) to issue an explicit `COMMIT`/`ROLLBACK` from inside a trigger body to make this work. Section 13 covers `SIGNAL` in more depth, and one practical consequence is worth flagging immediately: **a trigger can cause a caller's `INSERT`/`UPDATE`/`DELETE` to fail even though the calling code did nothing wrong** -- the rule it violated may have been added to the table long after that program was written. Section 20's debugging section starts from exactly that scenario.

---

## 3. Before you create a trigger, ask whether you need one

Triggers are powerful precisely because they're unconditional -- and that's also what makes them the most hidden piece of logic in a database. Before reaching for `CREATE TRIGGER`, check whether a more visible, more testable tool already does the job:

| If you need... | Reach for | Not a trigger, because |
|---|---|---|
| A simple rule a column's value must satisfy (`QTY > 0`, a valid status code) | A `CHECK` constraint | Declarative, shows up in the table definition itself, and the database can reason about it without running any code |
| Parent/child integrity (an order line can't reference a nonexistent product) | A `FOREIGN KEY` constraint | Same benefit -- enforced by the database's own constraint machinery, no procedural logic to maintain |
| A simple derived or default value | A `DEFAULT` clause or a generated column | No trigger invocation at all -- the value is computed as part of the row definition |
| An explicit business operation ("place this order") | A stored procedure | The caller chooses to invoke it, it's visible in the calling code, and it's easy to test directly with a `CALL` |
| Behavior that depends on which caller is doing the writing | Application logic | A trigger fires identically for every caller -- it can't tell "the nightly batch job" from "an interactive user" without extra machinery like Section 16's bypass pattern |
| A rule that must hold **no matter which door the write comes through** | A trigger | This is the one job only a trigger does well -- see Section 1 |

The last row is the actual test: **reach for a trigger when the rule has to be true regardless of access path, not simply because it's convenient to centralize the logic somewhere.** A validation rule that only ever needs to run inside one RPG program's own logic doesn't need a trigger just because "it'd be nice to have it in the database" -- that's often a stored procedure's job instead (Section 4), or just application code. Save triggers for the cases table alternatives can't cover: automatic auditing, cross-table synchronization, and validation that genuinely must be unconditional.

---

## 4. Stored procedure vs. trigger, side by side

Both live in the database, but they solve different problems and it's worth being explicit about the trade-off:

| | Stored Procedure | Trigger |
|---|---|---|
| How it runs | Caller explicitly `CALL`s it | Fires automatically on `INSERT`/`UPDATE`/`DELETE` |
| Visibility | Visible in the calling code -- a reader can see the `CALL` | Invisible at the call site -- nothing in the caller's code shows it's about to fire |
| Protects the table... | ...only from callers who remember to use it | ...regardless of access path (native I/O, embedded SQL, JDBC, another procedure) |
| Best for | An explicit, named business operation the caller is choosing to perform | Rules and side effects that must happen no matter who's writing -- auditing, validation, synchronization |
| Ease of testing | Straightforward -- `CALL` it directly with known inputs | Harder -- you have to perform the write that triggers it, then check the side effect separately |
| Ease of discovery | Easy -- it has a name you can search for at the call site | Harder -- you have to know to look at the table's trigger list (Section 17) |

Neither is strictly "better" -- they answer different questions. Stored Procedures on IBM i's `CHK_CREDIT` procedure only protects an order if the calling program remembers to `CALL` it first. Section 14.2 revisits the same credit-limit rule as a trigger instead, precisely to make this contrast concrete: the trigger version protects every caller, including a plain RPG program doing a native `WRITE` that has never heard of `CHK_CREDIT`.

---

## 5. Two families: SQL triggers vs. system ("DDS-based") triggers

IBM i has two genuinely different mechanisms, and the terminology trips people up -- worth resolving before anything else.

**"DDS-based trigger" is a common but slightly misleading name.** It doesn't mean "a trigger on a table defined with DDS source" -- it means a trigger attached the *old* way, via the `ADDPFTRG` command, predating the SQL `CREATE TRIGGER` statement. IBM's own terminology calls these **system triggers**, and that's the term this Deep Dive uses going forward. You can attach a system trigger to a table regardless of whether that table was defined with DDS source or `CREATE TABLE` -- again, because both are just `*FILE` objects. Section 15 attaches one directly to `SQLTUTOR.PRODUCT`, a table this series created entirely with SQL DDL, to prove the point -- system triggers are not limited to DDS-created files, and "DDS-based" describes the trigger's own creation mechanism, not any requirement about the target table.

| | SQL Trigger | System Trigger |
|---|---|---|
| Created with | `CREATE TRIGGER` | `ADDPFTRG` command |
| Logic written in | SQL PL (or calls out to a procedure/function) | A compiled program -- RPG, CL, COBOL, C |
| Timing/events | `BEFORE`, `AFTER`, `INSTEAD OF` (views only) | `*BEFORE`, `*AFTER` only -- no `INSTEAD OF` |
| Row/statement granularity | Both (`FOR EACH ROW` / `FOR EACH STATEMENT`) | Row only -- fires once per affected row |
| Transition tables | Yes (`OLD TABLE`/`NEW TABLE`, statement-level `AFTER` only) | No -- one row at a time, always |
| Declarative firing condition | `WHEN (...)` clause | No -- you code the condition yourself, or use `TRGUPDCND(*CHANGE)` for a coarse "something changed" check |
| Accessing before/after data | Named transition variables (`N.COLUMN`, `O.COLUMN`) | Raw trigger buffer -- byte offsets you parse yourself (Section 15) |
| Recommended for new development | **Yes** | Only for specific needs -- see below |

**When a system trigger still earns its place:** shops with no SQL PL experience wanting trigger logic in familiar RPG; needing the row's *null-byte map* directly rather than working through SQL's NULL handling; or maintaining an existing system trigger rather than introducing a second trigger mechanism on a table that already has one. Outside those cases, `CREATE TRIGGER ... LANGUAGE SQL` is the modern default for new development -- same reasoning SQL on IBM i gave for preferring `CREATE TABLE` over new DDS-defined files.

---

## 6. Trigger timing and events: BEFORE / AFTER / INSTEAD OF

| Timing | Valid on | Can modify the incoming row? | Can reject the operation? | Typical use |
|---|---|---|---|---|
| `BEFORE` | Base tables, row-level only | Yes -- the only timing that can | Yes, via `SIGNAL` | Validation, defaulting/normalizing values before they're stored |
| `AFTER` | Base tables, row- or statement-level | No -- the write already happened | Yes (fails the whole statement) | Auditing, history tracking, synchronizing other tables |
| `INSTEAD OF` | **Views only** | N/A -- it replaces the operation | Yes | Making a non-updatable view (e.g., a join) accept `INSERT`/`UPDATE`/`DELETE` by redirecting them to the real base tables |

**A `BEFORE` trigger modifying the incoming row** is worth a concrete example, since the table above only states it's possible. Assigning to the `NEW` transition variable inside a `BEFORE` trigger changes the value that actually gets written -- here, normalizing a product name to uppercase before it's stored:

```sql
CREATE OR REPLACE TRIGGER SQLTUTOR.TRG_PRODUCT_NORMALIZE
  BEFORE INSERT ON SQLTUTOR.PRODUCT
  REFERENCING NEW AS N
  FOR EACH ROW
BEGIN ATOMIC
  SET N.PROD_NAME = UPPER(N.PROD_NAME);
END;
```

After this trigger exists, `INSERT INTO SQLTUTOR.PRODUCT (PROD_ID, PROD_NAME, UNIT_PRICE, QTY_ON_HAND) VALUES (200, 'steel bolt', 2.10, 500);` stores `PROD_NAME` as `STEEL BOLT` -- the caller never sees this happen unless they know to look, which is exactly the double-edged nature of triggers this Deep Dive keeps coming back to.

`INSTEAD OF` deserves its own example, since it's the one timing that doesn't fit the `BEFORE`/`AFTER` pattern at all -- it doesn't run in addition to the operation, it **replaces** it entirely. A view that joins tables generally isn't directly updatable; `INSTEAD OF` is how you make it behave as if it were:

```sql
CREATE OR REPLACE VIEW SQLTUTOR.CUSTOMER_CREDIT_VIEW AS
  SELECT CUST_ID, CUST_NAME, CREDIT_LIMIT
  FROM   SQLTUTOR.CUSTOMER;

CREATE OR REPLACE TRIGGER SQLTUTOR.TRG_CREDIT_VIEW_UPD
  INSTEAD OF UPDATE ON SQLTUTOR.CUSTOMER_CREDIT_VIEW
  REFERENCING NEW AS N OLD AS O
  FOR EACH ROW
BEGIN ATOMIC
  UPDATE SQLTUTOR.CUSTOMER
  SET    CREDIT_LIMIT = N.CREDIT_LIMIT
  WHERE  CUST_ID = O.CUST_ID;
END;
```

```sql
UPDATE SQLTUTOR.CUSTOMER_CREDIT_VIEW SET CREDIT_LIMIT = 60000.00 WHERE CUST_ID = 1;
```

That `UPDATE` never actually touches the view -- Db2 for i intercepts it, runs the trigger instead, and the trigger performs the real `UPDATE` against `SQLTUTOR.CUSTOMER`. This particular view is simple enough to be updatable on its own, which is exactly why it's a good first example -- the mechanics are visible without a complicated join obscuring them. The real payoff shows up on views that join multiple tables or derive columns, where Db2 for i has no way to know which underlying table an `UPDATE` should target without a trigger telling it explicitly.

> **A grammar note carried over from Stored Procedures on IBM i:** trigger bodies use `BEGIN ATOMIC ... END`, not the plain `BEGIN ... END` used for procedures. This isn't a typo -- it's a real, deliberate difference in Db2 for i's SQL PL grammar between the two object types. Every SQL trigger body in this Deep Dive uses `BEGIN ATOMIC`.

---

## 7. Row-level vs. statement-level triggers

`FOR EACH ROW` (the default) fires the trigger once per affected row. `FOR EACH STATEMENT` fires it exactly once per statement, regardless of whether that statement touched 1 row or 100,000.

| | `FOR EACH ROW` | `FOR EACH STATEMENT` |
|---|---|---|
| Fires | Once per affected row | Once per statement |
| Access to changed data | Transition variables (`N`/`O`) -- the single current row | Transition tables (`NEW TABLE`/`OLD TABLE`) -- every affected row, queryable as a table |
| Natural fit for | Per-row validation, per-row audit entries | Bulk auditing, aggregate updates to another table |
| Performance on bulk operations | Overhead scales with row count | One fixed cost regardless of row count |

`FOR EACH ROW` is the natural choice for per-row validation and per-row audit entries -- there's genuinely one thing to check or log per row, and a transition variable is the simplest way to see it. `FOR EACH STATEMENT` is the better choice for bulk-safe aggregate or synchronization logic, because transition tables are exactly what let a statement-level trigger avoid row-by-row work: it can run one set-based `UPDATE`/`INSERT ... SELECT` over the whole batch instead of repeating the same statement once per row. **Avoid a row-level trigger for logic that could instead run once per statement against a transition table** -- Section 14.4's stock-synchronization example is built specifically to demonstrate the difference, and Section 19 (Performance) comes back to why it matters.

---

## 8. Transition variables: REFERENCING OLD/NEW

Row-level triggers see the affected row through named variables you define in the `REFERENCING` clause. Which ones are available depends on the event:

| Event | `OLD` available? | `NEW` available? |
|---|---|---|
| `INSERT` | No -- there was no "before" row | Yes |
| `DELETE` | Yes | No -- there's no "after" row |
| `UPDATE` | Yes | Yes |

```sql
REFERENCING OLD AS O NEW AS N
```

You've already used these -- Section 6's examples referenced `N.PROD_NAME`, and both `O.CUST_ID` and `N.CREDIT_LIMIT` on an `UPDATE`. Section 14 builds several more.

---

## 9. Transition tables: REFERENCING OLD TABLE/NEW TABLE

For `FOR EACH STATEMENT` triggers (`AFTER` only -- transition tables aren't available on `BEFORE` or `INSTEAD OF`), the equivalent concept is a **transition table**: a name you can query with ordinary `SELECT`, `INSERT ... SELECT`, or aggregate functions, containing every row the statement touched.

```sql
REFERENCING NEW TABLE AS N_TAB OLD TABLE AS O_TAB
```

Section 14.4's stock-synchronization example uses one to update `PRODUCT.QTY_ON_HAND` in a single set-based statement, regardless of how many order-detail rows were just inserted -- one trigger firing handles the whole batch instead of firing once per row.

---

## 10. The WHEN clause: firing conditionally

`WHEN (search-condition)` lets you tell Db2 for i not to even *invoke* the trigger body unless a condition holds -- evaluated using the same transition variables/tables from Sections 8-9:

```sql
WHEN (N.UNIT_PRICE <> O.UNIT_PRICE)
```

This is meaningfully different from checking the same condition with `IF` as the first line inside the trigger body: with `WHEN`, Db2 for i skips the trigger invocation entirely when the condition is false, rather than paying the cost of starting the trigger just to immediately exit. This is especially useful for the common "only when this specific column actually changed" case -- an `UPDATE` statement can touch a row without changing the one column you actually care about, and `WHEN` is what lets the trigger stay silent for exactly those updates. Section 14.1's audit trigger uses precisely this clause -- no point logging a "price changed" audit row when the price didn't actually change.

---

## 11. Trigger ordering

Nothing stops you from creating two `AFTER UPDATE` triggers on the same table. When you do, Db2 for i fires them in the order they were created -- but **don't design around that**. Relying on implicit creation order is fragile in a specific, avoidable way: it's easy to lose track of, easy to get wrong when a trigger is dropped and recreated (which resets its position), and invisible to the next person reading either trigger's source in isolation. Multiple triggers on the same table and event quickly become something nobody can fully reason about just by reading one of them.

Two better options, in order of preference:

1. **Consolidate into one trigger** with explicit, readable internal sequencing -- the common recommendation, and the approach every hands-on example in this Deep Dive follows.
2. If you must keep them separate, **document the dependency clearly** and check the system catalog (Section 17) before adding a new trigger to a table, so you know what's already there and in what order it was created.

---

## 12. Cascading triggers and recursion

**Cascading** is when trigger A's side effect (a write to table B) causes table B's own trigger to fire, which might write to table C, and so on:

```text
INSERT on ORDERS
      |
      v (AFTER INSERT trigger)
UPDATE on CUSTOMER (e.g., last-order-date tracking)
      |
      v (CUSTOMER has its own AFTER UPDATE trigger)
INSERT on CUSTOMER_HISTORY
```

Each hop is invisible from the statement that started the chain -- the caller who ran the original `INSERT` has no idea `CUSTOMER_HISTORY` just grew a row unless they know to look. That opacity is the real cost of cascading, more than any performance concern: cascading is sometimes a legitimate, deliberate design choice, but it must be **documented explicitly** -- a comment block in the trigger source, a design note, and ideally a runbook entry for whoever handles production incidents later, since "figure out why this table changed" is exactly the kind of question that comes up during an outage, not during calm design review. Keep the system catalog (Section 17) bookmarked for tracing what's actually attached to a table before changing it.

**Recursion** is the sharper danger: a trigger whose own actions cause its own table's trigger to fire again -- directly, or by cascading back around. Db2 for i has safety limits against runaway recursion, but **treat that as a last-resort net, not a design tool** -- don't rely on the system's recursion limit to catch a design mistake you could have prevented. Section 16 shows the real-world pattern for controlling this deliberately: a bypass flag the trigger checks before doing any work, set by whatever process needs to suppress it (typically a controlled bulk load). Large trigger chains, cascading or recursive, compound both performance cost and debugging difficulty -- both are reasons to keep chains short and to write them down somewhere other than the trigger source itself.

---

## 13. Error handling in triggers

`SIGNAL` raises an error from inside a trigger, which rejects the operation and fails the entire statement -- not just the trigger's own effect:

```sql
IF N.QTY <= 0 THEN
  SIGNAL SQLSTATE '75001'
    SET MESSAGE_TEXT = 'Order quantity must be greater than zero';
END IF;
```

`BEFORE` triggers are the natural home for this kind of validation -- the rejection happens *before* anything is written, which is both more efficient and more intuitive to a caller than "the write succeeded, then something undid it." An `AFTER` trigger *can* still `SIGNAL` an error, and it still fails the whole statement (Section 2's execution model) -- but the caller pays for a write that gets undone rather than one that never happened. Section 14's validation examples are `BEFORE` triggers for exactly this reason.

`RESIGNAL` re-raises the current error condition (optionally with a different `SQLSTATE`/message) -- useful inside a handler that wants to add context before letting the failure propagate, the trigger equivalent of the exit-handler pattern from Stored Procedures on IBM i.

A few practical rules worth carrying into every trigger you write:

- **Use a meaningful `SQLSTATE` and message text**, not a generic "operation failed" -- the caller (and whoever debugs this later) needs to know *which* rule was violated.
- **Be deliberate with application-defined `SQLSTATE` values** (like `'75001'` above) -- pick a range your shop reserves for this purpose and keep it consistent, so a custom code is recognizable as yours rather than colliding with a real Db2 for i condition.
- **Don't swallow an error silently.** A handler that catches a condition and does nothing useful with it is worse than letting the error propagate -- there's no record anything went wrong.
- **Log only safe context** if you log at the point of failure -- key values relevant to diagnosing the problem, not an indiscriminate dump of every column, especially on a table that might hold sensitive data.
- **Remember the caller may only ever see the final SQL error, not the full trigger story.** If a chain of cascading triggers (Section 12) is involved, the caller's program typically sees one `SQLCODE`/`SQLSTATE` from wherever the chain ultimately failed -- which is one more reason cascading chains need to be documented rather than left to be reconstructed from a bug report.

---

## 14. Hands-on: SQL trigger examples

Everything below runs in ACS Run SQL Scripts against `SQLTUTOR`.

### 14.1 Audit logging

Log every price change on `PRODUCT`, old and new value, with the `WHEN` clause from Section 10 so the trigger doesn't fire on updates that leave the price untouched.

```sql
CREATE TABLE SQLTUTOR.PRODUCT_AUDIT (
  AUDIT_ID    INT GENERATED ALWAYS AS IDENTITY,
  PROD_ID     INT           NOT NULL,
  OLD_PRICE   DECIMAL(9,2)  NOT NULL,
  NEW_PRICE   DECIMAL(9,2)  NOT NULL,
  CHANGED_AT  TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (AUDIT_ID)
);

CREATE OR REPLACE TRIGGER SQLTUTOR.TRG_PRODUCT_PRICE_AUDIT
  AFTER UPDATE ON SQLTUTOR.PRODUCT
  REFERENCING OLD AS O NEW AS N
  FOR EACH ROW
  WHEN (N.UNIT_PRICE <> O.UNIT_PRICE)
BEGIN ATOMIC
  INSERT INTO SQLTUTOR.PRODUCT_AUDIT (PROD_ID, OLD_PRICE, NEW_PRICE)
    VALUES (N.PROD_ID, O.UNIT_PRICE, N.UNIT_PRICE);
END;
```

Test it -- this fires the trigger:

```sql
UPDATE SQLTUTOR.PRODUCT SET UNIT_PRICE = 5.00 WHERE PROD_ID = 100;
SELECT * FROM SQLTUTOR.PRODUCT_AUDIT;
```

This doesn't -- same statement shape, but the `WHEN` condition is false:

```sql
UPDATE SQLTUTOR.PRODUCT SET QTY_ON_HAND = QTY_ON_HAND - 1 WHERE PROD_ID = 100;
```

### 14.2 Data validation / business rule enforcement

A `BEFORE INSERT` trigger rejecting nonsensical order-detail rows outright:

```sql
CREATE OR REPLACE TRIGGER SQLTUTOR.TRG_ORDER_DETAIL_VALIDATE
  BEFORE INSERT ON SQLTUTOR.ORDER_DETAIL
  REFERENCING NEW AS N
  FOR EACH ROW
BEGIN ATOMIC
  IF N.QTY <= 0 THEN
    SIGNAL SQLSTATE '75001' SET MESSAGE_TEXT = 'Quantity must be greater than zero';
  END IF;
END;
```

```sql
INSERT INTO SQLTUTOR.ORDER_DETAIL (ORDER_ID, LINE_NO, PROD_ID, QTY, UNIT_PRICE)
  VALUES (5002, 2, 100, -5, 4.50);
-- SQLSTATE 75001: Quantity must be greater than zero
```

Now enforce a version of the credit-limit rule from Stored Procedures on IBM i's `CHK_CREDIT` procedure -- but as a trigger this time, to make Section 4's comparison concrete: `CHK_CREDIT` only protects an order if the calling program remembers to `CALL` it first. A trigger on `ORDER_DETAIL` protects every caller, including a plain RPG program doing a native `WRITE`, whether or not its author ever knew `CHK_CREDIT` existed.

```sql
CREATE OR REPLACE TRIGGER SQLTUTOR.TRG_ORDER_DETAIL_CREDIT_CHECK
  BEFORE INSERT ON SQLTUTOR.ORDER_DETAIL
  REFERENCING NEW AS N
  FOR EACH ROW
BEGIN ATOMIC
  DECLARE V_CUST_ID    INT;
  DECLARE V_LIMIT      DECIMAL(9,2);
  DECLARE V_LINE_TOTAL DECIMAL(9,2);

  SET V_LINE_TOTAL = N.QTY * N.UNIT_PRICE;

  SELECT O.CUST_ID, C.CREDIT_LIMIT
    INTO V_CUST_ID, V_LIMIT
    FROM SQLTUTOR.ORDERS O
    INNER JOIN SQLTUTOR.CUSTOMER C ON O.CUST_ID = C.CUST_ID
    WHERE O.ORDER_ID = N.ORDER_ID;

  IF V_LINE_TOTAL > V_LIMIT THEN
    SIGNAL SQLSTATE '75002' SET MESSAGE_TEXT = 'Order line exceeds customer credit limit';
  END IF;
END;
```

**This is intentionally simplified for trigger mechanics, not a complete credit-check policy.** It only compares one inserted line's own total against the customer's raw `CREDIT_LIMIT` -- a real credit check would typically also account for the customer's other open orders, any existing balance, and whatever business rules define "available credit" beyond a single line item. Don't lift this example into production as-is; use it to see how a `BEFORE` trigger enforces a rule unconditionally, and design the actual credit policy separately with whoever owns that business rule.

### 14.3 History table (audit trail of every version of a row)

`AFTER UPDATE`, capturing the row's state *before* each change:

```sql
CREATE TABLE SQLTUTOR.CUSTOMER_HISTORY (
  HIST_ID       INT GENERATED ALWAYS AS IDENTITY,
  CUST_ID       INT           NOT NULL,
  CUST_NAME     VARCHAR(50)   NOT NULL,
  CREDIT_LIMIT  DECIMAL(9,2),
  REPLACED_AT   TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (HIST_ID)
);

CREATE OR REPLACE TRIGGER SQLTUTOR.TRG_CUSTOMER_HISTORY
  AFTER UPDATE ON SQLTUTOR.CUSTOMER
  REFERENCING OLD AS O
  FOR EACH ROW
BEGIN ATOMIC
  INSERT INTO SQLTUTOR.CUSTOMER_HISTORY (CUST_ID, CUST_NAME, CREDIT_LIMIT)
    VALUES (O.CUST_ID, O.CUST_NAME, O.CREDIT_LIMIT);
END;
```

Every `UPDATE` against `CUSTOMER` now leaves its pre-change state behind in `CUSTOMER_HISTORY` -- a complete version history with zero cooperation required from any calling program.

### 14.4 Synchronizing related tables (statement-level, with a transition table)

Automatically decrement `PRODUCT.QTY_ON_HAND` whenever order-detail lines are inserted -- set-based, using `NEW TABLE`, so it costs one statement regardless of how many lines were just inserted:

```sql
CREATE OR REPLACE TRIGGER SQLTUTOR.TRG_STOCK_SYNC
  AFTER INSERT ON SQLTUTOR.ORDER_DETAIL
  REFERENCING NEW TABLE AS N_TAB
  FOR EACH STATEMENT
BEGIN ATOMIC
  UPDATE SQLTUTOR.PRODUCT P
  SET P.QTY_ON_HAND = P.QTY_ON_HAND -
    (SELECT SUM(N.QTY) FROM N_TAB N WHERE N.PROD_ID = P.PROD_ID)
  WHERE P.PROD_ID IN (SELECT PROD_ID FROM N_TAB);
END;
```

This is Section 7's table made concrete: a `FOR EACH ROW` version of this trigger would run the `UPDATE` once per inserted line; this version runs it exactly once, correctly aggregating multiple lines for the same product in a single insert statement. Same "prefer one set-based statement" instinct from SQL Cursors on IBM i and Stored Procedures on IBM i -- it applies inside trigger design too.

---

## 15. Hands-on: a system ("DDS-based") trigger

Everything in Section 14 was an SQL trigger. This section builds the older mechanism from Section 5 -- attached, deliberately, to `SQLTUTOR.PRODUCT`, the same SQL-defined table, to underline that system triggers don't care how a table was originally created.

> **Verify before production use.** The trigger buffer layout below is drawn from IBM's documented trigger buffer field descriptions and matches the shape of published working examples, but exact field positions and lengths can vary in detail by IBM i release. Cross-check field order, size, and offsets against the current *Db2 for i SQL programming* reference for your OS release before shipping code that depends on exact byte offsets -- treat everything in this section as an illustration of the general shape, not a byte-for-byte specification to copy blindly.

### 15.1 The trigger buffer and program interface

**A system trigger program receives two parameters, not one:** the trigger buffer itself, and the buffer's length as a 4-byte binary integer. That second parameter matters because the buffer is variable-length (it grows with the row's own length), so the trigger program needs to know how much of it is actually valid.

The buffer itself is a fixed-length header (event/timing info, plus offsets locating the before/after row images) followed by the actual row data:

| Field | Position | Type | Purpose |
|---|---|---|---|
| File name | 1-10 | Char(10) | Name of the file that fired the trigger |
| Library name | 11-20 | Char(10) | Library containing it |
| Member name | 21-30 | Char(10) | Member (almost always the file name itself) |
| Trigger event | 31 | Char(1) | `1`=Insert, `2`=Delete, `3`=Update |
| Trigger time | 32 | Char(1) | Before/after indicator |
| Commit lock level | 33 | Char(1) | Commitment control lock level in effect |
| CCSID | 37-40 | Int(10) | CCSID of the buffer's character data |
| Relative record number | 41-44 | Int(10) | RRN of the affected record |
| Old record offset | 49-52 | Int(10) | Byte offset, from the start of the buffer, to the "before" row image |
| Old record length | 53-56 | Int(10) | Length of that image |
| Old null-map offset | 57-60 | Int(10) | Byte offset to the "before" row's null-byte map |
| Old null-map length | 61-64 | Int(10) | Length of that map |
| New record offset | 65-68 | Int(10) | Byte offset, from the start of the buffer, to the "after" row image |
| New record length | 69-72 | Int(10) | Length of that image |
| New null-map offset | 73-76 | Int(10) | Byte offset to the "after" row's null-byte map |
| New null-map length | 77-80 | Int(10) | Length of that map |

Two details that matter more than any single field's exact position:

- **The offset fields store plain byte counts from the start of the buffer**, not column positions. That means RPG pointer arithmetic like `%Addr(Parm1) + TrgHdr.OldOffset` (Section 15.3) works directly, with no off-by-one adjustment for 0-based vs. 1-based indexing -- you're adding a byte count to a base address, the same as any other pointer arithmetic.
- **The null-byte map** is a small bitmap-like area, one byte per nullable column in the row, indicating whether that column is currently `NULL` -- this is the low-level mechanism SQL's transition variables handle for you automatically; a system trigger has to interpret it directly if it needs to know whether a column is null.

### 15.2 The legacy audit file (DDS)

A traditional DDS-defined physical file for this trigger to log into -- shown here to keep this example self-contained, distinct from the SQL-table approach in Section 14.1:

```text
     A                                      UNIQUE
     A          R PRDTRGLOGR
     A            PROD_ID       10I 0
     A            OLD_PRICE      9P 2
     A            NEW_PRICE      9P 2
     A            CHG_TS              Z
     A            TRG_EVENT     10A
     A          K PROD_ID
     A          K CHG_TS
```

### 15.3 The trigger program (RPGLE)

Registered for exactly one event (`AFTER UPDATE`), so it doesn't need to branch on the event/time header fields -- they're read and shown here purely so you can see where they live in the buffer.

**Member: `PRDTRG`, type `RPGLE`** (plain RPGLE -- no embedded SQL here, so no precompiler needed; compile with `CRTBNDRPG`, not `CRTSQLRPGI`):

```rpgle
**FREE
Ctl-Opt DftActGrp(*No) ActGrp(*New);

Dcl-Pi *N;
  Parm1 Char(65535) Options(*VarSize);
  Parm2 Int(10) Const;
End-Pi;

Dcl-Ds TrgHdr Based(pHdr) Qualified;
  FileName      Char(10);
  LibName       Char(10);
  MbrName       Char(10);
  Event         Char(1);
  Time          Char(1);
  CommitLockLev Char(1);
  *N            Char(3);
  Ccsid         Int(10);
  Rrn           Int(10);
  *N            Char(4);
  OldOffset     Int(10);
  OldRecLen     Int(10);
  OldNullOffset Int(10);
  OldNullLen    Int(10);
  NewOffset     Int(10);
  NewRecLen     Int(10);
  NewNullOffset Int(10);
  NewNullLen    Int(10);
End-Ds;

Dcl-Ds OldRec ExtName('SQLTUTOR/PRODUCT') Based(pOldRec) Qualified;
End-Ds;

Dcl-Ds NewRec ExtName('SQLTUTOR/PRODUCT') Based(pNewRec) Qualified;
End-Ds;

Dcl-F PRDTRGLOG Usage(*Output);

pHdr    = %Addr(Parm1);
pOldRec = %Addr(Parm1) + TrgHdr.OldOffset;
pNewRec = %Addr(Parm1) + TrgHdr.NewOffset;

If NewRec.Unit_Price <> OldRec.Unit_Price;
   PROD_ID   = NewRec.Prod_Id;
   OLD_PRICE = OldRec.Unit_Price;
   NEW_PRICE = NewRec.Unit_Price;
   CHG_TS    = %Timestamp();
   TRG_EVENT = 'PRICE CHG';
   Write PRDTRGLOGR;
EndIf;

*InLR = *On;
```

Note the second parameter, `Parm2`, is declared but unused here since this program doesn't need to inspect the buffer's exact length to do its job -- it's still part of the required interface and must be in the parameter list for the system to call the program correctly.

Compare this line by line against Section 14.1's SQL trigger -- same business rule (log a price change, skip everything else), same underlying table, two completely different mechanisms: named transition variables and a declarative `WHEN` clause on one side, hand-computed pointer arithmetic over a raw buffer on the other. That contrast is the clearest argument for Section 5's recommendation to default to SQL triggers for new work.

A few cautions worth carrying forward before treating this pattern as a template:

- **This style of trigger is for understanding and maintaining legacy code, not a pattern to reach for in new development.** Prefer an SQL trigger (Section 5) whenever you have the choice.
- **Field offsets are only valid for the exact table layout the program was written against.** Adding, removing, or resizing a column changes `OldRecLen`/`NewRecLen` and shifts every field after it in the row image -- test a system trigger program carefully after any change to the table it's attached to, rather than assuming the existing pointer arithmetic still lines up.
- **There's no compile-time validation tying this program to the table's actual columns**, unlike an SQL trigger's transition variables, which the SQL compiler checks against the real table definition. A typo or a missed table change here fails silently or reads garbage, not at compile time.
- **Version-control and document system-trigger programs** the same as any other production RPG source -- the buffer layout dependency makes them more fragile than most programs to a table change nobody remembered to check against.

### 15.4 Attaching it

```text
ADDPFTRG FILE(SQLTUTOR/PRODUCT) TRGTIME(*AFTER) TRGEVENT(*UPDATE) +
         PGM(MYLIB/PRDTRG) TRGUPDCND(*ALWAYS)
```

`TRGUPDCND(*ALWAYS)` (the default) fires on every `UPDATE`, matching what Section 14.1's `WHEN` clause does declaratively -- the trigger program itself decides whether the price actually changed. `TRGUPDCND(*CHANGE)` is the coarser system-trigger equivalent: it skips firing when the row's data is byte-for-byte identical to before, but unlike a SQL `WHEN` clause it can't target one specific column.

---

## 16. Controlling triggers deliberately: a bulk-load bypass

Section 12 flagged recursion/cascading as something to control deliberately rather than rely on Db2 for i's safety net for. The standard real-world pattern: a flag the trigger checks before doing any work, flipped on by whatever process needs to suppress it -- typically a large, already-validated bulk load where firing an audit/history trigger per row would be pure overhead (Section 19 expands on why).

```text
CRTDTAARA DTAARA(MYLIB/TRGBYPASS) TYPE(*CHAR) LEN(1) VALUE('N')
```

**Member: `BULKLOAD`, type `CLLE`** -- wraps a mass price-load program, suppressing the trigger only for the duration of that specific job:

```text
PGM
             CHGDTAARA  DTAARA(MYLIB/TRGBYPASS) VALUE('Y')
             CALL       PGM(MYLIB/LOADPRICES)
             MONMSG     MSGID(CPF0000)
             CHGDTAARA  DTAARA(MYLIB/TRGBYPASS) VALUE('N')
ENDPGM
```

`MONMSG MSGID(CPF0000)` guarantees the flag gets reset even if `LOADPRICES` fails partway through -- leaving `TRGBYPASS` stuck at `'Y'` would silently disable auditing for every subsequent normal transaction, a far worse outcome than the load itself failing.

The trigger program checks the flag first, before any other logic:

```rpgle
Dcl-S Bypass Char(1) DtaAra('MYLIB/TRGBYPASS');

In Bypass;
If Bypass = 'Y';
   Return;
EndIf;

// ... normal trigger logic as in Section 15.3 ...
```

**A global, shared bypass flag like this is a genuinely useful pattern, but it's also a real operational risk -- a few cautions before you build one:**

- **A global flag affects every job that touches the table while it's set**, not just the one that turned it on -- if two processes could plausibly run at the same time and only one of them wants the bypass, a single shared data area isn't the right tool; look for a job-scoped, session-scoped, or time-boxed alternative instead (for example, checking `CURRENT_TIMESTAMP` against a "bypass active until" value rather than a bare on/off flag).
- **A stuck bypass flag fails silently.** Nothing errors when `TRGBYPASS` is left at `'Y'` -- auditing simply stops happening, and that's often only discovered much later, during an audit or an incident investigation. `MONMSG` above is the minimum defense, not a complete one; verify the flag's state after any job that sets it.
- **Log when the bypass is actually used** -- a row in a small "bypass activations" table (job name, user, timestamp, reason) turns "was auditing off during this period?" from a guess into a fact you can check.
- **Restrict who can enable the bypass.** `CHGDTAARA` against `TRGBYPASS` should require the same care as any other control that can silently disable auditing -- don't leave it open to every user profile that happens to have authority to the library.

The same flag-check idea works conceptually for a `LANGUAGE SQL` trigger too -- check a value (for example, a session or global variable, or a small wrapper function/procedure that reads a controlled value) as the first statement in the trigger body, or fold it into the `WHEN` clause from Section 10. Reading a CL data area directly from SQL isn't a built-in SQL PL capability -- it requires a UDF or procedure wrapper around a program that reads the data area. That's a real, buildable pattern, but it's a separate piece of plumbing this Deep Dive doesn't build out in full; treat it as a design direction to pursue deliberately, not a drop-in snippet.

---

## 17. How to see what triggers exist

Before adding a trigger, changing a table, or debugging an unexpected `SQLCODE`, check what's already attached. `QSYS2.SYSTRIGGERS` lists every trigger Db2 for i knows about:

```sql
SELECT TRIGGER_NAME, EVENT, TRIGGER_TIMING, EVENT_OBJECT_TABLE
FROM   QSYS2.SYSTRIGGERS
WHERE  EVENT_OBJECT_SCHEMA = 'SQLTUTOR'
ORDER BY EVENT_OBJECT_TABLE, EVENT, TRIGGER_TIMING;
```

That's the query behind Section 11's ordering advice and Section 20's "check for a trigger before assuming the caller broke something" debugging step. Some releases also expose an enabled/disabled state and the trigger's own source text through additional columns on this or a related catalog view -- column names here can vary by release, so confirm the exact columns available to you against the current IBM i SQL reference rather than assuming a fixed set.

For dependency chains -- what a trigger reads from or writes to, which matters directly for tracing cascades (Section 12) -- `QSYS2.SYSTRIGDEP` is the relevant catalog view:

```sql
SELECT *
FROM   QSYS2.SYSTRIGDEP
WHERE  TRIGGER_SCHEMA = 'SQLTUTOR'
ORDER BY TRIGGER_NAME;
```

Run this (or the equivalent for your release) as a standing habit before altering a table's structure, not just when something has already gone wrong -- Section 20's Scenario D is exactly the failure mode this check exists to prevent.

---

## 18. Security and authority considerations

A trigger's unconditional nature has security implications worth thinking through, not just a performance and design one:

- **Users cause trigger logic to run without necessarily knowing it exists.** Someone with ordinary write authority to `SQLTUTOR.CUSTOMER` triggers `TRG_CUSTOMER_HISTORY` (Section 14.3) just by doing their normal job -- they never see it happen, and they don't need any special authority to make it fire.
- **Understand your shop's authority model before relying on a trigger's side effects for something security-sensitive.** Exactly how a trigger's own writes are authorized (relative to the user who triggered it) depends on your environment's specific setup -- verify this for your own shop rather than assuming a particular behavior, and don't design a security control around an assumption you haven't confirmed.
- **Audit and history tables can themselves become a sensitive-data problem.** `PRODUCT_AUDIT` and `CUSTOMER_HISTORY` duplicate data from the base table -- if the base table ever grows a sensitive column, the audit/history copy inherits that sensitivity too, and needs the same access controls.
- **Protect audit/history tables from casual `UPDATE`/`DELETE`.** A trail that anyone can quietly edit after the fact isn't much of a trail -- restrict write authority on these tables more tightly than you would a normal working table, ideally to nothing beyond what the trigger itself needs.
- **Validate inputs inside a trigger the same as anywhere else**, even though a trigger feels "internal" to the database -- the data reaching it still ultimately came from a caller, and "the trigger will catch it" only works if the trigger's own logic is actually careful.
- **Avoid dynamic SQL built by concatenating untrusted values inside a trigger**, for the same reason it's risky anywhere else -- if a trigger genuinely needs dynamic SQL, use parameter markers, not string concatenation of data that ultimately came from a caller.

This is a practical starting point, not a full authority/security treatment -- adopted authority and the deeper security model deserve their own dedicated Deep Dive and aren't covered here.

---

## 19. Performance considerations

- **Row-level trigger cost multiplies with row count.** A `FOR EACH ROW` trigger on a 50,000-row bulk load fires 50,000 times. Prefer `FOR EACH STATEMENT` with transition tables (Section 14.4) wherever the logic can be expressed as one set-based operation over the whole batch.
- **Use the `WHEN` clause to skip unnecessary firings** (Section 10) -- it's a real, measurable difference between "the trigger body starts running and immediately exits" and "the trigger never runs at all."
- **Deliberately suppress triggers for controlled bulk operations** (Section 16) rather than accepting the full per-row cost on data that's already been validated upstream (e.g., a vetted nightly file load).
- **Cascading chains (Section 12) compound cost, not just complexity** -- each hop is a full statement execution with its own overhead; a three-deep cascade is at minimum three times the work of the original statement, invisible to whoever wrote it.
- **Make sure any query a trigger runs has a supporting index**, the same as you would for that same query anywhere else -- a trigger that does an unindexed lookup pays that cost on every single firing, and it's easy to overlook because the query lives inside trigger source instead of an obviously "hot" program.
- **Don't do slow, non-essential work inside a trigger** -- a synchronous call to an external system, for instance. Trigger execution time is added directly to the caller's response time, and a slow trigger on a hot table blocks *every* caller touching it, including plain native RPG I/O that has no idea a trigger even exists. Queue the work instead (insert into a "pending work" table an async job drains) rather than doing it inline.
- **Audit what's attached before changing a table's structure** -- `QSYS2.SYSTRIGGERS` and `QSYS2.SYSTRIGDEP` (Section 17) show what triggers exist and what they depend on, so a column rename or table restructure doesn't quietly break something three hops away.

---

## 20. Debugging and troubleshooting

**The single most common symptom:** a program that "used to work" starts failing on an `INSERT`/`UPDATE`/`DELETE` with an `SQLCODE`/`SQLSTATE` the caller's code never coded for -- and the caller's logic hasn't changed at all. **Before assuming the calling program broke, check whether a trigger was added to the table** -- this is the first troubleshooting step, every time:

```sql
SELECT TRIGGER_NAME, EVENT, TRIGGER_TIMING
FROM   QSYS2.SYSTRIGGERS
WHERE  EVENT_OBJECT_SCHEMA = 'SQLTUTOR' AND EVENT_OBJECT_TABLE = 'ORDER_DETAIL';
```

Beyond that first check:

- **Check the job log for trigger-generated messages.** A `SIGNAL`-raised error surfaces there the same as any other SQL error, along with whatever message text the trigger set.
- **Capture the `SQLSTATE` and message text, not just the raw `SQLCODE`** -- the same discipline as anywhere else embedded SQL fails, and often the fastest way to identify which specific trigger and rule caused a rejection.
- **A temporary diagnostic logging table can be genuinely useful during development** -- inserting a row with key values and a timestamp at specific points inside a trigger body, to see what it actually saw. Remove this logging before the trigger goes to production; a debug-only `INSERT` left behind adds cost and clutter to every future firing.
- **For a system trigger** (Section 15), debugging is from the calling job's perspective -- start a debug session against the job that's about to perform the triggering `INSERT`/`UPDATE`/`DELETE`, the same as you would for any other called program, since the trigger program is just a normal compiled program from the debugger's point of view.
- **For an SQL trigger**, if your shop's tooling supports attaching a debugger to the generated routine object, that can be faster than instrumenting the trigger body -- but confirm the exact mechanism your environment supports before relying on it; a scratch logging table is the more universally available option.

**"My trigger isn't firing at all"** -- work through, in order:

1. Is the trigger actually enabled? (`ALTER TABLE` can deactivate individual triggers.)
2. Is the write happening on the exact table/columns the trigger is registered against? (An `UPDATE OF column-list` SQL trigger only fires when one of those specific columns is in the `SET` list.)
3. For a system trigger using `TRGUPDCND(*CHANGE)`, did the row's data actually change, byte-for-byte? A rewrite with identical values doesn't fire it.
4. Does the `WHEN` clause (SQL trigger) actually evaluate `TRUE` for this row? Test the condition as a plain `SELECT` first.

**"My job is hanging / pegging CPU after a data change"** is the usual symptom of uncontrolled recursion or a long cascading chain (Sections 12, 19) -- check `QSYS2.SYSTRIGDEP` for what's chained together before assuming it's unrelated to a recent trigger change.

---

## 21. Lifecycle and change management

Because a trigger is invisible at the point where it fires, the practices around creating and changing one matter more than they would for a normal program:

- **Name triggers clearly** -- a name that states the table, event, and purpose (`TRG_ORDER_DETAIL_CREDIT_CHECK`, not `TRG1`) is the first line of documentation, visible directly in the system catalog (Section 17) without opening the source.
- **Document the trigger's purpose and firing event** near the top of its own source, not only in an external design doc that can drift out of sync with the code.
- **Document any cascade or bypass behavior explicitly** (Sections 12, 16) -- don't leave the next reader to reconstruct a chain or a bypass mechanism from scratch during an incident.
- **Include triggers in deployment scripts**, the same as tables and procedures -- a trigger created by hand once, outside source control, is exactly the kind of hidden behavior nobody owns.
- **Test both the normal path and the failing path** before considering a trigger done -- a validation trigger that's never actually been made to reject a bad row hasn't really been tested.
- **Check existing triggers on a table before altering its structure** (Section 17) -- a column rename, resize, or drop can silently break a trigger that references it by name, especially a system trigger's buffer offsets (Section 15).
- **Review a table's triggers as a standard step during incident analysis**, not an afterthought -- Section 20's debugging flow exists precisely because triggers are easy to forget are there.
- **Avoid hidden behavior that no one owns.** Every trigger should have a clear reason for existing and someone who could explain it if asked -- if neither is true for an existing trigger you find, that's worth flagging rather than leaving alone.

---

## 22. Common mistakes

| Mistake | What actually happens |
|---|---|
| Putting validation in an `AFTER` trigger instead of `BEFORE` | The invalid write happens, then gets undone -- wasted work, and a more confusing error path than rejecting it up front |
| Writing a `FOR EACH ROW` trigger for something a `FOR EACH STATEMENT` + transition table could do | Overhead scales with row count instead of staying flat -- painful the first time someone runs a bulk load |
| Checking a change condition with `IF` inside the trigger body instead of `WHEN` | The trigger still pays the cost of invocation on every firing, even the ones that do nothing |
| Assuming a trigger and a stored procedure protect a table equally | A procedure only helps callers who use it; a trigger protects the table regardless of access path -- see Sections 1 and 4 |
| Putting simple validation that a `CHECK` constraint could express into a trigger instead | More code to maintain than a declarative constraint, for no additional benefit -- see Section 3 |
| Building a long cascading chain without documenting it | The next person to touch any table in the chain has no way to know what else will fire |
| No bypass mechanism for legitimate bulk loads | Every row of a validated nightly load pays full per-row trigger cost for no benefit |
| Calling a slow external system synchronously from inside a trigger | Every caller touching the table -- including plain native RPG I/O -- pays that latency, whether or not they know the trigger exists |
| Assuming a `SIGNAL` inside a trigger only affects the trigger's own work | It fails the entire firing statement, not just the trigger's side effect -- see Section 2 |
| Letting a cascading trigger chain become tribal knowledge that only one person remembers | The chain breaks (or gets modified incorrectly) the moment that person is unavailable -- see Section 21 |
| Writing new system-trigger (RPG buffer-parsing) logic for a need SQL triggers already cover | More code, more risk of getting an offset wrong, no compile-time validation against the table the way an SQL trigger's transition variables get |

---

## 23. Outdated vs. modern practices

| Outdated / Legacy | Modern / Recommended |
|---|---|
| Hand-parsing the raw trigger buffer for new development | `CREATE TRIGGER ... LANGUAGE SQL` with named transition variables/tables -- Section 15's technique still matters for reading/maintaining existing code, not for writing new code |
| Re-implementing the same validation rule in every RPG/CL program that writes to a table | One `BEFORE` trigger, enforced regardless of access path (Section 14.2) -- or a `CHECK` constraint if the rule is simple enough (Section 3) |
| Row-by-row trigger logic for bulk-safe processing | `FOR EACH STATEMENT` + `NEW TABLE`/`OLD TABLE` (Section 14.4) |
| Checking a "did this actually change" condition manually inside the trigger body | Declarative `WHEN` clause (Section 10) |
| Letting multiple same-event triggers on one table accumulate with no documented order | Consolidate into one trigger with explicit internal sequencing (Section 11) |
| No visibility into what triggers exist before changing a table | Query `QSYS2.SYSTRIGGERS`/`QSYS2.SYSTRIGDEP` as a standard step before schema changes (Section 17) |
| Assuming an unhandled `SQLCODE` means the calling program is broken | Check for triggers on the table first (Section 20) -- the caller may be innocent |

---

## 24. Production checklist

- Default to SQL triggers; reach for system triggers only for a specific, documented reason (Section 5).
- Ask whether a `CHECK`/`FOREIGN KEY` constraint, a default/generated column, or a stored procedure would do the job before reaching for a trigger at all (Section 3).
- Put validation in `BEFORE` triggers, not `AFTER` -- reject before writing, not after.
- Use `WHEN` to skip unnecessary firings instead of an `IF` at the top of the body.
- Use `FOR EACH STATEMENT` + transition tables for anything that could run against a large batch.
- Give every multi-trigger table a documented firing order, or better, consolidate into one trigger.
- Have a deliberate, restricted bypass mechanism for legitimate bulk loads (Section 16) -- don't rely on Db2 for i's recursion limits as your only defense.
- Document cascading chains explicitly, including in runbooks; verify them against `QSYS2.SYSTRIGGERS`/`SYSTRIGDEP` before relying on memory.
- Never put slow, external, or non-essential work directly in a trigger body -- queue it instead.
- Protect audit/history tables with tighter write authority than an ordinary working table.
- Name and document every trigger clearly enough that its purpose is obvious from the system catalog alone.
- Include triggers in deployment scripts and test both their success and failure paths before considering them done.

---

## 25. Hands-on exercises

Using `SQLTUTOR` and the tables built in this Deep Dive:

1. Add a `BEFORE INSERT` trigger on `SQLTUTOR.PRODUCT` that rejects any row with `UNIT_PRICE <= 0`.
2. Extend `TRG_PRODUCT_PRICE_AUDIT` (Section 14.1) to also fire on `QTY_ON_HAND` changes, logging to a second audit table -- think carefully about whether that belongs in the *same* trigger or a separate one, given Section 11's ordering guidance.
3. Rewrite `TRG_STOCK_SYNC` (Section 14.4) as a `FOR EACH ROW` trigger instead, and describe -- you don't need to benchmark it -- why it would perform worse against a 500-row bulk `INSERT` into `ORDER_DETAIL`.
4. Using the `TRGBYPASS` concept from Section 16, sketch (as a design, not runnable code) what would need to exist so that a specific *SQL* trigger, not the RPG one, also respects the same flag during a bulk load done through ACS rather than through `LOADPRICES`.

<details>
<summary>Hints (expand after you've tried)</summary>

- **#1:** Same shape as Section 14.2's `TRG_ORDER_DETAIL_VALIDATE` -- a `BEFORE INSERT` on `PRODUCT` with `REFERENCING NEW AS N` and a `SIGNAL` inside an `IF`.
- **#2:** One trigger with two independent `IF`/`WHEN`-style checks is usually easier to reason about than two triggers whose relative order you'd have to track -- but a single `WHEN` clause can only test one condition cleanly, so think about whether you need `WHEN (N.UNIT_PRICE <> O.UNIT_PRICE OR N.QTY_ON_HAND <> O.QTY_ON_HAND)` with branching inside, versus two separate triggers.
- **#3:** A `FOR EACH ROW` version issues one `UPDATE ... WHERE PROD_ID = :prod_id` per inserted line -- 500 lines means 500 separate `UPDATE` statements against `PRODUCT`, each with its own optimization/execution overhead, instead of the one aggregate `UPDATE` the statement-level version runs.
- **#4:** This is a design exercise, not a runnable one -- an SQL trigger can't read a CL data area directly, so you'd need a small SQL scalar function wrapping a call to a program that reads the data area (or a global/session variable set some other way), then reference that function's result in the trigger's `WHEN` clause or as the first check in its body. Sketch the pieces (function, what it wraps, where the trigger calls it) rather than trying to run it as-is.

</details>

---

## 26. Interview questions

- What's the fundamental difference between a stored procedure and a trigger?
- When would you choose a `CHECK` constraint instead of a trigger?
- When would you choose `BEFORE` over `AFTER`?
- What is `INSTEAD OF` for, and where can it be used?
- What is a transition table, and how is it different from a transition variable?
- Why is `FOR EACH STATEMENT` generally better than `FOR EACH ROW` for a bulk insert?
- Why does `BEGIN ATOMIC` appear in trigger bodies but not in procedure bodies?
- What happens if an `AFTER` trigger raises an error?
- What is the risk of cascading triggers, beyond performance?
- Why are triggers generally harder to debug than stored procedures?
- How do you find out what triggers exist on a table without asking anyone?
- What does `TRGUPDCND(*CHANGE)` do on a system trigger, and how does it differ from a SQL trigger's `WHEN` clause?
- Why should system triggers generally be avoided for new development in favor of SQL triggers?

---

## 27. Troubleshooting scenarios

**Scenario A -- "Orders that used to insert fine are now failing with SQLSTATE 75002, and nobody touched the order-entry program."**
Diagnosis: check `QSYS2.SYSTRIGGERS` for `SQLTUTOR.ORDER_DETAIL` -- most likely `TRG_ORDER_DETAIL_CREDIT_CHECK` (Section 14.2) was added or a customer's `CREDIT_LIMIT` was lowered, and the order-entry program is correctly being stopped by a rule it was never written to check for itself. This is the trigger doing its job, not a bug -- the fix is either raising the credit limit or reducing the order, not "fixing" the trigger.

**Scenario B -- "A nightly batch job that inserts 40,000 order-detail rows now takes four times as long as it used to."**
Diagnosis: `TRG_STOCK_SYNC` (Section 14.4) or an equivalent trigger was likely added since the job was last tuned. Check whether it's `FOR EACH ROW` (firing 40,000 times) -- if so, rewriting it statement-level with a transition table (as shown in Section 14.4) is the fix, not disabling it. If it's already statement-level and still slow, check for a cascading chain (Section 12) triggered by the same `INSERT`.

**Scenario C -- "A CHGDTAARA-based bulk load bypass (Section 16) was used for a one-off load, and now audit records seem to be missing for legitimate transactions that happened around the same time."**
Diagnosis: `MONMSG` didn't reset `TRGBYPASS` back to `'N'` because the job that was supposed to do so was cancelled or ended abnormally outside its own control flow (e.g., killed rather than allowed to fail normally). Always verify the bypass flag's state after any job that sets it, and consider a job-scoped or time-boxed alternative if `ENDJOB`-style terminations are a realistic risk in your environment.

**Scenario D -- "A trigger that writes to `CUSTOMER_HISTORY` seems to have stopped firing after a column was renamed on `CUSTOMER`."**
Diagnosis: an SQL trigger referencing a specific column by name in its body (not just `SELECT *`) fails to validate against a renamed column -- check whether the trigger shows as invalid, and confirm with `QSYS2.SYSTRIGGERS`. This is exactly the "audit what's attached before changing a table's structure" advice from Section 21 -- a column rename should always be checked against dependent triggers first.

---

## 28. Ask the AI Tutor

Good follow-up prompts once you've worked through the material above:

- "Explain database triggers on IBM i in simple terms."
- "Compare stored procedures and triggers on IBM i."
- "Explain BEFORE, AFTER, and INSTEAD OF triggers."
- "Show an SQL trigger that audits price changes."
- "Explain OLD and NEW transition variables."
- "Explain NEW TABLE and OLD TABLE transition tables."
- "Help me debug why an INSERT failed because of a trigger."
- "Explain system triggers and ADDPFTRG."
- "Explain cascading triggers and recursion risks."
- "Give me interview questions on IBM i database triggers."

---

## 29. Key takeaways

- A trigger fires automatically for every write to its table, through any access path -- unlike a stored procedure, which only runs when explicitly called. Reach for one only when a rule genuinely must hold regardless of caller; a constraint, default, or explicit procedure call is often the better fit (Section 3).
- Two families exist on IBM i: **SQL triggers** (`CREATE TRIGGER ... LANGUAGE SQL`, the modern default) and **system triggers** (`ADDPFTRG`, a compiled program parsing a raw buffer, invoked with two parameters -- the buffer and its length -- "DDS-based" is a legacy name, not a statement about how the underlying table was defined).
- `BEFORE` triggers can modify incoming values and reject the operation before anything is written; `AFTER` triggers see the completed change and can cascade to other tables; `INSTEAD OF` triggers (views only) replace the operation entirely.
- `FOR EACH ROW` + transition variables (`N`/`O`) suit per-row logic; `FOR EACH STATEMENT` + transition tables (`NEW TABLE`/`OLD TABLE`) suit bulk-safe, set-based logic -- and cost the same regardless of row count.
- `WHEN` declaratively skips unnecessary firings -- cheaper than an `IF` at the top of the trigger body.
- Trigger bodies use `BEGIN ATOMIC ... END`, distinct from a procedure's plain `BEGIN ... END`.
- Trigger side effects are part of the same unit of work as the statement that fired them -- a `SIGNAL` anywhere in the chain fails the whole statement, including the original write; there's no standard reason to add an explicit `COMMIT`/`ROLLBACK` inside a trigger body itself.
- Cascading and recursive triggers need deliberate design: document chains (including in runbooks), query `QSYS2.SYSTRIGGERS`/`SYSTRIGDEP`, and build a restricted, logged bypass mechanism for legitimate bulk operations rather than relying on Db2 for i's recursion limits.
- Triggers run implicitly, so protect audit/history tables and validate inputs the same as you would anywhere else -- a trigger being "internal" doesn't make its inputs automatically safe.
- When something fails with an unexpected `SQLCODE`/`SQLSTATE` and the calling program hasn't changed, check for a trigger before assuming the program is broken.

---

## What's next: future Deep Dives

This Deep Dive deliberately stays focused on trigger mechanics -- it does not go deep on SQL constraints as a topic in their own right, full authority/security design, journaling internals, performance tuning beyond the trigger-specific notes in Section 19, or commitment control. Those are natural, planned follow-ups:

1. SQL Error Handling with SQLCODE and SQLSTATE
2. Native I/O vs SQL Decision Guide
3. Commitment Control with SQL and RPGLE
4. SQL Performance Basics on IBM i

Check the [Deep Dives catalog](/deep-dives) for their current status.
