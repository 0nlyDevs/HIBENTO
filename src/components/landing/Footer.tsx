import { footerConfig, FooterConfig } from "@/data/footer";

interface FooterProps {
  config?: FooterConfig;
}

export const Footer = ({ config: propConfig }: FooterProps) => {
  const displayConfig = propConfig || footerConfig;
  return (
    <footer className="text-foreground/70 border-t border-border py-12">
      <div className="container mx-auto">
        <div className="grid md:grid-cols-4 gap-10">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-accent blink-dot" />
              <span className="font-display font-bold text-2xl text-foreground">HiBento</span>
            </div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed">
              {displayConfig.brandDescription}
            </p>
          </div>
          {displayConfig.sections.map((section) => (
            <div key={section.title}>
              <p className="label-mono text-foreground mb-4">{section.title}</p>
              <ul className="space-y-2 text-sm">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <a href={link.href} className="hover:text-accent">{link.label}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 pt-6 border-t border-border flex flex-wrap justify-between gap-4 label-mono text-foreground/45">
          <span>{displayConfig.copyright}</span>
          <span>{displayConfig.tagline}</span>
        </div>
      </div>
    </footer>
  );
};
