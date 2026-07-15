# API Request and Response Design Basics

## Learning Objective

By the end of this lesson, you will be able to design a simple,
readable request and response shape for a common IBM i business
operation.

## Simple Explanation

Designing a request and response well means being deliberate about
what data goes in, and what data comes back, rather than sending or
returning more than is actually needed. A well-designed request
usually contains exactly the data required to perform the operation,
and a well-designed response usually contains exactly the data the
caller actually needs back, using clear, descriptive names.

For a customer lookup, a reasonable request might be:

```json
{
  "custNbr": 100234
}
```

And a reasonable response might be:

```json
{
  "custNbr": 100234,
  "custName": "Acme Supply Co",
  "isActive": true
}
```

Notice the response echoes back `custNbr`, so the caller can easily
match the response to the request it made, and adds only the specific
fields the caller actually needs.

## Why It Matters

A poorly designed request or response, one that is missing needed
data, includes unnecessary data, or uses unclear field names, makes an
API confusing and error-prone to work with. Just as a well-designed
RPGLE record format uses clear field names and includes exactly the
data a program needs, a well-designed API payload does the same for
whatever system is calling it.

## Practical Example

Imagine designing an API for creating a new order. The request needs
enough information to actually create the order: a customer number and
a list of items. It does not need information the server can determine
itself, such as an order date, which is more reliably set by the
server at the moment the order is created.

```json
{
  "custNbr": 100234,
  "items": [
    { "itemNbr": 5001, "qty": 3 },
    { "itemNbr": 5002, "qty": 1 }
  ]
}
```

A well-designed response confirms what was created, including
information the caller could not have known in advance, such as the
new order number:

```json
{
  "orderNbr": 900123,
  "custNbr": 100234,
  "status": "created"
}
```

This is a simplified, illustrative example rather than a specific real
API, but it reflects the everyday shape of good request/response
design.

## Common Confusions

**"Should a response always include every field from the underlying
record?"**
No. A response should include the fields the caller actually needs,
similar to how a well-designed RPGLE record format does not
necessarily expose every internal field to every program that reads
it.

**"Should the caller be responsible for supplying data the server can
determine itself, like an order date or order number?"**
Generally, no. Data the server can reliably determine itself, such as a
newly generated order number or a timestamp, is usually better left out
of the request and returned in the response instead.

**"Does the request need to match the response's field names
exactly?"**
Not necessarily, but reusing the same name for the same piece of data,
such as `custNbr` in both the request and response, makes the API much
easier to reason about than using different names for the same thing
in different places.

## Quick Recap

- A well-designed request contains exactly the data needed to perform
  the operation, no more and no less.
- A well-designed response returns exactly what the caller needs,
  including information only the server could determine, such as a new
  order number.
- Reusing consistent, clear field names across requests and responses
  makes an API far easier to work with.
- This is the same discipline already familiar from designing clear
  RPGLE record formats, applied to API payloads.

## Try Asking the AI Tutor

Use the AI Tutor to ask follow-up questions about this lesson. For
example, try asking:

- "Can you review a request/response design I come up with for a
  simple IBM i business operation and suggest improvements?"
- "What are some signs that an API response is including too much or
  too little data?"
