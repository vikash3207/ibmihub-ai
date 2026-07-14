# Data Structures in RPGLE

## Learning Objective

By the end of this lesson, you will understand what an RPGLE data structure
is, how to declare one using `dcl-ds`, and why declaring one as `qualified`
is generally good practice.

## Simple Explanation

In the Variables and Data Types in RPGLE lesson, you declared standalone
variables one at a time using `dcl-s`. A **data structure**, declared using
**`dcl-ds`**, groups several related variables, called **subfields**,
together under one named container.

```rpgle
dcl-ds customer qualified;
  custName char(30);
  custBalance packed(9:2);
end-ds;

customer.custName = 'Jordan Lee';
customer.custBalance = 250.00;
```

Declaring a data structure as **`qualified`** means each subfield must be
referred to using the data structure's name, a period, and the subfield
name, such as `customer.custName`. This is generally good practice: it
makes it immediately clear which data structure a subfield belongs to, and
avoids naming conflicts if two different data structures happen to have
subfields with similar names.

Without `qualified`, a data structure's subfields behave more like
ordinary standalone variables referred to by their own name alone, which
can be more convenient for very small programs, but loses that same
protection against naming conflicts as a program grows.

## Why It Matters

Data structures let you group logically related values together, such as
several pieces of information about the same customer, rather than
managing a long, flat list of unrelated standalone variables. This mirrors
an idea you already know from the Db2 for i lessons: much like a record
format groups related fields together, a data structure groups related
subfields together within a program.

## Practical Example

Imagine a program working with several pieces of information about one
customer: name, balance, and account status. Declaring a single `customer`
data structure with `custName`, `custBalance`, and `custStatus` subfields
keeps these clearly related values grouped together and easy to pass around
as a unit, rather than managing three separate, seemingly unrelated
standalone variables.

Using `qualified`, referring to `customer.custName` also makes it obvious,
just from reading the code, exactly which piece of data a given line is
working with. This is a simplified, illustrative example rather than a
specific real program, but it reflects a genuinely common, practical reason
RPGLE developers use data structures.

## Common Confusions

**"Is a data structure the same thing as a DDS record format?"**
They are related ideas, both group fields together, but a data structure is
declared inside an RPGLE program to organize variables in memory, while a
record format, covered in the DDS Field Definitions lesson, describes the
structure of data actually stored in a physical file.

**"Do I always need to use qualified?"**
No, but it is generally recommended, especially as a program grows. Without
`qualified`, subfield names must be unique across the entire program, which
can become harder to manage; `qualified` avoids that concern entirely.

**"Can a data structure have subfields of different data types?"**
Yes. A data structure's subfields can use any of the data types covered in
the Variables and Data Types in RPGLE lesson, mixed together as needed,
such as combining `char`, `packed`, and `int` subfields within the same
data structure.

## Quick Recap

- A data structure, declared with `dcl-ds`, groups related variables,
  called subfields, together under one named container.
- Declaring a data structure as `qualified` means subfields are referred to
  as `structureName.subfieldName`, which is generally good practice.
- Data structures help organize logically related values together, similar
  in spirit to how a record format groups related fields.
- Subfields can use any of the standard RPGLE data types, mixed together as
  needed.

## Try Asking the AI Tutor

Use the AI Tutor to ask follow-up questions about this lesson. For example,
try asking:

- "What happens if I don't use qualified and two data structures have a
  subfield with the same name?"
- "Can a data structure be used as a parameter passed to a procedure?"
