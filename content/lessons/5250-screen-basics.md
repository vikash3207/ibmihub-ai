# 5250 Screen Basics

## Learning Objective

By the end of this lesson, you will understand what a 5250 screen is, how people
navigate one at a beginner level, and why it is an interface used to interact with
IBM i rather than IBM i itself.

## Simple Explanation

A 5250 screen, or 5250 session, is a text-based way of interacting with IBM i.
Historically, people connected using physical 5250 terminals; today, the same kind
of session is almost always reached through emulator software running on a regular
PC. People often call this a "green screen," a nickname from the original terminal
displays, though a modern session does not have to actually appear green; the name
has simply stuck around.

It helps to picture a 5250 screen as having a few recurring building blocks:

- A command line, where you can type a command to tell the system what to do next.
- Menu options, numbered choices you select to move to a different screen or task.
- Function keys, often labeled F1 through F24, mapped to specific actions such as
  exiting a screen or getting help.
- Input fields, spots on the screen where you type information.
- Output fields, spots where the system displays information back to you.
- Messages, short lines of feedback the system shows, such as confirming an action
  or reporting a problem.

None of this is the IBM i platform itself. It is simply one interface for interacting
with programs and data that live on IBM i, in the same spirit as Lesson 3's point that
the platform is separate from any single way of accessing it.

## Why It Matters

Many IBM i business applications were built to run on 5250 screens, and, as Lesson 2
covered, replacing a working business system is a slow and deliberate decision. As a
result, plenty of real, active applications still rely on 5250 screens today.

At the same time, 5250 is not the only option. Modern web-based and graphical
interfaces can also be built to work with the same underlying IBM i systems. Knowing
how a 5250 screen works gives you a foundation for understanding a very common part
of the IBM i world, without assuming it is the only way applications are built today.

## Practical Example

Imagine a customer service representative looking up the status of an order. They
log in to a 5250 session and see a menu of numbered options. They type the number
for "Check Order Status" and press Enter.

On the next screen, an input field asks for an order number. After typing it in and
pressing Enter, output fields on the same screen display the order's status and
quantity. When they are finished, they press a function key to return to the
previous menu. This is a simplified, illustrative example rather than a real
application, but it reflects the kind of everyday task a 5250 screen supports.

## Common Confusions

**"Is a 5250 screen the same thing as IBM i?"**
No. As covered in Lesson 3, a 5250 screen is one interface used to interact with
IBM i, not the platform itself. IBM i keeps running the same way whether someone is
using a 5250 screen or another interface entirely.

**"Does 'green screen' mean this technology is outdated or unsupported?"**
No. "Green screen" is simply a nickname from the appearance of early terminal
displays. Many organizations actively use and maintain 5250 applications today; the
nickname describes its look and history, not whether it is still in real use.

**"Is 5250 the only way to interact with IBM i?"**
No. Modern web-based and graphical interfaces can also be built on top of IBM i.
5250 remains common, especially for existing applications, but it is one option
among others rather than a requirement.

## Quick Recap

- A 5250 screen, or session, is a text-based interface for interacting with IBM i,
  historically tied to physical terminals and now typically reached through
  emulator software.
- "Green screen" is a nickname from its history, not a sign that it is outdated or
  no longer maintained.
- Common building blocks include the command line, menu options, function keys,
  input fields, output fields, and messages.
- Many existing IBM i business applications still use 5250 screens, but modern web
  and graphical interfaces can also exist alongside them.
- A 5250 screen is an interface to IBM i, not IBM i itself.

## Try Asking the AI Tutor

Once the AI Tutor is available, you will be able to ask follow-up questions about
anything in this lesson. One thing you might ask:

- "What do function keys like F3 typically do on a 5250 screen?"
