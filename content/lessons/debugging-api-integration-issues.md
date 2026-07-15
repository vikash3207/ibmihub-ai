# Debugging API Integration Issues

## Learning Objective

By the end of this lesson, you will be able to describe a systematic
approach for investigating an API integration problem, using payloads,
status codes, logs, and job logs together.

## Simple Explanation

Debugging an integration problem draws on nearly everything covered in
this batch, plus debugging habits already familiar from earlier in this
course. A reasonable order of investigation:

1. **Check the status code first.** This immediately narrows down
   whether the problem is with the request itself (`4xx`), the other
   system (`5xx`), or whether the call actually succeeded (`2xx`) and
   the problem lies elsewhere.
2. **Check the logged request and response**, covered in the Logging
   Integration Requests and Responses lesson, to see exactly what was
   sent and what came back.
3. **Check the job log**, exactly as covered in earlier debugging
   lessons in this course, for anything the RPGLE or CLLE program
   itself reported while making or handling the call.
4. **Check the external system's own response or logs**, if available,
   since a `5xx` or unexpected response often points to a problem on
   the other side rather than in the IBM i program itself.

## Why It Matters

An integration problem can originate in several different places: a
malformed request, a genuine problem on the external system, a parsing
mistake once a response comes back, or a bug in the IBM i program's own
logic. Working through these checks in order, rather than guessing,
narrows down the actual cause far more reliably, the same disciplined
approach already used for debugging RPGLE and batch job problems
earlier in this course.

## Practical Example

Imagine an order fails to be created through an API integration. Checking
the status code first shows a `400`, immediately ruling out a problem
on the external system's side. Checking the logged request shows the
customer number field was accidentally left blank due to a parsing
mistake covered in an earlier lesson in this batch. The job log
confirms the RPGLE program reported no internal errors of its own,
narrowing the actual problem down to how the request was built, rather
than anywhere else in the chain.

This is a simplified, illustrative example rather than a specific real
incident, but it reflects a genuinely common integration debugging
scenario.

## Common Confusions

**"If the job log shows no errors, does that mean the integration
problem must be somewhere else?"**
Not necessarily on its own, but it is a useful data point: a clean job
log narrows the problem away from an unhandled RPGLE or CLLE error and
toward the request itself, the external system's response, or how that
response was parsed.

**"Should I start by looking at the external system's logs first?"**
Usually not first. Checking the status code and the logged request and
response on the IBM i side first is typically faster and often narrows
the problem down before needing access to, or cooperation from, the
external system.

**"Is this a completely different debugging approach from the RPGLE
and batch job debugging covered earlier in this course?"**
No. It follows the same underlying discipline, work from the most
readily available evidence outward, applied to the additional
integration-specific evidence: status codes, request/response logs, and
the external system's own responses.

## Quick Recap

- Start by checking the status code, then the logged request and
  response, then the job log, then the external system's own response
  or logs if needed.
- Working through evidence in this order narrows down whether a problem
  originates in the request, the IBM i program's logic, or the external
  system.
- This builds directly on the logging practices and error-handling
  vocabulary covered earlier in this batch, combined with the job log
  debugging habits already familiar from earlier in this course.

## Try Asking the AI Tutor

Use the AI Tutor to ask follow-up questions about this lesson. For
example, try asking:

- "Can you walk me through a short integration debugging scenario step
  by step, using this order of investigation?"
- "What would make you suspect the external system rather than the IBM
  i side when an integration call fails?"
