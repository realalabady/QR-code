-- Run this in your Supabase SQL Editor
-- 1. Create the cards table
create table public.cards (
  id               uuid primary key default gen_random_uuid(),
  slug             text not null unique,
  name             text not null,
  job_title        text,
  email            text,
  company          text,
  phones           text[] default '{}',
  location_text    text,
  location_map_url text,
  linkedin_url     text,
  whatsapp_number  text,
  profile_photo_url text,
  logo_url         text,
  created_at       timestamptz default now(),
  updated_at       timestamptz default now()
);

-- 2. Auto-update updated_at
create or replace function public.handle_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger cards_updated_at
  before update on public.cards
  for each row execute procedure public.handle_updated_at();

-- 3. RLS: enable and set policies
alter table public.cards enable row level security;

-- Anyone can read cards (public business card pages)
create policy "Public can read cards"
  on public.cards for select
  using (true);

-- Only authenticated users (admins) can write
create policy "Admins can insert cards"
  on public.cards for insert
  to authenticated
  with check (true);

create policy "Admins can update cards"
  on public.cards for update
  to authenticated
  using (true);

create policy "Admins can delete cards"
  on public.cards for delete
  to authenticated
  using (true);

-- 4. Storage bucket (run via Supabase Dashboard > Storage > New Bucket)
-- Bucket name: card-assets
-- Public: true
-- Or run via SQL:
insert into storage.buckets (id, name, public)
values ('card-assets', 'card-assets', true)
on conflict do nothing;

-- Storage policy: public read
create policy "Public read card-assets"
  on storage.objects for select
  using (bucket_id = 'card-assets');

-- Storage policy: authenticated upload
create policy "Authenticated upload card-assets"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'card-assets');

create policy "Authenticated update card-assets"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'card-assets');

create policy "Authenticated delete card-assets"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'card-assets');
