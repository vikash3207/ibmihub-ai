-- IBMiHub AI -- Lesson v2.0 Metadata Fields (Curriculum Expansion, Phase 1 Migration)
-- Idempotent: safe to re-run (all columns use IF NOT EXISTS).
-- Source: specs/009-content-governance/spec.md v2.1 Section 11.3 (v2.0 Proposed
-- Metadata Schema) and planning/CURRICULUM_EXPANSION_BLUEPRINT.md Section 5.
--
-- This migration is ADDITIVE ONLY:
--   - No existing column is renamed, retyped, or dropped.
--   - No existing NOT NULL constraint, check constraint, or index is changed.
--   - No RLS policy is changed. The existing "Anyone can read published
--     lessons" policy (row-level) already covers these new columns; RLS in
--     Postgres has no per-column granularity, so no policy edit is required.
--   - No changes to lesson_order or learning_path_id -- both remain the
--     single source of truth for the current Learning Center's global
--     ordering and progress-record scoping (Spec 006 v1.0, unchanged).
--
-- All new columns are nullable with no default other than NULL, so existing
-- rows are valid the instant this migration runs, with no backfill required
-- for the migration itself to succeed. The application-level retagging of
-- the 12 existing lessons is performed separately via `npm run seed` reading
-- content/lessons/metadata.ts (this repository's source of truth), not by
-- this SQL file.

alter table public.lessons
  add column if not exists track_id           text null,
  add column if not exists module_id          text null,
  add column if not exists difficulty         text null
                              check (difficulty in ('beginner', 'intermediate', 'advanced')),
  add column if not exists depth              text null
                              check (depth in ('foundation', 'professional')),
  add column if not exists tags               text[] null,
  add column if not exists prerequisites      text[] null,
  add column if not exists related_lessons    text[] null,
  add column if not exists persona_tags       text[] null,
  add column if not exists ai_tutor_prompts   text[] null;

comment on column public.lessons.track_id is
  'v2.0: which of the approved learning tracks this lesson belongs to (Spec 009 v2.1 CONTENT-FR-015). Not yet read by any application query -- reserved for a future track-catalog UI.';
comment on column public.lessons.module_id is
  'v2.0: which module within track_id this lesson belongs to (Spec 009 v2.1 CONTENT-FR-015). Does not affect lesson_order, which remains the current, unchanged global ordering field.';
comment on column public.lessons.difficulty is
  'v2.0: single declared difficulty level, beginner/intermediate/advanced (Spec 009 v2.1 CONTENT-FR-016). One value per lesson; only tracks may span a range.';
comment on column public.lessons.depth is
  'v2.0: foundation/professional (Spec 009 v2.1 CONTENT-FR-024). Orthogonal to difficulty.';
comment on column public.lessons.tags is
  'v2.0: free-form topical tags for cross-track discovery (Spec 009 v2.1 CONTENT-FR-017). Not yet populated for the 12 migrated lessons.';
comment on column public.lessons.prerequisites is
  'v2.0: lesson slugs that should be completed first (Spec 009 v2.1 CONTENT-FR-018). Not yet populated for the 12 migrated lessons.';
comment on column public.lessons.related_lessons is
  'v2.0: cross-track "see also" lesson slugs (Spec 009 v2.1 CONTENT-FR-019). Not yet populated for the 12 migrated lessons.';
comment on column public.lessons.persona_tags is
  'v2.0: approved values only -- beginner, working-developer, support-developer, interview-prep (Spec 009 v2.1 CONTENT-FR-020). Metadata-only; no personalized UI reads this yet.';
comment on column public.lessons.ai_tutor_prompts is
  'v2.0: expands the existing single ai_tutor_starter_question into a list of 2-3 prompts (Spec 009 v2.1 Section 11.3). The existing ai_tutor_starter_question column is unchanged and still authoritative for current UI; this new column is additive and not yet read by the application.';

-- Indexes on the new columns are intentionally NOT added in this migration.
-- No current query filters or sorts by track_id/module_id/difficulty/depth;
-- adding indexes for queries that don't exist yet is premature. A future PR
-- that builds the track-catalog UI should add indexes alongside the queries
-- that need them.
