"use client";

import { MenuIcon, Mic, Tickets, X } from "lucide-react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState, useCallback } from "react";
import { MenuOverlay } from "@/components/layouts/MenuOverlay";
import { NAV_STYLES } from "@/constants/styles";

const SECTIONS = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "whatsnew", label: "What's new" },
  { id: "infofaq", label: "Info & FAQ" },
] as const;

const ALL_MENU_ITEMS = [
  { id: "home", label: "Home", route: "/" },
  { id: "about", label: "About", route: "/" },
  { id: "speakers", label: "Speakers", route: "/speakers" },
  { id: "events", label: "Events", route: "/events" },
  { id: "favorites", label: "Favorites", route: "/favorites" },
  { id: "whatsnew", label: "What's New", route: "/" },
  { id: "infofaq", label: "Info & FAQ", route: "/" },
] as const;

export default function NavBar() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const isEventsOrSpeakers = pathname.startsWith("/events") || pathname.startsWith("/speakers");
  const router = useRouter();
  const [activeSection, setActiveSection] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const menuItems = isHome
    ? ALL_MENU_ITEMS
    : ALL_MENU_ITEMS.filter(
        (item) => item.id === "home" || item.id === "events" || item.id === "speakers",
      );

  useEffect(() => {
    if (!isHome) return;
    const update = () => {
      let best = "";
      let bestDist = Infinity;
      for (const { id } of SECTIONS) {
        const el = document.getElementById(id);
        if (!el) continue;
        const dist = Math.abs(el.getBoundingClientRect().top - 96);
        if (dist < bestDist) {
          bestDist = dist;
          best = id;
        }
      }
      if (best) setActiveSection(best);
    };

    const main = document.querySelector("main");
    main?.addEventListener("scroll", update, { passive: true });
    window.addEventListener("scroll", update, { passive: true });
    update();

    return () => {
      main?.removeEventListener("scroll", update);
      window.removeEventListener("scroll", update);
    };
  }, [isHome]);

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

  const scrollTo = useCallback(
    (id: string) => {
      if (!isHome) return;
      const el = document.getElementById(id);
      if (!el) return;
      window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 96, behavior: "smooth" });
      closeMenu();
    },
    [isHome, closeMenu],
  );

  const handleNavClick = useCallback(
    (item: { id: string; label: string; route?: string }) => {
      if (isHome && item.route === "/" && item.id !== "home") {
        scrollTo(item.id);
        return;
      }
      setIsMenuOpen(false);
      setIsClosing(false);
      if (item.route) router.push(item.route);
    },
    [isHome, router, scrollTo],
  );

  const handleTicketsClick = useCallback(() => {
    setIsMenuOpen(false);
    setIsClosing(false);
    router.push("/events");
  }, [router]);

  const handleSpeakersClick = useCallback(() => {
    setIsMenuOpen(false);
    setIsClosing(false);
    router.push("/speakers");
  }, [router]);

  const scrollToSection = useCallback(
    (id: string) => () => scrollTo(id),
    [scrollTo],
  );

  return (
    <>
      <style>{NAV_STYLES}</style>

      <div className="fixed top-0 z-80 py-7 px-10">
        <button
          onClick={toggleMenu}
          className={`bg-dark-gray ${isMenuOpen ? "" : "hover:bg-primary"} h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14 flex items-center justify-center rounded-xl ${isMenuOpen ? "" : "dash-border group"} cursor-pointer transition-colors`}
        >
          {isMenuOpen ? (
            <X size={20} className="sm:w-6 sm:h-6 md:w-6 md:h-6 text-white transition-colors" />
          ) : (
            <MenuIcon size={20} className="sm:w-6 sm:h-6 md:w-6 md:h-6 text-white group-hover:text-dark-gray transition-colors" />
          )}
        </button>
      </div>

      <div className="flex fixed top-0 z-60 items-center gap-2 sm:gap-3 md:gap-4 py-7 px-10 w-full">
        <div className="h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14 shrink-0" />
        <div className="flex items-center gap-2 sm:gap-3 md:gap-4 bg-dark-gray h-10 sm:h-12 md:h-14 px-4 sm:px-5 md:px-8 rounded-xl dash-border">
          <Link href="/" className="cursor-pointer">
            <Image alt="Hibento Logo" src="/images/brand/header-white-text.svg" width={120} height={24}
              className="sm:w-35 md:w-40 sm:h-7 md:h-8" />
          </Link>
          {isHome && (
            <>
              {SECTIONS.slice(1).map((section) => (
                <button key={section.id}
                  onClick={scrollToSection(section.id)}
                  className={`hidden cursor-pointer md:block text-sm md:text-base transition-colors ${
                    activeSection === section.id ? "text-primary" : "text-white/70 hover:text-primary"
                  }`}>
                  {section.label}
                </button>
              ))}
            </>
          )}
        </div>

        <div onClick={handleSpeakersClick}
          className={`${isEventsOrSpeakers ? "" : "hidden sm:flex"} bg-dark-gray hover:bg-primary h-10 sm:h-12 md:h-14 items-center gap-1.5 px-3 sm:px-4 md:px-6 rounded-xl dash-border group cursor-pointer transition-colors`}>
          <Mic size={18} className="text-white/70 group-hover:text-dark-gray shrink-0" />
          <p className="text-sm md:text-base text-white/70 group-hover:text-dark-gray">Speakers</p>
        </div>

        <div onClick={handleTicketsClick}
          className="bg-primary hover:bg-white h-10 sm:h-12 md:h-14 flex items-center gap-1.5 px-3 sm:px-4 md:px-6 rounded-xl group cursor-pointer transition-colors">
          <Tickets size={18} className="text-dark-gray group-hover:text-black shrink-0" />
          <p className="text-dark-gray text-sm md:text-base group-hover:text-black">Events</p>
        </div>
      </div>

      {isMenuOpen && (
        <MenuOverlay
          items={menuItems}
          isClosing={isClosing}
          onItemClick={(item) => handleNavClick(item)}
          onClose={closeMenu}
        />
      )}
    </>
  );
}
