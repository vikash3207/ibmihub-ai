# Special Authorities Explained

## Learning Objective

By the end of this lesson, you will be able to explain what a special
authority is and why granting one, especially `*ALLOBJ`, deserves
caution.

## Simple Explanation

Every authority covered so far in this batch has been about a specific
object or a list of objects. A **special authority** is different: it
is a system-wide capability granted to a user profile directly,
independent of any specific object. A few of the most common special
authorities are:

- **`*ALLOBJ`**: authority to essentially every object on the system,
  regardless of that object's own public or private authority settings.
- **`*SECADM`**: authority to administer security itself, such as
  creating user profiles and granting authority to others.
- **`*SAVSYS`**: authority to save and restore objects system-wide,
  regardless of the requester's own authority to each individual
  object.

```clle
CHGUSRPRF USRPRF(JSMITH) SPCAUT(*ALLOBJ)
```

## Why It Matters

A special authority like `*ALLOBJ` bypasses the careful, deliberate
object-by-object and authorization-list-based authority already
covered in this batch entirely. Granting it means the user can access
essentially everything, regardless of how carefully public and private
authority have been set up elsewhere. This is exactly why special
authorities, `*ALLOBJ` most of all, should be granted narrowly and
deliberately, not as a convenient way to avoid figuring out the
specific authority a user actually needs.

## Practical Example

Imagine a developer who occasionally hits an authority failure while
testing a new report against several files. Granting that developer
`*ALLOBJ` would make every authority failure disappear immediately,
but it would also grant them access to every other object on the
system, including ones completely unrelated to their work, such as
payroll or other genuinely sensitive data. Figuring out the specific
object authority the developer actually needs, using the object
authority concepts covered earlier in this batch, is the deliberate,
narrower alternative to reaching for `*ALLOBJ` as a shortcut.

This is a simplified, illustrative example rather than a specific real
incident, but it reflects a genuinely common temptation worth resisting.

## Common Confusions

**"Is *ALLOBJ a normal authority to grant a working developer?"**
It can be tempting, since it makes authority failures disappear, but it
is a broad, system-wide capability that bypasses object-level authority
entirely. Most working developers do not need it for their day-to-day
tasks, and granting it narrows the whole system's security to "trust
this user profile completely."

**"Are all special authorities as broad as *ALLOBJ?"**
No. `*SECADM` and `*SAVSYS`, for example, are narrower in scope,
security administration and save/restore specifically, though each is
still a meaningful system-wide capability that deserves the same
deliberate, narrow granting as `*ALLOBJ`.

**"If granting *ALLOBJ solves an authority problem quickly, is that
proof it was the right fix?"**
No. Solving an authority failure quickly by granting broad access is
different from solving it correctly, by granting the specific authority
actually needed. The Security Best Practices lesson later in this
batch covers this distinction in more depth.

## Quick Recap

- A special authority is a system-wide capability granted directly to
  a user profile, independent of any specific object's authority.
- `*ALLOBJ` grants authority to essentially every object on the
  system, bypassing object-level public and private authority.
- Special authorities should be granted narrowly and deliberately, not
  as a shortcut around figuring out the specific authority actually
  needed.
- Quickly resolving an authority failure by granting broad access is
  not the same as resolving it correctly.

## Try Asking the AI Tutor

Use the AI Tutor to ask follow-up questions about this lesson. For
example, try asking:

- "What questions should I ask before granting a user profile a
  special authority like *ALLOBJ or *SECADM?"
- "Why might a shop want to track which user profiles currently have
  *ALLOBJ, even if each grant seemed reasonable at the time?"
