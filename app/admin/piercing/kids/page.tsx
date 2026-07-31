import { PiercingGallery } from "../../_components/PiercingGallery";

export default function Page() {
  return (
    <div className="max-w-5xl">
      <h1 className="font-serif text-3xl mb-2">Kids gallery — “Little Stars”</h1>
      <p className="text-stone-600 mb-8 text-sm">
        The photo gallery on <code>/piercing/kids</code>. Completely separate from the adults
        gallery — nothing added here shows on the adults page.
      </p>
      <PiercingGallery audience="kids" />
    </div>
  );
}
