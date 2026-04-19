-- Run this in Supabase SQL editor for project zzpyjisxzgixbjxlpivy

-- Single-row site settings (hero image, hero text, CTA, etc.)
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
  instagram text,
  facebook text,
  pinterest text,
  constraint single_row check (id = 1)
);
insert into site_settings (id) values (1) on conflict do nothing;

create table if not exists artists (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text,
  photo text,
  portfolio_url text,
  sort_order int default 0,
  created_at timestamptz default now()
);

create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  photo text,
  sort_order int default 0
);

create table if not exists studio_photos (
  id uuid primary key default gen_random_uuid(),
  photo text not null,
  caption text,
  sort_order int default 0
);

create table if not exists reviews (
  id uuid primary key default gen_random_uuid(),
  client_name text not null,
  photo text,
  review text,
  rating int default 5,
  sort_order int default 0
);

create table if not exists portfolio_items (
  id uuid primary key default gen_random_uuid(),
  artist_id uuid references artists(id) on delete cascade,
  photo text not null,
  title text,
  sort_order int default 0
);

-- RLS: public read, service role writes
alter table site_settings enable row level security;
alter table artists enable row level security;
alter table categories enable row level security;
alter table studio_photos enable row level security;
alter table reviews enable row level security;
alter table portfolio_items enable row level security;

do $$ begin
  create policy "public read site_settings" on site_settings for select using (true);
  create policy "public read artists" on artists for select using (true);
  create policy "public read categories" on categories for select using (true);
  create policy "public read studio_photos" on studio_photos for select using (true);
  create policy "public read reviews" on reviews for select using (true);
  create policy "public read portfolio_items" on portfolio_items for select using (true);
exception when duplicate_object then null; end $$;

-- Storage bucket for media (create in Supabase dashboard or via SQL below)
insert into storage.buckets (id, name, public)
  values ('media', 'media', true)
  on conflict (id) do nothing;

-- Public read policy on the bucket
do $$ begin
  create policy "public read media" on storage.objects for select using (bucket_id = 'media');
exception when duplicate_object then null; end $$;
