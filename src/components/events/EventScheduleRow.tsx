import { Wifi, Play, UserPlus, Eye } from "lucide-react";
import type { EventSessionSummaryDto } from "@/types/dto";
import { formatShortDate, formatTimeRange } from "@/lib/utils/dates";
import { SessionModal } from "@/components/sessions/SessionModal";
import { SpeakersCell } from "./SpeakersCell";

interface EventScheduleRowProps {
  session: EventSessionSummaryDto;
  now: Date;
  isLast: boolean;
}

export function EventScheduleRow({ session, now, isLast }: EventScheduleRowProps) {
  const sStart = new Date(session.startTime);
  const sEnd = new Date(session.endTime);
  const sIsLive = session.isLive;
  const sEnded = sEnd < now;
  const sUpcoming = sStart > now && !sIsLive;
  const sessionNotOnline = !session.isOnline;
  const canRegister = sUpcoming && sessionNotOnline && !sEnded;

  return (
    <div
      className={`gap-4 px-6 py-5 group transition-colors items-center min-w-[700px] border-b border-dashed ${
        isLast ? "border-transparent" : "border-white/8"
      } ${sIsLive ? "bg-chartreuse/4" : ""}`}
      style={{ display: "grid", gridTemplateColumns: "150px 1fr 160px 130px 100px 80px" }}
    >
      {/* Time */}
      <div className="flex flex-col">
        <span className="text-base font-semibold text-ivory/90">{formatShortDate(sStart)}</span>
        <span className="text-sm text-ivory/55 mt-0.5">{formatTimeRange(sStart, sEnd)}</span>
      </div>

      {/* Title + description */}
      <div className="flex flex-col min-w-0">
        <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
          {sIsLive && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full label-mono text-xs glow-chip shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-charcoal animate-pulse" />LIVE
            </span>
          )}
          {sUpcoming && (
            <span className="label-mono text-xs font-bold text-charcoal px-2 py-0.5 rounded-full shrink-0 bg-chartreuse">
              UPCOMING
            </span>
          )}
          {sEnded && !sIsLive && (
            <span className="label-mono text-xs text-ivory/35 shrink-0">ENDED</span>
          )}
        </div>
        <SessionModal sessionId={session.id}>
          <button className="font-bold text-base text-ivory hover:text-chartreuse transition-colors text-left line-clamp-1 mb-1.5 cursor-pointer">
            {session.title}
          </button>
        </SessionModal>
        {session.description && (
          <p className="text-sm text-ivory/55 line-clamp-2 leading-relaxed">
            {session.description}
          </p>
        )}
      </div>

      {/* Room */}
      <div className="flex flex-col">
        {session.isOnline ? (
          <span className="flex items-center gap-1.5 text-base text-ivory/65">
            <Wifi size={14} className="text-chartreuse shrink-0" />ONLINE
          </span>
        ) : (
          <>
            <span className="text-base font-semibold text-ivory/90 leading-snug">
              {session.room?.name ?? "TBD"}
            </span>
          </>
        )}
      </div>

      {/* Speakers */}
      <div className="flex items-center">
        <SpeakersCell speakers={session.speakers} />
      </div>

      {/* Format chip */}
      <div className="flex items-center">
        <span
          className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-bold text-charcoal bg-chartreuse"
          style={{ boxShadow: "0 0 0 1px hsl(59 73% 52% / 0.3)" }}
        >
          {session.isOnline ? "Online" : "In Person"}
        </span>
      </div>

      {/* Single Action */}
      <div className="flex items-center justify-center">
        {sIsLive ? (
          <SessionModal sessionId={session.id}>
            <button
              className="w-9 h-9 rounded-lg flex items-center justify-center glow-chip transition-all hover:brightness-110 cursor-pointer"
              title="Watch live"
            >
              <Play size={14} fill="currentColor" />
            </button>
          </SessionModal>
        ) : canRegister ? (
          <SessionModal sessionId={session.id} defaultOpenRegister>
            <button
              className="w-9 h-9 rounded-lg flex items-center justify-center bg-chartreuse text-charcoal transition-all hover:brightness-110 cursor-pointer"
              style={{ boxShadow: "0 0 0 1px hsl(59 73% 52% / 0.3)" }}
              title="Register for this session"
            >
              <UserPlus size={14} />
            </button>
          </SessionModal>
        ) : (
          <SessionModal sessionId={session.id}>
            <button
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-ivory/50 transition-all hover:text-ivory hover:bg-white/5 cursor-pointer"
              style={{ border: "1px dashed rgba(255,255,255,0.12)" }}
              title="View details"
            >
              <Eye size={12} />
              VIEW
            </button>
          </SessionModal>
        )}
      </div>
    </div>
  );
}
