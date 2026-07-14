# Physical Files Explained in Depth

## Learning Objective

By the end of this lesson, you will understand the structure of a DDS-defined
physical file in more detail, including record formats, and be ready to look
at how individual fields within that record format are actually defined.

## Simple Explanation

In the Physical Files and Logical Files lesson, you learned that a physical
file is where actual data is stored on IBM i, holding records made up of
fields. This lesson goes a level deeper into how a physical file is actually
structured when it is defined using DDS, as introduced in the previous
lesson.

A DDS-defined physical file has exactly one **record format**, which is the
blueprint describing every field that belongs to a record in that file: each
field's name, its data type, and its length. Every record stored in the
file follows that same record format; a physical file cannot mix records
that follow different formats the way, for example, a spreadsheet with
inconsistent columns might.

The record format is written using DDS source code, stored as a source
member, similar to the RPGLE and CLLE source members you learned about in
the Source Physical Files and Source Members lesson. This DDS source is then
compiled into an actual physical file object, ready to store data, using a
command such as `CRTPF` (Create Physical File).

This lesson stays focused on the physical file and its record format as a
whole. The next lesson, DDS Field Definitions, looks specifically at how
each individual field within that record format is described.

## Why It Matters

Understanding that every physical file has exactly one consistent record
format explains why physical files behave predictably: any program reading
or writing that file can rely on every record having the same fields, in the
same order, with the same data types. This predictability is part of why
physical files have remained a stable, dependable foundation for IBM i
business applications for decades.

## Practical Example

Imagine a physical file named `CUSTMAST`, intended to store customer master
records. Its DDS source defines one record format containing fields for
customer number, customer name, and address. Every record ever stored in
`CUSTMAST` follows this exact record format: a customer number, a name, and
an address, in that defined order and with defined lengths.

A program that reads `CUSTMAST` can rely completely on this structure,
knowing it will never encounter a record with a different set of fields.
This is a simplified, illustrative example rather than a specific real
system, but it reflects how DDS-defined physical files work in practice.

## Common Confusions

**"Can a physical file have more than one record format?"**
No, not for a standard, data-holding physical file of the kind covered in
this lesson group. Each physical file has exactly one record format that
every record in it follows.

**"Is the record format the same thing as the physical file object
itself?"**
The record format is the blueprint defined in DDS source code; the physical
file is the compiled object that actually stores data following that
blueprint. You write the record format in DDS source, then compile it into
the physical file object.

**"Do I need to already know DDS field syntax to understand record
formats?"**
No. This lesson focuses on the physical file and its record format as a
whole concept. The next lesson, DDS Field Definitions, covers the specific
syntax used to describe individual fields.

## Quick Recap

- A DDS-defined physical file has exactly one record format, describing
  every field that belongs to a record in that file.
- Every record stored in a physical file follows the same record format,
  in the same field order, with the same data types.
- Record formats are written in DDS source code, then compiled into an
  actual physical file object using a command such as CRTPF.
- Individual field definitions within a record format are covered in depth
  in the next lesson.

## Try Asking the AI Tutor

Use the AI Tutor to ask follow-up questions about this lesson. For example,
try asking:

- "What command is used to compile DDS source into a physical file
  object?"
- "Why can't a physical file have more than one record format?"
