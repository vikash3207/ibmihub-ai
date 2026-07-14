# Arrays in RPGLE

## Learning Objective

By the end of this lesson, you will be able to declare a simple RPGLE array
using `dim`, access an individual element by its index, and loop through an
array's elements.

## Simple Explanation

Every variable you have declared so far in this lesson group holds exactly
one value. An **array** is a variable that holds a fixed number of values of
the same data type, all sharing one name, distinguished from each other by
a numbered position called an **index**.

An array is declared by adding **`dim(n)`** to a variable declaration,
where `n` is how many elements the array holds:

```rpgle
dcl-s regionNames char(20) dim(4);

regionNames(1) = 'North';
regionNames(2) = 'South';
regionNames(3) = 'East';
regionNames(4) = 'West';
```

Each element is accessed by writing the array's name followed by its index
in parentheses, such as `regionNames(1)` for the first element. RPGLE array
indexes start at 1, not 0.

Arrays are commonly used together with the loops covered in the DO Loops
and Basic Iteration in RPGLE lesson, to process every element without
writing a separate line for each one:

```rpgle
dcl-s i int(10);

for i = 1 to 4;
  dsply regionNames(i);
endfor;
```

## Why It Matters

Arrays let a program work with a whole group of related values using a
single name and a changing index, rather than declaring a separate,
individually named variable for every single value. This becomes especially
useful together with a loop, letting you process every element with one
small block of code instead of repeating the same statement many times by
hand.

## Practical Example

Imagine a program that needs to display four region names. Without an
array, this would mean declaring four separate variables and writing four
separate `dsply` statements. Using an array combined with a `for` loop, as
shown above, the same four values are declared under a single name and
displayed using one small loop, regardless of how many elements the array
actually holds.

This is a simplified, illustrative example rather than a specific real
program, but it reflects a genuinely common, practical reason RPGLE
developers reach for arrays together with loops.

## Common Confusions

**"Does an array index start at 0, like in some other programming
languages?"**
No. RPGLE array indexes start at 1. The first element is `arrayName(1)`,
not `arrayName(0)`.

**"Can an array hold more elements than its declared size?"**
No. An array's size, set with `dim(n)`, is fixed when it is declared.
Trying to access an index beyond that size, such as index 5 on an array
declared with `dim(4)`, is an error rather than something the array
automatically expands to allow.

**"Do all elements of an array have to be filled in before the array is
used?"**
Not necessarily, but any element you have not explicitly assigned a value
to will hold a default value based on its data type, such as blanks for
character elements, rather than a value you have intentionally set.

## Quick Recap

- An array is declared by adding `dim(n)` to a variable declaration, where
  `n` is the number of elements it holds.
- Individual elements are accessed using the array's name followed by an
  index in parentheses, such as `regionNames(1)`.
- RPGLE array indexes start at 1, not 0.
- Arrays are commonly combined with loops to process every element without
  repeating the same statement for each one by hand.

## Try Asking the AI Tutor

Use the AI Tutor to ask follow-up questions about this lesson. For example,
try asking:

- "What happens if I try to access an array index beyond its declared
  size?"
- "Can I use %LEN or %TRIM on an individual array element the same way I
  would on a regular variable?"
