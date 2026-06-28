export function FavoritesSkeleton({ className }: { className?: string }) {
  return (
    <div className={`pt-16 pb-24 ${className ?? ""}`}>
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div className="space-y-3">
            <div className="h-3 w-24 rounded-full bg-white/5 animate-pulse" />
            <div className="h-10 w-64 rounded-xl bg-white/5 animate-pulse" />
            <div className="h-4 w-56 rounded-lg bg-white/5 animate-pulse" />
          </div>
          <div className="h-4 w-24 rounded-lg bg-white/5 animate-pulse" />
        </div>

        {/* Schedule table skeleton */}
        <div
          className="squircle-lg p-6"
          style={{ background: "#222222E6", border: "1px dashed rgba(255,255,255,0.18)" }}
        >
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="h-16 rounded-xl bg-white/4 animate-pulse"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
