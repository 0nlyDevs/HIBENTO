import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <nav className="border-b border-charcoal/10 bg-cream/95 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <Image
              src="/logo.svg"
              alt="HIBENTO"
              width={32}
              height={32}
              className="group-hover:scale-110 transition-transform"
            />
            <span className="font-bold text-2xl tracking-tighter text-charcoal">
              HIBENTO
            </span>
          </Link>

          <div className="flex items-center gap-6">
            <Link href="/events" className="text-sm font-medium tracking-wider text-charcoal/70 hover:text-charcoal transition-colors">
              EVENTS
            </Link>
            <Link href="/speakers" className="text-sm font-medium tracking-wider text-charcoal/70 hover:text-charcoal transition-colors">
              SPEAKERS
            </Link>
            <Link href="/events" className="btn-primary text-xs py-2 px-4">
              EXPLORE
            </Link>
          </div>
        </div>
      </nav>

      <main className="flex-1">
        <section className="max-w-7xl mx-auto px-6 pt-24 pb-32">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8 animate-slide-up">
              <div className="flex items-center gap-4">
                <div className="w-12 h-px bg-charcoal/30"></div>
                <span className="text-xs tracking-[0.3em] text-charcoal/60 font-medium">
                  EVENT PLATFORM
                </span>
              </div>

              <h1 className="text-6xl font-black tracking-tighter text-charcoal leading-none">
                WHERE EVENTS
                <br />
                <span className="relative">
                  COME ALIVE
                  <span className="absolute bottom-2 left-0 w-full h-3 bg-yellow/40 -z-10"></span>
                </span>
              </h1>

              <p className="text-lg text-charcoal/60 leading-relaxed max-w-md">
                A real-time platform for event management and participant
                engagement. Navigate sessions, connect with speakers,
                and interact live.
              </p>

              <div className="flex gap-4 pt-4">
                <Link href="/events" className="btn-primary">
                  VIEW EVENTS
                </Link>
                <Link href="/speakers" className="btn-outline">
                  SPEAKERS
                </Link>
              </div>

              <div className="flex gap-8 pt-8 border-t border-charcoal/10">
                <div>
                  <div className="text-3xl font-black text-charcoal">3</div>
                  <div className="text-xs tracking-wider text-charcoal/60 mt-1">
                    ACTIVE EVENTS
                  </div>
                </div>
                <div>
                  <div className="text-3xl font-black text-charcoal">24</div>
                  <div className="text-xs tracking-wider text-charcoal/60 mt-1">
                    SPEAKERS
                  </div>
                </div>
                <div>
                  <div className="text-3xl font-black text-charcoal">150+</div>
                  <div className="text-xs tracking-wider text-charcoal/60 mt-1">
                    SESSIONS
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="bento-grid grid-cols-2 gap-4">
                <div className="bento-card col-span-2 bg-yellow/20 p-0 overflow-hidden">
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-2 h-2 bg-nori"></div>
                      <span className="text-xs tracking-widest font-bold text-charcoal">
                        LIVE NOW
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-charcoal mb-2">
                      DevConf 2025
                    </h3>
                    <p className="text-sm text-charcoal/60">
                      Keynote in progress
                    </p>
                  </div>
                  <div className="bg-yellow h-2"></div>
                </div>

                <div className="bento-card bg-sakura/30">
                  <div className="text-3xl font-black text-charcoal mb-2">42</div>
                  <div className="text-xs tracking-wider text-charcoal/60">
                    SESSIONS TODAY
                  </div>
                </div>

                <div className="bento-card bg-matcha/10">
                  <div className="text-3xl font-black text-charcoal mb-2">8</div>
                  <div className="text-xs tracking-wider text-charcoal/60">
                    ACTIVE SPEAKERS
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-charcoal/10 bg-paper">
        <div className="max-w-7xl mx-auto px-6 py-8 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Image src="/logo.svg" alt="HIBENTO" width={20} height={20} />
            <span className="text-xs tracking-wider text-charcoal/50">
              HIBENTO &copy; 2025
            </span>
          </div>
          <div className="flex gap-6">
            <span className="text-xs tracking-wider text-charcoal/40">
              MADE WITH PRECISION
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
