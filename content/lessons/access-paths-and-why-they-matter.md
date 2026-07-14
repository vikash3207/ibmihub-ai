# Access Paths and Why They Matter

## Learning Objective

By the end of this lesson, you will understand what an access path is, how
it relates to the keyed physical files and logical files you have already
learned about, and why access paths are worth being aware of even at an
introductory level.

## Simple Explanation

You now know that both keyed physical files and logical files can present
data in a specific key order. What actually makes that ordered access
efficient, rather than requiring IBM i to sort through every record each
time, is something called an **access path**.

An access path is a structure IBM i maintains, similar in spirit to an index
in other database systems, that keeps track of key order and record
locations so that keyed access can be fast, without scanning the entire
physical file every time a record is requested. Every keyed physical file
has its own access path, and every keyed logical file has its own access
path as well, separate from the physical file's.

IBM i automatically keeps access paths up to date as records are added,
changed, or deleted, so that keyed access continues to work correctly and
efficiently over time. This automatic maintenance has a cost: every access
path associated with a physical file adds some amount of extra work
whenever that physical file's data changes, since IBM i must keep each
associated access path current.

## Why It Matters

Understanding access paths at a conceptual level helps you make sense of why
having many keyed logical files over a heavily updated physical file is a
real, meaningful design consideration, not just a minor technical detail.
Each additional access path IBM i must maintain adds some overhead every
time the underlying data changes. This lesson intentionally stays at a
conceptual level; detailed access path performance tuning is an advanced
topic beyond this introduction, but knowing that this tradeoff exists is a
valuable foundation for understanding IBM i database design decisions later.

## Practical Example

Imagine the `CUSTMAST` physical file, along with the two logical files
described in the previous lesson: one keyed by customer name, and one
filtered to a specific region. Each of these three objects, the physical
file itself, and each keyed logical file, has its own access path that IBM i
maintains.

Whenever a customer record is added, changed, or deleted, IBM i updates all
three access paths to keep each one accurate, not just the physical file's
own. This is a simplified, illustrative example rather than a specific real
system, but it reflects a genuine, common tradeoff IBM i developers become
aware of as they design and maintain keyed physical and logical files.

## Common Confusions

**"Is an access path the same thing as the data itself?"**
No. An access path is a separate structure IBM i maintains to support fast,
ordered access to a physical file's data; it does not duplicate the actual
business data itself, similar to how a logical file does not duplicate the
underlying data it presents.

**"Do arrival sequence physical files, without any key, have an access
path?"**
Not in the same sense. Since arrival sequence files are not keyed, there is
no key order for an access path to maintain in the way there is for a keyed
physical file or a keyed logical file.

**"Does having many logical files over one physical file cause problems?"**
Not automatically, but it is a real tradeoff worth understanding: each
additional keyed logical file adds another access path IBM i must maintain
as the underlying data changes. Whether that tradeoff is worth it depends on
how the logical file is actually used, which is a design decision beyond
this introductory lesson.

## Quick Recap

- An access path is a structure IBM i maintains to support fast, ordered
  access to a keyed physical file or keyed logical file, without scanning
  the entire physical file.
- Every keyed physical file and every keyed logical file has its own,
  separate access path.
- IBM i automatically keeps access paths up to date as underlying data
  changes, which adds some overhead for each access path that exists.
- Detailed access path performance tuning is an advanced topic beyond this
  introduction, but understanding that this tradeoff exists is a valuable
  foundation.

## Try Asking the AI Tutor

Use the AI Tutor to ask follow-up questions about this lesson. For example,
try asking:

- "Does an arrival sequence physical file have any kind of access path at
  all?"
- "Why might having too many logical files over one physical file become a
  concern?"
