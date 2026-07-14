# Calling External APIs from IBM i

## Learning Objective

By the end of this lesson, you will be able to describe, at a
conceptual level, the steps involved when an IBM i program calls an
external API.

## Simple Explanation

Sometimes IBM i needs to reach out to another system, rather than only
being reached by one. For example, an order-entry program might need
to check a shipping rate from an external carrier's system before
completing an order. Calling an external API generally follows the
same conceptual steps, regardless of exactly which tool or library a
shop uses to make the actual call:

1. **Build the request**, including the endpoint address, the HTTP
   method, and any payload data needed, such as a JSON object
   describing what is being asked for.
2. **Send the request** to the external system and wait for a
   response.
3. **Read the response**, checking its status code first, then reading
   its payload if the call succeeded.
4. **Handle the result** in the calling program: using the returned
   data if the call succeeded, or handling the problem appropriately if
   it did not.

## Why It Matters

This is conceptually similar to calling another program or procedure
already covered in this course, sending some input, and getting a
result back, except the "other program" now lives on a completely
different system, reached over a network instead of through a local
call. Recognizing that the same fundamental shape, request out, result
back, still applies makes this far less unfamiliar than it might first
seem.

## Practical Example

Imagine an order-entry program on IBM i needs a shipping rate from an
external carrier's API before finalizing an order. Conceptually, the
program builds a request containing the destination and package
details as a JSON payload, sends it to the carrier's endpoint using a
`POST` method, and waits for a response. If the response comes back
with a `200` status code, the program reads the shipping rate from the
response payload and uses it. If the response comes back with an error
status code instead, the program needs to decide how to handle that,
such as showing a message or falling back to a default rate.

This is a simplified, illustrative example rather than a specific real
integration, but it reflects the everyday shape of calling an external
API from IBM i.

## Common Confusions

**"Do I need a specific IBM i product or library to call an external
API?"**
Some mechanism is generally needed to actually send the request over
the network, and different shops use different tools for this. This
lesson focuses on the conceptual steps involved, which stay the same
regardless of the specific tool chosen.

**"What happens if the external system is slow or unavailable?"**
This is a real, practical concern: an external call can fail, time
out, or return an unexpected status code. Planning for that
possibility, rather than assuming every external call will always
succeed quickly, is part of designing this kind of integration
responsibly, though the deep details of that are beyond this
introductory lesson.

**"Is calling an external API fundamentally different from calling
another IBM i program?"**
Not conceptually. Both involve sending some input and receiving a
result back. The practical differences, network calls, JSON payloads,
status codes, are what the lessons in this batch have been building
toward understanding.

## Quick Recap

- Calling an external API involves building a request, sending it,
  reading the response's status code and payload, and handling the
  result.
- This is conceptually similar to calling another program, except the
  "other program" is reached over a network instead of locally.
- An external call can fail or behave unexpectedly, which is a real
  consideration, even though this lesson keeps that at a conceptual
  level.
- The specific tool or library used to make the call varies by shop;
  the conceptual steps stay the same.

## Try Asking the AI Tutor

Use the AI Tutor to ask follow-up questions about this lesson. For
example, try asking:

- "What might a program reasonably do if an external API call times
  out instead of returning a response?"
- "How is calling an external API similar to and different from
  calling another RPGLE program on the same system?"
