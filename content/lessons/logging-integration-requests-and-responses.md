# Logging Integration Requests and Responses

## Learning Objective

By the end of this lesson, you will be able to describe what is
generally useful to log for an API request and response, and what
should be deliberately left out.

## Simple Explanation

The IFS and API Payload Files lesson introduced writing payloads and
logs to the IFS. Logging integration activity well means recording
enough detail to troubleshoot a problem later, without recording more
than is actually needed, or anything sensitive.

A useful log entry for an API call typically includes:

- when the call happened
- which endpoint and method were used
- the status code returned
- enough of the request and response to understand what happened, such
  as a customer or order number

A responsible log entry generally leaves out sensitive data, such as
passwords, full payment details, or other information that does not
need to sit in a plain-text log file to be useful for troubleshooting.

```text
2026-07-15 09:14:02 | POST /orders | custNbr=100234 | status=201 | orderNbr=900123
2026-07-15 09:15:47 | GET /orders/900123 | status=404
```

## Why It Matters

When an integration problem is reported, often well after the fact, a
good log is frequently the only way to reconstruct what actually
happened. A log that is too sparse cannot answer basic questions like
"did this request even reach the server?" A log that carelessly
includes sensitive data creates a real risk, turning a troubleshooting
tool into a liability. Getting this balance right is a core part of
integration work, not an afterthought.

## Practical Example

Imagine an order fails to appear in a downstream system, and a
developer needs to figure out why. A well-kept log showing that the
original `POST /orders` request returned `201` with a specific order
number tells the developer the request succeeded on the IBM i side,
pointing the investigation toward the downstream system instead. If
the log had instead recorded nothing beyond "an order was submitted,"
or worse, recorded the customer's full payment details unnecessarily,
it would be far less useful, and potentially risky, without adding any
real troubleshooting value.

This is a simplified, illustrative example rather than a specific real
incident, but it reflects a genuinely common integration troubleshooting
scenario.

## Common Confusions

**"Isn't it safer to just log the entire request and response
payload, just in case?"**
Not necessarily. Logging an entire payload can unintentionally include
sensitive data that did not need to be recorded at all. Deciding
deliberately what is useful to log, rather than logging everything by
default, is the safer habit.

**"Is this the same as the job log already covered earlier in this
course?"**
No. The job log records what happened during a job's execution
generally. Integration logging, often written to the IFS as covered in
the earlier IFS and API Payload Files lesson, specifically tracks API
requests and responses, which is a distinct, more targeted record.

**"Does every single API call need its own log entry?"**
Not necessarily, but for anything where troubleshooting after the fact
is likely, such as order creation or payment-related calls, having a
clear record of what was requested, and what status code came back, is
usually worth the effort.

## Quick Recap

- A useful integration log records when a call happened, which endpoint
  and method were used, the status code, and enough context to
  understand the outcome.
- Sensitive data, such as passwords or full payment details, should be
  deliberately left out of logs.
- Good integration logs are often the only way to reconstruct what
  happened during a later troubleshooting effort.
- This builds on the IFS-based payload and log storage introduced
  earlier in this batch.

## Try Asking the AI Tutor

Use the AI Tutor to ask follow-up questions about this lesson. For
example, try asking:

- "Can you help me decide what to include and what to leave out of a
  log entry for a specific integration scenario?"
- "Why is logging an entire raw payload sometimes a worse habit than it
  first seems?"
