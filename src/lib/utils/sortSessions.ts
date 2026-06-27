export function sortScheduleSessions<T extends { isLive: boolean; startTime: Date | string }>(
  sessions: T[],
  nonLiveOrder: "asc" | "desc" = "asc",
): T[] {
  const toMs = (t: Date | string) => new Date(t).getTime();

  return [...sessions].sort((a, b) => {
    if (a.isLive !== b.isLive) return a.isLive ? -1 : 1;
    const diff = toMs(a.startTime) - toMs(b.startTime);
    return nonLiveOrder === "asc" ? diff : -diff;
  });
}
