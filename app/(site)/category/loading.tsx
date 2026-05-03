export default function Loading() {
  return (
    <div className="bg-paper-texture min-h-screen pt-32 pb-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-20">
          <div className="h-12 md:h-16 w-72 max-w-full mx-auto rounded-full bg-stone-200/70 animate-pulse mb-6" />
          <div className="h-6 w-96 max-w-full mx-auto rounded-full bg-stone-200/70 animate-pulse" />
        </div>
        <div className="grid md:grid-cols-2 gap-10">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-[2rem] bg-stone-200/60 animate-pulse aspect-[4/3]" />
          ))}
        </div>
      </div>
    </div>
  );
}
