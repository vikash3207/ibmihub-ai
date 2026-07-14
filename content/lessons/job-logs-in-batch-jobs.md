# Job Logs in Batch Jobs

## Learning Objective

By the end of this lesson, you will be able to explain how retrieving a
batch job's job log differs practically from checking your own current
job's log, and know where to look for each.

## Simple Explanation

The Understanding Job Logs lesson covered `DSPJOBLOG`, which by default
shows the log for your own current job. The Debugging Batch Jobs at a
Beginner Level lesson noted that a batch job has its own separate job
log. This lesson covers the practical difference in actually retrieving
it.

For your own current, still-running interactive job, plain `DSPJOBLOG`
works directly, with no need to identify the job yourself. For a batch
job, which is a different job entirely, you generally need to identify
it first, by name, user, and number, as covered in the IBM i Jobs
Explained lesson, either through `WRKSBMJOB`, covered in the previous
lesson, or `WRKACTJOB` if it is still running. Selecting that specific
job from either list and choosing its job log option is generally the
practical way to see it, rather than expecting plain `DSPJOBLOG` to show
someone else's job by default.

## Why It Matters

Beginners sometimes try `DSPJOBLOG` alone and are confused when it shows
their own session's log instead of the batch job's they actually wanted.
Understanding that a batch job's log requires identifying that specific
job first, through `WRKSBMJOB` or `WRKACTJOB`, avoids this confusion and
points directly at the practical steps that actually work.

## Practical Example

Imagine a developer wanting to check the nightly order-processing batch
job's log after it finishes. Running plain `DSPJOBLOG` shows only their
own current interactive session's log, not the batch job's at all.
Instead, running `WRKSBMJOB`, finding that specific job by the name given
to `SBMJOB`, and selecting its job log option from there shows exactly
what actually happened during that batch job's run.

This is a simplified, illustrative example rather than a specific real
investigation, but it reflects a genuinely common beginner mix-up when
first trying to check a batch job's log.

## Common Confusions

**"Why doesn't DSPJOBLOG just show me any job I ask for?"**
Used alone, without identifying a different job, `DSPJOBLOG` defaults to
showing your own current job's log. Checking a different job's log,
including a batch job's, generally means identifying that specific job
first, through a command like `WRKSBMJOB` or `WRKACTJOB`.

**"Can I check a batch job's log while it is still running, or only
after it finishes?"**
Both are generally possible: a still-running batch job's log can
typically be checked through `WRKACTJOB`, while a completed one remains
available through `WRKSBMJOB` for a period of time afterward, covered in
the previous lesson.

**"Is a batch job's log structured any differently from an interactive
job's log?"**
The underlying idea, a sequence of messages recorded as the job runs,
covered in the Understanding Job Logs lesson, is the same either way.
What differs is mainly how you go about finding and opening that
specific job's log in the first place.

## Quick Recap

- Plain `DSPJOBLOG` shows only your own current job's log by default.
- Checking a batch job's log generally means identifying that specific
  job first, through `WRKSBMJOB` or `WRKACTJOB`, then selecting its job
  log option.
- A batch job's log can be checked while it is still running or after it
  completes, using the appropriate command for each stage.
- A job log's underlying structure is the same for interactive and batch
  jobs; what differs is how you locate the right one.

## Try Asking the AI Tutor

Use the AI Tutor to ask follow-up questions about this lesson. For
example, try asking:

- "What would happen if I ran DSPJOBLOG expecting to see a batch job's
  log but forgot to identify it first?"
- "Is there a way to check a batch job's log without going through
  WRKSBMJOB or WRKACTJOB first?"
