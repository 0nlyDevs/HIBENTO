export interface NavLink {
  label: string;
  href: string;
}

export const navLinks: NavLink[] = [
  { label: "Events", href: "/events" },
  { label: "Live Q&A", href: "#qa" },
  { label: "Planning", href: "#planning" },
  { label: "Speakers", href: "/speakers" },
  { label: "FAQ", href: "#faq" },
];
