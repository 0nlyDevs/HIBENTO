import { heroContent } from "@/data/hero";
import { marqueeItems } from "@/data/marquee-items";

interface MarqueeProps {
  items?: string[];
}

export const Marquee = ({ items = marqueeItems }: MarqueeProps) => {
  const row = [...items, ...items];
  return (
    <section className="mt-20 md:mt-32">
      <div className="px-6 md:px-16 lg:px-20 pt-6 pb-4 border-t border-border flex rotate-2 flex-wrap items-center justify-between label-mono text-foreground/55 gap-4">
        <span>{heroContent.bottomStrip.categories}</span>
        <span className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-accent" />
          {heroContent.bottomStrip.liveSessions}
        </span>
      </div>
      <div className="text-foreground rotate-2 mt-6 py-5 overflow-hidden border-y border-border">
        <div className="flex marquee whitespace-nowrap font-display text-2xl md:text-4xl font-bold">
          {row.map((t, i) => (
            <span key={i} className="mx-6 opacity-90">
              {t === "✦" ? <span className="text-accent">✦</span> : t}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};
