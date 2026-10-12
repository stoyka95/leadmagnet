-- D38: for visitors from ad A the form has no consent boxes; the consents are offered on the thank-you page
-- after the comparison was requested. Record where and when a consent was given.
alter table public.leads
  add column if not exists consent_source text not null default 'form' check (consent_source in ('form', 'thank_you')),
  add column if not exists consent_updated_at timestamptz;

comment on column public.leads.consent_source is 'Kde návštěvník souhlasy viděl: form = zaškrtávací pole ve formuláři, thank_you = nabídka na děkovací stránce (D38).';
comment on column public.leads.consent_updated_at is 'Kdy byl souhlas udělen na děkovací stránce (D38); null = souhlasy z formuláře.';
