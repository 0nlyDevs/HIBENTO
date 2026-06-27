export interface Track {
  room: string;
  color: string;
}

export interface Session {
  room: number;
  start: number;
  end: number;
  title: string;
  speaker: string;
  live: boolean;
}

export const tracks: Track[] = [
  { room: "Stage A", color: "bg-accent" },
  { room: "Stage B", color: "bg-secondary" },
  { room: "Workshop", color: "bg-foreground/60" },
];

export const sessions: Session[] = [
  { room: 0, start: 9, end: 10, title: "Opening keynote", speaker: "Iris Moreau", live: false },
  { room: 1, start: 9, end: 10.5, title: "Building patient products", speaker: "Kenji Park", live: false },
  { room: 2, start: 9.5, end: 11, title: "Workshop: Type as interface", speaker: "L. Petit", live: false },
  { room: 0, start: 10.5, end: 11.5, title: "Designing for live attention", speaker: "M. Cordero", live: true },
  { room: 1, start: 11, end: 12, title: "The economics of conferences", speaker: "A. Singh", live: false },
  { room: 0, start: 12, end: 13, title: "Lunch panel: Future of stages", speaker: "Group", live: false },
  { room: 2, start: 11.5, end: 13, title: "Workshop: Scenography 101", speaker: "C. Vargas", live: false },
];

export const hours: number[] = [9, 10, 11, 12, 13];
