# DDS and SQL: Two Ways to Define Db2 for i Data

## Learning Objective

By the end of this lesson, you will understand that Db2 for i data can be
defined using two different approaches, DDS and SQL, and have a starting
mental map for how the rest of this lesson group builds on that distinction.

## Simple Explanation

In the Introduction to Db2 for i lesson, you learned that Db2 for i is the
integrated relational database built into IBM i, and that it organizes data
into tables made up of rows and columns, which correspond to the physical
files, records, and fields you learned about earlier. What that lesson did
not cover is that there are actually two different traditions for defining
that underlying data, both of which are still common on IBM i today.

- **DDS**, short for Data Description Specifications, is the traditional,
  IBM i-specific way of defining physical files and logical files. DDS uses
  its own specification syntax, written in a source member, to describe a
  file's fields, keys, and other properties. Many long-running IBM i
  applications define their data this way.
- **SQL**, the same general-purpose database language used across many
  platforms, can also be used to define Db2 for i data directly, using
  familiar statements such as `CREATE TABLE`. This is the newer, more
  portable approach, and is increasingly how new Db2 for i data gets
  defined.

Both approaches ultimately define data that lives in Db2 for i and can, in
many cases, be accessed by the same programs and tools regardless of which
approach originally created it. Neither approach is "fake" or a workaround;
both are genuine, supported ways of working with the same underlying
database.

## Why It Matters

Beginners sometimes assume DDS and SQL are entirely separate, unrelated
systems, or that one of them is outdated and unusable. In practice, IBM i
shops commonly maintain a mix: older, established data defined with DDS,
alongside newer development that favors SQL. Recognizing both approaches,
and understanding that they describe the same kind of Db2 for i data, gives
you the right mental model before going deeper into either one in the
lessons that follow.

## Practical Example

Imagine a company whose core order-processing data was originally defined
decades ago using DDS-described physical files, and is still actively used
by RPGLE programs today. When that same company starts a new project, a
developer defines a new table for it using an SQL `CREATE TABLE` statement
instead, because the team now prefers writing SQL for new development.

Both the old, DDS-defined order data and the new, SQL-defined table live in
the same Db2 for i database, and both can potentially be queried using SQL
or read by an RPGLE program. This is a simplified, illustrative example
rather than a specific real company, but it reflects a very common,
realistic pattern across long-running IBM i shops.

## Common Confusions

**"Is SQL a replacement for DDS?"**
Not exactly. SQL is a newer, increasingly common way to define and work with
Db2 for i data, but DDS-defined physical and logical files remain widely
used, especially in long-running applications. Both approaches coexist on
real systems today.

**"If a physical file was originally defined with DDS, can it still be
queried with SQL?"**
Yes, generally. Db2 for i is designed so that data can typically be reached
through SQL regardless of whether it was originally defined using DDS or
SQL, which is part of why Db2 for i supports the mixed, gradual evolution
many IBM i shops actually go through.

**"Do I need to learn both DDS and SQL?"**
For a well-rounded understanding of IBM i, yes, over time. Many real IBM i
environments use both, so recognizing which approach you are looking at, and
being comfortable with each at a basic level, is a genuinely useful skill.

## Quick Recap

- Db2 for i data can be defined using two traditions: DDS, the traditional,
  IBM i-specific specification syntax, and SQL, the newer, more widely
  known database language.
- DDS-defined physical and logical files remain common, especially in
  long-running applications; SQL-defined tables are increasingly common in
  newer development.
- Both approaches define genuine Db2 for i data, and that data can typically
  be reached through SQL or traditional IBM i programs regardless of which
  approach defined it.
- The lessons that follow go deeper into DDS-based physical and logical
  files first, then compare that approach directly against SQL tables.

## Try Asking the AI Tutor

Use the AI Tutor to ask follow-up questions about this lesson. For example,
try asking:

- "Why would a team choose SQL over DDS for a brand new IBM i project?"
- "Can an RPGLE program read data from a table that was created using SQL
  instead of DDS?"
