# Report Totals and Summary Lines

## Learning Objective

By the end of this lesson, you will be able to accumulate a running total
across a report's detail lines and print it once as a summary line at the
end.

## Simple Explanation

The Report Record Formats lesson introduced a total record format as one
of the common building blocks of a report, alongside heading and detail.
This lesson shows how an RPGLE program actually builds up that total
while looping through detail lines, then prints it once the loop
finishes.

```rpgle
dcl-f CUSTRPTP printer;
dcl-f CUSTMAST disk;

dcl-s balTotal packed(11:2) inz(0);

write HDGFMT;

read CUSTMAST;
dow not %eof(CUSTMAST);
  if *inof;
    write HDGFMT;
  endif;

  balTotal += CUSTBAL;
  write DTLFMT;

  read CUSTMAST;
enddo;

write TOTFMT;
```

Here, `balTotal`, initialized to zero with `inz(0)`, is increased by
`CUSTBAL` on every pass through the loop, exactly the same accumulation
pattern covered for a `FETCH` loop in the FETCH Loop for Reading Multiple
Rows lesson. Once the loop ends, meaning every customer has been read and
printed, `write TOTFMT;` prints the total record format a single time,
using whatever value `balTotal` has accumulated by that point.

## Why It Matters

A running total is one of the most common, practical additions to a basic
report: a grand total of amounts, a count of rows, or both together.
Understanding that this simply means accumulating an ordinary RPGLE
variable inside the same loop already used for detail lines, then writing
a separate record format once after the loop ends, turns an abstract
"total record format" into a concrete, buildable pattern.

## Practical Example

Imagine the daily customer balance report from earlier lessons in this
group, now also showing the combined balance across every customer
listed. As the program reads and prints each customer's detail line, it
also adds that customer's balance to `balTotal`. Once every customer has
been processed, the report's final line shows the grand total, giving
whoever reads the report both the individual details and the overall
picture in one place.

This is a simplified, illustrative example rather than a specific real
report, but it reflects exactly how totals are added to a huge number of
everyday IBM i reports.

## Common Confusions

**"Does TOTFMT need to be written inside the loop, right after each
DTLFMT?"**
No. `TOTFMT` should be written once, after the loop finishes, exactly as
shown above. Writing it inside the loop would print a partial, still-
accumulating total after every single customer, rather than the final
total once everything has been read.

**"What happens to balTotal if CUSTMAST has no records at all?"**
It stays at its initialized value of zero, since the loop body, where
`balTotal` is increased, never runs. `write TOTFMT;` would still execute
after the loop, printing a total of zero.

**"Could a report track more than one running total at once, such as a
count and a sum together?"**
Yes. Any number of variables can be accumulated together inside the same
loop, exactly as covered for a `FETCH` loop's body in the FETCH Loop for
Reading Multiple Rows lesson; a separate counter variable could be
increased by one on each pass alongside `balTotal`.

## Quick Recap

- A running total is an ordinary RPGLE variable, initialized to zero and
  increased inside the same loop that writes each detail line.
- The total record format is written once, after the loop finishes, not
  inside the loop alongside each detail line.
- If there are no underlying records at all, a running total stays at its
  initialized value, and the total line still prints, showing that value.
- More than one running total, such as a sum and a count, can be
  accumulated together inside the same loop.

## Try Asking the AI Tutor

Use the AI Tutor to ask follow-up questions about this lesson. For
example, try asking:

- "How would I add a count of customers alongside the balance total on
  this same report?"
- "What would happen if TOTFMT were accidentally written inside the loop
  instead of after it?"
