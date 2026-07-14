# Basic Troubleshooting Flow for IBM i Developers

## Learning Objective

By the end of this lesson, you will be able to follow a simple, ordered
troubleshooting flow that connects every debugging tool covered across
this lesson group.

## Simple Explanation

This lesson group has covered several individual tools: `STRDBG`,
breakpoints, watching variables, job logs, message IDs, `DSPJOB`,
`WRKACTJOB`, and the call stack. Put together in order, they form a
practical, repeatable flow:

1. **Check the job log first.** As covered in the Understanding Job Logs
   lesson, this often points directly at what happened, before doing
   anything else.
2. **Read the message ID and its detail.** As covered in the Reading IBM
   i Message IDs and Finding Program Failures from Error Messages
   lessons, this identifies the kind of problem and exactly which program
   was involved.
3. **Check the call stack if the failure happened deep in a chain of
   calls.** As covered in the Understanding Call Stack Basics lesson,
   this shows the full path of programs and procedures that led to where
   the failure occurred.
4. **Decide whether it is a compile error or a runtime error.** As
   covered in the Compile Errors vs Runtime Errors lesson, this determines
   whether you are looking at the source code directly or need to observe
   the program actually running.
5. **Use STRDBG, breakpoints, and EVAL if it is a runtime problem.** As
   covered in the STRDBG Basics, Setting and Using Breakpoints, and
   Watching Variables During Debug lessons, this lets you actually watch
   the program's logic and data at the specific point things go wrong.

## Why It Matters

Without an ordered flow, it is easy to jump straight to stepping through
code in a debugger before even checking whether the job log already
explains the problem, wasting time investigating blindly. Following this
flow in order means each step either resolves the problem or narrows down
exactly where the next step should focus.

## Practical Example

Imagine `CUSTRPT` producing a wrong balance total. Following the flow: the
job log shows no error messages at all, meaning this is likely a runtime
logic problem rather than something that failed outright. Since it
compiled and ran without error, this rules out a compile error. The
developer starts `STRDBG`, sets a breakpoint on the balance calculation,
and uses `EVAL` to watch `custBal` and the calculation's result, exactly
as covered earlier in this lesson group, narrowing down precisely where
the expected and actual values diverge.

This is a simplified, illustrative example rather than a specific real
investigation, but it reflects exactly how the individual tools covered
in this lesson group work together as one coherent process.

## Common Confusions

**"Do I always need to go through every one of these five steps in
order?"**
Not necessarily every single one for every problem; some issues are fully
explained by the job log alone, while others clearly are not runtime
problems requiring a debug session at all. The flow is a sensible default
order, not a strict requirement to complete every step regardless of what
earlier steps already revealed.

**"What if the job log is completely empty, with no messages at all?"**
An empty job log for a failed or wrong result often signals a logic
problem rather than an operation that failed outright, which is exactly
why the flow moves toward compile-versus-runtime, and then a debug
session, when the job log alone does not explain things.

**"Is this flow only useful for RPGLE programs?"**
No. The same flow applies to CLLE, SQLRPGLE, and native file I/O
programs alike, since job logs, message IDs, the call stack, and the
compile-versus-runtime distinction all apply regardless of which
language a specific program happens to be written in.

## Quick Recap

- Check the job log first, before anything else.
- Read the message ID and its detail to identify the problem and the
  program involved.
- Check the call stack if the failure happened deep in a chain of calls.
- Decide whether it is a compile error or a runtime error.
- Use `STRDBG`, breakpoints, and `EVAL` for runtime problems that need
  closer investigation.

## Try Asking the AI Tutor

Use the AI Tutor to ask follow-up questions about this lesson. For
example, try asking:

- "What would make it reasonable to skip straight to STRDBG without
  checking the job log first?"
- "How would this flow apply differently to a batch job than to an
  interactive one?"
