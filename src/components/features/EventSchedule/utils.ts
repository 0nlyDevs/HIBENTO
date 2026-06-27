import type { EventDetailDto, EventSessionSummaryDto } from "@/types/dto";
import type { StatusFilter } from "./types";
import { toDateKey } from "@/lib/utils/dates";

export function buildEventDays(event: EventDetailDto): string[] {
  const days: string[] = [];
  const startStr = event.startDate.split("T")[0];
  const endStr = event.endDate.split("T")[0];
  const d = new Date(startStr + "T12:00:00Z");
  const end = new Date(endStr + "T12:00:00Z");
  while (d <= end) {
    days.push(toDateKey(d));
    d.setUTCDate(d.getUTCDate() + 1);
  }
  return days;
}

export function filterSessionsByDay(
  sessions: EventSessionSummaryDto[],
  selectedDay: string,
): EventSessionSummaryDto[] {
  if (selectedDay === "all") return sessions;
  return sessions.filter((s) => s.startTime.split("T")[0] === selectedDay);
}

export function filterSessionsByStatus(
  sessions: EventSessionSummaryDto[],
  statusFilter: StatusFilter,
): EventSessionSummaryDto[] {
  const now = new Date();
  switch (statusFilter) {
    case "live":
      return sessions.filter((s) => s.isLive);
    case "upcoming":
      return sessions.filter((s) => new Date(s.startTime) > now && !s.isLive);
    case "ended":
      return sessions.filter((s) => new Date(s.endTime) < now && !s.isLive);
    default:
      return sessions;
  }
}

export function buildHourRange(sessions: EventSessionSummaryDto[]): { start: number; end: number } {
  if (sessions.length === 0) return { start: 8, end: 20 };
  let minH = 24, maxH = 0;
  sessions.forEach((s) => {
    const sStart = new Date(s.startTime);
    const sEnd = new Date(s.endTime);
    const sh = sStart.getHours();
    let eh = sEnd.getHours() + 1;
    if (eh <= sh) eh += 24;
    if (sh < minH) minH = sh;
    if (eh > maxH) maxH = eh;
  });
  if (minH > maxH) return { start: 8, end: 20 };
  return { start: minH, end: maxH };
}

export function buildUniqueRooms(sessions: EventSessionSummaryDto[]): [string, string][] {
  const rooms = new Map<string, string>();
  sessions.forEach((s) => {
    const key = s.isOnline ? "__online__" : (s.room?.name ?? "TBD");
    if (!rooms.has(key)) {
      rooms.set(key, s.isOnline ? "Online" : (s.room?.name ?? "TBD"));
    }
  });
  return Array.from(rooms.entries());
}

export function buildSessionsByRoom(
  sessions: EventSessionSummaryDto[],
  uniqueRooms: [string, string][],
): Map<string, EventSessionSummaryDto[]> {
  const map = new Map<string, EventSessionSummaryDto[]>();
  uniqueRooms.forEach(([key]) => map.set(key, []));
  sessions.forEach((s) => {
    const key = s.isOnline ? "__online__" : (s.room?.name ?? "TBD");
    const arr = map.get(key);
    if (arr) arr.push(s);
  });
  map.forEach((arr) =>
    arr.sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()),
  );
  return map;
}

export const ROOM_ONLINE_KEY = "__online__";
export const CALENDAR_HOUR_HEIGHT = 56;
export const TABLE_PAGE_SIZE = 5;
export const DEFAULT_HOUR_START = 8;
export const DEFAULT_HOUR_END = 20;
