# Deleting Records with DELETE

## Learning Objective

By the end of this lesson, you will be able to use `DELETE` to remove a
record that was already successfully retrieved with `CHAIN`, completing
the basic set of native RPGLE file operations.

## Simple Explanation

Just as `UPDATE`, covered in the previous lesson, depends on a record
already having been successfully retrieved, so does **`DELETE`**: it
removes whichever record was most recently retrieved for a given file,
generally with `CHAIN` after confirming `%FOUND`.

```rpgle
dcl-f CUSTMAST disk keyed;

dcl-s custNbr packed(6:0);

custNbr = 1042;
chain custNbr CUSTMAST;
if %found(CUSTMAST);
  delete CUSTMAST;
endif;
```

Here, the program uses `chain custNbr CUSTMAST;` to retrieve the specific
customer record, confirms it was actually found with `%found(CUSTMAST)`,
and only then calls `delete CUSTMAST;` to remove that exact record from
the file. Once deleted, that customer's record no longer exists in
`CUSTMAST`; a later `CHAIN` for the same customer number would no longer
find it.

## Why It Matters

`DELETE` completes the basic set of native RPGLE file operations covered
in this lesson group: `READ` and `CHAIN` retrieve data, `WRITE` adds new
records, `UPDATE` changes existing ones, and `DELETE` removes them.
Together, these five operations cover the fundamental ways an RPGLE
program works with stored business data, connecting directly to the
conceptual update/delete subfile pattern covered earlier in this path,
now grounded in the actual native operations that make it work.

## Practical Example

Imagine the update/delete subfile pattern described earlier in this
path, where a user marks a customer record for deletion using an option
field. Behind that pattern, the RPGLE program uses exactly the sequence
shown above: `CHAIN` to retrieve the specific customer by number, `%FOUND`
to confirm it exists, and `DELETE` to actually remove it from `CUSTMAST`.

This is a simplified, illustrative example rather than a specific real
program, but it reflects exactly how a subfile-based delete option
translates into native RPGLE file operations.

## Common Confusions

**"Can I call DELETE without first using CHAIN?"**
No, for the pattern covered in this lesson. `DELETE` removes whichever
record was most recently retrieved for that file; without a preceding
successful `CHAIN` or `READ`, there is no specific record for `DELETE` to
remove.

**"Does DELETE ask for confirmation before removing a record?"**
No. `DELETE` removes the record immediately once called; any
confirmation, such as the window record confirmation pattern covered
earlier in this path, is something the program's own logic must handle
before calling `DELETE`, not something `DELETE` provides on its own.

**"Once a record is deleted, can it be recovered?"**
Not through any operation covered in this lesson group. `DELETE` removes
the record from the file; recovering deleted data, if possible at all,
would depend on broader backup or recovery processes entirely outside
what a single RPGLE program's own operations can do.

## Quick Recap

- `DELETE fileName;` removes whichever record was most recently
  retrieved, generally with `CHAIN` after confirming `%FOUND`.
- `DELETE` requires a record to have already been successfully retrieved,
  the same requirement covered for `UPDATE`.
- `DELETE` does not ask for confirmation; any confirmation logic belongs
  in the program before `DELETE` is called.
- `READ`, `CHAIN`, `WRITE`, `UPDATE`, and `DELETE` together form the
  fundamental set of native RPGLE file operations covered in this lesson
  group.

## Try Asking the AI Tutor

Use the AI Tutor to ask follow-up questions about this lesson. For
example, try asking:

- "What would happen if I called DELETE twice in a row on the same
  record without doing another CHAIN in between?"
- "Are there IBM i features that let a deleted record be recovered
  later?"
