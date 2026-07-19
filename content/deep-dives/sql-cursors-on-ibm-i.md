## Who this is for

This Deep Dive builds on [SQL on IBM i](/deep-dives/sql-on-ibm-i) and [Embedded SQL in RPGLE](/deep-dives/embedded-sql-in-rpgle), and the `SQLTUTOR` schema/data both create -- work through those first if you haven't. The Embedded SQL in RPGLE Deep Dive already introduced the standard cursor loop; this one goes deep on everything a cursor can do beyond that: scrolling backward and forward through a result set, updating rows through the cursor itself, fetching many rows per round trip for performance, and keeping a cursor open across a `COMMIT`.

By the end you'll be able to:

- Explain what a cursor actually is and why SQL -- a set-based language -- needs one at all
- Walk through a cursor's full lifecycle, from `DECLARE` to `CLOSE`
- Choose the right cursor sensitivity and scrollability for a given job
- Scroll forward and backward through a result set with `FETCH FIRST`/`LAST`/`PRIOR`/`NEXT`/`ABSOLUTE`
- Update or delete the *current* cursor row with `WHERE CURRENT OF`, and know when a `SELECT` isn't updatable at all
- Fetch multiple rows per round trip for real performance gains, and read `SQLERRD(3)` correctly
- Keep a cursor open across a `COMMIT` with `WITH HOLD` -- and recognize the `SQLCODE -501` you get when you forget it
- Recognize when you don't need a cursor at all

**You'll need an IBM i partition to compile and run the programs below** -- read through for the logic even if you don't have one handy yet.

---

## 1. What a cursor actually is

SQL is set-based -- a `SELECT` describes *what* rows you want, not a loop to get them one at a time. But RPGLE (and most host languages) can only consume data one row at a time. A **cursor** is the bridge: a named pointer into a result set that you position and move through explicitly, row by row, from host-language code.

You already used one in the Embedded SQL in RPGLE Deep Dive without dwelling on it:

```rpgle
Exec Sql Declare OrdCurs Cursor For
  Select Order_Id, Order_Date, Status From SQLTUTOR.ORDERS Where Cust_Id = :CustId;
Exec Sql Open OrdCurs;
Exec Sql Fetch OrdCurs Into :OrderId, :OrderDate, :OrderStatus;
Dow SqlCode = 0;
   // process one row
   Exec Sql Fetch OrdCurs Into :OrderId, :OrderDate, :OrderStatus;
EndDo;
Exec Sql Close OrdCurs;
```

That's the *default* cursor: forward-only, one row at a time, read-only unless Db2 for i can tell otherwise. Everything below is a variation on `DECLARE` that changes what the cursor can do.

---

## 2. Cursor lifecycle: DECLARE, OPEN, FETCH, CLOSE

Before the options table, it's worth being precise about what each keyword actually *does* -- a lot of cursor confusion comes from treating these four as interchangeable ceremony instead of four distinct steps:

```text
DECLARE
   |    registers the cursor's name and query -- does not run anything yet
   v
OPEN
   |    runs the query, positions the cursor before the first row
   v
FETCH  (NEXT / FIRST / PRIOR / ABSOLUTE ...)
   |    moves the cursor and copies the row's column values into host variables
   v
Current row available
   |    SQLCODE 0 -- a row is now the cursor's "current" row
   |    SQLCODE +100 -- no row / end of data; there is no current row
   v
Optional positioned UPDATE/DELETE ... WHERE CURRENT OF
   |    acts on exactly the row the cursor is parked on right now
   v
CLOSE
      releases the cursor and its resources
```

The one thing worth internalizing here: **`WHERE CURRENT OF` only makes sense between a successful `FETCH` and the next `FETCH` or `CLOSE`.** Once `SQLCODE` comes back `+100`, there is no current row -- there's nothing for `WHERE CURRENT OF` to act on, and the cursor needs a fresh `OPEN` (or to simply be closed) before it can be used again.

---

## 3. The DECLARE CURSOR options, all in one place

```sql
DECLARE cursor-name
  [ INSENSITIVE | SENSITIVE | ASENSITIVE ]
  [ SCROLL ]
  CURSOR [ WITH HOLD ]
  FOR select-statement
  [ FOR READ ONLY | FOR UPDATE OF column-list ]
```

| Option | Meaning |
|---|---|
| `INSENSITIVE` | Db2 for i takes a snapshot of the result set at `OPEN` time. Changes made anywhere afterward -- even by your own program -- are never seen. Always read-only. |
| `SENSITIVE` | The cursor reflects changes made through itself (and, depending on the query, possibly other changes too). Needed if you want to scroll *and* update. |
| `ASENSITIVE` (default) | Db2 for i picks `SENSITIVE` or `INSENSITIVE` automatically based on whether the cursor is updatable. Fine for most cases -- be explicit only when you specifically require one behavior over the other. |
| `SCROLL` | Allows `FETCH FIRST`/`LAST`/`PRIOR`/`ABSOLUTE`/`RELATIVE`, not just `NEXT`. Omit it and you get a lighter-weight forward-only cursor. |
| `WITH HOLD` | Keeps the cursor open (and positioned) across a `COMMIT`. See Section 10. |
| `FOR READ ONLY` | You will only `FETCH`, never `UPDATE`/`DELETE`, through this cursor. |
| `FOR UPDATE OF column-list` | You intend to modify these specific columns through the cursor via `WHERE CURRENT OF`. See Section 5. |

A few practical notes for IBM i work specifically:

- **A plain forward-only cursor (no `SCROLL`, no `SENSITIVE`, no `FOR UPDATE`) is the normal default.** Reach for the others because a specific job genuinely needs backward movement or positioned changes, not out of habit.
- **`FOR READ ONLY` is worth adding even when it isn't strictly required** -- it states your intent up front and helps prevent an accidental positioned update later, e.g. after some unrelated code change.
- **`FOR UPDATE OF` should list only the columns you actually intend to update.** Naming fewer columns is more restrictive, not more permissive, and that restriction is useful documentation of intent.
- **`ASENSITIVE`'s automatic choice is fine for most day-to-day cursors.** You'll know when you need to override it -- typically when a query's exact `SENSITIVE`/`INSENSITIVE` behavior matters for a scrollable, updatable cursor, and even then, verify the specific behavior for your query shape rather than assuming.

The rule of thumb: **declare the plainest cursor that does the job.** `SCROLL`, `SENSITIVE`, and `FOR UPDATE` all cost Db2 for i more work to support.

---

## 4. Hands-on: a scrollable, read-only cursor

The lifecycle in Section 2 only ever moves `NEXT`. A `SCROLL` cursor can move in any direction -- useful for things like an interactive "page back" UI, or simply inspecting a result set out of order.

**Member: `BROWSEORD`, type `SQLRPGLE`**

```rpgle
**FREE
Ctl-Opt DftActGrp(*No) ActGrp(*New);

Dcl-S OrderId     Int(10);
Dcl-S OrdCustId   Int(10);
Dcl-S OrderDate   Date;
Dcl-S OrderStatus Char(1);

Exec Sql
  Declare OrdCurs Sensitive Scroll Cursor For
    Select Order_Id, Cust_Id, Order_Date, Status
    From   SQLTUTOR.ORDERS
    Order By Order_Id
    For Read Only;

Exec Sql Open OrdCurs;

Exec Sql Fetch First From OrdCurs
  Into :OrderId, :OrdCustId, :OrderDate, :OrderStatus;
Dsply ('FIRST  -> Order ' + %Char(OrderId));

Exec Sql Fetch Next From OrdCurs
  Into :OrderId, :OrdCustId, :OrderDate, :OrderStatus;
Dsply ('NEXT   -> Order ' + %Char(OrderId));

Exec Sql Fetch Last From OrdCurs
  Into :OrderId, :OrdCustId, :OrderDate, :OrderStatus;
Dsply ('LAST   -> Order ' + %Char(OrderId));

Exec Sql Fetch Prior From OrdCurs
  Into :OrderId, :OrdCustId, :OrderDate, :OrderStatus;
Dsply ('PRIOR  -> Order ' + %Char(OrderId));

Exec Sql Fetch Absolute 2 From OrdCurs
  Into :OrderId, :OrdCustId, :OrderDate, :OrderStatus;
Dsply ('ABS(2) -> Order ' + %Char(OrderId));

Exec Sql Close OrdCurs;

*InLR = *On;
```

With the `SQLTUTOR` sample data (`ORDER_ID` 5001-5004, sorted ascending), the trace is:

| Fetch | Order returned | Why |
|---|---|---|
| `FIRST` | 5001 | 1st row in the ordered result set |
| `NEXT` | 5002 | one past `FIRST` |
| `LAST` | 5004 | 4th (last) row |
| `PRIOR` | 5003 | one before `LAST` |
| `ABSOLUTE 2` | 5002 | jumps directly to row 2, regardless of current position |

`ABSOLUTE n` and `RELATIVE n` are the two you'll use for actual "jump to page N" logic; `FIRST`/`LAST`/`NEXT`/`PRIOR` cover simple back-and-forth browsing.

---

## 5. Updatable cursors: WHERE CURRENT OF

A cursor isn't limited to reading. Declare it `FOR UPDATE OF` specific columns, and you can modify or delete *the row the cursor is currently sitting on* -- without having to know or re-supply its key.

> **These examples intentionally modify SQLTUTOR sample data.** Run them only in a practice schema, not against anything you rely on. If you want to rerun earlier Deep Dives' examples exactly afterward, reload the `SQLTUTOR` sample data from [SQL on IBM i](/deep-dives/sql-on-ibm-i) first.

**Member: `BUMPPRICE`, type `SQLRPGLE`**

```rpgle
**FREE
Ctl-Opt DftActGrp(*No) ActGrp(*New);

Dcl-S ProdId    Int(10);
Dcl-S ProdName  Varchar(50);
Dcl-S UnitPrice Packed(9:2);
Dcl-S QtyHand   Int(10);
Dcl-S NewPrice  Packed(9:2);

Exec Sql
  Declare ProdCurs Cursor For
    Select Prod_Id, Prod_Name, Unit_Price, Qty_On_Hand
    From   SQLTUTOR.PRODUCT
    Where  Qty_On_Hand > 50
    For Update Of Unit_Price;

Exec Sql Open ProdCurs;

Exec Sql Fetch ProdCurs Into :ProdId, :ProdName, :UnitPrice, :QtyHand;

Dow SqlCode = 0;
   NewPrice = UnitPrice * 1.05;

   Exec Sql
     Update SQLTUTOR.PRODUCT
     Set    Unit_Price = :NewPrice
     Where Current Of ProdCurs;

   Dsply (%Trim(ProdName) + ': ' + %Char(UnitPrice) + ' -> ' + %Char(NewPrice));

   Exec Sql Fetch ProdCurs Into :ProdId, :ProdName, :UnitPrice, :QtyHand;
EndDo;

Exec Sql Close ProdCurs;
Exec Sql Commit;

*InLR = *On;
```

Against the `SQLTUTOR` sample data, this raises **Steel Bracket** (qty 1200, `4.50 -> 4.725`) and **Hydraulic Valve** (qty 75, `89.00 -> 93.45`) -- **Control Panel** is skipped because its `QTY_ON_HAND` (12) doesn't pass the cursor's `WHERE`.

`WHERE CURRENT OF ProdCurs` is the whole point here: no `WHERE Prod_Id = :ProdId` needed on the `UPDATE` -- Db2 for i already knows exactly which row the cursor is parked on.

### Not every SELECT is updatable

A cursor's `SELECT` has to be simple enough for Db2 for i to know unambiguously which single underlying row a positioned `UPDATE`/`DELETE` should touch. A positioned update can fail or be disallowed when the cursor's query includes things like:

- joins across multiple tables
- `GROUP BY`
- `DISTINCT`
- `UNION`
- aggregate expressions (`SUM`, `COUNT`, and similar)
- derived/calculated columns
- a read-only view
- any other shape where the "current row" doesn't map unambiguously back to one row in one base table

For updatable cursors, keep the `SELECT` simple -- a single table, no aggregation -- and declare `FOR UPDATE OF` only the specific columns you intend to change.

### Positioned DELETE

`WHERE CURRENT OF` isn't only for `UPDATE` -- the same clause works with `DELETE`:

```sql
DELETE FROM SQLTUTOR.PRODUCT
WHERE CURRENT OF ProdCurs;
```

This deletes the row the cursor is currently positioned on, the same way the `UPDATE` above changed it -- shown here for the syntax rather than as a program you should actually run, since deleting through `ProdCurs` mid-loop would then invalidate that row for any further processing in the same pass. If you tried the equivalent against `SQLTUTOR.ORDERS` instead, remember `SQLTUTOR.ORDER_DETAIL` has a foreign key back to it (see [SQL on IBM i](/deep-dives/sql-on-ibm-i)'s referential-integrity section) -- a positioned `DELETE` on an order header with existing detail lines fails for exactly the same reason a plain `DELETE` would.

---

## 6. Multi-row FETCH: fewer round trips

A plain `FETCH ... INTO :host-variables` gets one row per call -- one round trip between your program and the database engine per row. For large result sets, that adds up. Db2 for i lets you fetch a **batch of rows at once** into arrays.

**Member: `RPTDETAIL`, type `SQLRPGLE`**

```rpgle
**FREE
Ctl-Opt DftActGrp(*No) ActGrp(*New);

Dcl-S ProdIdArr   Int(10)      Dim(3);
Dcl-S QtyArr      Int(10)      Dim(3);
Dcl-S PriceArr    Packed(9:2)  Dim(3);
Dcl-S RowsFetched Int(10);
Dcl-S i           Int(10);

Exec Sql
  Declare DetCurs Cursor For
    Select Prod_Id, Qty, Unit_Price
    From   SQLTUTOR.ORDER_DETAIL
    Order By Order_Id, Line_No
    For Read Only;

Exec Sql Open DetCurs;

Exec Sql
  Fetch Next From DetCurs For 3 Rows
  Into :ProdIdArr, :QtyArr, :PriceArr;

Dow SqlCode = 0 Or SqlCode = 100;
   RowsFetched = SqlErrd(3);
   If RowsFetched = 0;
      Leave;
   EndIf;

   For i = 1 To RowsFetched;
      Dsply ('Prod ' + %Char(ProdIdArr(i)) + '  Qty ' + %Char(QtyArr(i))
             + '  @ ' + %Char(PriceArr(i)));
   EndFor;

   If SqlCode = 100;
      Leave;
   EndIf;

   Exec Sql
     Fetch Next From DetCurs For 3 Rows
     Into :ProdIdArr, :QtyArr, :PriceArr;
EndDo;

Exec Sql Close DetCurs;

*InLR = *On;
```

A few details that matter more than the `FOR 3 ROWS` syntax itself:

- **The arrays must be dimensioned at least as large as the row count you request.** `FOR 3 ROWS` into an array `Dim(3)` is the minimum correct sizing -- requesting more rows than the arrays can hold is a bug, not something the runtime silently truncates safely for you.
- **`SQLERRD(3)`** (the third element of the SQLCA's error-descriptor array, automatically available once you're using embedded SQL) tells you *how many rows the last fetch actually returned* -- never assume the arrays are fully populated, and **only process elements 1 through `SQLERRD(3)`.** On the final batch, if fewer rows remain than the array size, the leftover array elements still hold data from the *previous* fetch -- reading past `SQLERRD(3)` silently reprocesses stale rows.
- **`SQLCODE 100` can still carry rows.** If the last batch is partial, Db2 for i returns `SQLCODE = 100` *and* however many rows it found in that final batch -- which is why the loop condition above is `SqlCode = 0 Or SqlCode = 100`, and why it checks `RowsFetched` before deciding there's nothing left, rather than exiting the instant it sees `100`.
- **Multi-row fetch is for when you still need per-row RPGLE logic but the result set is large** -- it cuts round trips without giving up the ability to process each row in RPGLE. If there's no per-row logic at all, a set-based SQL statement (one `UPDATE`/`INSERT`/`SELECT` with aggregation) is almost always the better tool -- see the note at the end of Section 5.

With the `SQLTUTOR` sample data (6 rows in `ORDER_DETAIL`, fetched 3 at a time), this happens to divide evenly into two full batches -- try changing `FOR 3 ROWS` to `FOR 4 ROWS` to see a genuine partial final batch (4, then 2) and confirm `SQLERRD(3)` correctly reports `2` on that last fetch.

---

## 7. Cursor SQLCODE troubleshooting

Beyond the general embedded SQL codes already covered in the Embedded SQL in RPGLE Deep Dive, a few are specific to cursor mechanics:

| SQLCODE | Meaning |
|---:|---|
| `0` | Success. |
| `+100` | No row found / end of cursor. On a multi-row `FETCH`, may still carry a partial batch -- see Section 6. |
| `-501` | The cursor referenced in a `FETCH` or `CLOSE` is not open -- see Section 10 for the most common cause (a `COMMIT` closing it). |
| `-502` | The cursor is already open -- an `OPEN` was issued twice without an intervening `CLOSE`. |
| `-508` | The cursor is not positioned on a row, so a positioned `UPDATE`/`DELETE` (`WHERE CURRENT OF`) has nothing to act on -- typically means `SQLCODE` was already `+100` (or the cursor was never successfully fetched) before the positioned statement ran. |
| `-913` | Lock/deadlock/timeout. Another job may be holding a conflicting lock on the row a positioned update is trying to change -- see Section 10's concurrency note. |

In production, don't stop at the bare code: log `SQLCODE`, `SQLSTATE`, the message text, the cursor name, the operation being attempted, and safe key values. "Cursor error" with no other context is exactly as unhelpful here as it would be for any other embedded SQL failure.

---

## 8. GET DIAGNOSTICS for cursor errors

`SQLCODE` alone is often not enough to know *why* a cursor operation failed -- the same `GET DIAGNOSTICS` pattern introduced in [Embedded SQL in RPGLE](/deep-dives/embedded-sql-in-rpgle) applies here too, and is worth reaching for on any cursor error you can't immediately explain from the code alone:

```rpgle
Dcl-S SqlMsg Varchar(500);

Exec Sql
   Get Diagnostics Condition 1
      :SqlMsg = Message_Text;

Dsply ('Cursor error ' + %Char(SqlCode) + ': ' + %Trim(SqlMsg));
```

This isn't a full error-handling topic on its own -- see the Embedded SQL in RPGLE Deep Dive for the complete treatment -- just a reminder that it exists and applies just as well to a failed `FETCH`, `OPEN`, or positioned `UPDATE`/`DELETE` as it does to any other embedded SQL statement.

---

## 9. Closing cursors on all exit paths

Every example above calls `CLOSE` once, on the way out -- but real programs have more than one way out. The pattern to actually follow:

```text
OPEN cursor
Dow (processing loop)
   ...
   If (unexpected error) ;
      CLOSE cursor      <- close before leaving early, not just at the bottom
      Return / handle error
   EndIf;
   ...
EndDo;
CLOSE cursor             <- the "happy path" close
```

- **Close every cursor you open, on every path** -- the happy path at the bottom of the program is the easy one to remember; the early-exit and error branches are the ones that get forgotten.
- **`WITH HOLD` (Section 10) does not mean "leave it open forever."** It means the cursor survives a `COMMIT` inside its own processing loop -- it still needs an explicit `CLOSE` once that loop is actually done.
- **A long-running job that opens cursors and never closes them accumulates open cursor resources** for as long as that job runs -- harmless for a short batch program, a real problem for something that stays active for hours.

---

## 10. WITH HOLD: surviving a COMMIT

By default, a `COMMIT` closes every open cursor in the job running under real commitment control. If your program processes a large result set and commits periodically to keep transactions short, the *next* `FETCH` after that `COMMIT` fails with:

```text
SQLCODE = -501   SQLSTATE 24501
"The cursor specified in a FETCH or CLOSE statement is not open."
```

`WITH HOLD` is the fix -- it tells Db2 for i to keep the cursor open and correctly positioned across the `COMMIT`.

**Member: `PROCORDS`, type `SQLRPGLE`** -- walks every order, marks open orders as shipped, and commits every 2 rows to keep the transaction short:

```rpgle
**FREE
Ctl-Opt DftActGrp(*No) ActGrp(*New);

Dcl-S OrderId     Int(10);
Dcl-S OrdCustId   Int(10);
Dcl-S OrderStatus Char(1);
Dcl-S RowCount    Int(10);

RowCount = 0;

Exec Sql
  Declare AllOrdCurs Cursor With Hold For
    Select Order_Id, Cust_Id, Status
    From   SQLTUTOR.ORDERS
    For Update Of Status;

Exec Sql Open AllOrdCurs;

Exec Sql Fetch AllOrdCurs Into :OrderId, :OrdCustId, :OrderStatus;

Dow SqlCode = 0;
   If OrderStatus = 'O';
      Exec Sql
        Update SQLTUTOR.ORDERS
        Set    Status = 'S'
        Where Current Of AllOrdCurs;
   EndIf;

   RowCount += 1;
   If %Rem(RowCount : 2) = 0;
      Exec Sql Commit;
      Dsply ('Committed after ' + %Char(RowCount) + ' rows');
   EndIf;

   Exec Sql Fetch AllOrdCurs Into :OrderId, :OrdCustId, :OrderStatus;
EndDo;

Exec Sql Commit;
Exec Sql Close AllOrdCurs;

*InLR = *On;
```

**This only demonstrates the intended lesson if you compile with real commitment control** -- `COMMIT(*CHG)`, not `*NONE`:

```text
CRTSQLRPGI OBJ(MYLIB/PROCORDS) SRCFILE(MYLIB/QRPGLESRC) SRCMBR(PROCORDS) +
           COMMIT(*CHG)
```

Under `COMMIT(*NONE)` (see [Embedded SQL in RPGLE](/deep-dives/embedded-sql-in-rpgle)), `EXEC SQL COMMIT` doesn't provide real commit/rollback behavior, so the cursor is never actually at risk of closing in the first place and you wouldn't see the point of `WITH HOLD`. Try removing `With Hold` from the `DECLARE` above and recompiling with `COMMIT(*CHG)` -- the program now fails on the `FETCH` immediately after the first `COMMIT`, with `SQLCODE -501`.

One more edge case worth knowing: **`ROLLBACK` closes held cursors too** -- `WITH HOLD` only protects against `COMMIT`, not `ROLLBACK`. That follows from what `ROLLBACK` means: it undoes everything since the last commit point, including the cursor's progress through the result set.

### Concurrency and locking

An updatable cursor's positioned changes interact with IBM i's normal record locking, the same as any other update:

- A positioned `UPDATE`/`DELETE` can wait on, or fail against, a row another job already has locked -- that's `SQLCODE -913` from Section 7.
- A long cursor loop that touches many rows can hold locks (and other resources) for longer than a quick, targeted statement would -- especially if it's also holding a transaction open across those rows.
- Keep the transaction scope small: commit regularly, but only where your business rules actually allow a partial batch to be considered "done." Don't turn a cursor loop into something that holds interactive users hostage waiting on locks a large update loop is sitting on.

This is intentionally a short practical note, not the full picture -- record locking and commitment control both deserve (and will get) their own dedicated Deep Dives.

---

## 11. Cursors outside RPGLE

Everything above is embedded-SQL/host-language territory -- in interactive SQL (ACS Run SQL Scripts), you never `DECLARE`/`FETCH` by hand; results just stream straight to the results grid. Cursors do show up in one more place on IBM i: **SQL PL** (stored procedures, functions, triggers) has a simplified `FOR` loop that declares, opens, fetches, and closes a cursor for you automatically --

```sql
FOR row_var AS SELECT ... DO
  -- row_var.column_name available here, one row at a time
END FOR;
```

-- which is the SQL PL equivalent of everything in Section 4's manual pattern, condensed to a few lines. The full SQL PL/stored-procedures picture is its own future Deep Dive (see the list at the end of this guide); for now, the manual `DECLARE`/`OPEN`/`FETCH`/`CLOSE` pattern from this Deep Dive and Embedded SQL in RPGLE is what you'll use in every RPGLE program.

---

## 12. Production checklist

- Use a plain forward-only cursor unless you specifically need `SCROLL`, `SENSITIVE`, or `FOR UPDATE`.
- Add `FOR READ ONLY` when a cursor is only ever fetched from -- it states intent and helps prevent an accidental positioned update.
- Use `FOR UPDATE OF` naming only the columns you actually intend to change.
- Prefer a single set-based `UPDATE`/`DELETE`/`MERGE` over a cursor loop whenever the same result is expressible in pure SQL.
- Handle `SQLCODE 100` correctly -- it's "no more rows," not an error, and can still carry a partial multi-row batch.
- Close every cursor you open, on every exit path, not just the happy one.
- After a multi-row `FETCH`, process only elements `1` through `SQLERRD(3)`.
- Use `WITH HOLD` only on cursors that genuinely need to survive a `COMMIT` inside their own loop -- and still `CLOSE` them when the loop is done.
- Keep transactions short; commit only where your business rules allow a partial batch.
- Log `SQLCODE`, `SQLSTATE`, message text (via `GET DIAGNOSTICS`), cursor name, and operation on any cursor failure.
- Watch for locks and long-running loops -- a positioned update can wait on or fail against another job's lock.

---

## 13. Common mistakes

| Mistake | What actually happens |
|---|---|
| Declaring `SCROLL` (or `SENSITIVE`, or `FOR UPDATE`) out of habit on every cursor | Extra overhead Db2 for i doesn't need to pay for a plain forward-only read -- costs real performance at scale |
| Writing a cursor loop to do what a single `UPDATE`/`DELETE` could do | Slower (row-by-row round trips instead of one set-based pass) and more code to maintain |
| Trusting a multi-row fetch's arrays are always full | The last batch is often partial; unread `SQLERRD(3)` means you either miss rows or reprocess stale ones from the previous fetch |
| Committing inside a fetch loop without `WITH HOLD` | Next `FETCH` fails with `SQLCODE -501`, "cursor not open" |
| Assuming `WITH HOLD` protects against `ROLLBACK` too | It doesn't -- only `COMMIT` |
| Forgetting `FOR UPDATE OF column-list` on a cursor you intend to use with `WHERE CURRENT OF` | The positioned `UPDATE`/`DELETE` fails -- Db2 for i needs to know up front which columns are updatable through this cursor |
| Declaring a cursor over a join/aggregate query and expecting `WHERE CURRENT OF` to work | Positioned updates need an unambiguous single-row target -- see Section 5 |

---

## 14. Practice exercises

Using `SQLTUTOR`:

1. Modify `BROWSEORD` to also `FETCH RELATIVE -2` after the `ABSOLUTE 2` fetch, and work out on paper which `ORDER_ID` you expect back before running it.
2. Write a cursor-based program, `CANCELOLD`, that finds every order with `STATUS = 'O'` and a specific `ORDER_ID` less than a given value, setting `STATUS = 'C'` through `WHERE CURRENT OF`. Then write the pure-SQL one-liner that does the same thing, and compare.
3. Change `RPTDETAIL`'s batch size from `FOR 3 ROWS` to `FOR 4 ROWS` and predict what `SQLERRD(3)` will report on each of the two fetches before running it.
4. Remove `With Hold` from `PROCORDS`, compile it with `COMMIT(*CHG)`, run it, and confirm you get `SQLCODE -501` -- then put `With Hold` back and confirm it runs clean.

<details>
<summary>Hints (expand after you've tried)</summary>

- **#1:** `ABSOLUTE 2` lands on order 5002 (per the Section 4 trace). `RELATIVE -2` moves two rows *back from the current position* -- so from row 2, that lands before row 1, which means `SQLCODE = 100` (no row), not a wraparound to the end.
- **#2:** The cursor version needs `Where Current Of` plus the same structure as `BUMPPRICE`; the pure-SQL version is `UPDATE SQLTUTOR.ORDERS SET STATUS = 'C' WHERE STATUS = 'O' AND ORDER_ID < :cutoff;` -- no cursor required, same lesson as Section 5.
- **#3:** 6 total rows / batches of 4 -- first fetch returns 4 rows (`SQLERRD(3) = 4`), second fetch returns the remaining 2 (`SQLERRD(3) = 2`, `SQLCODE = 100`).
- **#4:** The failure happens on the `FETCH` immediately following the first `EXEC SQL COMMIT` inside the loop -- that's the concrete, reproducible version of the "why `WITH HOLD` exists" explanation in Section 10.

</details>

---

## 15. Interview questions

- What is a SQL cursor?
- Why does RPGLE need cursors if SQL is set-based?
- What is the difference between `DECLARE`, `OPEN`, `FETCH`, and `CLOSE`?
- What does `SQLCODE +100` mean in a cursor loop?
- What is the difference between a forward-only cursor and a `SCROLL` cursor?
- When would you use `FETCH ABSOLUTE` or `FETCH RELATIVE`?
- What does `WHERE CURRENT OF` do?
- Why should `FOR UPDATE OF` list only intended columns?
- Why can a positioned update fail?
- What is multi-row `FETCH` and why is it useful?
- Why is `SQLERRD(3)` important after a multi-row `FETCH`?
- What problem does `WITH HOLD` solve?
- Why is a cursor loop sometimes worse than one set-based `UPDATE`?

---

## 16. Ask the AI Tutor

Good follow-up prompts once you've worked through the material above:

- "Explain SQL cursors on IBM i with a simple RPGLE example."
- "Show me the standard DECLARE, OPEN, FETCH, CLOSE cursor pattern."
- "Explain SQLCODE +100 in a cursor loop."
- "Explain SCROLL cursor with FETCH FIRST, LAST, PRIOR, NEXT, ABSOLUTE, and RELATIVE."
- "Help me debug SQLCODE -501 after COMMIT."
- "Explain WHERE CURRENT OF with a positioned update."
- "Explain multi-row FETCH and SQLERRD(3)."
- "When should I avoid a cursor and use set-based SQL instead?"
- "Explain WITH HOLD in embedded SQL on IBM i."
- "Give me practice questions on SQL cursors using SQLTUTOR."

---

## 17. Key takeaways

- A cursor is the row-by-row bridge between SQL's set-based results and host-language code that can only consume one row at a time.
- The lifecycle is always `DECLARE` -> `OPEN` -> `FETCH` -> (optional positioned `UPDATE`/`DELETE`) -> `CLOSE` -- and `WHERE CURRENT OF` only makes sense between a successful `FETCH` and the next one.
- `SCROLL` cursors can move `FIRST`/`LAST`/`NEXT`/`PRIOR`/`ABSOLUTE`/`RELATIVE`; plain cursors are forward-only and lighter-weight -- default to plain unless you need to scroll.
- `FOR UPDATE OF` plus `WHERE CURRENT OF` modifies or deletes exactly the row a cursor is parked on -- but not every `SELECT` is updatable, and a single set-based `UPDATE`/`DELETE`/`MERGE` is often the better tool anyway.
- Multi-row `FETCH ... FOR n ROWS` cuts round trips for large result sets -- always trust `SQLERRD(3)` for the real row count, especially on the last, possibly-partial batch.
- `WITH HOLD` keeps a cursor open across `COMMIT` (not `ROLLBACK`) -- essential for any loop that commits periodically while still fetching, and still needs an explicit `CLOSE` once the loop ends.
- Close every cursor on every exit path, watch for lock contention on positioned updates, and keep transaction scope small.

---

## What's next: future Deep Dives

This Deep Dive deliberately stays focused on cursor mechanics -- it does not go deep on SQL PL stored procedures, triggers, detailed SQLCODE/SQLSTATE handling, native I/O comparisons, or commitment control internals. Those are natural, planned follow-ups:

1. Stored Procedures on IBM i
2. Database Triggers on IBM i
3. SQL Error Handling with SQLCODE and SQLSTATE
4. Native I/O vs SQL Decision Guide
5. Commitment Control with SQL and RPGLE
6. SQL Performance Basics on IBM i

Check the [Deep Dives catalog](/deep-dives) for their current status.
