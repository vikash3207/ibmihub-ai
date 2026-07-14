# Mock IBM i Developer Interview

## What This Lesson Prepares You For

This is the capstone lesson for the Interview and Professional Readiness
lessons: a single, structured mock interview combining definition
questions, code-reading questions, and scenario-based questions, the
same mix a real beginner-level IBM i interview is likely to use.

## Concepts to Revise First

This lesson assumes you have already worked through, or are ready to
review: RPGLE Basic Interview Questions, RPGLE File I/O Interview
Scenarios, CLLE Interview Scenarios, SQLRPGLE Interview Scenarios,
Display File and Subfile Interview Questions, and Debugging Scenario-
Based Questions.

## Common Interview or Job Discussion Scenarios

A realistic beginner-level interview mixes three question types in one
conversation: quick definitions, a short piece of code to read, and a
"what would you do" scenario. This lesson walks through one example of
each in sequence, the way they might actually be asked back to back.

## Strong Beginner-Level Answer Approach

Across all three question types, the same habit matters most:
connecting the answer to something concrete, a real behavior, a real
line of code, or a real check, rather than a memorized phrase. The
sections below give one worked example of each type, with a strong
answer and the reasoning behind it.

## Weak Answers to Avoid

- Answering a definition question correctly but being unable to connect
  it to a code-reading or scenario question later in the same
  conversation.
- Treating each question as fully separate, instead of noticing when a
  later question builds on an earlier one.
- Rushing to answer before actually reading a code snippet fully.

## Scenario-Based Practice

**Definition question**: "What is the difference between a physical file
and a logical file?"

Strong answer: "A physical file actually stores the data. A logical file
provides a different view over that same data, like a different key
order or a subset of fields, without duplicating the data itself."

**Code-reading question**: "What does this snippet do, and is anything
missing?"

```rpgle
dcl-f CUSTMAST disk keyed;

dcl-s custNbr packed(6:0);

custNbr = 9999;
chain custNbr CUSTMAST;
dsply CUSTBAL;
```

Strong answer: "This looks up customer `9999` by key and displays their
balance. It's missing a `%found(CUSTMAST)` check before the `dsply`. If
`custNbr` doesn't exist in `CUSTMAST`, `CUSTBAL` would hold whatever
value was left over from before the `CHAIN`, not a genuine value for
this customer, which could silently display misleading data instead of
failing outright."

**Scenario question**: "A batch report job shows as completed in
`WRKSBMJOB`, but no spool file was produced. What would you check?"

Strong answer: "I'd check that specific batch job's own job log first,
separate from whatever wrapper submitted it, since a job can end without
producing output if it failed partway through after being submitted
successfully, exactly the gap investigated in the Batch Job Failure
Investigation mini project."

## How to Explain Your Thinking Clearly

Notice that all three strong answers above share a structure: state what
the thing is or does first, then name the specific detail, check, or
mechanism that matters. This structure works whether the question is a
definition, a code snippet, or a scenario, which is exactly why it's
worth practicing as one repeatable habit rather than three separate
skills.

## Practical IBM i Example

The corrected version of the code-reading snippet above:

```rpgle
dcl-f CUSTMAST disk keyed;

dcl-s custNbr packed(6:0);

custNbr = 9999;
chain custNbr CUSTMAST;
if %found(CUSTMAST);
  dsply CUSTBAL;
else;
  dsply 'Customer not found';
endif;
```

Being able to produce this corrected version, not just identify the
problem, is a strong follow-up to have ready.

## Mini Practice Task

Ask the AI Tutor, or a friend, to run through this same three-question
format with you using different content: one definition question, one
short snippet to read, and one scenario. Practice answering all three in
one sitting, the way a real interview would flow.

## Quick Recap

- A realistic interview mixes definition, code-reading, and scenario
  questions in one conversation, not just one type at a time.
- The same "state it, then name the specific detail" structure works
  across all three question types.
- Being able to both identify a problem in code and produce the
  corrected version is stronger than identification alone.

## Try Asking the AI Tutor

Use the AI Tutor to run a full mock interview. For example, try asking:

- "Can you run a short mock IBM i interview with me, mixing a definition
  question, a code snippet, and a scenario question?"
- "Can you give me a snippet with a missing %found check and ask me to
  both spot it and fix it?"
