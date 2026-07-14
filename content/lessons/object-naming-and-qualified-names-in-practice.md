# Object Naming and Qualified Names in Practice

## Learning Objective

By the end of this lesson, you will understand the basic rules for naming
IBM i objects, what a qualified object name is, and why qualifying an
object's library removes ambiguity that an unqualified name can create.

## Simple Explanation

You already know, from the Common IBM i Object Types lesson, that every IBM
i object has a specific type, and, from the Library List Explained in Depth
lesson, that unqualified object names are found by searching a library list.
This lesson focuses specifically on how objects are named, and how to refer
to one precisely when you need to.

IBM i native object names follow some traditional naming rules you will see
referenced often, especially in older systems and documentation:

- Names are commonly limited to **10 characters**.
- Names typically must start with a letter, and may otherwise contain
  letters, numbers, and a small set of special characters such as
  underscore.
- Names are **not case-sensitive**: `CUSTINQ`, `custinq`, and `CustInq` all
  refer to the same object.

An **unqualified name** is just the object's name by itself, such as
`CUSTINQ`, relying on the library list to find it, as covered in the
previous lesson. A **qualified name** explicitly states both the library and
the object, separated by a forward slash, such as `MYAPPSRC/CUSTINQ`. A
qualified name removes any ambiguity about which library's version of an
object you mean, because it does not depend on library list search order at
all.

Many IBM i commands accept either form. Typing just `CUSTINQ` relies on the
library list; typing `MYAPPSRC/CUSTINQ` tells IBM i exactly which object you
mean, regardless of what is currently in your library list.

## Why It Matters

Understanding qualified names gives you a precise, unambiguous way to refer
to an object whenever library list search order might otherwise cause
confusion, which you learned about directly in the Library List Explained in
Depth lesson. This is especially useful when working across environments,
such as confirming you are looking at a production object rather than a test
one, or when writing down exact instructions for someone else to follow
without relying on their library list matching yours.

## Practical Example

Imagine two developers discussing an issue with a program named `CUSTINQ`,
which happens to exist in both the `PRODLIB` and `TESTLIB` libraries, as
described in the Library List Explained in Depth lesson. Saying simply,
"check `CUSTINQ`," leaves room for confusion, since it depends on each
developer's own library list order.

Saying instead, "check `PRODLIB/CUSTINQ`," removes that ambiguity entirely
and ensures both developers are looking at the exact same object, regardless
of their individual library list settings. This is a simplified,
illustrative example rather than a specific real conversation, but it
reflects a genuinely useful, common practice among IBM i developers.

## Common Confusions

**"Is a qualified name a completely different kind of name from an
unqualified name?"**
No. It is the same object name, simply written together with its library,
separated by a forward slash, so that IBM i does not need to search the
library list to find it.

**"Do I always need to use qualified names?"**
No. Unqualified names, relying on the library list, are extremely common and
convenient for everyday work. Qualified names are most valuable specifically
when ambiguity matters, such as when the same object name might exist in
more than one library you can access.

**"Are IBM i object naming rules the same as file naming rules on Windows or
the IFS?"**
No. Native IBM i object naming rules, including the traditional 10-character
limit and lack of case sensitivity, are specific to library-based objects.
As you learned in the Native Objects vs Stream Files lesson, IFS file and
directory names follow a different set of rules, including possible case
sensitivity.

## Quick Recap

- Native IBM i object names traditionally follow specific rules: a
  10-character limit, a required starting letter, and no case sensitivity.
- An unqualified name relies on the library list to be found; a qualified
  name, such as `MYAPPSRC/CUSTINQ`, explicitly states the library and
  removes that dependency.
- Qualified names are especially useful when the same object name exists in
  more than one library, removing any ambiguity about which one you mean.
- Native object naming rules are distinct from IFS naming rules, which you
  learned about in the Native Objects vs Stream Files lesson.

## Try Asking the AI Tutor

Use the AI Tutor to ask follow-up questions about this lesson. For example,
try asking:

- "What happens if I use a qualified name for a library that doesn't
  exist?"
- "Are there any exceptions to the traditional 10-character object naming
  limit?"
