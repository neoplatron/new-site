-- Returns every lead in one request for the staff dashboard and leads list.
-- Reading the table directly re-runs the staff check for every row and is capped at
-- 1000 rows per request; here the check runs once and all rows come back together.
-- Visibility is unchanged: only users with a staff role get rows (same rule as the
-- "Staff can read leads" policy).
create or replace function public.get_all_leads()
returns json
language plpgsql stable security definer set search_path = public as $$
begin
  if not public.has_staff_role() then
    return '[]'::json;
  end if;
  return (
    select coalesce(json_agg(l order by l.created_at desc), '[]'::json)
    from public.leads l
  );
end;
$$;

revoke execute on function public.get_all_leads() from public, anon;
grant execute on function public.get_all_leads() to authenticated;
