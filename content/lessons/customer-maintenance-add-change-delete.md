# Mini Project: Customer Maintenance Add/Change/Delete

## What We Are Building

`CUSTMNT`, a maintenance program letting a user add a new customer,
change an existing one, or delete one, extending the read-only Customer
Inquiry Program mini project into a program that actually changes data.

## Business Scenario

The Customer Inquiry Program mini project let a representative look up a
customer's balance. This project builds the natural next piece: a screen
letting authorized staff actually set up a new customer, correct a
customer's name, or remove one that has closed their account.

## Concepts Used

- `WRITE`, `UPDATE`, and `DELETE`, from the Writing Records with WRITE,
  Updating Records with UPDATE, and Deleting Records with DELETE lessons.
- `CHAIN` and `%FOUND`, reused from the Customer Inquiry Program mini
  project.
- Function keys selecting a mode, from the Function Keys and Response
  Indicators in Display Files lesson.

## Files and Programs Involved

- **`CUSTMAST`**, read, written, changed, and deleted by this program.
- **`CUSTMNTD`**, a new display file with one record format, **`MNTFMT`**,
  containing an input field for customer number, and input-capable
  fields for name and balance, plus F6 (add), F5 (update), and F4
  (delete) function keys.
- **`CUSTMNT`**, the RPGLE program tying `CUSTMNTD` and `CUSTMAST`
  together.

## Step-by-Step Build Outline

1. Design `CUSTMNTD`'s `MNTFMT` record format with input-capable
   customer number, name, and balance fields, and F6/F5/F4 function key
   indicators.
2. Declare both files with `dcl-f` in `CUSTMNT`.
3. Loop calling `exfmt MNTFMT`.
4. On F6, call `WRITE` using whatever the user typed into the name and
   balance fields.
5. On F5, `CHAIN` first, check `%FOUND`, then `UPDATE` if found.
6. On F4, `CHAIN` first, check `%FOUND`, then `DELETE` if found.

## Example Code

```rpgle
dcl-f CUSTMNTD workstn;
dcl-f CUSTMAST disk keyed;

dcl-s exitRequested ind;

dow not exitRequested;
  exfmt MNTFMT;

  if *in03;
    exitRequested = *on;
  elseif *in06;
    write CUSTMAST;
  elseif *in05;
    chain CUSTNBR CUSTMAST;
    if %found(CUSTMAST);
      update CUSTMAST;
    endif;
  elseif *in04;
    chain CUSTNBR CUSTMAST;
    if %found(CUSTMAST);
      delete CUSTMAST;
    endif;
  endif;
enddo;

*inlr = *on;
```

Here, `*in06`, `*in05`, and `*in04` are the function key indicators tied
to F6, F5, and F4 in `CUSTMNTD`'s DDS, each selecting a different action
on the same screen. Notice update and delete both `CHAIN` first and
check `%FOUND`, exactly the requirement covered in the Updating Records
with UPDATE and Deleting Records with DELETE lessons; add does not,
since a new customer has no existing record to retrieve first.

## How to Test It

Test each mode separately: add a brand new customer number and confirm
it can then be found with the Customer Inquiry Program mini project;
change an existing customer's name and confirm the new name persists;
delete a customer and confirm a subsequent inquiry correctly reports
"not found."

## Common Mistakes

- Attempting `UPDATE` or `DELETE` without a preceding `CHAIN`, which
  results in a runtime error, exactly the mistake covered in the Common
  RPGLE File I/O Mistakes and Best Practices lesson.
- Attempting `WRITE` with a customer number that already exists,
  resulting in a duplicate key error, covered in the Writing Records with
  WRITE lesson.
- Checking the wrong function key indicator for a given mode, causing
  add, change, and delete to become confused with each other.

## Debugging Checklist

If a change or delete silently does nothing, follow the Basic
Troubleshooting Flow for IBM i Developers lesson: check the job log
first for a runtime error, then, if none appears, use `STRDBG` with a
breakpoint right after the `CHAIN` and `EVAL` on `%found(CUSTMAST)` to
confirm whether the customer number entered actually matched a record.

## Possible Extensions

A natural extension is adding a confirmation step before delete,
displaying the customer's current name and balance and requiring a
second function key press to actually confirm the deletion, before
calling `DELETE`.

## Quick Recap

- `CUSTMNT` combines `WRITE`, `UPDATE`, and `DELETE` behind three
  different function keys on one screen.
- Update and delete both require a preceding `CHAIN` and `%FOUND` check;
  add does not.
- Testing should cover all three modes independently, confirming each
  one's effect with a follow-up inquiry.

## Try Asking the AI Tutor

Use the AI Tutor to practice extending or troubleshooting this project.
For example, try asking:

- "How would I add a confirmation screen before actually deleting a
  customer in CUSTMNT?"
- "What runtime error would I see if I pressed F5 to update a customer
  number that doesn't exist?"
