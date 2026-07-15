# Common Save/Restore Mistakes

## Learning Objective

By the end of this lesson, you will be able to recognize the most
common mistakes developers make when first working with save and
restore.

## Simple Explanation

A handful of mistakes come up repeatedly once the concepts covered
across this batch are put into practice:

- **Restoring into the wrong library.** As covered in the Restoring
  Objects Safely lesson, not confirming the target library
  deliberately risks silently overwriting the wrong objects.
- **Assuming a save file exists automatically.** As covered in the Save
  Files lesson, `SAVOBJ` and `SAVLIB` need an already-created save file
  to target; they do not create one automatically.
- **Ignoring object locks during a save or restore.** As covered in
  this batch, saving or restoring a library or object other jobs are
  actively using can conflict with that work in either direction.
- **Treating a backup as a substitute for journaling.** As covered in
  the Backup vs Journaling vs HA lesson, a backup only restores to the
  point of the last save; it does not capture changes made afterward
  the way journaling does.
- **Assuming GO SAVE options are relevant to everyday development
  work.** As covered earlier in this batch, options like 21, 22, and 23
  operate at a much broader system scope than the object-level and
  library-level saves most developers actually use day to day.
- **Not checking authority before a restore.** As covered in the
  Restoring Objects Safely lesson, a restore still requires sufficient
  authority to the target, the same as any other object operation.

## Why It Matters

Every one of these mistakes shares the same thread already familiar
from the mistakes lessons covering ILE, integration, advanced SQL,
security, and journaling elsewhere in this course: something can look
routine on the surface, running a save or restore command, while a
real risk of overwriting the wrong data or misunderstanding what
protection is actually in place is quietly present underneath.
Recognizing these patterns is what keeps save and restore genuinely
useful rather than a source of accidental data loss.

## Practical Example

Imagine a developer refreshing a test library from a saved copy,
confident that a recent backup means recent changes are also protected.
If those changes were made to journaled objects after the backup was
taken, journaling, not the backup, is what would actually let them be
recovered; assuming the backup alone covers everything is exactly the
"backup as substitute for journaling" mistake covered in this batch.

This is a simplified, illustrative example rather than a specific real
incident, but it reflects a genuinely common save/restore mistake.

## Common Confusions

**"If a restore command runs without an error, does that mean it did
exactly what was intended?"**
Not necessarily. As this batch covers, a restore can succeed
technically while still targeting the wrong library, which is exactly
why confirming the target deliberately matters more than just watching
for an error message.

**"Are these mistakes only a concern for large, complex systems?"**
No. Even a single developer refreshing their own test library can run
into any of these, particularly restoring into the wrong library or
assuming a save file already exists.

**"Is there one single habit that prevents most of these mistakes?"**
Not one single fix, but the common thread is treating save and restore
as deliberate operations with real, immediate effects, confirming
targets, checking authority and locks, rather than routine commands run
on autopilot.

## Quick Recap

- Restoring into the wrong library, assuming a save file exists
  automatically, ignoring object locks, treating backup as a substitute
  for journaling, assuming GO SAVE options apply to everyday work, and
  not checking authority before a restore are the most common mistakes
  covered across this batch.
- Every one of these can let a save or restore look routine while a
  real risk of overwriting the wrong data is quietly present
  underneath.
- The underlying habit that prevents most of them is treating save and
  restore as deliberate operations with real, immediate effects, not
  routine commands run without confirmation.
- Deeper topics such as BRMS, tape and virtual tape management, and
  full system disaster recovery planning build on these fundamentals
  and are natural next steps beyond this batch's introductory scope.

## Try Asking the AI Tutor

Use the AI Tutor to ask follow-up questions about this lesson. For
example, try asking:

- "Can you give me a short scenario with one of these mistakes and ask
  me to spot it?"
- "Which of these mistakes would be hardest to notice until it actually
  caused a real problem?"
