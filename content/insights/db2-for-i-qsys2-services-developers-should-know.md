An IBM i developer may begin an investigation with commands such as `WRKACTJOB`, `DSPJOBLOG`, `DSPOBJD`, `DSPPGM`, `DSPMSG`, or `DSPJRN`. These commands remain valuable, but they are not the only way to obtain system information.

IBM i exposes a large part of the operating system through SQL. Jobs, job logs, object descriptions, program attributes, message queues, IFS objects, journal entries, and many other resources can be queried through IBM i Services — most commonly in the `QSYS2` schema.

This changes troubleshooting from a sequence of interactive screens into data that can be filtered, joined, summarized, saved, embedded in RPG, or used by an automated support tool.

> **Note:** QSYS2 services do not replace IBM i commands. They provide a relational interface to much of the same information, making it easier to search, correlate, automate, and reuse.

## What You Will Learn

By the end of this article, you will be able to:

- distinguish a view, table function, procedure, and scalar function;
- identify useful QSYS2 services for common development tasks;
- diagnose an active or failed job using SQL;
- inspect IBM i objects, programs, modules, message queues, and IFS files;
- retrieve journal activity and generate object DDL; and
- use these services safely and efficiently.

## What Are IBM i SQL Services?

IBM i Services are SQL interfaces supplied by IBM. They present operating-system information or actions using familiar SQL forms.

| Service form | How it is used | Typical purpose |
|---|---|---|
| View | `SELECT ... FROM QSYS2.PROGRAM_INFO` | Read a predefined relational result. |
| Table function | `SELECT ... FROM TABLE(QSYS2.JOBLOG_INFO(...))` | Supply parameters and receive rows. |
| Procedure | `CALL QSYS2.GENERATE_SQL(...)` | Perform an operation that may return a result set. |
| Scalar function | `VALUES QSYS2.QCMDEXC(...)` | Return one value, sometimes while performing an action. |

The services execute under the authority of the caller. SQL does not bypass IBM i security: object authority, special authority, and function-usage controls still apply.

### Before You Run the Examples

The examples are designed for **IBM i Access Client Solutions (ACS) Run SQL Scripts**. They can also be used from another Db2 for i SQL client, provided that the connected user has the required authority.

Replace the sample values before running a query:

| Sample value | Replace it with |
|---|---|
| `MYLIB` | One of your application libraries |
| `MYJRN` | A journal that exists in that library |
| `/home/myapp` | A narrow IFS directory you are authorized to inspect |
| `347117/QUSER/QZDASOINIT` | A real qualified job name in `number/user/name` format |
| `ORDERS` or `ORDERSRV` | An object that exists on your partition |

Start with the read-only `SELECT` examples. The two `QCMDEXC` examples execute CL commands and are clearly marked as actions.

[[FIGURE:service-group-map]]

## Quick Reference

| Developer question | Service to start with | Form |
|---|---|---|
| Which jobs are active or consuming resources? | `QSYS2.ACTIVE_JOB_INFO` | Table function |
| Why did this job fail? | `QSYS2.JOBLOG_INFO` | Table function |
| What happened on the system recently? | `QSYS2.HISTORY_LOG_INFO` | Table function |
| Which objects exist in this library? | `QSYS2.OBJECT_STATISTICS` | Table function |
| Which files exist below this IFS path? | `QSYS2.IFS_OBJECT_STATISTICS` | Table function |
| How was this program created? | `QSYS2.PROGRAM_INFO` | View |
| Which modules are bound into it? | `QSYS2.BOUND_MODULE_INFO` | View |
| Which messages are waiting on a queue? | `QSYS2.MESSAGE_QUEUE_INFO` | Table function |
| Who changed this journaled object? | `QSYS2.DISPLAY_JOURNAL` | Table function |
| How can I recreate this database object? | `QSYS2.GENERATE_SQL` | Procedure |
| Can SQL run a CL command? | `QSYS2.QCMDEXC` | Procedure or scalar function |
| Is this SQL index valid and being used? | `QSYS2.SYSINDEXSTAT` | Catalog view |

## Beginner Walkthrough: Read One Query from the Inside Out

Start with the current job because it does not require you to find a qualified job name:

```sql
SELECT ordinal_position,
       message_timestamp,
       message_id,
       message_type,
       message_text
  FROM TABLE(QSYS2.JOBLOG_INFO('*')) AS job_log
 ORDER BY ordinal_position DESC
 FETCH FIRST 10 ROWS ONLY;
```

Read the statement in four parts:

1. `QSYS2.JOBLOG_INFO('*')` calls the service; `'*'` means the current job.
2. `TABLE(...) AS job_log` makes the returned rows usable in a `SELECT` statement and gives them an alias.
3. `ORDER BY ... DESC` places the newest job-log messages first.
4. `FETCH FIRST 10 ROWS ONLY` limits the result so it is easy to inspect.

The exact messages will differ on every system, but the result has this shape:

| Column | What a beginner should look for |
|---|---|
| `MESSAGE_TIMESTAMP` | When the message was sent |
| `MESSAGE_ID` | The IBM i message identifier, such as a CPF message |
| `MESSAGE_TYPE` | Whether it is informational, diagnostic, escape, and so on |
| `MESSAGE_TEXT` | The resolved first-level message text |

This same pattern — call a table function, alias it, select useful columns, filter, and limit — appears throughout the article.

## 1. ACTIVE_JOB_INFO: Investigate Running Jobs

`ACTIVE_JOB_INFO` returns one row for each active job and provides information similar to `WRKACTJOB`. It is useful when you need to sort, filter, or correlate active-job data.

The following query identifies non-system jobs using the most temporary storage and includes the last or currently running SQL statement:

```sql
SELECT job_name,
       authorization_name,
       job_status,
       temporary_storage,
       sql_statement_text
  FROM TABLE(
         QSYS2.ACTIVE_JOB_INFO(DETAILED_INFO => 'ALL')
       ) AS jobs
 WHERE job_type <> 'SYS'
 ORDER BY temporary_storage DESC
 FETCH FIRST 10 ROWS ONLY;
```

Useful columns include:

- `JOB_NAME` — the qualified job name;
- `JOB_STATUS` — such as `RUN`, `MSGW`, or `LCKW`;
- `TEMPORARY_STORAGE` — temporary storage allocated to the job, in megabytes;
- `ELAPSED_CPU_PERCENTAGE` and `ELAPSED_TOTAL_DISK_IO_COUNT` — interval statistics; and
- `SQL_STATEMENT_TEXT` — the current or most recent SQL statement when detailed information and sufficient authority are available.

For elapsed measurements, the first invocation establishes a baseline. Rerun the query in the same connection to obtain meaningful interval values. Use input filters such as `JOB_NAME_FILTER` and `SUBSYSTEM_LIST_FILTER` whenever possible; filtering inside the function can avoid collecting unnecessary job detail.

```sql
SELECT job_name,
       authorization_name,
       elapsed_total_disk_io_count,
       elapsed_cpu_percentage
  FROM TABLE(
         QSYS2.ACTIVE_JOB_INFO(
           JOB_NAME_FILTER       => 'QZDASOINIT',
           SUBSYSTEM_LIST_FILTER => 'QUSRWRK'
         )
       ) AS jobs
 ORDER BY elapsed_total_disk_io_count DESC
 FETCH FIRST 10 ROWS ONLY;
```

> **Best practice:** General job information requires little or no special authority, but `SQL_STATEMENT_TEXT` and the rest of the `DETAILED_INFO => 'ALL'` columns require the `QIBM_DB_SQLADM` or `QIBM_DB_SYSMON` function-usage identifier, or `*JOBCTL` special authority.

## 2. JOBLOG_INFO: Turn a Job Log into Rows

`JOBLOG_INFO` returns one row for each message in a job log. This makes it much easier to locate escape messages, compare timestamps, or identify the sending program and procedure.

```sql
SELECT ordinal_position,
       message_timestamp,
       message_id,
       message_type,
       severity,
       from_program,
       from_procedure,
       message_text
  FROM TABLE(
         QSYS2.JOBLOG_INFO('347117/QUSER/QZDASOINIT')
       ) AS log
 WHERE message_type IN ('ESCAPE', 'DIAGNOSTIC')
 ORDER BY ordinal_position DESC;
```

This is particularly useful for application support because it can answer:

- What was the final unhandled escape message?
- Which program or procedure sent it?
- Which diagnostic messages occurred immediately before it?
- Did the same message appear in several failed jobs?

For the current job, `'*'` can be used as the job name. `MESSAGE_ORDER`, `MESSAGE_TIMESTAMP`, and a companion `MESSAGE_LIMIT` parameter were added by IBM i 7.6 (SF99960 level 3) and IBM i 7.5 (SF99950 level 12) — on an older release or PTF level, omit them and filter or limit the result with ordinary SQL instead:

```sql
SELECT message_timestamp,
       message_id,
       message_type,
       message_text
  FROM TABLE(
         QSYS2.JOBLOG_INFO(
           '*',
           MESSAGE_ORDER     => 'DESCENDING',
           MESSAGE_TIMESTAMP => CURRENT TIMESTAMP - 30 MINUTES
         )
       ) AS log;
```

## 3. HISTORY_LOG_INFO: Search QHST with SQL

The system history log records important system and job events. `HISTORY_LOG_INFO` provides information similar to `DSPLOG` and accepts a timestamp range.

```sql
SELECT message_timestamp,
       message_id,
       severity,
       from_job,
       from_program,
       message_text
  FROM TABLE(
         QSYS2.HISTORY_LOG_INFO(
           START_TIME => CURRENT TIMESTAMP - 2 HOURS,
           END_TIME   => CURRENT TIMESTAMP
         )
       ) AS history
 WHERE severity >= 30
 ORDER BY message_timestamp DESC;
```

Use this service when an event is broader than one job — for example, subsystem activity, device failures, job starts and ends, security messages, or events around a known timestamp.

The function can also generate RFC 3164 or RFC 5424 syslog-formatted information. An `EOF_DELAY` greater than zero creates a continuously polling result, but that mode never ends on its own and has special query restrictions. Use it only for a deliberately designed monitoring process.

## 4. OBJECT_STATISTICS: Query Objects in a Library

`OBJECT_STATISTICS` returns information about objects in a library, similar to information available from object-list and object-description interfaces.

```sql
SELECT objname,
       objtype,
       objattribute,
       objowner,
       objcreated,
       change_timestamp,
       source_library,
       source_file,
       source_member
  FROM TABLE(
         QSYS2.OBJECT_STATISTICS(
           'MYLIB',
           '*PGM *SRVPGM'
         )
       ) AS objects
 ORDER BY change_timestamp DESC;
```

Practical uses include:

- inventorying programs, files, service programs, commands, or data areas;
- comparing object creation and change timestamps;
- identifying object owners and source references;
- checking whether an object is journaled or recently saved; and
- finding objects that have not been used recently.

If you only need names and types, use the `*ALLSIMPLE` option. Most columns come back `NULL` and only a handful are populated (object name, type, library, long schema, and ASP information), which can make the query much faster on a large library:

```sql
SELECT objlib, objname, objtype
  FROM TABLE(
         QSYS2.OBJECT_STATISTICS(
           OBJECT_SCHEMA => 'MYLIB',
           OBJTYPELIST   => '*PGM *SRVPGM',
           OBJECT_NAME   => '*ALLSIMPLE'
         )
       ) AS objects;
```

> **Note:** The parameter that restricts object types is named `OBJTYPELIST`, not `OBJECT_TYPE_LIST` — an easy typo to make since most other services in this article use fully-spelled-out parameter names.

## 5. IFS_OBJECT_STATISTICS: Explore the IFS

`IFS_OBJECT_STATISTICS` returns objects below an IFS path. It can process only the starting directory or recursively walk its subdirectories.

The following query finds the twenty largest stream files under an application directory:

```sql
SELECT CAST(path_name AS VARCHAR(1024)) AS path_name,
       object_type,
       data_size,
       object_owner,
       data_change_timestamp
  FROM TABLE(
         QSYS2.IFS_OBJECT_STATISTICS(
           START_PATH_NAME     => '/home/myapp',
           SUBTREE_DIRECTORIES => 'YES',
           OBJECT_TYPE_LIST    => '*STMF',
           IGNORE_ERRORS       => 'YES'
         )
       ) AS ifs
 ORDER BY data_size DESC
 FETCH FIRST 20 ROWS ONLY;
```

`PATH_NAME` is a large Unicode LOB value. Casting it to a suitably sized `VARCHAR` can make the result easier to display, but choose a length large enough for the paths in your environment.

Recursive IFS scans can be expensive, especially from a broad starting path. Start as low in the directory tree as possible, restrict object types, and avoid repeatedly scanning large trees in an interactive application. `IGNORE_ERRORS => 'YES'` is what keeps a single object you are not authorized to see from stopping the whole scan with a "not authorized" error — useful for a broad exploratory query, but a real authority gap is still worth investigating separately rather than silently skipped every time.

## 6. PROGRAM_INFO and BOUND_MODULE_INFO: Understand Built Objects

`PROGRAM_INFO` describes programs and service programs. It can reveal the program type, object type, owner, and activation group, among many other attributes.

```sql
SELECT program_library,
       program_name,
       object_type,
       program_attribute,
       activation_group
  FROM QSYS2.PROGRAM_INFO
 WHERE program_library = 'MYLIB'
 ORDER BY program_name;
```

`BOUND_MODULE_INFO` goes one level deeper by returning the modules copied into an ILE program or service program at bind time:

```sql
SELECT program_library,
       program_name,
       object_type,
       bound_module_library,
       bound_module,
       module_attribute,
       source_stream_file_path,
       debug_data,
       optimization_level
  FROM QSYS2.BOUND_MODULE_INFO
 WHERE program_library = 'MYLIB'
   AND program_name    = 'ORDERSRV';
```

Together, these views help answer questions such as:

- Is the object an ILE program or service program?
- Which activation group will it use?
- Which modules and languages were bound into it?
- Was debug data included, and at what optimization level?

Both views expose more columns than shown here — including SQL-related compile attributes stored per module — and the exact set can shift between releases. Query `QSYS2.SYSCOLUMNS` for `TABLE_SCHEMA = 'QSYS2'` and the view name, or check the official documentation, before relying on a column not shown in these examples.

> **Note:** The module information represents the copy bound into the program or service program. It is not a live reference to a separate `*MODULE` object.

## 7. MESSAGE_QUEUE_INFO: Query Messages Without Removing Them

`MESSAGE_QUEUE_INFO` exists as both a view and a table function; the table function returns messages from a message queue without removing them or changing their new/old status, and is useful when you want to target one queue and apply filters.

```sql
SELECT message_timestamp,
       message_id,
       message_type,
       severity,
       from_user,
       message_text
  FROM TABLE(
         QSYS2.MESSAGE_QUEUE_INFO(
           QUEUE_LIBRARY   => 'QSYS',
           QUEUE_NAME      => 'QSYSOPR',
           MESSAGE_FILTER  => 'INQUIRY',
           SEVERITY_FILTER => 30
         )
       ) AS messages
 ORDER BY message_timestamp DESC;
```

> **Note:** The queue-targeting parameters are `QUEUE_LIBRARY` and `QUEUE_NAME` — not `MESSAGE_QUEUE_LIBRARY`/`MESSAGE_QUEUE_NAME`, which are easy to guess by analogy with the other filter parameters in this article but are not what the function actually accepts.

This can support a dashboard or alerting process for inquiry messages and high-severity operational conditions. Reading a message is not the same as replying to or removing it; those are separate, controlled actions.

## 8. DISPLAY_JOURNAL: Investigate Changes and Transactions

`DISPLAY_JOURNAL` returns journal entries as rows and provides information similar to `DSPJRN`. Developers can filter by time, object, entry type, user, job, program, or sequence range.

```sql
SELECT entry_timestamp,
       sequence_number,
       journal_code,
       journal_entry_type,
       object,
       user_name,
       job_number CONCAT '/' CONCAT job_user CONCAT '/' CONCAT job_name
         AS qualified_job_name,
       program_library,
       program_name
  FROM TABLE(
         QSYS2.DISPLAY_JOURNAL(
           JOURNAL_LIBRARY    => 'MYLIB',
           JOURNAL_NAME       => 'MYJRN',
           STARTING_TIMESTAMP => CURRENT TIMESTAMP - 1 HOUR
         )
       ) AS journal_entries
 WHERE journal_code = 'R'
 ORDER BY sequence_number DESC;
```

> **Note:** `USER_NAME` was added as a friendlier alternative to an older `CURRENT_USER` column on IBM i 7.4 (SF99704 level 15) and 7.3 (SF99703 level 26) and later. On a partition below that level, select `current_user` instead.

`ENTRY_DATA` is a `BLOB` containing entry-specific data. Interpreting record images requires knowledge of the journal entry format and the file layout. Recent IBM i releases add `QSYS2.CREATE_DATA_JOURNAL_READER`, a scalar function (new in IBM i 7.6 TR2 and 7.5 TR8) that generates a table-specific helper function you can then use to decode that table's journal images into typed columns — a two-step, per-table process, not an automatic feature of `DISPLAY_JOURNAL` itself, but often still easier than manually decoding the BLOB by hand.

Do not query a busy journal at sub-second frequency. Restrict the receiver range, timestamp, object, or entry types as early as possible. Journal access also requires authority to the journal, receivers, and relevant objects.

## 9. GENERATE_SQL: Recover the DDL for an Object

`GENERATE_SQL` produces the SQL data definition language needed to recreate a database object. It can write to a source member, write to an IFS stream file, or return the default QTEMP output as a result set.

```sql
CALL QSYS2.GENERATE_SQL(
  DATABASE_OBJECT_NAME         => 'ORDERS',
  DATABASE_OBJECT_LIBRARY_NAME => 'MYLIB',
  DATABASE_OBJECT_TYPE         => 'TABLE',
  REPLACE_OPTION               => '1',
  CREATE_OR_REPLACE_OPTION     => '1',
  CONSTRAINT_OPTION            => '2'
);
```

Common uses include:

- reviewing how an SQL or DDS-created object maps to DDL;
- capturing definitions for migration or source control;
- rebuilding a view, index, procedure, or function;
- comparing definitions between environments; and
- learning SQL equivalents for existing database objects.

`GENERATE_SQL` is extremely useful, but generated DDL should be reviewed before execution. Environment-specific schema names, system names, authorities, triggers, constraints, labels, and grants may require deliberate choices.

## 10. QCMDEXC: Run a CL Command from SQL — Carefully

`QSYS2.QCMDEXC` is available as a procedure and as a scalar function. The procedure is convenient for a single command:

```sql
CALL QSYS2.QCMDEXC('QSYS/ADDLIBLE MYAPPLIB');
```

The scalar function form was added in IBM i 7.4 TR4 and 7.3 TR10. It returns `1` for success and `-1` for failure, allowing the result to participate in an expression:

```sql
VALUES QSYS2.QCMDEXC('QSYS/CHKOBJ OBJ(MYLIB/ORDERS) OBJTYPE(*FILE)');
```

Use it only when a native SQL alternative does not better express the task. Never concatenate untrusted user input into a command string. The caller must possess the authority required by the CL command, and a command can change system state just as if it were run from a command line.

> **Warning:** Treat dynamic CL command construction like dynamic SQL. Validate permitted values, control authority, avoid secrets in command strings and logs, and prefer an allow-list of operations.

## 11. SYSINDEXSTAT: Understand SQL Indexes

`QSYS2.SYSINDEXSTAT` is a Db2 for i catalog view rather than an operating-system table function. It contains one row for every SQL index partition and helps developers understand index recency, size, keys, and usage.

```sql
SELECT index_schema,
       index_name,
       table_schema,
       table_name,
       last_invalidation_timestamp,
       column_names,
       index_size,
       query_use_count,
       last_query_use,
       last_statistics_use
  FROM QSYS2.SYSINDEXSTAT
 WHERE table_schema = 'MYLIB'
 ORDER BY index_size DESC;
```

This data can help show when an index was last invalidated and rebuilt, or whether an index has participated in queries since usage statistics were reset. It should not be used alone to decide that an index is unnecessary. Native record access, statistical use by the optimizer, reset timing, seasonal workloads, and rare critical processes can all affect the interpretation.

`SYSINDEXSTAT` reports one row per index *partition* — for a rolled-up, one-row-per-index view, `QSYS2.SYSTABLEINDEXSTAT` is the equivalent to reach for instead.

For SQL performance analysis, combine catalog information with the SQL Performance Center, Visual Explain, the plan cache, and measured workload evidence.

## From Symptom to Evidence

The real value appears when services are combined into a repeatable investigation.

[[FIGURE:symptom-to-cause]]

Example: a user reports that an order job is stuck.

1. Use `ACTIVE_JOB_INFO` to find the qualified job name and determine whether it is in `MSGW`, `LCKW`, or another wait state.
2. Pass that qualified name to `JOBLOG_INFO` and locate the most recent diagnostic and escape messages.
3. Use `PROGRAM_INFO` and `BOUND_MODULE_INFO` to confirm the deployed object and its build attributes.
4. If data was changed, use `DISPLAY_JOURNAL` to identify the user, program, and timing of the change.
5. If SQL performance is involved, inspect `SYSINDEXSTAT` and continue in SQL Performance Center.

The investigation becomes evidence-driven and repeatable instead of depending on screenshots or recollection.

## Safe and Efficient Usage

### Filter Early

When a table function accepts filters, prefer those parameters over retrieving everything and filtering later. This is especially important for active jobs, IFS trees, job logs, and journals.

### Select Only Needed Columns

Avoid `SELECT *` in reusable queries. Some services can return wide rows, LOB values, or details that require extra work and authority.

### Understand Live Versus Historical Data

`ACTIVE_JOB_INFO` describes jobs active at query time. `JOBLOG_INFO`, `HISTORY_LOG_INFO`, and `DISPLAY_JOURNAL` are used for historical evidence, subject to retention and receiver availability.

### Respect Authority

An empty or partially populated result can be an authority issue rather than proof that an object or event does not exist. Read the authorization notes for each service.

### Check Release and PTF Levels

IBM continuously enhances SQL services. A service, parameter, or column available on one partition may not exist on an older release or database group PTF level.

### Separate Read-Only Services from Actions

Most examples in this article retrieve information. `QCMDEXC` and some QSYS2 procedures perform actions. Review their impact, authority, error handling, and audit requirements before using them in an application.

[[FIGURE:safety-matrix]]

## Common Mistakes

- Running a broad recursive IFS scan when one application directory would be sufficient.
- Requesting `DETAILED_INFO => 'ALL'` for every active job when only general columns are needed.
- Reading an entire journal receiver chain without a timestamp or sequence boundary.
- Assuming no rows means no problem without checking authority and retention.
- Treating generated DDL as deployment-ready without reviewing dependencies and grants.
- Using `QCMDEXC` to build commands from uncontrolled input.
- Dropping an index only because its query-use count is low.

## Final Perspective

IBM i Services make the operating system queryable.

For developers, this means faster troubleshooting, more precise diagnostics, and better opportunities for automation. Instead of manually moving between commands and displays, you can ask focused questions, join related evidence, and preserve useful queries as part of your development and support toolkit.

Start with `ACTIVE_JOB_INFO`, `JOBLOG_INFO`, `OBJECT_STATISTICS`, and `PROGRAM_INFO`. Once those become familiar, add IFS, message, journal, DDL-generation, and index services as your investigations require them.

The goal is not to memorize every service. It is to recognize that when IBM i knows something, there is increasingly likely to be a secure SQL interface for retrieving it.

## Check Your Understanding

1. What is the difference between a QSYS2 view and a QSYS2 table function?
2. Why should filters be passed into `ACTIVE_JOB_INFO` when possible?
3. Which service would you use to find the program that sent an escape message?
4. Why can a recursive `IFS_OBJECT_STATISTICS` query be expensive?
5. What is the difference between `PROGRAM_INFO` and `BOUND_MODULE_INFO`?
6. Why must `ENTRY_DATA` from `DISPLAY_JOURNAL` be interpreted carefully?
7. What risks arise when building a CL command dynamically for `QCMDEXC`?
8. Why is a low `QUERY_USE_COUNT` insufficient evidence for dropping an index?

## Try It Yourself

Create a diagnostic SQL script that accepts a qualified job name and returns:

1. its current status from `ACTIVE_JOB_INFO`, if it is still active;
2. its diagnostic and escape messages from `JOBLOG_INFO`; and
3. program and module details for one application program named in the log.

---

### Sources and further reading

The technical claims in this article — including each service's exact form (view, table function, procedure, or scalar function), parameter names, column names, and authority notes — were checked against IBM's official IBM i Services documentation and support pages before publishing.

- [IBM: IBM i Services](https://www.ibm.com/docs/en/i/7.5.0?topic=optimization-i-services)
- [IBM: ACTIVE_JOB_INFO](https://www.ibm.com/docs/en/i/7.5.0?topic=services-active-job-info-table-function)
- [IBM: JOBLOG_INFO](https://www.ibm.com/docs/en/i/7.5.0?topic=services-joblog-info-table-function)
- [IBM: HISTORY_LOG_INFO](https://www.ibm.com/docs/en/i/7.5.0?topic=services-history-log-info-table-function)
- [IBM: OBJECT_STATISTICS](https://www.ibm.com/docs/en/i/7.5.0?topic=services-object-statistics-table-function)
- [IBM: IFS_OBJECT_STATISTICS](https://www.ibm.com/docs/en/i/7.5.0?topic=services-ifs-object-statistics-table-function)
- [IBM: PROGRAM_INFO](https://www.ibm.com/docs/en/i/7.5.0?topic=services-program-info-view)
- [IBM: BOUND_MODULE_INFO](https://www.ibm.com/docs/en/i/7.5.0?topic=services-bound-module-info-view)
- [IBM: MESSAGE_QUEUE_INFO](https://www.ibm.com/docs/en/i/7.5.0?topic=services-message-queue-info-table-function)
- [IBM: DISPLAY_JOURNAL](https://www.ibm.com/docs/en/i/7.5.0?topic=services-display-journal-table-function)
- [IBM: GENERATE_SQL](https://www.ibm.com/docs/en/i/7.5.0?topic=services-generate-sql-procedure)
- [IBM: QCMDEXC](https://www.ibm.com/docs/en/i/7.5.0?topic=services-qcmdexc-procedure)
- [IBM: QCMDEXC scalar function](https://www.ibm.com/docs/en/i/7.5.0?topic=services-qcmdexc-scalar-function)
- [IBM: SYSINDEXSTAT](https://www.ibm.com/docs/en/i/7.5.0?topic=views-sysindexstat)

Service availability, parameters, columns, and authorization behavior depend on the IBM i release and installed group PTF levels. Validate examples on the target partition before using them in production or automated operational tooling.
