export default function EventDetailLoading() {
  return (
    <div className="pt-16 pb-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wider text-ivory/70 mb-6">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M7 3L4 6L7 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          ALL EVENTS
        </div>

        <div className="space-y-4">
          <div className="h-72 animate-pulse card-glass squircle-lg" />
          <div className="grid grid-cols-4 gap-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-20 animate-pulse card-glass squircle" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
