# Common ILE Mistakes and Best Practices

## Learning Objective

By the end of this lesson, you will be able to recognize the most
common mistakes beginners make when first working with ILE modules,
programs, and service programs, drawn from across both Advanced RPGLE
/ ILE batches.

## Simple Explanation

A handful of mistakes come up repeatedly when developers first start
working with ILE:

- **Forgetting `ctl-opt nomain;`** on a module that has no main
  procedure of its own, meant only to be bound into something else.
- **Exporting every procedure**, rather than only what genuinely needs
  to be called from outside the module, using `EXPORT(*ALL)` or
  marking too many procedures `export` out of convenience.
- **Forgetting to relist a module** on `CRTPGM` or `CRTSRVPGM` after
  recompiling it, so the rebuilt program or service program still
  binds the old version.
- **Changing or removing an existing exported procedure** without
  considering the programs already bound against its previous
  signature.
- **Assuming activation group choice never matters**, even for a
  program that genuinely relies on resources persisting between calls.
- **Mismatched prototypes**, where a prototype in a calling module does
  not accurately describe the real procedure interface it stands in
  for.

## Why It Matters

Every one of these mistakes shares a common thread: the program or
service program often still compiles and builds successfully, so the
mistake does not show up as an obvious, immediate error. It surfaces
later, often at runtime, or in a completely different program than the
one that was actually changed. Recognizing this pattern, that a clean
build is not the same as a correct one, is the single most valuable
habit this batch has been building toward.

## Practical Example

```rpgle
// In the calling module:
dcl-pr isValidCustNbr ind;
  custNbr packed(6:0) const;
end-pr;

// In CUSTVAL, if this were changed without updating the prototype above:
dcl-proc isValidCustNbr export;
  dcl-pi *n ind;
    custNbr zoned(6:0) const;
  end-pi;

  return custNbr > 0;
end-proc;
```

Here, the procedure interface changed `custNbr` from `packed(6:0)` to
`zoned(6:0)`, but the calling module's prototype was never updated to
match. This is exactly the mismatched-prototype mistake: both pieces
may still compile independently, but the mismatch between what the
caller expects and what the procedure actually defines is a real,
lurking problem.

## Common Confusions

**"If my program compiles cleanly, doesn't that mean everything is
fine?"**
No, and this is the central point of this whole lesson. Every mistake
listed above can compile cleanly while still causing a real problem,
whether at bind time or later, at runtime, in a program you did not
even touch.

**"Are these mistakes only a concern for large, complex applications?"**
No. Even a small, two-module application can run into any of these,
particularly a mismatched prototype or forgetting to relist a
recompiled module. Scale changes how painful a mistake is to track
down, not whether it can happen at all.

**"Is there one single fix that prevents all of these?"**
No, but the habit underlying most of them is the same: treat modules,
programs, and service programs as genuinely separate objects with
their own lifecycle, and be deliberate about what changes when one of
them is rebuilt, rather than assuming everything downstream
automatically stays in sync.

## Quick Recap

- Forgetting `ctl-opt nomain`, over-exporting procedures, forgetting to
  relist a recompiled module, changing an existing export carelessly,
  ignoring activation group choice, and mismatched prototypes are the
  most common ILE mistakes covered across this batch.
- Every one of these can compile and build successfully while still
  causing a real problem.
- The underlying habit that prevents most of them is treating modules,
  programs, and service programs as separate objects with their own
  lifecycle, not assuming a successful build means everything is
  correctly in sync.

## Try Asking the AI Tutor

Use the AI Tutor to ask follow-up questions about this lesson. For
example, try asking:

- "Can you give me a small ILE snippet with one of these mistakes and
  ask me to spot it?"
- "Which of these mistakes would be hardest to notice during code
  review, and why?"
