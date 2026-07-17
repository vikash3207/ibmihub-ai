## Who this is for

You're comfortable with computers, and maybe even with SQL on another platform, but you want to see how it actually works on IBM i, or you've supported IBM i systems using RPGLE/CL and native file access and SQL is the next tool you want in your belt. No prior Db2 for i experience is assumed, but this guide moves quickly and goes deep -- like every Deep Dive on iRPGenie, it's written for a working developer, not a first-day beginner, and it doesn't stop at syntax.

By the end you'll be able to:

- Explain how SQL fits into the IBM i architecture, and why Db2 for i isn't "a database on IBM i" but part of IBM i itself
- Build a small practice schema and query it with joins, aggregation, subqueries, and CTEs
- Explain `*SQL` vs `*SYS` naming and use `CURRENT SCHEMA` correctly
- Read the IBM i SQL catalog (`QSYS2`) to inspect what you and others have built
- Use constraints, indexes, and views appropriately, and understand what a `DELETE` can run into when other tables reference it
- Recognize static vs. dynamic SQL, read `SQLCODE`/`SQLSTATE`, and know what to check before assuming success
- Speak to the authority, transaction, and production considerations that come up once this code leaves your own session

---

## 1. Why SQL on IBM i is different (in a good way)

On most platforms, SQL talks to "the database" -- a separate product running as its own process, usually on its own box, with its own connection string. On IBM i, **Db2 for i is built into the operating system itself.** There's no separate install, no separate server to start, no connection string pointing at another machine (unless you deliberately set one up for distributed access). When you run SQL against `MYLIB.CUSTOMER`, you're operating directly on the same objects an RPGLE program could `CHAIN` into a moment later.

```text
                Application
                     |
        +------------+------------+
        |            |            |
      RPGLE       ACS SQL      JDBC/.NET
        |            |            |
        +------------+------------+
                     |
                 SQL Engine
                     |
              Query Optimizer
                     |
                 Db2 for i
                     |
        Physical Files / SQL Tables
```

Every SQL statement goes through the same pipeline: parse, validate, resolve the schema/library, check your authority to the object, build (or reuse) an access plan, execute, hand back a result.

**The one fact that resolves most IBM i SQL confusion:** a SQL table and a DDS-defined physical file are *both* stored as the same underlying `*FILE` object type. SQL is a different way of *defining and accessing* data, not a different way of *storing* it. That's why an RPGLE program can read a SQL table with `CHAIN`, and a SQL statement can query a DDS-defined physical file -- they're both just `*FILE` objects underneath. (This exact relationship, and how it plays out with DDS specifically, is covered lesson-length in [DDS and SQL: Two Ways to Define Db2 for i Data](/learn/ibm-i-fundamentals/dds-and-sql-two-ways-to-define-db2-for-i-data) and [SQL Tables vs DDS Physical Files](/learn/ibm-i-fundamentals/sql-tables-vs-dds-physical-files) if you want the fuller walkthrough.)

---

## 2. Where you'll actually type SQL

Two built-in options, no extra install required:

| Tool | Best for |
|---|---|
| **ACS Run SQL Scripts** (IBM i Access Client Solutions) | The recommended way to learn and work today -- syntax highlighting, multi-statement scripts, result grids, Visual Explain, output to spreadsheet. This Deep Dive assumes you're using it. |
| **STRSQL** (green-screen Interactive SQL) | Still around, still works, useful when you only have terminal access. One statement at a time. |

Open **ACS -> Run SQL Scripts**, connect to your system, and you're ready for the rest of this guide. (See [ACS Run SQL Scripts for IBM i Developers](/learn/ibm-i-fundamentals/acs-run-sql-scripts-for-ibm-i-developers) if you haven't used it before.)

---

## 3. Naming conventions: `*SQL` vs `*SYS`

IBM i lets you write object names two ways, and this trips up almost every newcomer -- especially developers coming from library-list thinking, where "what library am I in right now" already has its own mental model before SQL adds a second one on top.

```sql
-- *SYS naming (library/object) -- the traditional IBM i style
SELECT * FROM MYLIB/CUSTOMER;

-- *SQL naming (schema.object) -- the ANSI SQL style
SELECT * FROM MYLIB.CUSTOMER;
```

- **`*SYS` naming** uses the library/object, slash-separated style IBM i has always used. It leans on the job's library list the same way a CL command or native RPGLE `CHAIN` would.
- **`*SQL` naming** uses the schema.object, dot-separated ANSI style every non-IBM-i database uses.

Both point at the exact same object -- **a library and an SQL schema are the same thing on IBM i.** The difference is purely which separator character your SQL session is configured to expect, plus a few behavioral differences in delimited identifiers and how some errors are reported. What actually causes confusion isn't the separator; it's that **an unqualified name can resolve differently depending on your naming mode and session settings** -- the same bare `CUSTOMER` can mean two different physical objects on two different sessions if their library lists or current schema differ. That ambiguity is exactly why the rule below matters.

**Use `*SQL` naming (the dot) for everything you write going forward**, and **fully qualify names in examples and production code.** It's the ANSI-standard style, it's what IBM recommends for new development, and it removes the ambiguity above entirely -- a fully qualified `SQLTUTOR.CUSTOMER` means the same thing regardless of naming mode, library list, or current schema. Don't casually mix `*SYS` and `*SQL` styles in the same script either; picking one and staying consistent is part of what makes SQL code easy to review. Every example in this Deep Dive uses `*SQL` naming, fully qualified.

### Simplifying names with CURRENT SCHEMA

Typing `SQLTUTOR.` in front of every table name gets old fast during interactive exploration. `CURRENT SCHEMA` sets a default schema for the session so unqualified names resolve against it:

```sql
-- See what your session is currently using
VALUES CURRENT_SCHEMA;

-- Point it at the practice schema
SET CURRENT SCHEMA SQLTUTOR;

-- Now unqualified names resolve against SQLTUTOR
SELECT * FROM CUSTOMER;
```

With `CURRENT SCHEMA` set to `SQLTUTOR`, `SELECT * FROM CUSTOMER` resolves to `SQLTUTOR.CUSTOMER` -- nothing else changes about the object, and the setting resets when you reconnect. This is genuinely convenient for ad hoc exploration in ACS Run SQL Scripts. It is **not** a substitute for qualifying names in application code (embedded SQL, views, stored procedures), where you want an object to resolve the same way every time regardless of whatever schema happens to be current when that code runs. For the rest of this Deep Dive, examples stay fully qualified even where `CURRENT SCHEMA` would let us shorten them -- clarity for learning material beats brevity.

---

## 4. Build the practice database

Create a small, realistic schema and use it for every example that follows: a customer, their orders, and the products on those orders. Run this in ACS Run SQL Scripts.

First, create a schema (library) to work in, so you don't clutter anything else. `SQLTUTOR` stays within the traditional 10-character IBM i object/library naming comfort zone -- short and unambiguous:

```sql
CREATE SCHEMA SQLTUTOR;
```

Now the tables:

```sql
CREATE TABLE SQLTUTOR.CUSTOMER (
  CUST_ID      INT           NOT NULL,
  CUST_NAME    VARCHAR(50)   NOT NULL,
  CITY         VARCHAR(30),
  STATE        CHAR(2),
  CREDIT_LIMIT DECIMAL(9,2)  DEFAULT 0,
  PRIMARY KEY (CUST_ID)
);

CREATE TABLE SQLTUTOR.PRODUCT (
  PROD_ID      INT           NOT NULL,
  PROD_NAME    VARCHAR(50)   NOT NULL,
  UNIT_PRICE   DECIMAL(9,2)  NOT NULL,
  QTY_ON_HAND  INT           DEFAULT 0,
  PRIMARY KEY (PROD_ID)
);

CREATE TABLE SQLTUTOR.ORDERS (
  ORDER_ID     INT           NOT NULL,
  CUST_ID      INT           NOT NULL,
  ORDER_DATE   DATE          NOT NULL,
  STATUS       CHAR(1)       DEFAULT 'O',   -- O=Open, S=Shipped, C=Cancelled
  PRIMARY KEY (ORDER_ID),
  FOREIGN KEY (CUST_ID) REFERENCES SQLTUTOR.CUSTOMER (CUST_ID)
);

CREATE TABLE SQLTUTOR.ORDER_DETAIL (
  ORDER_ID     INT           NOT NULL,
  LINE_NO      INT           NOT NULL,
  PROD_ID      INT           NOT NULL,
  QTY          INT           NOT NULL,
  UNIT_PRICE   DECIMAL(9,2)  NOT NULL,
  PRIMARY KEY (ORDER_ID, LINE_NO),
  FOREIGN KEY (ORDER_ID) REFERENCES SQLTUTOR.ORDERS (ORDER_ID),
  FOREIGN KEY (PROD_ID)  REFERENCES SQLTUTOR.PRODUCT (PROD_ID)
);
```

> **Worth noticing:** you just created four `*FILE` objects in library `SQLTUTOR` using nothing but SQL DDL -- no DDS source member in sight. That's the "SQL table" from Section 1, in practice.

### Load some sample data

```sql
INSERT INTO SQLTUTOR.CUSTOMER (CUST_ID, CUST_NAME, CITY, STATE, CREDIT_LIMIT) VALUES
  (1, 'Rochester Manufacturing', 'Rochester', 'MN', 50000.00),
  (2, 'Austin Fabricators',      'Austin',    'TX', 25000.00),
  (3, 'Toronto Distributors',    'Toronto',   'ON', 10000.00),
  (4, 'Denver Tools',            'Denver',    'CO', 15000.00);

INSERT INTO SQLTUTOR.PRODUCT (PROD_ID, PROD_NAME, UNIT_PRICE, QTY_ON_HAND) VALUES
  (100, 'Steel Bracket',   4.50,  1200),
  (101, 'Hydraulic Valve', 89.00, 75),
  (102, 'Control Panel',   450.00, 12),
  (103, 'Sensor Cable',    18.75, 300);

INSERT INTO SQLTUTOR.ORDERS (ORDER_ID, CUST_ID, ORDER_DATE, STATUS) VALUES
  (5001, 1, '2026-06-01', 'S'),
  (5002, 2, '2026-06-03', 'O'),
  (5003, 1, '2026-06-10', 'O'),
  (5004, 3, '2026-06-11', 'C');

INSERT INTO SQLTUTOR.ORDER_DETAIL (ORDER_ID, LINE_NO, PROD_ID, QTY, UNIT_PRICE) VALUES
  (5001, 1, 100, 200, 4.50),
  (5001, 2, 101, 5,   89.00),
  (5002, 1, 102, 2,   450.00),
  (5003, 1, 100, 50,  4.50),
  (5003, 2, 102, 1,   450.00),
  (5004, 1, 101, 10,  89.00);
```

Notice **`Denver Tools` (customer 4) has no orders**, and **`Sensor Cable` (product 103) is never ordered**. That's deliberate -- Sections 7 and 9 use exactly these two rows to show what a `LEFT JOIN` and a `NOT EXISTS` query look like when there's actually a non-match to find, instead of every row conveniently having a match.

Keep this schema open in ACS -- every query below runs against it.

### Resetting the practice schema (destructive -- read first)

If you rerun the setup script above from scratch, `CREATE SCHEMA` and `CREATE TABLE` will fail because the schema and tables already exist. If you want a clean slate, drop everything first, in this order (child tables before the parents they reference):

```sql
DROP TABLE SQLTUTOR.ORDER_DETAIL;
DROP TABLE SQLTUTOR.ORDERS;
DROP TABLE SQLTUTOR.PRODUCT;
DROP TABLE SQLTUTOR.CUSTOMER;
DROP SCHEMA SQLTUTOR;
```

**`DROP` permanently deletes the object and all the data in it -- there is no undo.** This is fine here because `SQLTUTOR` is a disposable practice schema you created for this guide. Never run `DROP TABLE` or `DROP SCHEMA` against a production library out of habit or convenience; on a real system, dropping the wrong object is an incident, not an inconvenience.

---

## 5. Exploring your schema with the IBM i SQL catalog

Db2 for i exposes its own metadata as SQL views under the `QSYS2` schema -- these are IBM i **SQL Services**, and they're one of the most practical things to learn early, because they let you answer "what actually exists?" without switching tools or guessing from memory.

```sql
-- What tables exist in this schema?
SELECT TABLE_SCHEMA, TABLE_NAME, TABLE_TYPE
FROM   QSYS2.SYSTABLES
WHERE  TABLE_SCHEMA = 'SQLTUTOR';

-- What columns does each table have?
SELECT TABLE_NAME, COLUMN_NAME, DATA_TYPE, LENGTH
FROM   QSYS2.SYSCOLUMNS
WHERE  TABLE_SCHEMA = 'SQLTUTOR'
ORDER BY TABLE_NAME, ORDINAL_POSITION;
```

You're querying `QSYS2.SYSTABLES` and `QSYS2.SYSCOLUMNS` the exact same way you'd query `SQLTUTOR.CUSTOMER` -- they're just SQL views over the system's own object catalog. These two are the ones you'll reach for most often to confirm a table or column actually exists before writing a query against it, but they're two views out of dozens: `QSYS2` also exposes indexes, constraints, jobs, active connections, system values, IFS objects, and much more, all queryable with plain SQL. That breadth is genuinely useful for operations, troubleshooting, and system visibility -- if IBM i SQL Services turn out to be something you want to go deeper on, that's a natural candidate for its own future Deep Dive; this section is just enough to get you using the catalog confidently for schema/table/column lookups.

---

## 6. Querying data: SELECT, WHERE, ORDER BY

The simplest possible query:

```sql
SELECT * FROM SQLTUTOR.CUSTOMER;
```

**Avoid `SELECT *` in application code.** It returns more data than the program actually needs, makes the program's behavior depend on the table's current shape, and can break silently when someone adds a column later (a `SELECT INTO` with more host variables than result columns, or vice versa, is exactly the kind of failure that shows up at runtime instead of compile time). `SELECT *` is fine for quick, throwaway exploration in ACS Run SQL Scripts, like the line above -- just don't let it survive into a program.

```sql
SELECT CUST_NAME, CITY, STATE
FROM   SQLTUTOR.CUSTOMER
WHERE  STATE = 'MN';
```

Sorting with `ORDER BY`:

```sql
SELECT PROD_NAME, UNIT_PRICE
FROM   SQLTUTOR.PRODUCT
ORDER BY UNIT_PRICE DESC;
```

Common `WHERE` patterns you'll use constantly:

```sql
-- Range
SELECT * FROM SQLTUTOR.ORDERS
WHERE  ORDER_DATE BETWEEN '2026-06-01' AND '2026-06-10';

-- List of values
SELECT * FROM SQLTUTOR.ORDERS
WHERE  STATUS IN ('O', 'S');

-- Pattern match (% = any characters, _ = one character)
SELECT * FROM SQLTUTOR.CUSTOMER
WHERE  CUST_NAME LIKE '%Manufacturing%';

-- NULL check -- never use = NULL, it silently matches nothing
SELECT * FROM SQLTUTOR.CUSTOMER
WHERE  CREDIT_LIMIT IS NOT NULL;
```

---

## 7. Joins: combining tables

This is where relational databases earn their keep. An order header alone isn't very useful -- you want to know *whose* order and *what's on it*.

### INNER JOIN -- only matching rows

```sql
SELECT O.ORDER_ID, C.CUST_NAME, O.ORDER_DATE, O.STATUS
FROM   SQLTUTOR.ORDERS  AS O
INNER JOIN SQLTUTOR.CUSTOMER AS C
  ON   O.CUST_ID = C.CUST_ID
ORDER BY O.ORDER_ID;
```

Read this out loud: "Get orders, and for each one, bring in the matching customer row where the customer IDs line up."

### Three-way join

Pull the order, the customer, and the product name on each line:

```sql
SELECT O.ORDER_ID,
       C.CUST_NAME,
       P.PROD_NAME,
       D.QTY,
       D.UNIT_PRICE,
       (D.QTY * D.UNIT_PRICE) AS LINE_TOTAL
FROM   SQLTUTOR.ORDERS       AS O
INNER JOIN SQLTUTOR.CUSTOMER AS C ON O.CUST_ID = C.CUST_ID
INNER JOIN SQLTUTOR.ORDER_DETAIL AS D ON O.ORDER_ID = D.ORDER_ID
INNER JOIN SQLTUTOR.PRODUCT  AS P ON D.PROD_ID = P.PROD_ID
ORDER BY O.ORDER_ID, D.LINE_NO;
```

### LEFT JOIN -- keep rows even without a match

Every customer, whether or not they've placed an order:

```sql
SELECT C.CUST_NAME, O.ORDER_ID, O.ORDER_DATE
FROM   SQLTUTOR.CUSTOMER    AS C
LEFT JOIN SQLTUTOR.ORDERS   AS O
  ON   C.CUST_ID = O.CUST_ID
ORDER BY C.CUST_NAME;
```

`Denver Tools` has no rows in `ORDERS`, so it comes back with `ORDER_ID` and `ORDER_DATE` as `NULL` instead of disappearing from the result -- that's the whole point of `LEFT JOIN` versus `INNER JOIN`, and it's exactly the case an `INNER JOIN` would have hidden from you.

---

## 8. Aggregation: GROUP BY, HAVING

Total order value per customer:

```sql
SELECT C.CUST_NAME,
       COUNT(DISTINCT O.ORDER_ID)              AS ORDER_COUNT,
       SUM(D.QTY * D.UNIT_PRICE)                AS TOTAL_VALUE
FROM   SQLTUTOR.CUSTOMER     AS C
INNER JOIN SQLTUTOR.ORDERS   AS O ON C.CUST_ID = O.CUST_ID
INNER JOIN SQLTUTOR.ORDER_DETAIL AS D ON O.ORDER_ID = D.ORDER_ID
GROUP BY C.CUST_NAME
ORDER BY TOTAL_VALUE DESC;
```

`GROUP BY` collapses rows into buckets; the aggregate functions (`SUM`, `COUNT`, `AVG`, `MIN`, `MAX`) then compute one value per bucket. Note this query uses `INNER JOIN`, so `Denver Tools` -- with zero orders -- has nothing to aggregate and correctly doesn't appear at all; that's different from "the query is broken," it's the expected behavior of an inner join over a customer with no matching rows.

`HAVING` filters *after* grouping (whereas `WHERE` filters *before* grouping) -- use it when the condition involves an aggregate:

```sql
SELECT C.CUST_NAME, SUM(D.QTY * D.UNIT_PRICE) AS TOTAL_VALUE
FROM   SQLTUTOR.CUSTOMER     AS C
INNER JOIN SQLTUTOR.ORDERS   AS O ON C.CUST_ID = O.CUST_ID
INNER JOIN SQLTUTOR.ORDER_DETAIL AS D ON O.ORDER_ID = D.ORDER_ID
GROUP BY C.CUST_NAME
HAVING SUM(D.QTY * D.UNIT_PRICE) > 1000;
```

---

## 9. Subqueries and CTEs

A subquery is a query nested inside another one. Customers who have placed at least one order:

```sql
SELECT CUST_NAME
FROM   SQLTUTOR.CUSTOMER
WHERE  CUST_ID IN (SELECT CUST_ID FROM SQLTUTOR.ORDERS);
```

Products that have never been ordered -- a subquery is often the cleanest way to express "doesn't exist":

```sql
SELECT PROD_NAME
FROM   SQLTUTOR.PRODUCT AS P
WHERE  NOT EXISTS (
  SELECT 1 FROM SQLTUTOR.ORDER_DETAIL AS D
  WHERE  D.PROD_ID = P.PROD_ID
);
```

With the sample data from Section 4, this returns exactly `Sensor Cable` -- the one product that never appears in `ORDER_DETAIL`. That's the case `NOT EXISTS` is actually for; without a genuine never-ordered row in the data, this query would silently return nothing and you'd have no way to tell whether the SQL was right or the data just didn't exercise it.

For anything with more than one nested layer, a **CTE** (`WITH` clause) keeps the query readable by naming each step:

```sql
WITH ORDER_TOTALS AS (
  SELECT ORDER_ID, SUM(QTY * UNIT_PRICE) AS ORDER_VALUE
  FROM   SQLTUTOR.ORDER_DETAIL
  GROUP BY ORDER_ID
)
SELECT O.ORDER_ID, C.CUST_NAME, T.ORDER_VALUE
FROM   SQLTUTOR.ORDERS   AS O
INNER JOIN SQLTUTOR.CUSTOMER AS C ON O.CUST_ID = C.CUST_ID
INNER JOIN ORDER_TOTALS     AS T ON O.ORDER_ID = T.ORDER_ID
WHERE  T.ORDER_VALUE > 500
ORDER BY T.ORDER_VALUE DESC;
```

`ORDER_TOTALS` behaves like a temporary named table for the duration of this one statement -- nothing is actually stored. If you find yourself writing the same logic repeatedly across many statements, that's the cue to make it a view instead (Section 10).

---

## 10. Constraints, indexes, and views

You've already been using constraints since Section 4 without a separate explanation -- this section makes them explicit, plus the two other object types that round out a practical schema.

- **Primary key** -- `SQLTUTOR.CUSTOMER`'s `PRIMARY KEY (CUST_ID)` guarantees every customer has a unique, non-null identifier. Every table above has one.
- **Foreign key** -- `SQLTUTOR.ORDERS`' `FOREIGN KEY (CUST_ID) REFERENCES SQLTUTOR.CUSTOMER (CUST_ID)` guarantees you can never insert an order for a customer that doesn't exist, and (as Section 11 shows) protects existing parent rows from being deleted out from under their children.
- **Unique constraint** -- like a primary key (no duplicates allowed), but for a column that isn't the table's identifier -- e.g. you might add `UNIQUE (CUST_NAME)` if the business rule is "no two customers can have the exact same name," without making `CUST_NAME` the primary key.
- **Check constraint** -- restricts what values a column can hold, enforced by the database itself rather than by application code remembering to validate. For example, `ALTER TABLE SQLTUTOR.ORDERS ADD CONSTRAINT ORDERS_STATUS_CK CHECK (STATUS IN ('O','S','C'))` would make an invalid status value impossible to insert, from any program, forever -- not just from the one you remembered to add validation to.

Primary keys, foreign keys, and check/unique constraints all exist to make certain kinds of bad data structurally impossible, rather than relying on every caller to remember the rule.

**Index** -- a permanent object the optimizer can choose to use to speed up a specific access pattern (filtering, joining, or sorting). Creating one to speed up "find this customer's orders, in date order":

```sql
CREATE INDEX SQLTUTOR.ORDERS_BY_CUSTOMER
ON SQLTUTOR.ORDERS (CUST_ID, ORDER_DATE);
```

Creating an index doesn't force the optimizer to use it -- Section 14 covers how that decision actually gets made. Column order matters: this index helps queries that filter or sort by `CUST_ID` first (optionally then `ORDER_DATE`), not the reverse.

**View** -- a named, reusable query that behaves like a read-only table. Useful once you're writing the same shape of query repeatedly:

```sql
CREATE VIEW SQLTUTOR.ORDER_TOTALS AS
SELECT ORDER_ID, SUM(QTY * UNIT_PRICE) AS ORDER_VALUE
FROM   SQLTUTOR.ORDER_DETAIL
GROUP BY ORDER_ID;
```

```sql
SELECT * FROM SQLTUTOR.ORDER_TOTALS WHERE ORDER_VALUE > 500;
```

A view stores the query definition, not the data -- every `SELECT` against it reads the underlying tables fresh. Compare this to the CTE in Section 9: a CTE's name is scoped to one statement, while a view is a permanent object other queries, programs, and people can reuse.

Indexing and performance tuning go considerably deeper than this (access plans, Visual Explain, temporary index costs) -- that's deliberately out of scope here and is a natural candidate for its own future Deep Dive (see the list at the end of this guide).

---

## 11. Changing data: INSERT, UPDATE, DELETE

You already saw `INSERT` in Section 4. Two more you'll use constantly:

```sql
-- UPDATE: always filter with WHERE, or you'll update every row
UPDATE SQLTUTOR.ORDERS
SET    STATUS = 'S'
WHERE  ORDER_ID = 5003;
```

**Habit to build now:** before running an `UPDATE` or `DELETE`, run the same `WHERE` clause as a `SELECT` first and eyeball the rows it matches. It costs ten seconds and it's the single best way to avoid updating or deleting the wrong 10,000 rows.

```sql
-- Check first...
SELECT * FROM SQLTUTOR.ORDERS WHERE ORDER_ID = 5003;
-- ...then act
UPDATE SQLTUTOR.ORDERS SET STATUS = 'S' WHERE ORDER_ID = 5003;
```

### Referential integrity: why a DELETE can fail even when the row exists

Order `5004` exists in `SQLTUTOR.ORDERS`, its status is `'C'` (cancelled), and it looks like a reasonable candidate to clean up:

```sql
DELETE FROM SQLTUTOR.ORDERS
WHERE  ORDER_ID = 5004 AND STATUS = 'C';
```

**This fails.** `SQLTUTOR.ORDER_DETAIL` has a row (`ORDER_ID = 5004, LINE_NO = 1`) whose foreign key references this exact order, and no cascade delete was defined on that foreign key. Db2 for i refuses to delete the parent row while a child row still points at it -- you'd see `SQLCODE -530` (see Section 13). **This is referential integrity working correctly, not a bug to work around.** The child rows in `ORDER_DETAIL` are actively protecting the parent row in `ORDERS` from being deleted while something still depends on it.

The correct sequence deletes the child rows first, then the parent:

```sql
DELETE FROM SQLTUTOR.ORDER_DETAIL
WHERE  ORDER_ID = 5004;

DELETE FROM SQLTUTOR.ORDERS
WHERE  ORDER_ID = 5004;
```

In a real application, don't treat this as "the fix" without also asking whether you should be deleting transactional history at all. Cancelled orders are often kept for audit, reporting, or reconciliation, and the business rule may be "mark it cancelled and keep it" rather than "delete it." Know the actual retention rule before writing the `DELETE`.

---

## 12. Static vs. dynamic SQL (and why IBM i cares more than most platforms)

| | Static SQL | Dynamic SQL |
|---|---|---|
| When the statement is fixed | Compile time | Runtime |
| Validated | At compile time -- typos and bad object references are caught before the program ever runs | At runtime -- errors surface only when that code path executes |
| Performance | Access plan built once, reused on every call | Plan may need to be prepared on the fly (unless cached) |
| Typical use | SQL embedded in RPGLE/COBOL where the statement text never changes | Building a WHERE clause at runtime from user-selected filters, ad hoc reporting tools |

Everything you've run so far in ACS Run SQL Scripts is dynamic SQL -- the statement text is sent to the engine and prepared on the spot. **Embedded SQL**, by contrast, is written directly inside an RPGLE program and precompiled before the RPGLE compiler ever sees it:

```text
SQLRPGLE Source -> SQL Precompiler -> Generated RPG -> RPG Compiler -> Program Object
```

The **SQL precompiler** strips out the `EXEC SQL` blocks, validates them against the actual database, and replaces them with generated RPG/host-language calls. That precompile step is exactly why static embedded SQL catches a typo'd column name at compile time, while the equivalent mistake in a dynamically built string only shows up when that line of code actually runs.

If you need to build SQL text at runtime inside RPGLE (dynamic SQL from a host language), it looks like this:

```rpgle
Exec SQL
   Prepare S1 From :SqlStmt;

Exec SQL
   Execute S1;
```

**Use parameter markers or host variables, not string concatenation**, when building dynamic SQL -- concatenating a value directly into the statement text is both slower (the plan can't be reused across calls with different values) and the same class of mistake as SQL injection on any other platform.

**SQL Packages (`*SQLPKG`)** are how IBM i avoids paying the "prepare" cost repeatedly -- they store previously prepared statements so the engine can reuse an access plan instead of re-optimizing the same statement shape over and over. You won't manage these directly as a beginner, but it's useful to know they're the reason a program's second run of a query is often faster than its first. (For the fuller treatment of precompilation, see [SQL Precompilation with CRTSQLRPGI](/learn/ibm-i-fundamentals/sql-precompilation-with-crtsqlrpgi) and [Static SQL vs Dynamic SQL on IBM i](/learn/ibm-i-fundamentals/static-sql-vs-dynamic-sql-on-ibm-i).)

---

## 13. Reading the result: SQLCODE and SQLSTATE

Every SQL statement -- typed interactively or embedded in a program -- returns a status. In embedded SQL this comes back in the **SQLCA** (SQL Communication Area). `SQLCODE` is IBM i/Db2-specific and gives the most precise detail; `SQLSTATE` is the ANSI-standard 5-character equivalent, useful if your code needs to be portable across databases.

| SQLCODE | Meaning |
|---:|---|
| `0` | Success. |
| `+100` | No row found / end of cursor. Not an error by itself -- a normal "nothing to return" outcome. |
| `-104` | Syntax error or invalid SQL statement structure. |
| `-204` | Object not found. Usually a wrong schema/table name, wrong naming mode, a missing library, or the object genuinely doesn't exist. |
| `-407` | Null value not allowed. A `NULL` was assigned to a `NOT NULL` column. |
| `-530` | Foreign key violation. A parent row is missing, or a child/parent relationship prevents the operation -- this is exactly what Section 11's `DELETE` example runs into. |
| `-803` | Duplicate key. An insert/update violates a primary key or unique constraint. |
| `-913` | Lock/deadlock/timeout-type issue. Another job may be holding a conflicting lock. |

`+100` is not an error, and it's the one new developers most often mishandle by treating it as a failure. Everything with a negative `SQLCODE` is a real problem your code needs to branch on -- don't lump `+100` in with those.

In embedded SQL, the RPGLE side of checking it looks like this:

```rpgle
Exec SQL
   Select CUST_NAME
     Into :CustomerName
     From SQLTUTOR.CUSTOMER
    Where CUST_ID = :CustNo;

If SQLCODE = 0;
   // Found: CustomerName is populated
ElseIf SQLCODE = 100;
   // No row found: not necessarily an error
Else;
   // Log SQLCODE / SQLSTATE
EndIf;
```

In production code, log `SQLCODE`, `SQLSTATE`, the message text, some indication of which statement it came from, and the key input values (where that's safe to log) -- "the query failed" with no context is one of the most common gaps that turns a five-minute fix into an hour of guessing. (For more of this in depth, see [SQLCA, SQLCODE, and SQLSTATE in Depth](/learn/ibm-i-fundamentals/sqlca-sqlcode-and-sqlstate-in-depth).)

---

## 14. How the optimizer decides what to do

When you submit a query, the Db2 for i **query optimizer** decides, automatically, how to actually get the data:

- Which index (if any) to use
- What order to join your tables in
- Whether to build a temporary index on the fly if a useful one doesn't exist
- Whether the work can be split across parallel tasks

This is why two queries that return identical results can perform very differently, and why adding the right index (Section 10) can turn a slow query into a fast one without changing the SQL at all. You don't need to hand-tune this as a beginner -- just know it's happening, and that **you almost never need to add an index "just in case."** Add one when a specific, measured slow query calls for it, and use ACS's Visual Explain to see what the optimizer is actually doing before guessing at a fix. (Full treatment: [Query Optimization Basics on Db2 for i](/learn/ibm-i-fundamentals/query-optimization-basics-on-db2-for-i).)

---

## 15. Transactions and commitment control (a short introduction)

Depending on your job, session, and application settings, SQL changes may run under **commitment control** -- a set of pending changes that only become permanent when you explicitly `COMMIT`, and can be entirely undone with `ROLLBACK` if something goes wrong partway through a multi-statement unit of work.

- **`COMMIT`** confirms every pending change since the last commit/rollback boundary.
- **`ROLLBACK`** backs out every pending change since that boundary, as if it never happened.

This matters most when a single business transaction touches more than one table -- inserting an order header and its detail lines, for example. Without commitment control, a failure partway through could leave the header committed with no detail lines, a state your application never intended to exist. Real IBM i applications that need this guarantee typically require **journaling and commitment control together**, and the specifics of how a job's commitment definition and isolation level actually behave deserve their own dedicated treatment, not a rushed paragraph here. Treat `DELETE`/`UPDATE` statements in production code carefully with this in mind -- know what commitment environment they're running under before assuming a failure midway leaves things in a safe state. This is intentionally just an introduction; a full Commitment Control Deep Dive is on the roadmap (see the list at the end of this guide).

---

## 16. Authority and security considerations

SQL does not bypass IBM i object authority -- it runs through the same authority checks as any other access method. Practically, that means:

- A user needs authority to the **schema** and to the specific **table/view** they're querying, inserting into, updating, or deleting from.
- **Creating** objects (a table, an index, a view) requires create authority on the target schema/library, not just authority to use existing objects in it.
- `SELECT`, `INSERT`, `UPDATE`, and `DELETE` each require the matching authority on the object -- having one doesn't imply the others.
- Adopted authority, service programs, external stored procedures, and broader application-security design are real, common patterns on IBM i, but they're advanced topics in their own right and deliberately out of scope for this introduction.

The takeaway for now: if a statement that looks syntactically correct fails, authority is a real candidate alongside a typo or a missing object -- don't assume every failure is a naming or syntax problem.

---

## 17. Production checklist

Pulling together the practices from every section above:

- Use fully qualified object names where appropriate (Section 3); reserve `CURRENT SCHEMA` for ad hoc exploration, not application code.
- Avoid `SELECT *` in application code (Section 6).
- Understand `*SQL` vs `*SYS` naming and don't mix them casually in the same script (Section 3).
- Handle `SQLCODE`/`SQLSTATE` on every statement that can fail (Section 13) -- and treat `+100` as a normal outcome, not an error.
- Use host variables or parameter markers instead of string concatenation in dynamic SQL (Section 12).
- Understand `NULL` behavior -- `= NULL` never matches; use `IS NULL`/`IS NOT NULL` (Section 6).
- `SELECT` before you `UPDATE`/`DELETE` (Section 11).
- Understand referential integrity before deleting a row that other tables might reference (Section 11) -- a failed `DELETE` because of a foreign key is the database protecting you, not a bug.
- Add indexes based on real, measured query needs, not guesses (Sections 10 and 14).
- Use ACS Run SQL Scripts and Visual Explain to investigate before changing anything.
- Don't assume SQL is inherently slower than native I/O -- it depends entirely on the optimizer, indexing, and access pattern.
- Query `QSYS2.SYSTABLES`/`QSYS2.SYSCOLUMNS` (Section 5) to confirm an object or column actually exists rather than relying on memory.
- Never run destructive SQL (`DROP`, unscoped `DELETE`) against a production library casually (Section 4).

---

## 18. Common misconceptions

| Myth | Reality |
|---|---|
| "SQL tables are different from physical files" | Both are `*FILE` objects under the covers -- see Section 1. |
| "SQL is always slower than native I/O (CHAIN/SETLL)" | Depends entirely on the optimizer, indexing, and access pattern -- often SQL is *faster* for set-based operations. |
| "You always need an index before SQL will perform" | Not always -- the optimizer can build a temporary index on the fly, though a permanent one is usually cheaper for repeated queries. |
| "`*SYS` and `*SQL` naming access different data" | Same objects, same data -- only the separator and a few edge-case behaviors differ. |
| "A `DELETE` that fails must be a bug" | Often it's a foreign key doing exactly its job -- see Section 11. |

---

## 19. Practice exercises

Try these against the `SQLTUTOR` schema before checking the answers.

1. List all products with fewer than 100 units on hand.
2. List each customer's total order value -- i.e., the sum of `(QTY * UNIT_PRICE)` across all their orders.
3. Find customers who have never placed an order, using a `LEFT JOIN` (not a subquery).
4. Find the single most expensive product that has actually appeared on an order.

<details>
<summary>Answers (expand after you've tried)</summary>

```sql
-- 1
SELECT PROD_NAME, QTY_ON_HAND
FROM   SQLTUTOR.PRODUCT
WHERE  QTY_ON_HAND < 100;

-- 2
SELECT C.CUST_NAME, SUM(D.QTY * D.UNIT_PRICE) AS TOTAL_SPENT
FROM   SQLTUTOR.CUSTOMER AS C
INNER JOIN SQLTUTOR.ORDERS AS O ON C.CUST_ID = O.CUST_ID
INNER JOIN SQLTUTOR.ORDER_DETAIL AS D ON O.ORDER_ID = D.ORDER_ID
GROUP BY C.CUST_NAME;
-- Denver Tools has no orders, so it correctly does not appear here -- this
-- is an INNER JOIN; see Section 8.

-- 3
SELECT C.CUST_NAME
FROM   SQLTUTOR.CUSTOMER AS C
LEFT JOIN SQLTUTOR.ORDERS AS O ON C.CUST_ID = O.CUST_ID
WHERE  O.ORDER_ID IS NULL;
-- Returns 'Denver Tools'.

-- 4
SELECT P.PROD_NAME, P.UNIT_PRICE
FROM   SQLTUTOR.PRODUCT AS P
WHERE  P.PROD_ID IN (SELECT DISTINCT PROD_ID FROM SQLTUTOR.ORDER_DETAIL)
ORDER BY P.UNIT_PRICE DESC
FETCH FIRST 1 ROW ONLY;
-- 'Sensor Cable' is excluded -- it's never been ordered, so it's correctly
-- not a candidate here even though it's not the cheapest product overall.
```

</details>

---

## 20. Interview questions

- What is Db2 for i, and how is it different from a separate database server?
- How is a SQL table related to a physical file on IBM i?
- What is the difference between `*SQL` and `*SYS` naming?
- What happens when you query `CUSTOMER` after setting `CURRENT SCHEMA` to `SQLTUTOR`?
- Why is `SQLCODE +100` not necessarily an error?
- Why can a `DELETE` fail even when the row you're targeting exists?
- What is the difference between `WHERE` and `HAVING`?
- What is a CTE, and when would you use one instead of a subquery?
- Why should application SQL avoid `SELECT *`?
- When can SQL outperform native I/O, and when might native I/O still win?
- What is the difference between static and dynamic SQL?
- Why should dynamic SQL use parameter markers or host variables instead of building statement text by concatenation?

---

## 21. Ask the AI Tutor

Once you've been through the material above, these are good follow-up prompts to open with the AI Tutor -- it can go deeper on any of them, using this Deep Dive as context:

- "Explain `*SQL` vs `*SYS` naming with IBM i examples."
- "Help me debug SQLCODE -204 on IBM i."
- "Explain why my DELETE failed because of a foreign key."
- "Show me how to use CURRENT SCHEMA with SQLTUTOR."
- "Explain SQLCODE +100 in embedded SQL."
- "Help me convert this CHAIN/SETLL access pattern into SQL."
- "Explain when SQL is better than native I/O."
- "Give me practice questions on joins and CTEs using SQLTUTOR."

---

## 22. Key takeaways

- Db2 for i is part of the operating system -- there's nothing separate to install or connect to.
- A SQL table and a DDS physical file are the same kind of object (`*FILE`); SQL is a way of defining and accessing data, not a different storage engine.
- Use `*SQL` (dot) naming, fully qualified, for new development; `CURRENT SCHEMA` is a convenience for exploration, not a replacement for it.
- The `QSYS2` catalog views let you confirm what actually exists instead of guessing.
- Joins, `GROUP BY`/`HAVING`, subqueries/CTEs, and views cover the vast majority of real reporting and application queries.
- Primary keys, foreign keys, and check/unique constraints make bad data structurally impossible -- a `DELETE` blocked by a foreign key is that protection working, not a bug.
- Static (embedded) SQL is validated at compile time and reuses a saved access plan; dynamic SQL is prepared at runtime.
- Always check `SQLCODE`/`SQLSTATE` -- and remember `+100` means "no rows," not "error."
- Let the optimizer do its job; add indexes when a specific query needs one, not preemptively.
- Commitment control and object authority both apply to SQL exactly as they do to any other access method -- neither is optional just because the statement is SQL.

---

## What's next: future Deep Dives

This Deep Dive deliberately stays focused on SQL fundamentals on IBM i -- it does not go deep on embedded SQL mechanics, cursors, stored procedures, triggers, or performance tuning. Those are natural, planned follow-ups:

1. Embedded SQL in RPGLE
2. SQL Cursors on IBM i
3. Stored Procedures on IBM i
4. Database Triggers on IBM i
5. SQL Error Handling with SQLCODE and SQLSTATE
6. Native I/O vs SQL Decision Guide
7. Commitment Control with SQL and RPGLE
8. SQL Performance Basics on IBM i

Check the [Deep Dives catalog](/deep-dives) for their current status.
