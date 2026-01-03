-- Add test status to tree_media and relax policies for test inserts/selects
alter type public.tree_media_status add value if not exists 'test';

drop policy if exists "anon can insert approved media" on public.tree_media;
create policy "anon can insert approved media"
on public.tree_media
for insert
with check (status in ('approved', 'test'));

drop policy if exists "public can read approved media" on public.tree_media;
create policy "public can read approved media"
on public.tree_media
for select
using (status in ('approved', 'test'));

