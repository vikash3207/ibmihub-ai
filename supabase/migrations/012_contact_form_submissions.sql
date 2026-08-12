-- Contact Form Rate Limiting and Duplicate-Send Protection (PR #201)
-- Idempotent: safe to re-run. Policies are dropped before creation.
-- Table: contact_form_submissions
--
-- Durable, serverless-safe store for the public contact form's abuse
-- controls (app/api/contact/route.ts). This is deliberately metadata-only:
-- it never stores the submitter's name, email, subject, or message -- that
-- content goes to Resend/the configured inbox only, never to Supabase.
-- Mirrors 006_ai_tutor_usage_limits.sql's "log request shape, not request
-- content" stance, adapted for an unauthenticated public endpoint (no
-- user_id -- there is no session on this route).
--
-- `id` is the client-generated submission id (crypto.randomUUID(), one per
-- form-fill), reused as this row's primary key and as the Resend
-- idempotency key. That dual use is what makes duplicate-send protection
-- durable across serverless instances: a retried/double-clicked request
-- with the same submission id hits this table's primary-key constraint
-- (and, independently, Resend's own idempotency cache) instead of relying
-- on in-memory state that would reset per Lambda/edge instance.
--
-- `ip_hash` is an HMAC-SHA256 of the requester's IP, never the raw address,
-- so this table cannot leak visitor IPs even to someone with service-role
-- read access. The hash key is a server-only secret (see lib/contact-form
-- rate-limit helper) -- there is no way to reverse it back to an IP without
-- that secret.
create table if not exists public.contact_form_submissions (
  id                 uuid        primary key,
  created_at         timestamptz not null default now(),
  ip_hash            text,
  status             text        not null check (status in ('sent', 'blocked', 'error')),
  block_reason       text        check (block_reason in ('honeypot', 'origin', 'rate_limited', 'invalid_request')),
  -- Resend's message id for a successful send, so a duplicate request that
  -- hits our own PK conflict (rather than Resend's idempotency cache) can
  -- still report the original outcome instead of erroring.
  resend_message_id  text,

  check ((status = 'blocked' and block_reason is not null) or (status <> 'blocked' and block_reason is null))
);

-- Serves the sliding-window rate-limit check (recent rows for a given
-- hashed IP) that gates every submission before it reaches Resend.
create index if not exists contact_form_submissions_ip_hash_created_idx
  on public.contact_form_submissions (ip_hash, created_at desc);

-- Row-Level Security
-- Unlike ai_tutor_usage_events, there is no authenticated-user session on
-- this route at all -- every visitor, logged in or not, hits the same
-- public endpoint. So there is intentionally no authenticated/anon policy
-- here, not even a narrow self-scoped one: the service-role client (used
-- exclusively by app/api/contact/route.ts) is the only writer and reader.
alter table public.contact_form_submissions enable row level security;

grant select, insert, update on public.contact_form_submissions to service_role;
