# Modern IBM i Development Overview

## Learning Objective

By the end of this lesson, you will be able to explain what "modern IBM
i development" actually means, and why it is about exposing and
integrating existing business logic rather than replacing IBM i
itself.

## Simple Explanation

"Modern IBM i" can sound like it means moving away from RPGLE, moving
away from the 5250 screen, or replacing IBM i with something else
entirely. It does not mean any of that. Modern IBM i development means
taking business logic that already runs successfully on IBM i, often
in RPGLE or SQLRPGLE programs that have worked correctly for years, and
making it usable by other systems: a web application, a mobile app, a
partner's system, or another internal application.

The core idea is **integration, not replacement**. The RPGLE program
that validates a customer number or looks up an order still runs
exactly as it always has. What changes is how other systems reach that
logic: instead of only being callable from a 5250 screen or a batch
job, it becomes reachable through an **API**, a defined way for one
system to ask another system to do something and get a response back.

## Why It Matters

Every business has logic that already exists and already works:
validation rules, lookups, calculations, approval steps. Rewriting all
of that from scratch to "modernize" it would be slow, risky, and wasteful.
Understanding modernization as integration, rather than replacement,
changes the whole approach: the goal becomes finding safe ways to reach
existing logic from new places, not rebuilding it somewhere else.

## Practical Example

Imagine a company's order-entry system has long relied on an RPGLE
program that checks whether a customer number is valid before an order
is accepted. For years, this program was only ever called from a 5250
screen. Now the company wants a new web storefront to check the same
customer number before showing pricing. Modernizing this does not mean
rewriting the validation logic in a web programming language. It means
making that existing RPGLE logic reachable from the web storefront,
through an API, so the exact same trusted rule applies in both places.

This is a simplified, illustrative example rather than a specific real
system, but it reflects the everyday shape of this kind of
modernization work.

## Common Confusions

**"Does modern IBM i development mean IBM i is being phased out?"**
No. IBM i, RPGLE, and existing business logic remain exactly where
they are and continue running as they always have. Modernization is
about extending how that logic can be reached, not removing it.

**"Do I need to learn a completely new programming language for this?"**
Not for the concepts in this batch. The lessons ahead focus on ideas
like APIs, requests, responses, and data formats, which apply on top
of the RPGLE, SQLRPGLE, and CLLE skills already covered in this
course, rather than replacing them.

**"Is this the same as a full rewrite or migration project?"**
No. A full rewrite replaces existing logic with new logic elsewhere.
Integration, the focus of this batch, keeps the existing, trusted logic
in place and adds a new way to reach it.

## Quick Recap

- Modern IBM i development is about exposing and integrating existing
  business logic, not replacing IBM i or rewriting RPGLE from scratch.
- The core idea is making trusted, already-working logic reachable
  from other systems, such as web or mobile applications.
- This batch builds on existing RPGLE, SQLRPGLE, CLLE, and IFS
  knowledge already covered in this course.
- Later lessons in this batch introduce the specific building blocks:
  APIs, REST concepts, JSON, and integration patterns.

## Try Asking the AI Tutor

Use the AI Tutor to ask follow-up questions about this lesson. For
example, try asking:

- "Can you give me another realistic example of existing IBM i logic
  that a company might want to expose to a new system?"
- "Why is rewriting existing business logic from scratch usually
  riskier than integrating with it?"
