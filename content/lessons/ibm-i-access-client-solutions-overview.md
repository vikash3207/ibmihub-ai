# IBM i Access Client Solutions Overview

## Learning Objective

By the end of this lesson, you will understand what IBM i Access Client
Solutions (ACS) is, what it lets you do from a Windows, Mac, or Linux
computer, and how it fits alongside the 5250 terminal experience you have
already learned about.

## Simple Explanation

IBM i itself runs on Power Systems hardware, but almost nobody sits directly
in front of that hardware to use it. Instead, people connect to IBM i from an
ordinary desktop or laptop computer using client software. IBM i Access
Client Solutions, usually just called ACS, is IBM's official, free client
application for doing exactly that.

ACS is not one single tool; it is a collection of tools bundled together,
including:

- A **5250 emulator**, which displays the green-screen interface you learned
  about in the 5250 Screen Basics lesson, letting you sign on and interact
  with IBM i menus and command entry screens from your own computer.
- A **database tool**, which lets you browse tables, run SQL statements, and
  look at data stored in Db2 for i without needing to navigate a 5250 screen
  at all.
- An **Integrated File System (IFS) tool**, for browsing and transferring
  files stored in IBM i's file-system-like storage area.
- Additional utilities for tasks like transferring data between IBM i and
  your PC, and managing print output.

ACS runs on your everyday computer; it is a client, not the IBM i operating
system itself. IBM i keeps running on its own hardware regardless of which
computer or which tool someone uses to connect to it.

## Why It Matters

Beginners sometimes assume the 5250 green screen is the only way to work with
IBM i, which can make the platform feel more limited or old-fashioned than it
actually is. In practice, IBM i developers use ACS constantly, often keeping
its 5250 emulator open in one window while using its SQL and IFS tools in
others. Knowing that ACS exists, and knowing roughly what each of its parts
does, helps you understand what a typical IBM i developer's desktop actually
looks like day to day.

## Practical Example

Imagine a new developer's first day on an IBM i team. Their manager has them
install IBM i Access Client Solutions on their laptop. Using ACS, they open a
5250 session to sign on and look at an existing menu-driven application,
switch to the database tool to run a simple SQL query and see what data looks
like in a table, and use the IFS tool to look at a folder of configuration
files.

All three of these activities happen from the same ACS installation, without
the developer ever touching the physical Power Systems hardware directly.
This is a simplified, illustrative example rather than a specific real
company's exact setup, but it reflects a common, realistic first-week
experience.

## Common Confusions

**"Is ACS the same thing as IBM i?"**
No. IBM i is the operating system running on Power Systems hardware. ACS is
client software you install on your own PC or Mac to connect to and work
with an IBM i system.

**"Do I need ACS if I already know how to use a 5250 screen?"**
The 5250 emulator inside ACS is how most people access a 5250 screen in the
first place, from a regular computer rather than a dedicated terminal. ACS
also includes tools beyond 5250 emulation, such as the SQL and IFS tools, that
are commonly used alongside 5250 sessions, not instead of them.

**"Is ACS the only way to connect to IBM i?"**
No. Other tools and emulators exist, and some organizations use different
software for specific tasks. ACS is significant because IBM provides and
maintains it directly as the standard, freely available option, which is why
it is worth learning first.

## Quick Recap

- IBM i Access Client Solutions (ACS) is IBM's free client software for
  connecting to and working with IBM i from a regular computer.
- ACS bundles several tools together, including a 5250 emulator, a database
  (SQL) tool, and an Integrated File System (IFS) tool.
- ACS is client software, not the IBM i operating system itself; IBM i keeps
  running on its own hardware regardless of which client tool is used.
- IBM i developers commonly use several ACS tools side by side as part of
  normal, everyday work.

## Try Asking the AI Tutor

Use the AI Tutor to ask follow-up questions about this lesson. For example,
try asking:

- "What is the difference between the 5250 emulator in ACS and the database
  tool in ACS?"
- "Do I need special permission from IBM to install ACS?"
