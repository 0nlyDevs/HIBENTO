"use client";

import { usePathname } from "next/navigation";
import { Nav } from "@/components/landing/Nav";
import type { NavLink } from "@/data/nav-links";

const appLinks: NavLink[] = [
  { label: "Events", href: "/events" },
  { label: "Speakers", href: "/speakers" },
];

export function AppNav() {
  const pathname = usePathname();

  // Landing has its own <Nav /> in page.tsx
  // Live page has its own inline nav
  if (pathname === "/" || pathname.includes("/live")) return null;

  return <Nav links={appLinks} ctaHref="/events" ctaLabel="Browse Events" />;
}