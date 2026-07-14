# Checking Objects with CHKOBJ

## Learning Objective

By the end of this lesson, you will be able to use `CHKOBJ` to confirm an
object exists before acting on it, and combine it with `MONMSG` to handle
the case where it does not.

## Simple Explanation

In the Common IBM i Object Types lesson, you learned that IBM i objects
have a specific type, such as `*FILE` or `*PGM`. Before a CLLE program
calls a program, submits a job that depends on a file, or otherwise relies
on a specific object existing, it can confirm that object is actually
there using **`CHKOBJ`** (Check Object):

```clle
DCL VAR(&MSG) TYPE(*CHAR) LEN(50)

CHKOBJ OBJ(MYAPPLIB/CUSTMAST) OBJTYPE(*FILE)
MONMSG MSGID(CPF9801) EXEC(DO)
  CHGVAR VAR(&MSG) VALUE('CUSTMAST not found, stopping')
  SNDPGMMSG MSG(&MSG)
  RETURN
ENDDO
```

`CHKOBJ` names the object to check, using the qualified name style covered
in the Object Naming and Qualified Names in Practice lesson, `MYAPPLIB/
CUSTMAST` here, and the object type expected, `*FILE`. If the object does
not exist, `CHKOBJ` issues an escape message, commonly `CPF9801`, which
`MONMSG` can catch and respond to, similar to the pattern covered in the
MONMSG and Basic Error Handling in CLLE lesson. Here, `RETURN` ends the
CLLE program early if the required file is missing, rather than continuing
on to steps that depend on it.

## Why It Matters

Confirming an object exists before relying on it lets a CLLE program fail
in a controlled, understandable way, sending a clear message about exactly
what was missing, rather than letting a later command or program call fail
with a less obvious error partway through a longer process. This is
especially valuable in batch jobs, covered in the SBMJOB and Batch Job
Basics lesson, where no one may be watching the job run in real time.

## Practical Example

Imagine a nightly batch job that depends on a `CUSTMAST` physical file
being available before it starts processing orders. Checking for that file
with `CHKOBJ` right at the start of the CLLE program, and handling a
missing file clearly with `MONMSG`, means the job stops immediately with
an understandable message if something is wrong, rather than failing
confusingly partway through, or worse, continuing to run without the data
it actually needs.

This is a simplified, illustrative example rather than a specific real
batch job, but it reflects a genuinely common, practical reason CLLE
developers check for required objects before depending on them.

## Common Confusions

**"Does CHKOBJ tell me anything about an object besides whether it
exists?"**
`CHKOBJ` can also check specific authorities on an object, beyond simple
existence, though this lesson focuses on the basic existence check, which
is the most common, everyday use.

**"What happens if I don't include OBJTYPE?"**
`OBJTYPE` narrows the check to a specific kind of object, which matters
since more than one object of different types can share the same name in
the same library. Being specific about the expected type helps avoid
mistaking one object for another.

**"Is CPF9801 the only message CHKOBJ can send?"**
No. `CPF9801` is a common message for "object not found," but other
related escape messages exist for other situations `CHKOBJ` can detect,
such as authority problems. This lesson focuses on the basic, common
"object not found" case.

## Quick Recap

- `CHKOBJ OBJ(library/object) OBJTYPE(*type)` confirms whether a specific
  object exists.
- If the object does not exist, `CHKOBJ` issues an escape message, commonly
  `CPF9801`, which `MONMSG` can catch and respond to.
- Checking for required objects before depending on them lets a program
  fail in a controlled, understandable way.
- This pattern is especially valuable in batch jobs, where no one may be
  watching the job run in real time.

## Try Asking the AI Tutor

Use the AI Tutor to ask follow-up questions about this lesson. For
example, try asking:

- "What other things can CHKOBJ check besides whether an object exists?"
- "What does RETURN do inside a CLLE program?"
