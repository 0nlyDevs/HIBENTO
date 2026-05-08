export interface Speaker {
  name: string;
  role: string;
  initials: string;
  tone: string;
}

export const speakers: Speaker[] = [
  { name: "Mara Cordero", role: "Head of Design, Stagecraft", initials: "MC", tone: "bg-accent text-accent-foreground" },
  { name: "Aarav Singh", role: "Economist & Author", initials: "AS", tone: "bg-card border border-border text-foreground" },
  { name: "Iris Moreau", role: "Founder, Loop Studio", initials: "IM", tone: "bg-secondary text-secondary-foreground" },
  { name: "Kenji Park", role: "Product, Patient Inc.", initials: "KP", tone: "bg-card border border-border text-foreground" },
  { name: "Lila Petit", role: "Type designer", initials: "LP", tone: "bg-accent text-accent-foreground" },
  { name: "Camila Vargas", role: "Scenographer", initials: "CV", tone: "bg-secondary text-secondary-foreground" },
];
