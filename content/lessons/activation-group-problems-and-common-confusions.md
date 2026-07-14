# Activation Group Problems and Common Confusions

## Learning Objective

By the end of this lesson, you will be able to recognize a few common,
realistic activation-group-related symptoms and reason about their
likely cause.

## Simple Explanation

The Activation Groups Basics lesson introduced `*NEW`, giving a program
its own fresh activation group on every call, and `*CALLER`, sharing
the activation group of whatever called it. This lesson walks through
what actually goes wrong in practice when a program's activation group
choice does not match what it needs.

**Symptom: a file the program expects to still be open, from a
previous call, is unexpectedly closed.** This commonly points to the
program running in `*NEW`: a fresh activation group each call means
resources like open files do not automatically persist between
separate calls the way they might if the program shared an activation
group across those calls instead.

**Symptom: an error in a called program seems to affect more, or less,
than expected of the surrounding call chain.** Since activation groups
also scope error handling boundaries, a mismatch between what a
developer expects and how a program's activation group is actually set
up can show up as errors behaving differently than assumed.

## Why It Matters

These symptoms can look confusing precisely because nothing about the
program's own business logic is actually wrong. Recognizing that an
activation group mismatch is a likely cause, rather than assuming the
program's logic itself must be broken, can save a lot of time spent
looking in the wrong place.

## Practical Example

Imagine a program intended to open a file once and reuse that open
file across several calls within the same job, for performance reasons.
If that program actually runs with `*NEW`, each call gets its own fresh
activation group, and the file effectively gets reopened each time
rather than staying open as intended. Recognizing `*NEW` versus
`*CALLER` as the likely explanation, rather than assuming the file
handling code itself is wrong, is exactly the kind of reasoning this
lesson is building.

This is a simplified, illustrative example rather than a specific real
incident, but it reflects a genuinely common point of confusion.

## Common Confusions

**"Does an activation group problem affect the whole job?"**
Not automatically. Activation groups are scoped to the specific
program and call relationship involved, not automatically to
everything else running in the same job.

**"Is this the same thing as a record lock?"**
No. A record lock, covered earlier in this course, is about two jobs
contending for the same data record. Activation groups are about a
program's own runtime resource lifecycle, such as open files and
static storage, a completely different concept.

**"If a program behaves inconsistently between two different callers,
is that always an activation group issue?"**
Not always, but it is a reasonable thing to check, especially when the
symptom involves resources that are supposed to persist between calls,
or error handling that seems to behave differently than expected.

## Quick Recap

- A program's activation group choice affects real, observable
  behavior: whether resources persist between calls, and how error
  handling is scoped.
- A file unexpectedly not staying open between calls often points to
  `*NEW` rather than a shared activation group.
- Activation group problems are scoped to the specific program
  involved, not automatically the whole job.
- This is a distinct concept from record locking, even though both can
  produce confusing, hard-to-explain symptoms.

## Try Asking the AI Tutor

Use the AI Tutor to ask follow-up questions about this lesson. For
example, try asking:

- "How would I check which activation group a specific program
  actually runs in?"
- "Why might two programs that look nearly identical behave
  differently if one uses *NEW and the other uses *CALLER?"
