"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useGetEvents } from "@/lib/hooks/useEvents";
import { useGetEventRooms, useGetRoomSessions } from "@/lib/hooks/useRooms";

const CARD_COLORS = ["#EAE151", "#E8D5B7", "#C4D7B2", "#D4C5E2", "#B8D4E3", "#F2E0DE", "#C17D60", "#D4A9A9"];

function ScrollProgress() {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const handle = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setWidth(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0);
    };
    window.addEventListener("scroll", handle, { passive: true });
    return () => window.removeEventListener("scroll", handle);
  }, []);
  return <div className="scroll-progress" style={{ width: `${width}%` }} />;
}

function SessionCard({ session, compact }: { session: { id: string; title: string; startTime: string; endTime: string; isLive: boolean; speakers: { name: string }[]; room: string }; compact?: boolean }) {
  const start = new Date(session.startTime);
  const end = new Date(session.endTime);
  const now = new Date();
  const isPast = end < now;
  const isUpcoming = start > now;
  const roomColors: Record<string, string> = { "Main Hall": "#EAE151", "Workshop A": "#C4D7B2", "Workshop B": "#D4C5E2", "Breakout 1": "#B8D4E3", "Breakout 2": "#E8D5B7" };
  const roomColor = roomColors[session.room] || "#EAE151";

  return (
    <Link href={`/sessions/${session.id}`} className={`group block transition-all duration-300 card-3d ${compact ? "p-3" : "p-5"}`}
      style={{
        background: "var(--card-bg)",
        border: "1px solid var(--border-color)",
        borderLeft: `3px solid ${roomColor}`,
        boxShadow: session.isLive ? "0 0 20px rgba(234,225,81,0.15)" : "none",
      }}
    >
      <div className="flex items-center gap-2 mb-1.5">
        <span className={compact ? "text-[0.6rem] font-mono" : "text-xs font-mono"} style={{ color: "var(--text-tertiary)" }}>
          {start.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
          {!compact && ` \u2014 ${end.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}`}
        </span>
        {session.isLive && <span className="live-badge--inverted text-[0.6rem] px-1">LIVE</span>}
        {isUpcoming && !session.isLive && <span className="text-[0.6rem] tracking-wider font-bold" style={{ color: "var(--color-sage)" }}>UPCOMING</span>}
        {isPast && !session.isLive && <span className="text-[0.6rem] tracking-wider font-bold" style={{ color: "var(--text-tertiary)" }}>ENDED</span>}
      </div>
      <h4 className={`font-bold transition-colors duration-200 ${compact ? "text-xs" : "text-sm"}`} style={{ color: "var(--text-primary)" }}>{session.title}</h4>
      {!compact && <p className="text-xs mt-1" style={{ color: "var(--text-secondary)" }}>{session.speakers.map(s => s.name).join(" / ")}</p>}
      {compact && <p className="text-[0.6rem] mt-0.5" style={{ color: "var(--text-tertiary)" }}>{session.speakers.map(s => s.name).join(", ")}</p>}
      <div className="flex items-center gap-2 mt-2">
        <div className="w-2 h-2 rounded-full" style={{ background: roomColor }}></div>
        <span className="text-[0.6rem] tracking-wider font-medium" style={{ color: "var(--text-tertiary)" }}>{session.room}</span>
      </div>
    </Link>
  );
}

function EventSlideOver({ event, onClose }: {
  event: { id: string; title: string; description?: string | null; startDate: string; endDate: string; location?: string | null; sessionCount?: number };
  onClose: () => void;
}) {
  const [selectedRoom, setSelectedRoom] = useState<string>("");
  const { data: roomsData } = useGetEventRooms(event.id);
  const { data: sessionData } = useGetRoomSessions(event.id, selectedRoom);
  const rooms = roomsData?.data || [];
  const sessions = sessionData?.data || [];

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.4)" }} onClick={onClose}></div>
      <div className="relative w-full max-w-lg animate-slide-in-right overflow-y-auto" style={{ background: "#FFFDF7", borderLeft: "1px solid rgba(40,40,40,0.1)", height: "100vh" }}>
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4" style={{ background: "rgba(255, 253, 247, 0.92)", backdropFilter: "blur(16px)", borderBottom: "1px solid rgba(40,40,40,0.1)" }}>
          <h3 className="font-bold tracking-tighter text-lg" style={{ color: "#282828" }}>{event.title}</h3>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center border" style={{ borderColor: "rgba(40,40,40,0.1)" }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 2L12 12M12 2L2 12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>
          </button>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-3 gap-4 mb-6 p-4" style={{ background: "#F5EDE0", border: "1px solid rgba(40,40,40,0.1)" }}>
            <div>
              <div className="text-[0.6rem] tracking-wider mb-1" style={{ color: "rgba(40,40,40,0.4)" }}>DATES</div>
              <div className="text-xs font-bold" style={{ color: "#282828" }}>
                {new Date(event.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                {" \u2014 "}{new Date(event.endDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
              </div>
            </div>
            <div>
              <div className="text-[0.6rem] tracking-wider mb-1" style={{ color: "rgba(40,40,40,0.4)" }}>LOCATION</div>
              <div className="text-xs font-bold" style={{ color: "#282828" }}>{event.location || "TBD"}</div>
            </div>
            <div>
              <div className="text-[0.6rem] tracking-wider mb-1" style={{ color: "rgba(40,40,40,0.4)" }}>SESSIONS</div>
              <div className="text-xs font-bold" style={{ color: "#282828" }}>{event.sessionCount || 0} TOTAL</div>
            </div>
          </div>
          {event.description && <p className="text-sm mb-6" style={{ color: "rgba(40,40,40,0.6)" }}>{event.description}</p>}

          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2" style={{ background: "#282828" }}></div>
              <h4 className="text-sm font-bold tracking-wider" style={{ color: "#282828" }}>ROOMS / TRACKS</h4>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2" style={{ scrollbarWidth: "none" }}>
              {rooms.length > 0 ? rooms.map((room) => {
                const color = CARD_COLORS[rooms.indexOf(room) % CARD_COLORS.length];
                const isSelected = selectedRoom === room.name;
                return (
                  <button key={room.id} onClick={() => setSelectedRoom(room.name === selectedRoom ? "" : room.name)}
                    className="shrink-0 p-4 text-left transition-all duration-300 min-w-[150px] relative overflow-hidden"
                    style={{
                      background: isSelected ? "#282828" : "#FEFCF7",
                      border: `1px solid ${isSelected ? "transparent" : "rgba(40,40,40,0.1)"}`,
                      color: isSelected ? "#FBF7F0" : "#282828",
                    }}
                  >
                    <div className="text-lg font-bold tracking-tighter">{room.name}</div>
                    <div className="text-[0.6rem] mt-1 tracking-wider" style={{ opacity: 0.6 }}>{room.name.toUpperCase().includes("WORKSHOP") ? "HANDS-ON" : room.name.toUpperCase().includes("KEYNOTE") ? "KEYNOTE" : "SESSION"}</div>
                  </button>
                );
              }) : (
                <div className="p-4 text-xs" style={{ color: "rgba(40,40,40,0.4)", border: "1px dashed rgba(40,40,40,0.1)" }}><p>NO ROOMS AVAILABLE</p></div>
              )}
            </div>
          </div>

          {selectedRoom && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2" style={{ background: "#EAE151" }}></div>
                <h4 className="text-sm font-bold tracking-wider" style={{ color: "#282828" }}>{selectedRoom.toUpperCase()} SCHEDULE</h4>
                <span className="text-[0.6rem] ml-auto" style={{ color: "rgba(40,40,40,0.4)" }}>{sessions.length} SESSIONS</span>
              </div>
              <div className="space-y-2">
                {sessions.length > 0 ? sessions.sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()).map((session) => (
                  <SessionCard key={session.id} session={session} compact />
                )) : (
                  <div className="p-8 text-center" style={{ border: "1px dashed rgba(40,40,40,0.1)" }}>
                    <div className="w-12 h-12 mx-auto mb-4 flex items-center justify-center" style={{ background: "#F5EDE0" }}>
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><rect x="2" y="3" width="16" height="14" stroke="currentColor" strokeWidth="1.2"/><path d="M2 7H18" stroke="currentColor" strokeWidth="1.2"/></svg>
                    </div>
                    <p className="text-xs tracking-wider" style={{ color: "rgba(40,40,40,0.4)" }}>NO SESSIONS IN THIS ROOM</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {!selectedRoom && (
            <div className="p-8 text-center relative" style={{ background: "#F5EDE0" }}>
              <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center" style={{ background: "rgba(234,225,81,0.15)" }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="#EAE151"/></svg>
              </div>
              <p className="text-sm font-medium tracking-wider" style={{ color: "rgba(40,40,40,0.6)" }}>SELECT A ROOM</p>
              <p className="text-xs mt-1" style={{ color: "rgba(40,40,40,0.4)" }}>Choose a room above to view its session schedule</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function EventsPage() {
  const [slideOverEvent, setSlideOverEvent] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { data: eventsData, isLoading: queryLoading } = useGetEvents({ page: 1, limit: 20, upcoming: false });
  const events = eventsData?.data || [];

  useEffect(() => {
    if (!queryLoading) { const t = setTimeout(() => setIsLoading(false), 300); return () => clearTimeout(t); }
  }, [queryLoading]);

  const dateGroups = events.reduce((acc, event) => {
    const date = new Date(event.startDate).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
    if (!acc[date]) acc[date] = [];
    acc[date].push(event);
    return acc;
  }, {} as Record<string, typeof events>);
  const dates = Object.keys(dateGroups);

  return (
    <div className="min-h-screen bg-cream relative overflow-hidden">
      <div className="absolute inset-0 bg-grid pointer-events-none"></div>
      <ScrollProgress />
      <nav className="sticky top-0 z-50" style={{ background: "rgba(255, 253, 247, 0.92)", backdropFilter: "blur(16px)", borderBottom: "1px solid rgba(40,40,40,0.1)" }}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <Image src="/logo.svg" alt="HIBENTO" width={28} height={28} className="group-hover:scale-110 transition-transform duration-300" />
            <span className="font-bold text-xl tracking-tighter" style={{ color: "#282828" }}>HIBENTO</span>
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/events" className="text-sm font-bold tracking-wider relative" style={{ color: "#282828" }}>
              EVENTS
              <span className="absolute -bottom-1 left-0 w-full h-0.5" style={{ background: "#EAE151" }}></span>
            </Link>
            <Link href="/speakers" className="text-sm font-medium tracking-wider transition-colors duration-200" style={{ color: "rgba(40,40,40,0.6)" }} onMouseEnter={e => e.currentTarget.style.color = "#282828"} onMouseLeave={e => e.currentTarget.style.color = "rgba(40,40,40,0.6)"}>SPEAKERS</Link>
          </div>
        </div>
      </nav>

  

      <div className="max-w-7xl mx-auto px-6 py-12 lg:py-16">
        <div className="mb-12 lg:mb-16">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-8 h-px" style={{ background: "rgba(40,40,40,0.4)" }}></div>
            <span className="text-xs tracking-[0.3em] font-medium" style={{ color: "rgba(40,40,40,0.6)" }}>BROWSE EVENTS</span>
          </div>
          <div className="flex items-end justify-between">
            <h1 className="text-5xl font-black tracking-tighter text-charcoal">HAPPENING NOW</h1>
          </div>
        </div>

        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-[200px]">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="p-6" style={{ background: "#FEFCF7", border: "1px solid rgba(40,40,40,0.1)" }}>
                <div className="skeleton--brand h-4 w-16 mb-4"></div>
                <div className="skeleton h-5 w-2/3 mb-2"></div>
                <div className="skeleton h-4 w-full mb-1"></div>
                <div className="skeleton h-4 w-4/5"></div>
              </div>
            ))}
          </div>
        ) : events.length > 0 ? (
          <div>
            {events.length > 0 && (
              <div className="mb-12 lg:mb-16 relative overflow-hidden card-3d" style={{ background: "#FEFCF7", border: "1px solid rgba(40,40,40,0.1)" }}>
                <div className="absolute inset-0 grain-overlay pointer-events-none"></div>
                <div className="grid lg:grid-cols-2">
                  <div className="p-8 lg:p-12 flex flex-col justify-center" style={{ background: "rgba(234,225,81,0.12)" }}>
                    <span className="text-[0.6rem] tracking-[0.3em] font-medium mb-3" style={{ color: "rgba(40,40,40,0.4)" }}>FEATURED EVENT</span>
                    <h2 className="text-2xl lg:text-4xl font-black tracking-tighter mb-4" style={{ color: "#282828" }}>{events[0].title}</h2>
                    <p className="text-sm mb-6 line-clamp-3" style={{ color: "rgba(40,40,40,0.6)" }}>{events[0].description}</p>
                    <button onClick={() => setSlideOverEvent(events[0])} className="btn-primary self-start text-xs">VIEW SESSIONS</button>
                  </div>
                  <div className="p-8 lg:p-12 relative overflow-hidden" style={{ background: "#F5EDE0" }}>
                    <div className="absolute inset-0 hex-bg pointer-events-none"></div>
                    <div className="relative z-10">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-4" style={{ background: "#FEFCF7", border: "1px solid rgba(40,40,40,0.1)" }}>
                          <div className="text-2xl font-black" style={{ color: "#282828" }}>{events[0].sessionCount}</div>
                          <div className="text-[0.6rem] tracking-wider mt-1" style={{ color: "rgba(40,40,40,0.4)" }}>SESSIONS</div>
                        </div>
                        <div className="p-4" style={{ background: "rgba(196,215,178,0.15)", border: "1px solid rgba(40,40,40,0.1)" }}>
                          <div className="text-2xl font-black" style={{ color: "#282828" }}>{events[0].location || "TBD"}</div>
                          <div className="text-[0.6rem] tracking-wider mt-1" style={{ color: "rgba(40,40,40,0.4)" }}>LOCATION</div>
                        </div>
                        <div className="col-span-2 p-4" style={{ background: "#282828" }}>
                          <div className="flex items-center gap-3">
                            <span className="text-lg font-bold tracking-tighter" style={{ color: "#FBF7F0" }}>
                              {new Date(events[0].startDate).toLocaleDateString("en-US", { month: "long", day: "numeric" })}
                            </span>
                            <span className="text-xs" style={{ color: "rgba(251,247,240,0.5)" }}>
                              &mdash; {new Date(events[0].endDate).toLocaleDateString("en-US", { month: "long", day: "numeric" })}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {dates.map((date) => {
              const groupEvents = dateGroups[date];
              return (
                <div key={date} id={`date-${date}`} className="mb-12 lg:mb-16">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="text-lg font-bold tracking-tighter" style={{ color: "#282828" }}>{date}</div>
                    <div className="flex-1 h-px" style={{ background: "rgba(40,40,40,0.1)" }}></div>
                    <span className="text-[0.6rem] tracking-wider" style={{ color: "rgba(40,40,40,0.4)" }}>{groupEvents.length} EVENTS</span>
                  </div>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {groupEvents.map((event: any, idx: number) => {
                      const isLive = new Date(event.startDate) <= new Date() && new Date(event.endDate) >= new Date();
                      const color = CARD_COLORS[idx % CARD_COLORS.length];
                      const isTall = idx % 3 === 1;
                      const isEditorial = idx % 4 === 0;
                      return (
                        <div key={event.id} className={`${isTall ? "lg:row-span-2" : ""} stagger-${(idx % 6) + 1}`}>
                          <button onClick={() => setSlideOverEvent(event)}
                            className="w-full text-left group relative overflow-hidden card-3d transition-all duration-300"
                            style={{ background: "#FEFCF7", border: "1px solid rgba(40,40,40,0.1)", minHeight: isTall ? "320px" : "220px" }}
                          >
                            <div className="absolute top-0 left-0 w-full h-1" style={{ background: color }}></div>
                            <div className="absolute inset-0 grain-overlay pointer-events-none"></div>
                            <div className="p-5 lg:p-6 flex flex-col h-full relative">
                              <div className="flex items-center gap-2 mb-3">
                                {isLive && <span className="live-badge--inverted text-[0.6rem] px-1.5">LIVE</span>}
                                <span className="text-[0.6rem] font-mono tracking-widest" style={{ color: "rgba(40,40,40,0.4)" }}>{String(idx + 1).padStart(2, "0")}</span>
                              </div>
                              {isEditorial ? (
                                <>
                                  <span className="text-[0.6rem] tracking-widest font-bold mb-2" style={{ color }}>EDITORIAL</span>
                                  <h3 className="font-bold text-lg leading-tight" style={{ color: "#282828" }}>{event.title}</h3>
                                  <div className="mt-2 text-xs line-clamp-3 italic" style={{ color: "rgba(40,40,40,0.6)" }}>{event.description}</div>
                                  <div className="mt-auto pt-4 flex items-center gap-3 text-[0.6rem] tracking-wider" style={{ color: "rgba(40,40,40,0.4)" }}>
                                    <span>{new Date(event.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                                    <span className="w-px h-3" style={{ background: "rgba(40,40,40,0.1)" }}></span>
                                    <span>{event.location}</span>
                                    <span>{event.sessionCount} SESSIONS</span>
                                  </div>
                                </>
                              ) : (
                                <>
                                  <h3 className="font-bold transition-colors duration-200 mb-2" style={{ color: "#282828", fontSize: isTall ? "1.25rem" : "1rem" }}>{event.title}</h3>
                                  <p className="text-xs line-clamp-2 mb-4" style={{ color: "rgba(40,40,40,0.6)" }}>{event.description}</p>
                                  <div className="mt-auto flex flex-wrap gap-x-4 gap-y-1 text-[0.6rem] tracking-wider" style={{ color: "rgba(40,40,40,0.4)" }}>
                                    <span>{new Date(event.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })} &mdash; {new Date(event.endDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                                    <span>{event.location}</span>
                                    <span>{event.sessionCount} SESSIONS</span>
                                  </div>
                                </>
                              )}
                            </div>
                            <div className="absolute bottom-3 right-3 w-8 h-8 flex items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100" style={{ background: color }}>
                              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 7H11M11 7L7 3M11 7L7 11" stroke="#282828" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                            </div>
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-16 text-center" style={{ border: "1px dashed rgba(40,40,40,0.1)" }}>
            <div className="w-24 h-24 mx-auto mb-6 flex items-center justify-center relative" style={{ background: "rgba(234,225,81,0.1)" }}>
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none"><rect x="4" y="6" width="24" height="20" stroke="currentColor" strokeWidth="1.5"/><path d="M4 12H28" stroke="currentColor" strokeWidth="1.5"/><circle cx="16" cy="20" r="3" stroke="currentColor" strokeWidth="1.5"/></svg>
              <div className="absolute -top-2 -right-2 w-6 h-6 border" style={{ borderColor: "rgba(40,40,40,0.1)" }}></div>
            </div>
            <p className="text-lg font-bold tracking-tighter mb-2" style={{ color: "#282828" }}>NO EVENTS FOUND</p>
            <p className="text-sm" style={{ color: "rgba(40,40,40,0.6)" }}>Check back soon for upcoming events</p>
          </div>
        )}
      </div>

      {slideOverEvent && <EventSlideOver event={slideOverEvent} onClose={() => setSlideOverEvent(null)} />}

      <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="fixed bottom-6 right-6 w-12 h-12 flex items-center justify-center z-40 transition-all duration-200 hover:scale-110"
        style={{ background: "#282828", color: "#FFFDF7" }}
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M4 13L10 7L16 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </button>
    </div>
  );
}
