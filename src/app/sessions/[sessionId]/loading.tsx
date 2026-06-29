export default function SessionPlayerLoading() {
  return (
    <div className="h-screen flex flex-col overflow-hidden animate-pulse">
      {/* Header */}
      <header
        className="shrink-0 z-40 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between"
        style={{ background: "rgba(19, 20, 24, 0.95)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}
      >
        <div className="flex items-center gap-3">
          <div className="h-7 w-16 rounded-full bg-white/5" />
          <div className="h-4 w-px bg-white/10 hidden sm:block" />
          <div className="h-4 w-48 rounded-lg bg-white/5 hidden sm:block" />
        </div>
        <div className="h-9 w-9 rounded-lg bg-white/5" />
      </header>

      {/* Content area */}
      <div className="flex-1 flex flex-col lg:flex-row min-h-0">
        {/* Video panel */}
        <div className="flex-none lg:flex-1 flex items-center justify-center bg-black/40">
          <div className="w-16 h-16 rounded-full bg-white/5" />
        </div>

        {/* Q&A panel */}
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
