# Exposing IBM i Logic as an API

## Learning Objective

By the end of this lesson, you will be able to describe, at a high
level, the pattern used to expose existing RPGLE or SQL logic behind
an API endpoint.

## Simple Explanation

The Modern IBM i Development Overview lesson introduced the core idea
of this batch: exposing existing business logic to other systems,
rather than rewriting it. Exposing IBM i logic as an API generally
follows this shape:

1. An external system sends a request to an endpoint, such as "check
   whether this customer number is valid."
2. Something on the IBM i side receives that request and reads its
   payload.
3. That layer calls the existing business logic, such as an RPGLE
   procedure or an exported procedure in a service program, exactly the
   same logic already used elsewhere, unchanged.
4. The result from that existing logic is turned into a response
   payload and sent back to the external system.

The key idea is that the existing RPGLE or SQL logic itself does not
need to change. A layer sits in front of it, translating an incoming
API request into a normal call to that logic, and translating the
result back into a response.

## Why It Matters

This pattern is what makes exposing IBM i logic as an API realistic
and low-risk: the trusted, already-tested business logic keeps running
exactly as it always has. Only a new, thin layer is added in front of
it, responsible for translating between the API world, requests,
responses, JSON payloads, and the existing program or procedure world
already familiar from earlier in this course.

## Practical Example

Recall the `isValidCustNbr` procedure introduced in the Advanced RPGLE
/ ILE batch, exported from the `CUSTUTIL` service program. Exposing
this as an API conceptually means: an external system sends a request
containing a customer number, a layer on the IBM i side reads that
request, calls the existing `isValidCustNbr` procedure exactly as any
other program already does, and returns the result as a JSON response
payload. The validation logic itself is completely unchanged; only a
new way of reaching it has been added.

This is a simplified, illustrative example rather than a specific real
implementation, but it reflects the everyday shape of this pattern.

## Common Confusions

**"Does exposing logic as an API mean rewriting it in a different
language?"**
No. The existing RPGLE or SQL logic can stay exactly as it is. What
gets added is a layer in front of it that handles the API request and
response, not a rewrite of the underlying logic itself.

**"Is this the same as calling an external API, covered in the
previous lesson?"**
It is the reverse direction. Calling an external API means IBM i reaches
out to another system. Exposing IBM i logic as an API means another
system reaches in to IBM i, through a defined endpoint.

**"Does every RPGLE program need to be exposed as an API?"**
No. Only the specific pieces of logic that another system genuinely
needs to reach are candidates for this pattern. Most existing programs
can continue running exactly as they always have, with no API involved
at all.

## Quick Recap

- Exposing IBM i logic as an API means adding a thin layer in front of
  existing RPGLE or SQL logic, not rewriting that logic.
- That layer receives an API request, calls the existing logic
  unchanged, and turns the result into a response payload.
- This keeps trusted, already-tested business logic in place while
  making it reachable from other systems.
- This is the reverse direction of calling an external API, covered in
  the previous lesson.

## Try Asking the AI Tutor

Use the AI Tutor to ask follow-up questions about this lesson. For
example, try asking:

- "What are some signs that a specific piece of existing RPGLE logic
  would be a good candidate to expose as an API?"
- "Why does keeping the existing business logic unchanged matter so
  much when exposing it as an API?"
