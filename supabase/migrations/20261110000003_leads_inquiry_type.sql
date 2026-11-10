-- Franchise and distribution enquiries live in the same leads table as installation enquiries,
-- told apart by inquiry_type. Existing rows are all installation enquiries.
alter table public.leads
  add column if not exists inquiry_type text not null default 'installation'
    check (inquiry_type in ('installation', 'franchise', 'distribution')),
  add column if not exists email text,
  add column if not exists territory text,
  add column if not exists occupation text,
  add column if not exists prior_experience text,
  add column if not exists investment_budget text;

create index if not exists leads_inquiry_type_idx on public.leads (inquiry_type);
