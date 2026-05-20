export function VideoPlaceholderCard() {
  return (
    <div className="relative w-[320px] aspect-[9/16] rounded-[2rem] overflow-hidden shadow-lg shrink-0 bg-gradient-to-br from-stone-100 to-stone-300 flex items-center justify-center">
      <svg width="56" height="56" viewBox="0 0 24 24" fill="currentColor" className="text-stone-50/90" aria-hidden>
        <path d="M8 5v14l11-7L8 5z" />
      </svg>
      <p className="absolute bottom-5 left-0 right-0 text-center text-sm text-stone-50/90 font-medium">Video coming soon</p>
    </div>
  );
}
