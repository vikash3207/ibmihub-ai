An IBM i partition can be healthy while an important application is failing. CPU may be low, disk usage may be normal, and every subsystem may be active — yet orders are not posting, an API is timing out, or a nightly job has stopped processing files.

That is why application monitoring is broader than system monitoring.

> **Note:** Application monitoring asks whether users and business processes are receiving the correct result, at the expected time, with enough evidence to explain failures.

Production troubleshooting begins when a signal shows that this expectation is not being met. The goal is not to try random commands until the symptom disappears. The goal is to build a reliable timeline, protect evidence, identify the failing component, and restore service with the least additional risk.

## What You Will Learn

By the end of this article, you will be able to:

- distinguish business, application, job, database, and system monitoring;
- follow a safe first-response workflow during a production incident;
- identify active or recently ended jobs related to a failure;
- retrieve focused job-log and history-log messages with SQL;
- recognize common job statuses without over-interpreting them;
- investigate record locks, object locks, and active SQL queries;
- design application events that support fast correlation;
- decide when containment is safer than an immediate job end; and
- turn incident findings into better alerts, runbooks, and prevention.

## Monitoring in Layers

Each layer answers a different question. Monitoring only the bottom layer creates blind spots at the top.

[[FIGURE:layer-correlation]]

| Layer | Useful signals | Example question |
|---|---|---|
| Business | completed orders, posted invoices, processed files, backlog age | Did the process deliver the expected outcome? |
| Application | response time, error count, rejected requests, correlation ID | Which operation failed, and for whom? |
| Integration | data queues, IFS files, API status, certificates, dependent services | Did input arrive, and did the downstream dependency respond? |
| Jobs and messages | job status, program, job log, inquiry messages | Which IBM i job handled the work? |
| Database | SQL errors, long queries, record locks, transaction state | Is Db2 waiting, failing, or doing excessive work? |
| Partition | CPU, ASP usage, temporary storage, active jobs | Is a wider system condition contributing? |

A high CPU alert may be useful, but it does not tell you whether invoices are correct. A business alert such as "no successful postings for 15 minutes" often detects application impact sooner.

Not every failure appears in an IBM i job log. HTTP-server access and error logs, Java or PASE logs, IFS stream files, external schedulers, network and TLS diagnostics, middleware, and downstream API telemetry may contain the missing part of the timeline. Record these sources in the application runbook and connect them with the same correlation identifier wherever possible.

## Monitoring, Troubleshooting, Recovery, and Root Cause Are Different Jobs

These four words get used interchangeably during an incident, but they describe different activities with different goals. Keeping them separate keeps the response disciplined:

- **Monitoring** watches for a condition worth investigating — a threshold, a missing signal, an unanswered inquiry message. It runs continuously and does not, by itself, diagnose anything.
- **Troubleshooting** is the evidence-gathering and hypothesis-testing that happens once monitoring (or a user) raises a symptom. Its output is a confirmed, testable explanation of what is currently happening.
- **Recovery** is the production change that restores service — releasing a stuck condition, retrying a request, restarting a component. It depends on troubleshooting's findings and carries real risk of its own.
- **Root-cause analysis** happens after recovery, using the evidence gathered during troubleshooting to explain *why* the failure happened and what will prevent or detect it next time.

A team that recovers without troubleshooting is guessing. A team that troubleshoots without ever reaching root cause will see the same incident again.

## The Evidence-First Incident Workflow

Use the same sequence whether the symptom arrives from an alert, a service desk ticket, or a user call.

[[FIGURE:incident-lifecycle]]

### 1. Confirm the symptom

Write one sentence describing observable impact:

```text
Order inquiry requests for customer group A have returned HTTP 500 since
14:32 local system time; order creation is still succeeding.
```

This is more useful than "the application is down." It separates affected and unaffected behavior.

### 2. Record identifiers immediately

Capture what is available before jobs end or messages roll away:

- system and environment;
- exact timestamp and time zone;
- operation, program, endpoint, or batch process;
- qualified job name in `number/user/name` form;
- correlation, request, order, or transaction identifier;
- user profile or application identity;
- message ID, SQLSTATE, SQLCODE, and HTTP status where applicable; and
- recent deployment, configuration, or data change.

Do not place credentials or unnecessary customer data in an incident channel.

### 3. Preserve evidence before changing state

Holding, ending, restarting, replying to an inquiry message, clearing a queue, or changing a subsystem can destroy the condition you need to understand. Capture the relevant job log, messages, locks, SQL information, and timestamps first whenever the business impact allows.

### 4. Test one hypothesis at a time

"The job is waiting on a record lock held by another job" is testable. "IBM i is slow" is not.

## Beginner Quick Start: Five Safe Questions

When you receive an incident, answer these questions in order:

1. **What failed?** Identify the business operation and impact.
2. **When did it fail?** Use the IBM i system timestamp, not an approximate memory.
3. **Which job handled it?** Find the qualified job name.
4. **What evidence did the job produce?** Read messages and application events.
5. **What was the job waiting for or consuming?** Check status, locks, SQL, CPU, I/O, and temporary storage.

These questions move from user-visible evidence toward system internals without assuming the cause.

## Conventional Job-Log Monitoring and SQL Services

Traditional commands and SQL services are complementary — not competing — ways to inspect the same IBM i environment. The conventional path is often fastest for a person investigating one job interactively. SQL is stronger when evidence must be filtered, compared, exported, joined, or collected repeatedly.

[[FIGURE:traditional-vs-sql]]

Most importantly, "job log versus SQL" is not always a choice between two evidence sources. `QSYS2.JOBLOG_INFO` is an SQL interface to job-log messages. It changes how the evidence is retrieved and analyzed; it does not make the underlying job log unnecessary.

### Conventional interactive path

For a known application subsystem and job, an operator might use:

```cl
WRKACTJOB SBS(QUSRWRK)
WRKJOB JOB(123456/APPUSER/ORDERAPI)
WRKUSRJOB USER(APPUSER) STATUS(*ACTIVE)
DSPJOBLOG JOB(123456/APPUSER/ORDERAPI)
DSPMSG MSGQ(QSYS/QSYSOPR)
DSPRCDLCK FILE(MYLIB/ORDERS) MBR(*FIRST)
WRKOBJLCK OBJ(MYLIB/ORDERSVC) OBJTYPE(*PGM)
WRKJOBQ JOBQ(MYLIB/ORDERQ)
```

From `WRKACTJOB`, option 5 opens the selected job; option 10 on the Work with Job display shows the active job log. Position around the incident timestamp, read diagnostic messages immediately before the escape message, and open the message help for second-level text. `WRKACTJOB` shows active jobs — it does not show a batch job that is still waiting on a job queue.

`WRKUSRJOB` is the fastest conventional path when you know the application's user profile but not its exact job name or number — it lists every job (interactive, submitted batch, communications-evoked, or autostart) owned by that user, regardless of status. `WRKOBJLCK` is a different tool from `DSPRCDLCK`: `DSPRCDLCK` shows record-level locks inside one physical file member, while `WRKOBJLCK` shows object-level locks held on an entire object — a program, a file as a whole, a data area — which is what actually blocks an open, a call, or a save/restore operation rather than a single row.

For a completed job, the log may be **pending** or may have been produced as the spooled file `QPJOBLOG`, depending on job-log output settings. `WRKJOBLOG` can work with pending logs and job-log spooled files. If a log has already been printed and removed, deleted, or never retained, neither a display command nor `JOBLOG_INFO` can reconstruct it. Production support therefore needs deliberate job-log output, retention, and central application-event policies.

The evidence available also depends on job attributes. The `LOG` setting controls message level, severity, and text; `LOGCLPGM` controls CL command logging; and job-log output settings determine how the log is produced after the job ends. Review these through the job description and job attributes. Do not enable maximum logging globally during an incident without considering storage, output-queue, performance, and sensitive-data effects.

### Equivalent SQL-oriented path

| Investigation need | Conventional interface | SQL interface in this article | Choose SQL when… |
|---|---|---|---|
| Partition snapshot | `WRKSYSSTS` | `SYSTEM_STATUS_INFO_BASIC` | a consistent set of values must be recorded or compared |
| Active jobs | `WRKACTJOB`, `WRKUSRJOB`, `WRKSBSJOB` | `ACTIVE_JOB_INFO` | jobs must be filtered, ranked, exported, or sampled |
| One job log | `WRKJOB` option 10, `DSPJOBLOG` | `JOBLOG_INFO` | message types, IDs, time, or programs must be filtered |
| Completed job logs | `WRKJOBLOG`, `QPJOBLOG` | `JOBLOG_INFO`, only while the qualified job and its messages remain accessible to the service | evidence must be processed as rows rather than inspected manually |
| System history | `DSPLOG` | `HISTORY_LOG_INFO` | a bounded time window or message pattern is needed |
| Operator messages | `DSPMSG MSGQ(QSYS/QSYSOPR)` | `MESSAGE_QUEUE_INFO` | inquiry messages must be reported without changing their state |
| Record locks | `DSPRCDLCK` | `RECORD_LOCK_INFO` | holders and waiters must be correlated across records or jobs |
| Object locks | `WRKOBJLCK` | `OBJECT_LOCK_INFO` | a lock on a whole object (not one record) must be correlated across jobs |
| Job-queue backlog | `WRKJOBQ` | `JOB_QUEUE_INFO` | queue depth, status, and capacity must be monitored repeatedly |
| Active SQE work | Work with job/database interfaces | `ACTIVE_QUERY_INFO` | live query metrics must be sorted and compared |

The conventional display preserves an excellent interactive view of message flow and program context. SQL makes repeatable analysis possible but introduces its own requirements: service availability, current Db2 Group PTFs, sufficient authority, careful filters, and sensible polling intervals. During a real incident, use whichever path gets trustworthy evidence fastest, then use the other when it adds missing context.

## Step 1: Establish a Partition Baseline

Run SQL examples in IBM i Access Client Solutions (ACS) **Run SQL Scripts** or another Db2 for i client using an approved diagnostic profile.

This read-only query returns a compact partition snapshot:

```sql
SELECT HOST_NAME,
       ACTIVE_JOBS_IN_SYSTEM,
       ACTIVE_THREADS_IN_SYSTEM,
       ELAPSED_CPU_USED,
       SYSTEM_ASP_USED,
       CURRENT_TEMPORARY_STORAGE
  FROM QSYS2.SYSTEM_STATUS_INFO_BASIC;
```

`SYSTEM_STATUS_INFO_BASIC` returns one row and avoids the job-detail columns in the fuller system-status view. Treat the values as context, not proof of application health. Compare them with a known baseline for the same workload period.

Useful traditional interfaces remain available:

| Need | Command or interface |
|---|---|
| Current system status | `WRKSYSSTS` |
| Active jobs | `WRKACTJOB` |
| One job's details | `WRKJOB JOB(number/user/name)` |
| Jobs for one user | `WRKUSRJOB USER(profile)` |
| Job messages | `DSPJOBLOG JOB(number/user/name)` |
| Operator messages | `DSPMSG MSGQ(QSYSOPR)` |

The SQL services do not make these interfaces obsolete. They make focused evidence easier to filter, repeat, export, and automate.

## Step 2: Find the Relevant Active Job

If the application has a recognizable job name and subsystem, filter inside `ACTIVE_JOB_INFO` rather than retrieving every active job:

```sql
SELECT JOB_NAME,
       AUTHORIZATION_NAME,
       SUBSYSTEM,
       JOB_TYPE,
       FUNCTION_TYPE,
       FUNCTION,
       JOB_STATUS,
       ELAPSED_CPU_PERCENTAGE,
       ELAPSED_TOTAL_DISK_IO_COUNT,
       TEMPORARY_STORAGE
  FROM TABLE(
       QSYS2.ACTIVE_JOB_INFO(
           SUBSYSTEM_LIST_FILTER => 'QUSRWRK',
           JOB_NAME_FILTER       => 'ORDERAPI*',
           DETAILED_INFO         => 'NONE'
       )
  ) AS A
 ORDER BY ELAPSED_CPU_PERCENTAGE DESC;
```

Replace `QUSRWRK` and `ORDERAPI*` with values from your environment. Do not assume that every API, host-server, or batch application runs in the same subsystem.

### Understand elapsed statistics

The first `ACTIVE_JOB_INFO` invocation on a database connection establishes a measurement baseline. Elapsed columns do not contain a useful interval on that first call. Run the same statement again, in the same connection and with the same filters, after a suitable interval.

Changing the filters establishes a new baseline. `CPU_TIME` is cumulative for the job, while `ELAPSED_CPU_PERCENTAGE` and `ELAPSED_TOTAL_DISK_IO_COUNT` describe the measurement interval.

### Read job status as a clue

| Status | Common meaning | What to check next |
|---|---|---|
| `RUN` | Initial thread is running | CPU, I/O, current function, SQL, repeated loops |
| `LCKW` | Waiting for a lock | Record and object locks; holder job and transaction |
| `MSGW` | Waiting for a message | Job log and relevant message queue |
| `DLYW` | Delayed for a time interval | Whether the delay is expected application behavior |
| `PSRW` | Prestart job waiting for work | Often normal when the server job is idle |
| `DSPW` | Waiting for workstation input | Often normal for an interactive job |

A single status sample is not a diagnosis. `RUN` does not prove a loop, and `PSRW` does not prove a server failure.

### When the job name is unknown

Start from stable identifiers:

- use the request timestamp and application user;
- inspect application or web-server access logs;
- search for the business program in active-job function details;
- map a database connection to its server job; or
- use a correlation ID written by the application.

Server jobs are reused. A job name alone may identify the runtime container but not the individual request.

### Check work that has not started

An application can appear idle because its batch jobs are still queued. The following query checks one job queue without retrieving every queue on the partition:

```sql
SELECT JOB_QUEUE_LIBRARY,
       JOB_QUEUE_NAME,
       JOB_QUEUE_STATUS,
       NUMBER_OF_JOBS,
       ACTIVE_JOBS,
       HELD_JOBS,
       RELEASED_JOBS,
       SCHEDULED_JOBS,
       SUBSYSTEM_NAME,
       MAXIMUM_ACTIVE_JOBS
  FROM QSYS2.JOB_QUEUE_INFO
 WHERE JOB_QUEUE_LIBRARY = 'MYLIB'
   AND JOB_QUEUE_NAME = 'ORDERQ';
```

Replace the queue identifiers with system names from your environment. A released queue can still build a backlog when its associated subsystem is inactive, its maximum-active-jobs limit has been reached, or consumers are slower than arrivals. `ACTIVE_JOBS`, `SUBSYSTEM_NAME`, and `MAXIMUM_ACTIVE_JOBS` can be null when the queue is not associated with an active subsystem. Use `WRKJOBQ JOBQ(MYLIB/ORDERQ)` when an operator needs to inspect the individual queued jobs interactively.

## Step 3: Read the Job Log in Context

Once you know the qualified job name, retrieve relevant messages:

```sql
SELECT ORDINAL_POSITION,
       MESSAGE_TIMESTAMP,
       MESSAGE_ID,
       MESSAGE_TYPE,
       SEVERITY,
       FROM_PROGRAM,
       FROM_MODULE,
       FROM_PROCEDURE,
       MESSAGE_TEXT
  FROM TABLE(
       QSYS2.JOBLOG_INFO('123456/APPUSER/ORDERAPI')
  ) AS J
 WHERE MESSAGE_TYPE IN
       ('ESCAPE', 'DIAGNOSTIC', 'INQUIRY', 'NOTIFY')
 ORDER BY ORDINAL_POSITION DESC
 FETCH FIRST 100 ROWS ONLY;
```

Replace the sample job name with the exact qualified name. `JOBLOG_INFO` returns messages in time order through `ORDINAL_POSITION`; ordering descending surfaces recent messages first.

Do not read only the final escape message. IBM i job logs frequently contain diagnostic messages immediately before it that explain the failing object, parameter, lock, authority, or data condition. Also examine second-level text when first-level text is not enough:

```sql
SELECT MESSAGE_TIMESTAMP,
       MESSAGE_ID,
       MESSAGE_TYPE,
       MESSAGE_TEXT,
       MESSAGE_SECOND_LEVEL_TEXT
  FROM TABLE(
       QSYS2.JOBLOG_INFO('123456/APPUSER/ORDERAPI')
  ) AS J
 WHERE MESSAGE_ID = 'CPF4131'
 ORDER BY ORDINAL_POSITION DESC;
```

`CPF4131` is only an illustrative filter. Use the message ID from your incident.

### Authority and missing rows

Access to another job's log normally requires the appropriate job authority; additional restrictions apply when the target job identity has `*ALLOBJ`. No rows do not automatically mean "no error." The job may have ended, its log may not be available, messages may have been removed, the job name may be wrong, or the caller may not be authorized.

## Step 4: Look Beyond One Job

The history log is useful when the job ended or when the event affected the wider system:

```sql
SELECT MESSAGE_TIMESTAMP,
       MESSAGE_ID,
       MESSAGE_TYPE,
       SEVERITY,
       FROM_JOB,
       FROM_PROGRAM,
       MESSAGE_TEXT
  FROM TABLE(
       QSYS2.HISTORY_LOG_INFO(
           CURRENT TIMESTAMP - 2 HOURS,
           CURRENT TIMESTAMP
       )
  ) AS H
 WHERE MESSAGE_TYPE IN ('ESCAPE', 'INQUIRY', 'NOTIFY')
 ORDER BY MESSAGE_TIMESTAMP DESC;
```

Always provide a focused time range. An unbounded operational query produces noise and can cost more than the investigation requires.

For summarized information derived from `CPF1164` job-completion messages, use `SYSTOOLS.ENDED_JOB_INFO` where it is available:

```sql
SELECT MESSAGE_TIMESTAMP,
       FROM_JOB,
       JOB_TYPE,
       JOB_END_CODE,
       JOB_END_DETAIL,
       CPU_TIME,
       PEAK_TEMPORARY_STORAGE
  FROM TABLE(
       SYSTOOLS.ENDED_JOB_INFO(
           CURRENT TIMESTAMP - 2 HOURS,
           CURRENT TIMESTAMP
       )
  ) AS E
 WHERE JOB_END_CODE >= 20
 ORDER BY MESSAGE_TIMESTAMP DESC;
```

This is historical evidence, not a list of currently active jobs. Because `SYSTOOLS` services are IBM-provided examples whose implementation determines authority requirements, confirm availability and authority on the target release and Db2 Group PTF level.

## Step 5: Check Inquiry Messages Without Replying

An unattended inquiry message can leave an application job in `MSGW`. This query reads current inquiry messages on `QSYSOPR` without changing their new/old designation:

```sql
SELECT MESSAGE_TIMESTAMP,
       MESSAGE_ID,
       SEVERITY,
       FROM_JOB,
       FROM_PROGRAM,
       MESSAGE_TEXT
  FROM QSYS2.MESSAGE_QUEUE_INFO
 WHERE MESSAGE_QUEUE_LIBRARY = 'QSYS'
   AND MESSAGE_QUEUE_NAME = 'QSYSOPR'
   AND MESSAGE_TYPE = 'INQUIRY'
 ORDER BY MESSAGE_TIMESTAMP DESC;
```

The query is diagnostic. Replying is a separate production action. Do not automate a reply based only on message ID unless the response, validity checks, affected applications, ownership, and recovery consequences are formally approved.

## Step 6: Investigate Record and Object Locks

If a job is in `LCKW`, inspect record locks for the application table:

```sql
SELECT SYSTEM_TABLE_SCHEMA,
       SYSTEM_TABLE_NAME,
       SYSTEM_TABLE_MEMBER,
       RELATIVE_RECORD_NUMBER,
       LOCK_STATE,
       LOCK_STATUS,
       LOCK_SCOPE,
       JOB_NAME
  FROM QSYS2.RECORD_LOCK_INFO
 WHERE SYSTEM_TABLE_SCHEMA = 'MYLIB'
   AND SYSTEM_TABLE_NAME = 'ORDERS'
 ORDER BY SYSTEM_TABLE_MEMBER,
          RELATIVE_RECORD_NUMBER,
          LOCK_STATUS;
```

For the same schema, table, member, and relative record number, `LOCK_STATUS='WAITING'` identifies a requester and `LOCK_STATUS='HELD'` identifies a job that currently holds a lock. Lock state and compatibility still matter; do not assume that every listed job blocks every other listed job.

Before ending a holder, determine:

- which transaction it owns;
- whether it is actively processing or abandoned;
- what a rollback will change;
- whether other jobs depend on it; and
- whether controlled application recovery exists.

Ending the visible waiting job may remove the symptom while leaving the actual holder and root cause untouched.

### Object-level locks versus record locks

A job can also wait in `LCKW` for a lock on an entire object — a program that is being replaced, a file opened exclusively during a maintenance step, a data area held during a batch update — rather than a single row. `RECORD_LOCK_INFO` will not show this; it only reports row-level activity inside a member. For object-level conflicts, query `OBJECT_LOCK_INFO` instead:

```sql
SELECT SYSTEM_OBJECT_SCHEMA,
       SYSTEM_OBJECT_NAME,
       OBJECT_TYPE,
       LOCK_STATE,
       LOCK_STATUS,
       LOCK_SCOPE,
       JOB_NAME
  FROM QSYS2.OBJECT_LOCK_INFO
 WHERE SYSTEM_OBJECT_SCHEMA = 'MYLIB'
   AND SYSTEM_OBJECT_NAME = 'ORDERSVC'
 ORDER BY LOCK_STATUS;
```

Selecting and filtering on `SYSTEM_OBJECT_SCHEMA`/`SYSTEM_OBJECT_NAME` (the IBM i system object names) rather than any SQL long-name equivalent keeps this example correct even when a library or object has a long SQL name that differs from its system name.

This is the SQL equivalent of `WRKOBJLCK OBJ(MYLIB/ORDERSVC) OBJTYPE(*PGM)`. The same holder/waiter reasoning applies: identify what the holding job is doing and whether it is progressing before considering any recovery action.

## Step 7: Inspect Active SQL Work

For an exact server job running an SQE query, filter `ACTIVE_QUERY_INFO` by its job components:

```sql
SELECT QUALIFIED_JOB_NAME,
       QUERY_TYPE,
       PSEUDO_CLOSED,
       CURRENT_RUNTIME,
       CURRENT_ROW_COUNT,
       CURRENT_DATABASE_READS,
       CURRENT_TEMPORARY_STORAGE,
       QRO_HASH,
       PLAN_IDENTIFIER
  FROM TABLE(
       QSYS2.ACTIVE_QUERY_INFO(
           JOB_NAME   => 'QZDASOINIT',
           JOB_USER   => 'APPUSER',
           JOB_NUMBER => '123456'
       )
  ) AS Q
 WHERE QUERY_TYPE = 'SQL'
   AND PSEUDO_CLOSED = 'NO'
 ORDER BY CURRENT_RUNTIME DESC;
```

`CURRENT_RUNTIME` is measured in microseconds. A long runtime may be legitimate for a large request; compare it with expected row counts, database reads, temporary storage, the access plan, and concurrent lock conditions.

This service reports active SQE queries. It is not a complete historical performance repository, and a query that finishes before you sample it will not appear.

### SQL errors captured by SELF

If the SQL Error Logging Facility (SELF) was already configured to capture relevant SQLCODEs, this read-only query can reveal recurring application failures:

```sql
SELECT LOGGED_TIME,
       LOGGED_SQLCODE,
       LOGGED_SQLSTATE,
       NUMBER_OCCURRENCES,
       JOB_NAME,
       PROGRAM_LIBRARY,
       PROGRAM_NAME,
       MODULE_NAME,
       STATEMENT_OPERATION_DETAIL,
       STATEMENT_TEXT
  FROM QSYS2.SQL_ERROR_LOG
 WHERE PROGRAM_LIBRARY = 'MYLIB'
   AND PROGRAM_NAME = 'ORDERSVC'
 ORDER BY LOGGED_TIME DESC;
```

An empty result does not prove that no SQL errors occurred. SELF only captures SQLCODEs registered through the `SYSIBMADM.SELFCODES` global variable, which is scoped to the current SQL session and defaults to `NULL` (off) unless a different default has been configured. Authority to `SQL_ERROR_LOG` is also narrower than it first appears: seeing every job's rows requires `*ALLOBJ` special authority or the `QIBM_DB_SQLADM` function-usage ID, but a caller without either can still see rows where their own profile matches `USER_NAME`, `ADOPTED_USER_NAME`, or `INITIAL_ADOPTED_USER_NAME` — so a developer can usually see their own program's logged errors without an elevated authority request. Enabling or changing system-wide SELF configuration is a planned administrative action, not an improvised incident command.

## Step 8: Capture SQL Diagnostics in the Application

Monitoring improves dramatically when the application records structured failure data at the point of error. In SQLRPGLE, `GET DIAGNOSTICS` can retrieve the previous SQL condition:

```rpg
dcl-s diagState   char(5);
dcl-s diagCode    int(10);
dcl-s diagMessage varchar(32740);

exec sql
   GET DIAGNOSTICS CONDITION 1
       :diagState   = RETURNED_SQLSTATE,
       :diagCode    = DB2_RETURNED_SQLCODE,
       :diagMessage = MESSAGE_TEXT;

// Send the diagnostic to the application's approved internal logger.
// Return a sanitized business-safe message to an external caller.
```

Run `GET DIAGNOSTICS` immediately after the failing SQL statement, before another SQL statement replaces the current diagnostic context. Keep the full database detail internal and redact sensitive values.

## When Live Snapshots Are Not Enough

The services in this article are excellent for first response, but a snapshot can miss a short event or fail to explain a long-running performance pattern. Escalate deliberately when the question changes:

| Question | Appropriate evidence |
|---|---|
| Did system workload or resource use change over time? | Collection Services data viewed with Performance Data Investigator |
| What was one job or thread doing during an intermittent wait? | IBM i Job Watcher collection |
| Is storage-device activity contributing to the delay? | IBM i Disk Watcher collection |
| Why is an SQL statement repeatedly expensive? | Db2 plan cache or SQL Performance Monitor data and the SQL Performance Center |
| Is a rare low-level event occurring? | A narrowly scoped, time-limited trace designed with IBM support or an experienced administrator |

IBM Navigator for i can display Collection Services, Job Watcher, Disk Watcher, Performance Explorer, plan-cache, and SQL-monitor data through Performance Data Investigator. Some collectors and functions depend on installed products, configuration, authority, and licensing. Collection or trace changes can add overhead, so do not start broad tracing during production merely because a live query returned no rows.

## Build Correlation Into the Application

The fastest incident is the one where a support engineer can move from a failed business request to the exact job and message sequence: the client sends an operation with a correlation ID, the entry point validates it and calls the RPG service, the RPG service runs the business SQL, and the outcome — success or a specific SQL condition — is written to a central event destination alongside the qualified job name and the same correlation ID.

A useful application event contract includes:

```json
{
  "timestamp": "system timestamp",
  "severity": "ERROR",
  "application": "ORDER_API",
  "operation": "GetOrder",
  "outcome": "FAILED",
  "correlationId": "request-generated identifier",
  "qualifiedJobName": "123456/APPUSER/ORDERAPI",
  "program": "ORDERSVC",
  "messageId": "application or IBM i message ID",
  "sqlstate": "five-character SQLSTATE when applicable",
  "sqlcode": -913,
  "elapsedMs": 30250
}
```

Use synthetic values in documentation. In production, protect event data with appropriate authority, encryption, access auditing, retention, and redaction.

### What not to log

- passwords, tokens, session cookies, or private keys;
- complete payment or personal data;
- entire request payloads by default;
- raw SQL parameter values containing sensitive data; or
- stack and database details in public API responses.

## A Worked Scenario: Order API Timeout

Suppose users report that one order inquiry timed out.

### Evidence available

- operation: `GetOrder`;
- correlation ID: `REQ-8F31`;
- timestamp: `14:32:18` system time;
- application user: `APPUSER`; and
- qualified job: `123456/APPUSER/ORDERAPI`.

### Investigation

1. `SYSTEM_STATUS_INFO_BASIC` shows no unusual partition-wide storage pressure.
2. `ACTIVE_JOB_INFO` shows the job in `LCKW` with negligible elapsed CPU.
3. `JOBLOG_INFO` shows an application diagnostic immediately before the wait.
4. `RECORD_LOCK_INFO` shows the order row as `WAITING` for the API job and `HELD` by a batch job.
5. The batch job owner confirms that a transaction is paused after an upstream failure.

### Safe response

The team follows the batch application's approved rollback/recovery procedure, verifies that the lock is released, retries the inquiry with the same business identifier where safe, and confirms recovery using both technical and business signals.

The root cause is not "API timeout." The timeout is the user-visible symptom; the abandoned transaction is the cause established by evidence.

## Evidence to Capture Before Any Disruptive Action

Before holding, ending, restarting, replying to a message, or releasing anything, make sure the following are already captured — once the action is taken, the underlying condition may be gone for good:

- the qualified job name and job status at the time of the decision;
- the job-log excerpt (diagnostic and escape messages, with second-level text) around the incident;
- the lock or active-query evidence that identifies the holder and the waiter;
- exact timestamps for every observation, in system time;
- the correlation, request, or transaction identifier tying the symptom to the job;
- who approved the action and under which runbook or change process; and
- the rollback or fallback plan if the action does not restore service.

If any of these is missing and the business impact allows a short delay, capture it first. A diagnostic SQL query or command does not by itself authorize a recovery action — see the next section.

## Containment and Recovery Decisions

| Action | Risk to consider |
|---|---|
| Retry a request | Could duplicate a non-idempotent operation |
| Hold a job | May preserve state but extend locks and backlog |
| End a job controlled | Application cleanup may run, but active work can still roll back |
| End a job immediately | Can bypass normal cleanup and complicate recovery |
| Cancel active SQL | May leave the application in an unexpected error path |
| Reply to an inquiry | The response can cause retry, cancellation, data change, or termination |
| Release an object or record lock | Removes the symptom for the waiter, but does nothing about why the holder has not released it |
| Restart a subsystem | Affects every dependent job, not only the visible symptom |

These are production changes. Execute them only under the organization's authorization, runbook, communication, and rollback process. Never end a job, release a lock, or change a production resource based on a diagnostic query alone — confirm impact, ownership, and an approved recovery path first.

## What Good Monitoring Should Alert On

Alert on conditions that are actionable and tied to expected behavior.

| Signal | Example condition | Owner response |
|---|---|---|
| Business completion | No successful postings in the expected interval | Check upstream input, backlog, jobs, and errors |
| Error rate | Failed operations exceed a sustained threshold | Identify operation, release, message, and job group |
| Latency | Percentile or maximum exceeds the service objective | Separate lock, SQL, dependency, and capacity causes |
| Backlog | Oldest item or queue depth exceeds threshold | Check consumers, failed records, and processing rate |
| Inquiry message | New production inquiry remains unanswered | Route to the owning runbook; do not auto-reply blindly |
| Abnormal job end | Relevant job ends with code 20 or higher | Correlate completion detail with job log and workload |
| Storage trend | ASP or temporary storage approaches an operational threshold | Identify growth source and apply approved capacity response |

Thresholds must come from baseline and service objectives. A universal "CPU above 80%" rule does not describe every IBM i workload correctly.

## Common Troubleshooting Mistakes

### Restarting before collecting evidence

The restart may restore service but erase the state needed to prevent recurrence.

### Looking only at the final message

Diagnostic messages immediately before an escape message often contain the actual cause.

### Treating one job-status sample as proof

Statuses change quickly. Correlate multiple observations with messages, locks, SQL, and business timing.

### Running broad services repeatedly

Avoid unfiltered `SELECT *` queries over system-wide table functions in tight monitoring loops. Select needed columns, filter early, use realistic polling intervals, and understand the cost of detailed options.

### Assuming no rows means no incident

Live services do not show completed activity. Historical evidence depends on retention, configuration, PTF support, and authority.

### Ending the waiting job

The waiting job may be the victim. Find the holder and transaction owner before choosing recovery.

### Fixing only the technical symptom

After a restart, verify business completion, backlog processing, duplicate protection, and data consistency — not merely that a job is active.

## Build a Production Runbook

For each important application, record:

- business purpose and service owner;
- schedules, endpoints, queues, and normal operating windows;
- subsystems, job names, profiles, programs, service programs, and libraries;
- upstream and downstream dependencies;
- correlation fields and log locations;
- normal throughput, latency, backlog, and resource baseline;
- known message IDs and their meaning;
- read-only evidence queries;
- authorized containment and recovery steps;
- validation steps after recovery; and
- escalation and communication paths.

A runbook should state what evidence to capture before each disruptive action.

## Try It Yourself

Use a development partition or an approved test environment.

1. Choose a harmless batch or server job and record its qualified job name.
2. Find it conventionally with `WRKACTJOB` or `WRKUSRJOB`, then inspect its job log through `WRKJOB` option 10.
3. Query the same job with a filtered `ACTIVE_JOB_INFO` statement.
4. Execute the same SQL again to observe elapsed statistics.
5. Retrieve its latest messages with `JOBLOG_INFO` and compare their order and second-level text with the interactive job-log display.
6. If an approved test job queue is available, compare `WRKJOBQ` with the filtered `JOB_QUEUE_INFO` query.
7. Identify which values are live, cumulative, interval-based, pending, spooled, or historical.
8. Build a short incident timeline using timestamps and message IDs.
9. Write a one-page runbook that contains evidence steps but no unapproved production actions.

## Final Perspective

Effective IBM i troubleshooting connects business impact to technical evidence.

Start with the failed outcome. Capture time and correlation identifiers. Find the correct job. Read messages in sequence. Check locks, SQL, and resource behavior only as the evidence directs you. Preserve the distinction between diagnosis and production change.

> **A strong support engineer does not merely restore a green status. They explain what failed, why it failed, how recovery was verified, and what will detect or prevent the next occurrence.**

## Check Your Understanding

1. Why can an IBM i partition appear healthy while an application is failing?
2. Which identifiers should be captured before changing production state?
3. Why should `ACTIVE_JOB_INFO` be run twice when using elapsed columns?
4. What do `LCKW`, `MSGW`, and `PSRW` suggest?
5. Why should diagnostic messages before an escape message be retained?
6. What is the difference between `JOBLOG_INFO` and `HISTORY_LOG_INFO`?
7. Why does an empty `SQL_ERROR_LOG` result not prove that no SQL error occurred?
8. What must be known before ending a lock-holder job?
9. Why can retrying a failed request be unsafe?
10. What evidence demonstrates business recovery after technical recovery?
11. When is a conventional job-log display more useful than an SQL query, and when is SQL more useful?
12. Why will an active-job query not reveal a batch job that is still waiting on a job queue?
13. What is the difference between `RECORD_LOCK_INFO` and `OBJECT_LOCK_INFO`, and which traditional command corresponds to each?

---

### Sources and further reading

The technical claims in this article — including every SQL service's columns and parameters, `WRKOBJLCK`/`WRKUSRJOB` behavior, SELF's authority requirements, and `GET DIAGNOSTICS` syntax — were checked against IBM's official documentation before publishing.

- [IBM: IBM i Services](https://www.ibm.com/support/pages/ibm-i-services-sql)
- [IBM: `SYSTEM_STATUS_INFO_BASIC`](https://www.ibm.com/docs/en/i/7.5.0?topic=services-system-status-info-basic-view)
- [IBM: `ACTIVE_JOB_INFO`](https://www.ibm.com/docs/en/i/7.5.0?topic=services-active-job-info-table-function)
- [IBM: `JOB_QUEUE_INFO`](https://www.ibm.com/docs/en/i/7.5.0?topic=services-job-queue-info-view)
- [IBM: `JOBLOG_INFO`](https://www.ibm.com/docs/en/i/7.5.0?topic=services-joblog-info-table-function)
- [IBM: `HISTORY_LOG_INFO`](https://www.ibm.com/docs/en/i/7.5.0?topic=services-history-log-info-table-function)
- [IBM: `MESSAGE_QUEUE_INFO`](https://www.ibm.com/docs/en/i/7.5.0?topic=services-message-queue-info-view)
- [IBM: `RECORD_LOCK_INFO`](https://www.ibm.com/docs/en/i/7.5.0?topic=services-record-lock-info-view)
- [IBM: `OBJECT_LOCK_INFO`](https://www.ibm.com/docs/en/i/7.4.0?topic=services-object-lock-info-view)
- [IBM: Work with Object Lock (`WRKOBJLCK`) command](https://www.ibm.com/docs/en/i/7.5.0?topic=considerations-work-object-lock-wrkobjlck-command)
- [IBM: `ACTIVE_QUERY_INFO`](https://www.ibm.com/docs/en/i/7.5.0?topic=services-active-query-info-table-function)
- [IBM: `SQL_ERROR_LOG` and SELF](https://www.ibm.com/docs/en/i/7.5.0?topic=services-sql-error-log-view)
- [IBM: `ENDED_JOB_INFO`](https://www.ibm.com/docs/en/i/7.5.0?topic=services-ended-job-info-table-function)
- [IBM: `GET DIAGNOSTICS`](https://www.ibm.com/docs/en/i/7.5.0?topic=statements-get-diagnostics)
- [IBM: Job logs and pending versus spooled forms](https://www.ibm.com/docs/en/i/7.5.0?topic=concepts-job-logs)
- [IBM: Displaying a job log](https://www.ibm.com/docs/en/i/7.5.0?topic=log-displaying-job)
- [IBM: Performance Data Investigator](https://www.ibm.com/docs/en/i/7.5.0?topic=interface-performance-data-investigator)

IBM i Services evolve through operating-system releases and Db2 Group PTFs. Columns, optional parameters, authority behavior, and availability can differ on an older partition. Confirm each service in the IBM i Services matrix or `QSYS2.SERVICES_INFO`, test the query with a least-privileged diagnostic profile, and measure its cost before using it in recurring monitoring. The examples in this article are read-only and educational; the information they expose may still be sensitive and must be protected accordingly, and no command or query here is an authorization to take a production recovery action.
