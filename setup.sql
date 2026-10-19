-- =====================================================================
-- Party RSVP: Supabase setup
-- 1. Change the email on the next marked line to the one you'll log in with.
-- 2. Paste this whole file into Supabase > SQL Editor and click Run.
-- Safe to run again; it won't delete guests.
-- =====================================================================

create table if not exists public.hosts (email text primary key);

-- >>> CHANGE THIS to your login email <<<
insert into public.hosts (email) values (lower('you@example.com')) on conflict do nothing;

create table if not exists public.party (
  id int primary key default 1 check (id = 1),
  title text not null default '',
  host_name text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  time_zone text not null default 'America/Los_Angeles',
  location text not null default '',
  details text not null default '',
  reminder_days numeric[] not null default '{7,1}',
  visibility text not null default 'names' check (visibility in ('off', 'counts', 'names', 'all')),
  manual_round text
);
insert into public.party (id) values (1) on conflict do nothing;

create table if not exists public.guests (
  id uuid primary key default gen_random_uuid(),
  token text not null unique default (replace(gen_random_uuid()::text, '-', '') || replace(gen_random_uuid()::text, '-', '')),
  name text not null check (char_length(name) between 1 and 100),
  email text not null default '',
  phone text not null default '',
  status text not null default 'pending' check (status in ('pending', 'yes', 'maybe', 'no')),
  party_size int not null default 1 check (party_size between 1 and 20),
  note text not null default '' check (char_length(note) <= 500),
  invited_at timestamptz,
  responded_at timestamptz,
  last_contacted timestamptz,
  rounds_done text[] not null default '{}',
  created_at timestamptz not null default now()
);

-- ---------- Who is a host ----------
create or replace function public.is_host() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.hosts where email = lower(coalesce(auth.jwt() ->> 'email', '')));
$$;

-- ---------- Row level security: only hosts touch tables directly ----------
alter table public.hosts enable row level security;
alter table public.party enable row level security;
alter table public.guests enable row level security;

drop policy if exists host_all on public.party;
create policy host_all on public.party for all to authenticated using (public.is_host()) with check (public.is_host());
drop policy if exists host_all on public.guests;
create policy host_all on public.guests for all to authenticated using (public.is_host()) with check (public.is_host());

revoke all on public.hosts from anon, authenticated;
revoke all on public.party, public.guests from anon;

-- ---------- Guest access: only through these functions, with their private code ----------
create or replace function public.get_invite(p_token text) returns json
language plpgsql stable security definer set search_path = public as $$
declare
  g public.guests;
  p public.party;
  who json;
  totals json;
begin
  select * into g from public.guests where token = p_token;
  if not found then return null; end if;
  select * into p from public.party where id = 1;

  if p.visibility <> 'off' then
    select json_build_object(
      'people', coalesce(sum(party_size) filter (where status = 'yes'), 0),
      'yes', count(*) filter (where status = 'yes'),
      'maybe', count(*) filter (where status = 'maybe'),
      'pending', count(*) filter (where status = 'pending'))
    into totals from public.guests;
  end if;

  if p.visibility in ('names', 'all') then
    select coalesce(json_agg(json_build_object(
        'name', x.name, 'status', x.status, 'party_size', x.party_size,
        'note', case when p.visibility = 'all' then x.note else '' end,
        'me', x.id = g.id) order by x.responded_at desc nulls last), '[]'::json)
    into who from public.guests x where x.status in ('yes', 'maybe');
  end if;

  return json_build_object(
    'party', json_build_object('title', p.title, 'host_name', p.host_name, 'starts_at', p.starts_at,
      'ends_at', p.ends_at, 'time_zone', p.time_zone, 'location', p.location, 'details', p.details),
    'guest', json_build_object('name', g.name, 'status', g.status, 'party_size', g.party_size, 'note', g.note),
    'visibility', p.visibility, 'totals', totals, 'who', who);
end $$;

create or replace function public.submit_rsvp(p_token text, p_status text, p_party_size int, p_note text) returns json
language plpgsql volatile security definer set search_path = public as $$
declare
  p public.party;
begin
  if p_status not in ('yes', 'maybe', 'no') then raise exception 'Please choose yes, maybe, or no.'; end if;
  select * into p from public.party where id = 1;
  if p.starts_at is not null and p.starts_at < now() then raise exception 'This party has already happened.'; end if;
  update public.guests
     set status = p_status,
         party_size = least(20, greatest(1, coalesce(p_party_size, 1))),
         note = left(coalesce(p_note, ''), 500),
         responded_at = now()
   where token = p_token;
  if not found then raise exception 'Invite not found.'; end if;
  return public.get_invite(p_token);
end $$;

-- ---------- Host helpers for marking messages as sent ----------
create or replace function public.mark_sent(p_ids uuid[], p_kind text, p_round text default null) returns void
language plpgsql volatile security definer set search_path = public as $$
begin
  if not public.is_host() then raise exception 'Not allowed'; end if;
  if p_kind = 'invite' then
    update public.guests set invited_at = coalesce(invited_at, now()), last_contacted = now() where id = any(p_ids);
  elsif p_kind = 'reminder' and p_round is not null then
    update public.guests set rounds_done = array_append(rounds_done, p_round), last_contacted = now()
     where id = any(p_ids) and not (p_round = any(rounds_done));
  else
    raise exception 'Unknown kind';
  end if;
end $$;

-- Tiny call the keep-awake job uses so the free project doesn't pause.
create or replace function public.ping() returns int
language sql stable security definer set search_path = public as $$ select count(*)::int from public.party $$;

revoke execute on function public.is_host(), public.get_invite(text), public.submit_rsvp(text, text, int, text),
  public.mark_sent(uuid[], text, text), public.ping() from public, anon, authenticated;
grant execute on function public.get_invite(text), public.submit_rsvp(text, text, int, text), public.ping() to anon, authenticated;
grant execute on function public.is_host(), public.mark_sent(uuid[], text, text) to authenticated;

-- ---------- Open invite link (self sign-up) ----------
alter table public.party add column if not exists join_code text;
alter table public.party add column if not exists join_enabled boolean not null default false;
alter table public.guests add column if not exists source text not null default 'host';

-- Party info for someone opening the open invite link (no guest yet).
create or replace function public.get_join(p_code text) returns json
language plpgsql stable security definer set search_path = public as $$
declare
  p public.party;
  who json;
  totals json;
begin
  select * into p from public.party where id = 1;
  if not p.join_enabled or p.join_code is null or p_code is distinct from p.join_code then return null; end if;

  if p.visibility <> 'off' then
    select json_build_object(
      'people', coalesce(sum(party_size) filter (where status = 'yes'), 0),
      'yes', count(*) filter (where status = 'yes'),
      'maybe', count(*) filter (where status = 'maybe'),
      'pending', count(*) filter (where status = 'pending'))
    into totals from public.guests;
  end if;
  if p.visibility in ('names', 'all') then
    select coalesce(json_agg(json_build_object(
        'name', x.name, 'status', x.status, 'party_size', x.party_size,
        'note', case when p.visibility = 'all' then x.note else '' end, 'me', false)
        order by x.responded_at desc nulls last), '[]'::json)
    into who from public.guests x where x.status in ('yes', 'maybe');
  end if;

  return json_build_object(
    'party', json_build_object('title', p.title, 'host_name', p.host_name, 'starts_at', p.starts_at,
      'ends_at', p.ends_at, 'time_zone', p.time_zone, 'location', p.location, 'details', p.details),
    'visibility', p.visibility, 'totals', totals, 'who', who);
end $$;

-- Someone signs themselves up through the open invite link.
create or replace function public.register_guest(p_code text, p_name text, p_email text, p_phone text,
  p_status text, p_party_size int, p_note text) returns json
language plpgsql volatile security definer set search_path = public as $$
declare
  p public.party;
  v_name text := trim(coalesce(p_name, ''));
  v_email text := lower(trim(coalesce(p_email, '')));
  v_phone text := trim(coalesce(p_phone, ''));
  v_token text;
  n int;
begin
  select * into p from public.party where id = 1;
  if not p.join_enabled or p.join_code is null or p_code is distinct from p.join_code then
    raise exception 'This invite link is no longer active. Please ask the hosts for a new one.';
  end if;
  if p.starts_at is not null and p.starts_at < now() then raise exception 'This party has already happened.'; end if;
  if char_length(v_name) < 1 or char_length(v_name) > 100 then raise exception 'Please enter your name.'; end if;
  if v_email = '' and v_phone = '' then raise exception 'Please add an email or phone number so the hosts can reach you.'; end if;
  if char_length(v_email) > 200 or char_length(v_phone) > 30 then raise exception 'That contact info is too long.'; end if;
  if v_email <> '' and v_email !~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$' then
    raise exception 'That email address doesn''t look right.';
  end if;
  if p_status not in ('yes', 'maybe', 'no') then raise exception 'Please choose Yes, Maybe, or Can''t make it.'; end if;
  if exists (select 1 from public.guests where (v_email <> '' and email = v_email) or (v_phone <> '' and phone = v_phone)) then
    raise exception 'You''re already on the guest list! Use the personal link from your invite to RSVP, or ask the hosts to send it again.';
  end if;
  select count(*) into n from public.guests where source = 'self';
  if n >= 300 then raise exception 'Sign-ups are full. Please contact the hosts.'; end if;

  insert into public.guests (name, email, phone, status, party_size, note, invited_at, responded_at, source)
  values (v_name, v_email, v_phone, p_status, least(20, greatest(1, coalesce(p_party_size, 1))),
          left(coalesce(p_note, ''), 500), now(), now(), 'self')
  returning token into v_token;
  return json_build_object('token', v_token);
end $$;

revoke execute on function public.get_join(text), public.register_guest(text, text, text, text, text, int, text) from public, anon, authenticated;
grant execute on function public.get_join(text), public.register_guest(text, text, text, text, text, int, text) to anon, authenticated;

-- ---------- Invite views (who has opened their link) ----------
alter table public.guests add column if not exists first_viewed_at timestamptz;
alter table public.guests add column if not exists last_viewed_at timestamptz;
alter table public.guests add column if not exists view_count int not null default 0;

-- Called by a guest's invite page when it loads. Reloads within 30 minutes count as the same visit.
create or replace function public.record_view(p_token text) returns void
language plpgsql volatile security definer set search_path = public as $$
begin
  update public.guests
     set first_viewed_at = coalesce(first_viewed_at, now()),
         view_count = view_count + case when last_viewed_at is null or last_viewed_at < now() - interval '30 minutes' then 1 else 0 end,
         last_viewed_at = now()
   where token = p_token;
end $$;

revoke execute on function public.record_view(text) from public, anon, authenticated;
grant execute on function public.record_view(text) to anon, authenticated;
