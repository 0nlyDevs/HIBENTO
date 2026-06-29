"use client";

import Link from "next/link";
import { useState, useRef, useCallback, useMemo, useEffect } from "react";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useGetEvent } from "@/lib/hooks/useEvents";
import { useNotifications } from "@/lib/hooks/NotificationContext";
import { api } from "@/lib/api";
import { EventHero } from "@/components/events/EventHero";
import { EventInfoGrid } from "@/components/events/EventInfoGrid";
import { EventSchedule } from "@/components/features/EventSchedule";
import { EventVenueCard } from "@/components/events/EventVenueCard";
import { Pill } from "@/components/features/EventSchedule/pill";
import { SlidingBackground } from "@/components/features/EventSchedule/sliding-background";
import type { ViewMode, StatusFilter } from "@/components/features/EventSchedule/types";
import {
  buildEventDays,
  filterSessionsByDay,
  filterSessionsByStatus,
} from "@/components/features/EventSchedule/utils";
import { formatShortDate } from "@/lib/utils/dates";
import { Calendar, Clock, MapPin, Users } from "lucide-react";

function NotFound() {
  return (
    <div className="pt-20 flex items-center justify-center">
      <p className="label-mono text-ivory/40">EVENT NOT FOUND</p>
    </div>
  );
}

export default function EventDetailPage() {
  const { eventId } = useParams<{ eventId: string }>();
  const { data: event, isLoading } = useGetEvent(eventId);
  const { setCurrentEventId } = useNotifications();
  const { data: recsData } = useQuery({
    queryKey: ["recommendations", eventId],
    queryFn: () => api.getRecommendations(eventId),
    enabled: !!eventId,
    staleTime: 10 * 60 * 1000,
  });
  const [selectedDay, setSelectedDay] = useState<string>("all");
  const [viewMode, setViewMode] = useState<ViewMode>("table");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [tablePage, setTablePage] = useState(1);

  // Register this event as the current context for global recommendations
  useEffect(() => {
    setCurrentEventId(eventId);
    return () => setCurrentEventId(null);
  }, [eventId, setCurrentEventId]);

  const viewPillRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const statusPillRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const dayPillRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const setViewPillRef = useCallback((i: number, el: HTMLButtonElement | null) => {
    viewPillRefs.current[i] = el;
  }, []);
  const setStatusPillRef = useCallback((i: number, el: HTMLButtonElement | null) => {
    statusPillRefs.current[i] = el;
  }, []);
  const setDayPillRef = useCallback((i: number, el: HTMLButtonElement | null) => {
    dayPillRefs.current[i] = el;
  }, []);

  const eventDays = useMemo(() => (event ? buildEventDays(event) : []), [event]);

  const dayPills = useMemo(() => {
    const pills: Array<{ label: string; value: string }> = [{ label: "All Days", value: "all" }];
    eventDays.forEach((key) => {
      pills.push({ label: formatShortDate(new Date(key + "T12:00:00Z")), value: key });
    });
    return pills;
  }, [eventDays]);

  const activeDayIndex = dayPills.findIndex((p) => p.value === selectedDay);

  const handleStatusChange = useCallback(
    (s: StatusFilter) => {
      setStatusFilter(s);
      setTablePage(1);
    },
    [],
  );

  const handleDayChange = useCallback(
    (day: string) => {
      setSelectedDay(day);
      setTablePage(1);
    },
    [],
  );

  const filteredCount = useMemo(() => {
    if (!event) return 0;
    const byDay = filterSessionsByDay(event.eventSessions, selectedDay);
    return filterSessionsByStatus(byDay, statusFilter).length;
  }, [event, selectedDay, statusFilter]);

  if (!isLoading && !event) return <NotFound />;

  const start = event ? new Date(event.startDate) : new Date();
  const end = event ? new Date(event.endDate) : new Date();
  const now = new Date();
  const isLive = event ? start <= now && end >= now : false;
  const isEnded = event ? end < now : false;

  const viewOptions = [
    { label: "TABLE", value: "table" as ViewMode },
    { label: "CALENDAR", value: "calendar" as ViewMode },
  ];
  const statusOptions = [
    { label: "ALL", value: "all" as StatusFilter },
    { label: "LIVE", value: "live" as StatusFilter },
    { label: "UPCOMING", value: "upcoming" as StatusFilter },
    { label: "ENDED", value: "ended" as StatusFilter },
  ];

  return (
    <div className="pt-16 pb-24">
      <div className="max-w-7xl mx-auto px-6">
        <Link
          href="/events"
          className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wider text-ivory/70 hover:text-ivory transition-colors mb-6 group"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="transition-transform group-hover:-translate-x-0.5">
            <path d="M7 3L4 6L7 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          ALL EVENTS
        </Link>

        {event ? (
          <EventHero event={event} isLive={isLive} isEnded={isEnded} />
        ) : (
          <div className="relative overflow-hidden squircle-lg min-h-65 flex flex-col justify-end mb-4 motion-safe:animate-pulse">
            <div className="absolute inset-0 bg-ivory/5" />
            <div className="relative z-10 px-6 py-6 space-y-2">
              <p className="label-mono text-chartreuse mb-1">§ EVENT</p>
              <div className="h-8 w-3/4 rounded-xl bg-ivory/5" />
              <div className="h-4 w-1/2 rounded-lg bg-ivory/5" />
            </div>
          </div>
        )}

        {event ? (
          <EventInfoGrid event={event} isOnline={event.isOnline} />
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            {[
              { label: "DATES", icon: <Calendar size={16} className="text-chartreuse" aria-hidden="true" /> },
              { label: "TIME", icon: <Clock size={16} className="text-chartreuse" aria-hidden="true" /> },
              { label: "LOCATION", icon: <MapPin size={16} className="text-chartreuse" aria-hidden="true" /> },
              { label: "VENUE", icon: <Users size={16} className="text-chartreuse" aria-hidden="true" /> },
            ].map(({ label, icon }) => (
              <div key={label} className="card-glass squircle p-5 flex items-start gap-3" aria-hidden="true">
                <div className="mt-1 shrink-0">{icon}</div>
                <div className="flex-1 space-y-2">
                  <p className="label-mono text-ivory/40 mb-1 text-xs">{label}</p>
                  <div className="h-5 w-3/4 rounded-lg bg-ivory/5 motion-safe:animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        )}

        <div id="event-schedule" className="mb-10 scroll-mt-28">
          <div className="flex flex-wrap items-center gap-3 mb-5">
            <div className="shrink-0">
              <p className="label-mono text-chartreuse mb-0.5">§ SCHEDULE</p>
              <h2 className="text-display text-2xl text-ivory">Sessions</h2>
            </div>

            {event && (
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full card-glass shrink-0 h-11">
                <span className="w-5 h-5 rounded-full flex items-center justify-center text-[0.6rem] font-black bg-chartreuse text-charcoal">
                  {filteredCount}
                </span>
                <span className="label-mono text-ivory/70 uppercase tracking-wider text-xs">SESSIONS</span>
              </div>
            )}

            {/** View mode pills */}
            <div className="relative flex items-center gap-1 p-1 card-glass rounded-full shrink-0 h-11">
              <SlidingBackground activeIndex={viewMode === "table" ? 0 : 1} pillRefs={viewPillRefs} />
              {viewOptions.map((opt, i) => (
                <Pill
                  key={opt.value}
                  label={opt.label}
                  value={opt.value}
                  isActive={viewMode === opt.value}
                  onClick={() => setViewMode(opt.value)}
                  index={i}
                  setPillRef={setViewPillRef}
                  uppercase
                />
              ))}
            </div>

            {/** Status filter pills */}
            <div className="relative flex items-center gap-1 p-1 card-glass rounded-full shrink-0 h-11">
              <SlidingBackground activeIndex={["all", "live", "upcoming", "ended"].indexOf(statusFilter)} pillRefs={statusPillRefs} />
              {statusOptions.map((opt, i) => (
                <Pill
                  key={opt.value}
                  label={opt.label}
                  value={opt.value}
                  isActive={statusFilter === opt.value}
                  onClick={() => handleStatusChange(opt.value)}
                  index={i}
                  setPillRef={setStatusPillRef}
                  uppercase
                />
              ))}
            </div>

            {/** Day pills — only when event is loaded */}
            {event && (
              <div className="relative flex items-center gap-1 p-1 card-glass overflow-x-auto flex-nowrap ml-auto h-11 rounded-full">
                <SlidingBackground activeIndex={activeDayIndex} pillRefs={dayPillRefs} />
                {dayPills.map((pill, i) => (
                  <Pill
                    key={pill.value}
                    label={pill.label}
                    value={pill.value}
                    isActive={selectedDay === pill.value}
                    onClick={() => handleDayChange(pill.value)}
                    index={i}
                    setPillRef={setDayPillRef}
                  />
                ))}
              </div>
            )}
          </div>

          {event && event.eventSessions.length > 0 ? (
            <EventSchedule
              event={event}
              selectedDay={selectedDay}
              onDayChange={setSelectedDay}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              statusFilter={statusFilter}
              onStatusFilterChange={handleStatusChange}
              tablePage={tablePage}
              onTablePageChange={setTablePage}
            />
          ) : event && event.eventSessions.length === 0 ? null : (
            <div className="space-y-3 motion-safe:animate-pulse" aria-hidden="true">
              <div className="h-6 w-full rounded-lg bg-ivory/5" />
              <div className="h-20 w-full rounded-lg bg-ivory/5" />
              <div className="h-20 w-full rounded-lg bg-ivory/5" />
            </div>
          )}
        </div>

        {event ? (
          <EventVenueCard event={event} />
        ) : (
          <div className="squircle-lg overflow-hidden card-glass motion-safe:animate-pulse" aria-hidden="true">
            <div className="h-44 bg-ivory/5 flex items-center justify-center">
              <MapPin size={28} className="text-ivory/20" aria-hidden="true" />
            </div>
            <div className="px-5 py-4 space-y-2">
              <div className="h-5 w-2/3 rounded-lg bg-ivory/5 motion-safe:animate-pulse" />
              <div className="h-4 w-1/2 rounded-lg bg-ivory/5 motion-safe:animate-pulse" />
            </div>
          </div>
        )}

        {recsData?.data && recsData.data.length > 0 && (
          <div className="mt-12">
            <p className="label-mono text-chartreuse mb-2">§ RECOMMENDED</p>
            <h2 className="text-display text-2xl text-ivory mb-6">
              You might also like
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recsData.data.map((rec) => (
                <Link
                  key={rec.id}
                  href={`/events/${rec.id}`}
                  className="card-glass squircle-lg p-5 hover:bg-ivory/[0.07] transition-colors group"
                >
                  <p className="text-sm font-semibold text-ivory group-hover:text-chartreuse transition-colors mb-1.5">
                    {rec.title}
                  </p>
                  <p className="text-xs text-ivory/50 line-clamp-2 mb-3">
                    {rec.description || "No description"}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-semibold text-ivory/40 label-mono">
                      {rec.match?.venue?.city ?? "Online"}
                    </span>
                    <span className="text-[10px] font-semibold text-chartreuse/60 label-mono">
                      {Math.round(rec.score * 100)}% match
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
