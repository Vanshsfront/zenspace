"use client";
import { useEffect, useMemo, useState } from "react";
import { CrudList } from "../CrudList";
import { MultiImageUpload } from "../_components/MultiImageUpload";

type Artist = { id: string; name: string };

export default function PortfoliosPage() {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [artistId, setArtistId] = useState<string>("");
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    fetch("/api/admin/artists")
      .then((r) => r.json())
      .then((d: Artist[]) => {
        setArtists(d || []);
        if (d?.[0]) setArtistId(d[0].id);
      });
  }, []);

  const extras = useMemo(() => ({ artist_id: artistId }), [artistId]);

  return (
    <div className="max-w-5xl">
      <h1 className="font-serif text-3xl mb-2">Artist portfolios</h1>
      <p className="text-stone-600 mb-6">Add the photos that show up on each artist's profile page.</p>

      <label className="block mb-8">
        <span className="text-sm font-medium">Choose an artist</span>
        <select
          value={artistId}
          onChange={(e) => setArtistId(e.target.value)}
          className="mt-1 w-full md:w-96 px-4 py-2.5 rounded-lg border bg-white"
        >
          {artists.length === 0 && <option value="">— No artists yet, add one first —</option>}
          {artists.map((a) => (
            <option key={a.id} value={a.id}>{a.name}</option>
          ))}
        </select>
      </label>

      {artistId && (
        <>
          <div className="mb-8">
            <h2 className="font-serif text-xl mb-3">Bulk upload</h2>
            <MultiImageUpload table="portfolio_items" extraFields={extras} onUploaded={() => setReloadKey((k) => k + 1)} />
          </div>
          <h2 className="font-serif text-xl mb-3">Edit existing</h2>
          <CrudList
            key={artistId}
            table="portfolio_items"
            title=""
            disableSearch
            reloadKey={reloadKey}
            filter={{ key: "artist_id", value: artistId }}
            fields={[
              { key: "photo", label: "Photo", type: "image" },
              { key: "title", label: "Title (optional)" },
              { key: "artist_id", label: "Artist (auto)", hidden: true },
            ]}
          />
        </>
      )}
    </div>
  );
}
