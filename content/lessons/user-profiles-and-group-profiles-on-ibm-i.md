# User Profiles and Group Profiles on IBM i

## Learning Objective

By the end of this lesson, you will be able to explain what a user
profile and a group profile are, and why group profiles make managing
authority for many users practical.

## Simple Explanation

The Signing On lesson earlier in this course introduced a **user
profile** as what a person signs on with: an object that represents an
individual's identity on the system, carrying their password, their
current library, and other personal settings. Beyond identity, a user
profile is also the thing that authority, covered throughout this
batch, actually gets granted to.

A **group profile** is a special kind of user profile that other user
profiles can belong to, so authority can be granted once to the group
instead of repeating it for every individual user:

```clle
CRTUSRPRF USRPRF(ORDERGRP) STATUS(*DISABLED) PASSWORD(*NONE)

CRTUSRPRF USRPRF(JSMITH) PASSWORD(*NONE) GRPPRF(ORDERGRP)
CRTUSRPRF USRPRF(MPEREZ) PASSWORD(*NONE) GRPPRF(ORDERGRP)
```

Here, `ORDERGRP` is a group profile, disabled so no one signs on with
it directly, and `JSMITH` and `MPEREZ` both belong to it. Any authority
granted to `ORDERGRP` is available to both of them.

## Why It Matters

Granting authority to every individual user, one at a time, becomes
unmanageable as a team grows, and easy to get inconsistent: one
developer ends up with access another equally-trusted teammate does
not have, for no real reason. Group profiles let authority be managed
at the group level instead, so adding a new team member is as simple as
adding them to the right group, rather than re-granting a long list of
individual authorities.

## Practical Example

Imagine an order-processing team of five developers, all of whom need
the same authority to a set of order-related libraries and files.
Granting that authority to each of the five user profiles individually
means five separate places to keep in sync, and a real risk of drifting
out of sync as people join or leave the team. Granting that authority
once to `ORDERGRP`, and making all five user profiles members of it,
means the authority only needs to be managed in one place.

This is a simplified, illustrative example rather than a specific real
team, but it reflects exactly why group profiles exist.

## Common Confusions

**"Can someone sign on directly with a group profile?"**
Technically only if it is set up to allow that, but the common,
recommended pattern is to disable the group profile itself, as in the
example above, so it exists purely to hold shared authority, not to be
signed on with directly.

**"If I belong to a group profile, do I automatically get every
authority that group has?"**
Yes. Authority granted to a group profile applies to every user profile
that belongs to it, in addition to whatever authority the individual
user profile itself has been granted directly.

**"Is a group profile the same thing as an authorization list, covered
later in this batch?"**
No, though they solve related problems. A group profile is about
managing which users share the same authority. An authorization list,
covered in a later lesson in this batch, is about managing authority
for multiple objects at once. The two are often used together.

## Quick Recap

- A user profile represents an individual's identity on IBM i, and is
  what authority is ultimately granted to.
- A group profile is a special user profile that other user profiles
  can belong to, letting authority be managed once for the whole group.
- Group profiles make it practical to keep a team's authority
  consistent as people join or leave.
- A group profile is commonly disabled for direct sign-on, existing
  purely to hold shared authority.

## Try Asking the AI Tutor

Use the AI Tutor to ask follow-up questions about this lesson. For
example, try asking:

- "Can you walk me through how I'd figure out which group profile a
  specific user belongs to?"
- "Why might a shop choose to disable a group profile from ever signing
  on directly?"
