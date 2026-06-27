"use client";

import { Plus, X } from "lucide-react";
import { useState } from "react";

const FAQ_ITEMS = [
  { q: "What is HiBento?", a: "HiBento is your all-in-one event companion — discover events, browse schedules, register in one tap, attend sessions online, and ask questions live." },
  { q: "Is HiBento free?", a: "Yes. Browsing events is completely free. Some premium features may be introduced in future updates." },
  { q: "Which regions are supported?", a: "HiBento currently covers events across Madagascar, with more regions coming soon." },
  { q: "How do I find events near me?", a: "Use the Explore tab to browse events by location, date, or category. You can also search by keyword." },
  { q: "Do I need an account to attend online sessions?", a: "No. You can join online sessions without an account. For on-site events, we only need your email to complete registration." },
  { q: "How does one-tap registration work?", a: "If you create an account, your details are stored securely. When you register for an on-site event, it fills everything in automatically." },
  { q: "Can I save sessions for later?", a: "Yes. Tap the bookmark icon on any session to add it to your favourites and access it anytime." },
  { q: "How do I attend an online session?", a: "Click the desire session and tap the enter button. Live Q&A and chat are then available." },
];

const FaqSection = () => {
  const [openId, setOpenId] = useState<number | null>(null);

  const toggle = (i: number) => {
    setOpenId(openId === i ? null : i);
  };

  return (
    <section id="infofaq" className="relative">
      <div className="relative bottom-30 sm:bottom-0 z-10 w-full max-w-420 mx-auto px-4 sm:px-16 lg:px-28 pb-0 sm:pb-16 md:pb-24 lg:pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-10 lg:gap-16 items-start">
          <div>
            <h2 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-white font-bold">
              Info &amp; FAQ
            </h2>
            <div className="w-16 h-px bg-primary mt-6 mb-6" />
            <p className="text-white/75 text-base sm:text-lg md:text-xl leading-relaxed max-w-lg">
              Everything you need to know about HiBento.
            </p>
          </div>

          <div className="space-y-2">
            {FAQ_ITEMS.map((item, i) => {
              const isOpen = openId === i;
              return (
                <div
                  key={item.q}
                  className="group rounded-xl border border-white/60 bg-white/2 transition-colors hover:border-white/90"
                >
                  <button
                    onClick={() => toggle(i)}
                    className="w-full flex items-center justify-between gap-3 px-4 py-3.5 md:px-5 md:py-4 text-left cursor-pointer"
                  >
                    <span className="text-white/80 font-medium leading-snug pr-2">
                      {item.q}
                    </span>
                    <span
                      className={`shrink-0 w-6 h-6 flex items-center justify-center rounded-full border transition-all duration-300 ${
                        isOpen
                          ? "bg-primary border-primary"
                          : "border-white/60 group-hover:border-white/90"
                      }`}
                    >
                      {isOpen ? (
                        <X size={12} className="text-dark-gray" />
                      ) : (
                        <Plus size={12} className="text-white/90" />
                      )}
                    </span>
                  </button>
                  <div
                    className={`grid transition-all duration-300 ease-in-out ${
                      isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="px-4 pb-4 md:px-5 md:pb-5 text-white/45 text-sm leading-relaxed">
                        {item.a}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FaqSection;
