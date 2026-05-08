export interface ManifestoCard {
  tag: string;
  icon: string;
  title: string;
  body: string;
  image: string;
  /** Tailwind bg class for the card background */
  bg: string;
}

export const manifestoCards: ManifestoCard[] = [
  {
    tag: "BEFORE",
    icon: "",
    title: "PDFs that go stale.",
    body: "Printed schedules, last-minute changes scribbled in the margins, attendees lost between rooms.",
    image: "/hibento-vibes-01.webp",
    bg: "bg-chartreuse",
  },
  {
    tag: "DURING",
    icon: "",
    title: "One live screen.",
    body: "Every track, room, and speaker in real time. The room reorganises itself as the day unfolds.",
    image: "/hibento-vibes-02.webp",
    bg: "bg-chartreuse-soft",
  },
  {
    tag: "AFTER",
    icon: "",
    title: "Memory of the room.",
    body: "Every question asked, every session attended and captured for organisers, ready for next time.",
    image: "/hibento-vibes-03.jpg",
    bg: "bg-chartreuse-pale",
  },
];
