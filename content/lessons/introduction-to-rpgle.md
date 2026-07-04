# Introduction to RPGLE

## Learning Objective

By the end of this lesson, you will understand what RPGLE is, why it is used on
IBM i, and how it connects to the platform, libraries and objects, 5250 screens,
and physical and logical files covered in earlier lessons.

## Simple Explanation

RPGLE is a business application programming language commonly used to build
software on IBM i. The name traces back to "Report Program Generator," but modern
RPGLE is used for far more than reports; it is a general-purpose language for
building the kind of business applications IBM i is known for.

RPG has evolved a great deal over time. Older RPG code was written in a strict,
column-based style often called "fixed-format." Modern RPGLE increasingly uses a
more flexible style often called "free-format," which reads more like other
programming languages. Both styles exist in real use today, and you may encounter
either one, sometimes even mixed together in the same program.

It helps to think of RPGLE programs as the workers that carry out the platform's
day-to-day business logic. An RPGLE program commonly reads and writes data stored
in physical and logical files, applies business rules to that data, and supports
5250 screens, batch jobs, reports, and integrations with other systems.

## Why It Matters

RPGLE connects together nearly everything covered so far in this path. It runs on
the IBM i platform (Lesson 3), works with libraries and objects (Lesson 4), often
drives what a user sees on a 5250 screen (Lesson 5), and reads and writes data
through physical and logical files (Lesson 6). Understanding RPGLE at a conceptual
level helps these earlier lessons click together into a fuller picture of how an
IBM i business application actually works.

RPGLE also matters because, much like the platform itself, it is not a fading
technology. It continues to be actively used and modernized for real business
applications today.

## Practical Example

Imagine a returns-processing program at a retail company. When a customer wants to
return an item, the program looks up the original order record stored in a
physical file. It checks a business rule, such as whether the return is being
requested within the allowed time window, and then updates a status field on that
record to reflect the outcome.

None of this requires the person running the program to know how it works
internally; they simply interact with a screen, and the RPGLE program behind it
carries out the logic. This is a simplified, illustrative example rather than a
real system, but it reflects the kind of everyday task RPGLE programs commonly
handle.

## Common Confusions

**"Is all RPG code the same?"**
No. Because RPG has evolved over decades, you may encounter older fixed-format
code and newer free-format code, sometimes even within the same program. Both
styles are used to accomplish similar goals, even though they look different.

**"Is RPGLE only used for old, legacy systems?"**
No. RPGLE remains actively used and modernized for real business applications
today, in the same way the IBM i platform itself continues to be actively
maintained, as covered in Lesson 2.

**"Do I need to learn detailed programming concepts right now?"**
No. This lesson stays at a conceptual level. Deeper programming details are
beyond the scope of this introductory lesson.

## Quick Recap

- RPGLE is a business application programming language commonly used to build
  software on IBM i.
- RPG has evolved over time; you may encounter older fixed-format code and newer
  free-format code.
- RPGLE programs commonly read and write files, apply business rules, and support
  screens, batch jobs, reports, and integrations.
- RPGLE connects together the platform, libraries and objects, 5250 screens, and
  physical and logical files covered in earlier lessons.
- RPGLE is actively used and modernized today, not a legacy-only technology.

## Try Asking the AI Tutor

Once the AI Tutor is available, you will be able to ask follow-up questions about
anything in this lesson. One thing you might ask:

- "What's the difference between fixed-format and free-format RPGLE?"
