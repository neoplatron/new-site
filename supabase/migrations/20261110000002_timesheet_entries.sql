-- Manual timesheet entries: work other than lead calls (calls are already in lead_calls).
create table public.timesheet_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  user_email text,
  work_date date not null,
  start_time time not null,
  end_time time not null,
  description text not null,
  created_at timestamptz not null default now(),
  check (end_time > start_time)
);
create index timesheet_entries_day_idx on public.timesheet_entries (work_date, user_id);

alter table public.timesheet_entries enable row level security;

-- Everyone sees their own entries; admin and master see the whole team.
create policy "Read own or all for admins"
  on public.timesheet_entries for select to authenticated
  using (
    user_id = auth.uid()
    or exists (select 1 from public.user_roles where user_id = auth.uid() and role in ('master', 'admin'))
  );

create policy "Staff add own entries"
  on public.timesheet_entries for insert to authenticated
  with check (public.has_staff_role() and user_id = auth.uid());

create policy "Delete own entries"
  on public.timesheet_entries for delete to authenticated
  using (user_id = auth.uid() or public.is_master());
