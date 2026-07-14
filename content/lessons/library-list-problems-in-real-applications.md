# Library List Problems in Real Applications

## Learning Objective

By the end of this lesson, you will be able to recognize and diagnose the
two most common practical library list problems: an object appearing
missing, and an unexpected version of an object being found.

## Simple Explanation

The Library List Explained in Depth and Library List in Real Job
Execution lessons covered how a library list is structured and how it can
change during a job. This lesson focuses specifically on diagnosing
problems that trace back to it.

Two practical symptom patterns show up especially often:

- **"Object not found," when the object clearly exists somewhere.** This
  generally means the library actually containing that object simply
  is not part of the job's current library list at all.
- **"Wrong version found," when more than one library has an object with
  the same name.** This generally means the library list does contain the
  right library, but a different library appears earlier in the search
  order, covered in the Library List Explained in Depth lesson, so IBM i
  finds that other version first.

`DSPLIBL`, covered in the Library List Explained in Depth lesson, and
`DSPJOB`'s library list option, covered in the DSPJOB and Job Information
Basics lesson, are the practical tools for checking exactly what a
specific job's library list actually contains, and in what order.

## Why It Matters

These two symptoms look similar on the surface, something is not
working the way it should with an object, but point to different,
specific causes: a genuinely missing library entry versus a search-order
problem. Correctly telling them apart is what leads to the right fix,
rather than guessing.

## Practical Example

Imagine a developer's program failing to find `CUSTMAST` at all, even
though it clearly exists in `PRODLIB`. Checking `DSPLIBL` shows `PRODLIB`
is simply not part of the job's current library list, explaining the
"not found" result directly. In a different situation, a program finds a
`CUSTMAST` but with unexpectedly old data; checking `DSPLIBL` this time
shows both `PRODLIB` and an old `TESTLIB` are present, but `TESTLIB`
happens to appear earlier in the search order, exactly the kind of
situation covered in the Library List Explained in Depth lesson's own
testing example.

This is a simplified, illustrative example rather than a specific real
investigation, but it reflects two genuinely common, practical library
list problems developers encounter.

## Common Confusions

**"Is 'object not found' always a library list problem?"**
Not always; the object could genuinely not exist anywhere, or exist
under a different name than expected. Checking `DSPLIBL` specifically
tests whether the object's actual library is part of the job's library
list at all, which is one common, specific cause worth ruling in or out.

**"If DSPLIBL shows the right library is present, does that guarantee
the correct version is found?"**
Not by itself; as covered in this lesson, the correct library being
present does not guarantee it is searched before a different library
containing an unwanted version of the same-named object. Search order
still matters even once presence is confirmed.

**"Does this lesson cover fixing a library list problem, or just
recognizing one?"**
Primarily recognizing and diagnosing which of these two patterns applies.
Actually changing a library list, using `ADDLIBLE` or adjusting a batch
job's `INLLIBL` setting, is covered in the Library List in Real Job
Execution lesson.

## Quick Recap

- "Object not found" when the object clearly exists often means its
  library is simply missing from the job's library list.
- "Wrong version found" often means the right library is present, but a
  different library with a same-named object appears earlier in search
  order.
- `DSPLIBL` and `DSPJOB`'s library list option are the practical tools
  for checking exactly what a job's library list contains and in what
  order.
- Correctly telling these two symptom patterns apart points toward the
  right fix rather than guessing.

## Try Asking the AI Tutor

Use the AI Tutor to ask follow-up questions about this lesson. For
example, try asking:

- "How would I confirm which specific version of an object a program
  actually found, once I suspect a search-order problem?"
- "What would DSPLIBL show differently for these two kinds of library
  list problems?"
