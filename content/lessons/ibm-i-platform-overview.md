# IBM i Platform Overview

## Learning Objective

By the end of this lesson, you will have a high-level map of the major parts of the
IBM i platform and how they fit together. This lesson is a map, not a deep dive --
several of these pieces get their own dedicated lesson later in this path.

## Simple Explanation

Lessons 1 and 2 introduced IBM i as an integrated platform running on IBM Power
Systems hardware. This lesson connects those ideas by walking through the major
pieces that make up that platform:

- The IBM i operating environment itself, which manages the hardware and runs
  programs.
- Db2 for i, the relational database built directly into the platform.
- Security, which on IBM i is controlled at the level of individual objects rather
  than added on as a separate layer.
- Job and work management, which controls how programs run and share system
  resources.
- Libraries and objects, the way IBM i organizes everything it manages, from
  programs to data.
- The 5250 interface, the classic terminal-style screen many people picture when
  they think of IBM i.
- A development and runtime environment for building and running business
  applications.

Each of these pieces works with the others rather than existing in isolation, which
is part of what makes IBM i feel different from assembling a system out of separate
products.

## Why It Matters

Having this map before going deeper matters for two reasons. As a beginner, it gives
you a place to fit each new detailed topic as you learn it, instead of encountering
libraries, security, or the 5250 interface as disconnected facts. As a working
developer, being able to describe how these pieces relate to each other is useful
when explaining the platform to teammates, managers, or newcomers.

## Practical Example

Imagine a warehouse worker starting their shift. They sit down at a terminal and log
in through a 5250 screen. From there, they run a program that looks up an order in
Db2 for i tables, which are organized inside libraries alongside the other objects
that make up that application.

Object-level security controls whether this worker's account is even allowed to view
or update that data, and job management is quietly coordinating this task alongside
everything else running on the system at the same time. None of these pieces do
their job alone; the task only works because the OS, the database, security, job
management, and the interface are all working together.

This is a simplified, illustrative example rather than a real system, but it shows
how the pieces introduced above cooperate on an ordinary task.

## Common Confusions

**"Is the 5250 screen the same thing as IBM i?"**
No. The 5250 interface is one way of interacting with IBM i, and a very recognizable
one, but it is not the platform itself. IBM i also supports other, more modern ways
of interacting with applications.

**"Are IBM i libraries the same as code libraries in other programming languages?"**
No, and this is worth flagging early. On IBM i, a library is an organizational
container that holds objects such as programs and files, closer to a folder than to
a reusable code package. Lesson 4 covers libraries and objects in depth.

**"Is IBM i's security something added on top, like antivirus software?"**
No. Security on IBM i is built into the object model itself, controlling access at
the level of individual objects rather than being bolted on as a separate product.

## Quick Recap

- IBM i is made up of several integrated pieces: the operating environment, Db2 for
  i, security, job management, libraries and objects, the 5250 interface, and a
  development and runtime environment.
- These pieces work together rather than in isolation.
- The 5250 interface is one way to interact with IBM i, not the platform itself.
- An IBM i library organizes objects; it is not a code library in the programming
  sense.
- Security on IBM i is built into the object model, not added on separately.
- Later lessons in this path cover several of these pieces in more depth.

## Try Asking the AI Tutor

Once the AI Tutor is available, you will be able to ask follow-up questions about
anything in this lesson. One thing you might ask:

- "How do libraries, objects, and Db2 for i files all fit together on IBM i?"
