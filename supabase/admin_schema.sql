-- ==========================================
-- 1. Create Admin Tables
-- ==========================================

-- Table to link auth.users to roles
create table public.user_roles (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role text not null check (role in ('master', 'admin')), -- 'master' or 'admin'
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id)
);

-- Table for Whitelisted Emails (Invites)
create table public.admin_whitelist (
  email text primary key,
  role text not null default 'admin' check (role in ('master', 'admin')),
  created_by uuid references auth.users(id),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.user_roles enable row level security;
alter table public.admin_whitelist enable row level security;

-- ==========================================
-- 2. RLS Policies
-- ==========================================

-- user_roles: Read active for all authenticated (to check own role), Write only by system (via Trigger) or Master?
-- Actually, we'll rely on the Trigger for insertion. Manual updates by Master only.

create policy "Allow read access to user_roles for authenticated users"
on public.user_roles for select
to authenticated
using (true);

-- admin_whitelist: Read by all authenticated (or just Master?), Write by Master only.
-- New users need to check whitelist during signup? No, the TRIGGER checks it.
-- But the UI might want to validate before calling signUp.
create policy "Allow read access to whitelist for authenticated users"
on public.admin_whitelist for select
to authenticated
using (true);

create policy "Allow write access to whitelist for Master Admins only"
on public.admin_whitelist for all
to authenticated
using (
  exists (
    select 1 from public.user_roles
    where user_id = auth.uid()
    and role = 'master'
  )
);

-- ==========================================
-- 3. Trigger for Auto-Role Assignment
-- ==========================================

-- Function to handle new user signup
create or replace function public.handle_new_admin()
returns trigger as $$
declare
  whitelisted_role text;
begin
  -- Check if email is in whitelist
  select role into whitelisted_role
  from public.admin_whitelist
  where email = new.email;

  -- If in whitelist, insert into user_roles
  if whitelisted_role is not null then
    insert into public.user_roles (user_id, role)
    values (new.id, whitelisted_role);
    return new;
  else
    -- Optional: Block signup if not whitelisted?
    -- For now, we just don't give them a role. Application logic should block non-role users.
    -- raise exception 'Email not whitelisted for admin access';
    return new;
  end if;
end;
$$ language plpgsql security definer;

-- Trigger logic
-- Note: In Supabase, triggers on auth.users must be created in the auth schema or public depending on permissions.
-- Usually, we attach to auth.users.
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_admin();
