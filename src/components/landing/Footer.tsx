import Image from "next/image";
import { footerConfig, FooterConfig } from "@/data/footer";

interface FooterProps {
  config?: FooterConfig;
}

export const Footer = ({ config: propConfig }: FooterProps) => {
  const displayConfig = propConfig || footerConfig;
  return (
    <footer className="text-foreground/70 border-t border-border py-12">
      <div className="container mx-auto px-6 md:px-16 lg:px-20">
        <div className="grid md:grid-cols-4 gap-10">
          <div className="md:col-span-2">
            <Image src="/images/brand/header-text-white1497x414@3x.png" alt="HiBento" width={140} height={39} className="h-9 w-auto" />
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
