export function EventsSkeleton({ className }: { className?: string }) {
  return (
    <div className={`pt-20 pb-20 ${className ?? ""}`}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-start justify-between mb-6">
          <div className="space-y-3">
            <div className="h-3 w-20 rounded-full bg-white/5 animate-pulse" />
            <div className="h-10 w-72 rounded-xl bg-white/5 animate-pulse" />
            <div className="h-4 w-56 rounded-lg bg-white/5 animate-pulse" />
          </div>
          <div className="h-4 w-16 rounded-lg bg-white/5 animate-pulse" />
        </div>

        <div
          className="flex items-center justify-between gap-3 p-3 mb-8 squircle-lg"
          style={{ background: "#222222E6", border: "1px dashed rgba(255,255,255,0.18)" }}
        >
          <div className="h-9 w-56 rounded-lg bg-white/5 animate-pulse" />
          <div className="flex items-center gap-2">
            <div className="h-9 w-28 rounded-lg bg-white/5 animate-pulse" />
            <div className="h-9 w-24 rounded-lg bg-white/5 animate-pulse" />
            <div className="h-9 w-28 rounded-lg bg-white/5 animate-pulse" />
            <div className="h-9 w-60 rounded-lg bg-white/5 animate-pulse" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div
            className="col-span-full h-80 animate-pulse squircle-lg"
            style={{ background: "#222222E6" }}
          />
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-64 animate-pulse squircle-lg"
              style={{ background: "#222222E6" }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
