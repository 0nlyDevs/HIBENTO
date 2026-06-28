import type { EventDetailDto, EventSessionSummaryDto } from "@/types/dto";

export type ViewMode = "table" | "calendar";
export type StatusFilter = "all" | "live" | "upcoming" | "ended";

export interface EventScheduleProps {
  event: EventDetailDto;
  selectedDay: string;
  onDayChange: (day: string) => void;
  hideHeader?: boolean;
}

export interface PillProps {
  label: string;
  value: string;
  isActive: boolean;
  onClick: () => void;
  index: number;
  setPillRef: (index: number, element: HTMLButtonElement | null) => void;
  uppercase?: boolean;
}

export interface CalendarViewProps {
  uniqueRooms: string[];
  calendarHours: number[];
  sessionsByRoom: Map<string, EventSessionSummaryDto[]>;
  hourRange: { start: number; end: number };
  isEmpty: boolean;
}
