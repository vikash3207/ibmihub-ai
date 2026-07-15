# IFS and API Payload Files

## Learning Objective

By the end of this lesson, you will be able to explain why the IFS is
a common place to find request/response payloads, logs, and other
integration artifacts on IBM i.

## Simple Explanation

The IFS Basics lesson introduced the Integrated File System as a
directory-based way to store stream files on IBM i, separate from
traditional libraries and objects. Integration work leans on this
heavily: JSON payloads, log files from API calls, and other
integration-related files are commonly read from and written to the
IFS, because they are plain-text, stream-oriented data, not the fixed,
record-based data that traditional native objects are built around.

A typical integration directory structure might look like:

```text
/home/integrations/orders/incoming/order-100234.json
/home/integrations/orders/outgoing/response-100234.json
/home/integrations/orders/logs/2026-07-15.log
```

An RPGLE or CLLE program involved in integration work might read an
incoming JSON payload file from the IFS, process it, and write a
response payload file back out, or append a line to a log file to
record what happened.

## Why It Matters

Native IBM i objects are excellent for structured, record-based
business data, but a JSON payload is naturally a stream of text, not a
fixed-length record. The IFS is built for exactly this kind of data,
which is why integration work so often involves reading and writing
IFS stream files alongside the native database work already familiar
from earlier in this course.

## Practical Example

Imagine an order arrives from a web storefront as a JSON payload,
written to
`/home/integrations/orders/incoming/order-100234.json` on the IFS. An
RPGLE program reads that file, validates the customer number using the
existing validation logic covered earlier in this course, and writes a
result back to
`/home/integrations/orders/outgoing/response-100234.json`. A line is
also appended to a daily log file in
`/home/integrations/orders/logs/`, recording that the order was
received and processed.

This is a simplified, illustrative example rather than a specific real
integration, but it reflects a genuinely common pattern.

## Common Confusions

**"Could this data be stored in a native database file instead of the
IFS?"**
Sometimes, but a JSON payload does not naturally fit a fixed-length
record format the way traditional IBM i data does. The IFS is a more
natural fit for this kind of stream-oriented, variable-length text
data.

**"Is every integration required to use the IFS?"**
No. Some integration approaches pass data directly between programs
without ever writing a payload to disk. The IFS is common specifically
when a payload, log, or other artifact needs to be written to and read
from as a file, such as for auditing or troubleshooting.

**"Is this the same as the traditional use of the IFS for things like
configuration files?"**
The underlying mechanism is the same IFS covered in the IFS Basics
lesson; what differs here is the purpose, storing integration-related
payloads and logs, rather than configuration files.

## Quick Recap

- The IFS is a common place for JSON payloads, logs, and other
  integration artifacts on IBM i.
- JSON payloads are naturally stream-oriented text, which fits the IFS
  better than fixed-length native records.
- A typical integration flow might read an incoming payload file,
  process it using existing business logic, and write a response
  payload or log file back to the IFS.
- This builds directly on the IFS concepts already covered earlier in
  this course, applied to an integration use case.

## Try Asking the AI Tutor

Use the AI Tutor to ask follow-up questions about this lesson. For
example, try asking:

- "What are some good habits for naming and organizing integration
  files in the IFS so they stay easy to troubleshoot later?"
- "Why might a team choose to log each API request and response as a
  file in the IFS rather than just relying on the job log?"
