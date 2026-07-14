# Why APIs Matter on IBM i

## Learning Objective

By the end of this lesson, you will be able to explain what an API is
in plain terms, and why APIs are the key building block for
integrating IBM i with other systems.

## Simple Explanation

An **API**, short for Application Programming Interface, is a defined
way for one piece of software to ask another piece of software to do
something, and get a result back. It is not a specific technology or
product; it is a concept: an agreed-upon way to make a request and
receive a response, without needing to know how the other side is
built internally.

Think of an API the way you might think of a restaurant menu. You do
not need to know how the kitchen is organized or how a dish is cooked;
you order from a defined list of options, and the kitchen returns a
finished dish. The menu is the interface: it defines what you can ask
for and what you will get back, without exposing everything happening
behind the scenes.

On IBM i, this means a web application, a mobile app, or another
system can ask an IBM i program to do something, such as "check if
this customer number is valid," without needing to know that the
answer comes from an RPGLE program, a Db2 for i table, or a specific
library on a specific system.

## Why It Matters

Without an API, integrating with IBM i logic usually means the other
system has to know IBM i-specific details: library names, program
names, file layouts, or how to sign on to a 5250 session and drive a
screen. An API hides all of that behind a simple, defined request and
response. This is what makes it realistic for very different kinds of
systems, a web app, a mobile app, IBM i itself, to work together
without each one needing deep knowledge of how the others are built.

## Practical Example

Imagine a customer number validation rule that already exists as an
RPGLE procedure. Today, only 5250 screens and batch jobs can use it,
because they know exactly which library and program to call. If that
same validation is instead reachable through an API, a mobile app
built by a completely different team, using a completely different
programming language, can ask the same question, "is this customer
number valid?", and get back the same trusted answer, without knowing
anything about RPGLE, libraries, or IBM i internals.

This is a simplified, illustrative example rather than a specific real
system, but it reflects exactly why APIs matter for integration.

## Common Confusions

**"Is an API a specific product or piece of software I need to
install?"**
No. An API is a concept: a defined way to request something and get a
response. The lessons ahead will look at REST, one common style of
building APIs, but the underlying idea of a request and a response
applies more broadly.

**"Does having an API mean the underlying IBM i program has to
change?"**
Not necessarily. The existing RPGLE or SQLRPGLE logic can often stay
exactly as it is. What an API adds is a new, defined way for other
systems to reach that logic, which later lessons in this batch explore
in more detail.

**"Is an API only useful for web or mobile applications?"**
No. Any two systems that need to exchange a request and a response can
use an API-based approach, including two different IBM i applications,
or an IBM i system and a partner company's system.

## Quick Recap

- An API is a defined way for one system to request something from
  another system and receive a response back.
- APIs hide internal details, such as library names, program names, or
  file layouts, behind a simple, agreed-upon interface.
- APIs are what make it realistic for very different systems to
  integrate with existing IBM i logic without needing deep IBM i
  knowledge.
- The existing RPGLE or SQLRPGLE logic behind an API often does not
  need to change; the API adds a new way to reach it.

## Try Asking the AI Tutor

Use the AI Tutor to ask follow-up questions about this lesson. For
example, try asking:

- "Can you give me another everyday, non-technical analogy for what an
  API does?"
- "Why would a company prefer building an API over just giving another
  system direct access to its IBM i database?"
