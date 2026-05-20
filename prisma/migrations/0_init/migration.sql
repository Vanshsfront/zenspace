-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "public"."artists" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT,
    "role" TEXT,
    "photo" TEXT,
    "portfolio_url" TEXT,
    "experience" TEXT,
    "specialty" TEXT,
    "bio" TEXT,
    "sort_order" INTEGER DEFAULT 0,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "artists_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."categories" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT,
    "photo" TEXT,
    "sort_order" INTEGER DEFAULT 0,
    "description" TEXT,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."category_photos" (
    "id" UUID NOT NULL,
    "category_id" UUID,
    "photo" TEXT NOT NULL,
    "caption" TEXT,
    "sort_order" INTEGER DEFAULT 0,

    CONSTRAINT "category_photos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."custom_requests" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "description" TEXT NOT NULL,
    "reference" TEXT,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "custom_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."earring_options" (
    "id" UUID NOT NULL,
    "audience" TEXT NOT NULL,
    "metal" TEXT NOT NULL,
    "photo" TEXT,
    "benefits" TEXT,
    "sort_order" INTEGER DEFAULT 0,

    CONSTRAINT "earring_options_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."piercing_photos" (
    "id" UUID NOT NULL,
    "photo" TEXT NOT NULL,
    "caption" TEXT,
    "sort_order" INTEGER DEFAULT 0,

    CONSTRAINT "piercing_photos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."portfolio_items" (
    "id" UUID NOT NULL,
    "artist_id" UUID,
    "photo" TEXT NOT NULL,
    "title" TEXT,
    "sort_order" INTEGER DEFAULT 0,

    CONSTRAINT "portfolio_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."reviews" (
    "id" UUID NOT NULL,
    "client_name" TEXT NOT NULL,
    "photo" TEXT NOT NULL,
    "review" TEXT,
    "rating" INTEGER DEFAULT 5,
    "sort_order" INTEGER DEFAULT 0,

    CONSTRAINT "reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."short_videos" (
    "id" UUID NOT NULL,
    "video" TEXT NOT NULL,
    "poster" TEXT,
    "caption" TEXT,
    "sort_order" INTEGER DEFAULT 0,

    CONSTRAINT "short_videos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."site_settings" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "hero_title" TEXT DEFAULT 'We help you choose the right tattoo',
    "hero_subtitle" TEXT DEFAULT 'Not just any tattoo.',
    "hero_description" TEXT DEFAULT 'A consultation-led process built around anatomy, symbolism and long term aesthetics.',
    "hero_image" TEXT,
    "cta_title" TEXT DEFAULT 'Zenspace — Where your story becomes timeless art',
    "cta_subtitle" TEXT DEFAULT 'Custom tattoos crafted with passion, precision and meaning.',
    "address" TEXT DEFAULT 'Shop No. 101, 1st Floor, Zenspace Art and Tattoo, Akruti Commercial Complex, MIDC Central Rd, Near Akruti Centre Point, Gautam Nagar, Chakala Industrial Area (MIDC), Andheri East, Mumbai, Maharashtra 400093',
    "email" TEXT DEFAULT 'zenspace32@gmail.com',
    "phone" TEXT DEFAULT '+91 7208388209 / +91 8652144521',
    "whatsapp" TEXT,
    "instagram" TEXT,
    "facebook" TEXT,
    "pinterest" TEXT,
    "piercing_baby_blurb" TEXT,
    "piercing_intro" TEXT,
    "piercing_title" TEXT,
    "about_body" TEXT,
    "about_heading" TEXT DEFAULT 'About Zenspace',
    "about_photo_1" TEXT,
    "about_photo_2" TEXT,
    "about_title" TEXT DEFAULT 'Workspace where we create magic',
    "aftercare_pdf" TEXT,
    "piercing_adults_intro" TEXT,
    "piercing_adults_title" TEXT,
    "piercing_kids_intro" TEXT,
    "piercing_kids_title" TEXT,

    CONSTRAINT "site_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."studio_photos" (
    "id" UUID NOT NULL,
    "photo" TEXT NOT NULL,
    "caption" TEXT,
    "sort_order" INTEGER DEFAULT 0,

    CONSTRAINT "studio_photos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "artists_slug_key" ON "public"."artists"("slug" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "artists_slug_unique" ON "public"."artists"("slug" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "categories_slug_key" ON "public"."categories"("slug" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "categories_slug_unique" ON "public"."categories"("slug" ASC);

-- AddForeignKey
ALTER TABLE "public"."category_photos" ADD CONSTRAINT "category_photos_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."portfolio_items" ADD CONSTRAINT "portfolio_items_artist_id_fkey" FOREIGN KEY ("artist_id") REFERENCES "public"."artists"("id") ON DELETE CASCADE ON UPDATE CASCADE;
