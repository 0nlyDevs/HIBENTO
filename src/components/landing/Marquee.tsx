import { marqueeItems } from "@/data/marquee-items";

interface MarqueeProps {
  items?: string[];
}

export const Marquee = ({ items = marqueeItems }: MarqueeProps) => {
  const row = [...items, ...items];
  return (
    <section className="text-foreground py-5 overflow-hidden border-y border-border">
      <div className="flex marquee whitespace-nowrap font-display text-2xl md:text-4xl font-bold">
        {row.map((t, i) => (
          <span key={i} className="mx-6 opacity-90">
            {t === "✦" ? <span className="text-accent">✦</span> : t}
          </span>
        ))}
      </div>
    </section>
  );
};
