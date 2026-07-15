# Digital Certificates and TLS Concepts on IBM i

## Learning Objective

By the end of this lesson, you will be able to explain, conceptually,
what a digital certificate and TLS are, and how they relate to the
HTTPS already introduced earlier in this course.

## Simple Explanation

The Securing IBM i APIs lesson earlier in this course introduced HTTPS
as meaning the connection between a caller and an API is encrypted.
Two concepts sit behind that encryption:

- **TLS** (Transport Layer Security): the underlying protocol that
  actually encrypts data traveling between two systems, and lets each
  side confirm who it is really talking to.
- **Digital certificate**: a credential that proves a system's
  identity as part of establishing that TLS connection, similar in
  spirit to how a user profile proves an individual's identity, but for
  a system or service rather than a person.

`HTTPS` is simply `HTTP`, the everyday web request/response pattern
already covered in the Modern IBM i / APIs / Integration lessons,
running over a TLS-encrypted connection instead of an unencrypted one.

## Why It Matters

Without TLS and a valid certificate, data traveling between two systems
could be read, or even altered, by someone intercepting it along the
way, exactly the risk HTTPS is meant to prevent, as already introduced
in this course's API security lesson. Understanding certificates and
TLS at this conceptual level explains what is actually happening behind
that HTTPS requirement, without needing to configure a certificate
personally.

## Practical Example

Recall the customer validation API introduced earlier in this course,
where HTTPS was described as keeping the customer number from being
exposed in transit. TLS is the mechanism that actually performs that
encryption, and the API server's digital certificate is what lets a
caller confirm they are really talking to the genuine IBM i system,
not an impostor pretending to be it, before any data is exchanged at
all.

This is a simplified, illustrative example rather than a specific real
certificate setup, but it reflects exactly why these concepts matter
together.

## Common Confusions

**"Is a digital certificate the same thing as a user profile?"**
No, though the underlying idea, proving an identity before being
trusted, is similar. A user profile identifies an individual signing
on; a certificate identifies a system or service as part of
establishing a TLS connection.

**"Do I need to know how to configure a certificate to understand this
lesson?"**
No. This lesson stays at the conceptual level: what a certificate and
TLS are and why they matter. Actually configuring and managing
certificates is a deeper, more hands-on topic beyond this introductory
lesson.

**"Is HTTPS a completely different thing from the HTTP requests
already covered in the Modern IBM i / APIs / Integration lessons?"**
No. HTTPS is the same HTTP request and response pattern already
covered, running over a TLS-encrypted connection instead of an
unencrypted one, rather than a fundamentally different kind of request.

## Quick Recap

- TLS is the protocol that encrypts data traveling between two systems
  and lets each side confirm who it is really talking to.
- A digital certificate is a credential that proves a system's or
  service's identity as part of establishing a TLS connection.
- HTTPS is ordinary HTTP running over a TLS-encrypted connection,
  already introduced conceptually in this course's API security
  lesson.
- This lesson stays conceptual; configuring certificates is a deeper
  topic beyond this introduction.

## Try Asking the AI Tutor

Use the AI Tutor to ask follow-up questions about this lesson. For
example, try asking:

- "What could go wrong, conceptually, if a caller connected to an API
  without a valid certificate being checked at all?"
- "How does a certificate's role here compare to the user-profile
  identity concept covered earlier in this batch?"
