# DDS Field Definitions

## Learning Objective

By the end of this lesson, you will be able to read a simple DDS field
definition and explain what its main parts, name, data type, and length,
tell you about that field.

## Simple Explanation

In the Physical Files Explained in Depth lesson, you learned that a physical
file's record format describes every field in its records. This lesson
looks specifically at how each individual field within that record format is
defined using DDS syntax.

A DDS field definition typically specifies three core pieces of information
for each field:

- **Field name**: a short, unique identifier for that field within the
  record format, following the same traditional IBM i naming rules covered
  in the Object Naming and Qualified Names in Practice lesson.
- **Data type**: what kind of value the field holds. Common DDS data types
  include character data (letters, numbers, and symbols treated as text),
  packed decimal or zoned decimal data (numeric values, often used for
  amounts or quantities), and date or time data.
- **Length**: how many characters or digits the field can hold, and, for
  decimal fields, how many of those digits fall after the decimal point.

DDS field definitions are written line by line in a source member, with each
line describing one field. Beyond name, type, and length, DDS supports
additional optional keywords that add extra behavior or documentation to a
field, such as giving it a descriptive column heading or reference text.
This lesson focuses on the core name, type, and length concepts; the wider
set of optional DDS keywords is a more advanced topic beyond this
introduction.

## Why It Matters

Being able to read a basic DDS field definition, recognizing its name, type,
and length, helps you understand the actual data a program is working with
just by glancing at a file's DDS source. This is a practical, everyday skill
for anyone working with IBM i business applications, since so much
long-running business data is still defined this way.

## Practical Example

Imagine looking at the DDS source for the `CUSTMAST` physical file
introduced in the previous lesson. Its field definitions might describe a
customer number field as numeric with a modest length, a customer name field
as character data with room for a reasonably long name, and a balance field
as decimal data with a couple of digits reserved after the decimal point for
cents.

Just from reading these field definitions, a developer can tell that the
customer number is meant to be a number rather than free text, that the
customer name field has a maximum length it cannot exceed, and that the
balance field is meant to represent a monetary amount with cents. This is a
simplified, illustrative example rather than exact real DDS syntax, but it
reflects the kind of information a field definition is meant to convey.

## Common Confusions

**"Is a DDS data type the same as a data type in a general-purpose
programming language?"**
Conceptually similar, in that both describe what kind of value something
holds, but DDS data types are specific to how IBM i stores data in physical
files, and differ in name and detail from data types you may know from other
languages.

**"Does field length always mean the same thing regardless of data type?"**
Not exactly. For character fields, length is simply the number of
characters. For decimal fields, length is usually split between total
digits and how many of those digits are reserved after the decimal point,
which matters for representing values like currency correctly.

**"Do I need to learn every possible DDS keyword to read field
definitions?"**
No. Understanding a field's name, data type, and length, the core building
blocks covered in this lesson, is enough to read and understand most basic
DDS field definitions. Additional keywords add extra detail but are not
required to grasp the fundamental structure.

## Quick Recap

- A DDS field definition typically specifies a field's name, data type, and
  length.
- Common DDS data types include character data, packed or zoned decimal
  data, and date or time data.
- Decimal field length is usually split between total digits and digits
  reserved after the decimal point, important for values like currency.
- Additional optional DDS keywords exist beyond name, type, and length, but
  are a more advanced topic beyond this introduction.

## Try Asking the AI Tutor

Use the AI Tutor to ask follow-up questions about this lesson. For example,
try asking:

- "What is the difference between packed decimal and zoned decimal data in
  DDS?"
- "What are some other common DDS keywords besides name, type, and length?"
