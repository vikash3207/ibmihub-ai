# Common Printer File Mistakes and Best Practices

## Learning Objective

By the end of this lesson, you will be able to recognize the most common
beginner mistakes across printer files and basic report programs, and
apply a simple set of best practices to avoid them.

## Simple Explanation

This lesson brings together the printer file concepts covered across this
lesson group, printer file DDS, record formats, `WRITE`, headings and
detail lines, and page overflow, into one focused list of the mistakes
beginners make most often.

A few of the most common mistakes:

- **Writing the heading record format inside the detail loop.** As
  covered in the Report Headings and Detail Lines lesson, this prints the
  heading again for every row of data instead of just once at the top.
- **Forgetting to handle page overflow.** As covered in the Page Overflow
  Basics lesson, skipping the overflow indicator check means later pages
  of a long report have no heading at all.
- **Confusing a printer file's record formats with a physical file's
  record format.** As covered in the Report Record Formats lesson, a
  printer file typically has several record formats, heading, detail, and
  total, each representing a different kind of printed line.
- **Assuming WRITE always behaves the same way regardless of file
  type.** As covered in the RPGLE Program Writing to a Printer File
  lesson, `WRITE` prints a line for a printer file, but adds a stored
  record for a physical file.
- **Confusing a spool file with an output queue.** As covered in the
  Spool Files and Output Queues lesson, a spool file is one specific piece
  of generated output, while an output queue is a holding area that can
  contain many spool files at once.

```rpgle
dcl-f CUSTRPTP printer;
dcl-f CUSTMAST disk;

write HDGFMT;

read CUSTMAST;
dow not %eof(CUSTMAST);
  if *inof;
    write HDGFMT;
  endif;

  write DTLFMT;

  read CUSTMAST;
enddo;
```

This short example already reflects the correct pattern: the heading
writes once before the loop, and again only when the overflow indicator
signals a new page, never once per detail line.

## Why It Matters

Almost every beginner mistake with printer files and basic reports traces
back to one of a small number of familiar issues. Recognizing this short,
repeatable list turns report debugging into a quick checklist, and helps
new report programs avoid these mistakes from the start.

## Practical Example

Imagine reviewing a new report program where every single page, including
the first, seems to reprint the heading far too often, once per customer
rather than once per page. Checking against this list quickly surfaces
the likely cause: the heading write statement was placed inside the
detail loop rather than only before it and on overflow, exactly the
mistake described above.

This is a simplified, illustrative example rather than a specific real
review, but it reflects how useful a short, known list of common mistakes
is when reading or debugging report code.

## Common Confusions

**"Are these mistakes only made by beginners?"**
They are most common among beginners, but even experienced developers
occasionally slip up on one of these, especially the overflow indicator
check when converting an existing report to a new layout. The value of
this list is in having a quick, repeatable checklist to reach for,
regardless of experience level.

**"Is this the complete list of every possible printer file mistake?"**
No. This lesson focuses on the most common mistakes connected to the
beginner-level printer file concepts covered across this lesson group.
More advanced topics, such as AFP, IPDS, overlays, and detailed output
management, have their own separate considerations beyond this
introduction.

**"Which mistake on this list is most important to avoid?"**
All five matter, but writing the heading inside the detail loop is likely
the single most immediately noticeable mistake, since it produces an
obviously wrong-looking report the very first time it runs, unlike some
of the other mistakes on this list.

## Quick Recap

- The most common printer file mistakes are: writing the heading inside
  the detail loop, forgetting page overflow handling, confusing record
  format types, assuming `WRITE` always behaves the same regardless of
  file type, and confusing a spool file with an output queue.
- Checking this short list first turns report debugging into a quick
  checklist rather than an open-ended search.
- This list focuses on the beginner-level printer file concepts covered in
  this lesson group; more advanced topics have their own separate
  considerations.
- Even experienced developers occasionally make these same mistakes,
  which is exactly why the checklist stays useful over time.

## Try Asking the AI Tutor

Use the AI Tutor to ask follow-up questions about this lesson. For
example, try asking:

- "Which of these common mistakes is easiest to accidentally reintroduce
  when modifying an existing report?"
- "How would I explain the heading-inside-the-loop mistake to someone new
  to printer files?"
