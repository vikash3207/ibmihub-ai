# Investigating Authority Failures in Depth

## Learning Objective

By the end of this lesson, you will be able to work through a more
complete authority-failure investigation, accounting for group
profiles, authorization lists, and adopted authority, beyond the basic
process already covered in this course.

## Simple Explanation

The Authority Failures and How to Investigate Them lesson earlier in
this course covered the basic process: recognize an authority-related
message ID in the job log, then check the object's authority. Now that
this batch has covered group profiles, authorization lists, and
adopted authority, a real investigation often needs to check several
possible sources of authority, not just the user's own direct grant:

1. **The user's own direct authority** to the object.
2. **Any group profile's authority**, covered earlier in this batch,
   which the user inherits automatically.
3. **An authorization list's authority**, covered earlier in this
   batch, if the object is attached to one.
4. **Adopted authority**, covered earlier in this batch, if the failure
   happened inside a program that adopts its owner's authority, in
   which case the owner's authority matters, not just the calling
   user's.

## Why It Matters

Checking only the user's own direct authority, and stopping there if it
looks insufficient, can lead to a wrong conclusion: the user might
actually have enough authority through a group profile or an
authorization list that was not checked, or the real problem might be
in the owning user profile of an adopting program, not the calling
user at all. A complete investigation checks all of the genuinely
relevant sources before concluding what is actually missing.

## Practical Example

Imagine a user reports an authority failure trying to run `CUSTINQR`,
covered earlier in this batch as a program that adopts its owner's
authority to access `CUSTMAST`. Checking only the calling user's direct
authority to `CUSTMAST` might show nothing at all, since the design
intentionally relies on adopted authority instead. The real
investigation needs to check whether the user has authority to run
`CUSTINQR` itself, and separately, whether `CUSTINQR`'s owning user
profile still has the authority to `CUSTMAST` that the design depends
on, which might have been the piece that actually changed.

This is a simplified, illustrative example rather than a specific real
incident, but it reflects a genuinely common, more complete
investigation.

## Common Confusions

**"If a user's direct authority looks fine, does that rule out an
authority problem?"**
No. The user's effective authority also depends on any group profile
they belong to and any authorization list the object is attached to,
both covered earlier in this batch. A direct grant looking sufficient
does not account for those other sources changing.

**"If a program adopts authority, whose authority actually matters when
it fails?"**
For the parts of its logic where adopted authority applies, the
owning user profile's authority is what matters, not the calling
user's own authority. This is exactly why the adopted-authority case
needs its own specific check, separate from checking the calling user.

**"Is this the same investigation process as the basic one covered
earlier in this course, just repeated?"**
It builds on the same starting point, recognizing an authority-related
message ID in the job log, but goes further by checking group
profiles, authorization lists, and adopted authority as additional,
genuinely relevant sources, rather than stopping at the user's own
direct authority.

## Quick Recap

- A complete authority-failure investigation checks the user's direct
  authority, any group profile's authority, any authorization list's
  authority, and, if relevant, adopted authority.
- Stopping at the user's own direct authority can lead to a wrong
  conclusion if a group profile, authorization list, or adopted
  authority is actually the relevant factor.
- When a failure happens inside a program that adopts authority, the
  owning user profile's authority matters for that program's own
  operations, not just the calling user's.
- This builds directly on the basic authority-failure investigation
  process already covered earlier in this course.

## Try Asking the AI Tutor

Use the AI Tutor to ask follow-up questions about this lesson. For
example, try asking:

- "Can you walk me through a short authority-failure scenario and ask
  me to identify which of the four sources is actually the problem?"
- "Why would checking a program's owning user profile matter for an
  authority failure the calling user reported?"
