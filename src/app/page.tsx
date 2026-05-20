"use client";

import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen relative bg-cream">
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
      <footer className="border-t absolute w-full bottom-0 border-charcoal/10 py-8">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-xs text-charcoal/40">HIBENTO © 2026</p>
        </div>
      </footer>
    </div>
  );
}