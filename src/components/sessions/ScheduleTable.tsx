"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ScheduleTableProps } from "@/types/schedule";
import { sortScheduleSessions } from "@/lib/utils/sortSessions";
import {
  ScheduleTableHeader,
  ScheduleTableRow,
  TABLE_MIN_W_DEFAULT,
  TABLE_MIN_W_EXTENDED,
} from "./ScheduleTableRow";

export function ScheduleTable({
  sessions,
  variant = "default",
  sort = true,
  emptyMessage = "No sessions found",
  onSessionClick,
}: ScheduleTableProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ left: false, right: false });

  const displaySessions = useMemo(
    () => (sort ? sortScheduleSessions(sessions) : sessions),
    [sessions, sort],
  );

  const updateEdges = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setEdges({
      left: scrollLeft > 4,
      right: scrollLeft + clientWidth < scrollWidth - 4,
    });
  }, []);

  useEffect(() => {
    updateEdges();
    const el = scrollRef.current;
    el?.addEventListener("scroll", updateEdges, { passive: true });
    window.addEventListener("resize", updateEdges);
    return () => {
      el?.removeEventListener("scroll", updateEdges);
      window.removeEventListener("resize", updateEdges);
    };
  }, [updateEdges, displaySessions.length]);

  const minWidth =
    variant === "extended" ? TABLE_MIN_W_EXTENDED : TABLE_MIN_W_DEFAULT;

  return (
    <div className="relative w-full squircle-lg overflow-hidden">
      {edges.left && (
        <div className="pointer-events-none absolute inset-y-0 left-0 w-10 z-10 bg-linear-to-r from-charcoal/90 to-transparent" />
      )}
      {edges.right && (
        <div className="pointer-events-none absolute inset-y-0 right-0 w-10 z-10 bg-linear-to-l from-charcoal/90 to-transparent" />
      )}

      <div
        ref={scrollRef}
        className="w-full overflow-x-auto overflow-y-hidden
          [scrollbar-width:thin]
          [scrollbar-color:rgba(255,255,255,0.15)_transparent]
          [&::-webkit-scrollbar]:h-1
          [&::-webkit-scrollbar-track]:bg-transparent
          [&::-webkit-scrollbar-thumb]:bg-white/15
          [&::-webkit-scrollbar-thumb]:rounded-full"
      >
        <div className={`${minWidth} card-glass`}>
          <ScheduleTableHeader variant={variant} />
          {displaySessions.length === 0 ? (
            <div className="text-center py-12">
              <p className="label-mono text-ivory/30">{emptyMessage}</p>
            </div>
          ) : (
            displaySessions.map((session, idx) => (
              <ScheduleTableRow
                key={session.id}
                session={session}
                isLast={idx === displaySessions.length - 1}
                index={idx}
                variant={variant}
                onSessionClick={onSessionClick}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
