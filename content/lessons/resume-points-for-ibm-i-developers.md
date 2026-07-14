# Resume Points for IBM i Developers

## What This Lesson Prepares You For

This lesson helps you turn the mini projects and concepts from this
course into honest, specific resume points, without exaggerating your
experience or making claims this course cannot back up.

## Concepts to Revise First

- Explaining Your IBM i Project Experience.
- The Customer Inquiry Program, Order Entry Skeleton, and Printer File
  Report with Totals mini projects.
- The CLLE Wrapper to Run a Report mini project.

## Common Interview or Job Discussion Scenarios

- A resume line describing a course project being read back to you, with
  a follow-up question about it.
- "What does this resume point actually mean, in your own words?"
- "Can you show me the code behind this line on your resume?"

## Strong Beginner-Level Answer Approach

A strong resume point is specific and honest about scale: it names the
concrete technology and pattern used, without inflating a small course
project into something it wasn't. For example: "Built an interactive
RPGLE inquiry program using a display file and keyed native file
access with error handling for not-found records" describes the Customer
Inquiry Program mini project accurately and specifically, without
overstating it as a production system.

## Weak Answers to Avoid

- Writing resume points so vague they could describe anything, like
  "Worked with IBM i technologies."
- Describing a small course project with language like "enterprise-scale"
  or "production system," which does not match its actual scope and
  invites a question you cannot honestly answer.
- Listing a technology or pattern you have not actually used in any
  project, since a resume point should be defensible if someone asks you
  to explain it.

## Scenario-Based Practice

Imagine turning the Printer File Report with Totals mini project into a
resume point. A weak version: "Created reports for a business." A strong
version: "Wrote an RPGLE report program producing a control-break report
with per-customer subtotals and a grand total, reading a keyed file in
natural key order." The strong version is specific enough that you could
confidently answer a follow-up question about how the control break was
detected.

## How to Explain Your Thinking Clearly

When asked to explain a resume point, a good structure is: name the
concept, name the specific IBM i mechanism involved, and connect it to
the actual project. For example: "The control break here means the
report prints a subtotal every time the customer number changes, which I
detected by comparing the current record's `CUSTNBR` to the previous
one inside the read loop, exactly the pattern from the Printer File
Report with Totals mini project."

## Practical IBM i Example

```rpgle
if CUSTNBR <> prevCustNbr and prevCustNbr <> 0;
  write SUBFMT;
  custSubtotal = 0;
endif;
```

If a resume point mentions "control-break reporting," being able to
point at this exact snippet and explain it, in your own words, is what
makes the resume point credible rather than just a phrase you copied.

## Mini Practice Task

Write two resume points based on two different mini projects from this
course. For each one, write a follow-up sentence explaining, in your own
words, what the resume point actually means technically.

## Quick Recap

- A strong resume point is specific about the technology and pattern
  used, not vague or inflated.
- Never write a resume point you could not explain in detail if asked.
- Describing a small course project honestly, at its real scale, is
  stronger than exaggerating it, since exaggeration tends to fall apart
  under a follow-up question.

## Try Asking the AI Tutor

Use the AI Tutor to practice resume points. For example, try asking:

- "Can you help me turn my order entry mini project into a specific,
  honest resume point?"
- "How would I answer a follow-up question about a resume point
  mentioning control-break reporting?"
