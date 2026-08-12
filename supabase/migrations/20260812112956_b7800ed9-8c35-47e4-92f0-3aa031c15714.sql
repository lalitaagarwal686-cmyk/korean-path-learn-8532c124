
drop view if exists public.leaderboard_entries;

create view public.leaderboard_entries
with (security_invoker = on) as
  select id as user_id, display_name, avatar_url, level, xp, streak_days
  from public.profiles order by xp desc limit 100;

grant select on public.leaderboard_entries to anon, authenticated;
grant all on public.leaderboard_entries to service_role;

-- security_invoker view needs a public-readable projection policy on profiles.
create policy "leaderboard public read" on public.profiles
  for select to anon, authenticated using (true);

revoke execute on function public.handle_new_user() from public, anon, authenticated;
revoke execute on function public.update_updated_at_column() from public, anon, authenticated;
