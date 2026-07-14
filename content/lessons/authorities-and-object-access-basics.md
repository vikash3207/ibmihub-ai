# Authorities and Object Access Basics

## Learning Objective

By the end of this lesson, you will be able to explain what an
authority is at a basic level, distinguish public and private authority,
and recognize why an authority failure happens.

## Simple Explanation

Every IBM i object, covered in the Common IBM i Object Types lesson, has
**authorities** controlling who can do what with it: reading it, changing
it, or running it, among other specific operations. Two broad categories
matter most at a beginner level:

- **Public authority** applies to every user who does not have their own
  specific authority set for that object; it is the default level of
  access anyone gets automatically.
- **Private authority** is granted specifically to one user or group,
  separate from whatever public authority already applies, letting
  someone have more, or sometimes deliberately less, access than the
  public default.

When a user attempts something an object's authorities do not allow,
such as trying to change an object they only have read access to, IBM i
denies the operation and reports an authority failure, rather than
silently allowing or ignoring it.

## Why It Matters

Understanding authorities at this basic level explains a common, real
category of problem: a program or user being denied access to an object
that clearly exists, which is not a bug in the object itself, but a
deliberate access control decision. Recognizing this distinction saves
time that might otherwise be spent debugging the wrong thing entirely.

## Practical Example

Imagine a developer's program failing with an authority-related error
while trying to update `CUSTMAST`. The file itself exists and is not
locked or missing; instead, the user profile the program is running
under simply does not have update authority to `CUSTMAST`, whether
through public authority or any private authority specifically granted
to that user. Recognizing this as an authority problem, rather than
assuming the file is broken or missing, points directly at the actual
fix: granting the appropriate authority, rather than investigating the
file or program further.

This is a simplified, illustrative example rather than a specific real
investigation, but it reflects a genuinely common category of everyday
IBM i problem.

## Common Confusions

**"If an object exists and I can see it, do I automatically have full
access to it?"**
No. Being able to see that an object exists is separate from having
authority to read, change, or otherwise use it. Authorities control what
you can actually do with an object, independent of simply knowing it is
there.

**"Does private authority always mean more access than public
authority?"**
Not necessarily always more; private authority is simply specific to one
user or group, which could grant more access, less access, or different
specific access than whatever the object's public authority already
provides.

**"Is an authority failure the same kind of problem as an object
lock?"**
No. An object lock, covered in the previous lesson, is about another job
currently using an object in a way that blocks certain access
temporarily. An authority failure is about whether a specific user is
permitted to perform a specific operation on an object at all, regardless
of whether anyone else is using it.

## Quick Recap

- Authorities control what specific operations, such as reading or
  changing, a user is permitted to perform on an object.
- Public authority is the default access level applied to users without
  their own specific authority; private authority is granted specifically
  to one user or group.
- An authority failure means IBM i denied an operation because the
  user's authority does not permit it, not that the object itself is
  broken or missing.
- Authority problems and object lock problems are different categories,
  covered separately in this lesson group.

## Try Asking the AI Tutor

Use the AI Tutor to ask follow-up questions about this lesson. For
example, try asking:

- "How would a developer typically find out what authority they
  currently have to a specific object?"
- "Why would a company deliberately set an object's public authority
  lower than what most users actually need?"
