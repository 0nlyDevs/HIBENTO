"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useGetEvents } from "@/lib/hooks/useEvents";
import { useGetEventRooms, useGetRoomSessions } from "@/lib/hooks/useRooms";

export default function EventsPage() {
  const [selectedEvent, setSelectedEvent] = useState<string>("");
  const [selectedRoom, setSelectedRoom] = useState<string>("");

  const { data: eventsData, isLoading } = useGetEvents({
    page: 1,
    limit: 20,
    upcoming: false,
  });

  const { data: roomsData } = useGetEventRooms(selectedEvent);
  const { data: sessionData } = useGetRoomSessions(selectedEvent, selectedRoom);

  const events = eventsData?.data || [];

  return (
    <div className="min-h-screen bg-cream">
      <nav className="border-b border-charcoal/10 bg-cream/95 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <Image
              src="/logo.svg"
              alt="HIBENTO"
              width={28}
              height={28}
              className="group-hover:scale-110 transition-transform"
            />
            <span className="font-bold text-xl tracking-tighter text-charcoal">
              HIBENTO
            </span>
          </Link>

          <div className="flex items-center gap-6">
            <Link href="/events" className="text-sm font-bold tracking-wider text-charcoal border-b-2 border-charcoal">
              EVENTS
            </Link>
            <Link href="/speakers" className="text-sm font-medium tracking-wider text-charcoal/70 hover:text-charcoal transition-colors">
              SPEAKERS
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-8 h-px bg-charcoal/30"></div>
            <span className="text-xs tracking-[0.3em] text-charcoal/60 font-medium">
              BROWSE EVENTS
            </span>
          </div>
          <h1 className="text-5xl font-black tracking-tighter text-charcoal">
            HAPPENING NOW
          </h1>
        </div>

        {isLoading ? (
          <div className="grid gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bento-card animate-pulse">
                <div className="h-6 bg-charcoal/10 w-2/3 mb-4"></div>
                <div className="h-4 bg-charcoal/10 w-full mb-2"></div>
                <div className="h-4 bg-charcoal/10 w-1/2"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid gap-4">
            {events.map((event, idx) => (
              <div key={event.id} className="group">
                <button
                  onClick={() => {
                    setSelectedEvent(event.id === selectedEvent ? "" : event.id);
                    setSelectedRoom("");
                  }}
                  className={`w-full text-left bento-card transition-all duration-300
                    ${selectedEvent === event.id
                      ? 'border-l-4 border-l-yellow bg-yellow/5'
                      : 'border-l-4 border-l-transparent hover:border-l-charcoal/20'
                    }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-xs tracking-widest text-charcoal/40 font-mono">
                          {String(idx + 1).padStart(2, '0')}
                        </span>
                        <h3 className="text-xl font-bold text-charcoal">
                          {event.title}
                        </h3>
                        {new Date(event.startDate) <= new Date() &&
                         new Date(event.endDate) >= new Date() && (
                          <span className="live-badge">LIVE</span>
                        )}
                      </div>

                      <p className="text-sm text-charcoal/60 mb-4 line-clamp-2">
                        {event.description}
                      </p>

                      <div className="flex gap-6 text-xs tracking-wider text-charcoal/50">
                        <span>
                          {new Date(event.startDate).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric'
                          })}
                          {' \u2014 '}
                          {new Date(event.endDate).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric'
                          })}
                        </span>
                        <span>{event.location}</span>
                        <span>{event.sessionCount} SESSIONS</span>
                      </div>
                    </div>

                    <div className={`text-2xl transition-transform duration-300
                      ${selectedEvent === event.id ? 'rotate-90' : 'group-hover:translate-x-1'}`}>
                      {'\u2192'}
                    </div>
                  </div>
                </button>

                {selectedEvent === event.id && (
                  <div className="mt-4 p-8 bg-paper border border-charcoal/10 animate-slide-up">
                    <div className="grid grid-cols-3 gap-6 mb-8">
                      <div>
                        <div className="text-xs tracking-wider text-charcoal/40 mb-1">
                          DATE
                        </div>
                        <div className="text-sm font-bold text-charcoal">
                          {new Date(event.startDate).toLocaleDateString('en-US', {
                            weekday: 'long',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs tracking-wider text-charcoal/40 mb-1">
                          LOCATION
                        </div>
                        <div className="text-sm font-bold text-charcoal">
                          {event.location}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs tracking-wider text-charcoal/40 mb-1">
                          SESSIONS
                        </div>
                        <div className="text-sm font-bold text-charcoal">
                          {event.sessionCount} TOTAL
                        </div>
                      </div>
                    </div>

                    {roomsData?.data && (
                      <div>
                        <div className="flex items-center gap-2 mb-4">
                          <div className="w-2 h-2 bg-charcoal"></div>
                          <h4 className="text-sm font-bold tracking-wider text-charcoal">
                            ROOMS
                          </h4>
                        </div>

                        <div className="flex gap-2 flex-wrap mb-6">
                          {roomsData.data.map((room) => (
                            <button
                              key={room.id}
                              onClick={() => setSelectedRoom(room.name === selectedRoom ? "" : room.name)}
                              className={`tag-pill cursor-pointer transition-all ${
                                room.name === selectedRoom
                                  ? 'bg-charcoal !text-cream border-charcoal'
                                  : 'hover:bg-yellow/30'
                              }`}
                            >
                              {room.name.toUpperCase()}
                            </button>
                          ))}
                        </div>

                        {selectedRoom && sessionData?.data && (
                          <div className="space-y-3">
                            <div className="flex items-center gap-2 mb-4">
                              <div className="w-2 h-2 bg-yellow"></div>
                              <h4 className="text-sm font-bold tracking-wider text-charcoal">
                                {selectedRoom.toUpperCase()} {'\u2014'} SCHEDULE
                              </h4>
                            </div>

                            {sessionData.data.map((session) => (
                              <Link
                                key={session.id}
                                href={`/sessions/${session.id}`}
                                className="block bento-card hover:bg-yellow/10 transition-all"
                              >
                                <div className="flex items-center justify-between">
                                  <div>
                                    <div className="flex items-center gap-3 mb-1">
                                      <span className="text-xs font-mono text-charcoal/50">
                                        {new Date(session.startTime).toLocaleTimeString('en-US', {
                                          hour: '2-digit',
                                          minute: '2-digit'
                                        })}
                                        {' \u2014 '}
                                        {new Date(session.endTime).toLocaleTimeString('en-US', {
                                          hour: '2-digit',
                                          minute: '2-digit'
                                        })}
                                      </span>
                                      {session.isLive && (
                                        <span className="live-badge">LIVE</span>
                                      )}
                                    </div>
                                    <h5 className="font-bold text-charcoal">
                                      {session.title}
                                    </h5>
                                    <p className="text-xs text-charcoal/50 mt-1">
                                      {session.speakers.map(s => s.name).join(' / ')}
                                    </p>
                                  </div>
                                  <div className="text-charcoal/30 text-xl">{'\u2192'}</div>
                                </div>
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
