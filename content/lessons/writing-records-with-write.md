# Writing Records with WRITE

## Learning Objective

By the end of this lesson, you will be able to use `WRITE` to add a new
record to a physical file, and clearly distinguish this from the `write`
operation used with display files.

## Simple Explanation

You have already seen `write` used with display files, in the READ,
WRITE, EXFMT, and Screen Flow lesson, to send a record format to a 5250
screen. `WRITE` is also used with database files, where it means
something different: adding a brand new record to a physical file.

```rpgle
dcl-f CUSTMAST disk;

dcl-s custNbr packed(6:0);
dcl-s custName char(30);
dcl-s custBal packed(9:2);

custNbr = 2001;
custName = 'Jordan Lee';
custBal = 0;

write CUSTMAST;
```

Here, the program first assigns values to `CUSTMAST`'s fields, `custNbr`,
`custName`, and `custBal`, using the same field names brought in
automatically by the externally described file, as covered in the RPGLE
File Declarations with dcl-f lesson. `write CUSTMAST;` then adds a new
record to `CUSTMAST` containing exactly those field values.

## Why It Matters

`WRITE` is how new business data actually gets created and stored on IBM
i: a new customer, a new order, a new inventory item. Recognizing that
`WRITE` means something different for a database file than it does for a
display file is important, since the same operation name behaves quite
differently depending on the kind of file it targets.

## Practical Example

Imagine a program registering a brand new customer. It assigns the new
customer's number, name, and starting balance to `CUSTMAST`'s fields, then
calls `write CUSTMAST;` to actually store that new customer as a record in
the file. From that point on, that customer can be found later using
`CHAIN`, as covered in the CHAIN for Keyed Access lesson, exactly like any
other existing customer record.

This is a simplified, illustrative example rather than a specific real
program, but it reflects exactly how new records get added to a physical
file in RPGLE.

## Common Confusions

**"Is this the same WRITE operation covered for display files?"**
No, though the operation name is identical. `WRITE` on a database file
adds a new record using the file's current field values. `write` on a
display file, covered in the READ, WRITE, EXFMT, and Screen Flow lesson,
sends a record format to the screen without adding any stored data. The
same word means something fundamentally different depending on which
kind of file it targets.

**"Do I need to fill in every field before calling WRITE?"**
Fields you do not explicitly assign generally take on a default value
based on their data type, similar to an unfilled array element covered in
the Arrays in RPGLE lesson, rather than causing an error. Explicitly
assigning every meaningful field is still good practice for predictable
results.

**"Does WRITE let me add a record with a duplicate key value to a keyed
file?"**
No. As covered in the Keyed Physical Files lesson, a keyed file generally
does not allow more than one record with the same key value; attempting
to write one results in an error rather than a second, duplicate record.

## Quick Recap

- `WRITE fileName;` adds a new record to a physical file, using whatever
  values are currently assigned to that file's fields.
- `WRITE` on a database file is a different operation, despite the shared
  name, from `write` on a display file, which sends a record format to a
  screen instead.
- Fields not explicitly assigned before `WRITE` take on a default value
  based on their data type.
- Writing a duplicate key value to a keyed file results in an error, not
  a second matching record.

## Try Asking the AI Tutor

Use the AI Tutor to ask follow-up questions about this lesson. For
example, try asking:

- "What error would I see if I tried to WRITE a duplicate key value to a
  keyed file?"
- "Can I use WRITE to add a record to a logical file directly?"
