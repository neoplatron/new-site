-- Let admins (not only the master) delete leads. Telecallers still cannot.
drop policy if exists "Master can delete leads" on public.leads;
drop policy if exists "Master and admin can delete leads" on public.leads;

create policy "Master and admin can delete leads"
  on public.leads for delete to authenticated
  using (
    exists (select 1 from public.user_roles where user_id = auth.uid() and role in ('master', 'admin'))
  );
