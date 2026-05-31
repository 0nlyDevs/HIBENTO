"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="flex-1 flex flex-col">
      <section className="flex-1 flex flex-col items-center justify-center px-6 text-center">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-charcoal max-w-3xl leading-[1.1]">
          WHERE EVENTS COME ALIVE
        </h1>
        <p className="mt-6 text-lg md:text-xl text-charcoal/60 max-w-xl leading-relaxed">
          Real-time event management and participant engagement platform for
          Madagascar&apos;s tech communities.
        </p>
        <Link
          href="/events"
          className="mt-10 inline-flex items-center gap-2 bg-charcoal text-cream px-8 py-4 rounded-full font-semibold text-sm tracking-widest hover:bg-charcoal/90 transition-colors"
        >
          EXPLORE EVENTS
          <ArrowRight className="w-4 h-4" />
        </Link>
      </section>
      <footer className="py-6 text-center text-xs tracking-wider text-charcoal/40">
        HIBENTO &copy; 2026
      </footer>
    </div>
  );
}
