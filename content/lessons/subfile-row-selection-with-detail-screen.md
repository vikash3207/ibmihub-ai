# Mini Project: Subfile Row Selection with Detail Screen

## What We Are Building

An extended version of the Simple Order List Subfile mini project's
`ORDLSTR`, adding an option field so a user can select one order from
the list and drill into a separate detail screen showing that order's
full information.

## Business Scenario

The Simple Order List Subfile mini project let a representative see
every order for a customer, but only as a flat list of order numbers and
amounts. This project adds the natural next step: selecting one specific
order from that list to actually look at it more closely.

## Concepts Used

- Option fields and a `READC` loop, from the Option Fields in Subfile
  Screens and Selecting a Row in a Subfile lessons.
- `CHAIN` and `%FOUND`, reused from the Customer Inquiry Program mini
  project.
- Calling a second display file from RPGLE, extending the single-screen
  pattern used throughout this batch.

## Files and Programs Involved

- **`ORDHIST`**, already used by `ORDLSTR`.
- **`ORDSFLD`**, extended from the Simple Order List Subfile mini
  project with an added option field on its `ORDSFL` subfile record
  format.
- **`ORDDTLD`**, a new, small display file with one record format,
  **`ORDDFMT`**, showing one order's full detail.
- **`ORDLSTR`**, extended to read the selected option and call the
  detail screen.

## Step-by-Step Build Outline

1. Add an option field to `ORDSFLD`'s `ORDSFL` subfile record format,
   exactly as covered in the Option Fields in Subfile Screens lesson.
2. Design `ORDDTLD`'s `ORDDFMT` record format showing order number,
   amount, and an F12 "return" key.
3. Load the subfile exactly as in the Simple Order List Subfile mini
   project, then `exfmt ORDCTL`.
4. After `exfmt`, loop through the subfile with `READC`, checking each
   row's option field for a selection, covered in the Selecting a Row in
   a Subfile lesson.
5. On a selected row, `exfmt ORDDFMT` to show that order's detail, then
   return to the subfile screen.

## Example Code

```rpgle
dcl-f ORDSFLD workstn;
dcl-f ORDDTLD workstn;
dcl-f ORDHIST disk keyed;

exfmt ORDCTL;

readc ORDSFL;
dow not %eof(ORDSFLD);
  if OPTION = 1;
    chain ORDNBR ORDHIST;
    if %found(ORDHIST);
      exfmt ORDDFMT;
    endif;
  endif;

  readc ORDSFL;
enddo;
```

Here, `readc ORDSFL;` reads only the rows a user actually changed on
screen, exactly as covered in the Selecting a Row in a Subfile lesson.
`OPTION = 1` checks whether that row was flagged for selection; if so,
`chain ORDNBR ORDHIST;` retrieves that exact order's full record, and
`exfmt ORDDFMT` shows it on the separate detail screen.

## How to Test It

Load the subfile with several orders, select one with option `1`, and
confirm the detail screen shows the correct order's information.
Select a different order on a later pass and confirm the detail screen
updates to match. Test with no selection at all, confirming the loop
completes without unnecessarily calling the detail screen.

## Common Mistakes

- Using `READ` instead of `READC`, which would process every subfile
  row rather than only the ones the user actually changed.
- Forgetting to `CHAIN` and check `%FOUND` before calling `exfmt
  ORDDFMT`, risking showing stale or blank detail fields for a row that
  somehow no longer matches.
- Forgetting to reset the option field after handling a selection,
  which could cause the same row to be treated as selected again later.

## Debugging Checklist

If selecting a row does not open the detail screen, follow the
Debugging Subfile Programs lesson's approach: add a temporary `dsply`
showing `OPTION`'s value inside the `READC` loop to confirm the
selection is actually being read as expected.

## Possible Extensions

A natural extension is adding a second option, such as `2` for editing
the order directly from the detail screen, following the same option-
field pattern already covered in the Option Fields in Subfile Screens
lesson.

## Quick Recap

- This project adds row selection and a detail screen to the Simple
  Order List Subfile mini project's flat list.
- `READC` reads only changed subfile rows; checking the option field
  identifies which one was selected.
- Testing should cover selecting different rows and selecting none at
  all.

## Try Asking the AI Tutor

Use the AI Tutor to practice extending or troubleshooting this project.
For example, try asking:

- "How would I add a second option letting the user delete an order
  directly from this subfile?"
- "What would happen if the option field were never reset after being
  handled?"
