# Internal Procedures vs Exported Procedures

## Learning Objective

By the end of this lesson, you will be able to describe the difference
between an internal procedure and an exported procedure, and explain
when you would reach for `export`.

## Simple Explanation

The Procedures and Subprocedures in RPGLE lesson covered writing a
subprocedure used within one program. By default, a procedure like that
is **internal**: it can only be called from within the same module it
is defined in, and no other module even knows it exists.

Adding the `export` keyword to a procedure's `dcl-proc` line changes
this: it makes the procedure visible to *other* modules at bind time,
so it can be called across module boundaries, exactly like
`isValidCustNbr` in the earlier lessons in this batch.

```rpgle
// Internal: only callable from within this same module
dcl-proc formatCustNbrForDisplay;
  dcl-pi *n char(10);
    custNbr packed(6:0) const;
  end-pi;

  return %char(custNbr);
end-proc;

// Exported: callable from other modules once bound together
dcl-proc isValidCustNbr export;
  dcl-pi *n ind;
    custNbr packed(6:0) const;
  end-pi;

  return custNbr > 0;
end-proc;
```

## Why It Matters

Deciding which procedures to export is a real design choice, not just a
syntax detail. Exporting a procedure is what makes it reusable across
modules and, eventually, offerable from a service program. Keeping a
procedure internal, when nothing outside the module genuinely needs it,
keeps that module's own implementation details private and easier to
change later without affecting anything else.

## Practical Example

Imagine a module with two procedures: `isValidCustNbr`, which other
programs genuinely need to call, and `formatCustNbrForDisplay`, a small
formatting helper only ever used inside that same module. Exporting
`isValidCustNbr` makes it available to bind into other programs.
Leaving `formatCustNbrForDisplay` internal keeps it as a private
implementation detail of this one module, free to change later without
worrying about any other module depending on it.

## Common Confusions

**"Should every procedure be exported, just in case something else
needs it later?"**
No. Exporting only what genuinely needs to be called from outside
keeps a module's real, private implementation details from becoming
something other code accidentally starts depending on. Exporting
everything defeats much of the benefit of having internal procedures at
all.

**"Does adding export alone make a procedure callable from every
program automatically?"**
No. Exporting only makes a procedure *visible for binding*. The calling
module still needs a matching prototype, and the module containing the
exported procedure still needs to actually be bound in, directly or via
a service program, before the call can work.

**"Is an exported procedure the same thing as a service program?"**
No. Exporting is a property of an individual procedure inside a module.
A service program, covered in the next lesson, is a separate kind of
object built from one or more modules, specifically for offering
exported procedures to many other programs at once.

## Quick Recap

- An internal procedure can only be called from within its own module.
- Adding `export` to a procedure makes it visible to other modules at
  bind time.
- Exporting is a deliberate design choice: export only what genuinely
  needs to be called from outside the module.
- Exporting alone does not bind a procedure in anywhere; that still
  requires a matching prototype and an actual bind step.

## Try Asking the AI Tutor

Use the AI Tutor to ask follow-up questions about this lesson. For
example, try asking:

- "How would I decide whether a specific procedure should be internal
  or exported?"
- "What happens if I try to call an internal procedure from a
  different module?"
