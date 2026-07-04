# Introduction to Db2 for i

## Learning Objective

By the end of this lesson, you will understand what Db2 for i is, how it relates
to the physical and logical files covered in Lesson 6, and how applications
commonly access the data it stores.

## Simple Explanation

Db2 for i is the integrated relational database built into IBM i. IBM i business
applications commonly store their important business data in Db2 for i.

Db2 for i organizes data into tables, made up of rows and columns. This connects
directly to the records and fields introduced in Lesson 6: a row holds the same
kind of information as a record, and a column holds the same kind of information
as a field, even though you may see either set of terms used depending on the
context.

This lesson also ties together Lesson 6's three-part model of data on IBM i:
physical files store the actual data, logical files can provide alternate views
or access paths over that data, and Db2 for i is the database layer that all of
this data storage is built on.

Applications can reach the data stored in Db2 for i in more than one way. An
RPGLE program (Lesson 7) can read and write it directly, and the same data can
also be reached through SQL, queries, reports, and integrations with other
systems.

## Why It Matters

Db2 for i is not a separate product bolted onto IBM i; it is integrated with the
platform's security, objects, jobs, and overall application environment, in the
same spirit as the integration covered in Lesson 1. This integration is a big
part of why Db2 for i supports reliable reporting, integrations with other
systems, and long-running business applications, echoing the reliability theme
introduced in Lesson 2.

## Practical Example

Imagine a company whose order data lives in Db2 for i. During the business day,
an RPGLE program reads and updates that data as new orders come in. At night, a
separate reporting tool queries the same underlying data to produce a summary
report for managers.

Both the RPGLE program and the reporting tool are working with the same data
stored in Db2 for i; they simply reach it through different tools for different
purposes. This is a simplified, illustrative example rather than a real system,
but it reflects a common pattern for how the same business data supports more
than one kind of task.

## Common Confusions

**"Is Db2 for i a separate product you have to install?"**
No. As covered in Lesson 1, Db2 for i is built directly into the IBM i platform,
not a separate database product added on afterward.

**"Are tables, rows, and columns the same as physical files, records, and
fields?"**
They describe the same underlying data model from Lesson 6, just using different
terminology. You may see either set of terms depending on whether you are looking
at the data through a more traditional IBM i lens or a more SQL-oriented one.

**"Do I need to know SQL to understand this lesson?"**
No. This lesson stays at a conceptual level. SQL syntax and database
administration topics are beyond the scope of this introductory lesson.

## Quick Recap

- Db2 for i is the integrated relational database built into IBM i.
- Db2 for i organizes data into tables, rows, and columns, which connect to the
  records and fields introduced in Lesson 6.
- Physical files store actual data, logical files can provide alternate views or
  access paths, and Db2 for i is the database layer behind this model.
- Applications can access Db2 for i data through RPGLE, SQL, queries, reports,
  and integrations.
- Db2 for i is integrated with IBM i security, objects, jobs, and the application
  environment, supporting reliable, long-running business applications.

## Try Asking the AI Tutor

Once the AI Tutor is available, you will be able to ask follow-up questions about
anything in this lesson. One thing you might ask:

- "How does Db2 for i relate to physical and logical files?"
