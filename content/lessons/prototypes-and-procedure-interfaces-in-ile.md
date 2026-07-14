# Prototypes and Procedure Interfaces in ILE

## Learning Objective

By the end of this lesson, you will be able to explain why a prototype
is required when calling a procedure defined in a different module,
and write a simple external prototype alongside its matching procedure
interface.

## Simple Explanation

The Parameters and Prototypes in RPGLE lesson introduced `dcl-pr` for
describing a procedure's parameters within a single program. Across
module boundaries, prototypes matter even more. Within one module, the
compiler can see a subprocedure's actual definition directly. Across
modules, the calling module has no visibility into another module's
source at all, so it needs to be told, in advance, exactly what a
procedure it plans to call looks like: its name, its parameters, and
its return type. That description is the prototype.

```rpgle
// In the calling module, before it is used:
dcl-pr isValidCustNbr ind;
  custNbr packed(6:0) const;
end-pr;
```

This prototype tells the compiler: "trust me, somewhere, at bind time,
a procedure named `isValidCustNbr` will exist, taking one packed(6:0)
parameter and returning an indicator." The actual matching definition
lives in the `CUSTVAL` module itself:

```rpgle
// In CUSTVAL, the module that actually implements it:
dcl-proc isValidCustNbr export;
  dcl-pi *n ind;
    custNbr packed(6:0) const;
  end-pi;

  return custNbr > 0;
end-proc;
```

The `dcl-pi` inside the procedure is its **procedure interface**: the
actual, real parameter definition for that specific procedure,
declared once, at the top of its own implementation.

## Why It Matters

The prototype and the procedure interface need to genuinely match. The
compiler trusts the prototype at the point where a call is written, but
the real behavior comes from whatever the procedure interface actually
defines. Getting this pairing right is what allows separately compiled
modules to safely call each other's procedures once bound together.

## Practical Example

Imagine `CUSTMAIN` needs to call `isValidCustNbr`, which actually lives
in the separately compiled `CUSTVAL` module. Without the prototype
shown above declared somewhere in `CUSTMAIN`'s source, the compiler
would have no way to know that `isValidCustNbr` exists, what to pass
it, or what it returns, and the call would fail to compile at all. The
prototype is what lets `CUSTMAIN` compile successfully, trusting that
the real procedure will be resolved correctly once `CRTPGM` binds both
modules together.

## Common Confusions

**"What happens if my prototype doesn't match the actual procedure?"**
This is genuinely risky: a mismatched prototype can cause a bind-time
error, or worse, in some cases let a program compile and bind with
parameters that don't actually line up correctly. The prototype must
accurately describe the real procedure it stands in for.

**"Where do shared prototypes usually live, if many programs call the
same procedure?"**
Commonly in a shared copy member, brought into each calling module's
source using a copy/include directive, so every caller uses the exact
same prototype text rather than retyping it separately each time. The
details of copy members are a separate topic beyond this lesson.

**"Is dcl-pi the same thing as dcl-pr?"**
No. `dcl-pr` documents an external call signature, a promise about a
procedure that may live elsewhere. `dcl-pi` defines the actual
parameter interface at the top of the procedure's own real
implementation, in the module where that procedure is written.

## Quick Recap

- A prototype (`dcl-pr`) describes a procedure's name, parameters, and
  return type to the compiler, before that procedure is actually
  called.
- A procedure interface (`dcl-pi`) is the real parameter definition at
  the top of a procedure's own implementation.
- Prototypes matter especially across module boundaries, where the
  calling module cannot see the other module's source directly.
- A mismatched prototype is a genuine risk, since the compiler trusts
  it at the point of the call.

## Try Asking the AI Tutor

Use the AI Tutor to ask follow-up questions about this lesson. For
example, try asking:

- "What is a copy member, and how does it help keep a prototype
  consistent across several calling programs?"
- "What would likely happen if I declared a prototype with the wrong
  parameter type for a real procedure?"
