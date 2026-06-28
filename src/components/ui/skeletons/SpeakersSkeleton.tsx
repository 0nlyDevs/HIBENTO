export function SpeakersSkeleton({ className }: { className?: string }) {
  return (
    <div className={`pt-16 pb-24 ${className ?? ""}`}>
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div className="space-y-3">
            <div className="h-3 w-24 rounded-full bg-white/5 animate-pulse" />
            <div className="h-10 w-52 rounded-xl bg-white/5 animate-pulse" />
            <div className="h-4 w-64 rounded-lg bg-white/5 animate-pulse" />
          </div>
          <div className="h-4 w-16 rounded-lg bg-white/5 animate-pulse" />
        </div>

        {/* Grid of speaker cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="animate-pulse squircle-lg overflow-hidden flex flex-col"
              style={{ background: "#222222E6" }}
            >
              {/* Image area */}
              <div className="relative aspect-4/3 bg-white/5" />
              {/* Content */}
              <div className="p-5 space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-white/5" />
                  <div className="h-2.5 w-20 rounded-full bg-white/5" />
                </div>
                <div className="h-4 w-32 rounded-lg bg-white/5" />
                <div className="space-y-1.5">
                  <div className="h-2.5 w-full rounded bg-white/5" />
                  <div className="h-2.5 w-3/4 rounded bg-white/5" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
