# API Error Handling Basics

## Learning Objective

By the end of this lesson, you will be able to describe a practical
approach for handling errors when a program calls or is called through
an API.

## Simple Explanation

Error handling for an API generally means answering three questions
for every call: did it succeed, if not, what kind of problem was it,
and what should the program do next? The HTTP Methods and Status Codes
lesson already introduced the vocabulary needed to answer the first
two questions:

- A `2xx` status code means success; the response payload can be used
  normally.
- A `4xx` status code means a problem with the request itself, such as
  `400` (bad request), `401`/`403` (authentication/authorization), or
  `404` (not found). These are usually not worth retrying without
  changing something about the request.
- A `5xx` status code means a problem on the other system's side. These
  may be worth retrying, depending on the situation.

Deciding what to do next depends on the specific case: show a clear
message to a user, log the problem for later investigation, fall back
to a default value, or stop the current operation entirely rather than
continuing with incomplete or invalid data.

## Why It Matters

A program that only checks "did I get a response back?" without
looking at its status code can end up treating a real error as if it
were a success, using an error payload's contents as if they were valid
data. This is exactly the kind of mistake the Common IBM i Integration
Mistakes lesson warned about. Deliberately checking status codes and
deciding a clear next step for each category of problem is what keeps
integration code predictable and trustworthy.

## Practical Example

Imagine a program calling an external shipping rate API. If the call
returns `200`, the program reads the rate from the response payload and
uses it. If the call returns a `4xx` status code, the program logs the
problem and shows a clear message rather than guessing at a rate. If
the call returns a `5xx` status code, the program might reasonably
retry once before falling back to a default rate, since a `5xx`
suggests a possibly temporary problem on the external system's side,
unlike a `4xx`, which usually will not succeed just by retrying the
same request unchanged.

This is a simplified, illustrative example rather than a specific real
integration, but it reflects a genuinely common error-handling pattern.

## Common Confusions

**"Should every failed API call be retried automatically?"**
No. Retrying makes sense for problems that might be temporary, often
signaled by a `5xx` status code. Retrying a `4xx` status code without
changing the request rarely helps, since the problem is with the
request itself, not a temporary condition on the other side.

**"Is it safe to use a response's payload without checking its status
code first?"**
No. An error response can still contain a payload, often describing the
error itself, which is very different from a successful payload
containing real data. Checking the status code first is essential
before trusting the payload's contents.

**"Does good error handling mean the program should never fail
visibly?"**
No. Sometimes the correct behavior is to stop clearly and show a
meaningful message, rather than silently continuing with incomplete or
invalid data. Good error handling means responding deliberately, not
necessarily avoiding all visible failure.

## Quick Recap

- Good API error handling starts with checking the status code before
  trusting a response's payload.
- `4xx` problems usually will not be fixed by simply retrying the same
  request; `5xx` problems may be worth retrying.
- What a program does next, showing a message, logging, falling back to
  a default, or stopping, should be a deliberate decision for each
  category of problem.
- This builds directly on the status code vocabulary from the HTTP
  Methods and Status Codes lesson and the mistakes covered in the
  Modern IBM i / APIs / Integration Batch 1 capstone lesson.

## Try Asking the AI Tutor

Use the AI Tutor to ask follow-up questions about this lesson. For
example, try asking:

- "Can you give me a short scenario and ask me to decide the right
  error-handling response for a few different status codes?"
- "When would falling back to a default value be the wrong choice,
  even for a 5xx error?"
