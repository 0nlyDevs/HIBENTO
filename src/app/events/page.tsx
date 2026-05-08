"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useGetEvents } from "@/lib/hooks/useEvents";
import { useGetEventRooms, useGetRoomSessions } from "@/lib/hooks/useRooms";

function SkeletonCard() {
  return (
    <div className="border border-charcoal/10 p-6">
      <div className="skeleton h-6 w-2/3 mb-4"></div>
      <div className="skeleton h-4 w-full mb-2"></div>
      <div className="skeleton h-4 w-1/2 mb-4"></div>
      <div className="flex gap-4">
        <div className="skeleton h-3 w-20"></div>
        <div className="skeleton h-3 w-16"></div>
        <div className="skeleton h-3 w-24"></div>
      </div>
    </div>
  );
}

function TimelineSession({ session }: { session: { id: string; title: string; startTime: string; endTime: string; isLive: boolean; speakers: { name: string }[] } }) {
  const start = new Date(session.startTime);
  const end = new Date(session.endTime);
  const now = new Date();
  const isPast = end < now;
  const isUpcoming = start > now;

  let dotColor = "bg-charcoal/30";
  if (session.isLive) { dotColor = "bg-coral"; }
  else if (isPast) { dotColor = "bg-charcoal/20"; }
  else if (isUpcoming) { dotColor = "bg-matcha"; }

  return (
    <Link href={`/sessions/${session.id}`} className="block group">
      <div className="timeline-track pl-8 relative">
        <div className={`timeline-dot ${dotColor} ${session.isLive ? 'animate-dot-pulse' : ''}`}></div>
        <div className={`p-4 border transition-all duration-200
          ${session.isLive
            ? 'border-l-2 border-l-coral bg-coral/5 border-charcoal/10'
            : isUpcoming
              ? 'border-l-2 border-l-matcha bg-matcha-light/30 border-charcoal/10'
              : 'border border-charcoal/10 bg-rice hover:border-l-2 hover:border-l-charcoal/30'
          }
          ${session.isLive ? 'group-hover:bg-coral/10' : 'group-hover:bg-yellow/5'}
        `}>
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-mono text-charcoal/40">
                  {start.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                  {" \u2014 "}
                  {end.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                </span>
                {session.isLive && <span className="live-badge">LIVE</span>}
                {isUpcoming && !session.isLive && <span className="text-[0.625rem] tracking-wider text-matcha font-bold">UPCOMING</span>}
                {isPast && !session.isLive && <span className="text-[0.625rem] tracking-wider text-charcoal/30 font-bold">ENDED</span>}
              </div>
              <h5 className="font-bold text-charcoal group-hover:text-yellow-dark transition-colors">{session.title}</h5>
              <p className="text-xs text-charcoal/50 mt-1">{session.speakers.map((s) => s.name).join(" / ")}</p>
            </div>
            <div className="text-charcoal/20 text-lg group-hover:text-charcoal/40 transition-colors shrink-0">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M7 4L13 10L7 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function EventsPage() {
  const [selectedEvent, setSelectedEvent] = useState<string>("");
  const [selectedRoom, setSelectedRoom] = useState<string>("");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");

  const { data: eventsData, isLoading } = useGetEvents({
    page: 1,
    limit: 20,
    upcoming: false,
  });

  const { data: roomsData } = useGetEventRooms(selectedEvent);
  const { data: sessionData } = useGetRoomSessions(selectedEvent, selectedRoom);

  const events = eventsData?.data || [];

  const eventColorBar = (idx: number) => {
    const colors = ["bg-yellow", "bg-matcha", "bg-coral", "bg-indigo", "bg-sakura"];
    return colors[idx % colors.length];
  };

  return (
    <div className="min-h-screen bg-cream">
      <nav className="border-b border-charcoal/10 bg-cream/95 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <Image src="/logo.svg" alt="HIBENTO" width={28} height={28} className="group-hover:scale-110 transition-transform" />
            <span className="font-bold text-xl tracking-tighter text-charcoal">HIBENTO</span>
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/events" className="text-sm font-bold tracking-wider text-charcoal border-b-2 border-charcoal">EVENTS</Link>
            <Link href="/speakers" className="text-sm font-medium tracking-wider text-charcoal/70 hover:text-charcoal transition-colors">SPEAKERS</Link>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-8 h-px bg-charcoal/30"></div>
            <span className="text-xs tracking-[0.3em] text-charcoal/60 font-medium">BROWSE EVENTS</span>
          </div>
          <div className="flex items-end justify-between">
            <h1 className="text-5xl font-black tracking-tighter text-charcoal">HAPPENING NOW</h1>
            <div className="hidden sm:flex items-center gap-2">
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 border transition-all ${viewMode === "list" ? "bg-charcoal text-cream border-charcoal" : "border-charcoal/20 text-charcoal/50 hover:border-charcoal/40"}`}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <rect x="2" y="2" width="12" height="3" fill="currentColor"/>
                  <rect x="2" y="6.5" width="12" height="3" fill="currentColor"/>
                  <rect x="2" y="11" width="12" height="3" fill="currentColor"/>
                </svg>
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 border transition-all ${viewMode === "grid" ? "bg-charcoal text-cream border-charcoal" : "border-charcoal/20 text-charcoal/50 hover:border-charcoal/40"}`}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <rect x="2" y="2" width="5" height="5" fill="currentColor"/>
                  <rect x="9" y="2" width="5" height="5" fill="currentColor"/>
                  <rect x="2" y="9" width="5" height="5" fill="currentColor"/>
                  <rect x="9" y="9" width="5" height="5" fill="currentColor"/>
                </svg>
              </button>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="grid gap-4">
            {[1, 2, 3].map((i) => <SkeletonCard key={i} />)}
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {events.map((event, idx) => {
              const isLive = new Date(event.startDate) <= new Date() && new Date(event.endDate) >= new Date();
              return (
                <div key={event.id} className="group">
                  <button
                    onClick={() => {
                      setSelectedEvent(event.id === selectedEvent ? "" : event.id);
                      setSelectedRoom("");
                    }}
                    className="w-full text-left border border-charcoal/10 bg-rice p-6 transition-all duration-300 hover:shadow-[4px_4px_0px_0px_rgba(234,225,81,0.3)]"
                  >
                    <div className={`w-full h-1 ${eventColorBar(idx)} mb-4`}></div>
                    <div className="flex items-center gap-2 mb-3">
                      {isLive && <span className="live-badge">LIVE</span>}
                      <span className="text-xs tracking-widest text-charcoal/40 font-mono">{String(idx + 1).padStart(2, "0")}</span>
                    </div>
                    <h3 className="text-lg font-bold text-charcoal mb-2 group-hover:text-yellow-dark transition-colors">{event.title}</h3>
                    <p className="text-sm text-charcoal/60 mb-4 line-clamp-2">{event.description}</p>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs tracking-wider text-charcoal/50">
                      <span>
                        {new Date(event.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                        {" \u2014 "}
                        {new Date(event.endDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      </span>
                      <span>{event.location}</span>
                      <span>{event.sessionCount} SESSIONS</span>
                    </div>
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="grid gap-3">
            {events.map((event, idx) => {
              const isLive = new Date(event.startDate) <= new Date() && new Date(event.endDate) >= new Date();
              const isSelected = selectedEvent === event.id;

              return (
                <div key={event.id}>
                  <button
                    onClick={() => {
                      setSelectedEvent(isSelected ? "" : event.id);
                      setSelectedRoom("");
                    }}
                    className={`w-full text-left transition-all duration-300 overflow-hidden
                      border ${
                        isSelected
                          ? "border-l-4 border-l-yellow bg-yellow/5 border-charcoal/20"
                          : "border-l-4 border-l-transparent border-charcoal/10 bg-rice hover:border-l-charcoal/20 hover:bg-yellow/[0.02]"
                      }`}
                  >
                    <div className="p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="text-xs tracking-widest text-charcoal/40 font-mono shrink-0">
                              {String(idx + 1).padStart(2, "0")}
                            </span>
                            <h3 className="text-xl font-bold text-charcoal truncate">{event.title}</h3>
                            {isLive && <span className="live-badge shrink-0">LIVE</span>}
                          </div>
                          <p className="text-sm text-charcoal/60 mb-3 line-clamp-2">{event.description}</p>
                          <div className="flex flex-wrap gap-x-6 gap-y-1 text-xs tracking-wider text-charcoal/50">
                            <span className="flex items-center gap-1.5">
                              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="text-charcoal/30">
                                <rect x="1" y="2" width="10" height="8" rx="1" stroke="currentColor" strokeWidth="0.8"/>
                                <path d="M1 5H11" stroke="currentColor" strokeWidth="0.8"/>
                              </svg>
                              {new Date(event.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                              {" \u2014 "}
                              {new Date(event.endDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                            </span>
                            <span className="flex items-center gap-1.5">
                              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="text-charcoal/30">
                                <path d="M6 1C3.5 1 1 3 1 6C1 9 3.5 11 6 11C8.5 11 11 9 11 6C11 3 8.5 1 6 1Z" stroke="currentColor" strokeWidth="0.8"/>
                                <path d="M6 3.5V6.5H8.5" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round"/>
                              </svg>
                              {event.location}
                            </span>
                            <span className="flex items-center gap-1.5">
                              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="text-charcoal/30">
                                <path d="M1 4L6 1L11 4V9L6 11L1 9V4Z" stroke="currentColor" strokeWidth="0.8" strokeLinejoin="round"/>
                              </svg>
                              {event.sessionCount} SESSIONS
                            </span>
                          </div>
                        </div>
                        <div className={`text-2xl transition-transform duration-300 shrink-0 ${
                          isSelected ? "rotate-90" : "group-hover:translate-x-1"
                        }`}>
                          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-charcoal/30">
                            <path d="M7 4L13 10L7 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                      </div>
                    </div>
                  </button>

                  <div className={`shoji-panel ${isSelected ? "shoji-panel--open" : ""}`}>
                    <div className="mt-3 mb-3 border border-charcoal/10 bg-paper">
                      <div className="p-6">
                        <div className="grid grid-cols-3 gap-6 mb-6">
                          <div>
                            <div className="text-xs tracking-wider text-charcoal/40 mb-1">DATE</div>
                            <div className="text-sm font-bold text-charcoal">
                              {new Date(event.startDate).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
                            </div>
                          </div>
                          <div>
                            <div className="text-xs tracking-wider text-charcoal/40 mb-1">LOCATION</div>
                            <div className="text-sm font-bold text-charcoal">{event.location}</div>
                          </div>
                          <div>
                            <div className="text-xs tracking-wider text-charcoal/40 mb-1">SESSIONS</div>
                            <div className="text-sm font-bold text-charcoal">{event.sessionCount} TOTAL</div>
                          </div>
                        </div>

                        {roomsData?.data && (
                          <div>
                            <div className="flex items-center gap-2 mb-4">
                              <div className="w-2 h-2 bg-charcoal"></div>
                              <h4 className="text-sm font-bold tracking-wider text-charcoal">ROOMS / TRACKS</h4>
                            </div>
                            <div className="flex gap-2 flex-wrap mb-6">
                              {roomsData.data.map((room) => (
                                <button
                                  key={room.id}
                                  onClick={() => setSelectedRoom(room.name === selectedRoom ? "" : room.name)}
                                  className={`tag-pill cursor-pointer transition-all ${
                                    room.name === selectedRoom
                                      ? "bg-charcoal !text-cream border-charcoal"
                                      : "hover:bg-yellow/30"
                                  }`}
                                >
                                  {room.name.toUpperCase()}
                                </button>
                              ))}
                            </div>

                            {selectedRoom && sessionData?.data && (
                              <div>
                                <div className="flex items-center gap-2 mb-6">
                                  <div className="w-2 h-2 bg-yellow"></div>
                                  <h4 className="text-sm font-bold tracking-wider text-charcoal">
                                    {selectedRoom.toUpperCase()} {" \u2014"} SCHEDULE
                                  </h4>
                                  <span className="text-xs text-charcoal/40 ml-auto">{sessionData.data.length} SESSIONS</span>
                                </div>
                                <div className="space-y-1">
                                  {sessionData.data
                                    .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
                                    .map((session) => (
                                      <TimelineSession key={session.id} session={session} />
                                    ))}
                                </div>
                              </div>
                            )}

                            {selectedRoom && !sessionData?.data && (
                              <div className="border border-dashed border-charcoal/20 p-8 text-center">
                                <p className="text-xs tracking-wider text-charcoal/30">NO SESSIONS IN THIS ROOM</p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="fixed bottom-6 right-6 w-12 h-12 bg-charcoal text-cream flex items-center justify-center hover:bg-yellow hover:text-charcoal transition-all z-40 shadow-lg"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M4 13L10 7L16 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
    </div>
  );
}
