# Libraries and Objects

## Learning Objective

By the end of this lesson, you will understand what an object is, what a library is,
and how libraries organize objects on IBM i.

## Simple Explanation

On IBM i, almost everything the system manages is treated as an object: programs,
files, commands, job descriptions, and many other kinds of system resources are all
objects. Each object has a name and a type, and IBM i keeps track of it accordingly.

A library is a container used to organize objects. For the library-based objects you
will use in these lessons, each object lives in one library at a time. You can think
of a library as a named collection that groups related objects together, similar in
spirit to how you might group related items in real life, though it does not work
exactly like a folder on a personal computer (more on that below).

When you refer to an object without saying which library it is in, IBM i searches a
list of libraries, called the library list, in a defined order until it finds a
match. This matters conceptually because the same object name can exist in more than
one library, and the library list determines which one is actually used. The details
of configuring a library list are beyond this lesson; what matters here is knowing
that this search order exists and affects which object you get.

## Why It Matters

Understanding objects and libraries matters because nearly everything you do on
IBM i involves referring to something by name, and often that something lives in a
specific library. This concept underlies how the system stays organized, how
different versions of the same object can coexist safely, and how you will read and
talk about IBM i systems going forward.

## Practical Example

Imagine a company keeps the live, in-use version of an order-processing program in a
library dedicated to production work. At the same time, a developer is working on an
improved version of that same program, with the same name, kept in a separate library
used for development.

Because the two libraries are separate, both versions of the program can exist at the
same time without conflict. Which one actually runs depends on which library is used
or searched first. This is a simplified, illustrative example rather than a real
system, but it reflects a common real-world pattern for keeping production and
in-progress work separate.

## Common Confusions

**"Is an IBM i library the same as a folder on my computer?"**
No. A folder on a personal computer can contain other folders, forming a nested tree.
An IBM i library does not work that way; it is a flat container for objects, not a
folder that can hold sub-folders. Finding an object also works differently: instead
of following a folder path, IBM i can search a library list in a defined order.

**"Is an IBM i library the same as a library in a programming language, like a
Python package?"**
No. A programming language library typically gives you reusable code you can import
into your own program. An IBM i library does not work like that. It is simply an
organizational container that can hold many different kinds of objects, such as
programs and files, not a source of reusable code to import.

**"What are QGPL, QTEMP, and production libraries?"**
These are simply examples of library names you may encounter. QGPL is a
general-purpose library supplied by IBM. QTEMP is a temporary library that exists
only for the duration of your current session. Production and application libraries
are libraries an organization creates to hold its own live business objects. At this
level, it is enough to recognize these as examples of libraries with different
purposes, rather than needing to know how each one is configured.

## Quick Recap

- An object on IBM i is a named, typed item managed by the system, such as a program,
  file, command, or job description.
- A library is a container that organizes objects; every object lives in exactly one
  library.
- The library list is the order IBM i searches through libraries to find an object
  when you do not specify which library to use.
- An IBM i library is not the same as a folder (no nested sub-folders) and not the
  same as a programming language library (no reusable code to import).
- QGPL, QTEMP, and production/application libraries are simply examples of libraries
  with different purposes.

## Try Asking the AI Tutor

Use the AI Tutor to ask follow-up questions about this lesson. For example, try
asking:

- "What's the difference between an IBM i library and a folder on my computer?"
