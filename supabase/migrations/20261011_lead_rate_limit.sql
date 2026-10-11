-- Fáze 5: the form must not become a tool for sending our e-mail to someone else's inbox over and over.
-- At most 3 requests per e-mail address in 24 hours. Checked inside the database on insert,
-- so the API reads nothing back (no egress, D10) and no IP address is stored.
-- SQLSTATE PT429 makes PostgREST answer HTTP 429, which /api/lead passes on.
create index if not exists leads_email_created_idx on public.leads (email, created_at desc);

create or replace function public.leads_rate_limit()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if (select count(*) from public.leads
      where email = new.email and created_at > now() - interval '24 hours') >= 3 then
    raise exception 'rate_limited' using errcode = 'PT429';
  end if;
  return new;
end;
$$;

drop trigger if exists leads_rate_limit on public.leads;
create trigger leads_rate_limit before insert on public.leads
  for each row execute function public.leads_rate_limit();
