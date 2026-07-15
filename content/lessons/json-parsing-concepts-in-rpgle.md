# JSON Parsing Concepts in RPGLE

## Learning Objective

By the end of this lesson, you will be able to explain, conceptually,
what it means to parse a JSON payload in an RPGLE program and map its
values into familiar RPGLE data structures.

## Simple Explanation

**Parsing** a JSON payload means reading through its structure and
pulling out the specific values a program actually needs, rather than
treating the whole payload as one big block of text. Conceptually,
parsing a JSON object like:

```json
{
  "custNbr": 100234,
  "custName": "Acme Supply Co",
  "isActive": true
}
```

means recognizing that it contains three named values, `custNbr`,
`custName`, and `isActive`, and being able to read each one
individually. In RPGLE, this typically means mapping those named
values into a data structure, similar in shape to the JSON object
itself:

```rpgle
dcl-ds custInfo qualified;
  custNbr packed(6:0);
  custName char(30);
  isActive ind;
end-ds;
```

Once parsed, `custInfo.custNbr`, `custInfo.custName`, and
`custInfo.isActive` can be used in the program exactly like any other
data structure subfields already familiar from earlier RPGLE lessons.

## Why It Matters

A JSON payload arrives as plain text; a program cannot usefully work
with a customer number or a name until it has been read out of that
text and placed somewhere the program's own logic can use directly.
Understanding parsing as "reading named values out of text into a data
structure" makes the idea approachable, independent of exactly which
tool or library a shop uses to actually perform that reading.

## Practical Example

Recall the customer validation logic covered earlier in this course.
If a request arrives as a JSON payload containing `custNbr`, parsing
means reading that single value out of the payload and placing it into
a variable the existing `isValidCustNbr` procedure can accept directly,
exactly as it always has. The validation logic itself does not need to
know anything about JSON; parsing is simply the step that bridges the
incoming payload and the existing procedure's expected input.

This is a simplified, illustrative example rather than a specific real
implementation, but it reflects exactly how parsing fits into a
typical integration flow.

## Common Confusions

**"Do I need to learn a specific JSON parsing library to understand
this lesson?"**
No. This lesson focuses on the concept, reading named values out of a
JSON payload into a data structure, which applies regardless of which
specific tool or library a shop chooses to use for the actual parsing
work.

**"Is parsing JSON fundamentally different from reading a record from a
file?"**
Not conceptually. Both involve taking structured data from one form
and making its individual values available to the program's logic. The
practical difference is that a JSON payload is a flexible, named-value
text format, while a file record is a fixed-position layout.

**"What happens if a JSON payload is missing a value the program
expects?"**
This is a real, practical concern: a parsed value might turn out to be
missing or in an unexpected form. Planning for that possibility, rather
than assuming every payload will always be complete and well-formed, is
part of handling JSON responsibly, and the next lesson in this batch
looks at this in more depth.

## Quick Recap

- Parsing a JSON payload means reading its named values out of plain
  text so a program's logic can use them directly.
- Parsed JSON values are typically mapped into an RPGLE data structure,
  similar in shape to the JSON object itself.
- This concept applies regardless of which specific parsing tool or
  library a shop uses.
- A JSON payload can be missing or malformed, which is a real
  consideration when parsing it.

## Try Asking the AI Tutor

Use the AI Tutor to ask follow-up questions about this lesson. For
example, try asking:

- "Can you walk me through parsing a slightly bigger JSON payload with
  a nested object into RPGLE data structures conceptually?"
- "Why does it help to think of JSON parsing as similar to reading a
  file record, even though the underlying mechanics are different?"
