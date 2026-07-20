## Who this is for

This Deep Dive builds on [SQL on IBM i](/deep-dives/sql-on-ibm-i), [Embedded SQL in RPGLE](/deep-dives/embedded-sql-in-rpgle), and [SQL Cursors on IBM i](/deep-dives/sql-cursors-on-ibm-i), and the `SQLTUTOR` schema/data all three create -- work through those first if you haven't. You're comfortable writing embedded SQL in RPGLE and comfortable with cursors, including the SQL PL `FOR` loop teased at the end of the cursors Deep Dive. This one covers packaging SQL logic as a **stored procedure** -- a named, callable unit of logic that lives in the database itself, callable from RPG, ACS, JDBC/.NET, Python, or another stored procedure, the same way regardless of caller.

By the end you'll be able to:

- Explain what a stored procedure buys you over embedding the same logic in every caller
- Tell **SQL procedures** and **external procedures** apart, and know when to reach for each
- Use all three parameter modes -- `IN`, `OUT`, `INOUT`
- Write SQL PL control flow: variables, `IF`, error handlers, and the cursor `FOR` loop
- Return a result set from a procedure and consume it from both ACS and RPG
- Register a compiled RPGLE program as a callable SQL procedure
- Recognize IBM i's procedure **overloading** (same name, different parameter signatures)
- Reason carefully about who owns a transaction when a procedure commits or rolls back
- Find and manage the procedures you create through the SQL system catalog

**On tooling:** the SQL procedure examples can be written and run from ACS Run SQL Scripts, but they still require access to an actual IBM i system where the `SQLTUTOR` schema exists -- ACS is a client, not a database. Creating and calling SQL procedures does not require compiling anything; the external (RPGLE) procedure example in Section 9 does require compiling a program on IBM i, the same as every embedded SQL example in the earlier Deep Dives.

> **These examples run against the SQLTUTOR practice schema.** Several insert or update sample data -- `PLACE_ORDER` inserts an order and its detail line, and the practice exercises ask you to create and modify procedures of your own. Run everything here only in a practice environment, and reload the `SQLTUTOR` sample data from [SQL on IBM i](/deep-dives/sql-on-ibm-i) if you want to repeat an earlier exercise exactly.

---

## 1. Why bother with a stored procedure?

Everything in the Embedded SQL in RPGLE Deep Dive's `ADDORDER` program -- insert an order header, insert its detail line, commit -- is logic that belongs to "creating an order," not to any one RPG program. Any client that needs to place an order (a different RPG program, a web app calling over JDBC, another stored procedure) would otherwise have to duplicate that exact sequence, including the commitment-control care that example required.

A stored procedure moves that logic into the database once, callable by name from anywhere:

```sql
CALL SQLTUTOR.PLACE_ORDER(5005, 2, 101, 3, 89.00, ?);
```

That one `CALL` is the whole pitch, for several concrete reasons:

- **Reusable business logic.** The rule for "how an order gets placed" lives in exactly one place, not copy-pasted into every RPG program, script, or integration that needs to place one.
- **One callable API for every kind of caller.** RPG, ACS, JDBC/.NET, Python, or another SQL PL routine all call it the same way -- the procedure doesn't care what's on the other end of the connection.
- **A security boundary through `EXECUTE` authority.** You can grant a caller `EXECUTE` on the procedure without granting direct `INSERT`/`UPDATE` rights on the underlying tables at all (more in Section 12).
- **Less duplication, easier maintenance.** Fix a bug or change a business rule once, in the procedure, instead of hunting down every caller that reimplemented the same logic slightly differently.
- **A natural fit for integration-style APIs.** A well-named procedure with a clear, stable parameter list is often exactly what an external system, DMS-style integration, or another team's application wants to call, without needing to understand your table structure at all.

**A caution worth stating up front:** a stored procedure is not automatically the *right* place for every piece of logic. Reach for one when database-side encapsulation genuinely helps -- multi-step writes that must stay atomic, logic every caller needs identically, or a deliberate API boundary. Don't let stored procedures become a dumping ground for business rules that would be just as well (or better) expressed in the application layer; a shop with hundreds of procedures nobody can account for is its own maintenance problem.

---

## 2. Stored procedure lifecycle

Before the details, here's the shape every stored procedure goes through, start to finish:

```text
CREATE PROCEDURE  (or CREATE OR REPLACE PROCEDURE while developing)
   |    registers the procedure's signature and logic (or external program) with Db2 for i
   v
CALL procedure-name(...)
   |    runs it -- from ACS, RPG, JDBC/.NET, or another routine
   v
Inspect the outcome
   |    OUT/INOUT parameter values, and/or an open result set (Sections 4 and 8)
   v
Find it again later
   |    QSYS2.SYSPROCS -- see Section 13
   v
Replace it as requirements change
   |    CREATE OR REPLACE PROCEDURE while developing -- no manual DROP first
   v
DROP PROCEDURE  (only when you actually mean to remove it)
```

The one habit worth building early: use `CREATE OR REPLACE PROCEDURE` while you're developing or iterating on a procedure, so you're not manually `DROP`ping and recreating on every change (and don't lose track of who currently has `EXECUTE` authority granted, since a plain `DROP` + `CREATE` loses existing grants where `CREATE OR REPLACE` does not). Reach for a real `DROP PROCEDURE` only when you actually intend to remove the routine, not as a routine step in normal development.

---

## 3. Two families of stored procedure

| | SQL Procedure | External Procedure |
|---|---|---|
| Where the logic lives | Written entirely in SQL PL, inside `CREATE PROCEDURE ... LANGUAGE SQL` | Registered by `CREATE PROCEDURE ... EXTERNAL NAME`, pointing at an already-compiled program object (typically RPGLE, but also CLLE, COBOL, C, or Java) |
| Best for | Logic that's naturally set-based/data-centric -- the kind of thing you'd otherwise write as a `SELECT`/`INSERT`/`UPDATE` sequence | Logic that needs something SQL PL can't do -- calling other program logic or IBM i APIs, or reusing complex existing business logic you don't want to rewrite |
| Compiled where | Inside the database when you run `CREATE PROCEDURE` -- no separate compile step | Separately, with `CRTSQLRPGI` (or `CRTBNDRPG`/`CRTCLPGM` for a procedure with no embedded SQL) -- `CREATE PROCEDURE` just points at the resulting object |
| What it registers against | Nothing external -- the SQL PL body *is* the procedure | A compiled program object today (this Deep Dive's example, Section 9); registering against a service program's exported procedure is a related but separate topic this Deep Dive doesn't cover -- treat it as a future, more advanced topic rather than assuming identical mechanics |

Sections 6-8 build SQL procedures; Section 9 builds an external one. Both are called exactly the same way (`CALL procedure-name(...)`) -- the caller never needs to know which kind it's talking to. Default to an SQL procedure; reach for an external procedure only when the logic needs something SQL PL genuinely can't do, or already exists as a compiled program you don't want to rewrite.

---

## 4. Parameter modes: IN, OUT, INOUT

Every parameter is declared `IN`, `OUT`, or `INOUT`:

| Mode | Meaning |
|---|---|
| `IN` (the default if you omit the keyword) | Caller passes a value in; the procedure reads it. Changes inside the procedure don't flow back to the caller. |
| `OUT` | The procedure sets a value; whatever the caller passed in is ignored/discarded. Used to return results. |
| `INOUT` | The caller passes a starting value in, the procedure can read *and* change it, and the final value flows back out. |

A few practical cautions to hold onto before the examples below:

- **`IN` is the default when you omit the mode keyword entirely** -- it's easy to accidentally leave a parameter `IN` when you actually meant `OUT`, and the symptom (the caller's variable never changes) can look like a bug somewhere else entirely.
- **Assign every `OUT` parameter on every successful path through the procedure**, including inside any exception handler. A `CALL` that returns without ever setting an `OUT` value leaves the caller holding whatever placeholder/default their client happened to supply -- not an error, just silently stale data.
- **Don't reach for `INOUT` casually.** It's the right tool when a value genuinely needs to flow both directions (like `APPLY_DISCOUNT` below), but using it out of habit for parameters that are really just inputs or just outputs makes a procedure's contract harder to read at the call site.
- **NULL handling deserves extra attention.** A parameter can arrive as `NULL`, and depending on `PARAMETER STYLE` (Section 9) and how you declare things, your logic needs to check for it explicitly rather than assume a value is always present.
- **Callers must supply a placeholder or host variable for every `OUT`/`INOUT` parameter**, not a literal -- ACS uses `?` (Section 6), RPG uses a host variable (`:CustName`), and other clients have their own equivalent. A literal in an `OUT`/`INOUT` position simply has nowhere to receive the returned value.

A minimal example showing `INOUT` next to `IN` -- a discount calculator that mutates a price in place:

```sql
CREATE OR REPLACE PROCEDURE SQLTUTOR.APPLY_DISCOUNT (
  INOUT P_PRICE DECIMAL(9,2),
  IN    P_PCT   DECIMAL(5,2)
)
LANGUAGE SQL
BEGIN
  SET P_PRICE = P_PRICE - (P_PRICE * P_PCT / 100);
END;
```

```sql
CALL SQLTUTOR.APPLY_DISCOUNT(89.00, 10);
```

Run that in ACS Run SQL Scripts and the results pane shows `P_PRICE` come back as `80.10` -- you supplied the starting value as a literal directly in the `INOUT` position (ACS accepts a literal there and treats it as the starting value), and Db2 for i returns the modified value in the same results pane, labeled with the parameter name. This procedure doesn't touch any table, so it's safe to run as many times as you like -- unlike the write-heavy examples starting in Section 7.

---

## 5. SQL PL essentials, at a glance

Before the next example, here's the vocabulary it uses -- the core of the SQL PL language you write inside `LANGUAGE SQL` procedure bodies:

| Statement | Purpose |
|---|---|
| `DECLARE v TYPE DEFAULT value;` | Declare a local variable |
| `SET v = expression;` | Assign a value |
| `IF cond THEN ... ELSEIF cond THEN ... ELSE ... END IF;` | Conditional branching |
| `WHILE cond DO ... END WHILE;` | Pre-test loop |
| `FOR v AS SELECT ... DO ... END FOR;` | Loop over a query's rows one at a time (Section 10) |
| `LEAVE label; ITERATE label;` | Break out of / restart a loop |
| `DECLARE EXIT HANDLER FOR condition BEGIN ... END;` | Catch an error condition and react to it, then end the procedure (Section 7) |
| `DECLARE CONTINUE HANDLER FOR condition BEGIN ... END;` | Catch an error condition, react to it, and keep executing the next statement (Section 7) |
| `SIGNAL SQLSTATE 'xxxxx' SET MESSAGE_TEXT = 'text';` | Raise your own error with a custom message |
| `GET DIAGNOSTICS ...` | Retrieve detailed information about the condition that was just raised (Section 7) |

---

## 6. Hands-on: a simple SQL procedure

The simplest useful shape: one `IN` parameter, some `OUT` parameters, one SQL statement doing the work.

```sql
CREATE OR REPLACE PROCEDURE SQLTUTOR.GET_CUSTOMER_CREDIT (
  IN  P_CUST_ID      INT,
  OUT P_CUST_NAME    VARCHAR(50),
  OUT P_CREDIT_LIMIT DECIMAL(9,2)
)
LANGUAGE SQL
BEGIN
  SELECT CUST_NAME, CREDIT_LIMIT
    INTO P_CUST_NAME, P_CREDIT_LIMIT
    FROM SQLTUTOR.CUSTOMER
    WHERE CUST_ID = P_CUST_ID;
END;
```

Calling it from ACS uses `?` placeholders for the `OUT` values:

```sql
CALL SQLTUTOR.GET_CUSTOMER_CREDIT(1, ?, ?);
```

The two `?`s mark where the `OUT` values come back -- ACS fills them in and shows `P_CUST_NAME = 'Rochester Manufacturing'`, `P_CREDIT_LIMIT = 50000.00` in the results pane. This is the SQL-procedure equivalent of the `GETCUST` pattern from Embedded SQL in RPGLE -- same singleton-lookup logic, now reusable from any caller instead of duplicated in every RPG program that needs it.

Calling the same procedure from RPGLE uses host variables in place of `?`:

**Member: `CALLCRED`, type `SQLRPGLE`**

```rpgle
**FREE
Ctl-Opt DftActGrp(*No) ActGrp(*New);

Dcl-S CustId      Int(10);
Dcl-S CustName    Varchar(50);
Dcl-S CreditLimit Packed(9:2);

CustId = 1;

Exec Sql Call SQLTUTOR.GET_CUSTOMER_CREDIT(:CustId, :CustName, :CreditLimit);

Dsply (%Trim(CustName) + '  Credit Limit: ' + %Char(CreditLimit));

*InLR = *On;
```

The three host variables line up positionally with the procedure's `IN`, `OUT`, `OUT` parameters -- `:CustId` supplies the input, and `:CustName`/`:CreditLimit` receive whatever the procedure sets.

---

## 7. SQL PL error handling, and a procedure that needs it

`GET_CUSTOMER_CREDIT` has nothing to go wrong beyond "no matching row." A procedure that performs multiple writes needs a real error-handling strategy, because a failure partway through a multi-statement write can leave the database in an inconsistent state if nothing catches it.

**The vocabulary, before the example:**

- **`EXIT` handler** -- catches the condition, runs the handler body, and then *ends the procedure*. Nothing after the handler (or after the statement that triggered it) runs.
- **`CONTINUE` handler** -- catches the condition, runs the handler body, and then *resumes execution at the next statement* after the one that failed. Useful when a failure is expected and recoverable in place, rather than fatal to the whole procedure.
- **`FOR NOT FOUND`** -- a specific, narrower handler for the "no row" condition (`SQLSTATE '02000'`), most useful around a `SELECT INTO` that might not match any row. It's more specific than `FOR SQLEXCEPTION`, and Db2 for i matches the most specific applicable handler for a given condition.
- **`FOR SQLEXCEPTION`** -- broad: catches *any* SQL error (any negative `SQLCODE`), raised by any statement below it in the same block.
- **A specific `SQLSTATE`** -- narrower still, for when you want to react differently to one particular error (say, a duplicate-key violation) than to SQL errors in general.
- **`SIGNAL SQLSTATE '...' SET MESSAGE_TEXT = '...'`** -- lets the procedure raise its own meaningful error instead of only reacting to Db2 for i's.

**Don't swallow an error without logging or returning something useful.** Catching `SQLEXCEPTION` and doing nothing but ending the procedure quietly is worse than letting the raw error propagate -- the caller (and whoever debugs this later) needs to know something failed and, ideally, why.

This example rebuilds the Embedded SQL in RPGLE Deep Dive's `ADDORDER` logic -- insert an order header, insert its detail line -- as a single atomic SQL procedure with a proper error handler, instead of RPG-side `SqlCode` checks after each statement:

```sql
CREATE OR REPLACE PROCEDURE SQLTUTOR.PLACE_ORDER (
  IN  P_ORDER_ID   INT,
  IN  P_CUST_ID    INT,
  IN  P_PROD_ID    INT,
  IN  P_QTY        INT,
  IN  P_UNIT_PRICE DECIMAL(9,2),
  OUT P_RESULT     VARCHAR(100)
)
LANGUAGE SQL
BEGIN
  DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
      ROLLBACK;
      SET P_RESULT = 'Order failed and was rolled back';
    END;

  INSERT INTO SQLTUTOR.ORDERS (ORDER_ID, CUST_ID, ORDER_DATE, STATUS)
    VALUES (P_ORDER_ID, P_CUST_ID, CURRENT_DATE, 'O');

  INSERT INTO SQLTUTOR.ORDER_DETAIL (ORDER_ID, LINE_NO, PROD_ID, QTY, UNIT_PRICE)
    VALUES (P_ORDER_ID, 1, P_PROD_ID, P_QTY, P_UNIT_PRICE);

  COMMIT;
  SET P_RESULT = 'Order created successfully';
END;
```

Try it two ways:

```sql
-- Success path
CALL SQLTUTOR.PLACE_ORDER(5005, 2, 101, 3, 89.00, ?);
-- P_RESULT: 'Order created successfully'

-- Failure path: reuse an ORDER_ID that already exists (violates the primary key)
CALL SQLTUTOR.PLACE_ORDER(5001, 2, 101, 3, 89.00, ?);
-- P_RESULT: 'Order failed and was rolled back'
```

`DECLARE EXIT HANDLER FOR SQLEXCEPTION` catches any SQL error raised anywhere in the block below it, immediately transfers control into the handler body, and -- because it's an `EXIT` handler, not `CONTINUE` -- the procedure ends right after the handler runs. This is the "check `SqlCode` after every statement" discipline from Embedded SQL in RPGLE, expressed declaratively: one handler covers every statement in the procedure instead of a manual check after each one.

> **For production procedures, "failed" is often not enough to act on.** Capture `SQLSTATE`, the message text, and relevant safe context (the operation attempted, safe key values) using `GET DIAGNOSTICS` inside the handler, and return or log it, rather than only a fixed string:
> ```sql
> DECLARE EXIT HANDLER FOR SQLEXCEPTION
>   BEGIN
>     DECLARE V_STATE SQLSTATE;
>     DECLARE V_MSG   VARCHAR(200);
>     GET DIAGNOSTICS CONDITION 1 V_STATE = RETURNED_SQLSTATE, V_MSG = MESSAGE_TEXT;
>     ROLLBACK;
>     SET P_RESULT = 'Order failed (' || V_STATE || '): ' || V_MSG;
>   END;
> ```
> This isn't a full error-handling topic on its own -- it's covered in more depth in Embedded SQL in RPGLE -- just a reminder that the same `GET DIAGNOSTICS` pattern applies just as well inside SQL PL.

### A note on transactions: who owns the COMMIT?

`PLACE_ORDER` issues its own `COMMIT` and `ROLLBACK`. That's a deliberate choice for *this* procedure -- it represents one complete, atomic unit of work ("place this order"), so it makes sense for it to own its own transaction boundary. That is not automatically true of every procedure you write, and it's worth deciding on purpose rather than by accident:

- Whether a `COMMIT`/`ROLLBACK` inside a procedure is correct depends on how the routine and the calling job are actually running under commitment control, and on what the caller expects to happen.
- If a procedure is meant to be one step inside a larger transaction a caller is composing, an internal `COMMIT` can commit more than the caller intended -- including work the caller isn't finished with yet.
- If a procedure is meant to be a complete, independent unit of work on its own (the way `PLACE_ORDER` is here), owning its `COMMIT`/`ROLLBACK` is reasonable, and often exactly what callers want: one `CALL`, one clean success/failure outcome.
- **Decide this explicitly for every procedure that writes data: does the procedure own the transaction, or does the caller?** Document the decision for whoever calls it, rather than letting whatever a `COMMIT` statement happens to do become the de facto, undocumented contract.
- Don't add a `COMMIT` to a procedure just because an example (including this one) has one -- add it because you've deliberately decided this specific procedure owns its own transaction.
- Db2 for i's `CREATE PROCEDURE` syntax includes routine attributes related to commit behavior in some SQL PL dialects (such as a `COMMIT ON RETURN` clause). If your environment relies on one, verify its exact current behavior in the IBM i SQL reference for your release before depending on it -- these interact with the job's own commitment control setting, and getting that interaction wrong is exactly the kind of subtle bug this section is warning about.

---

## 8. Hands-on: a procedure that returns a result set

`GET_CUSTOMER_CREDIT` returned scalar values through `OUT` parameters. To return a whole result set -- like the cursor examples in SQL Cursors on IBM i -- declare the cursor `WITH RETURN TO CLIENT` and leave it open:

```sql
CREATE OR REPLACE PROCEDURE SQLTUTOR.LIST_CUSTOMER_ORDERS (
  IN P_CUST_ID INT
)
LANGUAGE SQL
DYNAMIC RESULT SETS 1
BEGIN
  DECLARE C1 CURSOR WITH RETURN TO CLIENT FOR
    SELECT ORDER_ID, ORDER_DATE, STATUS
    FROM   SQLTUTOR.ORDERS
    WHERE  CUST_ID = P_CUST_ID
    ORDER BY ORDER_DATE;

  OPEN C1;
END;
```

`DYNAMIC RESULT SETS 1` tells Db2 for i up front that this procedure may hand back one open cursor to its caller. Notice there's no `FETCH`/`CLOSE` in the procedure at all -- it opens the cursor and stops; the *caller* fetches from it and closes it.

**Calling this from ACS is the easy case** -- just `CALL SQLTUTOR.LIST_CUSTOMER_ORDERS(1);` and the result set appears in the results grid, same as any `SELECT`.

**Calling it from RPG takes two extra steps**, because the RPG program has to explicitly attach a local cursor to the result set the procedure left open:

**Member: `CALLPROC`, type `SQLRPGLE`**

```rpgle
**FREE
Ctl-Opt DftActGrp(*No) ActGrp(*New);

Dcl-S CustId      Int(10);
Dcl-S OrderId     Int(10);
Dcl-S OrderDate   Date;
Dcl-S OrderStatus Char(1);
Dcl-S RsLocator   SqlType(Result-Set-Locator Varying);

CustId = 1;

Exec Sql Call SQLTUTOR.LIST_CUSTOMER_ORDERS(:CustId);

Exec Sql
  Associate Locator (:RsLocator) With Procedure LIST_CUSTOMER_ORDERS;

Exec Sql
  Allocate OrdRs Cursor For Result Set :RsLocator;

Exec Sql Fetch OrdRs Into :OrderId, :OrderDate, :OrderStatus;

Dow SqlCode = 0;
   Dsply ('Order ' + %Char(OrderId) + '  ' + %Char(OrderDate)
          + '  Status=' + OrderStatus);
   Exec Sql Fetch OrdRs Into :OrderId, :OrderDate, :OrderStatus;
EndDo;

Exec Sql Close OrdRs;

*InLR = *On;
```

Read this as: `CALL` runs the procedure and it opens `C1` internally; `ASSOCIATE LOCATOR` grabs a handle to that still-open cursor; `ALLOCATE CURSOR FOR RESULT SET` gives the handle a local name (`OrdRs`) your program can `FETCH` from -- no separate `DECLARE CURSOR` needed, `ALLOCATE` does that implicitly. From that point on, `OrdRs` behaves exactly like any other cursor from SQL Cursors on IBM i: prime-fetch, `DOW SqlCode = 0` loop, `CLOSE` at the end.

**Troubleshooting a result set that doesn't reach the caller:**

- **Forgetting `DYNAMIC RESULT SETS n` on the procedure** -- the result set doesn't reach the caller the way it should, even though the cursor itself opened successfully inside the procedure.
- **Closing the cursor before the procedure returns** -- there's nothing left open for the caller to attach to; the whole point of `WITH RETURN TO CLIENT` is to leave it open.
- **Using the wrong name in `ASSOCIATE LOCATOR ... WITH PROCEDURE`** -- the association is by the procedure's own name (as shown above), not by any local cursor name from inside the procedure body.
- **Expecting `OUT` parameters and a result set to behave the same way** -- they're two different return mechanisms; a procedure can use either, both, or neither, but consuming one doesn't automatically give you the other.
- **Returning more than one result set** requires `DYNAMIC RESULT SETS n` set to the actual count, and the caller has to handle each one explicitly (an additional `ASSOCIATE LOCATOR`/`ALLOCATE CURSOR` pair per result set) -- this Deep Dive only demonstrates the single-result-set case.

---

## 9. Hands-on: an external procedure (RPGLE)

An external procedure is a normal compiled `*PGM` -- `CREATE PROCEDURE` just tells Db2 for i how to call it as SQL. This one checks whether a proposed order amount fits under a customer's credit limit.

**Member: `CHKCREDIT`, type `SQLRPGLE`**

```rpgle
**FREE
Ctl-Opt DftActGrp(*No) ActGrp(*New);

Dcl-Pi *N;
  P_CustId   Int(10)      Const;
  P_OrderAmt Packed(9:2)  Const;
  P_Approved Char(1);
End-Pi;

Dcl-S CreditLimit Packed(9:2);

Exec Sql
  Select Credit_Limit Into :CreditLimit
  From   SQLTUTOR.CUSTOMER
  Where  Cust_Id = :P_CustId;

If SqlCode <> 0;
   P_Approved = 'N';
ElseIf P_OrderAmt <= CreditLimit;
   P_Approved = 'Y';
Else;
   P_Approved = 'N';
EndIf;

*InLR = *On;
```

Compile it exactly like any embedded SQL program:

```text
CRTSQLRPGI OBJ(MYLIB/CHKCREDIT) SRCFILE(MYLIB/QRPGLESRC) SRCMBR(CHKCREDIT) COMMIT(*NONE)
```

Then register it as a callable SQL procedure:

```sql
CREATE OR REPLACE PROCEDURE SQLTUTOR.CHK_CREDIT (
  IN  P_CUST_ID   INT,
  IN  P_ORDER_AMT DECIMAL(9,2),
  OUT P_APPROVED  CHAR(1)
)
LANGUAGE RPGLE
PARAMETER STYLE GENERAL
NOT DETERMINISTIC
EXTERNAL NAME 'MYLIB/CHKCREDIT';
```

```sql
CALL SQLTUTOR.CHK_CREDIT(1, 40000.00, ?);  -- P_APPROVED: 'Y' (under the 50,000 limit)
CALL SQLTUTOR.CHK_CREDIT(3, 40000.00, ?);  -- P_APPROVED: 'N' (Toronto's limit is 10,000)
```

A few things worth internalizing here:

- **`EXTERNAL NAME 'MYLIB/CHKCREDIT'` just points at the compiled program object** -- library and object name, exactly as you'd reference it anywhere else on IBM i. The `CREATE PROCEDURE` statement itself contains no business logic at all; every bit of the actual work is in the RPG source you already know how to write.
- **The SQL parameter list must match the program's parameter list exactly** -- same order, and compatible types and lengths. A mismatch here is a call-time problem, not something the `CREATE PROCEDURE` statement itself can catch for you, so keep both definitions in sync deliberately whenever one changes.
- **`PARAMETER STYLE GENERAL` means the RPG program's parameter list is exactly the business parameters, in order, with no extra plumbing.** There's also `GENERAL WITH NULLS`, which appends one extra indicator parameter per SQL parameter so the RPG program can detect/return `NULL`s (the RPG-side equivalent of the indicator variables from Embedded SQL in RPGLE, but for the procedure's own parameters rather than table columns) -- reach for it if any parameter genuinely needs to represent "no value," which `CHK_CREDIT` doesn't.
- **External procedures are a good fit for existing RPG/CL logic you don't want to rewrite**, or for logic that needs something SQL PL can't do -- calling other program modules, IBM i APIs, or business rules that already live in tested, compiled code.

External procedures aren't limited to RPGLE -- `LANGUAGE CL`, `LANGUAGE COBOL`, `LANGUAGE C`, and `LANGUAGE JAVA` are all valid, following the same pattern: compile the program in its native environment, then `CREATE PROCEDURE ... EXTERNAL NAME` to expose it to SQL callers. A CL program with no embedded SQL at all -- just system commands and parameters -- is just as valid an external procedure as an SQLRPGLE one; SQL is only relevant here as the calling convention, not a requirement of the host program. Registering a procedure against a service program's exported procedure (rather than a standalone `*PGM`) is a related, more advanced scenario this Deep Dive doesn't cover -- treat it as a future topic rather than assuming it works identically to what's shown here.

---

## 10. The cursor FOR loop, used for real

SQL Cursors on IBM i teased SQL PL's simplified cursor loop. Here it is in a working procedure that totals a customer's orders:

```sql
CREATE OR REPLACE PROCEDURE SQLTUTOR.ORDER_TOTAL_LOOP (
  IN  P_CUST_ID INT,
  OUT P_TOTAL   DECIMAL(11,2)
)
LANGUAGE SQL
BEGIN
  DECLARE V_TOTAL DECIMAL(11,2) DEFAULT 0;

  FOR ROW AS
    SELECT D.QTY, D.UNIT_PRICE
    FROM   SQLTUTOR.ORDERS       O
    INNER JOIN SQLTUTOR.ORDER_DETAIL D ON O.ORDER_ID = D.ORDER_ID
    WHERE  O.CUST_ID = P_CUST_ID
  DO
    SET V_TOTAL = V_TOTAL + (ROW.QTY * ROW.UNIT_PRICE);
  END FOR;

  SET P_TOTAL = V_TOTAL;
END;
```

```sql
CALL SQLTUTOR.ORDER_TOTAL_LOOP(1, ?);
```

No `DECLARE`/`OPEN`/`FETCH`/`CLOSE` at all -- `FOR ROW AS SELECT ... DO ... END FOR` handles every step automatically, and `ROW.QTY`/`ROW.UNIT_PRICE` reference the current row's columns by name inside the loop body.

**And once again -- this didn't need a loop.** `SELECT SUM(D.QTY * D.UNIT_PRICE) INTO P_TOTAL FROM SQLTUTOR.ORDERS O INNER JOIN SQLTUTOR.ORDER_DETAIL D ON O.ORDER_ID = D.ORDER_ID WHERE O.CUST_ID = P_CUST_ID;` does the identical job in one statement. The same rule from SQL Cursors on IBM i applies just as much inside SQL PL as it does in RPG: reach for a loop -- cursor-based or `FOR`-based -- only when the per-row work genuinely can't collapse into one SQL statement, such as calling another procedure per row or applying business logic no single query can express.

---

## 11. Calling conventions and overloading

You've now called procedures from ACS (`CALL proc(...)`) and from RPG (`EXEC SQL CALL proc(...)`) -- same syntax either way, which is the point of standardizing on `CALL`.

**Db2 for i also supports procedure overloading** -- the same procedure name registered more than once, with different parameter signatures, resolved by argument count/type at call time:

```sql
CREATE OR REPLACE PROCEDURE SQLTUTOR.FIND_PRODUCT (IN P_PROD_ID INT)
LANGUAGE SQL
DYNAMIC RESULT SETS 1
BEGIN
  DECLARE C1 CURSOR WITH RETURN TO CLIENT FOR
    SELECT * FROM SQLTUTOR.PRODUCT WHERE PROD_ID = P_PROD_ID;
  OPEN C1;
END;

CREATE OR REPLACE PROCEDURE SQLTUTOR.FIND_PRODUCT (IN P_PROD_NAME VARCHAR(50))
LANGUAGE SQL
DYNAMIC RESULT SETS 1
BEGIN
  DECLARE C1 CURSOR WITH RETURN TO CLIENT FOR
    SELECT * FROM SQLTUTOR.PRODUCT WHERE PROD_NAME LIKE '%' || P_PROD_NAME || '%';
  OPEN C1;
END;
```

```sql
CALL SQLTUTOR.FIND_PRODUCT(100);       -- resolves to the INT version
CALL SQLTUTOR.FIND_PRODUCT('Valve');   -- resolves to the VARCHAR version
```

Both procedures share the name `FIND_PRODUCT`; Db2 for i picks the matching one based on the argument's type at the call site -- genuinely useful for giving callers a natural "search by whatever you have" API without inventing separate names like `FIND_PRODUCT_BY_ID`/`FIND_PRODUCT_BY_NAME`.

**Overloading is a convenience, not a free pass to blur an API's meaning.** A few cautions worth keeping in mind:

- **Ambiguous calls can happen** when a literal or an expression's type is compatible with more than one overload -- Db2 for i has to pick one, and it may not be the one you meant. An explicit `CAST`, or a literal typed unambiguously (`CAST('100' AS VARCHAR(50))` versus a plain numeric `100`), can help steer the call to the overload you actually intend.
- **Don't overuse overloading for a genuinely unclear API.** If two overloads of the same name do meaningfully different things (rather than the same logical operation over different input types), separate, clearly-named procedures are usually the better choice for callers trying to understand what they're calling.

**Finding procedures you've created:** see Section 13 for the system catalog queries that list every procedure in `SQLTUTOR`.

---

## 12. Security and authority basics

A stored procedure is also a security boundary, not just a convenience:

- **Callers need `EXECUTE` authority on the procedure itself to `CALL` it** -- that's the authority check that actually applies, whether the caller is a person, an RPG program, or a JDBC/.NET client.
- **Direct authority on the underlying tables is a separate question**, and depends on your shop's authority model and the procedure's own design. Part of the appeal from Section 1 is that a caller can sometimes call a procedure that writes data without needing direct `INSERT`/`UPDATE` authority on the table itself -- but exactly how much authority a caller needs beyond `EXECUTE` varies by environment, so verify it for your own shop rather than assuming a specific behavior.
- **Don't expose broad update/delete capability casually.** A procedure that takes a table name, column name, or an entire `WHERE` clause as a parameter and acts on it generically is a much larger risk than one written for one specific, well-defined job -- prefer the latter.
- **Validate input parameters inside the procedure**, the same as you would in any RPG program -- a stored procedure living "in the database" doesn't make its caller's input automatically safe or well-formed.
- **Never build dynamic SQL by concatenating untrusted input into a statement string.** If a procedure genuinely needs dynamic SQL, use parameter markers the same way embedded SQL does, not string concatenation of caller-supplied values.
- **Log failures without logging secrets.** `GET DIAGNOSTICS` message text and safe key values are useful to capture; don't log full parameter dumps if any of them could be sensitive.

This is a practical starting point, not a full authority/security treatment -- adopted authority, authorization IDs, and the deeper security model each deserve their own dedicated Deep Dive, and aren't covered here.

---

## 13. Finding and managing procedures in the system catalog

`QSYS2.SYSPROCS` lists every procedure Db2 for i knows about, along with its language, parameter style, and (for SQL procedures) source-related metadata:

```sql
SELECT ROUTINE_NAME, ROUTINE_TYPE, EXTERNAL_LANGUAGE, PARAMETER_STYLE
FROM   QSYS2.SYSPROCS
WHERE  ROUTINE_SCHEMA = 'SQLTUTOR'
ORDER BY ROUTINE_NAME;
```

That's the fastest way to answer "what have I already created in `SQLTUTOR`?" once you've built up more than a couple of procedures -- especially useful for spotting an overload you forgot about (Section 11), or confirming a `CREATE OR REPLACE` actually took effect.

For a given procedure's parameter details -- names, positions, and modes -- `QSYS2.SYSPARMS` is the relevant catalog view. Column names for parameter mode and type can vary slightly by release, so check the current IBM i SQL reference for the exact columns before scripting against it:

```sql
SELECT *
FROM   QSYS2.SYSPARMS
WHERE  ROUTINE_SCHEMA = 'SQLTUTOR'
AND    ROUTINE_NAME   = 'PLACE_ORDER'
ORDER BY ORDINAL_POSITION;
```

For SQL procedures specifically, some catalog views also expose the original SQL PL source text (a `ROUTINE_DEFINITION`-style column) -- again, verify the exact column name against current documentation for your release rather than assuming it matches what's shown here.

**Managing procedures during development:** favor `CREATE OR REPLACE PROCEDURE` (Section 2) over a manual `DROP` + `CREATE` cycle while you're iterating, and reach for `DROP PROCEDURE` deliberately -- only when you actually intend to remove a routine, since dropping it removes the object callers may still depend on.

---

## 14. Production checklist

- Choose an SQL procedure vs. an external procedure intentionally (Section 3) -- default to SQL, reach for external only when SQL PL genuinely can't do the job or the logic already exists as tested compiled code.
- Use `IN`/`OUT`/`INOUT` correctly, and assign every `OUT` value on every success path.
- Define transaction ownership clearly for any procedure that writes data -- does the procedure own the `COMMIT`/`ROLLBACK`, or does the caller (Section 7)?
- Wrap multi-statement writes in an `EXIT HANDLER FOR SQLEXCEPTION`, and capture enough detail (via `GET DIAGNOSTICS`) to actually act on a failure later -- don't swallow errors silently.
- Validate input parameters, and never build dynamic SQL from unvalidated caller input (Section 12).
- Return result sets (`DYNAMIC RESULT SETS n` + `CURSOR WITH RETURN TO CLIENT`) instead of building an equivalent multi-row output through `OUT` parameters -- every client type (ACS, RPG, JDBC) knows how to consume it.
- Prefer a single SQL statement over a `FOR`/`WHILE` loop inside SQL PL whenever one is possible -- same rule as native cursors.
- Grant `EXECUTE` intentionally, and don't expose broad, generic update/delete capability through a procedure's parameters.
- Use `CREATE OR REPLACE PROCEDURE` while developing; `DROP PROCEDURE` only when you actually mean to remove it.
- Test from ACS and from at least one real caller (RPG, or whatever your actual consumers are) before considering a procedure done.
- Document what a procedure's result set and parameters mean -- especially transaction ownership and any `NULL` handling -- for whoever calls it next.

---

## 15. Common mistakes

| Mistake | What actually happens |
|---|---|
| Declaring a parameter `IN` when the caller needs the result back | The caller's variable never changes -- should have been `OUT` or `INOUT` |
| Forgetting to assign an `OUT` parameter on every success path | The caller receives stale/placeholder data with no indication anything is wrong |
| Forgetting `DYNAMIC RESULT SETS n` on a procedure that opens a cursor `WITH RETURN TO CLIENT` | The result set doesn't reach the caller the way it should |
| Skipping `ASSOCIATE LOCATOR`/`ALLOCATE CURSOR` when consuming a procedure's result set from RPG | You can't `FETCH` -- there's no local cursor name to fetch from yet |
| No `EXIT HANDLER` around a multi-statement write | A failure partway through leaves the database in an inconsistent state, and the caller gets Db2 for i's raw error instead of a clean, program-defined outcome |
| Catching `SQLEXCEPTION` and returning only a fixed "failed" message | No `SQLSTATE`, message text, or context survives for whoever has to debug it later -- use `GET DIAGNOSTICS` |
| Adding a `COMMIT` inside a procedure without deciding who owns the transaction | Commits more (or less) than a caller composing a larger transaction expects |
| Treating a stored procedure as a place to put every business rule | Turns the database into an untracked, hard-to-review pile of logic instead of a deliberate encapsulation boundary |
| Writing a `FOR` loop in SQL PL for something a single `SELECT`/`UPDATE` could do | Slower and more code than necessary -- same lesson as native cursors |
| Assuming `LANGUAGE RPGLE` procedures must contain embedded SQL | They don't -- `CREATE PROCEDURE ... EXTERNAL NAME` can point at any compiled `*PGM`, including plain RPG or CL with no SQL in it at all |

---

## 16. SQLCODE/SQLSTATE troubleshooting for stored procedures

| Symptom | SQLCODE | SQLSTATE | Notes |
|---|---:|---|---|
| Successful `CALL` | `0` | `00000` | No error; check `OUT` parameters/result set as designed. |
| No row found (e.g. inside a `SELECT INTO`) | `+100` | `02000` | Not an error by itself -- handle with `FOR NOT FOUND` where the "no row" case needs distinct handling from a real exception. |
| Duplicate key on `INSERT` | `-803` | `23505` | The scenario `PLACE_ORDER`'s failure path demonstrates -- a unique/primary key constraint rejected the row. |
| No matching procedure signature | `-440` | `42884` | Wrong argument count/type for any registered overload, or the name doesn't resolve to a procedure at all -- double-check the call against Section 11's overloading rules. |
| Referenced object not found | `-204` | `42704` | A table/schema the procedure body references doesn't exist or isn't in the resolution path -- common after running examples against a schema that wasn't fully set up. |
| Insufficient authority | `-551` | `42501` | The caller lacks the privilege attempted -- often missing `EXECUTE` on the procedure itself (Section 12). |
| External program/object not found at call time | *(no single fixed SQLCODE)* | -- | Treat as a symptom: the `CALL` fails immediately because the compiled object `EXTERNAL NAME` points at can't be resolved. Verify the library list and the exact qualified name registered. |
| Result set not returned as expected | *(no error code)* | -- | Not an exception -- the caller simply never receives a result set. See Section 8's troubleshooting list for the actual causes. |
| Caught inside an `EXIT`/`CONTINUE` handler | *(whatever code triggered it)* | -- | Use `GET DIAGNOSTICS` inside the handler to retrieve the real `SQLSTATE` and message text rather than guessing from the handler type alone. |

---

## 17. Practice exercises

Using `SQLTUTOR`:

1. Write an SQL procedure `GET_PRODUCT_INFO(IN p_prod_id, OUT p_name, OUT p_price, OUT p_qty)` modeled on `GET_CUSTOMER_CREDIT`.
2. Add a second handler to `PLACE_ORDER`'s idea: what would you need to change so that a `NOT FOUND` condition (e.g., an invalid `P_CUST_ID`) produces a distinct `P_RESULT` message from a genuine SQL error? (Hint: `DECLARE EXIT HANDLER FOR NOT FOUND` is a separate, more specific handler than `FOR SQLEXCEPTION`.)
3. Modify `CALLPROC` to call `SQLTUTOR.FIND_PRODUCT` (the `INT` overload from Section 11) instead of `LIST_CUSTOMER_ORDERS`, adjusting the host variables and `ASSOCIATE`/`ALLOCATE` targets accordingly.
4. Rewrite `CHK_CREDIT` as an SQL procedure instead of an external RPGLE one (i.e., the same logic, `LANGUAGE SQL`, no separate RPG source or compile step) and compare how much shorter it is for logic this simple -- then think about the case from Section 3 where an external procedure would still be the better choice.

<details>
<summary>Hints (expand after you've tried)</summary>

- **#1:** Same shape as `GET_CUSTOMER_CREDIT`, just against `SQLTUTOR.PRODUCT` and its three columns.
- **#2:** `DECLARE EXIT HANDLER FOR NOT FOUND ... SET P_RESULT = '...';` declared *before* the more general `FOR SQLEXCEPTION` handler -- Db2 for i matches the most specific applicable handler for a given `SQLSTATE`.
- **#3:** `FIND_PRODUCT` returns `PROD_ID`, `PROD_NAME`, `UNIT_PRICE`, `QTY_ON_HAND` -- four host variables and an `ASSOCIATE LOCATOR ... WITH PROCEDURE FIND_PRODUCT` (locator association is by procedure name, not by which overload got called).
- **#4:** The SQL version is a single `SELECT ... INTO` inside `BEGIN ... END`, no separate compile step -- genuinely shorter for this logic. External procedures earn their keep when the logic needs something SQL PL can't express, or already exists as tested RPG/CL you don't want to rewrite -- not for straightforward lookups like this one.

</details>

---

## 18. Interview questions

- What is a stored procedure on IBM i, and why use one instead of embedding the same SQL in every RPG program?
- What is the difference between an SQL procedure and an external procedure?
- What are `IN`, `OUT`, and `INOUT` parameters, and what happens if you get the mode wrong?
- What is SQL PL?
- What does a `DECLARE EXIT HANDLER FOR SQLEXCEPTION` do?
- What's the difference between an `EXIT` handler and a `CONTINUE` handler?
- How can a stored procedure return a result set to its caller?
- What does `DYNAMIC RESULT SETS n` mean, and what happens if you omit it?
- How does an RPG program consume a result set a procedure returns?
- What is `PARAMETER STYLE GENERAL`, and when would you need `GENERAL WITH NULLS` instead?
- When would an external RPGLE procedure be a better choice than an SQL procedure?
- What is procedure overloading, and how does Db2 for i decide which overload to call?
- Why should you be careful about adding a `COMMIT` inside a stored procedure?
- What authority does a caller need to run a procedure with `CALL`?

---

## 19. Ask the AI Tutor

Good follow-up prompts once you've worked through the material above:

- "Explain stored procedures on IBM i in simple terms."
- "Show me a SQL procedure with IN and OUT parameters."
- "Explain the difference between SQL procedures and external RPGLE procedures."
- "Explain DECLARE EXIT HANDLER FOR SQLEXCEPTION."
- "Help me debug a stored procedure that does not return a result set."
- "Show how RPGLE calls a stored procedure with OUT parameters."
- "Explain ASSOCIATE LOCATOR and ALLOCATE CURSOR FOR RESULT SET."
- "Explain PARAMETER STYLE GENERAL."
- "Give me interview questions on IBM i stored procedures."
- "When should I avoid a stored procedure?"

---

## 20. Key takeaways

- A stored procedure puts logic in one place in the database, callable identically from RPG, ACS, JDBC/.NET, Python, or any other SQL client -- instead of duplicated in every caller -- and it's also a security boundary through `EXECUTE` authority.
- SQL procedures (`LANGUAGE SQL`) are written entirely in SQL PL; external procedures (`LANGUAGE RPGLE`/`CL`/`COBOL`/`C`/`JAVA`) register an already-compiled program as callable SQL -- same `CALL` syntax either way.
- Parameters are `IN` (read-only, the default), `OUT` (return a value, ignore whatever came in -- always assign it on every success path), or `INOUT` (read the caller's value, return a possibly-changed one -- don't reach for it casually).
- `DECLARE EXIT HANDLER FOR SQLEXCEPTION` centralizes error handling for an entire procedure body; `CONTINUE` handlers resume after the failing statement instead of ending the procedure; `GET DIAGNOSTICS` turns "it failed" into something you can actually act on.
- A procedure returns a result set by opening a cursor `WITH RETURN TO CLIENT` under `DYNAMIC RESULT SETS n`; RPG callers attach to it with `ASSOCIATE LOCATOR` + `ALLOCATE CURSOR FOR RESULT SET`.
- Decide explicitly whether a writing procedure owns its own transaction (`COMMIT`/`ROLLBACK`) or leaves that to the caller -- don't let it happen by accident.
- The `FOR ... AS SELECT ... DO ... END FOR` loop is SQL PL's built-in cursor loop -- and the same "don't loop when one statement will do" rule still applies inside it.
- Procedures can be overloaded by parameter signature, and you can find every procedure you've created through `QSYS2.SYSPROCS`/`QSYS2.SYSPARMS`.

---

## What's next: future Deep Dives

This Deep Dive deliberately stays focused on stored procedure mechanics -- it does not go deep on database triggers, full SQLCODE/SQLSTATE error handling, native I/O comparisons, commitment control internals, or SQL performance tuning. Those are natural, planned follow-ups:

1. Database Triggers on IBM i
2. SQL Error Handling with SQLCODE and SQLSTATE
3. Native I/O vs SQL Decision Guide
4. Commitment Control with SQL and RPGLE
5. SQL Performance Basics on IBM i

Check the [Deep Dives catalog](/deep-dives) for their current status.
