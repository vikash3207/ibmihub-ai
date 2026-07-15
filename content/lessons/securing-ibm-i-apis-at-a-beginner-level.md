# Securing IBM i APIs at a Beginner Level

## Learning Objective

By the end of this lesson, you will be able to explain, at a beginner
level, what authentication, authorization, HTTPS, and least privilege
mean for an IBM i API, without needing to implement any of them in
depth yet.

## Simple Explanation

Securing an API rests on a few core ideas, each of which already has a
familiar counterpart on IBM i:

- **Authentication** answers "who is calling?" Similar to signing on to
  IBM i with a user profile and password, an API caller needs to prove
  its identity in some way before being trusted.
- **Authorization** answers "what is this caller allowed to do?" This is
  the same idea already covered in the Authorities and Object Access
  Basics lesson: being authenticated does not automatically mean being
  allowed to do everything.
- **HTTPS** means the connection between the caller and the API is
  encrypted, so data traveling between them cannot be easily read by
  someone intercepting it along the way.
- **Secrets** are values like passwords or API keys that prove identity
  and must be kept private, never hardcoded into source code or
  written into a log file.
- **Least privilege** means giving a caller only the specific access it
  actually needs, not broad access "just in case," the same principle
  already familiar from assigning object authorities carefully rather
  than granting `*ALL` everywhere.

## Why It Matters

An API that exposes real business logic is also exposing a new way to
reach that logic from outside the system. Without authentication, any
caller could pretend to be anyone. Without authorization, an
authenticated caller could potentially do more than intended. Without
HTTPS, data in transit could be exposed. Applying these ideas
deliberately is what keeps an exposed API as safe as the traditional,
tightly controlled ways of reaching IBM i logic already covered
elsewhere in this course.

## Practical Example

Imagine the customer validation API introduced earlier in this batch.
A responsible design confirms the caller's identity first
(authentication), checks that this specific caller is allowed to check
customer numbers at all (authorization), ensures the connection is
encrypted (HTTPS) so the customer number is not exposed in transit, and
grants that caller only the ability to check customer numbers, not
broader access to unrelated customer data (least privilege).

This is a simplified, illustrative example rather than a specific real
security implementation, but it reflects the core ideas every IBM i API
should account for, even at a beginner level.

## Common Confusions

**"Are authentication and authorization the same thing?"**
No. Authentication confirms who is calling. Authorization decides what
that caller is allowed to do. A caller can be authenticated but still
not authorized for a specific action, the same distinction already
covered by the `401` versus `403` status codes.

**"Do I need to implement OAuth or JWT to understand this lesson?"**
No. This lesson stays at the conceptual level: what authentication,
authorization, HTTPS, secrets, and least privilege mean and why they
matter. Specific implementation technologies are a deeper topic beyond
this introductory lesson.

**"Isn't it easier to just grant broad access to avoid access
problems?"**
It might seem easier short-term, but it directly violates least
privilege and increases the damage a compromised caller or a mistake
could cause. Granting only what is actually needed is the safer
default, exactly as it already is for native object authorities.

## Quick Recap

- Authentication confirms who is calling; authorization decides what
  they are allowed to do.
- HTTPS keeps data encrypted while traveling between caller and API.
- Secrets, such as passwords or API keys, must be kept private and
  never hardcoded or logged.
- Least privilege means granting only the specific access actually
  needed, the same principle already familiar from object authorities.

## Try Asking the AI Tutor

Use the AI Tutor to ask follow-up questions about this lesson. For
example, try asking:

- "How does the 401 versus 403 status code distinction connect to
  authentication versus authorization?"
- "Can you give me an example of a least-privilege mistake that might
  seem convenient at first but causes problems later?"
