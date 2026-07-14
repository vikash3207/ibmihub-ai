# REST API Concepts for IBM i Developers

## Learning Objective

By the end of this lesson, you will be able to explain the core REST
API concepts, endpoint, request, response, HTTP method, and status
code, in plain terms.

## Simple Explanation

**REST** is one common style for building APIs. A REST API is reached
at an **endpoint**, which is simply an address that represents a
specific thing you can ask for or act on, similar in spirit to a
specific program name on IBM i representing a specific piece of logic.

Working with a REST API involves a few core ideas:

- **Request**: what the calling system sends, asking for something to
  happen.
- **Response**: what comes back, containing the result.
- **HTTP method**: what kind of action the request represents. The
  most common ones are `GET` (retrieve information, without changing
  anything), `POST` (submit new information, such as creating
  something), `PUT` (replace or update existing information), and
  `DELETE` (remove something).
- **Status code**: a short code in the response indicating what
  happened, such as `200` (success), `404` (nothing found at that
  endpoint), or `500` (something went wrong on the server side).
- **Payload**: the actual data being sent in a request or returned in a
  response.

## Why It Matters

These terms show up constantly once IBM i logic is exposed as, or
needs to call, an API. Recognizing that a `GET` request is asking to
retrieve something without changing it, or that a `404` status code
means "nothing was found at this endpoint," rather than "something is
broken," makes it possible to reason about integration behavior
correctly, the same way understanding `SQLCODE` values makes it
possible to reason about SQLRPGLE behavior correctly.

## Practical Example

Imagine a REST endpoint for checking whether a customer number is
valid, reached with a `GET` request and a customer number as part of
the request. A successful check might return a `200` status code, along
with a payload indicating whether the customer number is valid. If the
customer number does not exist at all, the endpoint might return a
`404` status code instead, distinct from a `500` status code, which
would instead indicate a genuine problem on the server side, such as
the underlying RPGLE program failing to run at all.

This is a simplified, illustrative example rather than a specific real
endpoint, but it reflects exactly how these core REST ideas fit
together.

## Common Confusions

**"Is REST the only way to build an API?"**
No, but it is one of the most common styles in practice, and the
concepts in this lesson, endpoints, requests, responses, methods, and
status codes, are widely applicable even when a specific integration
does not strictly follow every REST convention.

**"Does a 404 status code always mean something is broken?"**
No. A `404` typically means the specific thing being asked for was not
found at that endpoint, which is often expected behavior, such as
looking up a customer number that genuinely does not exist. A `500`
status code is the one that usually signals an actual problem.

**"What is the difference between GET and POST in simple terms?"**
`GET` asks to retrieve information without changing anything, similar
to a read-only lookup. `POST` submits new information, often to create
or trigger something, similar to an action that changes data.

## Quick Recap

- REST is a common style for building APIs, reached through endpoints.
- A request is sent, a response comes back, and the HTTP method
  (`GET`, `POST`, `PUT`, `DELETE`) describes what kind of action is
  being requested.
- A status code in the response summarizes what happened, such as
  `200` for success, `404` for not found, or `500` for a server-side
  problem.
- A payload is the actual data carried in a request or response.

## Try Asking the AI Tutor

Use the AI Tutor to ask follow-up questions about this lesson. For
example, try asking:

- "Can you walk me through what a full request and response might look
  like for a simple customer lookup endpoint?"
- "Why does distinguishing between a 404 and a 500 status code matter
  when I'm troubleshooting an integration?"
