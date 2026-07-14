# Working with Spool Files using WRKSPLF

## Learning Objective

By the end of this lesson, you will be able to explain what `WRKSPLF`
shows, and use it to find, view, and manage spool files created by jobs
you have run.

## Simple Explanation

The Spool Files and Output Queues lesson introduced a spool file as one
specific piece of generated report output. **`WRKSPLF`** (Work with
Spooled Files) is the everyday command for actually finding and managing
spool files, typically scoped to your own user profile by default,
showing every spool file you have generated recently regardless of which
output queue each one landed on.

From the list `WRKSPLF` shows, you can select a spool file and choose an
option to display its contents directly on your 5250 session, send it to
print again, hold it, or delete it. This makes `WRKSPLF` the natural
starting point when you know you ran something that should have produced
a report, but need to actually find and look at it.

## Why It Matters

Beginners sometimes assume the only way to see a report's output is to
already know exactly which output queue it landed on. `WRKSPLF`'s default
scope to your own spool files means you can usually find a report you
just ran without needing to know or check that detail first, making it a
practical everyday starting point for anyone who ran a report and now
needs to see it.

## Practical Example

Imagine running the daily customer balance report and then wanting to
confirm it actually produced the expected output. Running `WRKSPLF`
immediately afterward shows a list including that report's spool file,
even without knowing in advance which output queue it was directed to.
Selecting it and choosing the display option shows the actual report
content directly on the 5250 session, without needing to send anything to
a physical printer first.

This is a simplified, illustrative example rather than a specific real
investigation, but it reflects a genuinely common, everyday IBM i task.

## Common Confusions

**"Does WRKSPLF only show spool files from the job I am currently
running?"**
Not only that. By default, `WRKSPLF` typically shows spool files tied to
your user profile more broadly, not strictly limited to your current
session's job, though exact default scope can vary by system setup.

**"Do I need to know which output queue a spool file is on before using
WRKSPLF?"**
No. This is exactly what makes `WRKSPLF` a convenient starting point:
finding your own spool files by user profile, without first needing to
know or search a specific output queue, covered instead in the Working
with Output Queues using WRKOUTQ lesson.

**"Does selecting the display option on a spool file print it?"**
No. Displaying a spool file shows its contents directly on your 5250
session for you to read, without sending anything to a physical printer.
Printing it again is a separate option from simply viewing it.

## Quick Recap

- `WRKSPLF` (Work with Spooled Files) lists spool files, typically scoped
  to your own user profile by default.
- Options from that list let you display a spool file's contents, send it
  to print again, hold it, or delete it.
- `WRKSPLF` does not require knowing a spool file's specific output queue
  in advance, making it a convenient everyday starting point.
- Displaying a spool file only shows its contents on screen; it does not
  print anything by itself.

## Try Asking the AI Tutor

Use the AI Tutor to ask follow-up questions about this lesson. For
example, try asking:

- "What would I do differently if I needed to see someone else's spool
  files instead of my own?"
- "What happens to a spool file after I choose to delete it from
  WRKSPLF?"
