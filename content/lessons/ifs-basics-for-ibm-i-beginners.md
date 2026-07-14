# IFS Basics for IBM i Beginners

## Learning Objective

By the end of this lesson, you will understand what the Integrated File
System (IFS) is, how its directory structure differs from the library-based
storage you have already learned about, and when IBM i developers typically
use it.

## Simple Explanation

So far, you have learned about IBM i storage in terms of libraries and
objects: libraries hold objects, objects have a type, and everything is
found using a library list. That model, sometimes called "native" IBM i
storage, is one major way IBM i organizes data. The **Integrated File
System**, usually called the **IFS**, is the other major way.

The IFS organizes storage as a hierarchy of directories and files, similar in
concept to file systems you may already be familiar with on Windows, macOS,
or Linux. Instead of a library containing objects with types like `*FILE` or
`*PGM`, the IFS has directories that contain files and other directories,
addressed using paths such as `/home/myuser/notes.txt`.

Importantly, the IFS is not a separate system running alongside IBM i. It is
part of the same IBM i storage, accessible from the same signed-on session,
and, as you learned in the ACS overview lesson, browsable directly using
IBM i Access Client Solutions' IFS tool. IBM i developers move between the
library-based world and the IFS regularly, depending on what a given task
requires.

## Why It Matters

Beginners sometimes assume IBM i only works the "library and object" way,
which can be confusing when they encounter file paths, configuration files,
or integration-related content that clearly uses IFS-style directory
structures instead. Recognizing that IBM i supports both models side by
side, rather than one replacing the other, helps you correctly interpret
what you are looking at and avoid assuming every IBM i storage location
works identically.

## Practical Example

Imagine a developer working on an integration project that needs to read a
configuration file provided by another system. That configuration file
arrives as a plain text file placed into an IFS directory, such as
`/home/integrations/config/settings.json`, rather than as a traditional
IBM i object stored in a library.

The developer uses the IFS tool inside IBM i Access Client Solutions to
browse to that directory, view the file's contents, and confirm it is
correctly formatted, all without that file ever being a `*FILE` object
inside a library. This is a simplified, illustrative example rather than a
specific real integration, but it reflects a genuinely common, everyday use
of the IFS on IBM i.

## Common Confusions

**"Is the IFS a completely separate system from the rest of IBM i?"**
No. The IFS is part of IBM i's overall storage; it is a different
organizational model, directories and files instead of libraries and
objects, not a separate machine or product.

**"Do I need to choose between using libraries and objects, or using the
IFS?"**
No. IBM i developers commonly use both, depending on the task. Traditional
business applications and their objects often live in libraries, while
things like configuration files, certain integration data, and some modern
tooling commonly use the IFS.

**"Are IFS paths case-sensitive the way IBM i object names are not?"**
Yes, generally. Unlike object names in libraries, which are not
case-sensitive, IFS directory and file names can be case-sensitive,
similar to file systems on Linux. This is an important practical difference
to keep in mind when working with IFS paths.

## Quick Recap

- The Integrated File System (IFS) is IBM i's directory-and-file storage
  model, organized as a hierarchy addressed using paths, alongside the
  library-and-object model you already know.
- The IFS is part of the same IBM i storage, not a separate system, and is
  commonly browsed using tools like the IFS tool in IBM i Access Client
  Solutions.
- IBM i developers commonly use both the library-and-object model and the
  IFS, choosing whichever fits a given task.
- IFS paths can be case-sensitive, unlike IBM i object names in libraries.

## Try Asking the AI Tutor

Use the AI Tutor to ask follow-up questions about this lesson. For example,
try asking:

- "What are some common uses of the IFS on IBM i besides configuration
  files?"
- "How do I navigate to a specific IFS directory using ACS?"
