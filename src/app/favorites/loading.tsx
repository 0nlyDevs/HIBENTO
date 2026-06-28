export default function FavoritesLoading() {
  return (
    <div className="pt-16 pb-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-start justify-between mb-8">
          <div>
            <p className="label-mono text-chartreuse mb-2">§ COMMUNITY</p>
            <h1 className="text-display text-[clamp(2.2rem,5vw,4rem)] text-ivory leading-none mb-3">
              Your Favourites
            </h1>
            <p className="text-sm text-ivory/70 leading-relaxed">
              Keep track of your favourite sessions and watch them anytime.
            </p>
          </div>
        </div>

        <div
          className="squircle-lg p-6"
          style={{ background: "#222222E6", border: "1px dashed rgba(255,255,255,0.18)" }}
        >
          <div className="space-y-3 animate-pulse">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="h-16 rounded-xl bg-white/4"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
