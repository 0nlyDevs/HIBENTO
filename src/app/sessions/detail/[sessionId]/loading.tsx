export default function SessionDetailLoading() {
  return (
    <div className="pt-16 pb-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wider text-ivory/70 mb-6">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M7 3L4 6L7 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          BACK
        </div>

        <div className="w-full squircle-lg overflow-hidden animate-pulse" style={{ background: "#131418", border: "1px solid rgba(255,255,255,0.08)" }}>
          <div className="h-1 w-full bg-white/5 shrink-0 rounded-t-[1rem]" />
          <div className="px-7 py-6 space-y-6">
            <div className="space-y-3">
              <div className="h-5 w-32 rounded-full bg-white/5" />
              <div className="h-8 w-3/4 rounded-xl bg-white/5" />
              <div className="h-4 w-1/2 rounded-lg bg-white/5" />
            </div>
            <div className="grid sm:grid-cols-3 gap-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="rounded-xl p-4 space-y-2" style={{ background: "rgba(255,255,255,0.03)" }}>
                  <div className="h-3 w-20 rounded-full bg-white/5" />
                  <div className="h-4 w-28 rounded-lg bg-white/5" />
                  <div className="h-3 w-20 rounded-lg bg-white/5" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
