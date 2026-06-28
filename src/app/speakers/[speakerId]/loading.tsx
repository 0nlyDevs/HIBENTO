export default function SpeakerProfileLoading() {
  return (
    <div className="pt-16 pb-24">
      <div className="max-w-7xl mx-auto px-6">
        {/* Back link skeleton */}
        <div className="h-3 w-24 rounded-lg bg-white/5 animate-pulse mb-6" />

        <div className="grid lg:grid-cols-12 gap-8 mb-12">
          {/* Profile card skeleton */}
          <div className="lg:col-span-4">
            <div
              className="animate-pulse squircle-lg overflow-hidden flex flex-col"
              style={{ background: "#222222E6" }}
            >
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

          {/* Questions skeleton */}
          <div className="lg:col-span-8">
            <div
              className="animate-pulse squircle-lg p-6 flex flex-col"
              style={{ background: "#222222E6" }}
            >
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

        {/* Sessions skeleton */}
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
