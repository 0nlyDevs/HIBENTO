import type { EventSessionSummaryDto } from "@/types/dto";
import { fromEventSessionSummary } from "@/lib/utils/sessionMappers";
import { ScheduleTableRow } from "@/components/sessions/ScheduleTableRow";

interface EventScheduleRowProps {
  session: EventSessionSummaryDto;
  eventId: string;
  isLast: boolean;
  index?: number;
}

export function EventScheduleRow({ session, eventId, isLast, index }: EventScheduleRowProps) {
  return (
    <ScheduleTableRow
      session={fromEventSessionSummary(session, eventId)}
      isLast={isLast}
      index={index}
      variant="extended"
    />
  );
}
