# Understanding %EOF in RPGLE File Processing

## Learning Objective

By the end of this lesson, you will understand exactly what `%EOF` checks,
and why it must be tested immediately after each `READ` for a read loop to
work correctly.

## Simple Explanation

In the Reading Physical Files in RPGLE with READ lesson, you saw `%EOF`
used as a loop condition without a detailed explanation. **`%EOF`** (End
of File) is a built-in function that reports whether the most recent
input operation, such as `READ`, on a given file failed to find another
record, meaning the end of the file has been reached.

```rpgle
dcl-f CUSTMAST disk;

read CUSTMAST;
dow not %eof(CUSTMAST);
  dsply CUSTNAME;

  read CUSTMAST;
enddo;
```

Here, `%eof(CUSTMAST)` becomes true the moment a `READ` on `CUSTMAST`
fails to retrieve another record, which happens naturally once every
record has already been read. This is exactly why `READ` is called both
before the loop and again at the bottom: each `READ` attempt is
immediately followed by a `%EOF` check, so the loop can correctly stop
right when there is nothing left to read, rather than trying to process a
record that was never actually retrieved.

## Why It Matters

Without checking `%EOF` correctly, a read loop can either stop too early,
skipping valid records, or try to process a record that does not actually
exist once the file is exhausted. Understanding precisely what `%EOF`
reports, and pairing it correctly with each `READ`, is what makes a basic
file-processing loop reliable.

## Practical Example

Imagine `CUSTMAST` contains three customer records. The program calls
`READ` and retrieves the first record; `%EOF` is false, so the loop body
runs, processing that record. This continues for the second and third
records. After the third record is processed, the loop calls `READ` one
more time, which fails to find a fourth record, and `%EOF` becomes true,
correctly ending the loop without attempting to process a nonexistent
fourth record.

This is a simplified, illustrative example rather than a specific real
file, but it reflects exactly how `%EOF` governs a basic read loop's
correct behavior.

## Common Confusions

**"Does %EOF check whether the file itself is empty?"**
Not directly. `%EOF` reports whether the most recent input operation on
that file failed to find a record, which is true for an empty file from
the very first `READ`, but also becomes true partway through a non-empty
file once every record has already been retrieved.

**"Do I need to specify which file %EOF is checking?"**
Generally yes, when a program works with more than one file, writing
`%eof(CUSTMAST)` names the specific file being checked, since a program
could otherwise be tracking end-of-file status for several different
files at once.

**"What happens if I check %EOF without a READ happening first?"**
`%EOF` reflects the result of the most recent input operation on that
file. Checking it before any `READ` has actually been attempted does not
give a meaningful result for that file's actual data.

## Quick Recap

- `%EOF` reports whether the most recent input operation, such as `READ`,
  failed to find another record for the specified file.
- Calling `READ` before the loop and again at the bottom, checking `%EOF`
  each time, lets a loop stop exactly when there is nothing left to
  process.
- `%EOF` becoming true does not mean the file was empty; it means the
  most recent `READ` found no further record.
- Naming the file explicitly, such as `%eof(CUSTMAST)`, matters once a
  program works with more than one file.

## Try Asking the AI Tutor

Use the AI Tutor to ask follow-up questions about this lesson. For
example, try asking:

- "What would happen if I forgot to check %EOF at all in a read loop?"
- "Does %EOF work the same way for CHAIN as it does for READ?"
