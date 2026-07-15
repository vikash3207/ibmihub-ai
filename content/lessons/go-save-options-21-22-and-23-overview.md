# GO SAVE Options 21, 22, and 23 Overview

## Learning Objective

By the end of this lesson, you will be able to explain, at an overview
level, what `GO SAVE` options 21, 22, and 23 are for.

## Simple Explanation

Every save covered so far in this batch has targeted a specific object
or library. IBM i also provides `GO SAVE`, a menu of options for saving
much larger, broader scopes of the system at once. Three of its most
common options are:

- **Option 21**: saves the entire system, everything on it.
- **Option 22**: saves system data specifically, without user
  libraries.
- **Option 23**: saves all user libraries and associated authority
  information, without the base system data.

```clle
GO SAVE
```

Running this command displays the menu these options, and others, are
selected from.

## Why It Matters

Understanding that these broader, whole-system-scope save options
exist, and roughly what each one covers, helps a developer recognize
references to them, such as in a shop's documented backup schedule or
during a conversation about recovery planning, even without personally
running them. This is different in scale and purpose from the
object-level and library-level saves already covered earlier in this
batch, which are far more common for everyday development work.

## Practical Example

Imagine a shop's overall backup schedule mentions that "option 21 runs
monthly, and option 23 runs nightly." Recognizing that option 21 covers
the entire system while option 23 covers just user libraries and
authority information helps a developer understand roughly what each
scheduled save actually protects, without needing to run either
personally.

This is a simplified, illustrative example rather than a specific real
backup schedule, but it reflects exactly the kind of context this
lesson is meant to provide.

## Common Confusions

**"Do I need to know how to run GO SAVE options myself as a
developer?"**
Not typically for everyday development work; these broader,
system-wide saves are generally an administrator's responsibility.
Recognizing what they cover, at this overview level, is the useful
takeaway for a developer.

**"Is option 21 just a bigger version of SAVLIB, covered earlier in
this batch?"**
Conceptually related, since both ultimately save objects, but option 21
operates at the scope of the entire system, generally requiring a
restricted state where most other activity is stopped, unlike the
everyday object-level and library-level saves covered earlier in this
batch.

**"Is choosing between these options something this lesson teaches in
depth?"**
No. This lesson stays at an overview level: recognizing that these
options exist and roughly what each one covers. Designing a complete
backup schedule using these options is a deeper topic beyond this
introductory lesson.

## Quick Recap

- `GO SAVE` provides options for saving much broader scopes of the
  system than the object-level and library-level saves covered earlier
  in this batch.
- Option 21 saves the entire system; option 22 saves system data;
  option 23 saves user libraries and authority information.
- These broader saves are generally an administrator's responsibility,
  though recognizing what they cover is useful context for a developer.
- This lesson stays at an overview level; designing a complete backup
  schedule is a deeper topic beyond this introduction.

## Try Asking the AI Tutor

Use the AI Tutor to ask follow-up questions about this lesson. For
example, try asking:

- "Why might a shop run option 23 more frequently than option 21?"
- "What is the practical difference between option 22 and option 23 in
  terms of what each one actually protects?"
