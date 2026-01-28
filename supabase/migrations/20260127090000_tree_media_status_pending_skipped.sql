-- Add pending/skipped statuses
alter type public.tree_media_status add value if not exists 'pending';
alter type public.tree_media_status add value if not exists 'skipped';
