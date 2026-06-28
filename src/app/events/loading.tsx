export default function EventsLoading() {
  return (
    <div className="pt-20 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header — texte réel, pas de skeleton */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <p className="label-mono text-chartreuse mb-2">§ EXPLORE</p>
            <h1 className="text-display text-[clamp(2.2rem,5vw,4rem)] text-ivory leading-none mb-3">
              Discover our events
            </h1>
            <p className="text-sm text-ivory/70 leading-relaxed">
              Join our upcoming sessions and expand your skills.
            </p>
          </div>
          {/* Petit skeleton pour le count — comme GitHub */}
          <div className="h-4 w-16 rounded-lg bg-white/5 animate-pulse shrink-0 mt-0.5" />
        </div>

        {/* Barre de filtres — layout statique visible */}
        <div
          className="flex items-center justify-between gap-3 p-3 mb-8 squircle-lg"
          style={{ background: "#222222E6", border: "1px dashed rgba(255,255,255,0.18)" }}
        >
          <div className="relative w-56 shrink-0">
            <div
              className="w-full h-9 rounded-lg"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
            />
          </div>
          <div className="flex items-center gap-2 flex-wrap justify-end">
            <div className="h-9 w-28 rounded-lg bg-white/5 animate-pulse" />
            <div className="h-9 w-24 rounded-lg bg-white/5 animate-pulse" />
            <div className="h-9 w-28 rounded-lg bg-white/5 animate-pulse" />
            <div className="h-9 w-60 rounded-lg bg-white/5 animate-pulse" />
          </div>
        </div>

        {/* Grille en skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div
            className="col-span-full h-80 animate-pulse squircle-lg"
            style={{ background: "#222222E6" }}
          />
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-48 animate-pulse squircle-lg"
              style={{ background: "#222222E6" }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
