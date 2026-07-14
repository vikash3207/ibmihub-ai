# IBM i Developer Interview Roadmap

## What This Lesson Prepares You For

This lesson is a map, not a technical deep dive. It explains how the
Interview and Professional Readiness lessons fit together, what an IBM i
developer interview typically covers, and how to use the rest of this
course to prepare for one with realistic expectations.

## Concepts to Revise First

Before working through this batch, you should already be comfortable
with the foundation-level material from earlier in this course:

- RPGLE basics: program structure, variables, `IF`/`SELECT`, loops, and
  built-in functions.
- Native RPGLE file I/O: `dcl-f`, `CHAIN`, `%FOUND`, `WRITE`, `UPDATE`,
  `DELETE`.
- CLLE basics: what CLLE is for, and simple orchestration with `MONMSG`.
- SQLRPGLE basics: `SELECT INTO`, `SQLCODE`, and how embedded SQL relates
  to native file I/O.
- Display files and subfiles: how a screen program is structured, and how
  a subfile lists multiple rows.
- The basic troubleshooting flow: job log first, then debugging tools if
  needed.

If any of those feel shaky, it is worth revisiting them before spending
time on interview-specific practice. Interviewers can usually tell the
difference between someone who has memorized a definition and someone
who actually understands the concept behind it.

## Common Interview Questions

For an entry-level or junior IBM i developer role, questions tend to
cluster around a few themes:

- "Walk me through what happens when this RPGLE program runs."
- "What is the difference between a physical file and a logical file?"
- "When would you use CLLE instead of RPGLE, or the other way around?"
- "How would you look up one record by key in RPGLE?"
- "What is a subfile, and why would you use one instead of just printing
  a list?"
- "How would you start troubleshooting a program that isn't working?"

## Good Beginner-Level Answers

A good beginner-level answer is honest about your current level while
still showing real understanding. For example, instead of trying to sound
like a ten-year veteran, a strong answer to "what is a subfile?" might be:
"A subfile lets a 5250 screen show many rows at once, like a list of
orders, instead of one record at a time. You load it by writing multiple
subfile records, then display it with the subfile control record format."
This is short, technically correct, and shows real understanding without
overselling your experience.

## Scenario-Based Questions

Many interviewers move beyond definitions into small scenarios, such as:
"A user says a screen shows the wrong customer balance. How would you
start looking into that?" or "A batch job usually finishes by 6 AM, but
today the report is missing. What would you check first?" These
questions are covered in depth in later lessons in this batch,
particularly Debugging Scenario-Based Questions and Real Support Ticket
Analysis for Beginners.

## How to Explain Your Thinking

Interviewers are often more interested in how you reason through a
problem than whether you land on the exact right answer instantly. A
useful habit is to say your thinking out loud, in order: what you would
check first, why that check comes first, and what you would do next
depending on what you find. This mirrors the actual troubleshooting flow
covered in the Basic Troubleshooting Flow for IBM i Developers lesson:
job log first, then narrow down from there, rather than guessing at a
root cause immediately.

## Common Weak Answers to Avoid

- Reciting a memorized definition without being able to apply it to a
  small scenario.
- Claiming familiarity with tools or patterns you have not actually used,
  which usually becomes obvious with one follow-up question.
- Jumping straight to "I'd just start debugging" without mentioning the
  job log or the actual symptom first.
- Treating every question as a trivia question instead of an opportunity
  to explain reasoning.

## Practical Examples

Imagine being asked: "What is the difference between CHAIN and SETLL in
RPGLE?" A weak answer restates both keywords without contrast. A better
answer explains the relationship: "CHAIN retrieves a specific record by
key and tells you with %FOUND whether it existed. SETLL positions you at
or after a key without retrieving a record itself, which is usually
followed by READE to process a group of matching records." This kind of
answer shows the concepts connect to each other, not just that you can
name them.

## Mini Practice Task

Before moving to the rest of this batch, write down, in your own words,
one-paragraph answers to these three questions: What is IBM i, in simple
terms? What is the difference between a physical file and a logical
file? What is one thing you would check first if a report did not
generate overnight? Keep your answers short and practical, not
textbook-perfect. You will build on this habit throughout the rest of
this batch.

## Quick Recap

- This batch focuses on explaining IBM i concepts clearly, not on
  guaranteeing any interview outcome.
- Strong answers connect concepts to small scenarios rather than reciting
  definitions.
- Explaining your reasoning step by step matters as much as reaching the
  right answer.
- The rest of this batch covers RPGLE, RPGLE file I/O, CLLE, SQLRPGLE,
  display files and subfiles, debugging, and realistic support ticket
  scenarios, in that order.

## Try Asking the AI Tutor

Use the AI Tutor to practice explaining IBM i concepts out loud, the way
you would in an actual interview. For example, try asking:

- "Can you ask me a beginner-level IBM i interview question and give me
  feedback on how I answer it?"
- "How would I explain the difference between CHAIN and SETLL to someone
  who has never used RPGLE?"
