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
alter table site_settings add column if not exists google_review_count int default 193;
alter table site_settings add column if not exists google_reviews_url text default 'https://share.google/pSxgjeACR2Lh3WI9P';
insert into site_settings (id) values (1) on conflict do nothing;
update site_settings set google_review_count = 193 where google_review_count is null;
update site_settings set google_reviews_url = 'https://share.google/pSxgjeACR2Lh3WI9P' where google_reviews_url is null;

-- ─── admin_auth (private) ─────────────────────────────────────────
-- Admin login password, editable from the panel. Deliberately a separate table
-- with NO public read policy so it is never exposed via the anon key, unlike
-- site_settings. The server reads/writes it through Prisma's direct connection,
-- which bypasses RLS.
create table if not exists admin_auth (
  id int primary key default 1,
  password text not null default 'zenspace123098#',
  constraint admin_auth_single_row check (id = 1)
);
insert into admin_auth (id) values (1) on conflict do nothing;
alter table admin_auth enable row level security;
-- No policies = anon/authenticated (PostgREST) get zero rows. Revoke as well so
-- the table is fully invisible to the public API roles.
revoke all on admin_auth from anon, authenticated;

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

-- ─── admin & media revamp (2026-07-24) ────────────────────────────
alter table site_settings add column if not exists hero_video text;
alter table site_settings add column if not exists home_piercing_kids_image text;
alter table site_settings add column if not exists home_piercing_adults_image text;
alter table piercing_photos add column if not exists audience text not null default 'adults';

create table if not exists blog_posts (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  excerpt text,
  cover_image text,
  blocks jsonb not null default '[]'::jsonb,
  published boolean not null default false,
  published_at timestamptz,
  sort_order int default 0,
  created_at timestamptz default now()
);

create table if not exists legal_pages (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  blocks jsonb not null default '[]'::jsonb,
  updated_at timestamptz default now()
);

alter table blog_posts  enable row level security;
alter table legal_pages enable row level security;
do $$ begin
  create policy "public read blog_posts"  on blog_posts  for select using (published = true);
  create policy "public read legal_pages" on legal_pages for select using (true);
exception when duplicate_object then null; end $$;

-- Seed two dummy published blog posts + the two legal pages.
insert into blog_posts (slug, title, excerpt, published, published_at, sort_order, blocks) values
  ('welcome-to-zenspace', 'Welcome to Zenspace', 'A quick look at how we approach custom tattoo and piercing work.', true, now(), 1,
   '[{"type":"heading","level":"h2","text":"Our approach"},{"type":"paragraph","text":"At Zenspace we treat every piece as a collaboration. This is placeholder copy you can edit from the admin panel."},{"type":"paragraph","text":"Add headings, paragraphs and images to build out each post."}]'::jsonb),
  ('aftercare-basics', 'Piercing aftercare basics', 'Simple, studio-tested steps to heal cleanly.', true, now(), 2,
   '[{"type":"heading","level":"h2","text":"The first two weeks"},{"type":"paragraph","text":"Placeholder aftercare guidance. Edit this from the admin panel."}]'::jsonb)
on conflict (slug) do nothing;

insert into legal_pages (slug, title, blocks) values
  ('terms', 'Terms & Conditions',
   '[{"type":"paragraph","text":"These are placeholder Terms & Conditions. Replace this text from the admin panel."}]'::jsonb),
  ('privacy', 'Privacy Policy',
   '[{"type":"paragraph","text":"This is a placeholder Privacy Policy. Replace this text from the admin panel."}]'::jsonb)
on conflict (slug) do nothing;

-- ─── Storage bucket for media uploads ─────────────────────────────
-- 209715200 = 200 MB, so large photos + videos are accepted. Folded into the
-- insert (with do-update) so a fresh bootstrap sets the limit regardless of
-- statement order.
insert into storage.buckets (id, name, public, file_size_limit)
  values ('media', 'media', true, 209715200)
  on conflict (id) do update set file_size_limit = excluded.file_size_limit;

do $$ begin
  create policy "public read media" on storage.objects for select using (bucket_id = 'media');
exception when duplicate_object then null; end $$;
