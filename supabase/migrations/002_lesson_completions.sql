-- IBMiHub AI -- Lesson Completion Tracking (Batch 16 / Spec 006 Progress Tracking MVP)
-- Idempotent: safe to re-run. Policies are dropped before creation.
-- Tables: lesson_completions
-- NOT included (future migrations): dashboard aggregates, unmark/toggle support

-- lesson_completions
create table if not exists public.lesson_completions (
  id                uuid        primary key default uuid_generate_v4(),
  user_id           uuid        not null references auth.users(id) on delete cascade,
  lesson_id         uuid        not null references public.lessons(id) on delete cascade,
  learning_path_id  text        not null,
  completed_at      timestamptz not null default now(),
  created_at        timestamptz not null default now(),

  unique (user_id, lesson_id)
);

create index if not exists lesson_completions_user_id_idx   on public.lesson_completions (user_id);
create index if not exists lesson_completions_lesson_id_idx on public.lesson_completions (lesson_id);

-- Row-Level Security on lesson_completions
-- MVP is insert + read-only: no update or delete policy is defined below,
-- so those operations are denied by RLS regardless of grants. There is no
-- unmark/toggle feature in MVP (Spec 006 PROGRESS-FR-005, PROGRESS-FR-006).
alter table public.lesson_completions enable row level security;

drop policy if exists "Users can read their own completions"   on public.lesson_completions;
drop policy if exists "Users can insert their own completions" on public.lesson_completions;

create policy "Users can read their own completions"
  on public.lesson_completions for select
  using (auth.uid() = user_id);

-- The insert policy enforces Published-only completion at the database
-- level (Spec 006 PROGRESS-FR-015), not only in the Server Action: a row can
-- only be inserted for a lesson that currently exists with status
-- 'Published' and whose learning_path_id matches the value being inserted.
create policy "Users can insert their own completions"
  on public.lesson_completions for insert
  with check (
    auth.uid() = user_id
    and exists (
      select 1
      from public.lessons l
      where l.id = lesson_completions.lesson_id
        and l.status = 'Published'
        and l.learning_path_id = lesson_completions.learning_path_id
    )
  );

-- No update or delete policy is created for any role. Combined with the
-- grants below (which omit update/delete entirely), completion rows are
-- effectively immutable and cannot be removed via the anon/authenticated
-- Postgres roles once written.

-- Grants
-- RLS policies above restrict row visibility and insert eligibility; these
-- grants give the authenticated and service_role Postgres roles the
-- underlying table-level privileges they need. No update or delete grant is
-- given to any role -- see the note above.
grant select, insert on public.lesson_completions to authenticated, service_role;
