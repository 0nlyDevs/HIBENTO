export interface ScheduleSpeaker {
  id: string;
  name: string;
  image?: string;
  bio?: string | null;
}

export interface ScheduleSession {
  id: string;
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
  venue: string;
  speakers: ScheduleSpeaker[];
  isLive: boolean;
  eventId: string;
  isOnline?: boolean;
  subtitle?: string;
}

export interface ScheduleTableProps {
  sessions: ScheduleSession[];
  variant?: "default" | "extended";
  sort?: boolean;
  emptyMessage?: string;
  onSessionClick?: (session: ScheduleSession) => void;
}
