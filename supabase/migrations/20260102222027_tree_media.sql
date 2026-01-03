-- Tree media schema for tracking user uploads
create extension if not exists "pgcrypto";

create type public.tree_media_status as enum ('approved', 'flagged', 'deleted', 'test');

create table public.tree_media (
  id uuid primary key default gen_random_uuid(),
  tree_id text not null,
  s3_key text not null,
  public_url text generated always as (
    'https://rgw.rke2.hasadna.org.il/digital-forest-ugc/' || s3_key
  ) stored,
  mime_type text not null,
  file_size_bytes integer not null check (file_size_bytes <= 50 * 1024 * 1024),
  status public.tree_media_status not null default 'approved',
  uploaded_by text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index tree_media_tree_id_idx on public.tree_media (tree_id);
create index tree_media_created_at_idx on public.tree_media (created_at desc);

create or replace function public.set_updated_at() returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger tree_media_set_updated_at
before update on public.tree_media
for each row
execute procedure public.set_updated_at();

alter table public.tree_media enable row level security;

create policy "public can read approved media"
on public.tree_media
for select
using (status = 'approved');

create policy "anon can insert approved media"
on public.tree_media
for insert
with check (status = 'approved');

