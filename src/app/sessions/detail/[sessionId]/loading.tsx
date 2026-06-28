export default function SessionDetailLoading() {
  return (
    <div className="pt-16 pb-24">
      <div className="max-w-7xl mx-auto px-6 animate-pulse">
        {/* Back link */}
        <div className="h-3 w-16 rounded-lg bg-white/5 mb-6" />

        {/* Main card */}
        <div className="w-full squircle-lg overflow-hidden" style={{ background: "#131418", border: "1px solid rgba(255,255,255,0.08)" }}>
          <div className="h-1 w-full bg-white/5 shrink-0 rounded-t-[1rem]" />

          <div className="px-7 py-6 space-y-6">
            {/* Title area */}
            <div className="space-y-3">
              <div className="h-5 w-32 rounded-full bg-white/5" />
              <div className="h-8 w-3/4 rounded-xl bg-white/5" />
              <div className="h-4 w-1/2 rounded-lg bg-white/5" />
            </div>

            {/* Info cards */}
            <div className="grid sm:grid-cols-3 gap-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="rounded-xl p-4 space-y-2" style={{ background: "rgba(255,255,255,0.03)" }}>
                  <div className="h-3 w-20 rounded-full bg-white/5" />
                  <div className="h-4 w-28 rounded-lg bg-white/5" />
                  <div className="h-3 w-20 rounded-lg bg-white/5" />
                </div>
              ))}
            </div>

            {/* Speakers */}
            <div className="space-y-3">
              <div className="h-3 w-20 rounded-full bg-white/5" />
              <div className="grid sm:grid-cols-2 gap-2">
                {Array.from({ length: 2 }).map((_, i) => (
                  <div key={i} className="h-16 rounded-xl bg-white/5" />
                ))}
              </div>
            </div>

            {/* Venue */}
            <div className="h-20 rounded-xl bg-white/5" />
          </div>
        </div>
      </div>
    </div>
  );
}
