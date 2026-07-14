# Library List Explained in Depth

## Learning Objective

By the end of this lesson, you will understand the parts that make up an
IBM i library list, the order IBM i searches them in, and how to view your
own library list on a running system.

## Simple Explanation

You have already learned, in the Libraries and Objects lesson, that IBM i
finds an unqualified object name (one typed without stating its library) by
searching through a **library list**. This lesson goes deeper into how that
list is actually built and searched.

A library list is not one flat, unordered set of libraries. It is made up of
distinct portions, searched in a specific order:

- The **system portion**, containing libraries IBM uses for operating system
  functions. These are searched, but are not usually where your own
  application objects live.
- The **product portion**, used for certain licensed program libraries.
- The **current library**, which you learned about in the Signing On, User
  Profiles, and Current Library lesson. This is the single library tied to
  your user profile or job, searched at a specific point in the list.
- The **user portion**, an ordered list of additional libraries relevant to
  the applications and job you are working with.

When you refer to an object without specifying its library, IBM i searches
through these portions, in order, and uses the first matching object it
finds. If two libraries in your library list both contain an object with the
same name, the one found first, earlier in the search order, is the one IBM
i uses. This makes library list order a meaningful, sometimes
consequential, setting, not just a convenience list.

You can view your own current library list on a running system using the
`DSPLIBL` (Display Library List) command, which shows every library in your
list, in the order IBM i actually searches them.

## Why It Matters

Understanding library list order explains a specific, sometimes confusing
situation: two people, or the same person at two different times, running
what looks like the exact same command against an object of the same name,
but getting different results. If their library lists differ, or contain the
same libraries in a different order, IBM i may find a different version of
that object first. Without understanding library list order, this can look
like an inconsistent or buggy system, when it is actually predictable
behavior based on a documented search order.

## Practical Example

Imagine a company that keeps both a production version and a test version of
a report program, both named `MONTHENDRPT`, but stored in two different
libraries: `PRODLIB` and `TESTLIB`. A developer testing changes adds
`TESTLIB` to their library list ahead of `PRODLIB` specifically so that,
when they run `MONTHENDRPT` without specifying a library, IBM i finds and
runs the test library's copy first.

Later, once testing is done, they remove `TESTLIB` from their library list
or move it after `PRODLIB`, so that running `MONTHENDRPT` again correctly
finds the production version instead. This is a simplified, illustrative
example rather than a specific real company's exact setup, but it reflects a
genuinely common, practical use of library list ordering during development
and testing.

## Common Confusions

**"Is current library the same thing as the library list?"**
No. The current library, which comes from your user profile as covered in
the Signing On, User Profiles, and Current Library lesson, is one specific
library. The library list is the full, ordered set of libraries -- including
the system portion, product portion, current library, and user portion --
that IBM i searches through together.

**"If I add a library to my library list, does that change it permanently?"**
Not necessarily. Library list changes made during a job, such as with the
`ADDLIBLE` command, typically only apply for the current job or session,
unless separately configured to persist. This is one reason library list
issues can be temporary and situational rather than permanent
misconfigurations.

**"Does library list order matter if every object name is unique across all
my libraries?"**
In that specific case, search order technically would not change the result,
since there is only one object with that name to find. In practice, though,
overlapping or duplicate-named objects across libraries are common enough
that understanding search order is still an important, practical skill.

## Quick Recap

- An IBM i library list is made up of ordered portions: system, product,
  current library, and user portion.
- IBM i searches an unqualified object name through the library list in
  order, using the first match it finds.
- Library list order matters most when the same object name exists in more
  than one library on your list.
- The `DSPLIBL` command shows your own library list, in actual search order,
  on a running system.

## Try Asking the AI Tutor

Use the AI Tutor to ask follow-up questions about this lesson. For example,
try asking:

- "What is the difference between the system portion and the user portion
  of a library list?"
- "How can I add a library to my library list temporarily using ADDLIBLE?"
