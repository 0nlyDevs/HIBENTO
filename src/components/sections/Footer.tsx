import { AtSign, Globe, MapPin, Phone } from "lucide-react";
import Image from "next/image";

const Footer = () => (
  <footer className="relative overflow-hidden">
    <div className="absolute inset-0 bg-black/40" />
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-150 h-px bg-linear-to-r from-transparent via-white/10 to-transparent" />

    <div className="relative z-10 w-full max-w-420 mx-auto px-4 sm:px-16 lg:px-28 py-14 md:py-16">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr] gap-10 md:gap-14">
        <div className="flex flex-col gap-4">
          <Image
            alt="Hibento Logo"
            src="/images/brand/header-white-text.svg"
            width={110}
            height={22}
            className="opacity-80"
          />
          <p className="text-white/60 text-sm leading-relaxed max-w-xs">
            Discover events, browse schedules, register in one tap, attend sessions online, and ask questions live — all in one place.
          </p>
          <p className="text-white/40 text-xs mt-2">
            &copy; {new Date().getFullYear()} HiBento. All rights reserved.
          </p>
        </div>

        <div>
          <h4 className="text-white/70 text-sm tracking-[0.2em] uppercase mb-5">
            Contact
          </h4>
          <div className="flex flex-col gap-3">
            <a href="tel:+261340000000" className="flex items-center gap-2.5 text-white/60 text-sm hover:text-primary transition-colors no-underline">
              <Phone size={15} className="shrink-0" />
              +261 34 00 000 00
            </a>
            <a href="mailto:hello@hibento.com" className="flex items-center gap-2.5 text-white/60 text-sm hover:text-primary transition-colors no-underline">
              <AtSign size={15} className="shrink-0" />
              hello@hibento.com
            </a>
            <span className="flex items-center gap-2.5 text-white/50 text-sm">
              <MapPin size={15} className="shrink-0" />
              Antananarivo, Madagascar
            </span>
          </div>
        </div>

        <div>
          <h4 className="text-white/70 text-sm tracking-[0.2em] uppercase mb-5">
            Follow
          </h4>
          <div className="flex flex-col gap-3">
            {["Instagram", "Twitter / X", "LinkedIn"].map((label) => (
              <a
                key={label}
                href="#"
                className="flex items-center gap-2.5 text-white/60 text-sm hover:text-primary transition-colors no-underline"
              >
                <Globe size={15} className="shrink-0" />
                {label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
