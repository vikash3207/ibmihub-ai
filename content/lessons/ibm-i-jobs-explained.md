# IBM i Jobs Explained

## Learning Objective

By the end of this lesson, you will be able to explain what identifies a
job on IBM i, and where a job actually runs.

## Simple Explanation

The Job Logs and Spool Files Basics lesson introduced a job at a
conceptual level: a unit of work running on IBM i. This lesson goes
deeper into what a job actually is.

Every job has its own **identity**, made up of three parts: a **job
name**, a **user**, the profile the job is running under, and a **job
number**, a unique number IBM i assigns so that even two jobs sharing the
same name and user are still distinguishable. This is exactly the same
triplet retrieved with `RTVJOBA` in the Working with IBM i Job Attributes
in CLLE lesson.

Every job also runs inside a **subsystem**, a controlled environment IBM
i uses to manage groups of jobs together, covered in full in the
Subsystems Basics lesson later in this group. A job does not simply run
"on the system" in the abstract; it always runs within some specific
subsystem, which affects things like available resources and how the job
was started in the first place.

## Why It Matters

Understanding that a job has a real, specific identity, name plus user
plus number, not just a vague label, is what makes commands like
`WRKACTJOB` and `DSPJOB`, covered in earlier lessons, actually useful:
they let you find and inspect one specific job among potentially many
sharing a similar name. Knowing that every job runs within a subsystem
also sets up the next few lessons in this group, connecting jobs to the
environments they actually run in.

## Practical Example

Imagine two different users both starting a job named `QPADEV0001`, a
common generic interactive job name, at the same time. Despite sharing
the same job name, each has its own user and its own unique job number,
letting IBM i, and a developer using `WRKACTJOB`, tell them apart
immediately, even though a glance at just the job name alone might
suggest they were the same thing.

This is a simplified, illustrative example rather than a specific real
scenario, but it reflects a genuinely common situation on any IBM i
system with more than a handful of users.

## Common Confusions

**"Is a job's name enough to uniquely identify it?"**
Not on its own. The full identity is name, user, and job number together;
relying on job name alone can be misleading, since the same name is
often reused across many different jobs over time.

**"Does every job run in the same subsystem?"**
No. Different kinds of jobs, such as interactive sessions versus batch
jobs, commonly run in different subsystems set up for that purpose,
covered in the Subsystems Basics lesson.

**"Is a job the same thing as a program?"**
No. A job is the unit of work IBM i manages; a program is something that
runs within a job. A single job can call and run several different
programs over its lifetime, one after another.

## Quick Recap

- Every job has a unique identity made up of job name, user, and job
  number together.
- Job name alone does not reliably identify one specific job, since names
  are commonly reused.
- Every job runs within a subsystem, a controlled environment covered in
  the next lessons.
- A job is the unit of work that runs one or more programs over its
  lifetime, not a program itself.

## Try Asking the AI Tutor

Use the AI Tutor to ask follow-up questions about this lesson. For
example, try asking:

- "Why would IBM i let two jobs share the exact same job name at the same
  time?"
- "How would I use a job's full name, user, and number together to find
  it with WRKACTJOB?"
