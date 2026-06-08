"use client";

import { useMemo } from "react";
import type { EventDetailDto, EventSessionSummaryDto } from "@/types/dto";
import { formatShortDate, toDateKey } from "@/lib/utils/dates";
import { EventScheduleRow } from "./EventScheduleRow";

interface EventScheduleProps {
  event: EventDetailDto;
  selectedDay: string;
  onDayChange: (day: string) => void;
}

function buildEventDays(event: EventDetailDto): string[] {
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

function filterSessions(
  sessions: EventSessionSummaryDto[],
  selectedDay: string
): EventSessionSummaryDto[] {
  const sorted = [...sessions].sort(
    (a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
  );
  if (selectedDay === "all") return sorted;
  return sorted.filter((s) => s.startTime.split("T")[0] === selectedDay);
}

export function EventSchedule({ event, selectedDay, onDayChange }: EventScheduleProps) {
  const eventDays = useMemo(() => buildEventDays(event), [event]);
  const filteredSessions = useMemo(
    () => filterSessions(event.eventSessions, selectedDay),
    [event.eventSessions, selectedDay]
  );

  const now = new Date();

  return (
    <div id="event-schedule" className="mb-10 scroll-mt-28">
      {/* Header row */}
      <div className="flex items-center justify-between gap-4 mb-5">
        <div className="shrink-0">
          <p className="label-mono text-chartreuse mb-0.5">§ SCHEDULE</p>
          <h2 className="text-display text-2xl text-ivory">Sessions</h2>
        </div>

        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full card-glass">
          <span className="w-5 h-5 rounded-full flex items-center justify-center text-[0.6rem] font-black bg-chartreuse text-charcoal">
            {filteredSessions.length}
          </span>
          <span className="label-mono text-ivory/70">SESSIONS</span>
        </div>

        <div className="flex items-center gap-1 p-1 card-glass">
          <button
            onClick={() => onDayChange("all")}
            className={`px-3.5 py-1.5 text-xs font-semibold squircle transition-all ${
              selectedDay === "all"
                ? "bg-chartreuse text-charcoal"
                : "text-ivory/50 hover:text-ivory"
            }`}
          >
            All Days
          </button>
          {eventDays.map((key) => {
            const isActive = selectedDay === key;
            return (
              <button
                key={key}
                onClick={() => onDayChange(key)}
                className={`px-3.5 py-1.5 text-xs font-semibold squircle transition-all ${
                  isActive ? "bg-chartreuse text-charcoal" : "text-ivory/50 hover:text-ivory"
                }`}
              >
                {formatShortDate(new Date(key + "T12:00:00Z"))}
              </button>
            );
          })}
        </div>
      </div>

      {/* Table */}
      <div className="card-glass squircle-lg overflow-x-auto">
        <div
          className="gap-4 px-6 py-3.5 min-w-[700px] border-b border-dashed border-white/10 bg-white/3"
          style={{ display: "grid", gridTemplateColumns: "150px 1fr 160px 130px 100px 80px" }}
        >
          <span className="text-sm font-medium text-ivory/55">Time</span>
          <span className="text-sm font-medium text-ivory/55">Session Title</span>
          <span className="text-sm font-medium text-ivory/55">Room / Location</span>
          <span className="text-sm font-medium text-ivory/55">Speakers</span>
          <span className="text-sm font-medium text-ivory/55">Format</span>
          <span className="text-sm font-medium text-ivory/55">Actions</span>
        </div>

        {filteredSessions.map((session, idx) => (
          <EventScheduleRow
            key={session.id}
            session={session}
            now={now}
            isLast={idx === filteredSessions.length - 1}
          />
        ))}

        {filteredSessions.length === 0 && (
          <div className="text-center py-12">
            <p className="label-mono text-ivory/30">No sessions on this day</p>
          </div>
        )}
      </div>
    </div>
  );
}