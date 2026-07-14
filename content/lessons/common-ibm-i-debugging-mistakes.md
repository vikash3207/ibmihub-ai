# Common IBM i Debugging Mistakes

## Learning Objective

By the end of this lesson, you will be able to recognize the most common
beginner mistakes when debugging on IBM i, and apply a simple set of
best practices to avoid them.

## Simple Explanation

This lesson brings together the debugging concepts covered across this
lesson group, `STRDBG`, breakpoints, watching variables, job logs, message
IDs, and compile versus runtime errors, into one focused list of the
mistakes beginners make most often.

A few of the most common mistakes:

- **Trying to debug a program that was not compiled with debugging
  data.** As covered in the STRDBG Basics for RPGLE lesson, the debugger
  cannot show meaningful source lines or variable names without it.
- **Skipping the job log before starting a debug session.** As covered in
  the Understanding Job Logs lesson, the job log often points directly at
  what went wrong, saving significant time compared to stepping through
  code blindly from the beginning.
- **Assuming every CPF message means something failed.** As covered in
  the Reading IBM i Message IDs lesson, `CPF` covers a huge range of
  messages, many of which are purely informational.
- **Treating a runtime error like a compile error, or vice versa.** As
  covered in the Compile Errors vs Runtime Errors lesson, a compile error
  is caught before a program runs at all, while a runtime error only
  appears once the program is actually executing.
- **Setting a breakpoint but never actually checking variable values with
  EVAL.** As covered in the Watching Variables During Debug lesson,
  pausing at a breakpoint without checking relevant variables misses much
  of the value a debug session provides.

## Why It Matters

Almost every beginner debugging struggle on IBM i traces back to one of a
small number of familiar mistakes. Recognizing this short, repeatable
list turns an intimidating debugging session into a quick checklist,
helping new developers get unstuck faster and with less frustration.

## Practical Example

Imagine a developer who tries to set a breakpoint on `CUSTRPT` using
`STRDBG`, but the debugger will not show the expected source lines at
all. Checking against this list quickly surfaces the likely cause: the
program was not compiled with debugging data in the first place, exactly
the mistake described above, rather than something being wrong with the
debug session itself.

This is a simplified, illustrative example rather than a specific real
review, but it reflects how useful a short, known list of common
mistakes is when a debugging session is not going as expected.

## Common Confusions

**"Are these mistakes only made by beginners?"**
They are most common among beginners, but even experienced developers
occasionally slip up on one of these, especially skipping the job log
when in a hurry to just start stepping through code. The value of this
list is in having a quick, repeatable checklist to reach for, regardless
of experience level.

**"Is this the complete list of every possible debugging mistake?"**
No. This lesson focuses on the most common mistakes connected to the
beginner-level debugging concepts covered across this lesson group. More
advanced topics, such as debugging service jobs, multi-threaded jobs, or
batch processes, have their own separate considerations beyond this
introduction.

**"Which mistake on this list is most important to avoid?"**
All five matter, but skipping the job log is likely the single most
time-costly mistake, since it often means investigating a problem the
long way when the job log could have pointed directly at the cause from
the start.

## Quick Recap

- The most common IBM i debugging mistakes are: debugging a program
  without debugging data compiled in, skipping the job log, assuming
  every CPF message signals failure, confusing compile and runtime
  errors, and setting breakpoints without actually checking variable
  values.
- Checking this short list first turns a stuck debugging session into a
  quick checklist rather than an open-ended search.
- This list focuses on the beginner-level debugging concepts covered in
  this lesson group; more advanced topics have their own separate
  considerations.
- Even experienced developers occasionally make these same mistakes,
  which is exactly why the checklist stays useful over time.

## Try Asking the AI Tutor

Use the AI Tutor to ask follow-up questions about this lesson. For
example, try asking:

- "Which of these common mistakes is easiest to accidentally repeat even
  after learning about it once?"
- "How would I explain the job-log-first habit to someone new to IBM i
  debugging?"
