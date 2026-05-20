"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export function Nav() {
  const pathname = usePathname();

  if (pathname.includes("/live")) return null;

  const isEventsActive =
    pathname.startsWith("/events") || pathname.startsWith("/sessions");
  const isSpeakersActive = pathname.startsWith("/speakers");

  return (
    <nav className="sticky top-0 z-40 bg-cream/95 backdrop-blur border-b border-charcoal/10">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/logo.svg" alt="HiBento" width={28} height={28} />
          <span className="font-bold text-xl tracking-tighter text-charcoal">
            HIBENTO
          </span>
        </Link>
        <div className="flex items-center gap-6">
          <Link
            href="/events"
            className={`text-sm tracking-wider ${
              isEventsActive
                ? "font-bold text-charcoal border-b-2 border-charcoal"
                : "font-medium text-charcoal/70 hover:text-charcoal"
            }`}
          >
            EVENTS
          </Link>
          <Link
            href="/speakers"
            className={`text-sm tracking-wider ${
              isSpeakersActive
                ? "font-bold text-charcoal border-b-2 border-charcoal"
                : "font-medium text-charcoal/70 hover:text-charcoal"
            }`}
          >
            SPEAKERS
          </Link>
        </div>
      </div>
    </nav>
  );
}
