export const AVATAR_COLORS = [
  "hsl(61 69% 80%)",
  "hsl(220 35% 62%)",
  "hsl(280 35% 68%)",
  "hsl(160 35% 62%)",
  "hsl(30 65% 68%)",
  "hsl(340 45% 68%)",
] as const;

export const EVENT_IMAGES = [
  "/images/hibento-vibes-01.jpg",
  "/images/hibento-vibes-02.webp",
  "/images/hibento-vibes-03.jpg",
  "/images/liveqa.jpg",
] as const;

export function pickEventImage(eventId: string): string {
  return EVENT_IMAGES[eventId.charCodeAt(0) % EVENT_IMAGES.length];
}
