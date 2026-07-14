# Understanding IBM i Command Structure

## Learning Objective

By the end of this lesson, you will be able to read an IBM i command, explain
what its naming pattern usually tells you, and understand how command names
and parameters fit together on a 5250 command entry screen.

## Simple Explanation

Once you are signed on to IBM i, one of the main ways to get things done is
by typing commands at a command line, often directly on a 5250 screen. IBM i
commands share a consistent structure that, once you recognize it, makes even
unfamiliar commands easier to guess at.

Most IBM i commands are named using a **verb-plus-object** pattern, usually
abbreviated to a short code. For example:

- `CRTLIB` stands for **Create Library**.
- `DSPLIB` stands for **Display Library**.
- `WRKOBJ` stands for **Work with Object**.
- `DLTLIB` stands for **Delete Library**.

Notice the pattern: the first part of the name is usually a verb like Create
(CRT), Display (DSP), Work with (WRK), or Delete (DLT), and the second part
names what the verb applies to, like Library (LIB) or Object (OBJ). Once you
recognize a handful of these verb and object abbreviations, you can often make
a reasonable guess at what an unfamiliar command does just from its name.

After the command name, most commands accept **parameters**, which further
specify exactly what you want to happen. For example, running `CRTLIB` requires
telling IBM i the name of the library you want to create. Parameters can be
typed directly after the command name on the command line, or, as you will see
in the next lesson, filled in on a prompt screen that IBM i can display for
you.

## Why It Matters

Beginners often feel like IBM i commands are a wall of cryptic abbreviations
to memorize one by one. Recognizing the verb-plus-object pattern turns that
into something much more manageable: instead of memorizing hundreds of
unrelated command names, you learn a smaller set of common verb and object
abbreviations and start recognizing them everywhere. This is one of the most
practical, immediately useful mental shortcuts a newcomer to IBM i can build.

## Practical Example

Imagine a new developer who already knows that `WRK` commonly means "Work
with" and `LIB` commonly means "Library," because they have seen `WRKLIB`
used before. When they later encounter an unfamiliar command called `WRKOBJ`,
they can reasonably guess it means "Work with Object," even before looking it
up, because they already recognize the `WRK` part of the pattern from a
different command.

This kind of pattern recognition builds up naturally over time simply from
being exposed to more commands, and it is a normal, expected part of getting
comfortable with IBM i. This is a simplified, illustrative example rather
than a guarantee that every command name is fully predictable, but it
reflects a genuinely common and useful pattern.

## Common Confusions

**"Do I need to memorize every IBM i command to get started?"**
No. Recognizing common naming patterns, like verb abbreviations such as CRT,
DSP, WRK, and DLT, combined with object abbreviations like LIB and OBJ, lets
you make reasonable guesses about many commands without memorizing each one
individually.

**"Are command names case-sensitive?"**
No. IBM i commands are not case-sensitive; `CRTLIB`, `crtlib`, and `CrtLib`
all refer to the same command. Commands are conventionally written in
uppercase in documentation and by many experienced users, but this is a
convention, not a technical requirement.

**"What happens if I type a command without any parameters?"**
Behavior varies by command. Some commands have required parameters and will
prompt you or show an error if you leave them out; others have sensible
defaults for optional parameters. Understanding this fully connects closely
to command prompting, which the next lesson covers in more detail.

## Quick Recap

- Most IBM i commands follow a verb-plus-object naming pattern, such as CRT
  (Create), DSP (Display), WRK (Work with), or DLT (Delete), combined with an
  object abbreviation like LIB (Library) or OBJ (Object).
- Recognizing common verb and object abbreviations lets you make reasonable
  guesses about unfamiliar commands, rather than needing to memorize every
  command individually.
- Commands accept parameters that further specify what you want the command
  to do, which can be typed directly or filled in using a prompt screen.
- IBM i command names are not case-sensitive, though uppercase is a common
  convention.

## Try Asking the AI Tutor

Use the AI Tutor to ask follow-up questions about this lesson. For example,
try asking:

- "What are some other common verb abbreviations used in IBM i commands
  besides CRT, DSP, WRK, and DLT?"
- "How do I know which parameters a command like CRTLIB actually needs?"
