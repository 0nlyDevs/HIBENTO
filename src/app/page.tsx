"use client";

import Link from "next/link";
import Image from "next/image";
import { useGetEvents } from "@/lib/hooks/useEvents";

export default function Home() {
  const { data } = useGetEvents({ page: 1, limit: 6 });
  const events = data?.data || [];
  const liveEvents = events.filter(e => {
    const now = new Date();
    return new Date(e.startDate) <= now && new Date(e.endDate) >= now;
  });

  return (
    <div className="min-h-screen bg-cream">
      {/* Nav */}
      <nav className="border-b border-charcoal/10 bg-cream/95 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <Image src="/logo.svg" alt="HiBento" width={28} height={28} />
            <span className="font-bold text-xl tracking-tighter text-charcoal">HIBENTO</span>
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/events" className="text-sm font-medium text-charcoal/70 hover:text-charcoal">
              EVENTS
            </Link>
            <Link href="/speakers" className="text-sm font-medium text-charcoal/70 hover:text-charcoal">
              SPEAKERS
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="max-w-2xl">
          <h1 className="text-6xl font-black tracking-tighter text-charcoal leading-none mb-6">
            WHERE EVENTS<br />COME ALIVE
          </h1>
          <p className="text-lg text-charcoal/60 mb-8">
            Real-time event platform for Madagascar. Browse sessions, connect with speakers, and interact live.
          </p>
          <Link href="/events" className="inline-flex items-center gap-2 px-6 py-3 bg-charcoal text-cream text-sm font-medium tracking-wider">
            EXPLORE EVENTS
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </Link>
        </div>
      </section>

      {/* Live Events */}
      {liveEvents.length > 0 && (
        <section className="bg-charcoal py-16">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-center gap-2 mb-8">
              <span className="w-2 h-2 bg-yellow animate-pulse" />
              <span className="text-xs tracking-widest text-yellow font-bold">LIVE NOW</span>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              {liveEvents.map((event) => (
                <Link
                  key={event.id}
                  href="/events"
                  className="block p-6 border border-cream/10 bg-cream/5 hover:bg-cream/10 transition-colors"
                >
                  <h3 className="font-bold text-cream mb-2">{event.title}</h3>
                  <p className="text-sm text-cream/50 line-clamp-2">{event.description}</p>
                  <p className="text-xs text-cream/40 mt-4">{event.venue.city}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Upcoming Events */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <h2 className="text-3xl font-black tracking-tighter text-charcoal mb-8">UPCOMING EVENTS</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {events.filter(e => new Date(e.startDate) > new Date()).slice(0, 3).map((event) => (
            <Link
              key={event.id}
              href="/events"
              className="block p-6 border border-charcoal/10 hover:bg-yellow/5 transition-colors"
            >
              <h3 className="font-bold text-charcoal mb-2">{event.title}</h3>
              <p className="text-sm text-charcoal/60 line-clamp-2 mb-4">{event.description}</p>
              <div className="text-xs text-charcoal/40">
                <p>{new Date(event.startDate).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</p>
                <p>{event.venue.city} • {event.eventSessionCount} sessions</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <footer className="border-t border-charcoal/10 py-8">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-xs text-charcoal/40">HIBENTO © 2026</p>
        </div>
      </footer>
    </div>
  );
}