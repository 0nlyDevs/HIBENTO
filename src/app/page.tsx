"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

function StatCard({ value, label, color }: { value: string; label: string; color: string }) {
  return (
    <div className="bento-card text-center" style={{ borderTop: `3px solid ${color}` }}>
      <div className="text-3xl font-black text-charcoal">{value}</div>
      <div className="text-xs tracking-wider text-charcoal/50 mt-1">{label}</div>
    </div>
  );
}

function NavMenu() {
  const [open, setOpen] = useState(false);
  return (
    <nav className="border-b border-charcoal/10 bg-cream/95 backdrop-blur sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <Image src="/logo.svg" alt="HIBENTO" width={32} height={32} className="group-hover:scale-110 transition-transform" />
          <span className="font-bold text-2xl tracking-tighter text-charcoal">HIBENTO</span>
        </Link>
        <div className="hidden md:flex items-center gap-8">
          <Link href="/events" className="text-sm font-medium tracking-wider text-charcoal/70 hover:text-charcoal transition-colors">EVENTS</Link>
          <Link href="/speakers" className="text-sm font-medium tracking-wider text-charcoal/70 hover:text-charcoal transition-colors">SPEAKERS</Link>
          <Link href="/events" className="btn-primary text-xs py-2 px-4">EXPLORE</Link>
        </div>
        <button onClick={() => setOpen(!open)} className="md:hidden p-2">
          <div className="w-5 h-px bg-charcoal mb-1"></div>
          <div className="w-5 h-px bg-charcoal mb-1"></div>
          <div className="w-5 h-px bg-charcoal"></div>
        </button>
      </div>
      {open && (
        <div className="md:hidden border-t border-charcoal/10 bg-cream px-6 py-4 space-y-3 animate-slide-down">
          <Link href="/events" className="block text-sm font-medium text-charcoal/70">EVENTS</Link>
          <Link href="/speakers" className="block text-sm font-medium text-charcoal/70">SPEAKERS</Link>
          <Link href="/events" className="block btn-primary text-center text-xs">EXPLORE</Link>
        </div>
      )}
    </nav>
  );
}

function HeroSection() {
  return (
    <section className="relative overflow-hidden border-b border-charcoal/10">
      <div className="absolute inset-0 bg-grid pointer-events-none"></div>
      <div className="absolute top-0 right-0 w-1/3 h-full bg-yellow/5 pointer-events-none"></div>
      <div className="absolute -bottom-16 -right-16 w-64 h-64 border-2 border-yellow/20 rounded-full pointer-events-none"></div>
      <div className="absolute -top-8 left-1/4 w-32 h-32 border border-charcoal/5 rounded-full pointer-events-none"></div>
      <div className="max-w-7xl mx-auto px-6 pt-24 pb-32 relative">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8 animate-slide-up">
            <div className="flex items-center gap-4">
              <div className="w-12 h-px bg-charcoal/30"></div>
              <span className="text-xs tracking-[0.3em] text-charcoal/60 font-medium">EVENT PLATFORM</span>
            </div>
            <h1 className="text-6xl md:text-7xl font-black tracking-tighter text-charcoal leading-none">
              WHERE EVENTS
              <br />
              <span className="relative">
                COME ALIVE
                <span className="absolute bottom-2 left-0 w-full h-4 bg-yellow/40 -z-10"></span>
              </span>
            </h1>
            <p className="text-lg text-charcoal/60 leading-relaxed max-w-md">
              A real-time platform for event management and participant
              engagement. Navigate sessions, connect with speakers,
              and interact live.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <Link href="/events" className="btn-yellow">
                VIEW EVENTS
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
              <Link href="/speakers" className="btn-outline">SPEAKERS</Link>
              <Link href="/events" className="btn-ghost">
                EXPLORE
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
            </div>
            <div className="flex gap-8 pt-8 border-t border-charcoal/10">
              <div>
                <div className="text-3xl font-black text-charcoal">3</div>
                <div className="text-xs tracking-wider text-charcoal/60 mt-1">ACTIVE EVENTS</div>
              </div>
              <div>
                <div className="text-3xl font-black text-charcoal">24</div>
                <div className="text-xs tracking-wider text-charcoal/60 mt-1">SPEAKERS</div>
              </div>
              <div>
                <div className="text-3xl font-black text-charcoal">150+</div>
                <div className="text-xs tracking-wider text-charcoal/60 mt-1">SESSIONS</div>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              <div className="bento-card col-span-2 bg-yellow/20 p-0 overflow-hidden border-yellow/30">
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-nori opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-nori"></span>
                    </span>
                    <span className="text-xs tracking-widest font-bold text-charcoal">LIVE NOW</span>
                  </div>
                  <h3 className="text-xl font-bold text-charcoal mb-2">DevConf 2025</h3>
                  <p className="text-sm text-charcoal/60 mb-4">Keynote in progress</p>
                  <Link href="/events" className="btn-primary btn-sm text-xs bg-charcoal/90">JOIN LIVE</Link>
                </div>
                <div className="bg-yellow h-2"></div>
              </div>
              <div className="bento-card bg-sakura/30 border-sakura/40">
                <div className="text-3xl font-black text-charcoal mb-2">42</div>
                <div className="text-xs tracking-wider text-charcoal/60">SESSIONS TODAY</div>
              </div>
              <div className="bento-card bg-matcha/10 border-matcha/20">
                <div className="text-3xl font-black text-charcoal mb-2">8</div>
                <div className="text-xs tracking-wider text-charcoal/60">ACTIVE SPEAKERS</div>
              </div>
              <div className="bento-card col-span-2 bg-charcoal text-cream border-charcoal">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-yellow flex items-center justify-center">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M10 2L12.24 7.47L18 8.18L13.75 12.16L14.82 18L10 15.06L5.18 18L6.25 12.16L2 8.18L7.76 7.47L10 2Z" fill="#282828"/>
                    </svg>
                  </div>
                  <div>
                    <div className="text-sm font-bold text-cream">RATED 4.8 / 5.0</div>
                    <div className="text-xs text-cream/60">by 2,400+ attendees</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FeaturedEvents() {
  const { data } = useQuery({
    queryKey: ["featured-events"],
    queryFn: () => api.getEvents({ page: 1, limit: 3, upcoming: false }),
  });
  const events = data?.data?.slice(0, 3) || [];

  const eventColors = ["#EAE151", "#7B8B6F", "#E8635A"];
  const eventBgColors = ["bg-yellow/10", "bg-matcha/10", "bg-sakura/60"];

  return (
    <section className="max-w-7xl mx-auto px-6 py-24">
      <div className="flex items-center justify-between mb-12">
        <div>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-8 h-px bg-charcoal/30"></div>
            <span className="text-xs tracking-[0.3em] text-charcoal/60 font-medium">CURATED</span>
          </div>
          <h2 className="text-4xl font-black tracking-tighter text-charcoal">FEATURED EVENTS</h2>
        </div>
        <Link href="/events" className="btn-ghost hidden sm:flex">
          VIEW ALL
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </Link>
      </div>
      {events.length > 0 ? (
        <div className="grid md:grid-cols-3 gap-6">
          {events.map((event, i) => (
            <Link key={event.id} href={`/events`} className="group block">
              <div className={`${eventBgColors[i]} border border-charcoal/10 p-6 relative overflow-hidden transition-all duration-300 hover:shadow-[6px_6px_0px_0px_rgba(234,225,81,0.3)]`}>
                <div className="absolute top-0 right-0 w-24 h-24" style={{ background: `color-mix(in srgb, ${eventColors[i]} 15%, transparent)` }}></div>
                <div className="w-10 h-10 flex items-center justify-center mb-4" style={{ background: eventColors[i] }}>
                  <span className="text-xs font-black text-charcoal">{String(i + 1).padStart(2, "0")}</span>
                </div>
                <h3 className="text-lg font-bold text-charcoal mb-2 group-hover:text-yellow-dark transition-colors">{event.title}</h3>
                <p className="text-sm text-charcoal/60 mb-4 line-clamp-2">{event.description}</p>
                <div className="flex items-center gap-3 text-xs tracking-wider text-charcoal/50">
                  <span>{new Date(event.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                  <span className="w-px h-3 bg-charcoal/20"></span>
                  <span>{event.location}</span>
                  <span className="w-px h-3 bg-charcoal/20"></span>
                  <span>{event.sessionCount} SESSIONS</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="border border-charcoal/10 p-6">
              <div className="skeleton w-10 h-10 mb-4"></div>
              <div className="skeleton h-5 w-2/3 mb-2"></div>
              <div className="skeleton h-4 w-full mb-1"></div>
              <div className="skeleton h-4 w-4/5"></div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

function LiveNowSection() {
  const { data } = useQuery({
    queryKey: ["live-sessions"],
    queryFn: () => api.getEvents({ page: 1, limit: 5, upcoming: false }),
  });
  const events = data?.data || [];
  const liveEvents = events.filter(
    (e) => new Date(e.startDate) <= new Date() && new Date(e.endDate) >= new Date()
  );

  return (
    <section className="bg-charcoal py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-dots opacity-20 pointer-events-none"></div>
      <div className="max-w-7xl mx-auto px-6 relative">
        <div className="flex items-center gap-4 mb-4">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-yellow"></span>
          </span>
          <span className="text-xs tracking-[0.3em] text-yellow font-medium">REAL-TIME</span>
        </div>
        <h2 className="text-4xl font-black tracking-tighter text-cream mb-12">LIVE NOW</h2>
        {liveEvents.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {liveEvents.map((event) => (
              <Link key={event.id} href="/events" className="group block border border-cream/10 bg-cream/5 p-6 transition-all hover:bg-cream/10 hover:border-yellow/30">
                <div className="flex items-center gap-2 mb-3">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow"></span>
                  </span>
                  <span className="text-xs tracking-widest font-bold text-yellow">LIVE</span>
                </div>
                <h3 className="text-lg font-bold text-cream mb-2 group-hover:text-yellow transition-colors">{event.title}</h3>
                <p className="text-sm text-cream/50 mb-4 line-clamp-2">{event.description}</p>
                <div className="flex items-center gap-4 text-xs text-cream/40">
                  <span>{event.sessionCount} SESSIONS</span>
                  <span>{event.location}</span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="border border-dashed border-cream/20 p-12 text-center">
            <p className="text-cream/40 text-sm tracking-wider">NO LIVE EVENTS AT THE MOMENT</p>
            <p className="text-cream/30 text-xs mt-2">Check back soon or browse upcoming events</p>
          </div>
        )}
      </div>
    </section>
  );
}

function StatsSection() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-24">
      <div className="flex items-center gap-4 mb-12">
        <div className="w-8 h-px bg-charcoal/30"></div>
        <span className="text-xs tracking-[0.3em] text-charcoal/60 font-medium">BY THE NUMBERS</span>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard value="12" label="EVENTS HOSTED" color="#EAE151" />
        <StatCard value="48" label="SPEAKERS" color="#7B8B6F" />
        <StatCard value="2,400+" label="QUESTIONS ASKED" color="#E8635A" />
        <StatCard value="156" label="SESSIONS" color="#4A5A8A" />
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="bg-paper border-t border-charcoal/10 py-24">
      <div className="max-w-3xl mx-auto px-6 text-center">
        <h2 className="text-4xl font-black tracking-tighter text-charcoal mb-4">
          STAY IN THE LOOP
        </h2>
        <p className="text-charcoal/60 mb-8 max-w-md mx-auto">
          Get notified about upcoming events, new speakers, and live sessions.
        </p>
        <form className="flex gap-3 max-w-md mx-auto" onSubmit={(e) => e.preventDefault()}>
          <input type="email" placeholder="Enter your email" className="input-field flex-1" required />
          <button type="submit" className="btn-primary shrink-0">SUBSCRIBE</button>
        </form>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <NavMenu />
      <main className="flex-1">
        <HeroSection />
        <FeaturedEvents />
        <LiveNowSection />
        <StatsSection />
        <CTASection />
      </main>
      <footer className="border-t border-charcoal/10 bg-cream">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <Image src="/logo.svg" alt="HIBENTO" width={24} height={24} />
                <span className="font-bold text-lg tracking-tighter text-charcoal">HIBENTO</span>
              </div>
              <p className="text-sm text-charcoal/50 max-w-sm">
                Real-time event management and engagement platform. 
                Navigate sessions, connect with speakers, and interact live.
              </p>
            </div>
            <div>
              <div className="text-xs tracking-wider text-charcoal/40 mb-4">NAVIGATION</div>
              <div className="space-y-2">
                <Link href="/events" className="block text-sm text-charcoal/60 hover:text-charcoal">Events</Link>
                <Link href="/speakers" className="block text-sm text-charcoal/60 hover:text-charcoal">Speakers</Link>
              </div>
            </div>
            <div>
              <div className="text-xs tracking-wider text-charcoal/40 mb-4">LEGAL</div>
              <div className="space-y-2">
                <span className="block text-sm text-charcoal/40">Privacy Policy</span>
                <span className="block text-sm text-charcoal/40">Terms of Service</span>
              </div>
            </div>
          </div>
          <div className="border-t border-charcoal/10 pt-8 flex items-center justify-between">
            <span className="text-xs tracking-wider text-charcoal/40">HIBENTO &copy; 2025</span>
            <span className="text-xs tracking-wider text-charcoal/30">MADE WITH PRECISION</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
