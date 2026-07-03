# What is IBM i?

## Learning Objective

By the end of this lesson, you will understand what IBM i is, what makes it different
from a typical server operating system, and how it relates to older names you may have
heard, like AS/400.

## Simple Explanation

IBM i is an operating environment that runs on IBM Power Systems hardware. The word
"environment" matters here: instead of installing an operating system, a database,
security tools, and a job scheduler as separate pieces and connecting them yourself,
IBM i bundles all of that together into one integrated platform.

Out of the box, IBM i includes:

- An operating system that manages the hardware and runs programs
- DB2 for i, a relational database built directly into the platform
- Object-based security that controls who can do what, down to individual pieces of data
- Job and work management, which controls how programs run and share system resources
- A development and runtime environment for building and running business applications

Because these pieces are designed to work together from the start, rather than bolted
on afterward, IBM i is often described as an "integrated" platform rather than just an
operating system.

If you have only used general-purpose operating systems before, this "everything
included" approach is the biggest mental shift when learning IBM i.

## Why It Matters

IBM i is not a legacy curiosity. It runs core, business-critical systems for
organizations around the world today: order processing, inventory management,
financial systems, manufacturing, distribution, healthcare records, and government
services, among others.

Many of these organizations have relied on IBM i for decades because it has a strong
track record for reliability and long-term stability. That same reliability is exactly
why IBM i can feel "invisible" - it quietly keeps running in the background, so newer
developers sometimes never hear about it until they encounter it directly on the job.

For you, that means two things. First, if you are new to IT, IBM i skills are
genuinely useful in the job market, particularly in industries where these systems are
deeply embedded. Second, if you already work with IBM i, understanding it as a
coherent platform - rather than a collection of unrelated tools - will make everything
else you learn about it click into place faster.

## Practical Example

Imagine a mid-size distribution company that ships products to retail stores. Every
day, the company needs to:

1. Receive new sales orders
2. Check current inventory levels
3. Update stock as items are picked and shipped
4. Generate invoices for completed orders

On many platforms, this would require separately installed and configured software
for the database, the application server, security policies, and job scheduling, all
maintained by different tools.

On IBM i, the same company could run all of this using programs that read and write
directly to DB2 for i (the built-in database), while the platform's security model
controls exactly which users and programs can view or change order and inventory
data, and its job management features control how those programs run throughout the
business day. The pieces are not separate products glued together after the fact;
they are part of the same platform.

This is a simplified, illustrative example rather than a real system, but it reflects
the kind of work IBM i is commonly used for.

## Common Confusions

**"Isn't this the old AS/400? Is it still around?"**
Yes and no. AS/400 was the original hardware and software platform, first introduced
in 1988. Over the years, the platform was renamed and modernized: AS/400 became
iSeries, then System i, and today the operating environment is called IBM i, running
on IBM Power Systems hardware. Many people who have worked with this platform for a
long time still say "AS/400" out of habit, the same way some people still say "dial a
phone number" long after rotary phones disappeared. When you hear AS/400, iSeries, or
System i, you can generally assume the person means what is now IBM i.

**"Is IBM i the same thing as IBM Power Systems?"**
Not quite. IBM Power Systems refers to the physical hardware (the servers) that IBM i
runs on. IBM i is the operating environment that runs on top of that hardware. The
same Power Systems hardware can also run other operating systems, but IBM i is the
platform this course focuses on.

**"Is IBM i just a database?"**
No. DB2 for i, the built-in relational database, is a core part of IBM i, but it is
only one piece. IBM i also includes the operating system itself, security, job
management, and the runtime environment for applications. Thinking of IBM i as "just
a database" misses the fact that it is a complete, integrated platform.

## Quick Recap

- IBM i is an integrated operating environment that runs on IBM Power Systems hardware.
- It bundles the operating system, the DB2 for i database, security, job management,
  and an application runtime into a single platform.
- IBM i is the modern name for a platform previously known as AS/400, iSeries, and
  System i; many people still call it AS/400 out of habit.
- IBM i (the platform) and IBM Power Systems (the hardware) are related but distinct.
- IBM i is far from obsolete: it runs business-critical systems for organizations
  around the world today.

## Try Asking the AI Tutor

Once the AI Tutor is available, you will be able to ask follow-up questions about
anything in this lesson. Two things you might ask:

- "What is the difference between IBM i and IBM Power Systems?"
- "Why do people still call IBM i the AS/400?"
