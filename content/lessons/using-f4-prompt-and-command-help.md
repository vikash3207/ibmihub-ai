# Using F4 Prompt and Command Help

## Learning Objective

By the end of this lesson, you will know how to use the F4 prompt to fill in
a command's parameters interactively, and how to use IBM i's built-in command
help instead of memorizing every parameter yourself.

## Simple Explanation

In the previous lesson, you learned that IBM i commands accept parameters
that specify exactly what you want the command to do. You do not need to
memorize every parameter's name or exact typing rules to use a command
correctly, because IBM i provides an interactive prompt built directly into
the 5250 interface.

If you type a command name, such as `CRTLIB`, and press the **F4** key
instead of Enter, IBM i displays a prompt screen listing every parameter the
command accepts, along with a short description of each one and, often, a
default value already filled in. You can move between fields on this prompt
screen, type in the values you want, and press Enter to run the command with
exactly those parameters, without needing to have typed the full command
syntax by hand.

Pressing F4 with no command name typed at all opens a broader command prompt
that helps you search for a command in the first place. And when you want to
understand what a parameter actually means, most prompt screens let you
position your cursor on that parameter and press the **help** key or F1 to
see a more detailed explanation.

## Why It Matters

New IBM i users sometimes assume that using the command line means typing
long, exact command syntax from memory, which feels intimidating and easy to
get wrong. In practice, F4 prompting means you rarely need to memorize exact
parameter syntax at all. You can type a command name you already recognize,
press F4, read what each parameter means, fill in only the values relevant
to your task, and let IBM i handle the rest. This turns command entry from a
memorization exercise into a much more approachable, guided process.

## Practical Example

Imagine a developer who wants to create a new library but does not remember
every optional parameter `CRTLIB` accepts. Instead of guessing or searching
documentation first, they type `CRTLIB` on the command line and press F4.
IBM i displays a prompt screen showing the library name field, a text
description field, and several other optional settings, each with a brief
description.

The developer fills in the library name, leaves the optional fields at their
sensible defaults, and presses Enter to create the library successfully,
having never needed to type the full command syntax by hand or memorize every
parameter name in advance. This is a simplified, illustrative example rather
than every possible use of F4 prompting, but it reflects a very common,
everyday IBM i workflow.

## Common Confusions

**"Do I need to already know a command's parameters before I can use F4?"**
No. That is precisely the point of F4 prompting: it shows you the available
parameters, their meanings, and often their default values, so you can learn
and use a command without having memorized its exact syntax first.

**"Is F4 only useful for beginners?"**
No. Experienced IBM i developers use F4 prompting regularly too, especially
for commands with many optional parameters they do not use often enough to
have memorized. It is a normal part of everyday workflow at every experience
level, not a beginner-only crutch.

**"What is the difference between F4 and pressing the help key?"**
F4 prompts for a command's parameters so you can fill them in and run the
command. The help key, often F1, gives you a more detailed explanation of
whatever field your cursor is currently positioned on, which is useful when a
parameter's purpose is not clear from its short description alone.

## Quick Recap

- Pressing F4 after typing a command name opens a prompt screen listing that
  command's parameters, descriptions, and default values.
- Pressing F4 with no command typed opens a broader prompt to help you find a
  command in the first place.
- The help key, often F1, gives a more detailed explanation of whatever field
  your cursor is on within a prompt screen.
- F4 prompting means you do not need to memorize exact command syntax, and it
  is used regularly by developers at every experience level, not just
  beginners.

## Try Asking the AI Tutor

Use the AI Tutor to ask follow-up questions about this lesson. For example,
try asking:

- "What happens if I press Enter on a prompt screen without filling in a
  required parameter?"
- "Can I use F4 prompting on any IBM i command, or only some of them?"
