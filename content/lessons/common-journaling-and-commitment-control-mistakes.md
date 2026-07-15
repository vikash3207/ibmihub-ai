# Common Journaling and Commitment Control Mistakes

## Learning Objective

By the end of this lesson, you will be able to recognize the most
common mistakes developers make when first working with journaling and
commitment control.

## Simple Explanation

A handful of mistakes come up repeatedly once the concepts covered
across this batch are put into practice:

- **Forgetting that journaling only covers changes going forward.** As
  covered in the Starting Journaling lesson, `STRJRNPF` does not
  retroactively create entries for changes that already happened.
- **Letting a journal receiver grow indefinitely.** As covered in the
  Journal Receivers lesson, receivers need periodic attention; ignoring
  them risks unmanaged, ever-growing storage use.
- **Forgetting to COMMIT or ROLLBACK.** As covered in the STRCMTCTL
  lesson, a program must explicitly decide between the two once it
  knows whether a transaction's steps succeeded; leaving this unhandled
  defeats the purpose of commitment control.
- **Assuming commitment control works without journaling.** As covered
  in the Commitment Control Overview lesson, commitment control depends
  on the tables involved actually being journaled.
- **Confusing table-level journal entries with QAUDJRN.** As covered in
  the Journaling for Recovery and Auditing lesson, these are
  complementary but distinct records, serving different questions.
- **Assuming file locking alone provides the same protection as
  commitment control.** Locking, covered earlier in this course,
  prevents simultaneous conflicting access to a record; it does not, by
  itself, let a multi-step transaction be undone as a whole the way
  commitment control does.

## Why It Matters

Every one of these mistakes shares the same thread already familiar
from the mistakes lessons covering ILE, integration, advanced SQL, and
security work elsewhere in this course: something can look correct on
the surface, a program runs, data changes, while a real gap in
protection or a growing operational problem is quietly present
underneath. Recognizing these patterns is what keeps journaling and
commitment control genuinely reliable rather than a false sense of
safety.

## Practical Example

Imagine a developer adds commitment control to a multi-step order
process, but the underlying tables were never actually journaled.
Assuming commitment control now protects the transaction the way
covered in this batch, they are surprised when a rollback does not work
as expected, since the journaling foundation the whole mechanism
depends on was never in place. Confirming that the relevant tables are
journaled, covered earlier in this batch, before relying on commitment
control would have avoided this entirely.

This is a simplified, illustrative example rather than a specific real
incident, but it reflects a genuinely common journaling and commitment
control mistake.

## Common Confusions

**"If commitment control looks like it is set up correctly, is that
enough to trust it?"**
Not on its own. As this lesson covers, commitment control also depends
on the underlying tables actually being journaled; a setup that looks
right but is missing that foundation will not behave as expected.

**"Are these mistakes only a concern for large, complex batch
systems?"**
No. Even a small program updating two related tables can run into any
of these, particularly forgetting to explicitly COMMIT or ROLLBACK, or
assuming record locking alone is equivalent to commitment control.

**"Is there one single habit that prevents most of these mistakes?"**
Not one single fix, but the common thread is treating journaling and
commitment control as a connected set of deliberately configured
pieces, journal, receiver, journaled table, and commitment scope,
rather than assuming any one piece automatically implies the others are
in place.

## Quick Recap

- Forgetting that journaling only covers changes going forward,
  letting journal receivers grow unmanaged, forgetting to COMMIT or
  ROLLBACK, assuming commitment control works without journaling,
  confusing table journal entries with QAUDJRN, and assuming locking
  alone equals commitment control are the most common mistakes covered
  across this batch.
- Every one of these can let a system look correct on the surface while
  a real gap or growing problem is quietly present underneath.
- Journaling and commitment control are a connected set of pieces;
  assuming one implies the others are correctly in place is the
  underlying pattern behind most of these mistakes.
- Remote journaling, high-availability replication, and deep
  performance-impact analysis build on these fundamentals and are
  natural next steps beyond this batch's introductory scope.

## Try Asking the AI Tutor

Use the AI Tutor to ask follow-up questions about this lesson. For
example, try asking:

- "Can you give me a short scenario with one of these mistakes and ask
  me to spot it?"
- "Which of these mistakes would be hardest to notice until a real
  failure or audit actually happens?"
