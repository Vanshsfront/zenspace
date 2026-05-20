-- AlterTable
ALTER TABLE "reviews" ADD COLUMN     "video" TEXT;

-- CreateTable
CREATE TABLE "earring_categories" (
    "id" UUID NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "audience" TEXT NOT NULL,
    "description" TEXT,
    "photo" TEXT,
    "sort_order" INTEGER DEFAULT 0,

    CONSTRAINT "earring_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "earring_products" (
    "id" UUID NOT NULL,
    "category_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "photo" TEXT,
    "price_inr" INTEGER,
    "description" TEXT,
    "sort_order" INTEGER DEFAULT 0,

    CONSTRAINT "earring_products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "service_forms" (
    "id" UUID NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "intro" TEXT,
    "sort_order" INTEGER DEFAULT 0,

    CONSTRAINT "service_forms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "service_form_fields" (
    "id" UUID NOT NULL,
    "form_id" UUID NOT NULL,
    "key" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "required" BOOLEAN NOT NULL DEFAULT false,
    "options" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "sort_order" INTEGER DEFAULT 0,

    CONSTRAINT "service_form_fields_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "service_form_submissions" (
    "id" UUID NOT NULL,
    "form_id" UUID NOT NULL,
    "payload" JSONB NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'new',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "service_form_submissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "safety_items" (
    "id" UUID NOT NULL,
    "audience" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "photo" TEXT,
    "sort_order" INTEGER DEFAULT 0,

    CONSTRAINT "safety_items_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "earring_categories_slug_key" ON "earring_categories"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "service_forms_slug_key" ON "service_forms"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "service_form_fields_form_id_key_key" ON "service_form_fields"("form_id", "key");

-- AddForeignKey
ALTER TABLE "earring_products" ADD CONSTRAINT "earring_products_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "earring_categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "service_form_fields" ADD CONSTRAINT "service_form_fields_form_id_fkey" FOREIGN KEY ("form_id") REFERENCES "service_forms"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "service_form_submissions" ADD CONSTRAINT "service_form_submissions_form_id_fkey" FOREIGN KEY ("form_id") REFERENCES "service_forms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
