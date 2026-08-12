
drop policy if exists "leaderboard public read" on public.profiles;
drop view if exists public.leaderboard_entries;

create table public.leaderboard_entries (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default 'Learner',
  avatar_url text,
  level public.korean_level not null default 'beginner',
  xp int not null default 0,
  streak_days int not null default 0,
  updated_at timestamptz not null default now()
);

grant select on public.leaderboard_entries to anon, authenticated;
grant all on public.leaderboard_entries to service_role;
alter table public.leaderboard_entries enable row level security;
create policy "leaderboard readable" on public.leaderboard_entries
  for select to anon, authenticated using (true);

create index on public.leaderboard_entries (xp desc);

create or replace function public.sync_leaderboard_entry()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.leaderboard_entries (user_id, display_name, avatar_url, level, xp, streak_days, updated_at)
  values (new.id, new.display_name, new.avatar_url, new.level, new.xp, new.streak_days, now())
  on conflict (user_id) do update set
    display_name = excluded.display_name,
    avatar_url = excluded.avatar_url,
    level = excluded.level,
    xp = excluded.xp,
    streak_days = excluded.streak_days,
    updated_at = now();
  return new;
end; $$;

revoke execute on function public.sync_leaderboard_entry() from public, anon, authenticated;

create trigger profiles_sync_leaderboard
after insert or update of display_name, avatar_url, level, xp, streak_days
on public.profiles for each row execute function public.sync_leaderboard_entry();

insert into public.leaderboard_entries (user_id, display_name, avatar_url, level, xp, streak_days)
select id, display_name, avatar_url, level, xp, streak_days from public.profiles
on conflict (user_id) do nothing;
