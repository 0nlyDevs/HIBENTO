"use client";

import Link from "next/link";
import * as HoverCard from "@radix-ui/react-hover-card";
import type { EventSessionSummaryDto } from "@/types/dto";
import { formatTimeRange } from "@/lib/utils/dates";
import { ROUTES } from "@/constants/routes";
import { CALENDAR_HOUR_HEIGHT } from "./utils";

interface CalendarViewProps {
  uniqueRooms: [string, string][];
  calendarHours: number[];
  sessionsByRoom: Map<string, EventSessionSummaryDto[]>;
  hourRange: { start: number; end: number };
  isEmpty: boolean;
}

function SessionBlock({
  session,
  hourRange,
}: {
  session: EventSessionSummaryDto;
  hourRange: { start: number; end: number };
}) {
  const sStart = new Date(session.startTime);
  const sEnd = new Date(session.endTime);
  const top = (sStart.getHours() + sStart.getMinutes() / 60 - hourRange.start) * CALENDAR_HOUR_HEIGHT;
  const durationH = (sEnd.getTime() - sStart.getTime()) / 3600000;
  const height = Math.max(durationH * CALENDAR_HOUR_HEIGHT - 3, 14);

  return (
    <HoverCard.Root openDelay={200} closeDelay={100}>
      <HoverCard.Trigger asChild>
        <Link
          href={ROUTES.SESSION_DETAIL(session.id)}
          className={`absolute left-0.5 right-0.5 rounded px-1.5 py-0.5 transition-all hover:brightness-110 ${
            session.isLive
              ? "bg-chartreuse text-charcoal"
              : "bg-charcoal/90 border border-white/10 text-ivory"
          }`}
          style={{ top: `${top}px`, height: `${height}px`, fontSize: "0.55rem" }}
        >
          <div className="flex items-center justify-between gap-0.5">
            <span className="label-mono opacity-70" style={{ fontSize: "0.4rem" }}>
              {formatTimeRange(sStart, sEnd)}
            </span>
          </div>
          <p
            className="font-bold leading-tight truncate"
            style={{ fontSize: "0.5rem", lineHeight: "0.65rem" }}
          >
            {session.title}
          </p>
        </Link>
      </HoverCard.Trigger>
      <HoverCard.Portal>
        <HoverCard.Content
          className="z-50 p-3.5 squircle-lg animate-slide-up"
          style={{
            background: "#18181c",
            border: "1px dashed rgba(255,255,255,0.18)",
            boxShadow: "0 16px 40px -8px rgba(0,0,0,0.8)",
          }}
          sideOffset={8}
          align="start"
        >
          <p className="font-bold text-sm text-ivory leading-snug mb-1.5">{session.title}</p>
          <p className="label-mono text-chartreuse text-[0.55rem] mb-1">{formatTimeRange(sStart, sEnd)}</p>
          <p className="text-xs text-ivory/60 mb-2">
            {session.isOnline ? "Online" : (session.room?.name ?? "TBD")}
          </p>
          {session.speakers.length > 0 && (
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[10px] text-ivory/40">by</span>
              {session.speakers.slice(0, 2).map((sp) => (
                <span key={sp.id} className="text-[11px] font-semibold text-ivory/80">
                  {sp.name}
                </span>
              ))}
              {session.speakers.length > 2 && (
                <span className="text-[10px] text-ivory/40">+{session.speakers.length - 2}</span>
              )}
            </div>
          )}
          <HoverCard.Arrow className="fill-[#18181c]" />
        </HoverCard.Content>
      </HoverCard.Portal>
    </HoverCard.Root>
  );
}

export function CalendarView({
  uniqueRooms,
  calendarHours,
  sessionsByRoom,
  hourRange,
  isEmpty,
}: CalendarViewProps) {
  return (
    <div className="card-glass squircle-lg overflow-x-auto">
      <div className="min-w-200">
        <div
          className="relative"
          style={{
            display: "grid",
            gridTemplateColumns: `60px repeat(${uniqueRooms.length}, 1fr)`,
          }}
        >
          <div className="border-b border-r border-white/10 bg-white/3 px-2 py-1.5 label-mono text-[0.5rem] text-ivory/50 uppercase tracking-wider">
            TIME
          </div>
          {uniqueRooms.map(([, name]) => (
            <div
              key={name}
              className="border-b border-r last:border-r-0 border-white/10 bg-white/3 px-2 py-1.5 label-mono text-[0.55rem] text-ivory/80 truncate uppercase tracking-wider"
            >
              {name}
            </div>
          ))}

          <div className="border-r border-white/10">
            {calendarHours.map((h) => (
              <div
                key={h}
                className="px-1.5 pt-1 label-mono text-[0.45rem] text-ivory/35 border-b border-white/10"
                style={{ height: `${CALENDAR_HOUR_HEIGHT}px` }}
              >
                {String(h).padStart(2, "0")}:00
              </div>
            ))}
          </div>

          {uniqueRooms.map(([key]) => (
            <div key={key} className="relative border-r last:border-r-0 border-white/10">
              {calendarHours.map((h) => (
                <div
                  key={h}
                  style={{ height: `${CALENDAR_HOUR_HEIGHT}px` }}
                  className="border-b border-white/10"
                />
              ))}
              {(sessionsByRoom.get(key) ?? []).map((session) => (
                <SessionBlock key={session.id} session={session} hourRange={hourRange} />
              ))}
            </div>
          ))}
        </div>

        {isEmpty && (
          <div className="text-center py-8">
            <p className="label-mono text-ivory/30">No sessions on this day</p>
          </div>
        )}
      </div>
    </div>
  );
}
