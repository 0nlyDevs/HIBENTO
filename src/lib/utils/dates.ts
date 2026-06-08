const currentYear = new Date().getFullYear();

function showYear(date: Date): boolean {
  return date.getFullYear() !== currentYear;
}

export function formatDate(
  date: Date,
  style: "short" | "long" = "short"
): string {
  const base: Intl.DateTimeFormatOptions =
    style === "long"
      ? { weekday: "long", month: "long", day: "numeric" }
      : { month: "short", day: "numeric" };

  if (showYear(date)) {
    base.year = "numeric";
  }

  return date.toLocaleDateString("en-US", base);
}

export function formatDateRange(start: Date, end: Date): string {
  const s = formatDate(start, "short");
  const e = formatDate(end, "short");
  return `${s} – ${e}`;
}

/** "Jun 10" — compact month + day. */
export function formatShortDate(date: Date): string {
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

/** "02:30 PM" — 2-digit hour + minute. */
export function formatTime(date: Date): string {
  return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
}

/** "02:30 PM – 04:00 PM" — formatted time span. */
export function formatTimeRange(start: Date, end: Date): string {
  return `${formatTime(start)} – ${formatTime(end)}`;
}

/** YYYY-MM-DD key from a Date (local-date safe, no TZ shift). */
export function toDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/**
 * Retourne un message lisible pour le tooltip « la session commence à ».
 * - Aujourd'hui → "Session starts at 14:00"
 * - Demain      → "Session starts tomorrow at 14:00"
 * - Autre jour  → "Session starts on Jun 10 at 14:00"
 */
export function formatSessionStartsAt(startTime: Date): string {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startDay = new Date(startTime.getFullYear(), startTime.getMonth(), startTime.getDate());
  const diffDays = Math.round((startDay.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  const time = startTime.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const prefix =
    diffDays === 0
      ? ""
      : diffDays === 1
        ? "tomorrow "
        : `on ${startTime.toLocaleDateString("en-US", { month: "short", day: "numeric" })} `;

  return `Session starts ${prefix}at ${time}`;
}
