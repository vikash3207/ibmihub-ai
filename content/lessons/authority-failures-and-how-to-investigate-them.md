# Authority Failures and How to Investigate Them

## Learning Objective

By the end of this lesson, you will be able to recognize an authority
failure in a job log and follow a practical process for investigating
it.

## Simple Explanation

The Authorities and Object Access Basics lesson covered what public and
private authority are, and that an authority failure means IBM i denied
an operation the user's authority did not permit. This lesson covers
actually investigating one.

An authority failure typically shows up as a specific error message in a
job log, covered in the Understanding Job Logs and Finding Program
Failures from Error Messages lessons, naming the object involved and
indicating an authority problem rather than the object simply being
missing or locked.

```rpgle
dcl-f CUSTMAST disk keyed;

dcl-s custNbr packed(6:0);

custNbr = 1042;

monitor;
  chain custNbr CUSTMAST;
  if %found(CUSTMAST);
    update CUSTMAST;
  endif;
on-error;
  dsply 'Unexpected error updating CUSTMAST -- check the job log';
endmon;
```

Here, an authority failure on `UPDATE` is exactly the kind of genuinely
unexpected problem the `monitor` block, covered in the Handling File I/O
Errors at a Beginner Level lesson, is meant to catch: it is not an
ordinary "not found" condition `%FOUND` already handles, but a real
error that still needs investigating through the job log afterward. From
there, a practical investigation generally means: confirming the object
actually exists and is not locked by another job, covered in the Object
Locks Basics lesson, then confirming specifically what authority the
affected user currently has to that object, and finally involving
whoever can grant the needed authority if it turns out to genuinely be
missing.

## Why It Matters

An authority failure can look similar to other problems at first
glance, an object seemingly unavailable, but the underlying cause and fix
are completely different: no amount of debugging the program's logic or
waiting out a lock will resolve a genuine authority problem. Recognizing
the specific pattern, and following a clear investigation process, avoids
wasted time chasing the wrong kind of fix.

## Practical Example

Imagine a program failing with an error while trying to update
`CUSTMAST`, and the job log's message detail specifically points to an
authority problem rather than a locking or missing-object message.
Confirming `CUSTMAST` exists and is not locked rules those out
immediately. Checking what authority the program's user profile actually
has to `CUSTMAST` confirms it lacks update authority, pointing directly
at the real fix: having someone with the right permissions grant that
authority, rather than continuing to investigate the program's own logic.

This is a simplified, illustrative example rather than a specific real
investigation, but it reflects a genuinely common, practical path from
symptom to resolved authority problem.

## Common Confusions

**"Does an authority failure message look the same as a locking or
missing-object message?"**
No, though all three can superficially feel like "something is wrong
with this object." The message detail, covered in the Finding Program
Failures from Error Messages lesson, specifically distinguishes an
authority problem from a lock or a missing object, which is exactly why
reading that detail carefully matters.

**"Can a developer typically grant themselves the authority they are
missing?"**
Not usually on their own; granting authority generally requires someone
with sufficient permissions over that specific object, which may not be
the same person experiencing the failure.

**"If the object clearly exists, does that rule out an authority
problem?"**
No. An object existing, and even being visible to you, is separate from
having authority to perform a specific operation on it, exactly as
covered in the Authorities and Object Access Basics lesson.

## Quick Recap

- An authority failure shows up as a specific message in a job log,
  distinct from a locking or missing-object message.
- Investigating one generally means: confirm the object exists and isn't
  locked, confirm the actual authority the user has, then involve someone
  who can grant authority if it is genuinely missing.
- No amount of debugging a program's logic resolves a genuine authority
  problem; the fix is granting the correct authority.
- An object existing and being visible does not mean a user has
  authority to perform a specific operation on it.

## Try Asking the AI Tutor

Use the AI Tutor to ask follow-up questions about this lesson. For
example, try asking:

- "What would the investigation steps look like if the object turned out
  to be locked instead of an authority problem?"
- "Who would typically be responsible for granting missing authority in a
  real organization?"
