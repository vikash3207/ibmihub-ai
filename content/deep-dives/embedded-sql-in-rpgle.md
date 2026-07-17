## Who this is for

This Deep Dive builds directly on [SQL on IBM i](/deep-dives/sql-on-ibm-i) and the `SQLTUTOR` schema it creates -- work through that one first if you haven't, since every example below queries those same tables. You should be comfortable writing SQL interactively and comfortable reading a free-format RPGLE program. This guide is about the third piece: calling SQL **from inside an RPG program**, the way production IBM i applications actually use it -- and like every Deep Dive on iRPGenie, it goes deep enough for a working developer, not just far enough for a first example to compile.

By the end you'll be able to:

- Explain what the SQL precompiler does to your source before the RPG compiler ever sees it
- Declare host variables that match your table's columns, including nullable ones, and know what to name them
- Write a **singleton SELECT** to fetch one row into a program, and know exactly when that pattern is safe
- Write a **cursor loop** to process a multi-row result set
- Perform `INSERT`/`UPDATE` from RPG and understand why commitment control matters
- Check `SQLCODE` correctly, use `GET DIAGNOSTICS` when the code alone isn't enough, and recognize the specific codes embedded SQL raises that interactive SQL usually doesn't
- Build one **dynamic** embedded SQL statement safely, with parameter markers instead of string concatenation

**You'll need an IBM i partition to compile and run the programs below** -- a local Windows machine can't compile SQLRPGLE. If you don't have access to one, read through anyway; every example is annotated so the logic stands on its own, and you'll be ready to run it the moment you do have access.

---

## 1. Where embedded SQL fits

| Approach | Use it when |
|---|---|
| Native I/O (`CHAIN`, `SETLL`, `READE`) | Record-level access to a single file by key, tight loops, existing RPG programs you're maintaining |
| **Embedded SQL** (this Deep Dive) | The statement's shape is fixed in your program -- joins, aggregates, set-based updates -- and you want compile-time validation |
| Dynamic embedded SQL (`PREPARE`/`EXECUTE`) | The statement's shape has to change at runtime (optional filters, user-built criteria) |
| Interactive/dynamic SQL (ACS, JDBC/.NET) | Ad hoc queries, external applications, tools |

Embedded SQL is not "SQL instead of RPG" -- it's SQL statements woven directly into an RPG program's logic, compiled together into one program object. (For the fuller side-by-side of native I/O against SQL as a general decision, see [Native RPGLE File I/O vs Embedded SQL](/learn/ibm-i-fundamentals/native-rpgle-file-io-vs-embedded-sql); a dedicated Native I/O vs SQL Decision Guide Deep Dive is also on the roadmap.)

---

## 2. What the precompiler actually does

```text
SQLRPGLE Source (EXEC SQL blocks + RPG logic)
       |
SQL Precompiler   -- validates every EXEC SQL block against the real database:
       |              table/column names, data types, authority
Generated RPG     -- each EXEC SQL block replaced with generated
       |              calls to the Db2 runtime
RPG Compiler
       |
Program Object
```

This is the payoff of static embedded SQL: if you misspell `SQLTUTOR.CUSTOMER` or reference a column that doesn't exist, **the compile fails**, not a production run six months from now. Compare that to dynamic SQL text built as a string -- the database never sees it until the line actually executes. (See [Basic EXEC SQL Syntax in RPGLE](/learn/ibm-i-fundamentals/basic-exec-sql-syntax-in-rpgle) for the block structure itself.)

---

## 3. Source setup and compiling

Source member type: **`SQLRPGLE`** (not `RPGLE`). This is the detail that trips people up most: an `RPGLE`-type member does **not** run the SQL precompiler at all -- `EXEC SQL` blocks in an `RPGLE` member either fail to compile or, depending on your compile options, are simply never processed as SQL. The member type is what tells the system to precompile first.

To compile:

```text
CRTSQLRPGI OBJ(MYLIB/GETCUST) SRCFILE(MYLIB/QRPGLESRC) SRCMBR(GETCUST) +
           COMMIT(*NONE) OPTION(*EVENTF) DBGVIEW(*SOURCE)
```

- **`COMMIT`** controls the default commitment control level for embedded SQL in this program. `*NONE` (no commitment control) is fine for read-only or simple single-statement examples, and is what the read-only programs below assume. Section 11 covers why a program with more than one related write needs a deliberate choice here instead.
- **`OPTION(*EVENTF)`** writes compile messages to an event file your editor/tooling (RDi, or the *Code for IBM i* VS Code extension) can read and show inline -- worth turning on by default rather than only checking the spooled job log.
- **`DBGVIEW(*SOURCE)`** makes source-level debugging possible against the actual `SQLRPGLE` member, instead of the debugger only being able to show you the generated RPG.
- If you're using RDi or VS Code with *Code for IBM i*, the same compile is available as a right-click **Compile SQL RPGLE** action -- same command underneath.

This is not the full `CRTSQLRPGI` option list -- there are many more (`DATFMT`, `CLOSQLCSR`, `RDB`, `SQLPKG` handling, and more) that matter for specific situations but aren't needed to get started.

---

## 4. Host variables: bridging RPG and SQL

A **host variable** is an RPG variable referenced inside an `EXEC SQL` block with a leading colon. SQL reads from it and writes to it directly -- no separate API calls needed.

| SQL column type | Matching RPG declaration |
|---|---|
| `INT` | `Dcl-S CustId Int(10);` |
| `VARCHAR(n)` | `Dcl-S CustName Varchar(50);` |
| `CHAR(n)` | `Dcl-S Status Char(1);` |
| `DECIMAL(p,s)` | `Dcl-S CreditLimit Packed(9:2);` |
| `DATE` | `Dcl-S OrderDate Date;` |

Declare host variables with plain `Dcl-S` -- no special SQL declare section is needed in modern free-format RPGLE.

A few practical notes worth internalizing, not just memorizing the table above:

- **Match the SQL column's type closely, not just "close enough."** A `DECIMAL(9,2)` column should map to a packed decimal with the *same* precision and scale (`Packed(9:2)`) -- a mismatched scale doesn't always error, it can silently round or truncate.
- **`VARCHAR` maps naturally to RPG `Varchar`.** You don't need to fake a variable-length column with a fixed `Char` and manual trimming.
- **`DATE` columns map to RPG's `Date` type.** Resist the temptation to declare a date column as a character or numeric host variable "to make formatting easier" -- let the type system do the conversion.
- **Nullable columns require an indicator variable** (next section) -- there's no way around this; a host variable alone cannot represent SQL `NULL`.
- **Host variable names don't have to match the column name**, but clear naming pays for itself the first time you're debugging -- `CustId` for `CUST_ID`, `CustName` for `CUST_NAME`. It's normal and expected for SQL column names to use `UPPER_SNAKE_CASE` while RPG host variables use `PascalCase`/`camelCase` -- that's a naming-convention difference between the two languages, not something that needs to be resolved by making them match exactly.

### Indicator variables: handling NULL

`SQLTUTOR.CUSTOMER.CITY` and `.STATE` allow `NULL` (no `NOT NULL` in the [SQL on IBM i](/deep-dives/sql-on-ibm-i) DDL). **An RPG variable has no real concept of "null" -- it always holds *some* value.** The bridge is an **indicator variable**, a small integer paired with the host variable:

```rpgle
Dcl-S CustCity Varchar(30);
Dcl-S CityInd  Int(5);
```

```rpgle
Exec Sql
  Select City Into :CustCity:CityInd
  From SqlTutor.Customer
  Where Cust_Id = :CustId;
```

After the fetch:

- **`CityInd = 0`** means a real, non-null value came back, and it's now sitting in `CustCity`.
- **`CityInd = -1`** means the column was SQL `NULL`. In this case, **`CustCity` should be treated as unreliable/unchanged -- never trust its contents when the paired indicator is negative.**
- **Skip the indicator variable entirely on a column that can be `NULL`, and the fetch itself can fail** with `SQLCODE -305` the first time a genuinely `NULL` row comes back -- the engine has nowhere to put "this was null" without one. Section 7's SQLCODE table covers this explicitly.

---

## 5. A NULL test row for SQLTUTOR (optional setup)

The `SQLTUTOR.CUSTOMER` sample rows from [SQL on IBM i](/deep-dives/sql-on-ibm-i) all happen to have real `CITY`/`STATE` values, which means there's nothing in the existing data to actually exercise the `CityInd = -1` branch above. If you want to see it happen instead of just reading about it, add one more row with those columns deliberately left out:

```sql
INSERT INTO SQLTUTOR.CUSTOMER
  (CUST_ID, CUST_NAME, CREDIT_LIMIT)
VALUES
  (5, 'Null City Test', 1000.00);
```

Because `CITY` and `STATE` aren't listed, they're inserted as `NULL` -- this row exists purely to test indicator-variable handling, not as a realistic customer. Section 9's `GETCUST` program uses `CustId = 5` specifically to walk the `CityInd = -1` path; when you see it, remember what it means: the fetch succeeded, but the column genuinely has no value, and `CustCity` at that point still holds whatever it held before the fetch -- not a blank, not a zero-length string, just "don't look at this."

---

## 6. Checking SQLCODE -- the habit that saves you

Every `EXEC SQL` statement sets `SQLCODE` (and `SQLSTATE`) as a side effect. The one rule that matters more than any other in embedded SQL:

> **Check `SQLCODE` after every `EXEC SQL` statement that can fail. Never assume it worked.**

```rpgle
If SqlCode = 0;
   // exactly one row found -- proceed
ElseIf SqlCode = 100;
   // no row matched -- not an error, handle it as "not found"
Else;
   // real error -- SqlCode holds the reason, log it, don't silently continue
   Dsply ('SQL error: ' + %Char(SqlCode));
EndIf;
```

An alternative style some shops use is `EXEC SQL WHENEVER`, which tells the precompiler to auto-generate a branch after *every subsequent* SQL statement:

```rpgle
Exec Sql Whenever SqlError Goto ErrorRoutine;
Exec Sql Whenever Not Found Goto NotFoundRoutine;
```

This Deep Dive checks `SqlCode` explicitly after each statement instead -- it's more verbose but keeps the control flow visible in the code you're reading, which is easier to follow the first time through.

---

## 7. Embedded SQL SQLCODE reference

Interactive SQL mostly hands you `0`, `+100`, and a handful of common negative codes. Embedded SQL adds a few that are specific to host variables, indicators, and the singleton-`SELECT` pattern:

| SQLCODE | Meaning |
|---:|---|
| `0` | Success. |
| `+100` | No row found for `SELECT INTO`, or end of cursor during `FETCH`. Not an error by itself. |
| `-305` | A `NULL` value was returned, but no indicator variable was provided for that column -- see Section 4. |
| `-407` | `NULL` assigned to a `NOT NULL` column. |
| `-530` | Foreign key violation. |
| `-803` | Duplicate key -- a primary key or unique constraint violation. |
| `-811` | `SELECT INTO` returned more than one row -- see Section 9. |
| `-913` | Lock/deadlock/timeout-type issue. Another job may be holding a conflicting lock. |

In production code, **don't stop at displaying `SQLCODE`.** Log `SQLCODE`, `SQLSTATE`, the message text (Section 8), some indication of which statement and program raised it, and the key input values where it's safe to log them. A bare `SqlCode = -305` in a log file six months from now tells you far less than "GETCUST: fetch on SQLTUTOR.CUSTOMER, CustId=7, SQLCODE -305 -- missing indicator on a nullable column."

---

## 8. GET DIAGNOSTICS: when SQLCODE alone isn't enough

`SQLCODE` tells you *that* something went wrong and roughly *what class* of problem it was, but not always the specific detail -- which column, which constraint, which object. `GET DIAGNOSTICS` retrieves the actual message text Db2 for i generated for the error:

```rpgle
Dcl-S SqlMsg Varchar(500);

Exec Sql
   Get Diagnostics Condition 1
      :SqlMsg = Message_Text;

Dsply ('SQL error ' + %Char(SqlCode) + ': ' + %Trim(SqlMsg));
```

This is worth reaching for anywhere a bare `SQLCODE` isn't giving you enough to act on -- especially during development and troubleshooting. In production, **log the diagnostics text rather than only `DSPLY`-ing it** (a `DSPLY` disappears the moment the job ends), and be deliberate about what you log: message text can occasionally echo back data values, so avoid logging it somewhere that isn't appropriately access-controlled for the data involved.

---

## 9. Hands-on Program 1: Singleton SELECT

The simplest embedded SQL pattern: fetch exactly one row into host variables. This program looks up one customer by ID and displays the result.

**Member: `GETCUST`, type `SQLRPGLE`**

```rpgle
**FREE
Ctl-Opt DftActGrp(*No) ActGrp(*New);

Dcl-S CustId      Int(10);
Dcl-S CustName    Varchar(50);
Dcl-S CustCity    Varchar(30);
Dcl-S CityInd     Int(5);
Dcl-S CreditLimit Packed(9:2);

CustId = 1;   // Rochester Manufacturing, from the SQLTUTOR sample data

Exec Sql
  Select Cust_Name, City, Credit_Limit
    Into :CustName, :CustCity:CityInd, :CreditLimit
    From SqlTutor.Customer
    Where Cust_Id = :CustId;

If SqlCode = 0;
   If CityInd < 0;
      CustCity = '(not on file)';
   EndIf;
   Dsply ('Customer: ' + %Trim(CustName));
   Dsply ('City:     ' + %Trim(CustCity));
   Dsply ('Credit:   ' + %Char(CreditLimit));
ElseIf SqlCode = 100;
   Dsply ('No customer found with ID ' + %Char(CustId));
Else;
   Dsply ('SQL error ' + %Char(SqlCode) + ' looking up customer');
EndIf;

*InLR = *On;
```

**Why this is called a "singleton SELECT," and why it's safe here:** it's only valid when the `WHERE` clause is guaranteed to match at most one row. Here that's guaranteed because `CUST_ID` is the primary key -- a primary-key lookup is the ideal case for this pattern. If the `WHERE` clause could ever match more than one row, `SELECT ... INTO` raises `SQLCODE -811` rather than silently picking one, which is exactly the safety net you want; if a query's `WHERE` clause *can* legitimately match multiple rows, that's your signal to use a cursor (Section 10) instead of a singleton `SELECT`.

**Run it:**
- `CustId = 1` -- prints Rochester Manufacturing's real data.
- **`CustId = 5`** (after adding the Section 5 null-test row) -- `SqlCode = 0`, but `CityInd < 0`, so you see `(not on file)` instead of trusting a stale/garbage `CustCity`. This is the indicator-variable path.
- **`CustId = 999`** (a value that doesn't exist in the sample data) -- exercises the `SqlCode = 100` "not found" path. Use `999`, not a small number like `4`, as your not-found test value -- a low customer ID is exactly the kind of value a real dataset is likely to actually contain, and using one is a common way to accidentally write a "not found" test that silently starts passing for the wrong reason once more sample data exists.

---

## 10. Hands-on Program 2: Cursor loop (multi-row results)

A singleton `SELECT` only works for one row. For a result set -- every open order for a customer, say -- you need a **cursor**: declare it, open it, fetch rows one at a time in a loop, close it.

> This section introduces the standard embedded SQL cursor loop -- enough to read a multi-row result set correctly and safely. A later Deep Dive (SQL Cursors on IBM i) will cover cursor options, scrollable cursors, updateable cursors, cursor lifecycle issues, and more advanced cursor patterns in depth.

**Member: `LISTORDR`, type `SQLRPGLE`**

```rpgle
**FREE
Ctl-Opt DftActGrp(*No) ActGrp(*New);

Dcl-S CustId      Int(10);
Dcl-S OrderId     Int(10);
Dcl-S OrderDate   Date;
Dcl-S OrderStatus Char(1);

CustId = 1;   // Rochester Manufacturing has two orders in the sample data

Exec Sql
  Declare OrdCurs Cursor For
    Select Order_Id, Order_Date, Status
    From   SqlTutor.Orders
    Where  Cust_Id = :CustId
    Order By Order_Date;

Exec Sql Open OrdCurs;

Exec Sql Fetch OrdCurs Into :OrderId, :OrderDate, :OrderStatus;

Dow SqlCode = 0;
   Dsply ('Order ' + %Char(OrderId) + '  '
          + %Char(OrderDate) + '  Status=' + OrderStatus);
   Exec Sql Fetch OrdCurs Into :OrderId, :OrderDate, :OrderStatus;
EndDo;

If SqlCode <> 100;
   Dsply ('Cursor ended with unexpected SqlCode ' + %Char(SqlCode));
EndIf;

Exec Sql Close OrdCurs;

*InLR = *On;
```

**The pattern to memorize** -- this is the standard shape of every embedded SQL cursor loop you'll ever write:

1. `DECLARE` the cursor (just registers the statement -- doesn't run it yet)
2. `OPEN` the cursor (runs the query, positions before the first row)
3. **Priming `FETCH`** before the loop starts
4. `DOW SqlCode = 0` -- loop while the last fetch succeeded
5. Process the row, then `FETCH` again at the *bottom* of the loop
6. When `SqlCode` comes back `100`, the loop ends naturally -- that's "no more rows," not an error
7. `CLOSE` the cursor -- **on every path that opened it, not just the happy one.** If an error branch returns out of the program early, close the cursor first (or restructure so cleanup runs regardless); a cursor left open past its useful life is a resource leak, not just an untidy habit. `SQLCODE 100` after a `FETCH` means normal end of data and needs no special handling beyond ending the loop; any other non-zero `SQLCODE` from a `FETCH` does need handling, the same as any other statement.

---

## 11. Hands-on Program 3: INSERT/UPDATE and commitment control

Embedded `INSERT`/`UPDATE`/`DELETE` look exactly like their interactive counterparts, just with host variables in place of literals. This program records a new order for a customer, using the same `SQLTUTOR` tables.

**Member: `ADDORDER`, type `SQLRPGLE`**

```rpgle
**FREE
Ctl-Opt DftActGrp(*No) ActGrp(*New);

Dcl-S NewOrderId Int(10);
Dcl-S CustId     Int(10);
Dcl-S ProdId     Int(10);
Dcl-S Qty        Int(10);
Dcl-S UnitPrice  Packed(9:2);

NewOrderId = 5005;
CustId     = 2;
ProdId     = 101;
Qty        = 3;
UnitPrice  = 89.00;

Exec Sql
  Insert Into SqlTutor.Orders (Order_Id, Cust_Id, Order_Date, Status)
  Values (:NewOrderId, :CustId, Current_Date, 'O');

If SqlCode <> 0;
   Dsply ('Insert into Orders failed, SqlCode=' + %Char(SqlCode));
   Exec Sql Rollback;
   *InLR = *On;
   Return;
EndIf;

Exec Sql
  Insert Into SqlTutor.Order_Detail (Order_Id, Line_No, Prod_Id, Qty, Unit_Price)
  Values (:NewOrderId, 1, :ProdId, :Qty, :UnitPrice);

If SqlCode <> 0;
   Dsply ('Insert into Order_Detail failed, SqlCode=' + %Char(SqlCode));
   Exec Sql Rollback;
   *InLR = *On;
   Return;
EndIf;

Exec Sql Commit;
Dsply ('Order ' + %Char(NewOrderId) + ' created successfully.');

*InLR = *On;
```

### The gotcha this program is built to teach

This program was compiled with `COMMIT(*NONE)` in Section 3's example -- but it calls `EXEC SQL COMMIT` and `ROLLBACK`. **With `COMMIT(*NONE)`, those statements are accepted but do nothing**, because there's no commitment control environment for them to act on -- every `INSERT` is effectively committed the instant it runs, and `ROLLBACK` can't undo it. `COMMIT(*NONE)` means `COMMIT`/`ROLLBACK` don't provide real rollback behavior; they're syntactically legal but functionally inert.

That's fine for a simple read-only example, but it means the two-table insert above isn't atomic: if the second `INSERT` fails after the first one succeeds, you're left with an order header and no detail line, and `ROLLBACK` won't clean it up. For anything where multiple statements must succeed or fail *together* -- exactly this order-header-plus-detail-lines scenario -- compile with a real commitment control level instead:

```text
CRTSQLRPGI OBJ(MYLIB/ADDORDER) SRCFILE(MYLIB/QRPGLESRC) SRCMBR(ADDORDER) +
           COMMIT(*CHG)
```

`COMMIT(*CHG)` (or another real commitment level -- `*ALL`, `*CS`, `*RR`) starts a real commitment control scope, so `ROLLBACK` actually reverts both inserts if the second one fails, and nothing is visible to other jobs until `COMMIT` runs. Don't leave order-header/order-detail writes non-atomic in a real application -- that's a decision every embedded SQL program with more than one related write has to make deliberately, not a default to leave at `*NONE`.

**One IBM i-specific detail worth knowing before you rely on this:** for commitment control to actually work, the tables involved need to be eligible for it -- in most environments, that means the underlying objects are journaled. A schema you create with plain SQL DDL and a traditional DDS-defined library can end up configured differently in this respect depending on your system and how journaling is set up. Before depending on commitment control in a real application, confirm journaling and commitment eligibility are actually in place in your environment -- don't assume `COMMIT(*CHG)` alone is sufficient just because the compile succeeded. The full mechanics of journaling and commitment control together are deliberately out of scope here and are covered in their own future Commitment Control Deep Dive.

---

## 12. Dynamic embedded SQL: when the statement shape must change at runtime

Everything so far had the exact SQL text known at compile time. Sometimes it can't be -- e.g., a search program where the caller may or may not supply a state filter. That's what `PREPARE`/`EXECUTE` are for.

**Use dynamic SQL only when the statement's shape must change at runtime.** If only the *values* change from call to call -- not the columns, tables, or clauses themselves -- prefer static embedded SQL with host variables; it's validated at compile time and doesn't need any of the machinery below.

**Member: `FINDCUST`, type `SQLRPGLE`**

```rpgle
**FREE
Ctl-Opt DftActGrp(*No) ActGrp(*New);

Dcl-S StateFilter Char(2);
Dcl-S SqlStmt     Varchar(200);
Dcl-S CustName    Varchar(50);
Dcl-S CustId      Int(10);

StateFilter = 'MN';

SqlStmt = 'Select Cust_Id, Cust_Name From SqlTutor.Customer ' +
          'Where State = ? Order By Cust_Name';

Exec Sql Prepare Stmt1 From :SqlStmt;
Exec Sql Declare DynCurs Cursor For Stmt1;
Exec Sql Open DynCurs Using :StateFilter;

Exec Sql Fetch DynCurs Into :CustId, :CustName;

Dow SqlCode = 0;
   Dsply (%Char(CustId) + '  ' + %Trim(CustName));
   Exec Sql Fetch DynCurs Into :CustId, :CustName;
EndDo;

Exec Sql Close DynCurs;

*InLR = *On;
```

**The one rule that matters here:** the `?` is a **parameter marker**, and `StateFilter`'s value is bound to it via `USING` -- the value is *never* spliced into `SqlStmt` as text. Building `SqlStmt` by concatenating a user-supplied string directly into the SQL text (`'... Where State = ''' + StateFilter + ''''`) is exactly the SQL injection pattern to avoid, and it's the same rule from the SQL on IBM i Deep Dive's best-practices list, just as applicable inside RPG. Parameter markers buy you two things at once: they close off injection risk, and they let Db2 for i reuse the access plan across calls with different filter values instead of re-optimizing every time.

One more asymmetry worth knowing up front: **dynamic SQL errors surface at runtime, not compile time.** A typo in `SqlStmt`'s text compiles cleanly -- there's nothing for the RPG compiler or the SQL precompiler to check, since the statement doesn't exist as real SQL until `PREPARE` runs. That's the tradeoff for the runtime flexibility dynamic SQL buys you.

---

## 13. Common compile-time and runtime issues

A quick-reference list of the mistakes that actually show up in practice, split by when they surface:

**Compile-time (precompiler/compiler catches these):**
- Source member compiled as `RPGLE` instead of `SQLRPGLE` -- `EXEC SQL` blocks aren't precompiled at all.
- A referenced table or column doesn't exist, or is misspelled -- caught immediately, which is the whole point of static embedded SQL.
- The schema/library isn't available in the compile environment (missing from the library list, or genuinely doesn't exist there yet).
- `*SQL` vs `*SYS` naming confusion causing an unqualified name to resolve against the wrong schema.

**Runtime (only show up when that code path executes):**
- Host variable data type mismatch with the SQL column (a near-miss precision/scale, or a type that converts unexpectedly rather than erroring).
- A nullable column fetched without an indicator variable (`SQLCODE -305`).
- `SELECT INTO` returning more than one row (`SQLCODE -811`).
- Commitment control expectations that don't match the program's actual `COMMIT` parameter -- code that assumes `ROLLBACK` works under `COMMIT(*NONE)`.
- Missing object authority to the schema, table, or view being accessed.
- Dynamic SQL text with a typo -- nothing catches this until `PREPARE`/`EXECUTE` actually runs that line.

---

## 14. Best practices checklist

- Check `SQLCODE` after every statement that can fail -- don't assume success.
- Use indicator variables for any column that allows `NULL`; check the indicator before trusting the host variable.
- Use `GET DIAGNOSTICS` (Section 8) when `SQLCODE` alone doesn't give you enough to act on, and log the result rather than only displaying it.
- Use a priming `FETCH` before every cursor loop, with the loop condition testing `SqlCode`.
- Close every cursor you open, on every code path, including error paths -- not just the happy one.
- Decide your commitment control level (`COMMIT` parameter) deliberately for any program with more than one related write -- don't leave it at `*NONE` by accident, and confirm the tables involved are actually journaled/commitment-eligible in your environment.
- In dynamic SQL, always bind runtime values with parameter markers (`?` + `USING`) -- never concatenate them into the SQL text. Reach for dynamic SQL only when the statement shape itself must change.
- Qualify table names (`SqlTutor.Customer`) inside `EXEC SQL` blocks the same as in interactive SQL, for the same library-list-independence reason.

---

## 15. Common mistakes

| Mistake | What actually happens |
|---|---|
| Forgetting the priming `FETCH` before a `DOW SqlCode = 0` loop | The loop body runs once with garbage/leftover host variable values before the first real fetch even happens |
| Treating `SQLCODE = 100` as an error | It means "no rows" -- a normal, expected outcome for many singleton SELECTs, not a failure to log and alarm on |
| Ignoring the indicator variable | You silently treat a `NULL` column as if it held its previous/uninitialized value, or hit `SQLCODE -305` |
| Compiling with `COMMIT(*NONE)` but relying on `ROLLBACK` to undo a failed multi-statement write | `ROLLBACK` is a no-op under `*NONE` -- see Section 11 |
| Building dynamic SQL text with string concatenation of user input | SQL injection risk, and the access plan can't be reused -- use parameter markers instead |
| Using `SELECT INTO` on a query that can legitimately return multiple rows | `SQLCODE -811` -- use a cursor instead |

---

## 16. Practice exercises

Using the `SQLTUTOR` schema and sample data (add the Section 5 NULL-test row first for exercise 1):

1. Insert the optional customer with a `NULL` city (Section 5), run `GETCUST` with `CustId = 5`, and confirm the `CityInd = -1` path prints `(not on file)` instead of trusting `CustCity`.
2. Change `GETCUST`'s `CustId` to `999` and confirm it takes the `SqlCode = 100` "not found" branch.
3. Write a new program, `LISTPROD`, that uses a cursor to list every product with `QTY_ON_HAND < 100`, displaying product name and quantity.
4. Extend `ADDORDER` to insert a *second* order detail line in the same order (use `Line_No = 2` for it -- remember the primary key on `Order_Detail` is `(Order_Id, Line_No)`), and verify both lines exist afterward.
5. Modify `FINDCUST` so that when `StateFilter` is blank, it returns *all* customers instead of none -- think about what `SqlStmt` needs to look like, and why `? = ''` won't do it for a blank filter meaning "no filter." (Hint: build the `WHERE` clause conditionally in RPG, generating the SQL text *without* a `WHERE` clause at all when there's no filter, rather than trying to make `?` match "any value.")
6. Add basic `GET DIAGNOSTICS` logic to `GETCUST` or `ADDORDER`, and display or log the message text the next time you deliberately trigger an error (e.g., temporarily reference a column that doesn't exist).

---

## 17. Interview questions

- What is embedded SQL in RPGLE, and how is it different from calling a stored procedure?
- What does the SQL precompiler do, and when does it run relative to the RPG compiler?
- Why should a source member be compiled as `SQLRPGLE` rather than `RPGLE`?
- What is a host variable?
- What is an indicator variable, and why is it needed?
- What does `SQLCODE +100` mean for `SELECT INTO` versus for a cursor `FETCH`?
- Why can `SELECT INTO` fail with `SQLCODE -811`?
- What is the standard cursor loop pattern (declare/open/fetch/close), and why does it need a priming fetch?
- Why is `COMMIT(*NONE)` risky for a program doing more than one related write?
- What is the difference between static embedded SQL and dynamic embedded SQL?
- Why should dynamic SQL use parameter markers instead of building the statement text with string concatenation?
- How can `GET DIAGNOSTICS` help beyond just checking `SQLCODE`?

(For scenario-style practice built around exactly these ideas, see [SQLRPGLE Interview Scenarios](/learn/ibm-i-fundamentals/sqlrpgle-interview-scenarios) and [SQLRPGLE vs Native I/O Interview Discussion](/learn/ibm-i-fundamentals/sqlrpgle-vs-native-io-interview-discussion).)

---

## 18. Ask the AI Tutor

Good follow-up prompts once you've worked through the material above:

- "Explain embedded SQL in RPGLE with a simple SELECT INTO example."
- "Help me understand host variables and indicator variables."
- "Explain why my embedded SQL program got SQLCODE -305."
- "Explain SQLCODE +100 in a cursor loop."
- "Show me the standard DECLARE, OPEN, FETCH, CLOSE cursor pattern."
- "Explain COMMIT(*NONE) vs COMMIT(*CHG) in CRTSQLRPGI."
- "Help me debug SQLCODE -811 in SELECT INTO."
- "Show me a safe dynamic SQL example using parameter markers in RPGLE."

---

## 19. Key takeaways

- Embedded SQL is SQL statements compiled directly into an RPG program -- validated against the real database at compile time, unlike dynamic SQL text.
- A source member must be type `SQLRPGLE`, not `RPGLE`, for `EXEC SQL` blocks to be precompiled at all.
- Host variables move data between RPG and SQL; indicator variables are the only way to represent `NULL` on the RPG side, and skipping one on a nullable column risks `SQLCODE -305`.
- Singleton `SELECT ... INTO` is for exactly-one-row lookups (primary-key lookups are the ideal case); anything that can return multiple rows needs a cursor, and using `SELECT INTO` anyway risks `SQLCODE -811`.
- Always check `SQLCODE` -- `0` is success, `+100` is "no more rows" (not an error), anything else needs handling; reach for `GET DIAGNOSTICS` when the code alone isn't enough to act on.
- Commitment control (`COMMIT(*NONE)` vs `*CHG`/`*ALL`) determines whether `COMMIT`/`ROLLBACK` actually do anything, and depends on the underlying tables being commitment-eligible (typically journaled) in your environment.
- Dynamic embedded SQL (`PREPARE`/`EXECUTE`/`USING`) exists for when the statement shape must vary at runtime -- bind values with parameter markers, never string concatenation, and prefer static SQL whenever only the values (not the shape) change.

---

## What's next: future Deep Dives

This Deep Dive deliberately stays focused on core embedded SQL mechanics -- it does not go deep on cursor options and lifecycle, stored procedures, triggers, commitment control internals, or SQL performance. Those are natural, planned follow-ups:

1. SQL Cursors on IBM i
2. Stored Procedures on IBM i
3. Database Triggers on IBM i
4. SQL Error Handling with SQLCODE and SQLSTATE
5. Native I/O vs SQL Decision Guide
6. Commitment Control with SQL and RPGLE
7. SQL Performance Basics on IBM i

Check the [Deep Dives catalog](/deep-dives) for their current status.
