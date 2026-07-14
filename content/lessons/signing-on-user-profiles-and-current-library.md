# Signing On, User Profiles, and Current Library

## Learning Objective

By the end of this lesson, you will understand what happens when you sign on
to IBM i, what a user profile is, and what a current library is and why it
affects which objects you can find without typing a full library name.

## Simple Explanation

Before you can do anything on IBM i, whether through a 5250 screen or a tool
like IBM i Access Client Solutions, you must sign on. Signing on means
entering a user ID and password that IBM i checks against a **user profile**
it has stored for you.

A user profile is more than just a login credential. It is an object IBM i
uses to represent you as a user of the system, and it carries settings and
permissions along with it, including:

- What you are **authorized** to do: which libraries, objects, and commands
  you are allowed to use.
- Your **current library**, which is the library IBM i searches first, ahead
  of your regular library list, when you refer to an object without typing
  out which library it lives in.
- Other personal settings, such as which menu or program runs automatically
  right after you sign on.

The current library matters because of something you already know from the
Libraries and Objects lesson: IBM i finds unqualified object names, meaning
names given without an explicit library, by searching through a library
list. Your current library is checked as part of that search, and its
placement means objects you own or work with often live there specifically
so they are easy to find without extra typing.

## Why It Matters

Understanding user profiles and current libraries explains two things
beginners often find confusing at first: why different people signing on to
the exact same IBM i system can see different menus and have access to
different commands, and why the same command can behave differently, or find
a different object of the same name, depending on who runs it and what their
current library is set to. Neither of these is random. Both come directly
from settings tied to the signed-on user profile.

## Practical Example

Imagine two employees, one in the accounting department and one in shipping,
who both sign on to the same IBM i system using their own separate user
profiles. The accounting employee's profile grants access to financial
libraries and sets their current library to the accounting team's library.
The shipping employee's profile grants access to shipping and inventory
libraries instead, with a different current library.

When each employee signs on, they see the menu options relevant to their own
job, and when they run a report by name without specifying a library, IBM i
finds the correct version for their own department because of how their
current library and library list are set up. This is a simplified,
illustrative example rather than a specific real company, but it reflects a
common, realistic pattern in IBM i shops.

## Common Confusions

**"Is a user profile the same as a Windows user account?"**
They serve a similar general purpose, letting a system distinguish between
different signed-on users, but a user profile is specific to IBM i and also
carries IBM i concepts like current library and object authorities that do
not exist in the same form on other platforms.

**"Is current library the same as library list?"**
No. The library list is the ordered list of libraries IBM i searches through
for an unqualified object name, which you learned about in the Libraries and
Objects lesson. The current library is one specific entry that comes from
your user profile and is placed into a particular position within that
search.

**"If I can't find an object, is my current library always the problem?"**
Not always, but it is a common one worth checking early. If an object seems
to be missing when you know it exists, comparing your current library and
full library list against where the object actually lives is a reasonable
first troubleshooting step.

## Quick Recap

- Signing on to IBM i means authenticating against a user profile, which
  represents you as a user of the system.
- A user profile carries authorities (what you are allowed to do) and
  personal settings, including your current library.
- The current library is checked as part of the library list search for
  unqualified object names, which is why it affects what you can find
  without typing a full library name.
- Different signed-on users can see different menus, have different command
  access, and get different results from the same command, all because of
  differences in their user profiles.

## Try Asking the AI Tutor

Use the AI Tutor to ask follow-up questions about this lesson. For example,
try asking:

- "How is current library related to the library list I learned about
  earlier?"
- "What kinds of things can a user profile restrict besides libraries?"
