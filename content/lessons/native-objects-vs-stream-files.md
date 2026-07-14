# Native Objects vs Stream Files

## Learning Objective

By the end of this lesson, you will be able to explain the key differences
between a native IBM i object and an IFS stream file, and recognize which
model a given piece of content is likely stored under.

## Simple Explanation

You now know about two different ways IBM i stores things: native objects,
which live in libraries and have a specific object type such as `*FILE` or
`*PGM`, as covered in the Common IBM i Object Types lesson; and the
Integrated File System, or IFS, which organizes content as directories and
files, as covered in the IFS Basics lesson. A **stream file** is simply the
IFS term for an individual file stored within that directory structure, in
the same way an "object" is the general term for something stored in a
library.

Native objects and stream files differ in a few practical ways:

- **Location and addressing.** A native object is found by its name inside a
  library, often via the library list. A stream file is found by its full
  path within the IFS directory hierarchy.
- **Typing.** Every native object has a specific, fixed object type, as you
  learned earlier. Stream files do not have an IBM i object type in that
  same sense; instead, their "type" is usually inferred from context, such as
  a file extension or its contents, similar to files on Windows or Linux.
- **Case sensitivity.** Native object names are not case-sensitive. Stream
  file and directory names in the IFS can be case-sensitive, as you learned
  in the IFS Basics lesson.

Despite these differences, both models coexist on the same IBM i system, and
IBM i provides ways to move content between them when needed, such as
copying a native object's contents into a stream file or vice versa.

## Why It Matters

Recognizing whether something is a native object or a stream file helps you
choose the right tools and commands to work with it, and helps you
understand documentation or error messages that assume one model or the
other. Using a library-oriented command like `WRKOBJ` on IFS content, or
expecting a stream file's case to be ignored the way a native object's name
is, are the kinds of small but common mix-ups that this distinction helps you
avoid.

## Practical Example

Imagine a developer who needs to check two different things: a `*PGM`
object named `CUSTINQ` in library `MYAPPSRC`, and a configuration file
located at `/home/integrations/config/settings.json` in the IFS. To look at
the program object, they use library-oriented commands and tools, referring
to it by name within its library. To look at the configuration file, they
use IFS-oriented tools instead, referring to it by its full directory path,
and are careful to type its name with the exact same letter casing it was
created with.

Treating both the same way, for example assuming the configuration file's
name is not case-sensitive, would likely cause it not to be found. This is a
simplified, illustrative example rather than a specific real system, but it
reflects a genuinely common distinction developers navigate on IBM i.

## Common Confusions

**"Can a stream file be a program that runs, the way a `*PGM` object can?"**
Not in the same sense. Runnable IBM i programs are native `*PGM` objects.
Stream files in the IFS serve other purposes, such as holding configuration,
text, or integration data, though some IFS content can be involved in
running certain kinds of applications in ways beyond the scope of this
lesson.

**"If I copy a native object's data into a stream file, does it become a
stream file permanently?"**
The copy itself becomes a stream file, existing separately in the IFS. The
original native object is unaffected and continues to exist as a native
object in its library, unless it is deliberately deleted.

**"Is one of these models newer or better than the other?"**
Neither replaces the other. They serve different purposes and are both
actively used on IBM i today, often side by side within the same
organization, sometimes within the same application.

## Quick Recap

- Native objects live in libraries, have a fixed object type, and are not
  case-sensitive by name; stream files live in the IFS, are addressed by
  path, and can be case-sensitive.
- Both models coexist on the same IBM i system, and content can be moved
  between them when needed.
- Choosing the right tools and commands depends on recognizing which model a
  given piece of content actually uses.
- Neither native objects nor the IFS is a replacement for the other; both
  remain actively used today.

## Try Asking the AI Tutor

Use the AI Tutor to ask follow-up questions about this lesson. For example,
try asking:

- "What commands are commonly used to copy data between a native object and
  a stream file?"
- "Why do some IBM i applications use stream files instead of native
  objects?"
