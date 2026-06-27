export interface Speaker {
  name: string;
  role: string;
  initials: string;
  tone: string;
  image?: string;
  sessions?: number;
}

export const speakers: Speaker[] = [
  { name: "Mara Cordero", role: "Head of Design, Stagecraft", initials: "MC", tone: "bg-accent text-accent-foreground", image: "/images/speakers/speaker-1.png", sessions: 2 },
  { name: "Aarav Singh", role: "Economist & Author", initials: "AS", tone: "bg-card border border-border text-foreground", image: "/images/speakers/speaker-2.png", sessions: 1 },
  { name: "Iris Moreau", role: "Founder, Loop Studio", initials: "IM", tone: "bg-secondary text-secondary-foreground", image: "/images/speakers/speaker-3.webp", sessions: 3 },
  { name: "Kenji Park", role: "Product, Patient Inc.", initials: "KP", tone: "bg-card border border-border text-foreground", image: "/images/speakers/speaker-4.png", sessions: 1 },
  { name: "Lila Petit", role: "Type designer", initials: "LP", tone: "bg-accent text-accent-foreground", sessions: 2 },
];
