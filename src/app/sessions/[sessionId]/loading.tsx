import { ArrowLeft, Heart } from "lucide-react";

export default function SessionPlayerLoading() {
  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <header
        className="shrink-0 z-40 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between"
        style={{ background: "rgba(19, 20, 24, 0.95)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}
      >
        <div className="flex items-center gap-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full label-mono text-xs text-ivory/60 border border-dashed border-ivory/20 shrink-0">
            <ArrowLeft size={12} />
            BACK
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center border border-dashed border-ivory/15 text-ivory/40">
            <Heart size={15} />
          </div>
        </div>
      </header>
      <div className="flex-1 flex flex-col lg:flex-row min-h-0 animate-pulse">
        <div className="flex-none lg:flex-1 flex items-center justify-center bg-black/40">
          <div className="w-16 h-16 rounded-full bg-white/5" />
        </div>
        <div className="lg:w-[380px] xl:w-[420px] shrink-0 border-l border-white/5 p-4 space-y-3">
          <div className="h-5 w-24 rounded-full bg-white/5" />
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="p-4 rounded-xl space-y-2" style={{ background: "rgba(255,255,255,0.03)" }}>
              <div className="h-3 w-full rounded bg-white/5" />
              <div className="h-3 w-3/4 rounded bg-white/5" />
              <div className="h-2 w-24 rounded bg-white/5 mt-2" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
