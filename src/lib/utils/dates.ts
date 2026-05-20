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
