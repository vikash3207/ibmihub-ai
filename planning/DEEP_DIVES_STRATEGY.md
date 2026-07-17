# Deep Dives Strategy

**Status:** Framework shipped in PR #154. No full Deep Dive content has been written yet -- every catalog entry is `status: 'planned'`.

## What Deep Dives are

iRPGenie's learning content has three pillars:

1. **Beginner Track** -- the linear IBM i Fundamentals lesson path (`/learn/ibm-i-fundamentals`). Foundational, step-by-step, assumes no prior IBM i knowledge.
2. **Advanced Track** -- the more advanced/professional lessons later in that same linear path, building on the beginner material.
3. **Deep Dives** -- standalone, non-linear, professional-grade topic guides (`/deep-dives`). This document is about pillar 3.

**Definition:** Deep Dives are standalone, professional-grade IBM i topic guides for real-world development, debugging, integration, modernization, and interview readiness.

**Purpose:** bridge the gap between beginner-friendly lessons and advanced real-world professional usage. A working developer who already knows the basics shouldn't have to read through a linear beginner path to find a deep, practical answer on (say) activation groups or record locking -- they should be able to jump straight to that one topic.

Deep Dives are:
- non-linear (no prerequisite order, no "Lesson N of M")
- searchable/browsable by category, tag, and free text
- topic-focused (one Deep Dive = one real-world concept or scenario)
- deeper than a regular lesson -- production-style examples, not just "here's the syntax"
- useful as a reference to come back to, not just a one-time read
- eventually linked contextually from related lessons (once detail pages exist)
- written for working IBM i/RPGLE/SQL developers, not absolute beginners

## Topic selection criteria

A candidate topic is a good Deep Dive if it's **one or more** of:

- **Commonly confusing.** Topics developers repeatedly ask about or get wrong (e.g. activation groups, record locking semantics).
- **A real production/job topic.** Things a working IBM i developer actually deals with on the job, not just in a classroom (job log triage, MSGW troubleshooting, authority problems).
- **Interview-heavy.** Topics that come up disproportionately often in IBM i developer interviews, where a beginner lesson's depth isn't enough to answer follow-up questions confidently.
- **Needs deeper examples than a normal lesson.** The regular lesson template (Learning Objective → Simple Explanation → ... → Quick Recap) is built for teaching a concept once, beginner-first. Some topics need a "beginner example, then a production-style example, then a real scenario" progression that doesn't fit that template well.
- **Cuts across multiple tracks.** Topics that touch RPGLE, SQL, and CL all at once (e.g. "Native I/O vs SQL", "APIs and External Integration") don't belong cleanly inside any single existing track.
- **Has debugging/performance/security implications** worth a dedicated, practical checklist rather than a paragraph inside a broader lesson.

## The initial catalog (16 topics)

Selected using the criteria above, covering the categories in `lib/deep-dive-categories.ts`:

| Topic | Category | Difficulty | Why it qualifies |
|---|---|---|---|
| Stored Procedures on IBM i | SQL / Db2 for i | Professional | Real production topic, cuts across SQL and RPGLE |
| Database Triggers on IBM i | SQL / Db2 for i | Professional | Commonly confusing, commitment-control interactions |
| Service Programs and Binding Directories | ILE & Service Programs | Professional | Real production topic, interview-heavy |
| Activation Groups | ILE & Service Programs | Expert | Commonly confusing, hard-to-diagnose production bugs |
| Commitment Control | Journaling & Commitment Control | Professional | Real production topic, needs deeper examples |
| Journaling in Real Applications | Journaling & Commitment Control | Professional | Needs deeper examples than a beginner lesson |
| Record Locking in RPGLE | RPGLE | Intermediate | Commonly confusing, debugging implications |
| Native I/O vs SQL | RPGLE | Intermediate | Cuts across tracks, real decision developers face |
| SQLRPGLE Cursor Patterns | SQL / Db2 for i | Professional | Needs deeper examples, real production topic |
| Subfile Design Patterns | RPGLE | Professional | Needs deeper examples, real production topic |
| Job Log and MSGW Troubleshooting | Operations & Troubleshooting | Intermediate | Real production topic, interview-heavy |
| Data Queues | APIs & Integration | Intermediate | Cuts across tracks, real production topic |
| Job Queues and Subsystems | Operations & Troubleshooting | Professional | Real production topic, debugging implications |
| Authority and Adopted Authority | Security | Professional | Commonly confusing, security implications |
| IFS for Developers | APIs & Integration | Intermediate | Cuts across tracks, real production topic |
| APIs and External Integration on IBM i | APIs & Integration | Professional | Cuts across tracks, modernization-relevant |

## Content sequencing (not decided by this PR)

This PR does not write any Deep Dive content. Suggested sequencing for follow-up PRs (Product Owner to approve/reorder):

- PR #155: First Deep Dive Content Batch (process/tooling for writing one, using the template)
- PR #156+: one Deep Dive per PR, or small batches, starting with whichever topics the Product Owner considers highest-value first (Stored Procedures and Activation Groups are reasonable starting candidates given how often they come up).

## AI Tutor / RAG integration (future-facing, not implemented in this PR)

Deep Dive content should eventually be available to the AI Tutor once published, the same way lesson content already is via `lib/ai/retrieve-course-context.ts`. This PR does **not** change AI Tutor RAG retrieval -- that integration is future work, and should follow this rule when it happens:

- Only `status: 'published'` Deep Dives may ever be added to the retrieval corpus.
- `planned` and `review-ready` Deep Dives must never be indexed or surfaced to the AI Tutor as if they were real course content -- the whole point of the status field is to make that distinction structurally enforceable (a future retrieval integration should filter on `status === 'published'` the same way `getPublishedLessons()` already filters lessons on `status = 'Published'`).
- When that integration is built, each Deep Dive's content should likely be chunked by its template's numbered sections (see `DEEP_DIVE_TEMPLATE.md`), mirroring how `lib/ai/lesson-chunks.ts` already chunks lessons by their known heading structure.

## Related lessons / cross-linking (future-facing)

`DeepDive.relatedLessonSlugs` (see `lib/deep-dives.ts`) already exists in the taxonomy so a future PR can:
- show "Related lessons" links on a Deep Dive's detail page, and
- show a "Related Deep Dive" callout from a lesson page, once enough Deep Dives are published to make that worthwhile.

Neither exists yet in this PR -- there are no lesson-page changes here, and no Deep Dive detail pages to link from.
