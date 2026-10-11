-- Fáze 5c: the e-mail marketing consent and the phone contact consent are two separate, unticked boxes.
-- marketing_consent now means e-mail tips only; phone_consent is the permission to call.
alter table public.leads
  add column if not exists phone_consent boolean not null default false;

comment on column public.leads.marketing_consent is 'Souhlas s dalšími tipy e-mailem (od consent_version v3 jen e-mail).';
comment on column public.leads.phone_consent is 'Souhlas s telefonickým kontaktem (consent_version v3+); true jen když je vyplněný telefon.';
