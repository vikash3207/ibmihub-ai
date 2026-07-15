# Batch vs Real-Time Integration

## Learning Objective

By the end of this lesson, you will be able to decide, for a given
integration scenario, whether a batch or real-time approach is the
better fit.

## Simple Explanation

The Interactive Jobs vs Batch Jobs lesson distinguished interactive
work from batch processing on IBM i. Integration has a similar
distinction:

- **Real-time integration** means a request is handled immediately,
  such as an API call that checks a customer number and returns an
  answer right away, while the caller waits.
- **Batch integration** means requests, or a whole group of them, are
  collected and processed together, often on a schedule, such as a
  nightly job that submits a batch of the day's orders to an external
  system all at once.

Neither approach is inherently better; each fits different situations.

## Why It Matters

Choosing the wrong approach causes real problems. Forcing a
slow, high-volume operation to run in real time can make a caller wait
far too long, or overwhelm a system meant for occasional, immediate
requests. Forcing something that genuinely needs an immediate answer,
like checking whether a customer number is valid before showing a
price, into an overnight batch job would make the feature useless.
Recognizing which shape a given integration need actually has is a key
early design decision.

## Practical Example

Imagine two integration needs at the same company. The first: a web
storefront needs to know immediately whether a customer number is
valid before showing pricing, a clear real-time need, handled through
the API approach already covered earlier in this batch. The second: an
external accounting system needs yesterday's completed orders, an
entirely reasonable batch need, handled by a nightly `CLLE`-driven job,
similar to the batch job orchestration already covered earlier in this
course, that gathers the day's orders and submits them together.

```clle
/* Simplified nightly batch integration job */
SBMJOB CMD(CALL PGM(EXPORTORD)) JOBQ(QBATCH)
```

This is a simplified, illustrative example rather than a specific real
integration, but it reflects a genuinely common split between real-time
and batch integration needs.

## Common Confusions

**"Is real-time integration always better because it's faster?"**
No. Real-time integration is better when an immediate answer is
genuinely needed. For high-volume or non-urgent needs, batch
integration is often simpler, more efficient, and easier to control.

**"Is batch integration outdated compared to real-time APIs?"**
No. Many legitimate integration needs are naturally batch-shaped, such
as end-of-day reporting or bulk data exchange, and forcing those into a
real-time API would add complexity without a real benefit.

**"Can the same integration need be handled both ways?"**
Sometimes, but it usually is not the best approach. Choosing the
approach that actually matches the need, immediate answer versus
scheduled bulk processing, is more effective than defaulting to one
approach for everything.

## Quick Recap

- Real-time integration handles requests immediately, while the caller
  waits; batch integration collects and processes requests together,
  often on a schedule.
- Neither approach is inherently better; the right choice depends on
  whether an immediate answer is genuinely needed.
- Batch integration on IBM i often builds on the same `SBMJOB` and job
  queue concepts already covered earlier in this course.
- Recognizing which shape an integration need has is a key early design
  decision.

## Try Asking the AI Tutor

Use the AI Tutor to ask follow-up questions about this lesson. For
example, try asking:

- "Can you give me a few more examples of integration needs and ask me
  to decide whether each is batch or real-time?"
- "What would go wrong if a high-volume, non-urgent integration need
  were built as a real-time API instead of a batch job?"
