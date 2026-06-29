export function sortScheduleSessions<T extends { isLive: boolean; startTime: Date | string; endTime: Date | string }>(
  sessions: T[],
): T[] {
  const now = new Date();
  const toMs = (t: Date | string) => new Date(t).getTime();

  const live: T[] = [];
  const upcoming: T[] = [];
  const ended: T[] = [];

  for (const s of sessions) {
    if (s.isLive) {
      live.push(s);
    } else if (new Date(s.startTime) > now) {
      upcoming.push(s);
    } else {
      ended.push(s);
    }
  }

  upcoming.sort((a, b) => toMs(b.startTime) - toMs(a.startTime));
  ended.sort((a, b) => toMs(b.endTime) - toMs(a.endTime));

  return [...live, ...upcoming, ...ended];
}
