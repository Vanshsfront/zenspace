"use client";
import { useEffect, useMemo, useState } from "react";
import { CrudList } from "../CrudList";
import { MultiImageUpload } from "../_components/MultiImageUpload";

type Category = { id: string; name: string; slug: string | null };

export default function CategoryPhotosPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryId, setCategoryId] = useState<string>("");
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    fetch("/api/admin/categories")
      .then((r) => r.json())
      .then((d: Category[]) => {
        setCategories(d || []);
        if (d?.[0]) setCategoryId(d[0].id);
      });
  }, []);

  const extras = useMemo(() => ({ category_id: categoryId }), [categoryId]);

  return (
    <div className="max-w-5xl">
      <h1 className="font-serif text-3xl mb-2">Category photos</h1>
      <p className="text-stone-600 mb-6">Add the gallery photos that show up on each category page (e.g. /category/realistic).</p>

      <label className="block mb-8">
        <span className="text-sm font-medium">Choose a category</span>
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className="mt-1 w-full md:w-96 px-4 py-2.5 rounded-lg border bg-white"
        >
          {categories.length === 0 && <option value="">— No categories yet, add one first —</option>}
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}{c.slug ? ` (/category/${c.slug})` : ""}
            </option>
          ))}
        </select>
      </label>

      {categoryId && (
        <>
          <div className="mb-8">
            <h2 className="font-serif text-xl mb-3">Bulk upload</h2>
            <MultiImageUpload table="category_photos" extraFields={extras} onUploaded={() => setReloadKey((k) => k + 1)} />
          </div>
          <h2 className="font-serif text-xl mb-3">Edit existing</h2>
          <CrudList
            key={categoryId}
            table="category_photos"
            title=""
            disableSearch
            reloadKey={reloadKey}
            filter={{ key: "category_id", value: categoryId }}
            fields={[
              { key: "photo", label: "Photo", type: "image" },
              { key: "caption", label: "Caption (optional)" },
              { key: "category_id", label: "Category (auto)", hidden: true },
            ]}
          />
        </>
      )}
    </div>
  );
}
