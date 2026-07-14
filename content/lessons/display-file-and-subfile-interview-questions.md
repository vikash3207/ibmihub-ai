# Display File and Subfile Interview Questions

## What This Lesson Prepares You For

Display file and subfile questions test whether you understand how a
5250 screen program actually flows: what loads before display, what
happens on `EXFMT`, and how a subfile differs from a single-record
screen. This lesson works through the questions and scenarios most
likely to come up.

## Concepts to Revise First

- What is a Display File in IBM i?, and READ, WRITE, EXFMT, and Screen
  Flow.
- What is a Subfile in IBM i?, and Simple Inquiry Subfile Pattern.
- Option Fields in Subfile Screens, and Selecting a Row in a Subfile.
- Common Display File Mistakes and Best Practices, and Common Subfile
  Mistakes and Best Practices.
- The Simple Order List Subfile and Subfile Row Selection with Detail
  Screen mini projects.

## Common Interview Questions

- "What is the difference between a display file and a subfile?"
- "Why do you need to clear a subfile before loading it again?"
- "What does `READC` do differently from `READ` in a subfile program?"
- "What is the purpose of the subfile control record format?"

## Good Beginner-Level Answers

For "what is the difference between a display file and a subfile?", a
strong answer is: "A display file is the general term for any 5250
screen definition. A subfile is a specific kind of record format inside
a display file that can hold many rows at once, like a list, instead of
showing one record per screen. A subfile is always paired with its own
subfile control record format that manages things like clearing and
displaying it." This shows the containment relationship clearly, rather
than treating the two as unrelated terms.

## Scenario-Based Questions

- "A subfile shows the same five rows from a previous search after a
  user runs a new search. What is the most likely cause?"
- "You need to let a user select one row from a list and see full detail
  for just that row. What subfile feature would you use, and what native
  file operation reads only the changed rows?"
- "A screen program calls `EXFMT` in a loop, but a function key press
  seems to do nothing. What would you check first?"

## How to Explain Your Thinking

For the "same five rows from a previous search" scenario, a good
approach is to name the missing step directly: "The most likely cause is
that the subfile was never cleared before being reloaded with the new
search's results, so old rows are still sitting in it alongside, or
instead of, the new ones. Clearing the subfile, usually with an
indicator tied to `SFLCLR` in the DDS, has to happen before the new
`WRITE`s for this search." This shows you understand the clear-then-load
pattern, not just that clearing exists as a step.

## Common Weak Answers to Avoid

- Describing a subfile as "just a table on the screen" without mentioning
  the subfile control record format's role in clearing and displaying
  it.
- Saying `READ` and `READC` are interchangeable in a subfile program,
  instead of explaining that `READC` reads only the rows a user actually
  changed.
- Not checking whether a function key indicator is even wired up in the
  DDS before assuming the RPGLE logic itself is broken.

## Practical Examples

```rpgle
dcl-f ORDSFLD workstn;
dcl-f ORDHIST disk keyed;

dcl-s custNbr packed(6:0);

custNbr = 1042;

*in30 = *on;
write ORDCTL;
*in30 = *off;

setll custNbr ORDHIST;
reade custNbr ORDHIST;
dow not %eof(ORDHIST);
  write ORDSFL;
  reade custNbr ORDHIST;
enddo;

exfmt ORDCTL;
```

A strong interview answer walks through this in order: `*in30`, tied to
`SFLCLR` in the DDS, clears the subfile before this search's rows are
loaded; `SETLL` plus `READE` reads only the matching orders for this
customer; each matching row is written into the subfile with `WRITE
ORDSFL`; and `EXFMT ORDCTL` finally displays the loaded subfile to the
user.

## Mini Practice Task

Extend the practical example above, on paper, to add an option field the
user can set to `1` next to one row, and describe out loud what
`READC ORDSFL` would do differently from `READ ORDSFL` when checking
which row was selected.

## Quick Recap

- A subfile is a record format inside a display file that holds multiple
  rows; the subfile control record format manages clearing and
  displaying it.
- Forgetting to clear a subfile before reloading it is one of the most
  common subfile interview scenarios.
- `READC` reads only changed subfile rows; `READ` reads every row
  regardless of whether the user touched it.

## Try Asking the AI Tutor

Use the AI Tutor to practice these scenarios. For example, try asking:

- "Can you give me a subfile snippet that's missing the clear step and
  ask me to spot the bug?"
- "How would I explain the difference between READ and READC in a
  subfile program during an interview?"
