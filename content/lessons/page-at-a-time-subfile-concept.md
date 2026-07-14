# Page-at-a-Time Subfile Concept

## Learning Objective

By the end of this lesson, you will understand the page-at-a-time subfile
strategy at a conceptual level, how it differs from load-all, and what
role the Relative Record Number, or RRN, plays in it.

## Simple Explanation

In the Load-All Subfile Concept lesson, you learned that load-all means
loading every record before displaying the subfile even once. **Page-at-a-
time** takes a different approach: the program loads only enough records
to fill one visible page, `SFLPAG` worth, and loads additional records only
when the user actually pages forward far enough to need them.

This strategy depends on tracking position within the underlying data
using the **Relative Record Number**, or **RRN**: a number identifying a
specific record's position, used so the program knows exactly where it
left off and can resume loading the next batch of records from the right
place when the user pages forward.

Page-at-a-time is more efficient than load-all for a large number of
records, since the program never loads more than what the user has
actually scrolled to see. This efficiency comes at the cost of additional
programming complexity: the program needs logic to detect when the user
has paged to the edge of what is currently loaded, and load more records
at that point.

This lesson introduces page-at-a-time only at this conceptual level. The
detailed RPGLE logic for actually detecting a page request and loading
additional records on demand is a more advanced topic beyond this
introductory lesson group.

## Why It Matters

Understanding that page-at-a-time exists, and roughly why and when it is
used, helps you recognize which strategy a real subfile program is using
when you encounter one, and helps you make an informed choice later, once
you are ready to implement it, between the simplicity of load-all and the
efficiency of page-at-a-time for genuinely large record sets.

## Practical Example

Imagine an order list subfile expected to show many thousands of orders
for a large customer. Loading every single one before showing anything, as
load-all would, could take a noticeably long time and use more resources
than necessary, especially since most users only ever look at the first
page or two. A page-at-a-time version instead loads just enough orders to
fill the first visible page, tracking the RRN of the last order loaded, and
only loads more orders, continuing from that RRN, if the user actually
pages further into the list.

This is a simplified, illustrative example rather than a specific real
program, but it reflects a genuinely common, practical reason larger IBM i
applications use page-at-a-time instead of load-all.

## Common Confusions

**"Is page-at-a-time always better than load-all?"**
Not necessarily. For a small, predictable number of records, load-all's
simplicity often outweighs any efficiency page-at-a-time would offer. Page-
at-a-time becomes more valuable specifically as record counts grow large
enough that loading everything up front becomes noticeably slow or
wasteful.

**"Is RRN the same thing as a field defined in the subfile record
format?"**
Not exactly. RRN is a way of identifying a record's relative position; it
is commonly tracked using a hidden field on the subfile record format tied
to a program variable, but the underlying idea, tracking position, is
distinct from any one specific business field, such as an order number.

**"Do I need to fully implement page-at-a-time to understand this
lesson?"**
No. This lesson focuses on understanding the concept, why it exists and
how it differs from load-all, rather than writing the detailed logic to
implement it, which goes beyond this introductory lesson group.

## Quick Recap

- Page-at-a-time loads only enough records to fill one visible page,
  loading more only as the user pages forward.
- This strategy is more efficient for large record sets than load-all, at
  the cost of additional programming complexity.
- The Relative Record Number, or RRN, helps a program track its position
  so it knows where to resume loading more records.
- This lesson introduces page-at-a-time conceptually; the detailed
  implementation logic is a more advanced topic beyond this lesson group.

## Try Asking the AI Tutor

Use the AI Tutor to ask follow-up questions about this lesson. For
example, try asking:

- "How does an RPGLE program actually detect that the user has paged to
  the edge of what is currently loaded?"
- "Is there a general record-count guideline for choosing page-at-a-time
  over load-all?"
