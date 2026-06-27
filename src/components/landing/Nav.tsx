"use client";

import { Mic, Tickets, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useCallback } from "react";
import { navLinks } from "@/data/nav-links";
import SwipeLettersButton from "@/components/ui/SwipeLetterButton";
import { MenuOverlay } from "@/components/layouts/MenuOverlay";
import { NAV_STYLES } from "@/constants/styles";

const GLASS_STYLE: React.CSSProperties = {
  background: "#222222E6",
  border: "1px dashed rgba(255,255,255,0.18)",
  borderRadius: "0.75rem",
};

const ACCENT = "hsl(59 73% 52%)";

const ALL_MENU_ITEMS = [
  { id: "home", label: "Home", route: "/" },
  { id: "speakers", label: "Speakers", route: "/speakers" },
  { id: "events", label: "Events", route: "/events" },
  { id: "favorites", label: "Favorites", route: "/favorites" },
  ...navLinks.map((l) => ({ id: l.href.replace("/", ""), label: l.label, route: l.href })),
] as const;

export const Nav = () => {
  const pathname = usePathname();
  const router = useRouter();
  const isHome = pathname === "/";
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const openMenu = useCallback(() => {
    setIsMenuOpen(true);
    setIsClosing(false);
  }, []);

  const closeMenu = useCallback(() => {
    setIsClosing(true);
    setTimeout(() => {
      setIsMenuOpen(false);
      setIsClosing(false);
    }, 800);
  }, []);

  const toggleMenu = useCallback(() => {
    if (isMenuOpen) closeMenu();
    else openMenu();
  }, [isMenuOpen, closeMenu, openMenu]);

  const handleNavClick = useCallback(
    (item: { id: string; label: string; route?: string }) => {
      setIsMenuOpen(false);
      setIsClosing(false);
      if (isHome && item.route === "/" && item.id !== "home") {
        const el = document.getElementById(item.id);
        if (el) {
          window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 96, behavior: "smooth" });
        }
        return;
      }
      if (item.route) router.push(item.route);
    },
    [isHome, router],
  );

  const handleEventsClick = useCallback(() => {
    setIsMenuOpen(false);
    setIsClosing(false);
    router.push("/events");
  }, [router]);

  const handleSpeakersClick = useCallback(() => {
    setIsMenuOpen(false);
    setIsClosing(false);
    router.push("/speakers");
  }, [router]);

  return (
    <>
      <style>{NAV_STYLES}</style>
      <div
        className="fixed top-8 left-8 md:left-10 z-[71] pointer-events-auto"
        style={GLASS_STYLE}
      >
        <div className="flex items-center justify-center w-11 h-12">
          <button
            aria-label="Open menu"
            onClick={toggleMenu}
            className="flex flex-col gap-1.25 items-center justify-center w-full h-full opacity-60 hover:opacity-100 transition-opacity duration-200 cursor-pointer"
          >
            {isMenuOpen ? (
              <X size={18} className="text-white" />
            ) : (
              <>
                <span className="block w-3.75 h-[1.5px] bg-foreground" />
                <span className="block w-3.75 h-[1.5px] bg-foreground" />
                <span className="block w-3.75 h-[1.5px] bg-foreground" />
              </>
            )}
          </button>
        </div>
      </div>

      <header className="fixed top-0 inset-x-0 z-50 flex items-center justify-start gap-1 px-8 md:px-10 py-8 pointer-events-none">
        <div className="w-11 h-12 shrink-0" />

        <div className="hidden lg:flex items-center h-12 px-6 gap-6 pointer-events-auto" style={GLASS_STYLE}>
          <Link href="/" className="flex items-center pl-1 pr-5 border-r border-dashed border-white/15 shrink-0">
            <Image src="/images/brand/header-text-white1497x414@3x.png" alt="HiBento" width={140} height={39} className="h-9 w-auto" priority />
          </Link>
          <nav className="flex items-center gap-4">
            {navLinks.map((l) => (
              <SwipeLettersButton
                key={l.href}
                as="a"
                href={l.href}
                label={l.label}
                fontSize="0.8125rem"
                fontWeight={400}
                direction="alternate"
                textColor="#ffffff"
                hoverTextColor={ACCENT}
                className="px-4 h-8 rounded-md hover:bg-white/5 transition-colors duration-200"
              />
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-1 pointer-events-auto">
          {[
            { icon: <Mic size={18} />, label: "Speakers", onClick: handleSpeakersClick },
            { icon: <Tickets size={18} />, label: "Events", onClick: handleEventsClick },
          ].map(({ icon, label, onClick }) => (
            <div key={label} className="flex items-center justify-center h-12 shrink-0" style={GLASS_STYLE}>
              <SwipeLettersButton
                as="button"
                onClick={onClick}
                label={label}
                fontSize="0.8125rem"
                fontWeight={400}
                direction="alternate"
                textColor="#ffffff"
                hoverTextColor={ACCENT}
                className="px-4 h-full rounded-md hover:bg-white/5 transition-colors duration-200"
                icon={icon}
                iconPosition="left"
              />
            </div>
          ))}
        </div>
      </header>

      {isMenuOpen && (
        <MenuOverlay
          items={[...ALL_MENU_ITEMS]}
          isClosing={isClosing}
          onItemClick={(item) => handleNavClick(item)}
          onClose={closeMenu}
        />
      )}
    </>
  );
};
