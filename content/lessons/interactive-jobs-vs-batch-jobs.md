# Interactive Jobs vs Batch Jobs

## Learning Objective

By the end of this lesson, you will be able to clearly compare
interactive and batch jobs: how each is started, and what that difference
means in practice.

## Simple Explanation

The SBMJOB and Batch Job Basics and Debugging Batch Jobs at a Beginner
Level lessons each touched on interactive and batch jobs while focused on
a different specific topic. This lesson brings the comparison together in
one place.

An **interactive job** starts when a person signs on to IBM i, tied
directly to that signed-on session; the person is present, actively
working, and generally waiting for the system to respond. A **batch
job** starts independently, most commonly submitted with `SBMJOB`, as
covered in the SBMJOB and Batch Job Basics lesson, running on its own
without anyone directly waiting at a screen for it.

Comparing the two directly:

- Started by: an interactive job starts by signing on to a session; a
  batch job starts with `SBMJOB`, or a scheduled or automatic start.
- Someone waiting: an interactive job has the signed-on user directly
  waiting on it; a batch job runs independently, with no one waiting.
- Typical use: an interactive job suits everyday interactive work,
  screens, and commands; a batch job suits long-running or
  resource-intensive work.

## Why It Matters

Recognizing which kind of job you are looking at, or debugging, changes
what tools and expectations make sense: an interactive job can be watched
and debugged live, as covered throughout the Debugging lessons, while a
batch job's investigation relies more heavily on its job log and call
stack, as covered in the Debugging Batch Jobs at a Beginner Level lesson,
since no one is sitting there watching it run.

## Practical Example

Imagine a developer signed on to test a report program interactively,
running it directly and watching its output appear immediately. Later,
that same report is set up to run automatically every night as a batch
job, submitted without anyone signed on at all. Both runs use the exact
same report program; what differs is how each job was started and
whether anyone is directly present while it runs.

This is a simplified, illustrative example rather than a specific real
system, but it reflects a genuinely common pattern: the same program
running as either an interactive job during development, or a batch job
in ongoing production use.

## Common Confusions

**"Can the same program run as either an interactive job or a batch
job?"**
Yes. Whether a job is interactive or batch depends on how the job itself
was started, signing on versus `SBMJOB` or a similar mechanism, not on
anything inherent to the specific program it happens to run.

**"Does a batch job always take longer to complete than an interactive
one?"**
Not necessarily; being independent of a signed-on session is a separate
question from how long a job actually takes. Batch is commonly chosen for
long-running work specifically because no one needs to wait for it, not
because batch itself is inherently slower or faster.

**"If I sign off, does a batch job I submitted stop running?"**
No. Since a batch job runs independently of the session that submitted
it, as covered in the SBMJOB and Batch Job Basics lesson, signing off
does not stop it.

## Quick Recap

- An interactive job is tied to a signed-on session, with someone
  directly waiting on it.
- A batch job runs independently, most commonly submitted with `SBMJOB`,
  without anyone directly waiting.
- The same program can run as either kind of job, depending on how the
  job itself was started.
- Signing off does not stop a batch job that is already running
  independently.

## Try Asking the AI Tutor

Use the AI Tutor to ask follow-up questions about this lesson. For
example, try asking:

- "What are some other ways besides SBMJOB that a batch job might get
  started?"
- "Why would a company choose to run the same report both interactively
  during testing and as a batch job in production?"
