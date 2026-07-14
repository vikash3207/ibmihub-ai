# Keyed Physical Files

## Learning Objective

By the end of this lesson, you will understand what makes a physical file
"keyed," how a key relates to the fields you learned about in the DDS Field
Definitions lesson, and why keyed access matters for finding and organizing
records efficiently.

## Simple Explanation

In the Physical Files and Logical Files lesson, keyed access was introduced
conceptually as looking up or ordering records by one or more specific
fields, rather than reading through everything in whatever order it happens
to be stored. This lesson makes that idea concrete for physical files
specifically.

A physical file can optionally be defined as **keyed**, meaning one or more
of its fields, defined using the DDS field definitions covered in the
previous lesson, are designated as the file's **key fields**. Once a
physical file has key fields, IBM i can efficiently find a specific record
by that key's value, and can also retrieve records in key order, without
needing to read through the entire file from beginning to end.

A physical file without any designated key fields is sometimes called an
**arrival sequence** file, meaning records are naturally retrieved in the
order they were added, unless a program specifically requests otherwise.
Adding key fields gives IBM i a defined, efficient way to reach or order
records by something more meaningful than simply the order they arrived in.

Key fields are commonly chosen because they represent a natural, meaningful
way to identify a record, such as a customer number uniquely identifying one
customer's record.

## Why It Matters

Understanding keyed physical files explains a very common, practical
pattern in IBM i business applications: looking up a specific record, such
as one customer or one order, quickly and directly by a meaningful value,
rather than scanning through unrelated records to find it. This directly
supports everyday tasks like a program retrieving one customer's
information by customer number, without needing to inspect every other
customer record along the way.

## Practical Example

Imagine the `CUSTMAST` physical file introduced in earlier lessons, with its
customer number field designated as the key. A program that needs to look up
one specific customer can request that customer's record directly by
customer number, and IBM i uses the key to locate that exact record
efficiently, rather than reading through the file from the beginning.

If `CUSTMAST` had no key at all, finding one specific customer would
generally require checking records one at a time until a match was found.
This is a simplified, illustrative example rather than a specific real
system, but it reflects why keyed access is such a common, practical choice
for physical files holding meaningful business data.

## Common Confusions

**"Does every physical file need to be keyed?"**
No. Some physical files are used in arrival sequence, without any key
fields, when there is no strong need to look up or order records by a
specific value. Whether to key a physical file depends on how it will
actually be used.

**"Can a key be made up of more than one field?"**
Yes. A key can be a single field, such as customer number, or a combination
of more than one field together, when a single field alone would not
uniquely or meaningfully identify a record.

**"Is a keyed physical file the same thing as a logical file?"**
No, though they are related ideas covered together in this lesson group. A
keyed physical file has its key fields built directly into the physical file
itself. A logical file, covered in depth in the next lesson, can provide its
own separate keyed view over an underlying physical file's data, sometimes
using a different key than the physical file's own.

## Quick Recap

- A physical file can optionally be defined as keyed, designating one or
  more of its fields as key fields.
- Keyed access lets IBM i efficiently find a specific record, or retrieve
  records in key order, without reading through the entire file.
- A physical file without key fields is sometimes called an arrival
  sequence file, retrieved in the order records were added.
- A key can be made up of a single field or a combination of multiple
  fields together.

## Try Asking the AI Tutor

Use the AI Tutor to ask follow-up questions about this lesson. For example,
try asking:

- "What happens if I try to add a record with a duplicate key value to a
  keyed physical file?"
- "How is a keyed physical file different from a keyed logical file?"
