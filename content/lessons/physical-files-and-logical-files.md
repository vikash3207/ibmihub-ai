# Physical Files and Logical Files

## Learning Objective

By the end of this lesson, you will understand what a physical file is, what a
logical file is, how they relate to each other, and how this connects to Db2 for i.

## Simple Explanation

A physical file is where actual data is stored on IBM i. It holds records, and each
record is made up of fields, similar in spirit to how a row is made up of columns in
a table, though IBM i uses its own terminology for this.

A logical file is commonly used as an alternate view, or access path, over data that
already lives in a physical file. Rather than storing a separate copy of the
business data itself, a logical file normally presents the same underlying data in
a different way, such as in a different order or through a different set of fields.

This connects directly to Lesson 3's mention of Db2 for i: physical files are the
kind of underlying data storage that Db2 for i, the integrated database built into
IBM i, works with.

Keyed access is a related idea worth introducing conceptually here. A key is one or
more fields used to look up or order records in a meaningful way, similar to looking
something up by a specific piece of information rather than reading through every
record in whatever order it happens to be stored.

## Why It Matters

RPG programs and other IBM i applications commonly read and write data through
physical and logical files. Understanding the difference matters because it helps
you recognize that you may be looking at different views of the same underlying
data, rather than assuming every file you encounter holds its own independent copy
of the data.

## Practical Example

Imagine a physical file that stores customer order records. One logical file could
present those same order records keyed by order date, useful for a shipping-related
view. A second logical file could present the same order records keyed by customer
number, useful for a customer-service view.

Both logical files are working with the same underlying order data stored in the
physical file; they simply offer different ways of looking at and finding that data.
This is a simplified, illustrative example rather than a real system, but it
reflects a common pattern for organizing access to the same data in different ways.

## Common Confusions

**"Does a logical file duplicate the data from the physical file?"**
Normally, no. A logical file is generally used as a view or access path over the
data in a physical file, rather than as a place where a separate duplicate copy of
that business data is stored.

**"Are records and fields the same as rows and columns in a spreadsheet?"**
Conceptually similar in some ways, but not identical. IBM i uses its own
terminology (records and fields) for this idea, and the details of how they work
go beyond what a spreadsheet analogy fully captures.

**"Do I need to know DDS or SQL syntax to understand this lesson?"**
No. This lesson stays at a conceptual level. The specific syntax used to define
physical and logical files is a more technical topic beyond the scope of this
fundamentals lesson.

## Quick Recap

- A physical file stores actual data on IBM i, organized as records made up of
  fields.
- A logical file is commonly used as an alternate view or access path over data
  that already lives in a physical file.
- A logical file normally does not store a separate duplicate copy of the
  underlying business data.
- Keyed access means looking up or ordering records by one or more specific
  fields, rather than reading through everything in storage order.
- Physical files are the kind of underlying data storage that Db2 for i, IBM i's
  integrated database, works with.

## Try Asking the AI Tutor

Once the AI Tutor is available, you will be able to ask follow-up questions about
anything in this lesson. One thing you might ask:

- "What's the difference between a physical file and a logical file on IBM i?"
