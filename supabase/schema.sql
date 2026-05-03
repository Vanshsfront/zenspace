-- Run this in the Supabase SQL editor for project oiqfocwezhdwlgnqzylx.
-- Safe to re-run: every statement uses IF NOT EXISTS / ON CONFLICT.

-- ─── site_settings ────────────────────────────────────────────────
create table if not exists site_settings (
  id int primary key default 1,
  hero_title text default 'We help you choose the right tattoo',
  hero_subtitle text default 'Not just any tattoo.',
  hero_description text default 'A consultation-led process built around anatomy, symbolism and long term aesthetics.',
  hero_image text,
  cta_title text default 'Zenspace — Where your story becomes timeless art',
  cta_subtitle text default 'Custom tattoos crafted with passion, precision and meaning.',
  address text default 'Shop No. 101, 1st Floor, Zenspace Art and Tattoo, Akruti Commercial Complex, MIDC Central Rd, Near Akruti Centre Point, Gautam Nagar, Chakala Industrial Area (MIDC), Andheri East, Mumbai, Maharashtra 400093',
  email text default 'zenspace32@gmail.com',
  phone text default '+91 7208388209 / +91 8652144521',
  whatsapp text,
  instagram text,
  facebook text,
  pinterest text,
  piercing_title text,
  piercing_intro text,
  piercing_baby_blurb text,
  constraint single_row check (id = 1)
);
alter table site_settings add column if not exists whatsapp text;
alter table site_settings add column if not exists piercing_title text;
alter table site_settings add column if not exists piercing_intro text;
alter table site_settings add column if not exists piercing_baby_blurb text;
insert into site_settings (id) values (1) on conflict do nothing;

-- ─── artists ──────────────────────────────────────────────────────
create table if not exists artists (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique,
  role text,
  photo text,
  portfolio_url text,
  experience text,
  specialty text,
  bio text,
  sort_order int default 0,
  created_at timestamptz default now()
);
alter table artists add column if not exists slug text;
alter table artists add column if not exists experience text;
alter table artists add column if not exists specialty text;
alter table artists add column if not exists bio text;
do $$ begin
  alter table artists add constraint artists_slug_unique unique (slug);
exception when duplicate_object then null; when duplicate_table then null; end $$;

-- ─── categories ───────────────────────────────────────────────────
create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique,
  photo text,
  description text,
  sort_order int default 0
);
alter table categories add column if not exists slug text;
alter table categories add column if not exists description text;
do $$ begin
  alter table categories add constraint categories_slug_unique unique (slug);
exception when duplicate_object then null; when duplicate_table then null; end $$;

-- ─── category_photos ──────────────────────────────────────────────
create table if not exists category_photos (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references categories(id) on delete cascade,
  photo text not null,
  caption text,
  sort_order int default 0
);

-- ─── studio_photos ────────────────────────────────────────────────
create table if not exists studio_photos (
  id uuid primary key default gen_random_uuid(),
  photo text not null,
  caption text,
  sort_order int default 0
);

-- ─── piercing_photos ──────────────────────────────────────────────
create table if not exists piercing_photos (
  id uuid primary key default gen_random_uuid(),
  photo text not null,
  caption text,
  sort_order int default 0
);

-- ─── reviews (photo is REQUIRED — every review must have a face) ──
create table if not exists reviews (
  id uuid primary key default gen_random_uuid(),
  client_name text not null,
  photo text not null,
  review text,
  rating int default 5,
  sort_order int default 0
);
-- backfill any existing nulls from earlier deployments before locking
update reviews set photo = '' where photo is null;
do $$ begin
  alter table reviews alter column photo set not null;
exception when others then null; end $$;

-- ─── portfolio_items ──────────────────────────────────────────────
create table if not exists portfolio_items (
  id uuid primary key default gen_random_uuid(),
  artist_id uuid references artists(id) on delete cascade,
  photo text not null,
  title text,
  sort_order int default 0
);

-- ─── Seed default categories so the dropdown / static pages work ──
insert into categories (name, slug, sort_order) values
  ('Realistic', 'realistic', 1),
  ('Small & Minimal', 'small-minimal', 2)
on conflict (slug) do nothing;

-- ─── Seed existing artists (no photos — admin will fill in) ───────
insert into artists (name, slug, sort_order) values
  ('Avinash Kumar', 'avinash-kumar', 1),
  ('Suren', 'suren', 2)
on conflict (slug) do nothing;

-- ─── RLS: public read, writes go through service_role ─────────────
alter table site_settings    enable row level security;
alter table artists          enable row level security;
alter table categories       enable row level security;
alter table category_photos  enable row level security;
alter table studio_photos    enable row level security;
alter table piercing_photos  enable row level security;
alter table reviews          enable row level security;
alter table portfolio_items  enable row level security;

do $$ begin
  create policy "public read site_settings"   on site_settings    for select using (true);
  create policy "public read artists"         on artists          for select using (true);
  create policy "public read categories"      on categories       for select using (true);
  create policy "public read category_photos" on category_photos  for select using (true);
  create policy "public read studio_photos"   on studio_photos    for select using (true);
  create policy "public read piercing_photos" on piercing_photos  for select using (true);
  create policy "public read reviews"         on reviews          for select using (true);
  create policy "public read portfolio_items" on portfolio_items  for select using (true);
exception when duplicate_object then null; end $$;

-- ─── Storage bucket for media uploads ─────────────────────────────
insert into storage.buckets (id, name, public)
  values ('media', 'media', true)
  on conflict (id) do nothing;

do $$ begin
  create policy "public read media" on storage.objects for select using (bucket_id = 'media');
exception when duplicate_object then null; end $$;
