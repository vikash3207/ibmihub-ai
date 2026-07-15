# Authorization Lists on IBM i

## Learning Objective

By the end of this lesson, you will be able to explain what an
authorization list is and why it simplifies managing authority across
many objects.

## Simple Explanation

Granting authority object by object, the way earlier lessons in this
batch have shown, becomes repetitive once many objects need the exact
same set of users and authorities. An **authorization list** solves
this: it is a named list of users and their authorities, which can be
attached to many objects at once, so managing the list manages
authority for every object attached to it.

```clle
CRTAUTL AUTL(ORDERAUTL)

ADDAUTLE AUTL(ORDERAUTL) USER(ORDERGRP) AUT(*CHANGE)

GRTOBJAUT OBJ(MYLIB/CUSTMAST) OBJTYPE(*FILE) AUTL(ORDERAUTL)
GRTOBJAUT OBJ(MYLIB/ORDERS) OBJTYPE(*FILE) AUTL(ORDERAUTL)
```

Here, `ORDERAUTL` is created once, `ORDERGRP` is added to it with
`*CHANGE` authority, and both `CUSTMAST` and `ORDERS` are attached to
the list. Adding a new object to the list later, or changing who is on
it, updates authority for every attached object at once.

## Why It Matters

Without an authorization list, adding a new object to an existing
system, or updating who should have access, means repeating the same
`GRTOBJAUT` commands for every affected object individually, which is
easy to get inconsistent as the number of objects grows. An
authorization list turns "update authority for these twenty related
files" into "update this one list."

## Practical Example

Recall the `ORDERAUTL` example above. If a new file, `ORDER_LOG`, is
later added to the order-processing system, attaching it to
`ORDERAUTL` immediately gives it the same authority already defined for
`ORDERGRP`, without needing a separate `GRTOBJAUT` command specifying
that group and authority level again. If a new team member later joins
`ORDERGRP`, covered in the User Profiles and Group Profiles lesson
earlier in this batch, they automatically gain the same access to every
object attached to `ORDERAUTL`.

This is a simplified, illustrative example rather than a specific real
system, but it reflects exactly why authorization lists are used in
practice.

## Common Confusions

**"Is an authorization list the same thing as a group profile?"**
No, though they are often used together. A group profile is about
which users share the same authority. An authorization list is about
which objects share the same authority settings. Combining them, as in
the example above, is a common and effective pattern.

**"Does attaching an object to an authorization list remove any
authority already granted directly to that object?"**
Not automatically; both can coexist. In practice, though, shops that
adopt authorization lists generally prefer managing authority through
the list consistently, rather than mixing list-based and
directly-granted authority on the same object.

**"Do all objects in an authorization list need to be genuinely
related?"**
They should be, in the sense that they need the same set of users and
authorities. An authorization list is most useful when a group of
objects genuinely share the same access requirements, not as a
catch-all for unrelated objects.

## Quick Recap

- An authorization list is a named list of users and their authorities
  that can be attached to many objects at once.
- Updating the list updates authority for every object attached to it,
  rather than needing to update each object individually.
- Authorization lists and group profiles solve related but distinct
  problems, and are commonly used together.
- Authorization lists work best when the attached objects genuinely
  share the same access requirements.

## Try Asking the AI Tutor

Use the AI Tutor to ask follow-up questions about this lesson. For
example, try asking:

- "Can you help me decide whether a specific set of files I have in
  mind would be a good candidate for a shared authorization list?"
- "How would I find out which authorization list, if any, a specific
  object is currently attached to?"
