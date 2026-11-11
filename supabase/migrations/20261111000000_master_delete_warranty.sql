-- Only the master admin can delete warranty registrations (claims cascade via the FK).
drop policy if exists "Master can delete warranty registrations" on public.warranty_registrations;

create policy "Master can delete warranty registrations"
  on public.warranty_registrations for delete to authenticated
  using (public.is_master());
