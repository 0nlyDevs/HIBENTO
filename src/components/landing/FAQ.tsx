"use client";

import { useState } from "react";
import { FAQItem, faqItems } from "@/data/faq";

export const FAQ = ({ items: propItems }: { items?: FAQItem[] }) => {
  const displayItems = propItems || faqItems;
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="relative py-16 md:py-24 overflow-hidden">
      <div className="container mx-auto px-6 md:px-16 lg:px-20 grid lg:grid-cols-12 gap-12">
        <div className="lg:col-span-4">
          <p className="label-mono text-accent mb-6">§ 05 FAQ</p>
          <h2 className="text-display text-[clamp(2.5rem,5vw,4.5rem)] text-foreground">
            Quick
            <br />
            <span className="text-accent">answers.</span>
          </h2>
        </div>
        <div className="lg:col-span-8">
          <ul className="space-y-3">
            {displayItems.map((it, i) => {
              const isOpen = open === i;
              return (
                <li
                  key={it.q}
                  className={`card-glass border ${
                    isOpen ? "border-accent" : "border-dashed border-white/18 hover:border-accent/50"
                  }`}
                >
                  <button
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="w-full flex items-start justify-between gap-6 px-6 py-5 text-left group"
                  >
                    <span className="font-display font-bold text-lg md:text-xl text-foreground">
                      {it.q}
                    </span>
                    <span
                      className={`label-mono text-foreground/60 mt-1.5 transition-transform ${isOpen ? "rotate-45 text-accent" : ""}`}
                    >
                      ✕
                    </span>
                  </button>
                  <div
                    className="grid transition-all duration-500 ease-out"
                    style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
                  >
                    <div className="overflow-hidden">
                      <p className="px-6 pb-6 text-foreground/75 max-w-2xl leading-relaxed">{it.a}</p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
};
