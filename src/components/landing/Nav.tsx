"use client";

import Image from "next/image";
import { navLinks, NavLink } from "@/data/nav-links";
import SwipeLettersButton from "@/components/ui/SwipeLetterButton";

const glassStyle: React.CSSProperties = {
  background: "#222222E6",
  border: "1px dashed rgba(255,255,255,0.18)",
  borderRadius: "0.75rem",
};

const ACCENT = "hsl(59 73% 52%)";
const ACCENT_FG = "hsl(260 9% 18%)";

export const Nav = ({ links }: { links?: NavLink[] }) => {
  const displayLinks = links || navLinks;

  return (
    <header className="fixed top-0 inset-x-0 z-50 flex items-center justify-start gap-1 px-10 py-8 pointer-events-none">
      <div
        className="flex items-center justify-center w-11 h-12 shrink-0 pointer-events-auto"
        style={glassStyle}
      >
        <button
          aria-label="Open menu"
          className="flex flex-col gap-[5px] items-center justify-center w-full h-full opacity-60 hover:opacity-100 transition-opacity duration-200"
        >
          <span className="block w-[15px] h-[1.5px] bg-foreground" />
          <span className="block w-[15px] h-[1.5px] bg-foreground" />
          <span className="block w-[15px] h-[1.5px] bg-foreground" />
        </button>
      </div>

      <div
        className="hidden md:flex items-center h-12 px-6 gap-6 pointer-events-auto"
        style={glassStyle}
      >
        <a href="#" className="flex items-center pl-1 pr-5 border-r border-dashed border-white/15 shrink-0">
          <Image
            src="/header-white-text.svg"
            alt="HiBento"
            width={140}
            height={28}
            className="h-7 w-auto"
            priority
          />
        </a>
        <nav className="flex items-center gap-4">
          {displayLinks.map((l) => (
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

      <div
        className="flex items-center h-12 pointer-events-auto"
        style={glassStyle}
      >
        <SwipeLettersButton
          as="a"
          href="#product"
          label="Program"
          fontSize="0.8125rem"
          fontWeight={400}
          direction="alternate"
          textColor="#ffffff"
          hoverTextColor={ACCENT_FG}
          className="h-full px-4 hover:bg-accent rounded-md transition-colors duration-200 group"
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24" height="24"
              viewBox="0 0 24 25"
              fill="none"
              aria-hidden
              className="text-white group-hover:text-accent-foreground"
            >
              <rect x="7.5"  y="8"  width="2" height="2" fill="currentColor" />
              <rect x="7.5"  y="16" width="2" height="2" fill="currentColor" />
              <rect x="11.5" y="8"  width="2" height="2" fill="currentColor" />
              <rect x="11.5" y="12" width="2" height="2" fill="currentColor" />
              <rect x="11.5" y="16" width="2" height="2" fill="currentColor" />
              <rect x="15.5" y="8"  width="2" height="2" fill="currentColor" />
              <rect x="15.5" y="12" width="2" height="2" fill="currentColor" />
            </svg>
          }
        />
      </div>
    </header>
  );
};
