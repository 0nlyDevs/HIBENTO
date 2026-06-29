"use client";

import { useMemo, useState, useRef, useCallback } from "react";
import type { ViewMode, StatusFilter } from "./types";
import { Pill } from "./pill";
import { SlidingBackground } from "./sliding-background";
import { CalendarView } from "./calendar-view";
import {
  buildEventDays,
  filterSessionsByDay,
  filterSessionsByStatus,
  buildHourRange,
  buildUniqueRooms,
  buildSessionsByRoom,
  TABLE_PAGE_SIZE,
} from "./utils";
import { formatShortDate } from "@/lib/utils/dates";
import { fromEventSessionSummary } from "@/lib/utils/sessionMappers";
import { sortScheduleSessions } from "@/lib/utils/sortSessions";
import { ScheduleTable } from "@/components/sessions/ScheduleTable";
import type { EventScheduleProps } from "./types";

export function EventSchedule({
  event,
  selectedDay,
  onDayChange,
  viewMode: externalViewMode,
  onViewModeChange,
  statusFilter: externalStatusFilter,
  onStatusFilterChange,
  tablePage: externalTablePage,
  onTablePageChange,
}: EventScheduleProps) {
  const [internalViewMode, setInternalViewMode] = useState<ViewMode>("table");
  const [internalStatusFilter, setInternalStatusFilter] = useState<StatusFilter>("all");
  const [internalTablePage, setInternalTablePage] = useState(1);

  const viewMode = externalViewMode ?? internalViewMode;
  const statusFilter = externalStatusFilter ?? internalStatusFilter;
  const tablePage = externalTablePage ?? internalTablePage;

  const setViewMode = useCallback(
    (mode: ViewMode) => {
      if (onViewModeChange) onViewModeChange(mode);
      else setInternalViewMode(mode);
    },
    [onViewModeChange],
  );

  const setStatusFilter = useCallback(
    (filter: StatusFilter) => {
      if (onStatusFilterChange) onStatusFilterChange(filter);
      else setInternalStatusFilter(filter);
    },
    [onStatusFilterChange],
  );

  const setTablePage = useCallback(
    (page: number) => {
      if (onTablePageChange) onTablePageChange(page);
      else setInternalTablePage(page);
    },
    [onTablePageChange],
  );

  const hasExternalControls = externalViewMode !== undefined;
  const eventDays = useMemo(() => buildEventDays(event), [event]);

  const filteredEventSessions = useMemo(() => {
    const byDay = filterSessionsByDay(event.eventSessions, selectedDay);
    return filterSessionsByStatus(byDay, statusFilter);
  }, [event.eventSessions, selectedDay, statusFilter]);

  const sortedTableSessions = useMemo(() => {
    const mapped = filteredEventSessions.map((s) => fromEventSessionSummary(s, event.id));
    return sortScheduleSessions(mapped);
  }, [filteredEventSessions, event.id]);

  const totalTablePages = Math.max(1, Math.ceil(sortedTableSessions.length / TABLE_PAGE_SIZE));
  const safeTablePage = Math.min(tablePage, totalTablePages);
  const paginatedSessions = sortedTableSessions.slice(
    (safeTablePage - 1) * TABLE_PAGE_SIZE,
    safeTablePage * TABLE_PAGE_SIZE,
  );

  const handleDayChange = useCallback(
    (day: string) => {
      onDayChange(day);
      setTablePage(1);
    },
    [onDayChange],
  );

  const handleStatusFilterChange = useCallback((status: StatusFilter) => {
    setStatusFilter(status);
    setTablePage(1);
  }, []);

  const allPills = useMemo(() => {
    const pills: Array<{ label: string; value: string }> = [{ label: "All Days", value: "all" }];
    eventDays.forEach((key) => {
      pills.push({ label: formatShortDate(new Date(key + "T12:00:00Z")), value: key });
    });
    return pills;
  }, [eventDays]);

  const activeDayIndex = allPills.findIndex((pill) => pill.value === selectedDay);

  const viewModeOptions: Array<{ label: string; value: ViewMode }> = [
    { label: "TABLE", value: "table" },
    { label: "CALENDAR", value: "calendar" },
  ];
  const activeViewIndex = viewModeOptions.findIndex((v) => v.value === viewMode);

  const statusOptions: Array<{ label: string; value: StatusFilter }> = [
    { label: "ALL", value: "all" },
    { label: "LIVE", value: "live" },
    { label: "UPCOMING", value: "upcoming" },
    { label: "ENDED", value: "ended" },
  ];
  const activeStatusIndex = statusOptions.findIndex((s) => s.value === statusFilter);

  const dayPillRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const viewPillRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const statusPillRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const setDayPillRef = useCallback((index: number, element: HTMLButtonElement | null) => {
    dayPillRefs.current[index] = element;
  }, []);
  const setViewPillRef = useCallback((index: number, element: HTMLButtonElement | null) => {
    viewPillRefs.current[index] = element;
  }, []);
  const setStatusPillRef = useCallback((index: number, element: HTMLButtonElement | null) => {
    statusPillRefs.current[index] = element;
  }, []);

  const uniqueRooms = useMemo(() => buildUniqueRooms(filteredEventSessions), [filteredEventSessions]);
  const hourRange = useMemo(() => buildHourRange(filteredEventSessions), [filteredEventSessions]);
  const calendarHours = useMemo(() => {
    const hours: number[] = [];
    for (let i = hourRange.start; i <= hourRange.end; i++) hours.push(i);
    return hours;
  }, [hourRange]);
  const sessionsByRoom = useMemo(
    () => buildSessionsByRoom(filteredEventSessions, uniqueRooms),
    [filteredEventSessions, uniqueRooms],
  );

  return (
    <div className="mb-10">
      {!hasExternalControls && (
        <div className="flex flex-wrap items-center gap-3 mb-5">
          <div className="shrink-0">
            <p className="label-mono text-chartreuse mb-0.5">§ SCHEDULE</p>
            <h2 className="text-display text-2xl text-ivory">Sessions</h2>
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full card-glass shrink-0 h-11">
            <span className="w-5 h-5 rounded-full flex items-center justify-center text-[0.6rem] font-black bg-chartreuse text-charcoal">
              {filteredEventSessions.length}
            </span>
            <span className="label-mono text-ivory/70 uppercase tracking-wider text-xs">SESSIONS</span>
          </div>

          <div className="relative flex items-center gap-1 p-1 card-glass rounded-full shrink-0 h-11">
            <SlidingBackground activeIndex={activeViewIndex} pillRefs={viewPillRefs} />
            {viewModeOptions.map((view, index) => (
              <Pill
                key={view.value}
                label={view.label}
                value={view.value}
                isActive={viewMode === view.value}
                onClick={() => setViewMode(view.value)}
                index={index}
                setPillRef={setViewPillRef}
                uppercase
              />
            ))}
          </div>

          <div className="relative flex items-center gap-1 p-1 card-glass rounded-full shrink-0 h-11">
            <SlidingBackground activeIndex={activeStatusIndex} pillRefs={statusPillRefs} />
            {statusOptions.map((status, index) => (
              <Pill
                key={status.value}
                label={status.label}
                value={status.value}
                isActive={statusFilter === status.value}
                onClick={() => handleStatusFilterChange(status.value)}
                index={index}
                setPillRef={setStatusPillRef}
                uppercase
              />
            ))}
          </div>

          <div className="relative flex items-center gap-1 p-1 card-glass overflow-x-auto flex-nowrap ml-auto h-11 rounded-full">
            <SlidingBackground activeIndex={activeDayIndex} pillRefs={dayPillRefs} />
            {allPills.map((pill, index) => (
              <Pill
                key={pill.value}
                label={pill.label}
                value={pill.value}
                isActive={selectedDay === pill.value}
                onClick={() => handleDayChange(pill.value)}
                index={index}
                setPillRef={setDayPillRef}
                uppercase={false}
              />
            ))}
          </div>
        </div>
      )}

      {viewMode === "table" ? (
        <>
          <ScheduleTable
            sessions={paginatedSessions}
            variant="extended"
            sort={false}
            emptyMessage="No sessions on this day"
          />
          {totalTablePages > 1 && (
            <div className="flex items-center justify-center gap-3 mt-6">
              <button
                onClick={() => setTablePage(Math.max(1, tablePage - 1))}
                disabled={tablePage === 1}
                className="px-5 py-2.5 label-mono text-ivory/70 rounded-full hover:text-ivory disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer uppercase tracking-wider text-xs h-11"
                style={{
                  background: "#222222E6",
                  border: "1px dashed rgba(255,255,255,0.18)",
                }}
              >
                PREV
              </button>
              <span className="label-mono text-ivory/50 px-3 uppercase tracking-wider text-xs h-11 flex items-center">
                {String(tablePage).padStart(2, "0")} / {String(totalTablePages).padStart(2, "0")}
              </span>
              <button
                onClick={() => setTablePage(Math.min(totalTablePages, tablePage + 1))}
                disabled={tablePage === totalTablePages}
                className="px-5 py-2.5 label-mono text-ivory/70 rounded-full hover:text-ivory disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer uppercase tracking-wider text-xs h-11"
                style={{
                  background: "#222222E6",
                  border: "1px dashed rgba(255,255,255,0.18)",
                }}
              >
                NEXT
              </button>
            </div>
          )}
        </>
      ) : (
        <CalendarView
          uniqueRooms={uniqueRooms}
          calendarHours={calendarHours}
          sessionsByRoom={sessionsByRoom}
          hourRange={hourRange}
          isEmpty={filteredEventSessions.length === 0}
        />
      )}
    </div>
  );
}
