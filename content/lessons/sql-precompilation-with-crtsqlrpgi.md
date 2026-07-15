# SQL Precompilation with CRTSQLRPGI

## Learning Objective

By the end of this lesson, you will be able to explain what
precompilation does and where `CRTSQLRPGI` fits in the process of
turning RPGLE source with embedded SQL into a runnable program.

## Simple Explanation

An RPGLE source member with embedded SQL cannot go straight to the
normal RPGLE compiler, since that compiler does not understand `EXEC
SQL` statements. **Precompilation** is the extra step that happens
first: it reads the embedded SQL statements, checks them against the
database, and replaces them with generated RPGLE code the normal
compiler can understand.

`CRTSQLRPGI` runs this whole process in one command:

```clle
CRTSQLRPGI OBJ(MYLIB/CUSTINQR) SRCFILE(MYLIB/QRPGLESRC) SRCMBR(CUSTINQR)
```

Conceptually, `CRTSQLRPGI` does two things in sequence: precompile the
embedded SQL, then compile the resulting RPGLE source into a program or
module, similar in spirit to how `CRTBNDRPG` compiles plain RPGLE
directly.

## Why It Matters

Understanding precompilation explains something that otherwise seems
confusing: why a source member with embedded SQL needs a different
create command than plain RPGLE, and why a SQL syntax mistake, such as
referencing a column that does not exist, is caught at this earlier
precompile step rather than by the RPGLE compiler itself.

## Practical Example

Recall the `SELECT INTO` and cursor-based examples covered throughout
the SQLRPGLE lessons in this course. Every one of those source members
needs to be created with `CRTSQLRPGI` rather than `CRTBNDRPG`, since
`CRTBNDRPG` has no way to process the `EXEC SQL` statements inside
them. If one of those embedded `SELECT` statements referenced a column
that did not actually exist in the table, `CRTSQLRPGI` would fail
during the precompile step, before the RPGLE compiler ever runs,
reporting an SQL-specific error rather than a generic RPGLE one.

This is a simplified, illustrative example rather than a specific real
build process, but it reflects exactly how precompilation fits into
compiling SQLRPGLE source.

## Common Confusions

**"Can I use CRTBNDRPG for a source member with embedded SQL?"**
No. `CRTBNDRPG` does not process `EXEC SQL` statements at all; a source
member with embedded SQL needs `CRTSQLRPGI` (or an equivalent
precompile-aware command), which handles both the SQL precompile step
and the RPGLE compile step.

**"Is precompilation the same thing as CRTRPGMOD, covered in the
Advanced RPGLE / ILE lessons?"**
Not the same step, but a similar idea: both are a required processing
step before a final compile can happen. Precompilation processes
embedded SQL specifically; `CRTRPGMOD` compiles RPGLE source into a
module as part of the ILE build process covered earlier in this
course.

**"If precompilation succeeds, does that guarantee the program is
correct?"**
No. A successful precompile only confirms the embedded SQL statements
are syntactically valid and reference real database objects. It says
nothing about whether the surrounding RPGLE logic is correct, the same
distinction already covered for other kinds of "it compiled" claims
elsewhere in this course.

## Quick Recap

- Precompilation processes embedded SQL statements before the normal
  RPGLE compiler runs, replacing them with generated RPGLE code.
- `CRTSQLRPGI` runs precompilation and the RPGLE compile step together
  in one command, used instead of `CRTBNDRPG` for source with embedded
  SQL.
- A precompile failure reports an SQL-specific problem, such as a
  column that does not exist, before the RPGLE compiler ever runs.
- A successful precompile confirms the embedded SQL is valid, not that
  the surrounding program logic is correct.

## Try Asking the AI Tutor

Use the AI Tutor to ask follow-up questions about this lesson. For
example, try asking:

- "What kind of error message would I expect to see if CRTSQLRPGI
  failed during the precompile step specifically?"
- "How is the two-step precompile-then-compile process here similar to
  or different from the module-then-program ILE build process?"
