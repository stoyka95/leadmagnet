-- Leads from the Fingramo landing page.
-- Written only by the Vercel API route with the server-side secret key; no public access.
create table public.leads (
  id                 uuid primary key default gen_random_uuid(),
  created_at         timestamptz not null default now(),
  full_name          text not null check (char_length(full_name) between 2 and 120),
  email              text not null check (char_length(email) between 5 and 254 and email like '%_@_%._%'),
  phone              text check (phone is null or char_length(phone) between 6 and 30),
  marketing_consent  boolean not null default false,
  consent_version    text not null,           -- which wording of the form text the visitor saw
  form_location      text not null check (form_location in ('calculator', 'compare', 'footer')),
  amount_once_czk    integer check (amount_once_czk between 0 and 100000000),
  amount_monthly_czk integer check (amount_monthly_czk between 0 and 10000000),
  years              smallint check (years between 1 and 50),
  utm_source         text,
  utm_medium         text,
  utm_campaign       text,
  utm_content        text,
  analytics_id       text                     -- PostHog distinct_id, to join the funnel with the lead
);

-- RLS on with no policies: anon/authenticated roles can neither read nor write.
alter table public.leads enable row level security;

create index leads_created_at_idx on public.leads (created_at desc);
