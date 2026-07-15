# HTTP Methods and Status Codes for IBM i Developers

## Learning Objective

By the end of this lesson, you will be able to map common HTTP methods
and status codes to the everyday IBM i operations they represent.

## Simple Explanation

The REST API Concepts lesson introduced `GET`, `POST`, `PUT`, and
`DELETE`, along with a few status codes. This lesson goes further,
mapping each one to the kind of operation an IBM i developer already
recognizes:

- **`GET`**: read something, without changing it. Similar to a `CHAIN`
  or a read-only SQL `SELECT` against a customer record.
- **`POST`**: submit something new. Similar to a `WRITE` that adds a
  new record, such as creating a new order.
- **`PUT` or `PATCH`**: update something that already exists. Similar
  to an `UPDATE` operation on an existing record. `PUT` typically
  replaces the whole record; `PATCH` typically changes only specific
  fields.
- **`DELETE`**: remove something. Similar to a `DELETE` operation on an
  existing record.

Status codes follow a similar practical pattern:

- **`200`**: success, with data being returned, such as a successful
  `GET`.
- **`201`**: success, and something new was created, such as a
  successful `POST` that added an order.
- **`400`**: bad request, meaning the request itself was malformed or
  missing required data, before any business logic even ran.
- **`401`**: not authenticated, meaning the caller's identity was not
  confirmed at all.
- **`403`**: authenticated, but not authorized, meaning the caller is
  known but is not allowed to do this specific thing.
- **`404`**: not found, meaning the specific thing requested does not
  exist.
- **`409`**: conflict, meaning the request could not complete because
  it collided with the current state of the data, such as trying to
  create something that already exists.
- **`500`**: server error, meaning something went wrong on the server
  side while trying to process an otherwise valid request.

## Why It Matters

Choosing the right method and status code is what makes an API
predictable to work with. A calling program, or another developer,
should be able to trust that a `201` means something was actually
created, and that a `409` means a genuine conflict rather than a
generic failure. This predictability is exactly what `SQLCODE` and
`%FOUND` already provide for native IBM i file operations, applied to
the API world instead.

## Practical Example

Imagine an order-entry API. Creating a new order uses `POST` and, on
success, returns `201` along with the new order's details. Looking up
an existing order uses `GET` and returns `200` with the order details,
or `404` if that order number does not exist. Trying to create an
order with a customer number that does not exist might reasonably
return `400`, since the request itself is invalid before any order
logic even runs. Trying to create an order that has already been
submitted with the same reference number might instead return `409`,
since the request is well-formed but conflicts with an order that
already exists.

This is a simplified, illustrative example rather than a specific real
API, but it reflects exactly how these methods and status codes are
used in practice.

## Common Confusions

**"What is the real difference between 401 and 403?"**
`401` means the caller's identity was not established at all, similar
to not being signed on. `403` means the caller is known, but is not
allowed to perform this specific action, similar to being signed on
but lacking the authority for a specific object or operation.

**"Why would a request to create something return 409 instead of
400?"**
`400` is for a request that is malformed or invalid on its own, before
considering existing data. `409` is for a request that is well-formed
but conflicts with something that already exists, such as trying to
create a duplicate.

**"Is PATCH just a different name for PUT?"**
Not exactly. `PUT` conventionally replaces an entire record with the
data provided. `PATCH` conventionally changes only the specific fields
included in the request, leaving the rest of the record untouched.

## Quick Recap

- `GET` reads, `POST` creates, `PUT`/`PATCH` update, and `DELETE`
  removes, mapping closely to familiar native file operations.
- `200`/`201` indicate success; `400` indicates a malformed request;
  `401`/`403` distinguish "not authenticated" from "authenticated but
  not allowed"; `404` means not found; `409` means a genuine conflict;
  `500` means a server-side problem.
- Choosing the right method and status code makes an API predictable,
  similar to how `SQLCODE` and `%FOUND` make native file operations
  predictable.

## Try Asking the AI Tutor

Use the AI Tutor to ask follow-up questions about this lesson. For
example, try asking:

- "Can you give me a few more realistic examples of when an IBM i API
  might return a 409 instead of a 400?"
- "How would I decide between PUT and PATCH when updating an existing
  order through an API?"
