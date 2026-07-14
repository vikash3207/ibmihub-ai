# Real Support Ticket Analysis for Beginners

## What This Lesson Prepares You For

Many entry-level IBM i roles involve support work: reading a short,
often vague ticket and figuring out where to start. This lesson walks
through six small, realistic ticket scenarios and how to reason through
each one, the way you would be asked to in an interview or on the job.

## Concepts to Revise First

- The Basic Troubleshooting Flow for IBM i Developers lesson.
- Understanding Job Logs, and Reading IBM i Message IDs.
- Object Locks Basics, and Handling Object Locks as a Developer.
- Handling No Row Found in SQLRPGLE.
- Library List in Real Job Execution.
- Debugging Report Output Problems.

## Common Interview Questions

- "How do you approach a support ticket that just says 'the program
  isn't working'?"
- "What information would you ask for if a ticket doesn't include
  enough detail to start?"
- "How do you decide whether something is a code problem, a data
  problem, or an environment problem?"

## Good Beginner-Level Answers

A strong general answer to "how do you approach a vague ticket?" is: "I'd
start by getting the exact error message or symptom, when it happened,
and what the user was trying to do, since 'isn't working' could mean a
dozen different things. Then I'd check the job log first, since it often
narrows things down immediately." This shows you gather specifics before
guessing, rather than starting to investigate blind.

## Scenario-Based Questions

Below are six small, realistic tickets. For each one, the useful skill is
naming the most likely cause and the first thing you would check, not
necessarily solving it in full.

**Ticket 1: "Program fails with file not found."**
Likely cause: the program's library list doesn't include the library
where the file actually lives, or the file was moved, renamed, or never
created in this environment. First check: the job log message detail,
which usually names the exact object it could not find, then confirm
that object exists where the library list expects it.

**Ticket 2: "A job is stuck in MSGW status."**
Likely cause: the job is waiting for a reply to an inquiry message, often
caused by an unhandled error condition partway through. First check: use
`WRKJOB` or the job's message queue to see exactly what message it is
waiting on, since that message usually explains what the job needs.

**Ticket 3: "Record lock issue when two users update the same customer."**
Likely cause: two jobs both retrieved the same record and one is holding
a lock the other is waiting on or conflicting with, a normal, expected
situation rather than a code bug. First check: `WRKOBJLCK` against the
file in question to see which job holds which lock, exactly as covered
in the Troubleshooting Locked Record Scenario mini project.

**Ticket 4: "SQL query returns no row, but the user says the record
exists."**
Likely cause: either the search value entered does not exactly match
what's stored (case, spacing, or a typo), or the `WHERE` condition itself
is more restrictive than intended. First check: confirm `SQLCODE`
actually came back `100`, then check the exact value being searched for
against the actual stored value.

**Ticket 5: "Program works in one library list but not another."**
Likely cause: an object the program depends on, often a file, exists in
one library on the list but not the other, or two libraries in different
list orders expose two different same-named objects. First check:
compare the two library lists directly and confirm which library each
one actually resolves the dependent object to.

**Ticket 6: "Spool file not generated after a batch job that says it
completed."**
Likely cause: a printer file override never took effect, the output
queue specified doesn't exist, or the report program itself failed
after the point where the wrapper considered its job done, exactly the
kind of gap investigated in the Batch Job Failure Investigation mini
project. First check: the batch job's own job log, separately from the
job that submitted it.

## How to Explain Your Thinking

A consistent structure works well across all six tickets above: name the
most likely cause first, in one sentence, then name the first concrete
thing you would check to confirm or rule it out. Avoid describing a fix
before you've actually identified the cause; a confident-sounding
guess that turns out wrong is a weaker answer than an honest, structured
investigation plan.

## Common Weak Answers to Avoid

- Proposing a fix immediately, before naming what you would check to
  confirm the actual cause.
- Assuming "record lock" or "file not found" always means the same thing
  every time, instead of naming the specific first check for that
  situation.
- Treating every ticket as a code bug, when environment issues (library
  list, missing objects, output queues) are just as common in practice.

## Practical Examples

For Ticket 4 above, a good practical answer sounds like: "SQLCODE = 100
after a SELECT INTO specifically means no row matched the WHERE
condition, which is different from a genuine SQL error. Before assuming
the query logic is wrong, I'd check whether the search value has
trailing spaces or different casing than what's actually stored, since
that's a very common reason a record 'exists' from the user's point of
view but doesn't match the WHERE clause exactly."

## Mini Practice Task

Pick any one of the six tickets above and write, in two or three
sentences, how you would explain your investigation plan to a
non-technical user who filed the ticket, without using terms like
`SQLCODE` or `WRKOBJLCK` that they wouldn't recognize.

## Quick Recap

- A vague ticket becomes workable once you have the exact symptom, what
  the user was doing, and when it happened.
- Naming a likely cause and the first concrete check to confirm it is
  stronger than jumping straight to a fix.
- File-not-found, MSGW, record locks, no-row-found, library list
  mismatches, and missing spool files are common, recognizable ticket
  patterns, not mysterious one-off problems.

## Try Asking the AI Tutor

Use the AI Tutor to practice ticket triage. For example, try asking:

- "Can you give me a short, realistic IBM i support ticket and ask me to
  walk through my investigation plan?"
- "How would I explain a record lock issue to a non-technical user
  filing a support ticket?"
