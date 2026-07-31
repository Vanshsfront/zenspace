import { PiercingGallery } from "../../_components/PiercingGallery";

export default function Page() {
  return (
    <div className="max-w-5xl">
      <h1 className="font-serif text-3xl mb-2">Adults gallery</h1>
      <p className="text-stone-600 mb-8 text-sm">
        The photo gallery on <code>/piercing/adults</code>. Completely separate from the kids
        gallery — nothing added here shows on the kids page.
      </p>
      <PiercingGallery audience="adults" />
    </div>
  );
}
