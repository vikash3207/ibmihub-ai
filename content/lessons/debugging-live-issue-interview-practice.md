# Debugging Live Issue Interview Practice

## What This Lesson Prepares You For

Some interviews include a "live" style question: you're given a symptom
in real time and asked to talk through your investigation as you go,
rather than presenting a polished answer. This lesson builds on
Debugging Scenario-Based Questions with practice for that specific,
higher-pressure format.

## Concepts to Revise First

- Debugging Scenario-Based Questions, and the Basic Troubleshooting Flow
  for IBM i Developers lesson.
- STRDBG Basics for RPGLE, and Watching Variables During Debug.
- The Debugging a Broken File I/O Program mini project.

## Common Interview or Job Discussion Scenarios

- "I'm going to describe a problem step by step. Tell me what you'd do
  at each point, before I tell you what happens next."
- "What would you say to a user while you're still investigating, before
  you have an answer?"
- "How do you stay organized when a problem doesn't have an obvious
  cause right away?"

## Strong Beginner-Level Answer Approach

The key skill in a live-style question is narrating your process as you
go, including saying when you are not yet sure of something. A strong
answer sounds like: "Right now I don't know the cause yet, so the first
thing I'd check is the job log, since it often narrows things down
immediately," rather than staying silent until you have a complete
answer. Interviewers are usually evaluating your process, not expecting
instant certainty.

## Weak Answers to Avoid

- Going silent while thinking, instead of narrating what you are
  checking and why.
- Guessing at a root cause immediately, without mentioning what you
  would check to confirm it first.
- Changing your answer completely when new information is given, instead
  of explaining how the new information updates your original reasoning.

## Scenario-Based Practice

Try working through this step by step, saying your reasoning out loud at
each point before moving to the next: "A user says a customer inquiry
screen shows the wrong balance for one specific customer." Step one:
what would you check first? A reasonable answer is the job log, to rule
out an obvious error first. Step two, once told the job log shows
nothing unusual: what next? A reasonable next step is confirming what
customer number was actually entered, since a mistyped or transposed
customer number would legitimately return a different, correct-looking
record. Step three, once told the number entered was correct: at this
point, checking the actual stored value in `CUSTMAST` directly, separate
from the program, would help rule out whether the data itself is wrong
versus the program logic.

## How to Explain Your Thinking Clearly

A useful habit for live-style questions is to explicitly state what each
new piece of information rules in or out. For example: "Since the job
log shows nothing unusual, this likely isn't a runtime error, which
narrows it toward either bad input or bad data rather than a crash."
Saying this out loud shows the interviewer you are actually updating your
reasoning, not just moving through a memorized checklist.

## Practical IBM i Example

```rpgle
chain custNbr CUSTMAST;
if %found(CUSTMAST);
  *in50 = *off;
else;
  *in50 = *on;
endif;
```

If asked live, "what would you check if this screen showed a balance
that doesn't match what's in the database," a good narrated answer is:
"First I'd confirm `custNbr` actually holds the value the user typed,
since a transposed digit would legitimately chain to a different, valid
customer. If that's correct, I'd use `EVAL` on `CUSTBAL` right after the
`CHAIN` to see whether the program has the correct value at that point,
before assuming the screen itself is displaying it wrong."

## Mini Practice Task

Ask someone, or use the AI Tutor, to give you a debugging scenario one
piece of information at a time, and practice narrating your next check
after each new detail, without waiting to have the full picture before
saying anything.

## Quick Recap

- Live-style debugging questions test your process, not just your final
  answer, so narrate your reasoning as you go.
- It's fine to say you don't know something yet, as long as you say what
  you would check next.
- Explicitly stating what new information rules in or out shows you are
  actually reasoning, not following a fixed script.

## Try Asking the AI Tutor

Use the AI Tutor to practice this live format. For example, try asking:

- "Can you walk me through a debugging scenario one step at a time and
  ask what I'd check at each point?"
- "How would I explain my reasoning out loud if new information changes
  what I originally suspected?"
