# Zenspace Art & Tattoo — Website

Next.js 16 + Tailwind 4 + Supabase. Admin-managed content for artists, categories, studio photos, reviews, and site settings.

## Setup

### 1. Install
```bash
npm install
```

### 2. Environment
`.env.local` already contains Supabase keys. Optionally override admin password:
```
ADMIN_PASSWORD=your-strong-password
```
Default admin password: `zenspace2026`

### 3. Supabase schema
Open the Supabase SQL editor and run `supabase/schema.sql`. This creates tables, RLS policies, and the public `media` storage bucket.

Dashboard: https://supabase.com/dashboard/project/zzpyjisxzgixbjxlpivy/sql

### 4. Dev
```bash
npm run dev
```
- Site → http://localhost:3000
- Admin → http://localhost:3000/admin (redirects to /admin-login if not signed in)

## Admin panel
- **Site settings** `/admin` — hero text/image, closing CTA, contact info, social links
- **Artists** `/admin/artists` — add any number of artists, photo + portfolio URL
- **Categories** `/admin/categories` — 6 homepage categories with photos
- **Studio photos** `/admin/studio` — 3 photos for "Places where we create your story"
- **Reviews** `/admin/reviews` — client photos + review text
- Every image field uploads directly into the Supabase `media` storage bucket.

## Pages
`/` home, `/category`, `/our-artist`, `/about`, `/contact`, `/locate-us`

## Stack
Next.js 16 (App Router, Turbopack), Tailwind CSS v4, Supabase (Postgres + Storage + RLS), lucide-react, Playfair Display + Inter.
