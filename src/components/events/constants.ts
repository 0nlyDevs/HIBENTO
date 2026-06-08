/** Hero background images cycled per-event (deterministic by id). */
export const EVENT_IMAGES = [
  "/hibento-vibes-01.webp",
  "/hibento-vibes-02.webp",
  "/hibento-vibes-03.jpg",
  "/liveqa.jpg",
];

/** Avatar fallback background colors for speaker bubbles. */
export const AVATAR_COLORS = [
  "hsl(61 69% 80%)",
  "hsl(220 35% 62%)",
  "hsl(280 35% 68%)",
  "hsl(160 35% 62%)",
  "hsl(30 65% 68%)",
  "hsl(340 45% 68%)",
];

/** Deterministically pick a hero image for an event id. */
export function pickEventImage(eventId: string): string {
  return EVENT_IMAGES[eventId.charCodeAt(0) % EVENT_IMAGES.length];
}
