export interface FooterLink {
  label: string;
  href: string;
}

export interface FooterSection {
  title: string;
  links: FooterLink[];
}

export interface FooterConfig {
  brandDescription: string;
  sections: FooterSection[];
  copyright: string;
  tagline: string;
}

export const footerConfig: FooterConfig = {
  brandDescription: "The live screen for any event. Stream, ask, vote. No PDFs, no logins.",
  sections: [
    {
      title: "PRODUCT",
      links: [
        { label: "Browse Events", href: "/events" },
        { label: "Speakers", href: "/speakers" },
        { label: "Live Q&A", href: "#qa" },
        { label: "Planning", href: "#planning" },
      ],
    },
    {
      title: "COMPANY",
      links: [
        { label: "About", href: "#" },
        { label: "Privacy", href: "#" },
        { label: "Contact", href: "#" },
      ],
    },
  ],
  copyright: `© ${new Date().getFullYear()} HiBento. All stages reserved.`,
  tagline: "Made for everyone in the room.",
};
