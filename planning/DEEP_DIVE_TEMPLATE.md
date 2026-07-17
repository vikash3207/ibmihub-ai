# Deep Dive Content Template

**Purpose:** the standard structure every Deep Dive should follow once it's written. This template exists so content can scale consistently across many Deep Dives written over multiple future PRs -- a reader who's used one Deep Dive should immediately know how to navigate any other one.

This is a **template for future content PRs**, not something this PR (#154) uses to write content. No Deep Dive currently uses this template because no Deep Dive has been written yet.

**Deep Dives are professional-grade by default (Product Owner clarification, PR #154 follow-up).** There is no difficulty tier to write toward -- no `difficulty` field exists on the `DeepDive` type, and none should be added. Every Deep Dive should go deep enough for a real-world IBM i developer, full stop; sections 6-8 below ("Beginner-level example" through "Real-world scenario") exist to build up to that depth within a single Deep Dive, not to sort Deep Dives into easier vs. harder tiers.

## Structure

Every Deep Dive should cover these sections, in this order. Not every section needs to be long -- a section that genuinely doesn't apply to a given topic (e.g. "Security considerations" for a topic with no meaningful authority implications) can be a short paragraph explicitly saying so, rather than forced padding.

1. **What this topic is** -- a plain, one-paragraph definition. Assume the reader already knows general IBM i concepts (this isn't a beginner lesson), but not this specific topic in depth.
2. **Why it matters in real IBM i work** -- the practical motivation. Why should a working developer care?
3. **Where it is used** -- realistic contexts: what kind of application, what kind of team, what triggers needing this.
4. **Core concepts** -- the underlying mental model, defined precisely.
5. **Syntax / command / structure** -- the actual RPGLE/CLLE/SQL/CL syntax, DDS, or command involved, shown plainly.
6. **Beginner-level example** -- the simplest possible correct usage, so a reader who's slightly underprepared isn't lost.
7. **Professional production-style example** -- a realistic, more complete example closer to what a real application would actually do (error handling, real naming, realistic scale).
8. **Real-world scenario** -- a short narrative: "Here's a situation where this came up and what happened."
9. **Common mistakes** -- specific, concrete mistakes (not vague warnings), each with why it's wrong and what to do instead.
10. **Debugging / troubleshooting checklist** -- an actionable, ordered checklist for when this topic is the suspected cause of a problem.
11. **Performance considerations** -- anything about this topic that affects performance, or an explicit note that performance isn't a major concern here.
12. **Security / authority considerations** -- if relevant; otherwise a short explicit note that there's nothing notable here.
13. **Interview questions** -- a short list of realistic interview questions on this topic, since Deep Dives are explicitly meant to support interview readiness.
14. **Practice tasks** -- a few concrete things a reader could go try (not full practice questions with answer keys -- this PR's constraints don't add new practice questions, and that stays true for individual Deep Dive PRs unless explicitly scoped to do so).
15. **Related lessons** -- links to relevant lessons in the IBM i Fundamentals path, using `relatedLessonSlugs` in the catalog entry.
16. **Related Deep Dives** -- links to other Deep Dives that share context, using `relatedDeepDiveSlugs` in the catalog entry.
17. **AI Tutor prompts** -- a few example questions a reader could ask the AI Tutor to go deeper, once this Deep Dive is available to AI Tutor retrieval (see `DEEP_DIVES_STRATEGY.md`'s AI Tutor integration notes).

## Metadata checklist (per `lib/deep-dives.ts`'s `DeepDive` type)

When a Deep Dive moves from `planned` to actually being written, its catalog entry (`content/deep-dives/catalog.ts`) should have:

- `slug` -- stable, kebab-case, never changed once published (same rule as lesson slugs).
- `title`, `description` -- already present from the planning stage; revisit for accuracy once the content is final.
- `category` -- already present; revisit if writing the content reveals a better-fitting category. No `difficulty` field exists (see the professional-grade-by-default note above).
- `tags` -- already present; add any that emerged while writing.
- `estimatedReadTime` -- add this **only once real content exists** (`status` is `review-ready` or `published`). Never estimate a reading time for `planned` content.
- `relatedLessonSlugs` / `relatedDeepDiveSlugs` / `relatedPracticeTopics` -- fill in based on what the finished content actually references.
- `lastUpdated` -- set when the content is finalized, and bump on any substantive future edit.
- `status` -- move from `planned` → `review-ready` while the content is being reviewed, → `published` only once it's ready for real learners to see and link to.

## What this template does not cover

- This template does not define how Deep Dive content will be stored (markdown file vs. inline TS vs. something else) or how detail pages (`/deep-dives/[slug]`) will render it -- those are decisions for the PR that actually adds the first real Deep Dive content, informed by whatever's cleanest given the codebase at that time.
- This template does not add AI Tutor RAG integration -- see `DEEP_DIVES_STRATEGY.md`.
