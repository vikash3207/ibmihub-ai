# Authority Collection Overview

## Learning Objective

By the end of this lesson, you will be able to explain what Authority
Collection is and why it helps answer "what authority does this
program actually need?" more reliably than guessing.

## Simple Explanation

The Investigating Authority Failures lesson earlier in this batch
covered reacting to an authority failure after it happens. **Authority
Collection** works the other way around: it observes a user or program
running normally, and records exactly which authority checks actually
occurred, and whether each one succeeded, building a real, evidence-based
picture of what authority is genuinely being used.

```clle
CHGAUTCOL OBJ(*USRPRF) USRPRF(JSMITH) AUTCOL(*START)
```

A command like this starts authority collection for a specific user
profile, so that as `JSMITH` runs their normal work, the system quietly
records what authority checks are actually happening.

## Why It Matters

Figuring out exactly what authority a user or program needs by reading
code or guessing is error-prone and easy to get wrong, either granting
too little, causing the authority failures covered earlier in this
batch, or too much, the kind of over-broad `*ALLOBJ` shortcut already
warned against in the Special Authorities lesson. Authority Collection
replaces guessing with an actual, observed record of what authority
checks really occur, making it possible to grant precisely what is
needed.

## Practical Example

Imagine a shop wants to tighten a user's overly broad authority down to
exactly what they need, without breaking anything they currently rely
on. Rather than guessing which specific object authorities to remove,
running Authority Collection while that user performs their normal
work for a representative period reveals exactly which objects were
actually accessed and what authority level each access required,
turning "we think this is safe to remove" into "we observed this is
genuinely still needed."

This is a simplified, illustrative example rather than a specific real
project, but it reflects exactly why Authority Collection exists.

## Common Confusions

**"Is Authority Collection the same thing as reviewing QAUDJRN, covered
earlier in this batch?"**
No, though both provide evidence rather than guesswork. `QAUDJRN`
records security-relevant events broadly across the system. Authority
Collection is specifically focused on recording the authority checks a
particular user or program actually triggers, which is more targeted
for the "what authority does this actually need" question.

**"Does Authority Collection prevent authority failures while it is
running?"**
No. It observes and records what happens; it does not change how
authority is enforced while collection is active. A user still
experiences authority failures normally if their authority is
genuinely insufficient during the collection period.

**"Is Authority Collection something a developer runs routinely on
every system?"**
Not routinely. It is most useful for specific situations, such as
narrowing down overly broad authority, or investigating exactly what a
particular program needs, rather than something left running
continuously as a normal practice.

## Quick Recap

- Authority Collection observes a user or program running normally and
  records exactly which authority checks actually occur.
- It replaces guesswork with real, evidence-based data about what
  authority is genuinely being used.
- It is especially useful for narrowing overly broad authority down to
  exactly what is needed, without guessing.
- It is distinct from `QAUDJRN`, which records security events broadly
  rather than focusing on one user's or program's actual authority
  usage.

## Try Asking the AI Tutor

Use the AI Tutor to ask follow-up questions about this lesson. For
example, try asking:

- "Can you walk me through how Authority Collection results might be
  used to safely remove an overly broad authority grant?"
- "Why is observing actual authority usage more reliable than reading
  through a program's source code to guess what it needs?"
