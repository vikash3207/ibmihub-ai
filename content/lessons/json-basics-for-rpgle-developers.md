# JSON Basics for RPGLE Developers

## Learning Objective

By the end of this lesson, you will be able to read a simple JSON
payload and explain how its structure relates to familiar RPGLE
concepts like fields and records.

## Simple Explanation

**JSON** (JavaScript Object Notation) is a plain-text data format used
by most REST APIs to represent a request or response payload. Despite
the name, it is not specific to any one programming language; it is
simply a widely used, human-readable way to structure data.

A JSON object is a set of named values, wrapped in curly braces:

```json
{
  "custNbr": 100234,
  "custName": "Acme Supply Co",
  "isValid": true
}
```

Each name, such as `custNbr`, works similarly to a field name in an
RPGLE record format: it labels a specific piece of data. A JSON value
can be a number, text (in quotes), `true`/`false`, or even another
nested object or a list of values, called an array:

```json
{
  "custNbr": 100234,
  "orders": [1001, 1002, 1005]
}
```

## Why It Matters

Once IBM i logic sends or receives data through an API, that data
usually arrives or leaves as JSON. Being able to read a JSON payload
and map it, mentally, to something like an RPGLE record makes it much
easier to reason about what an API request or response actually
contains, without needing to already be a JSON expert.

## Practical Example

Recall the customer number validation example from earlier lessons in
this batch. A request to check `custNbr` `100234` might be sent with a
small JSON payload like the first example above. The response might
come back as:

```json
{
  "custNbr": 100234,
  "isValid": true
}
```

Reading this, `custNbr` and `isValid` are just two named values in the
response, conceptually similar to two fields being returned from an
RPGLE procedure, `custNbr` unchanged from the request and `isValid`
holding the actual answer.

This is a simplified, illustrative example rather than a specific real
payload, but it reflects exactly the shape of JSON used in practice.

## Common Confusions

**"Do I need to write JSON parsing code myself in RPGLE?"**
Not to understand this lesson. The concepts here, objects, named
values, and arrays, are what matter first. How JSON gets converted
into and out of RPGLE variables is an implementation detail that
depends on the specific tools a shop uses, not something this
introductory lesson depends on.

**"Is a JSON array the same as an RPGLE array?"**
Conceptually similar: both hold a list of values. A JSON array can
hold a simple list of numbers or text, or even a list of objects, which
is more flexible than a typical fixed RPGLE array, but the basic idea
of "more than one value under one name" is the same.

**"Does the order of named values in a JSON object matter?"**
Generally, no. Unlike fixed-position fields in an RPGLE record format,
JSON values are identified by name, not by position, so their order in
the payload does not usually affect how they are read.

## Quick Recap

- JSON is a plain-text format most REST APIs use to represent request
  and response payloads.
- A JSON object is a set of named values, similar in spirit to fields
  in an RPGLE record.
- A JSON array holds a list of values under one name.
- JSON values are identified by name, not position, so their order in
  the payload generally does not matter.

## Try Asking the AI Tutor

Use the AI Tutor to ask follow-up questions about this lesson. For
example, try asking:

- "Can you show me a slightly bigger JSON example with a nested object
  and explain each part?"
- "How would I think about mapping a JSON payload to RPGLE data
  structures conceptually, without worrying about exact syntax yet?"
