# Public Authority and Private Authority in Depth

## Learning Objective

By the end of this lesson, you will be able to explain the difference
between public authority and private authority, and why setting public
authority deliberately matters.

## Simple Explanation

**Public authority** is the authority every user on the system has to
an object by default, unless they have been granted something more
specific. **Private authority** is authority granted specifically to
one user or group profile, on top of, or instead of, whatever the
public authority already provides.

```clle
CRTPF FILE(MYLIB/CUSTMAST) SRCFILE(MYLIB/QDDSSRC) AUT(*EXCLUDE)

GRTOBJAUT OBJ(MYLIB/CUSTMAST) OBJTYPE(*FILE) USER(ORDERGRP) AUT(*CHANGE)
```

Here, `CUSTMAST` is created with `*EXCLUDE` public authority, meaning
no one has access by default, and then `ORDERGRP` is granted `*CHANGE`
as a private authority on top of that. Only members of `ORDERGRP`, not
every user on the system, can actually access this file.

## Why It Matters

Public authority is what a new user, or an unexpected caller, actually
gets by default before any specific authority has been granted. A
system where sensitive objects default to generous public authority is
one where every new user profile accidentally starts out with more
access than intended. Setting public authority deliberately, often to
something restrictive, and then granting private authority only where
it is genuinely needed, is a foundational security habit.

## Practical Example

Recall `CUSTMAST` from earlier in this batch. If it were instead
created with a generous public authority like `*CHANGE`, every user
profile on the system, including ones with no real reason to touch
customer data, would be able to read and modify it by default. Setting
public authority to `*EXCLUDE` and granting `*CHANGE` only to
`ORDERGRP` means access is deliberately scoped to the people who
actually need it, rather than open to everyone by default.

This is a simplified, illustrative example rather than a specific real
system, but it reflects a genuinely important security default to get
right.

## Common Confusions

**"If I grant a user private authority, does their public authority
still apply?"**
A user's effective authority is generally the more generous of the two,
private authority they were granted directly, or through a group
profile, and whatever public authority already provides. Private
authority is additive, not a replacement that ignores public authority.

**"Is *EXCLUDE public authority overly restrictive for most objects?"**
Not necessarily; it depends on the object. For genuinely sensitive
data, defaulting to `*EXCLUDE` and granting private authority
deliberately is a reasonable, safe starting point. For less sensitive,
widely-needed objects, a more permissive public authority may be a
reasonable, deliberate choice instead.

**"Does changing an object's public authority affect users who already
have private authority to it?"**
Not directly. A user's own private authority, or their group profile's
authority, stays as granted. Changing public authority only affects
what users without any specific private authority receive by default.

## Quick Recap

- Public authority is what every user gets to an object by default;
  private authority is granted specifically to a user or group profile.
- A user's effective authority is generally the more generous of their
  private authority and the object's public authority.
- Setting public authority deliberately, rather than leaving it
  generous by default, is a foundational security habit.
- Changing public authority does not remove authority already granted
  privately to specific users or groups.

## Try Asking the AI Tutor

Use the AI Tutor to ask follow-up questions about this lesson. For
example, try asking:

- "Can you give me an example of an object where a more generous public
  authority would actually be a reasonable, deliberate choice?"
- "How would I find out what an object's current public authority is
  set to?"
