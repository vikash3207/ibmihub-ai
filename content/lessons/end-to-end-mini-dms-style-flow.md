# Mini Project: End-to-End Mini DMS-Style Flow

## What We Are Building

A small, deliberately minimal order-entry-to-report flow connecting
several of this batch's mini projects together: entering a new order,
listing it, and reporting on it. This is explicitly a tiny, educational
flow demonstrating how pieces connect, not a real document management or
order management system.

## Business Scenario

Imagine following one single order through an entire small IBM i
application: a representative enters it, it becomes visible on an order
list, and it eventually appears on a nightly report, run automatically as
a batch job. This project traces that path end to end, at a small,
understandable scale.

## Concepts Used

This capstone project deliberately reuses concepts and programs already
built in this batch, rather than introducing many new ones:

- `WRITE` to add a new record, from the Writing Records with WRITE
  lesson.
- The Simple Order List Subfile mini project's `SETLL`/`READE` listing.
- The Batch Report Program and CLLE Wrapper to Run a Report mini
  projects.

## Files and Programs Involved

- **`ORDHDRPF`**, a new, minimal order header file: `ORDNBR` (key) and
  `CUSTNBR`.
- **`ORDDTLPF`**, a new, minimal order detail file: `ORDNBR`, `ITEMNBR`,
  and `QTY`.
- **`ORDENTR`**, a new, small RPGLE program that writes one new order.
- `ORDLSTR`, `RPT001R`, and `RUNRPTC`, reused from earlier in this batch
  without modification.

## Step-by-Step Build Outline

1. Define `ORDHDRPF` and `ORDDTLPF` as simple, minimal files: one header
   record per order, one or more detail records per order, the same
   header-detail relationship briefly introduced in the SQL Tables vs DDS
   Physical Files lesson's `ORDERS` example.
2. Write `ORDENTR`, a small program taking a customer number, an item
   number, and a quantity, writing one `ORDHDRPF` record and one
   `ORDDTLPF` record.
3. Confirm the new order is visible: adapt the Simple Order List Subfile
   mini project's `SETLL`/`READE` pattern to read `ORDHDRPF` by customer
   number instead of `ORDHIST`.
4. Confirm the new order appears on the next run of `RPT001R`-style
   reporting logic, adapted to summarize `ORDHDRPF` instead of
   `CUSTMAST`, submitted the same way `RUNRPTC` submits `RPT001R`.

## Example Code

```rpgle
dcl-f ORDHDRPF disk keyed;
dcl-f ORDDTLPF disk keyed prefix('DTL_');

ORDNBR = 5001;
CUSTNBR = 1042;
write ORDHDRPF;

DTL_ORDNBR = 5001;
DTL_ITEMNBR = 2010;
DTL_QTY = 3;
write ORDDTLPF;

*inlr = *on;
```

This is the one genuinely new piece in this project: writing both a
header and a detail record for a single new order, using the same
`WRITE` covered throughout the RPGLE File I/O lessons, just applied to a
two-file, header-detail shape instead of a single flat file. Since both
`ORDHDRPF` and `ORDDTLPF` naturally share a field named `ORDNBR`, the
detail file's `dcl-f` adds `prefix('DTL_')`, so its fields come into the
program as `DTL_ORDNBR`, `DTL_ITEMNBR`, and `DTL_QTY`, keeping them
distinct from the header file's own fields, rather than the two files
colliding over the same field name.

## How to Test It

Run `ORDENTR` once for a test order, then use the adapted order-list
logic to confirm that order appears for the right customer, and finally
run the adapted report logic to confirm the same order is reflected
there too, tracing one order all the way through every stage.

## Common Mistakes

- Writing `ORDDTLPF` without a matching `ORDHDRPF` record first, leaving
  an orphaned detail record with no header.
- Forgetting that `ORDHDRPF` and `ORDDTLPF` are two separate files,
  requiring two separate `WRITE` operations, not one combined write.
- Assuming this small flow needs commitment control or multi-file
  transaction handling; those are genuinely more advanced topics well
  beyond this small, educational project.
- Declaring both `ORDHDRPF` and `ORDDTLPF` with plain `dcl-f`, without a
  `prefix` on at least one of them, when both files share a field name
  such as `ORDNBR`.

## Debugging Checklist

If a newly entered order does not appear in the list or report, follow
the Basic Troubleshooting Flow for IBM i Developers lesson: check the
job log for `ORDENTR`'s run first, then confirm with `EVAL` that
`ORDNBR` and `CUSTNBR` held the expected values immediately before each
`WRITE` executed.

## Possible Extensions

A genuinely small next step, still appropriate for this scale, is
letting `ORDENTR` write more than one detail line per order, looping
over several items entered for the same header, rather than exactly one
detail record per order.

## Quick Recap

- This project traces one order through entry, listing, and reporting,
  reusing most of this batch's earlier projects rather than building
  everything from scratch.
- `ORDENTR` is the one new piece: writing a header and detail record
  together for a new order.
- This is intentionally a small, educational flow, not a production
  order management system.

## Try Asking the AI Tutor

Use the AI Tutor to practice extending or troubleshooting this project.
For example, try asking:

- "What would need to change in this flow to support an order with
  three different items instead of just one?"
- "Why does this project avoid commitment control even though it writes
  to two related files?"
