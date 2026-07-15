-- IBMiHub AI -- Lesson Master-Category Taxonomy Fields
-- Idempotent: safe to re-run (all columns use IF NOT EXISTS).
-- Source: planning/LESSON_TAXONOMY_AND_GROUPING_AUDIT.md (PR #120) and
-- planning/IBM_I_MASTER_TOPIC_COVERAGE_AUDIT.md (PR #110, the 27-category
-- master IBM i / AS400 topic list).
--
-- This migration is ADDITIVE ONLY, following the same pattern as
-- 004_lesson_v2_metadata.sql:
--   - No existing column is renamed, retyped, or dropped.
--   - No existing NOT NULL constraint, check constraint, or index is changed.
--   - No RLS policy is changed -- the existing "Anyone can read published
--     lessons" policy already covers these new columns.
--   - No changes to lesson_order, learning_path_id, or the existing v2.0
--     fields (track_id/module_id/etc.) -- master-category taxonomy is a
--     parallel, independent classification, not a replacement for trackId.
--
-- All new columns are nullable with no default other than NULL, so existing
-- rows remain valid the instant this migration runs.
--
-- IMPORTANT: as of PR #121, this migration has been written but is NOT yet
-- wired into scripts/seed-lessons.ts. content/lessons/metadata.ts (this
-- repository's source of truth) already carries masterCategoryId /
-- masterSubcategory / secondaryCategoryIds for 287 of 288 lessons, but that
-- data is not yet pushed to Supabase. This migration must be applied to the
-- live database FIRST; only then should a follow-up PR add these three
-- fields to the seed script's upsert payload -- doing so before this
-- migration is applied would break `npm run seed` with a missing-column
-- error.

alter table public.lessons
  add column if not exists master_category_id     text null,
  add column if not exists master_subcategory      text null,
  add column if not exists secondary_category_ids  text[] null;

comment on column public.lessons.master_category_id is
  'Taxonomy (PR #120/#121): primary classification against the 27-category IBM i master topic list (planning/IBM_I_MASTER_TOPIC_COVERAGE_AUDIT.md), independent of track_id. Not yet populated by npm run seed -- see planning/LESSON_TAXONOMY_AND_GROUPING_AUDIT.md for the full per-lesson mapping. Not yet read by any application query.';
comment on column public.lessons.master_subcategory is
  'Taxonomy (PR #120/#121): free-text subtopic within master_category_id. Not yet populated by npm run seed.';
comment on column public.lessons.secondary_category_ids is
  'Taxonomy (PR #120/#121): additional master categories this lesson also touches, per the audit''s cross-category notes. Not yet populated by npm run seed.';

-- Indexes are intentionally NOT added in this migration, matching the
-- rationale in 004_lesson_v2_metadata.sql -- no current query filters or
-- sorts by these columns yet. A future PR that builds master-category
-- filtering/grouping UI should add an index alongside the query that needs
-- it.
