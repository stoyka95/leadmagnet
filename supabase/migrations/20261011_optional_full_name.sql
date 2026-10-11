-- D25: only the e-mail is required; the name is optional (used just to greet the visitor in the e-mail).
alter table public.leads alter column full_name drop not null;
alter table public.leads drop constraint if exists leads_full_name_check;
alter table public.leads add constraint leads_full_name_check
  check (full_name is null or char_length(full_name) between 2 and 120);
