"use client";

import { usePathname } from "next/navigation";
import { Nav } from "@/components/Nav";

export function AppNav() {
  const pathname = usePathname();

  // Landing has its own nav in page.tsx
  if (pathname === "/") return null;

  return <Nav />;
}