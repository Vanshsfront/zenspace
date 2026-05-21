-- site_settings: Google reviews badge (count + link), shown on the contact page.
ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "google_review_count" INTEGER DEFAULT 193;
ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "google_reviews_url" TEXT DEFAULT 'https://share.google/pSxgjeACR2Lh3WI9P';
UPDATE "site_settings" SET "google_review_count" = 193 WHERE "google_review_count" IS NULL;
UPDATE "site_settings" SET "google_reviews_url" = 'https://share.google/pSxgjeACR2Lh3WI9P' WHERE "google_reviews_url" IS NULL;

-- admin_auth: editable admin login password. Separate from site_settings, which
-- is publicly readable via the anon key; this table has RLS on with no policy
-- and privileges revoked from the public API roles, so only the server's direct
-- Prisma connection (which bypasses RLS) can read/write it.
CREATE TABLE IF NOT EXISTS "admin_auth" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "password" TEXT NOT NULL DEFAULT 'zenspace123098#',
    CONSTRAINT "admin_auth_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "admin_auth_single_row" CHECK ("id" = 1)
);
INSERT INTO "admin_auth" ("id") VALUES (1) ON CONFLICT DO NOTHING;
ALTER TABLE "admin_auth" ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON "admin_auth" FROM anon, authenticated;
