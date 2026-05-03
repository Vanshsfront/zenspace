export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-paper-texture">
      <div className="flex flex-col items-center gap-4 text-stone-500">
        <div className="w-10 h-10 rounded-full border-2 border-stone-300 border-t-stone-900 animate-spin" />
        <span className="text-sm tracking-widest uppercase">Loading…</span>
      </div>
    </div>
  );
}
