-- ==========================================
-- Leads + call tracking for telecaller dashboard
-- ==========================================

-- 1. Allow 'telecaller' role
alter table public.user_roles drop constraint if exists user_roles_role_check;
alter table public.user_roles add constraint user_roles_role_check
  check (role in ('master', 'admin', 'telecaller'));

alter table public.admin_whitelist drop constraint if exists admin_whitelist_role_check;
alter table public.admin_whitelist add constraint admin_whitelist_role_check
  check (role in ('master', 'admin', 'telecaller'));

alter table public.admin_whitelist add column if not exists name text;

-- 2. Leads
create table public.leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  source text not null default 'website' check (source in ('website', 'sheet_import')),
  full_name text not null,
  mobile text not null,
  city text,
  state text,
  install_target text,
  vehicle text,
  engine_capacity text,
  preferred_callback_time text,
  question text,
  status text not null default 'new' check (status in
    ('new','no_answer','callback','interested','visit_scheduled','installed','not_interested','invalid')),
  interest_reason text,
  assigned_to uuid references auth.users(id) on delete set null,
  next_followup_at timestamptz,
  followup_note text,
  visit_date date,
  last_called_at timestamptz,
  call_count int not null default 0,
  updated_at timestamptz not null default now()
);

create unique index leads_mobile_created_idx on public.leads (mobile, created_at);
create index leads_status_idx on public.leads (status);
create index leads_state_idx on public.leads (state);
create index leads_followup_idx on public.leads (next_followup_at);
create index leads_visit_idx on public.leads (visit_date);

-- 3. Call history
create table public.lead_calls (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.leads(id) on delete cascade,
  called_by uuid references auth.users(id) on delete set null,
  called_by_email text,
  created_at timestamptz not null default now(),
  outcome text not null check (outcome in ('answered','not_answered','busy','switched_off','wrong_number')),
  summary text
);
create index lead_calls_lead_idx on public.lead_calls (lead_id, created_at desc);

-- 4. Helper: does current user hold any admin/telecaller role?
create or replace function public.has_staff_role()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = auth.uid());
$$;

create or replace function public.is_master()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = auth.uid() and role = 'master');
$$;

-- 5. RLS
alter table public.leads enable row level security;
alter table public.lead_calls enable row level security;

create policy "Website can insert leads"
  on public.leads for insert to anon, authenticated
  with check (source = 'website' and status = 'new' and call_count = 0 and assigned_to is null);

create policy "Staff can insert imported leads"
  on public.leads for insert to authenticated
  with check (public.has_staff_role());

create policy "Staff can read leads"
  on public.leads for select to authenticated using (public.has_staff_role());

create policy "Staff can update leads"
  on public.leads for update to authenticated
  using (public.has_staff_role()) with check (public.has_staff_role());

create policy "Master can delete leads"
  on public.leads for delete to authenticated using (public.is_master());

create policy "Staff can read calls"
  on public.lead_calls for select to authenticated using (public.has_staff_role());

create policy "Staff can log calls"
  on public.lead_calls for insert to authenticated
  with check (public.has_staff_role() and called_by = auth.uid());

-- 6. Keep leads in sync when a call is logged
create or replace function public.on_lead_call_insert()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  update public.leads
     set last_called_at = new.created_at,
         call_count = call_count + 1,
         assigned_to = case when new.called_by_email = 'Sheet import' then assigned_to else coalesce(assigned_to, new.called_by) end,
         updated_at = now()
   where id = new.lead_id;
  return new;
end;
$$;

create trigger lead_call_after_insert
  after insert on public.lead_calls
  for each row execute procedure public.on_lead_call_insert();

create or replace function public.touch_lead_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;
create trigger leads_touch before update on public.leads
  for each row execute procedure public.touch_lead_updated_at();

-- 7. Daily follow-up email (08:30 IST = 03:00 UTC)
-- Requires pg_cron + pg_net and two settings; see README "Leads dashboard setup".
-- select cron.schedule('followup-digest', '0 3 * * *', $$
--   select net.http_post(
--     url := 'https://<PROJECT_REF>.supabase.co/functions/v1/send-followup-digest',
--     headers := jsonb_build_object('Content-Type','application/json','x-cron-secret','<CRON_SECRET>'),
--     body := '{}'::jsonb);
-- $$);
