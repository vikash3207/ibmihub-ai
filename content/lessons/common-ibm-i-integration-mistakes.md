# Common IBM i Integration Mistakes

## Learning Objective

By the end of this lesson, you will be able to recognize the most
common mistakes developers make when first working on IBM i
integration, drawn from across this batch.

## Simple Explanation

A handful of mistakes come up repeatedly when developers first start
working on integration:

- **Assuming a status code always means what it seems to.** Treating
  every non-`200` response the same way, rather than distinguishing a
  `404` (nothing found) from a `500` (something went wrong), leads to
  confusing, misleading error handling.
- **Assuming an external call always succeeds quickly.** Not planning
  for a slow, failed, or unavailable external system leaves a program
  with no reasonable way to handle a real, common situation.
- **Rewriting trusted logic instead of exposing it.** Duplicating an
  existing validation rule or calculation in a new layer, rather than
  calling the existing, already-tested logic, risks the new copy
  quietly drifting out of sync with the original.
- **Treating JSON payloads as an afterthought.** Not carefully checking
  that a payload's structure actually matches what is expected before
  using its values leads to problems that are easy to avoid by
  checking payload structure deliberately.
- **Losing track of integration files in the IFS.** Writing payloads
  and logs to the IFS without a clear, consistent organization makes
  troubleshooting a specific request much harder than it needs to be.

## Why It Matters

Every one of these mistakes shares a common thread with the mistakes
covered in the Common ILE Mistakes and Best Practices lesson: things
can look like they are working, a request goes out, a response comes
back, while a real problem is quietly present underneath. Recognizing
these patterns early is what separates integration work that stays
reliable over time from integration work that becomes a constant
source of confusing, hard-to-diagnose problems.

## Practical Example

Imagine a program calling an external shipping rate API. If the
program only checks "did I get a response back?" without checking its
status code, it might try to read a shipping rate from an error
response that never actually contained one, producing a confusing
downstream failure instead of a clear, early error message. Checking
the status code first, exactly as covered in the REST API Concepts
lesson, and only reading the payload once success is confirmed, avoids
this entirely.

This is a simplified, illustrative example rather than a specific real
incident, but it reflects a genuinely common integration mistake.

## Common Confusions

**"If a request comes back with any response at all, doesn't that mean
it worked?"**
No. A response can come back with an error status code, meaning the
request was received but did not succeed the way it was intended to.
Checking the status code, not just whether a response arrived at all,
is essential.

**"Is duplicating a small validation rule in a new layer really that
risky?"**
Yes, over time. Even a small duplicated rule can drift out of sync with
the original if one is updated and the other is forgotten, which is
exactly why exposing the existing logic, covered earlier in this
batch, is generally the safer approach.

**"Are these mistakes only a concern for large, complex integrations?"**
No. Even a single, simple integration, such as one customer lookup
endpoint, can run into any of these, particularly not checking status
codes properly or not organizing IFS payload files clearly.

## Quick Recap

- Not distinguishing status codes properly, assuming external calls
  always succeed quickly, duplicating trusted logic instead of
  exposing it, treating JSON payload structure carelessly, and losing
  track of IFS integration files are the most common integration
  mistakes covered across this batch.
- Many of these mistakes let a request and response look like they
  worked while a real problem is quietly present underneath.
- The underlying habit that prevents most of them is treating
  integration as carefully as any other part of an IBM i application:
  checking results deliberately, reusing trusted logic, and keeping
  artifacts organized.

## Try Asking the AI Tutor

Use the AI Tutor to ask follow-up questions about this lesson. For
example, try asking:

- "Can you give me a short integration scenario with one of these
  mistakes and ask me to spot it?"
- "Which of these mistakes would be easiest to miss during code
  review, and why?"
