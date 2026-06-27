"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { Nav as LandingNav } from "@/components/landing/Nav";
import { Nav as SimpleNav } from "@/components/layouts/Nav";

export function NavSelector() {
  const pathname = usePathname();
  const isLanding = pathname === "/";

  return isLanding ? <LandingNav /> : <SimpleNav />;
}

export function MainWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLanding = pathname === "/";

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <main className={`flex-1 min-h-screen ${isLanding ? "snap-y snap-proximity scroll-pt-24" : ""}`}>
      {children}
    </main>
  );
}
