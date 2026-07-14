# Debugging Subfile Programs

## Learning Objective

By the end of this lesson, you will know a few beginner-friendly ways to
investigate a subfile program that is not behaving as expected, building
on the general RPGLE debugging approaches covered earlier in this path.

## Simple Explanation

In the Debugging RPGLE Programs lesson, you learned a few general
approaches: simple `dsply` tracing, the ILE source debugger, and job
logs. Subfile programs benefit from these same approaches, applied to a
few specific, common trouble spots:

- **Check indicator values around the clear-load-display sequence.**
  Since `SFLCLR`, `SFLDSP`, and `SFLDSPCTL` are all conditioning
  indicators, as covered in the SFLDSP, SFLDSPCTL, and SFLCLR Explained
  lesson, a `dsply` statement showing their current values right before an
  `exfmt` call can quickly reveal whether they are set the way you expect.
- **Confirm records are actually being loaded.** Adding a temporary
  `dsply` inside the loading loop, showing values as each record is
  written into the subfile, helps confirm whether the loop is running the
  expected number of times with the expected data.
- **Check RRN and option values inside a READC loop.** If row selection
  or an update/delete pattern is not behaving as expected, a `dsply`
  showing the RRN and option value found on each pass through a `READC`
  loop, covered in the Selecting a Row in a Subfile lesson, helps confirm
  the program is finding and interpreting changed rows correctly.

## Why It Matters

Subfile programs have more moving pieces than a simple, single-record
screen: two record formats, several conditioning indicators, and often a
loading loop and a `READC` loop. Knowing where these specific trouble
spots tend to be, and using the same general debugging approaches already
covered, gives you a practical, focused starting point rather than
guessing broadly at what might be wrong.

## Practical Example

Imagine an order list subfile that appears to show an empty list even
though orders clearly exist. A developer starts by temporarily adding a
`dsply` inside the loading loop to confirm it is actually running and
writing records; if that loop appears to run correctly, they next check
the indicator values right before the final `exfmt` call, and discover
that `SFLDSP` was accidentally left off, explaining why nothing appeared
even though the records were loaded correctly.

This is a simplified, illustrative example rather than a specific real
investigation, but it reflects a very common, realistic debugging path
for a subfile program that appears broken.

## Common Confusions

**"Do subfile programs need a completely different debugging approach
than regular RPGLE programs?"**
No. The same general approaches, `dsply` tracing, the ILE source debugger,
and job logs, covered in the Debugging RPGLE Programs lesson still apply
directly. This lesson simply points out a few specific places within a
subfile program especially worth checking first.

**"If a subfile appears empty, is the loading loop always the problem?"**
Not always, but it is a reasonable first thing to check, along with
confirming `SFLDSP` is actually on before the final display. An empty-
looking subfile can result from either a loading problem or an indicator
left in the wrong state.

**"Is checking RRN and option values only useful once update/delete
patterns are involved?"**
Mainly, yes. For a simple, browse-only load-all subfile with no option
fields, there is no `READC` loop or option value to check in the first
place; this specific debugging approach becomes relevant once a program
processes row selections.

## Quick Recap

- Subfile debugging builds on the same general approaches covered
  earlier: `dsply` tracing, the ILE source debugger, and job logs.
- Checking `SFLCLR`, `SFLDSP`, and `SFLDSPCTL` indicator values right
  before `exfmt` is a common, useful first step when a subfile does not
  display as expected.
- Temporarily tracing the loading loop helps confirm records are actually
  being written into the subfile.
- Tracing RRN and option values inside a `READC` loop helps confirm row
  selection and update/delete logic is finding and interpreting changed
  rows correctly.

## Try Asking the AI Tutor

Use the AI Tutor to ask follow-up questions about this lesson. For
example, try asking:

- "What would cause a subfile to display duplicate rows, and how would I
  start investigating that?"
- "Is there a way to see a subfile's current indicator values without
  adding temporary dsply statements?"
