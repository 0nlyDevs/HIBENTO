"use client";

import { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "motion/react";
import { NotificationBell } from "./NotificationBell";
import { RecommendationPanel } from "./RecommendationPanel";

export function Nav() {
  const pathname = usePathname();
  const [activeRect, setActiveRect] = useState({ left: 0, width: 0 });
  const navRef = useRef<HTMLDivElement>(null);
  const eventsRef = useRef<HTMLAnchorElement>(null);
  const speakersRef = useRef<HTMLAnchorElement>(null);
  const favoritesRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const updateActiveIndicator = () => {
      const isEventsActive =
        pathname.startsWith("/events") || pathname.startsWith("/sessions");
      const isSpeakersActive = pathname.startsWith("/speakers");
      const isFavoritesActive = pathname.startsWith("/favorites");

      let activeElement: HTMLAnchorElement | null = null;

      if (isEventsActive) {
        activeElement = eventsRef.current;
      } else if (isSpeakersActive) {
        activeElement = speakersRef.current;
      } else if (isFavoritesActive) {
        activeElement = favoritesRef.current;
      }

      if (activeElement && navRef.current) {
        const navRect = navRef.current.getBoundingClientRect();
        const elementRect = activeElement.getBoundingClientRect();
        setActiveRect({
          left: elementRect.left - navRect.left + elementRect.width / 2 - 12,
          width: 24,
        });
      } else {
        setActiveRect({ left: 0, width: 0 });
      }
    };

    updateActiveIndicator();
    window.addEventListener("resize", updateActiveIndicator);
    return () => window.removeEventListener("resize", updateActiveIndicator);
  }, [pathname]);

  if (
    pathname.startsWith("/sessions/") &&
    !pathname.startsWith("/sessions/detail/")
  ) {
    return null;
  }

  const isEventsActive =
    pathname.startsWith("/events") || pathname.startsWith("/sessions");
  const isSpeakersActive = pathname.startsWith("/speakers");
  const isFavoritesActive = pathname.startsWith("/favorites");

  return (
    <>
      <nav className="sticky top-0 z-40 backdrop-blur border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center h-7">
            <Image
              src="/images/brand/header-white-text.svg"
              alt="HiBento"
              width={140}
              height={28}
              className="h-7 w-auto"
              priority
            />
          </Link>

          <div ref={navRef} className="relative flex items-center gap-8 pb-1">
            <Link
              ref={eventsRef}
              href="/events"
              className={`relative text-sm tracking-wider transition-colors duration-300 py-1 ${
                isEventsActive
                  ? "font-bold text-chartreuse"
                  : "font-medium text-white/70 hover:text-white"
              }`}
            >
              EVENTS
            </Link>
            <Link
              ref={speakersRef}
              href="/speakers"
              className={`relative text-sm tracking-wider transition-colors duration-300 py-1 ${
                isSpeakersActive
                  ? "font-bold text-chartreuse"
                  : "font-medium text-white/70 hover:text-white"
              }`}
            >
              SPEAKERS
            </Link>
            <Link
              ref={favoritesRef}
              href="/favorites"
              className={`relative text-sm tracking-wider transition-colors duration-300 py-1 ${
                isFavoritesActive
                  ? "font-bold text-chartreuse"
                  : "font-medium text-white/70 hover:text-white"
              }`}
            >
              FAVORITES
            </Link>

            <NotificationBell />

            <motion.div
              className="absolute bottom-0 h-0.75 bg-chartreuse rounded-full"
              animate={{
                left: activeRect.left,
                width: activeRect.width,
              }}
              transition={{
                type: "spring",
                stiffness: 250,
                damping: 30,
                mass: 0.5,
              }}
            />
          </div>
        </div>
      </div>
    </nav>

      <RecommendationPanel />
    </>
  );
}
