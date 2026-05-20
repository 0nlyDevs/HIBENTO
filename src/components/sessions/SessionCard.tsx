"use client";

import Link from "next/link";
import type { EventSessionSummaryDto } from "@/types/dto";

interface SessionCardProps {
  session: EventSessionSummaryDto;
  compact?: boolean;
}

export function SessionCard({ session, compact = false }: SessionCardProps) {
  const start = new Date(session.startTime);
  const end = new Date(session.endTime);
  const now = new Date();
  const isPast = end < now;
  const isUpcoming = start > now;

  return (
    <Link
      href={`/sessions/${session.id}`}
      className={`group block transition-all duration-300 hover:shadow-md ${
        compact ? "p-3" : "p-4"
      }`}
      style={{
        background: "#FEFCF7",
        border: "1px solid rgba(40,40,40,0.1)",
        borderLeft: `3px solid ${session.isLive ? "#7B8B6F" : isPast ? "#ccc" : "#EAE151"}`,
      }}
    >
      <div className="flex items-center gap-2 mb-1.5">
        <span
          className={compact ? "text-[0.6rem] font-mono" : "text-xs font-mono"}
          style={{ color: "rgba(40,40,40,0.5)" }}
        >
          {start.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
          {!compact && ` – ${end.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}`}
        </span>
        {session.isLive && (
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[0.6rem] font-bold bg-nori text-cream">
            <span className="w-1 h-1 bg-cream animate-pulse" />
            LIVE
          </span>
        )}
        {isUpcoming && !session.isLive && (
          <span className="text-[0.6rem] tracking-wider font-bold text-matcha">UPCOMING</span>
        )}
        {isPast && !session.isLive && (
          <span className="text-[0.6rem] tracking-wider font-bold text-charcoal/30">ENDED</span>
        )}
      </div>

      <h4
        className={`font-bold transition-colors group-hover:text-yellow-dark ${
          compact ? "text-xs" : "text-sm"
        }`}
        style={{ color: "#282828" }}
      >
        {session.title}
      </h4>

      {!compact && session.speakers.length > 0 && (
        <p className="text-xs mt-1" style={{ color: "rgba(40,40,40,0.5)" }}>
          {session.speakers.map((s) => s.name).join(" / ")}
        </p>
      )}

      {compact && session.speakers.length > 0 && (
        <p className="text-[0.6rem] mt-0.5" style={{ color: "rgba(40,40,40,0.4)" }}>
          {session.speakers.map((s) => s.name).join(", ")}
        </p>
      )}

      <div className="flex items-center gap-2 mt-2">
        <div className="w-1.5 h-1.5 rounded-full bg-charcoal/20" />
        <span className="text-[0.6rem] tracking-wider" style={{ color: "rgba(40,40,40,0.4)" }}>
          {session.room.name}
        </span>
      </div>
    </Link>
  );
}