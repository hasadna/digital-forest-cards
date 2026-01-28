-- Set pending as default and update policies to allow pending inserts
alter table public.tree_media alter column status set default 'pending';

drop policy if exists "anon can insert approved media" on public.tree_media;
create policy "anon can insert approved media"
on public.tree_media
for insert
with check (status in ('pending', 'approved', 'test'));

drop policy if exists "public can read approved media" on public.tree_media;
create policy "public can read approved media"
on public.tree_media
for select
using (status in ('approved', 'test'));
