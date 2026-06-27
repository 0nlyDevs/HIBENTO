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

export function formatTime(date: Date): string {
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatShortDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export function toDateKey(date: Date): string {
  return date.toISOString().split("T")[0];
}

export function formatTimeRange(start: Date, end: Date): string {
  return `${formatTime(start)} – ${formatTime(end)}`;
}

export function formatSessionStartsAt(date: Date): string {
  return `Starts at ${formatTime(date)}`;
}
