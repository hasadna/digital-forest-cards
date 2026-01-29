-- Allow pending uploads for anon insert
drop policy if exists "anon can insert approved media" on public.tree_media;
create policy "anon can insert approved media"
on public.tree_media
for insert
with check (status in ('pending', 'approved', 'test'));
