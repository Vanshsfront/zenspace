-- site_settings: hero video + homepage piercing card images
ALTER TABLE "public"."site_settings" ADD COLUMN IF NOT EXISTS "hero_video" TEXT;
ALTER TABLE "public"."site_settings" ADD COLUMN IF NOT EXISTS "home_piercing_kids_image" TEXT;
ALTER TABLE "public"."site_settings" ADD COLUMN IF NOT EXISTS "home_piercing_adults_image" TEXT;

-- piercing_photos: audience split (existing rows default to adults; re-tag in admin)
ALTER TABLE "public"."piercing_photos" ADD COLUMN IF NOT EXISTS "audience" TEXT NOT NULL DEFAULT 'adults';

-- blog_posts
CREATE TABLE IF NOT EXISTS "public"."blog_posts" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "slug" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "excerpt" TEXT,
  "cover_image" TEXT,
  "blocks" JSONB NOT NULL DEFAULT '[]'::jsonb,
  "published" BOOLEAN NOT NULL DEFAULT false,
  "published_at" TIMESTAMPTZ(6),
  "sort_order" INTEGER DEFAULT 0,
  "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "blog_posts_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "blog_posts_slug_key" ON "public"."blog_posts"("slug");

-- legal_pages
CREATE TABLE IF NOT EXISTS "public"."legal_pages" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "slug" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "blocks" JSONB NOT NULL DEFAULT '[]'::jsonb,
  "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "legal_pages_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "legal_pages_slug_key" ON "public"."legal_pages"("slug");
