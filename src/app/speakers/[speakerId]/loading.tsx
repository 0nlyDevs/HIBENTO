export default function SpeakerProfileLoading() {
  return (
    <div className="pt-16 pb-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wider text-ivory/70 mb-6">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M7 3L4 6L7 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          ALL SPEAKERS
        </div>

        <div className="grid lg:grid-cols-12 gap-8 mb-12">
          <div className="lg:col-span-4">
            <div className="animate-pulse squircle-lg overflow-hidden flex flex-col" style={{ background: "#222222E6" }}>
              <div className="p-6 pb-4 flex flex-col items-center">
                <div className="w-36 h-36 rounded-full bg-white/5 mb-3" />
                <div className="h-6 w-40 rounded-lg bg-white/5 mt-2" />
              </div>
              <div className="px-6 pb-6 text-center">
                <div className="h-4 w-full rounded bg-white/5 mb-2" />
                <div className="h-4 w-3/4 rounded bg-white/5 mx-auto" />
              </div>
            </div>
          </div>

          <div className="lg:col-span-8">
            <div className="animate-pulse squircle-lg p-6 flex flex-col" style={{ background: "#222222E6" }}>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-4 h-4 rounded bg-white/5" />
                <div className="h-3 w-48 rounded-full bg-white/5" />
              </div>
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="p-4 rounded-lg mb-3" style={{ background: "rgba(255,255,255,0.03)" }}>
                  <div className="h-3 w-full rounded bg-white/5 mb-2" />
                  <div className="h-3 w-2/3 rounded bg-white/5" />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="animate-pulse">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-4 h-4 rounded bg-white/5" />
            <div className="h-3 w-24 rounded-full bg-white/5" />
          </div>
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="squircle-lg mb-3 p-5 flex items-center gap-4"
              style={{ background: "#222222E6" }}
            >
              <div className="h-10 w-10 rounded-lg bg-white/5" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-48 rounded bg-white/5" />
                <div className="h-3 w-32 rounded bg-white/5" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
