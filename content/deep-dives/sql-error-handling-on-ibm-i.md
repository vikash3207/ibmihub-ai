## Who this is for

This Deep Dive assumes you're comfortable with [Embedded SQL in RPGLE](/deep-dives/embedded-sql-in-rpgle), [SQL Cursors on IBM i](/deep-dives/sql-cursors-on-ibm-i), [Stored Procedures on IBM i](/deep-dives/stored-procedures-on-ibm-i), and [Database Triggers on IBM i](/deep-dives/database-triggers-on-ibm-i) -- it's written for developers who already write `EXEC SQL`, cursors, and SQL PL routines regularly and want to stop treating error handling as an afterthought. This Deep Dive focuses specifically on `SQLCODE`, `SQLSTATE`, `GET DIAGNOSTICS`, and the production-grade SQLRPGLE and SQL PL error-handling patterns built on top of them. Section 1 is a compressed refresh of ground the earlier Deep Dives already covered piecemeal, not a first introduction -- from there, this chapter moves quickly into the production patterns those earlier chapters assumed you'd eventually formalize.

Reuses the `SQLTUTOR` schema from the four Deep Dives above, and adds two new tables introduced where they're needed: `SQLTUTOR.GL_ACCOUNT` (Section 5) and `SQLTUTOR.SQL_ERROR_LOG` (Section 6).

By the end you'll be able to:

- Classify any SQL outcome correctly using `SQLSTATE` class, not just a bare `SQLCODE` sign check
- Use `GET DIAGNOSTICS` to retrieve message text, row counts, and object names that `SQLCODE`/`SQLSTATE` alone don't carry
- Know exactly when `SQLCODE` stays `0` even though nothing happened -- and why `GET DIAGNOSTICS ROW_COUNT` is the only reliable signal for a searched `UPDATE`/`DELETE`/`MERGE`
- Build a reusable, production-grade diagnostic-capture and logging pattern that doesn't become a second point of failure
- Reason carefully about transaction ownership, savepoints, and who's allowed to `COMMIT`/`ROLLBACK`
- Use SQL PL condition handlers (`CONTINUE`/`EXIT`/`UNDO`, `RESIGNAL`) correctly inside procedures and triggers
- Design a retry strategy for lock timeouts and deadlocks that never blindly retries a non-idempotent write
- Explain why RPG's `MONITOR`/`ON-ERROR` does not, and cannot, replace checking `SQLCODE`/`SQLSTATE`

> **These examples create new objects and modify SQLTUTOR sample data.** This Deep Dive creates `SQLTUTOR.GL_ACCOUNT` and `SQLTUTOR.SQL_ERROR_LOG`, plus several new procedures. Run everything here only in a practice environment, and reload the `SQLTUTOR` sample data from [SQL on IBM i](/deep-dives/sql-on-ibm-i) if you want a clean slate afterward.

---

## 1. Concept refresh: how Db2 for i reports results

Every SQL statement -- interactive, embedded, dynamic, inside a routine -- updates the **SQLCA** (SQL Communications Area) as a side effect. In embedded RPGLE this happens automatically, without any explicit `INCLUDE`. Three outcomes matter, and they answer different questions:

| | `SQLCODE` | `SQLSTATE` |
|---|---|---|
| Meaning | `0` = success, `>0` = warning/no-data, `<0` = error | 5-character standardized code; first 2 characters are the *class* |
| Portability | Db2 for i-specific values | Largely portable across the Db2 family and other RDBMSs (SQL-standard where a standard value exists) |
| Granularity | One number per outcome | Class (2 chars) + subclass (3 chars) -- lets you reason about categories without memorizing every code |

**A naming note before any code.** Db2 for i's SQLCA structure exposes these same values under a pair of short, traditional field names -- `SQLCOD` and `SQLSTT` -- inherited from an era when RPG field names were limited to six characters; you may see these exact short names in older shop code, IBM reference material, or `EXEC SQL INCLUDE SQLCA`-based programs. This series uses the fuller `SqlCode`/`SqlState` spelling consistently in every RPGLE example, matching the four earlier Deep Dives -- but if you encounter `SqlCod`/`SqlStt` (or the row-count array, `SqlErrd`) in existing code, it's the identical mechanism, not a different one. Pick one style per program and stay consistent within it; this Deep Dive's own examples never mix the two.

Four outcome buckets, not two:

| Bucket | `SQLCODE` | `SQLSTATE` class | Example |
|---|---|---|---|
| Success | `0` | `00` | Row inserted, updated, deleted, or selected cleanly |
| Warning | `> 0` (not `100`) | `01` | Truncation, an implicit conversion, a fetch beyond declared array bounds |
| No data | `+100` | `02` | `SELECT INTO` found nothing, or a cursor/result-set `FETCH` is exhausted |
| Error | `< 0` | anything else (`21`, `22`, `23`, `24`, `40`, `42`, `57`, ...) | Constraint violation, lock timeout, invalid cursor state |

**A correction worth flagging up front, because it's easy to get wrong:** the "no data" bucket above is specifically about `SELECT INTO` and cursor/result-set `FETCH` exhaustion. A **searched** `UPDATE`, `DELETE`, or `MERGE` that matches zero rows does **not** raise `+100` -- `SQLCODE` stays `0`, because as far as Db2 for i is concerned, the statement ran successfully; it simply had nothing to act on. Section 4 is dedicated entirely to this distinction, because conflating it with the `+100`/no-data bucket above is one of the most common sources of a specific, quiet class of production bug.

Treat "no data" as its own bucket, not a variant of error or success. And treat `SQLCODE` and `SQLSTATE` as complementary, not redundant: `SQLCODE` tells you precisely *what happened on this platform*; `SQLSTATE`'s class tells you *what category of thing happened*, which is what lets you write one piece of classification logic that doesn't need updating every time a new specific `SQLCODE` shows up. `GET DIAGNOSTICS` (Section 3) is the third leg -- it's what gives you the *content* (message text, affected object names, row counts) that neither `SQLCODE` nor `SQLSTATE` carries by itself.

**How to read a statement's result, as one decision flow:**

```text
SQL statement executes
        |
        v
   SQLSTATE class?
        |
        +-- "00" ------------------> Success -- proceed
        |
        +-- "01" ------------------> Warning -- SQLCODE positive, not 100.
        |                            Log it. Decide per-warning whether to
        |                            proceed or treat as fatal (Section 2).
        |
        +-- "02" ------------------> No data -- SQLCODE = +100.
        |                            Contextual: expected, business failure,
        |                            or unexpected? (Section 4)
        |
        +-- other (21,22,23,24,      Error -- SQLCODE negative.
            40,42,57...) ---------->  GET DIAGNOSTICS immediately.
                                      Classify: recoverable vs fatal.
                                          |
                                          +-- Recoverable class?
                                          |   (57=lock/timeout, 40=rollback)
                                          |
                                          +-- Yes --> Consider retry (Section 9)
                                          |
                                          +-- No ---> Log, roll back, return
                                                      meaningful status (Section 6)
```

---

## 2. SQLCODE and SQLSTATE beyond the basics

`SQLCODE` and `SQLSTATE` answer different questions. `SQLCODE` is precise but platform-specific -- `-803` means "duplicate key" *on Db2*, and that exact number won't necessarily mean the same thing if logic is ever ported to a different SQL engine, or reused against a stored procedure called from a client library that only surfaces `SQLSTATE`. `SQLSTATE` trades precision for portability: its class (`23`, `40`, `57`, ...) is standardized, so classification logic written against the class survives both platform differences and the addition of new specific error codes you haven't seen yet.

### Why `SqlCode < 0` alone is insufficient

```rpgle
If SqlCode < 0;
   // handle error
EndIf;
```

This is correct as far as it goes, but it **silently drops every warning** (`SQLCODE` positive, not `100`). A truncated `VARCHAR` assignment, an implicit numeric conversion that lost precision, a `FETCH` that returned fewer array rows than requested (see [SQL Cursors on IBM i](/deep-dives/sql-cursors-on-ibm-i)) -- all of these are warnings, all of them have business consequences, and none of them trip `SqlCode < 0`. A program that only checks for negative `SQLCODE` will run for months looking healthy while quietly truncating data on every write.

**Equally, checking `SqlState <> '00000'` alone is a different mistake** -- it now catches warnings *and* no-data *and* errors all in the same branch, indiscriminately, which means routine "no rows found" outcomes get treated with the same alarm as a genuine constraint violation, and legitimate warnings get treated as hard failures worth aborting a batch job over.

### Classifying by SQLSTATE class

| Class prefix | Category | Typical response |
|---|---|---|
| `00` | Success | Proceed |
| `01` | Warning | Log; usually proceed, but inspect the specific subclass -- some warnings (e.g., string truncation on a write) are business-significant |
| `02` | No data | Contextual -- see Section 4's decision tree |
| `21` | Cardinality violation (e.g., a `SELECT INTO` matched more than one row) | Fatal -- a logic/design error, not a runtime condition to recover from |
| `22` | Data exception (conversion error, division by zero, string too long) | Usually fatal for the current operation; often a caller input problem |
| `23` | Constraint violation (unique, referential, check) | Recoverable at the *business* level (reject and inform the user) but not by retrying the same statement unchanged |
| `24` | Invalid cursor state | Programming defect (fetch after close, etc.) -- fatal, fix the code |
| `40` | Transaction rollback | Statement failed and was rolled back -- inspect subclass |
| `42` | Syntax error or access rule violation | Fatal -- bad SQL text or missing authority; not retryable without a code/authority fix |
| `57` | Resource not available (includes `57033`, lock timeout/deadlock) | **Retryable**, within limits -- Section 9 |
| `55`/`58` | Object not in a valid state / system error | Usually fatal, often needs operational intervention |

### Reusable RPGLE result-interpretation logic

```rpgle
Dcl-S SqlClass Char(2);

SqlClass = %Subst(SqlState : 1 : 2);

Select;
   When SqlState = '00000';
      // success
   When SqlClass = '01';
      // warning -- log, then decide per SQLCODE whether to continue
   When SqlClass = '02';
      // no data -- see Section 4 for classifying what this means here
   When SqlClass = '57';
      // resource unavailable (lock timeout/deadlock) -- retry candidate, Section 9
   When SqlClass = '23';
      // constraint violation -- business-level rejection, not a retry candidate
   Other;
      // everything else: treat as fatal until proven otherwise
EndSl;
```

Classify by `SQLSTATE` class first -- it's what makes the `Select`/`When` structure above stable as new specific `SQLCODE`s appear over time. Use the precise `SQLCODE` only for the handful of cases where you need Db2-for-i-specific precision within a class (distinguishing `-803` duplicate key from a different `23` subclass, for instance). Never rely on `SQLCODE` alone in new SQLRPGLE code, and never rely on `SqlState <> '00000'` as a single catch-all branch.

---

## 3. Advanced GET DIAGNOSTICS usage

`SQLCODE`/`SQLSTATE` tell you the *category*. `GET DIAGNOSTICS` tells you the *content* -- full message text, the specific table/column/constraint involved, and how many rows were affected. It reads from the **diagnostics area**, which Db2 for i populates after every SQL statement and which is organized in two layers:

| Layer | What it holds | How you retrieve it |
|---|---|---|
| **Statement diagnostics** | Facts about the statement as a whole: `ROW_COUNT` (rows affected), `NUMBER` (how many condition entries exist) | `GET DIAGNOSTICS :var = ROW_COUNT;` |
| **Condition diagnostics** | One entry *per condition* raised by the statement -- a single statement can raise more than one | `GET DIAGNOSTICS CONDITION 1 :var = MESSAGE_TEXT;` |

### Diagnostic items reference

| Item | Level | Always populated? | Notes |
|---|---|---|---|
| `ROW_COUNT` | Statement | Yes | Rows affected by `INSERT`/`UPDATE`/`DELETE`/`MERGE` -- Section 4 covers why this often beats `SQLCODE` for verifying a write actually did something |
| `NUMBER` | Statement | Yes | Count of condition entries -- normally `1`, but constraint checks and triggers can raise more |
| `RETURNED_SQLSTATE` | Condition | Yes | The `SQLSTATE` for that specific condition |
| `DB2_RETURNED_SQLCODE` | Condition | Yes | The Db2-for-i `SQLCODE` for that condition -- this is a documented Db2-specific *extension* item name; there's no bare `SQLCODE` diagnostic item in the SQL standard |
| `MESSAGE_TEXT` | Condition | Yes | Full, human-readable message -- always richer than the bare code |
| `MESSAGE_LENGTH` | Condition | Yes | Length of `MESSAGE_TEXT` -- useful because the receiving variable is typically over-declared and you don't want trailing blanks logged as if meaningful |
| `CONSTRAINT_NAME` | Condition | **Only for constraint-violation conditions (class `23`)** | Blank/unreliable otherwise -- never assume it's populated without checking `RETURNED_SQLSTATE` class first |
| `TABLE_NAME` | Condition | **Only when the condition is object-related** | Same caveat -- check applicability before trusting it |
| `COLUMN_NAME` | Condition | **Only when the condition is column-specific** | Not populated for row- or table-level conditions |
| `TRIGGER_NAME` | Condition | **Only when the condition originated inside a trigger** | This is how you tell "my `INSERT` failed" apart from "my `INSERT` succeeded but a trigger it fired rejected it" -- see the troubleshooting scenario in Section 16 |

Some Db2 for i releases expose additional condition items beyond this list (for example, a message-identifier item alongside `MESSAGE_TEXT`) -- treat this table as the reliable core set rather than an exhaustive one, and check the current SQL reference for your release if you need something more specialized than what's listed here. Items marked "only for..." are not blank-but-harmless when irrelevant -- reading them unconditionally and logging the result produces log entries that *look* informative but contain stale or empty values that mislead whoever reads them later. Always gate retrieval of object-specific items behind a check of `RETURNED_SQLSTATE`'s class.

### Diagnostics area lifecycle

```text
Connection idle
      |
      v
SQL statement executes  --------->  Diagnostics area populated
                                            |
                    GET DIAGNOSTICS reads it (read does NOT clear it)
                                            |
                                            v
              ANY subsequent SQL statement runs --> area OVERWRITTEN
              (including a diagnostic SELECT you run just to "check something")
```

**Preserving diagnostics before they're overwritten.** The diagnostics area is replaced by the *next* SQL statement, full stop -- including a statement you run purely to investigate the failure. Capture everything you need into RPG host variables **immediately** after the failing statement, before running anything else. Declare the capture variables up front, not inside the conditional block that uses them:

```rpgle
Dcl-S DiagSqlState Char(5);
Dcl-S DiagMsgText  Varchar(200);
Dcl-S DiagRowCount Int(10);

Exec Sql Update SQLTUTOR.PRODUCT Set Qty_On_Hand = Qty_On_Hand - :Qty
         Where Prod_Id = :ProdId;

If SqlCode < 0;
   // Capture NOW -- before any other EXEC SQL statement, including a logging INSERT
   Exec Sql Get Diagnostics :DiagRowCount = Row_Count;
   Exec Sql Get Diagnostics Condition 1
     :DiagSqlState = Returned_Sqlstate, :DiagMsgText = Message_Text;

   // Only NOW is it safe to run the logging INSERT (Section 6) --
   // it uses the captured host variables, not a live re-read of the SQLCA.
EndIf;
```

### Multiple conditions

A single failing statement -- especially one that fires a trigger with its own validation, or violates more than one constraint at once -- can raise more than one condition. `NUMBER` tells you how many; loop through them:

```rpgle
Dcl-S CondCount Int(10);
Dcl-S i         Int(10);
Dcl-S CondState Char(5);
Dcl-S CondMsg   Varchar(200);

Exec Sql Get Diagnostics :CondCount = Number;

For i = 1 To CondCount;
   Exec Sql Get Diagnostics Condition :i
     :CondState = Returned_Sqlstate, :CondMsg = Message_Text;
   // log or inspect each one -- don't assume condition 1 is "the" error
EndFor;
```

### Capturing diagnostics inside an SQL handler, and returning them to an RPG caller

Inside a stored procedure (see [Stored Procedures on IBM i](/deep-dives/stored-procedures-on-ibm-i)), an exit handler can capture diagnostics and pass them back through `OUT` parameters instead of leaving the RPG caller to reconstruct what happened from a bare `SQLCODE` on the `CALL` statement itself:

```sql
CREATE OR REPLACE PROCEDURE SQLTUTOR.RESERVE_STOCK (
  IN  P_PROD_ID   INT,
  IN  P_QTY       INT,
  OUT P_SUCCESS   CHAR(1),
  OUT P_SQLSTATE  CHAR(5),
  OUT P_MSG_TEXT  VARCHAR(200)
)
LANGUAGE SQL
BEGIN ATOMIC
  DECLARE EXIT HANDLER FOR SQLEXCEPTION
  BEGIN
    GET DIAGNOSTICS CONDITION 1
      P_SQLSTATE = RETURNED_SQLSTATE, P_MSG_TEXT = MESSAGE_TEXT;
    SET P_SUCCESS = 'N';
  END;

  SET P_SUCCESS  = 'Y';
  SET P_SQLSTATE = '00000';
  SET P_MSG_TEXT = '';

  UPDATE SQLTUTOR.PRODUCT
  SET    QTY_ON_HAND = QTY_ON_HAND - P_QTY
  WHERE  PROD_ID = P_PROD_ID AND QTY_ON_HAND >= P_QTY;

  IF ROW_COUNT = 0 THEN
    SET P_SUCCESS  = 'N';
    SET P_SQLSTATE = '02000';
    SET P_MSG_TEXT = 'Insufficient stock or product not found';
  END IF;
END;
```

The RPG caller now gets a structured, business-meaningful answer instead of parsing a raw `SQLCODE` off the `CALL`:

```rpgle
Exec Sql Call SQLTUTOR.RESERVE_STOCK(:ProdId, :Qty, :Success, :RcSqlState, :RcMsgText);

If Success = 'N';
   // RcSqlState/RcMsgText already populated by the procedure's own handler --
   // no need to re-derive anything from the SQLCA here
EndIf;
```

---

## 4. No-data and affected-row handling

`SQLCODE = +100` / `SQLSTATE = '02000'` means "the statement ran correctly and found nothing to act on." It is fundamentally *contextual*, not automatically bad -- but it means something different depending on which operation produced it:

| Source | What `+100`/`02000` actually means |
|---|---|
| `SELECT INTO` | No row matched the `WHERE` -- could be a valid "not found" or a genuine lookup miss depending on what the ID came from |
| Cursor `FETCH` | Normal, *expected* end-of-result-set signal -- the entire cursor-loop pattern from SQL Cursors on IBM i depends on this being routine, not exceptional |
| Searched `UPDATE` | **Db2 for i does not raise `+100` for this.** `SQLCODE` stays `0` even if zero rows matched -- you must check `GET DIAGNOSTICS ROW_COUNT` instead |
| Searched `DELETE` | Same as `UPDATE` -- `SQLCODE = 0` regardless of rows affected; `ROW_COUNT` is the only reliable signal |
| `MERGE` | Same -- `SQLCODE = 0`; `ROW_COUNT` tells you whether the matched or unmatched branch (or neither, if the source produced no rows) actually did anything |
| Stored-procedure result sets | Behaves like a cursor `FETCH` -- `+100` on exhaustion is routine |
| Aggregate functions (`SUM`, `COUNT`, ...) | **Never** raise `02000` for "no rows matched" -- `COUNT(*)` returns `0`, `SUM()` over zero rows returns `NULL`, and the statement itself reports `SQLCODE = 0` either way. Checking for "no data" after an aggregate query means checking the *returned value*, not the SQLCA |

**This table is the single most common source of a specific class of production bug:** code that treats `SQLCODE` as the universal signal for "did this operation do what I wanted," when for `UPDATE`/`DELETE`/`MERGE` the only true signal is `GET DIAGNOSTICS ROW_COUNT`. A GL posting `UPDATE` that matches zero rows because someone mistyped an account number reports `SQLCODE = 0` all day long -- "success" -- while silently posting nothing.

```rpgle
Exec Sql
  Update SQLTUTOR.GL_ACCOUNT
  Set    Balance = Balance + :PostAmount
  Where  Account_Id = :AccountId;

Exec Sql Get Diagnostics :RowsAffected = Row_Count;

If SqlCode < 0;
   // technical failure
ElseIf RowsAffected = 0;
   // SQLCODE here is still 0 -- Db2 for i does not treat "matched nothing"
   // as an error for a searched UPDATE. But posting to a non-existent GL
   // account is a real business failure that must be caught HERE, not
   // discovered later when the trial balance doesn't tie out.
Else;
   // RowsAffected = 1 as expected -- proceed
EndIf;
```

**Make `GET DIAGNOSTICS ROW_COUNT` a mandatory check for every `UPDATE`, `DELETE`, and `MERGE` that isn't guaranteed by a primary key to touch exactly one row** -- treat it with the same seriousness as checking `SQLCODE` itself, not as an optional extra.

### What does "no data" actually mean here?

```text
SQLCODE = +100 or ROW_COUNT = 0
      |
      v
Was a specific row expected to already exist by business logic?
(e.g., updating a known GL account)
      |
      +-- No, this is a routine lookup -----> Expected no data -- return
      |    (e.g. user-entered search)         a normal "not found" outcome
      |
      +-- Yes
             |
             v
      Did another process plausibly change/remove
      the row first?
             |
             +-- Yes (e.g. another job cancelled   Optimistic concurrency
             |    the order between read and        failure (Section 9).
             |    update) ----------------------->  Consider re-reading and
             |                                       re-evaluating, not
             |                                       blindly retrying.
             |
             +-- No -- the row should be           Unexpected missing data --
                  structurally guaranteed to        a data integrity concern.
                  exist -------------------------->  Log as an error, escalate.

      (N/A -- this was a business RULE check, e.g. "customer has no open
       orders" -- a business validation outcome, not a technical condition
       at all.)
```

---

## 5. Production SQLRPGLE error-handling patterns

Every example below follows the same discipline: capture diagnostics immediately, decide *continue / retry / return / roll back*, and be explicit about what gets logged and why. `SQLTUTOR.GL_ACCOUNT` is introduced here for the general-ledger examples:

```sql
CREATE TABLE SQLTUTOR.GL_ACCOUNT (
  ACCOUNT_ID   CHAR(8)       NOT NULL,
  ACCOUNT_NAME VARCHAR(50)   NOT NULL,
  BALANCE      DECIMAL(13,2) NOT NULL DEFAULT 0,
  PRIMARY KEY (ACCOUNT_ID)
);

INSERT INTO SQLTUTOR.GL_ACCOUNT VALUES
  ('4500-100', 'Accounts Receivable - Rochester Mfg', 0.00),
  ('4500-200', 'Accounts Receivable - Austin Fab',    0.00);
```

### 5.1 SELECT INTO -- customer lookup for an update screen

```rpgle
Exec Sql
  Select Cust_Name, Credit_Limit Into :CustName, :CreditLimit
  From SQLTUTOR.CUSTOMER Where Cust_Id = :CustId;

Select;
   When SqlCode = 0;
      // proceed to display/edit
   When SqlCode = 100;
      // no data (SQLSTATE 02000) -- expected outcome for an invalid ID typed
      // by a user; return a business "not found", not a technical error
   When %Subst(SqlState:1:2) = '21';
      // SQLSTATE 21000: more than one row -- CUST_ID is the primary key,
      // so this can ONLY mean the schema/constraint was compromised.
      // This is a fatal defect, not a runtime condition -- log and escalate,
      // do not attempt to "just take the first row" by switching to a cursor.
   Other;
      // genuine SQL error -- capture diagnostics (Section 3), log, return failure
EndSl;
```

`+100` here is routine -- screens get invalid IDs typed into them constantly, and that's a UI-level condition, not a system fault. `SQLSTATE 21000` on a primary-key lookup, by contrast, means something is fundamentally wrong (a corrupted unique index, or someone weakened the constraint) -- that's a page-the-DBA situation, precisely because it should be structurally impossible.

### 5.2 INSERT -- order header creation

```rpgle
Exec Sql
  Insert Into SQLTUTOR.ORDERS (Order_Id, Cust_Id, Order_Date, Status)
  Values (:OrderId, :CustId, Current_Date, 'O');

If SqlCode < 0;
   If %Subst(SqlState:1:2) = '23';
      // Duplicate ORDER_ID (SQLSTATE 23505) -- if OrderId is generated by
      // your own sequence/identity logic, this points at a generator bug,
      // not a transient condition -- do not retry with the same value.
   Else;
      // Any other error -- capture full diagnostics, log, roll back, return failure
   EndIf;
   Return;
EndIf;
```

### 5.3 UPDATE -- general-ledger balance posting

```rpgle
Exec Sql
  Update SQLTUTOR.GL_ACCOUNT
  Set    Balance = Balance + :PostAmount
  Where  Account_Id = :AccountId;

Exec Sql Get Diagnostics :RowsAffected = Row_Count;

If SqlCode < 0;
   // technical failure -- capture diagnostics, roll back, log with
   // business context: account, amount, posting batch ID
ElseIf RowsAffected = 0;
   // See Section 4 -- this is the operation that most needs ROW_COUNT
Else;
   // RowsAffected = 1 as expected -- proceed
EndIf;
```

### 5.4 DELETE -- removing a cancelled order line

```rpgle
Exec Sql
  Delete From SQLTUTOR.ORDER_DETAIL
  Where Order_Id = :OrderId And Line_No = :LineNo;

Exec Sql Get Diagnostics :RowsAffected = Row_Count;

If SqlCode < 0;
   // FK violation (23503) is plausible here if some other table still
   // references this line -- log with the FK constraint name from
   // GET DIAGNOSTICS CONSTRAINT_NAME (Section 3), not a generic message
ElseIf RowsAffected = 0;
   // Nothing deleted -- an optimistic-concurrency-style signal that
   // someone else already removed this line. Not necessarily an error:
   // the caller's *goal* ("this line should not exist") is already true.
EndIf;
```

### 5.5 MERGE -- synchronizing a staged price update

```rpgle
Exec Sql
  Merge Into SQLTUTOR.PRODUCT As P
  Using (Values (:ProdId, :NewPrice)) As S (Prod_Id, New_Price)
    On P.Prod_Id = S.Prod_Id
  When Matched Then
    Update Set Unit_Price = S.New_Price
  When Not Matched Then
    Insert (Prod_Id, Prod_Name, Unit_Price, Qty_On_Hand)
    Values (S.Prod_Id, 'PENDING NAME', S.New_Price, 0);

Exec Sql Get Diagnostics :RowsAffected = Row_Count;
```

**`GET DIAGNOSTICS` matters more for `MERGE` than any other DML statement:** a single `MERGE` can touch a row via the matched *or* unmatched path, and `ROW_COUNT` is your only signal for "did anything happen at all" -- there's no equivalent to `SQLCODE +100` telling you "zero rows matched," because `MERGE` doesn't fail just because one branch didn't fire.

### 5.6 Cursor processing -- payment batch with per-row failure isolation

```rpgle
Exec Sql
  Declare PayCurs Cursor For
    Select Order_Id, Cust_Id From SQLTUTOR.ORDERS Where Status = 'O';

Exec Sql Open PayCurs;
Exec Sql Fetch PayCurs Into :OrderId, :CustId;

Dow SqlCode = 0;
   Exec Sql Update SQLTUTOR.ORDERS Set Status = 'S'
            Where Current Of PayCurs;

   If SqlCode < 0;
      // A positioned UPDATE failing mid-cursor is a program defect or a
      // concurrency conflict (Section 9) -- NOT a reason to silently
      // skip the row and keep going. Capture diagnostics, decide whether
      // this row's failure should abort the whole batch or just this row.
   EndIf;

   Exec Sql Fetch PayCurs Into :OrderId, :CustId;
EndDo;

If SqlCode <> 100;
   // The loop ended for a reason OTHER than normal exhaustion -- this is
   // a FETCH failure, distinct from every UPDATE failure handled inside
   // the loop. Log separately; the cursor's own state is now unreliable
   // for further FETCHes.
EndIf;

Exec Sql Close PayCurs;
```

### 5.7 Dynamic SQL -- ad hoc account filter

```rpgle
SqlStmt = 'Select Account_Id, Balance From SQLTUTOR.GL_ACCOUNT Where Balance '
          + Operator + ' ?';

Exec Sql Prepare Stmt1 From :SqlStmt;
If SqlCode < 0;
   // PREPARE failure -- almost always a text-construction defect
   // (Section 10) rather than a data problem. Log the STATEMENT SHAPE,
   // not literal values if Operator/user input could contain anything sensitive.
   Return;
EndIf;

Exec Sql Declare DynCurs Cursor For Stmt1;
Exec Sql Open DynCurs Using :Threshold;
If SqlCode < 0;
   // OPEN failure is usually a parameter-marker/type mismatch --
   // a different root cause than a PREPARE failure; log distinctly (Section 10)
EndIf;
```

### 5.8 Stored-procedure call -- order placement

```rpgle
Exec Sql Call SQLTUTOR.PLACE_ORDER(:OrderId, :CustId, :ProdId, :Qty, :UnitPrice, :Result);

If SqlCode < 0;
   // The CALL itself failed (bad parameter count/type, procedure not found,
   // no EXECUTE authority) -- this is DIFFERENT from the procedure running
   // and its own internal handler reporting failure through :Result.
   // Conflating these two failure modes in logging hides which layer broke.
ElseIf %Subst(Result:1:6) <> 'Order ';
   // The CALL succeeded; the procedure's own business logic reported
   // failure through its OUT parameter
EndIf;
```

### 5.9 Result-set processing

```rpgle
Exec Sql Call SQLTUTOR.LIST_CUSTOMER_ORDERS(:CustId);
Exec Sql Associate Locator (:RsLocator) With Procedure List_Customer_Orders;
Exec Sql Allocate OrdRs Cursor For Result Set :RsLocator;

Exec Sql Fetch OrdRs Into :OrderId, :OrderDate, :OrderStatus;
Dow SqlCode = 0;
   // process
   Exec Sql Fetch OrdRs Into :OrderId, :OrderDate, :OrderStatus;
EndDo;

If SqlCode <> 100;
   // Result-set FETCH failures are rarer than cursor failures on a local
   // query, but not impossible -- e.g., the procedure's underlying query
   // hit a lock timeout after returning control to the caller. Handle
   // exactly like Section 5.6's cursor-loop failure.
EndIf;
```

### 5.10 SQL inside a service-program procedure -- who owns the transaction

A procedure inside a service program that runs embedded SQL and is called by many other procedures has one extra rule to follow: **its own error handling must not assume it owns the transaction.** A low-level utility procedure like `GetProductPrice()` should capture and *return* diagnostics to its caller -- never unilaterally `COMMIT` or `ROLLBACK` on behalf of code several call levels above it that has no idea this procedure touched the database at all. Section 6's transaction-ownership discussion covers this in depth; the rule to internalize here is: **the deeper a procedure sits in a call chain, the less it should assume about the transaction boundary.**

```rpgle
Dcl-Proc GetProductPrice Export;
  Dcl-Pi GetProductPrice Ind;
    ProdId  Int(10) Const;
    Price   Packed(9:2);
  End-Pi;

  Exec Sql Select Unit_Price Into :Price
    From SQLTUTOR.PRODUCT Where Prod_Id = :ProdId;

  // Returns success/failure to the CALLER -- does not COMMIT, ROLLBACK,
  // or log on the caller's behalf. The caller decides what a failed
  // lookup means for ITS transaction.
  Return (SqlCode = 0);
End-Proc;
```

---

## 6. Reusable error-handling architecture

A centralized diagnostic structure and logging procedure, reused by every program and service program in the application, is what turns "we have error handling" into "we have *consistent, queryable* error handling."

> **This is a pattern to adapt, not a drop-in production framework.** Adjust field sizes, names, and conventions to match your own shop's standards; protect any table like this from casual access the same as any other sensitive table; and think through retention/indexing (Section 14) before treating it as finished.

### 6.1 The error-log table

```sql
CREATE TABLE SQLTUTOR.SQL_ERROR_LOG (
  LOG_ID          BIGINT GENERATED ALWAYS AS IDENTITY,
  LOG_TS          TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PROGRAM_NAME    VARCHAR(10)   NOT NULL,
  MODULE_NAME     VARCHAR(10),
  PROCEDURE_NAME  VARCHAR(30),
  SQL_OPERATION   VARCHAR(20)   NOT NULL,
  STATEMENT_ID    VARCHAR(30),
  SQLCODE_VAL     INT,
  SQLSTATE_VAL    CHAR(5),
  MESSAGE_TEXT    VARCHAR(500),
  CONSTRAINT_NAME VARCHAR(128),
  TABLE_NAME      VARCHAR(128),
  COLUMN_NAME     VARCHAR(128),
  BUSINESS_KEY    VARCHAR(50),
  JOB_NAME        VARCHAR(30),
  USER_PROFILE    VARCHAR(10),
  SEVERITY        CHAR(1)       NOT NULL,   -- I=Info, W=Warning, E=Error, F=Fatal
  RETRY_ELIGIBLE  CHAR(1)       NOT NULL DEFAULT 'N',
  TRANSACTION_ID  VARCHAR(30),
  APP_CONTEXT     VARCHAR(200),
  PRIMARY KEY (LOG_ID)
);

CREATE INDEX SQLTUTOR.SQL_ERROR_LOG_TS_IDX  ON SQLTUTOR.SQL_ERROR_LOG (LOG_TS);
CREATE INDEX SQLTUTOR.SQL_ERROR_LOG_TXN_IDX ON SQLTUTOR.SQL_ERROR_LOG (TRANSACTION_ID);
```

Index on `LOG_TS` and `TRANSACTION_ID` -- the two columns every operational query and correlation lookup (Section 12) will filter on. A high-volume error log with no index beyond its identity primary key turns "find every error for transaction TXN-20481" into a full table scan the day it matters most, mid-incident. Never log values that don't belong in an error log in the first place -- passwords, tokens, or other secrets have no reason to end up in `MESSAGE_TEXT`/`APP_CONTEXT`, and a masking discipline (Section 12) should exist from the start rather than after an audit finds a problem.

### 6.2 The RPG diagnostic data structure

```rpgle
Dcl-Ds SqlDiag_t Qualified Template;
  ProgramName   Char(10);
  ModuleName    Char(10);
  ProcedureName Varchar(30);
  SqlOperation  Varchar(20);
  StatementId   Varchar(30);
  SqlCodeVal    Int(10);
  SqlStateVal   Char(5);
  MessageText   Varchar(500);
  ConstraintNm  Varchar(128);
  TableNm       Varchar(128);
  ColumnNm      Varchar(128);
  BusinessKey   Varchar(50);
  Severity      Char(1);
  RetryEligible Char(1);
  TransactionId Varchar(30);
  AppContext    Varchar(200);
End-Ds;
```

### 6.3 A reusable capture procedure

```rpgle
Dcl-Proc CaptureSqlDiag Export;
  Dcl-Pi CaptureSqlDiag;
    Diag Likeds(SqlDiag_t);
  End-Pi;

  Dcl-S CondCount Int(10);

  Diag.SqlCodeVal  = SqlCode;
  Diag.SqlStateVal = SqlState;

  Exec Sql Get Diagnostics :CondCount = Number;
  If CondCount > 0;
     Exec Sql Get Diagnostics Condition 1
       :Diag.MessageText  = Message_Text,
       :Diag.SqlStateVal  = Returned_Sqlstate;

     If %Subst(Diag.SqlStateVal:1:2) = '23';
        Exec Sql Get Diagnostics Condition 1
          :Diag.ConstraintNm = Constraint_Name,
          :Diag.TableNm      = Table_Name;
     EndIf;
  EndIf;
End-Proc;
```

### 6.4 Writing to the log -- without letting the logger cause a second failure

**This is the part of the framework most teams get wrong the first time:** the error logger runs precisely when something has already gone wrong, which is the worst possible moment to introduce a *new* SQL statement that can itself fail. If the logging `INSERT` shares the failing transaction's commitment scope and that transaction later rolls back, the log entry -- the one piece of evidence explaining *why* it rolled back -- disappears with it.

| Approach | Trade-off |
|---|---|
| **Same commitment scope as the business transaction** | Simplest to implement, but the log entry vanishes on rollback -- exactly when you need it most |
| **Separate commitment scope** for the logger | The log entry survives the business transaction's rollback. Adds complexity (a second connection/scope), but is the right default when "why did this fail" matters more than keeping the logging call trivially simple |
| **Data queue** | Decouples logging from the failing unit of work -- a monitor job drains the queue and writes to the table independently. Survives even a job ending abnormally, not just a rollback. Best for high-volume/batch scenarios where synchronous logging would add measurable overhead |
| **IBM i message** (a system message API such as `QSYS2.SEND_MESSAGE` or the `SNDPGMMSG` command) | Puts the failure directly into the job log or a monitored message queue with zero risk of a second SQL failure masking the first. Good as a *fallback*; weaker as a primary mechanism since job logs aren't as queryable as a table |
| **Fall back to a system message when database logging itself fails** | The safety net underneath all of the above -- if the `INSERT` into `SQL_ERROR_LOG` itself fails, don't let that exception disappear silently |

No single answer is correct for every application. An interactive customer-update screen can reasonably log synchronously in the same commitment scope, accepting that a rollback also rolls back its own audit trail. A high-volume GL posting batch needs a separate-commitment-scope or data-queue approach instead, because losing the *reason* a posting failed is operationally unacceptable there. Exactly how to implement a separate commitment scope or a decoupled data-queue writer is job/connection-management detail specific to your environment -- treat the table above as a decision framework, and verify the exact mechanics against your own shop's standards before building it.

```rpgle
Dcl-Proc LogSqlError Export;
  Dcl-Pi LogSqlError;
    Diag Likeds(SqlDiag_t) Const;
  End-Pi;

  Dcl-S JobName     Varchar(30);
  Dcl-S UserProfile Varchar(10);

  Exec Sql Values (Qsys2.Job_Name) Into :JobName;
  Exec Sql Values (User) Into :UserProfile;

  // Intended to run under a commitment scope isolated from the caller's
  // business transaction (see the trade-off table above), so this INSERT
  // can survive even if the caller subsequently rolls back.
  Exec Sql
    Insert Into SQLTUTOR.SQL_ERROR_LOG
      (Program_Name, Module_Name, Procedure_Name, Sql_Operation, Statement_Id,
       Sqlcode_Val, Sqlstate_Val, Message_Text, Constraint_Name, Table_Name,
       Column_Name, Business_Key, Job_Name, User_Profile, Severity,
       Retry_Eligible, Transaction_Id, App_Context)
    Values
      (:Diag.ProgramName, :Diag.ModuleName, :Diag.ProcedureName, :Diag.SqlOperation,
       :Diag.StatementId, :Diag.SqlCodeVal, :Diag.SqlStateVal, :Diag.MessageText,
       :Diag.ConstraintNm, :Diag.TableNm, :Diag.ColumnNm, :Diag.BusinessKey,
       :JobName, :UserProfile, :Diag.Severity,
       :Diag.RetryEligible, :Diag.TransactionId, :Diag.AppContext);

  If SqlCode < 0;
     // The LOGGER ITSELF just failed. Do NOT attempt another SQL INSERT here --
     // that risks the same failure looping. Fall back to a system message.
     Dsply ('SQL_ERROR_LOG insert failed, SQLCODE=' + %Char(SqlCode)
            + ' -- original error: ' + %Subst(Diag.MessageText:1:80));
  EndIf;
End-Proc;
```

### 6.5 Binder source

```text
STRPGMEXP PGMLVL(*CURRENT) SIGNATURE('SQLERRSVC')
  EXPORT SYMBOL('CAPTURESQLDIAG')
  EXPORT SYMBOL('LOGSQLERROR')
ENDPGMEXP
```

---

## 7. Commitment control and transaction recovery

Every trigger, procedure, and RPG program that participates in a multi-step business transaction touches the *same* commitment scope unless deliberately isolated -- Section 6.4's logging trade-off is the clearest example of when isolation is worth the added complexity. Journaling is what makes `COMMIT`/`ROLLBACK` and savepoints possible at all: every table involved in a transaction that needs rollback protection must be journaled; an unjournaled table's changes are not covered by `ROLLBACK` regardless of how carefully the RPG/SQL logic is written. Full journaling mechanics are their own future Deep Dive (Section 18) -- the practical rule here is simpler: if `ROLLBACK` needs to undo it, it needs to be journaled.

### Full transaction example: order posting with a savepoint

```rpgle
**FREE
Ctl-Opt DftActGrp(*No) ActGrp(*New);

Dcl-S TxnId Varchar(30);

TxnId = 'TXN-' + %Char(%Timestamp() : *Iso0);

Exec Sql Insert Into SQLTUTOR.ORDERS (Order_Id, Cust_Id, Order_Date, Status)
         Values (:OrderId, :CustId, Current_Date, 'O');
If SqlCode < 0;
   // header insert failed before anything else started -- nothing to roll
   // back yet; log and return
   Return;
EndIf;

Exec Sql Savepoint DetailsDone On Rollback Retain Cursors;

Exec Sql Insert Into SQLTUTOR.ORDER_DETAIL (Order_Id, Line_No, Prod_Id, Qty, Unit_Price)
         Values (:OrderId, 1, :ProdId, :Qty, :UnitPrice);

If SqlCode < 0;
   // Detail insert failed. Two choices: roll back to the savepoint (keep
   // the header, drop only the details -- appropriate if a partial header
   // with zero lines is a valid, cleanable state) or roll back the whole
   // transaction (appropriate if a header with no lines is NEVER valid,
   // which is the case for SQLTUTOR.ORDERS -- so this example rolls back
   // fully with a plain ROLLBACK, rather than ROLLBACK TO SAVEPOINT).
   //
   // The sequence that matters: the statement above already failed, so
   // diagnostics are captured FIRST (Section 3), into host variables --
   // THEN the decision to roll back is made, THEN logging runs using the
   // already-captured values (under its own commitment scope, Section 6.4,
   // so it survives the ROLLBACK below).
   Exec Sql Rollback;
   Return;
EndIf;

Exec Sql Update SQLTUTOR.GL_ACCOUNT Set Balance = Balance + :OrderTotal
         Where Account_Id = :ArAccountId;
Exec Sql Get Diagnostics :RowsAffected = Row_Count;

If SqlCode < 0 Or RowsAffected = 0;
   Exec Sql Rollback;
   Return;
EndIf;

Exec Sql Commit;
```

**The order of operations to internalize:** the failing statement runs, diagnostics are captured immediately into host variables, *then* the rollback/savepoint decision is made, *then* logging runs from the already-captured values -- never the other way around, and never with a "quick diagnostic check" squeezed in between the failure and the capture.

```text
RPG Program                Db2 for i              SQL_ERROR_LOG
     |                          |                (separate commitment scope)
     |--- INSERT order header ->|                        |
     |<-------- SQLCODE 0 ------|                        |
     |--- SAVEPOINT DetailsDone->|                        |
     |--- INSERT order detail -->|                        |
     |<---- SQLCODE -530 (FK) ---|                        |
     | (capture diagnostics immediately, into variables)  |
     |---------------------------------------------------->| INSERT log entry
     |--- ROLLBACK ------------->|                        |
     |<-- header AND detail both undone ------------------|
     | (return meaningful status to caller)               |
```

### Who owns the transaction boundary

The rule that prevents the most damaging class of bug in layered SQLRPGLE applications: **`COMMIT`/`ROLLBACK` belongs to whoever started the unit of work, never to a procedure several calls deep that has no visibility into what else is part of it.** A low-level procedure like Section 5.10's `GetProductPrice()` that issues its own `COMMIT` "just to be safe" silently commits *every other change* the caller had staged, whether or not the caller was ready -- a bug often diagnosed by the symptom "some of my changes get committed even when I roll back," with no obvious cause visible in the top-level program at all.

- **The top-level program/entry point owns the transaction boundary.** It decides when to `COMMIT` or `ROLLBACK`, full stop.
- **Nested procedures should be transaction-aware, not transaction-controlling**: they report success/failure (via return value or `OUT` parameters, Section 3's `RESERVE_STOCK` pattern) and let the caller decide what that means for the transaction.
- **Savepoints are preferable to a full rollback** when a failure is isolated and recoverable without discarding earlier, independently valid work in the same transaction -- e.g., one optional detail line failing validation while the header and other lines remain legitimate. A full rollback is correct when the failure invalidates the transaction's premise entirely.
- **A `CALL` across activation groups combined with unclear transaction ownership is precisely how "who's supposed to commit this" bugs get introduced.** Keep a single, explicit owner regardless of how many activation groups the call chain crosses.
- **Mixed native I/O and SQL in the same transaction is fully supported** -- a native `WRITE` and an `EXEC SQL INSERT` in the same job, on journaled files, both participate in the same commitment scope and both roll back together.

This Deep Dive deliberately stops at the practical transaction-recovery patterns error handling needs -- isolation levels, journal receiver management, and the deeper mechanics of commitment control are their own future Deep Dive (Section 18).

---

## 8. SQL condition handlers in routines and triggers

[Stored Procedures on IBM i](/deep-dives/stored-procedures-on-ibm-i) introduced `DECLARE EXIT HANDLER FOR SQLEXCEPTION`; [Database Triggers on IBM i](/deep-dives/database-triggers-on-ibm-i) used it inside triggers. Db2 for i supports three handler types:

| Handler | Behavior after it runs | Restriction |
|---|---|---|
| `CONTINUE` | Execution resumes at the statement *after* the one that raised the condition | None |
| `EXIT` | Execution leaves the enclosing compound statement (`BEGIN...END`/`BEGIN ATOMIC...END`) entirely | None |
| `UNDO` | Db2 for i rolls back everything the compound statement did so far, runs the handler, then exits the compound statement | **Only valid inside a `BEGIN ATOMIC` block** |

### Handler precedence and scope

A handler declared for a specific `SQLSTATE` value takes precedence over one declared for the broader `SQLEXCEPTION` condition class when both could apply -- Db2 for i matches the *most specific* applicable handler, the same mechanism the stored-procedures Deep Dive's exercises pointed at for `NOT FOUND` vs. `SQLEXCEPTION`. Handlers are scoped to the compound statement they're declared in; a handler declared in an inner `BEGIN...END` block doesn't apply to an outer one, and vice versa.

```sql
CREATE OR REPLACE PROCEDURE SQLTUTOR.INSERT_PRODUCT_SAFE (
  IN  P_PROD_ID INT, IN P_NAME VARCHAR(50), IN P_PRICE DECIMAL(9,2),
  OUT P_STATUS  VARCHAR(100)
)
LANGUAGE SQL
BEGIN ATOMIC
  -- Specific: catches ONLY duplicate-key (23505) -- more specific than
  -- the general handler below, so Db2 for i prefers it for that condition.
  DECLARE EXIT HANDLER FOR SQLSTATE '23505'
  BEGIN
    SET P_STATUS = 'Duplicate product ID -- not inserted';
  END;

  -- General: catches everything else classified SQLEXCEPTION
  DECLARE EXIT HANDLER FOR SQLEXCEPTION
  BEGIN
    DECLARE V_MSG VARCHAR(200);
    GET DIAGNOSTICS CONDITION 1 V_MSG = MESSAGE_TEXT;
    SET P_STATUS = 'Insert failed: ' || V_MSG;
  END;

  INSERT INTO SQLTUTOR.PRODUCT (PROD_ID, PROD_NAME, UNIT_PRICE, QTY_ON_HAND)
    VALUES (P_PROD_ID, P_NAME, P_PRICE, 0);

  SET P_STATUS = 'Inserted successfully';
END;
```

### NOT FOUND inside a cursor loop

```sql
CREATE OR REPLACE PROCEDURE SQLTUTOR.SUM_OPEN_ORDERS (IN P_CUST_ID INT, OUT P_TOTAL DECIMAL(11,2))
LANGUAGE SQL
BEGIN ATOMIC
  DECLARE V_DONE  SMALLINT DEFAULT 0;
  DECLARE V_QTY   INT;
  DECLARE V_PRICE DECIMAL(9,2);
  DECLARE C1 CURSOR FOR
    SELECT D.QTY, D.UNIT_PRICE FROM SQLTUTOR.ORDERS O
    INNER JOIN SQLTUTOR.ORDER_DETAIL D ON O.ORDER_ID = D.ORDER_ID
    WHERE O.CUST_ID = P_CUST_ID AND O.STATUS = 'O';

  DECLARE CONTINUE HANDLER FOR NOT FOUND SET V_DONE = 1;

  SET P_TOTAL = 0;
  OPEN C1;
  read_loop: LOOP
    FETCH C1 INTO V_QTY, V_PRICE;
    IF V_DONE = 1 THEN LEAVE read_loop; END IF;
    SET P_TOTAL = P_TOTAL + (V_QTY * V_PRICE);
  END LOOP;
  CLOSE C1;
END;
```

**Why `CONTINUE`, not `EXIT`, here:** exhausting a cursor is the *normal* end of the loop, not a failure -- an `EXIT` handler would abandon the procedure the instant the last row was read, before `P_TOTAL` could be returned. This is the SQL PL mirror of the `Dow SqlCode = 0` RPG pattern.

### RESIGNAL: log, then let the original condition propagate

Swallowing an error inside a `CONTINUE` handler without `RESIGNAL`ing it is how serious failures get silently hidden -- the calling code sees a clean outcome and has no idea a real problem occurred underneath. `RESIGNAL` lets a handler add value (logging, diagnostics capture) *without* pretending nothing went wrong:

```sql
DECLARE EXIT HANDLER FOR SQLEXCEPTION
BEGIN
  DECLARE V_STATE CHAR(5);
  DECLARE V_MSG   VARCHAR(200);
  GET DIAGNOSTICS CONDITION 1 V_STATE = RETURNED_SQLSTATE, V_MSG = MESSAGE_TEXT;

  INSERT INTO SQLTUTOR.SQL_ERROR_LOG (PROGRAM_NAME, SQL_OPERATION, SQLSTATE_VAL, MESSAGE_TEXT, SEVERITY)
    VALUES ('POST_GL_ENTRY', 'UPDATE', V_STATE, V_MSG, 'E');

  RESIGNAL;  -- re-raises the ORIGINAL condition after logging it
END;
```

`RESIGNAL SQLSTATE '75010' SET MESSAGE_TEXT = 'GL posting failed -- see error log'` (a specific state/message instead of a bare `RESIGNAL`) is the right move when the caller needs a stable, application-defined error rather than whatever raw Db2 for i condition happened to occur underneath -- converting a low-level failure into a meaningful application error without losing the original diagnostic trail, since the log entry above already captured it.

### SQL routine handlers vs. SQLRPGLE checking

| | SQL PL handlers | SQLRPGLE checking |
|---|---|---|
| Declared | Once per compound statement, applies to everything inside it | Repeated after every individual `EXEC SQL` statement |
| Granularity | Condition-class or specific `SQLSTATE`, matched automatically | Whatever the code explicitly checks -- nothing is automatic |
| Where it runs | Inside the database engine, close to the data | In the calling program, potentially far from where the failure occurred |
| Best for | Centralizing a repeated reaction (log-and-continue, log-and-resignal) across many statements in one routine | Per-statement business decisions requiring RPG-side context (screen state, other host variables) that SQL PL can't see |

They aren't competitors -- a well-built stored procedure uses handlers internally (Section 3's `RESERVE_STOCK`) *and* the RPG caller still checks the `CALL` statement's own `SQLCODE`, because those cover two different failure layers (Section 5.8).

---

## 9. Locking, deadlocks, timeouts, and retry strategies

`SQLCODE -913` / `SQLSTATE 57033` covers both a lock wait timeout and a true deadlock -- Db2 for i distinguishes the specific cause in the accompanying message text, but both share the same class-`57` treatment for retry purposes: **transient, potentially retryable, but only under specific conditions.**

| Condition | Retryable? | Reasoning |
|---|---|---|
| Lock timeout (`57033`, waiting on another job) | **Yes**, with limits | The other job may release the lock shortly; a short backoff often succeeds |
| Deadlock victim (`57033`) | **Yes**, with limits | You were chosen as the victim specifically so the *other* transaction could proceed -- retrying yours is the expected recovery |
| Duplicate key (`23505`) | **No** | Retrying with identical input reproduces the identical conflict -- this is a data/logic condition, not a transient one |
| Check/referential constraint violation (other `23xxx`) | **No** | Same reasoning -- the data is invalid, retrying won't change that |
| Syntax/authority error (`42xxx`) | **No** | The statement or the caller's authority is wrong; retrying executes the same broken statement again |
| Resource-unavailable, non-lock (other `57` subclasses) | **Case-by-case** | May require operational intervention rather than a client-side retry |

**Retrying a *non-idempotent* business operation (like placing a new order) after an ambiguous failure risks creating a duplicate transaction** if the original actually succeeded and only the *confirmation* was lost -- this is exactly Section 16's Scenario 12. Only retry operations that are safe to repeat: a `SELECT`, a positioned `UPDATE` reissued after re-fetching, or a `CALL` to a procedure specifically designed to be idempotent (e.g., one that checks "does this transaction ID already exist" before inserting).

### Reusable retry pattern

```rpgle
Dcl-S RetryCount   Int(10);
Dcl-S MaxRetries   Int(10) Inz(3);
Dcl-S Done         Ind Inz(*Off);

RetryCount = 0;
Dow Not Done And RetryCount <= MaxRetries;
   Exec Sql Update SQLTUTOR.GL_ACCOUNT Set Balance = Balance + :Amount
            Where Account_Id = :AcctId;

   If SqlCode = 0;
      Done = *On;
   ElseIf %Subst(SqlState:1:2) = '57' And RetryCount < MaxRetries;
      RetryCount += 1;
      // Capture diagnostics for THIS attempt before retrying --
      // log every attempt, not just the final outcome (Section 12)
      CaptureAndLogAttempt(RetryCount : SqlState : SqlCode);
      // Call a controlled delay routine / system API here, with a delay
      // that grows with each attempt -- do NOT busy-loop or fake a delay
      // with an unrelated SQL statement.
   Else;
      // Not class 57, OR retries exhausted -- stop retrying, this is final
      Done = *On;
   EndIf;
EndDo;

If Not Done;
   // Final failure after retries -- log as such, roll back, return to caller
EndIf;
```

**Why the delay must be controlled, not a tight loop:** an immediate re-attempt against a lock held by a still-running transaction just re-collides -- a growing (or at least non-zero) delay gives the holding transaction realistic time to finish. **Why a low, fixed retry ceiling (2-3, not 10+):** beyond a small number of attempts, a persistent lock conflict is very unlikely to be transient, and continuing to retry just delays surfacing a real problem (and, in a busy batch window, adds load to an already-contended resource).

### Retry vs. rollback vs. immediate failure

```text
SQL error occurs
      |
      v
SQLSTATE class = 57?  (lock/timeout/deadlock)
      |
      +-- No --------------------------------> Not retryable --
      |                                        roll back, log, fail immediately
      |
      +-- Yes
             |
             v
      Retries remaining?
             |
             +-- No ------------------------->  Retries exhausted --
             |                                  roll back, log as final failure
             |
             +-- Yes
                    |
                    v
             Is the operation about to be
             repeated fully idempotent?
                    |
                    +-- No ---------------->  Do NOT blindly retry the write --
                    |                         re-verify state first (e.g., did
                    |                         it actually not commit?)
                    |
                    +-- Yes -------------->  Wait a controlled delay, retry,
                                             log the attempt
```

---

## 10. Dynamic SQL diagnostics

Dynamic SQL fails in four distinct phases, and which phase failed changes both the likely root cause and what's safe to log:

| Phase | Typical failure | Root cause |
|---|---|---|
| `PREPARE` | Invalid object/column name, syntax error | The SQL *text* itself is malformed -- almost always a string-construction defect in the RPG code building `SqlStmt`, not a data problem |
| `OPEN`/`EXECUTE` | Parameter marker count/type mismatch, authority failure | The statement text was valid, but what's bound to it (or who's running it) wasn't |
| Cursor `FETCH` | Data-conversion error mid-result-set, lock timeout on a specific row | The statement executed and started returning data before something went wrong partway through |
| Cursor `CLOSE` | Rare, but possible resource-related failure | Usually indicates a broader connection/resource issue rather than anything about this specific statement |

**Logging dynamic SQL safely.** Never log the fully-substituted statement text (with real parameter values baked in) if any of those values could be sensitive -- log the **statement shape** (the text with parameter markers still in place, before values are bound) plus the *count* and *types* of parameters, which is normally enough to diagnose a `PREPARE`/`EXECUTE` failure without exposing customer data, account numbers, or similar values. Use parameter markers wherever the statement's shape allows it, and never concatenate untrusted input directly into the SQL text -- the same rule from Embedded SQL in RPGLE applies just as much when logging a failure as it does when building the statement in the first place.

```rpgle
Exec Sql Prepare Stmt1 From :SqlStmt;
If SqlCode < 0;
   Diag.AppContext = 'Dynamic statement shape: ' + %Subst(SqlStmt:1:150);
   // NOT: Diag.AppContext = 'Full statement with bound values: ' + ...
   CaptureSqlDiag(Diag);
   LogSqlError(Diag);
   Return;
EndIf;
```

### Failure examples by symptom

| Symptom | Phase | SQLSTATE class | Likely cause |
|---|---|---|---|
| Invalid table/schema name | `PREPARE` | `42` | Typo, or object dropped/renamed since the code was written |
| Invalid column name | `PREPARE` | `42` | Same as above, at the column level |
| "Number of host variables does not match" | `OPEN`/`EXECUTE` | `07` | Parameter marker count in the built SQL text doesn't match the `USING` list |
| Authority failure | `EXECUTE` | `42` (often `42501`) | The job's user profile lacks the needed privilege -- not a code defect at all |
| Data-conversion error | `FETCH` | `22` | A returned column's actual data doesn't fit the target host variable's type/size |
| Unexpected column count/order | `FETCH` (or a cardinality mismatch caught earlier) | `07` or a mismatch caught before execution | The dynamically-built `SELECT` list doesn't match what the host variable list expects -- a common defect when the statement text is assembled conditionally |

---

## 11. RPG MONITOR vs SQL diagnostics

RPG's own runtime exception handling (`MONITOR`/`ON-ERROR`, `%ERROR`, the Program Status Data Structure, `*PSSR`) is a **separate system** from SQL diagnostics, and the two don't automatically cover each other.

**Why `MONITOR` does not replace checking SQLCODE/SQLSTATE:** `EXEC SQL` statements, by design, do **not** raise RPG exceptions for most SQL failures -- a `-803` duplicate key or a `-913` lock timeout updates the SQLCA and returns control to the next line of RPG code normally. `MONITOR`/`ON-ERROR` never even sees it, because nothing was thrown. A program that wraps `EXEC SQL INSERT` in a `MONITOR` block expecting it to catch a duplicate-key condition will find the `MONITOR` block simply never activates -- the failure is sitting, unhandled, in `SqlCode`/`SqlState`, while execution has already moved past the point where it mattered.

| Failure type | Updates SQLCA? | Raises an RPG exception? |
|---|---|---|
| SQL constraint/data/lock condition (`-803`, `-913`, etc.) | Yes | No -- must be checked via `SqlCode`/`SqlState` |
| SQL statement referencing an object with no authority | Yes | No |
| A genuine RPG runtime fault unrelated to the SQL statement itself (e.g., array index out of bounds in code that runs *after* the SQL statement) | No | Yes |
| An RPG-level file exception on a native I/O operation elsewhere in the same program | No (different mechanism entirely) | Yes |

### Combining both layers without double-logging

```rpgle
Monitor;
   Exec Sql Update SQLTUTOR.GL_ACCOUNT Set Balance = Balance + :Amount
            Where Account_Id = :AcctId;

   If SqlCode < 0;
      // SQL-level failure -- handle and log HERE. This is the only
      // place this specific failure gets logged.
      CaptureSqlDiag(Diag);
      LogSqlError(Diag);
   EndIf;
On-Error;
   // This catches a DIFFERENT category: an RPG runtime exception,
   // NOT the SQL condition above (which never throws one). Logging
   // here is for genuine RPG faults -- do not ALSO log the SQL
   // condition again from this branch, or every SQL error becomes
   // two log entries instead of one.
   CaptureRpgException();
EndMon;
```

### Layered error handling

```text
Business validation
        |   (Is this operation even allowed? -- before any SQL runs)
        v
SQL result handling
        |   (SQLCODE / SQLSTATE / GET DIAGNOSTICS -- Sections 1-10)
        v
RPG runtime handling
        |   (MONITOR / *PSSR -- genuine RPG exceptions, a DIFFERENT
        |    failure category from SQL conditions)
        v
System and job-level handling
        (Escape messages, job log -- the last resort when neither
         layer above caught or handled the condition)
```

Each layer catches what the layer above it cannot. Skipping the SQL result-handling layer and hoping RPG runtime handling will catch SQL conditions is the single most common gap this section exists to close.

---

## 12. Logging, observability, and operational support

A log entry's value is measured by whether a production-support engineer, with no other context, can act on it without opening the source code.

**Poor:**
```text
SQL failed.
```

**Useful:**
```text
Program GLPOSTR, procedure PostPayment, operation UPDATE GLBALANCE,
account 4500-100, SQLSTATE 40001, SQLCODE -913,
transaction TXN-20481, retry 2 of 3.
```

The difference is entirely about what's included: **program, procedure, operation, business key (account), SQLSTATE, SQLCODE, a correlation ID (transaction), and retry context.** Every field in Section 6.2's `SqlDiag_t` structure maps directly onto making this level of detail the *default*, not a special effort.

- **Correlation/transaction IDs** (`TRANSACTION_ID` in the log table) let you pull every log entry related to one business event across multiple programs/procedures -- essential once a transaction spans more than one call.
- **Job name and user profile** answer "which job/session was this" without needing to reproduce the failure.
- **Severity** (`I`/`W`/`E`/`F`) lets monitoring tools and dashboards filter noise from what actually needs a human -- a `W` warning about a truncated field is not the same operational event as an `F` fatal GL posting failure.
- **Monitoring repeated failures**: the same `SQLSTATE`/`TABLE_NAME` combination recurring dozens of times in a short window is a different signal than one isolated occurrence -- worth an alert threshold ("more than N errors of the same class in M minutes") layered on top of the raw log table.
- **Data queues and message queues** (Section 6.4) can feed near-real-time monitoring without hitting the database at all for the "is something wrong right now" question.
- **Integration with external monitoring**: a structured log table is naturally queryable by any ODBC/JDBC-based dashboard tool -- the value of a *structured* table over free-text job-log messages is precisely that external tools can filter/aggregate on `SEVERITY`, `SQLSTATE_VAL`, `TABLE_NAME` without text parsing.
- **Retention and archival**: decide a purge/archive plan (e.g., partition by month, archive anything older than N days) as part of the initial design, not as a fire drill once the table is huge and queries against it slow down.
- **Index the columns operational queries actually filter by** -- `LOG_TS` and `TRANSACTION_ID` at minimum (Section 6.1), and likely `SQLSTATE_VAL`/`SEVERITY` if dashboards filter on those too.

**Masking sensitive data.** `MESSAGE_TEXT` and `APP_CONTEXT` can end up containing customer names, account numbers, or other sensitive values if you're not deliberate about it -- a constraint violation message, for instance, may echo back the offending value. Decide explicitly what's safe to log verbatim (an account *number* is usually fine for internal ops logs) versus what never belongs in a log table at all -- passwords, tokens, and full customer records chief among them -- rather than logging everything by default and discovering the problem in an audit.

---

## 13. Legacy patterns and modern recommendations

Older SQLRPGLE code following these patterns wasn't written carelessly -- it reflects real constraints of the tools and conventions available at the time. Evaluated honestly rather than dismissed:

| Legacy pattern | Why it was common | Limitation | Modern alternative |
|---|---|---|---|
| Checking only `SqlCode` | Simple, matches how RPG has always checked indicators/return codes | Misses warnings (Section 2), and `SQLSTATE` classification is more portable/future-proof | Classify by `SQLSTATE` class (Section 2) -- still fine for quick, low-stakes interactive utilities where a full framework is overkill |
| Checking only negative `SqlCode` | Matches the intuitive "negative = bad" mental model | Silently drops warnings and mishandles `UPDATE`/`DELETE` "zero rows" cases (Section 4) | `GET DIAGNOSTICS ROW_COUNT` for DML; `SQLSTATE` class for everything else -- this is the pattern most worth actively replacing |
| Displaying/logging a bare `SqlCode` with no message text | Fast to code, the value was already sitting in the SQLCA | Someone reading the log later has to go look up what `-803` means | `GET DIAGNOSTICS MESSAGE_TEXT` alongside the code (Section 3) |
| Ignoring warnings entirely | Warnings rarely stopped a program from "working" in testing | Truncation/conversion warnings are exactly the kind of defect that only surfaces as bad data much later | Classify and log `01`-class conditions explicitly (Section 2) |
| Treating `+100` as an exception everywhere | Simple, uniform "nonzero is bad" rule | Breaks the normal cursor-exhaustion pattern and misreads routine "not found" lookups as errors | Section 4's contextual decision tree |
| `GOTO`-based error handling | Predates structured `MONITOR`/handler constructs in RPG and SQL PL | Hard to reason about which errors are actually caught where; easy to create unintended jumps | `MONITOR`/`ON-ERROR` (RPG), `DECLARE HANDLER` (SQL PL) -- worth keeping in code you're maintaining, not writing new |
| Repeating identical SQL-check boilerplate after every statement | No shared framework existed | Massive duplication, inconsistent handling across programs | Section 6's reusable diagnostic structure + capture/log procedures |
| Committing inside low-level procedures | Seemed "safer" -- commit early, commit often | Section 7's nested-commit trap -- silently commits the caller's unrelated work | Transaction-aware procedures that report status, owned commit boundary at the top level |
| Relying only on job logs | Always available, zero setup | Not queryable/structured, hard to correlate across a multi-step transaction | Structured error-log table (Section 6) with the job log kept as a *fallback*, never the primary mechanism |
| Returning a generic `*ON`/`*OFF` success indicator | Minimal, fast, RPG-idiomatic | Loses everything -- no `SQLSTATE`, no message, no idea *why* it failed | A structured status (Section 3's `RESERVE_STOCK` `OUT` parameters, or `Likeds(SqlDiag_t)`) for anything crossing a program boundary that support staff will need to diagnose |

---

## 14. Performance and design considerations

- **`GET DIAGNOSTICS` has a real cost, if trivial per call** -- calling it unconditionally after every single SQL statement in a tight, high-frequency loop (e.g., inside a `FOR EACH ROW` trigger processing a large batch) adds up. Call it only when the statement actually failed, not after every successful one.
- **Don't log every warning in high-volume batch paths without aggregation.** A batch job that hits the same truncation warning 50,000 times should log it *once*, with a count, not 50,000 near-identical rows -- both a volume problem and a log-table-contention problem if many jobs are inserting concurrently.
- **Error handling should be consistent, not excessive** -- the goal is that every non-trivial statement is checked correctly, not that every statement pays the full diagnostic-capture cost regardless of risk. Reserve full `GET DIAGNOSTICS` detail for statements that actually failed or that carry real business risk if they silently do nothing (Section 4).
- **Retention and archival**: a table logging every SQL warning/error across a busy system grows fast -- plan a purge/archive strategy as part of the initial design, not as a fire drill once the table is huge.
- **Synchronous vs. asynchronous logging** is the direct performance/durability trade-off from Section 6.4 -- synchronous is simplest and immediately consistent but adds latency to every failure path; asynchronous removes that latency at the cost of a small delay before the log entry is visible.
- **Error handling inside frequently-called service-program procedures** (Section 5.10) should be lightweight -- capture and return diagnostics, don't log from deep inside a hot-path utility procedure that might be called thousands of times per transaction; let the caller, closer to the actual business operation, decide whether and how to log.
- **Avoid SQL inside the logger's own fallback path** (Section 6.4's "logger itself failed" branch) -- that's precisely why the fallback there is a system message, not another `EXEC SQL INSERT` that could recursively fail the same way.
- **Watch for recursive failures between triggers and log tables**: if a trigger on a business table itself writes to a log table, and that log-table write fails, make sure that failure doesn't cascade back into failing the *original* business operation -- a strong argument for the log table having minimal constraints and no triggers of its own.

---

## 15. End-to-end example: order-posting transaction framework

A complete, adaptable slice combining most of this chapter's techniques: commitment control, a savepoint concept, the reusable diagnostic framework, retry handling, and a stored procedure -- built around placing an order and posting its value to a GL account in one transaction. Reuses `SQLTUTOR.ORDERS`, `SQLTUTOR.ORDER_DETAIL`, `SQLTUTOR.GL_ACCOUNT` (Section 5), and `SQLTUTOR.SQL_ERROR_LOG` (Section 6) -- no new tables beyond what this chapter already introduced.

### 15.1 Stored procedure: transactional order + GL posting

```sql
CREATE OR REPLACE PROCEDURE SQLTUTOR.POST_ORDER_TXN (
  IN  P_ORDER_ID   INT,
  IN  P_CUST_ID    INT,
  IN  P_PROD_ID    INT,
  IN  P_QTY        INT,
  IN  P_UNIT_PRICE DECIMAL(9,2),
  IN  P_AR_ACCOUNT CHAR(8),
  IN  P_TXN_ID     VARCHAR(30),
  OUT P_STATUS     VARCHAR(20),
  OUT P_SQLSTATE   CHAR(5),
  OUT P_MESSAGE    VARCHAR(200)
)
LANGUAGE SQL
BEGIN ATOMIC
  DECLARE V_TOTAL DECIMAL(11,2);
  DECLARE V_ROWS  INT;

  DECLARE EXIT HANDLER FOR SQLEXCEPTION
  BEGIN
    GET DIAGNOSTICS CONDITION 1
      P_SQLSTATE = RETURNED_SQLSTATE, P_MESSAGE = MESSAGE_TEXT;
    SET P_STATUS = 'FAILED';
    INSERT INTO SQLTUTOR.SQL_ERROR_LOG
      (PROGRAM_NAME, SQL_OPERATION, SQLSTATE_VAL, MESSAGE_TEXT,
       BUSINESS_KEY, SEVERITY, TRANSACTION_ID)
    VALUES
      ('POST_ORDER_TXN', 'MULTI-STEP', P_SQLSTATE, P_MESSAGE,
       CHAR(P_ORDER_ID), 'F', P_TXN_ID);
    ROLLBACK;
  END;

  SET V_TOTAL = P_QTY * P_UNIT_PRICE;

  INSERT INTO SQLTUTOR.ORDERS (ORDER_ID, CUST_ID, ORDER_DATE, STATUS)
    VALUES (P_ORDER_ID, P_CUST_ID, CURRENT_DATE, 'O');

  INSERT INTO SQLTUTOR.ORDER_DETAIL (ORDER_ID, LINE_NO, PROD_ID, QTY, UNIT_PRICE)
    VALUES (P_ORDER_ID, 1, P_PROD_ID, P_QTY, P_UNIT_PRICE);

  UPDATE SQLTUTOR.GL_ACCOUNT SET BALANCE = BALANCE + V_TOTAL
    WHERE ACCOUNT_ID = P_AR_ACCOUNT;

  GET DIAGNOSTICS V_ROWS = ROW_COUNT;
  IF V_ROWS = 0 THEN
    SIGNAL SQLSTATE '75003' SET MESSAGE_TEXT = 'GL account not found for posting';
  END IF;

  COMMIT;
  SET P_STATUS   = 'SUCCESS';
  SET P_SQLSTATE = '00000';
  SET P_MESSAGE  = 'Order posted successfully';
END;
```

### 15.2 RPG caller with retry classification

```rpgle
**FREE
Ctl-Opt DftActGrp(*No) ActGrp(*New);

Dcl-S TxnId    Varchar(30);
Dcl-S Status   Varchar(20);
Dcl-S RcState  Char(5);
Dcl-S RcMsg    Varchar(200);
Dcl-S Attempt  Int(10);

TxnId = 'TXN-' + %Char(%Timestamp() : *Iso0);
Attempt = 0;

Dow Attempt <= 3;
   Attempt += 1;
   Exec Sql Call SQLTUTOR.POST_ORDER_TXN(
     :OrderId, :CustId, :ProdId, :Qty, :UnitPrice, :ArAccount, :TxnId,
     :Status, :RcState, :RcMsg);

   If Status = 'SUCCESS';
      Leave;
   ElseIf %Subst(RcState:1:2) = '57' And Attempt < 3;
      // retryable class -- controlled delay, then loop again (Section 9)
      Iter;
   Else;
      // Not retryable, or retries exhausted -- stop
      Leave;
   EndIf;
EndDo;

If Status <> 'SUCCESS';
   // RcState/RcMsg already populated by the procedure's own handler --
   // the error log entry was already written inside POST_ORDER_TXN
   // (ahead of its own ROLLBACK) -- this RPG layer just needs to
   // communicate final status to ITS caller.
EndIf;
```

### 15.3 Test scenarios and expected results

| Test | Setup | Expected result |
|---|---|---|
| **Success** | Valid `ORDER_ID`, existing `CUST_ID`/`PROD_ID`, valid `AR_ACCOUNT` (`4500-100`) | `P_STATUS = 'SUCCESS'`, `GL_ACCOUNT.BALANCE` increased by `QTY * UNIT_PRICE`, no error log entry |
| **No-data** | `AR_ACCOUNT` set to a non-existent account code | `P_STATUS = 'FAILED'`, `P_SQLSTATE = '75003'`, one error log entry with `SEVERITY = 'F'`, orders/detail rolled back |
| **Duplicate key** | `ORDER_ID` reused from a prior successful run | `P_STATUS = 'FAILED'`, `P_SQLSTATE` class `23`, error log entry; RPG caller does **not** retry (Section 9 -- `23` is not retryable) |
| **Lock timeout** | Run concurrently against the same `GL_ACCOUNT` row from a second session holding an uncommitted update | First attempt fails with class `57`; RPG caller retries; confirm eventual success once the competing lock releases, and confirm the log shows *both* the failed attempt and the eventual success as separate entries |
| **Rollback verification** | Force the GL `UPDATE` to fail (Section 15.1's `SIGNAL`) | Confirm `SQLTUTOR.ORDERS` and `SQLTUTOR.ORDER_DETAIL` show **no** row for the attempted `ORDER_ID` -- the header/detail inserts were rolled back along with the GL failure, not left as orphans |
| **Logging-failure test** | Temporarily revoke `INSERT` authority on `SQL_ERROR_LOG` from the profile running the test | Confirm the `Dsply`/system-message fallback (Section 6.4) fires instead of the whole procedure failing in a way that masks the *original* GL/order error |

---

## 16. Real-world troubleshooting scenarios

**Scenario 1 -- SELECT INTO unexpectedly returns more than one row.**
*Symptoms:* `SQLCODE -811`, `SQLSTATE 21000`. *Likely cause:* the `WHERE` clause isn't actually unique -- either the assumed key isn't a real constraint, or a uniqueness assumption was violated by newer data. *Fix:* either tighten the `WHERE` clause to be genuinely unique, or intentionally switch to a cursor if multiple rows are legitimately possible.

**Scenario 2 -- a cursor stops before all records are processed.**
*Symptoms:* loop exits early, `SqlCode <> 100` at exit (Section 5.6). *Likely cause:* a lock timeout mid-fetch, or a positioned `UPDATE`/`DELETE` inside the loop that failed and wasn't itself checked. *Fix:* always check the reason the `Dow` exited, separately from checks inside the loop body -- a shockingly common gap is checking the loop-body statement but never checking *why the loop itself stopped*.

**Scenario 3 -- an update succeeds but changes zero rows.**
This is Section 4's core lesson, restated as a scenario: `SQLCODE = 0`, business impact real. *Fix:* add the `GET DIAGNOSTICS ROW_COUNT` check that was missing, and make it a mandatory part of the Section 6 framework for any DML that isn't a plain `INSERT`.

**Scenario 4 -- a duplicate-key error occurs intermittently, not consistently.**
*Symptoms:* `SQLCODE -803` under load, absent in isolated testing. *Likely cause:* a race condition -- key generation using an application-computed "max + 1" pattern instead of a true database sequence/identity column. *Fix:* switch to `GENERATED ALWAYS AS IDENTITY` or `CREATE SEQUENCE`, which Db2 for i guarantees to be collision-free under concurrency.

**Scenario 5 -- an application receives a lock timeout.**
*Symptoms:* `SQLCODE -913`, `SQLSTATE 57033`. *Likely cause:* a batch job holding a wide lock scope (e.g., a table-level lock from an unindexed `UPDATE` scan) colliding with interactive users. *Fix:* Section 9's retry pattern for the immediate symptom, but also index/scope the batch operation to minimize its lock footprint.

**Scenario 6 -- a stored procedure returns a generic failure.**
*Symptoms:* the `CALL`'s `OUT` parameter says "failed," nothing more. *Fix:* rebuild the procedure's error handling to capture and return `RETURNED_SQLSTATE`/`MESSAGE_TEXT` (Section 3's `RESERVE_STOCK`), not a static string.

**Scenario 7 -- a trigger causes the original SQL operation to fail.**
*Symptoms:* an `INSERT` the caller wrote fails with a `SQLSTATE`/message that doesn't match anything in the `INSERT` statement itself. *Fix:* `GET DIAGNOSTICS ... TRIGGER_NAME` (Section 3) identifies the culprit directly -- inspect that trigger's logic rather than the calling program.

**Scenario 8 -- error logging is rolled back along with the business transaction.**
This is Section 6.4's central trade-off, as a symptom: log entries for failed transactions are missing entirely. *Fix:* move to a separate commitment scope or a data queue (Section 6.4); decide the logging isolation strategy at design time, not after the first incident where the evidence turned out to be missing.

**Scenario 9 -- dynamic SQL works in ACS but fails inside RPG.**
*Symptoms:* the identical-looking `SELECT` runs fine interactively, fails when built and `PREPARE`d in RPG. *Likely cause:* a subtle difference between the *actual* generated statement text and what you assumed -- a missing space, an unescaped quote in a concatenated value, or a host variable holding the SQL text that's too short for the fully-built statement. *Fix:* log the exact statement shape (Section 10) and compare character-for-character against what runs in ACS.

**Scenario 10 -- the original diagnostics are lost because another SQL statement executed first.**
Section 3's lifecycle, as an incident: a "quick diagnostic `SELECT`" run between the failing statement and `GET DIAGNOSTICS` overwrites the very diagnostics being inspected. *Fix:* capture diagnostics into host variables immediately, before anything else runs -- no exceptions, not even a "harmless" read.

**Scenario 11 -- a batch job produces thousands of identical errors.**
*Symptoms:* the error log fills with near-duplicate entries from one job run. *Likely cause:* a `FOR EACH ROW` trigger or per-row RPG loop hitting the same structural problem on every row. *Fix:* once the pattern is clear from the log's `SQLSTATE_VAL`/`TABLE_NAME` repetition, fix the root cause, not the logging -- and consider a "stop after N identical failures" circuit breaker so one bad input file doesn't generate ten thousand log rows before anyone notices.

**Scenario 12 -- a retry causes duplicate business transactions.**
*Symptoms:* two orders exist for what should have been one order-placement call. *Likely cause:* Section 9's non-idempotent retry trap -- the original call actually succeeded and committed, but the *caller* never received confirmation (e.g., a communications failure after the database work completed) and retried the whole operation from scratch. *Fix:* make the operation idempotent -- check for an existing transaction ID before inserting, so a retry becomes a no-op if it already succeeded.

---

## 17. Production checklist

- Classify by `SQLSTATE` class first; use `SQLCODE` only for platform-specific precision within a class (Section 2).
- Check `GET DIAGNOSTICS ROW_COUNT` after every `UPDATE`/`DELETE`/`MERGE` that isn't guaranteed by a key to touch exactly one row (Section 4).
- Capture diagnostics into host variables immediately after a failing statement -- before any other SQL statement runs, including a logging `INSERT` (Section 3).
- Decide who owns the transaction boundary for every multi-step write -- the top-level caller, never a nested procedure (Section 7).
- Give the error logger a non-SQL fallback for when it itself fails (Section 6.4).
- Retry only class-`57` conditions, only a small number of times, only with a controlled delay, and only for idempotent operations (Section 9).
- Never let `MONITOR`/`ON-ERROR` substitute for checking `SQLCODE`/`SQLSTATE` -- they cover different failure categories (Section 11).
- Log program, procedure, operation, business key, `SQLSTATE`, `SQLCODE`, and a correlation ID as the default level of detail, not a special effort (Section 12).
- Mask or exclude sensitive values from logs and from dynamic-SQL diagnostics (Sections 10, 12).
- Aggregate repeated identical errors in high-volume batch paths instead of logging one row per occurrence (Section 14).

### SQLCODE/SQLSTATE interpretation matrix

| SQLCODE | SQLSTATE | Meaning | Action |
|---|---|---|---|
| `0` | `00000` | Success | Proceed |
| `> 0`, not `100` | `01xxx` | Warning | Log, evaluate specific subclass |
| `100` | `02000` | No data | Section 4's decision tree |
| `-803` | `23505` | Duplicate key | Business rejection, not retryable |
| negative, other `23xxx` | `23xxx` | Constraint violation | Business rejection, not retryable |
| `-811` | `21000` | Cardinality violation | Fatal defect, not retryable |
| `-913` | `57033` | Lock timeout/deadlock | Retryable, limited attempts |
| negative | `42xxx` | Syntax/authority | Fatal, code/authority fix needed |
| negative | `22xxx` | Data exception | Usually fatal, often caller-input issue |

### Retry-decision checklist

- [ ] Is the `SQLSTATE` class `57`? If not, do not retry.
- [ ] Are retries remaining under the configured maximum (2-3 typical)?
- [ ] Is the operation about to be retried fully idempotent, or does it need a state re-check first?
- [ ] Is there a controlled, non-zero delay between attempts?
- [ ] Is every attempt -- not just the final outcome -- logged?

### Transaction-boundary checklist

- [ ] Does exactly one layer (the top-level caller) own `COMMIT`/`ROLLBACK`?
- [ ] Do nested procedures report status instead of committing/rolling back themselves?
- [ ] Are savepoints used where partial rollback is valid, full rollback where it isn't?
- [ ] Are all tables involved actually journaled?

### Logging checklist

- [ ] Program, procedure, operation, business key, `SQLSTATE`, `SQLCODE`, correlation ID all present?
- [ ] Diagnostics captured before any other SQL statement runs?
- [ ] Logger isolated from the business transaction's commitment scope where durability matters?
- [ ] Non-SQL fallback in place if the logger itself fails?
- [ ] Sensitive values excluded/masked?

---

## 18. Hands-on exercises

Using `SQLTUTOR`:

1. Rewrite Section 5.3's GL-posting `UPDATE` so it correctly distinguishes "account not found" (`RowsAffected = 0`) from a genuine SQL error, logging each with a different `SEVERITY`.
2. Add a `RESIGNAL SQLSTATE '75010' SET MESSAGE_TEXT = '...'` to `SQLTUTOR.INSERT_PRODUCT_SAFE`'s general handler (Section 8), and explain why the caller now sees a stable application-defined error instead of whatever raw Db2 for i condition happened to occur.
3. Extend Section 9's retry pattern to log every attempt (not just the final outcome) into `SQLTUTOR.SQL_ERROR_LOG`, using `SEVERITY = 'W'` for retried attempts and `'F'` only for the final failure.
4. As a design exercise (not runnable code): sketch what `SQLTUTOR.POST_ORDER_TXN` (Section 15.1) would need to change to also accept an idempotency check -- given a `P_TXN_ID` that's already succeeded, return `'SUCCESS'` immediately without attempting the inserts again.

<details>
<summary>Hints (expand after you've tried)</summary>

- **#1:** The shape is already in Section 5.3 -- add an explicit `Else` branch distinguishing `SqlCode < 0` from `RowsAffected = 0`, and log each with `Severity = 'E'` versus a business-specific severity of your choosing for the "account not found" case.
- **#2:** Compare the caller-visible `P_STATUS` before and after adding `RESIGNAL` -- without it, the handler's own `SET P_STATUS = 'Insert failed: ...'` is all the caller ever sees; with a specific `RESIGNAL`, a caller further up the chain (or another routine calling this one) sees a stable, documented `SQLSTATE` it can match against, rather than an arbitrary message string.
- **#3:** Call `LogSqlError` (Section 6.3-6.4) once per retry attempt inside the `ElseIf` branch of the retry loop, with `Severity = 'W'`, and once more after the loop if `Done` never became true, with `Severity = 'F'`.
- **#4:** You'd add a `SELECT 1 FROM SQLTUTOR.SQL_ERROR_LOG`-style existence check (or a small dedicated transactions table keyed by `P_TXN_ID`) as the very first statement in the procedure body, before any inserts -- if a prior successful run for that `P_TXN_ID` is found, set `P_STATUS = 'SUCCESS'` and return immediately, rather than re-running the inserts.

</details>

---

## 19. Interview questions

- What is the difference between `SQLCODE` and `SQLSTATE`?
- Why is `SQLCODE +100` not always an error?
- Why is `SQLSTATE` class-based classification useful, beyond checking a specific code?
- What does `GET DIAGNOSTICS` provide that `SQLCODE` alone does not?
- Why must diagnostics be captured immediately after a failing statement?
- Why should `ROW_COUNT` be checked after `UPDATE`/`DELETE`/`MERGE`, when `SQLCODE` can be `0` either way?
- What's the difference between a warning and an error in Db2 for i's outcome model?
- Why is `SQLSTATE` class `57` often retryable, while class `23` never is?
- Why should a duplicate-key error not be blindly retried?
- How do SQL PL condition handlers differ from checking `SQLCODE`/`SQLSTATE` after every SQLRPGLE statement?
- What is `RESIGNAL` used for?
- Why does `MONITOR` not catch most SQL failures?
- How should an error log be designed so it's useful during a production incident?
- Who should own `COMMIT`/`ROLLBACK` in a layered SQLRPGLE application?
- Why can a logger that shares its caller's commitment scope end up hiding the very failure it was meant to record?

---

## 20. Ask the AI Tutor

Good follow-up prompts once you've worked through the material above:

- "Explain SQLCODE, SQLSTATE, and GET DIAGNOSTICS on IBM i."
- "Show me a SQLRPGLE pattern for handling SQLCODE +100."
- "Explain why UPDATE with zero rows can still return SQLCODE 0."
- "Explain GET DIAGNOSTICS ROW_COUNT with examples."
- "Show me how to capture MESSAGE_TEXT after an SQL error."
- "Explain SQLSTATE class 23 vs 57."
- "Help me design retry logic for SQLCODE -913."
- "Explain why MONITOR does not replace SQLCODE checking."
- "Show me a reusable SQLRPGLE diagnostic data structure."
- "Give me interview questions on IBM i SQL error handling."

---

## 21. Key takeaways

- `SQLCODE` and `SQLSTATE` answer different questions -- `SQLCODE` is precise but Db2-for-i-specific; `SQLSTATE`'s class is portable and what stable classification logic should be built against.
- `SQLCODE = +100` means "no data" for a `SELECT INTO` or a cursor/result-set `FETCH` -- but a searched `UPDATE`/`DELETE`/`MERGE` matching zero rows stays at `SQLCODE = 0`. `GET DIAGNOSTICS ROW_COUNT` is the only reliable signal there, and checking it is not optional for production DML.
- `GET DIAGNOSTICS` supplies the content `SQLCODE`/`SQLSTATE` can't: message text, row counts, and (when applicable) the specific constraint, table, column, or trigger involved.
- The diagnostics area is overwritten by the *next* SQL statement of any kind -- capture into host variables immediately, before even a "harmless" diagnostic read.
- `COMMIT`/`ROLLBACK` belongs to whoever owns the transaction, almost always the top-level caller -- nested procedures should report status, not commit or roll back on a caller's behalf.
- An error logger that shares its caller's commitment scope loses its log entries exactly when a rollback happens -- and the logger itself must never become a second, unhandled point of failure.
- SQL PL supports `CONTINUE`, `EXIT`, and `UNDO` (`BEGIN ATOMIC`-only) handlers, matched by specificity; `RESIGNAL` lets a handler log and still propagate the original failure instead of silently swallowing it.
- Only `SQLSTATE` class `57` (lock timeout/deadlock) is a reasonable retry candidate, and only for idempotent operations, with a small retry ceiling and a controlled, non-zero delay.
- RPG's `MONITOR`/`ON-ERROR` is a separate mechanism from SQL diagnostics -- most SQL failures never raise an RPG exception at all, so `MONITOR` alone will never catch them.

---

## What's next: future Deep Dives

This Deep Dive deliberately stays focused on `SQLCODE`/`SQLSTATE`/`GET DIAGNOSTICS` and the error-handling patterns built on them -- it does not go deep on commitment control internals, journaling, RPG's `MONITOR`/`*PSSR` mechanics as their own topic, SQL performance tuning, or dynamic SQL as a topic in its own right. Those are natural, planned follow-ups:

1. Native I/O vs SQL Decision Guide
2. Commitment Control with SQL and RPGLE
3. SQL Performance Basics on IBM i

Check the [Deep Dives catalog](/deep-dives) for their current status.
