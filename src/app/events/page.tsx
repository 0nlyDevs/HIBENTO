"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useGetEvents, useGetEvent, useGetEventRooms, useGetRoomSessions } from "@/lib/hooks";
import { useState, useEffect } from "react";

const queryClient = new QueryClient();

function EventsPageContent() {
  const [selectedEventId, setSelectedEventId] = useState<string>("");
  const [selectedRoom, setSelectedRoom] = useState<string>("");

  const { data: events, isLoading: eventsLoading, error: eventsError } = useGetEvents({
    page: 1,
    limit: 10,
    upcoming: false,
  });

  const { data: eventDetail } = useGetEvent(selectedEventId);
  const { data: rooms, isLoading: roomsLoading } = useGetEventRooms(selectedEventId);
  const { data: roomSessions, isLoading: roomSessionsLoading } = useGetRoomSessions(
    selectedEventId,
    selectedRoom
  );

  useEffect(() => {
    if (rooms?.data && rooms.data.length > 0 && !selectedRoom) {
      setSelectedRoom(rooms.data[0].name);
    }
  }, [rooms, selectedRoom]);

  useEffect(() => {
    setSelectedRoom("");
  }, [selectedEventId]);

  if (eventsLoading) {
    return (
      <div className="min-h-screen bg-[#f5f0e8] flex items-center justify-center font-mono">
        <div className="text-center">
          <div className="inline-block w-2 h-2 bg-[#2c1810] animate-pulse mr-1"></div>
          <div className="inline-block w-2 h-2 bg-[#2c1810] animate-pulse delay-100 mr-1"></div>
          <div className="inline-block w-2 h-2 bg-[#2c1810] animate-pulse delay-200"></div>
          <p className="mt-4 text-[#2c1810] text-sm tracking-wider">LOADING DATA...</p>
        </div>
      </div>
    );
  }

  if (eventsError) {
    return (
      <div className="min-h-screen bg-[#f5f0e8] flex items-center justify-center font-mono">
        <div className="text-center border-2 border-[#8b3a3a] p-8 bg-[#f5e6d3]">
          <p className="text-[#8b3a3a] text-sm tracking-wider mb-2">⚠ ERROR ⚠</p>
          <p className="text-[#2c1810] text-xs">{eventsError.message}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-1 bg-[#2c1810] text-[#f5f0e8] text-xs tracking-wider hover:bg-[#1a0f0a] transition-colors"
          >
            RETRY
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f0e8] font-mono">
      {/* header */}
      <div className="border-b-2 border-[#2c1810] bg-[#e8dccc]">
        <div className="max-w-6xl mx-auto px-8 py-6">
          <div className="flex items-center gap-4">
            <div className="text-2xl">◉</div>
            <h1 className="text-3xl font-bold tracking-tighter text-[#2c1810]">HIBENTO</h1>
            <div className="flex-1"></div>
            <div className="text-xs text-[#2c1810] tracking-wider">
              {events?.pagination?.total || 0} RECORDS
            </div>
          </div>
          <div className="mt-2 text-xs text-[#4a3020] tracking-wider">
            {">"} LOADED {events?.data.length || 0} OF {events?.pagination?.total || 0} EVENTS
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8 py-8">
        {/* events grid */}
        <div className="grid gap-3 mb-10">
          {events?.data.map((event, idx) => (
            <div
              key={event.id}
              onClick={() => setSelectedEventId(event.id)}
              className={`
                border border-[#2c1810] bg-[#f5f0e8] cursor-pointer
                transition-all duration-200 hover:bg-[#e8dccc]
                ${selectedEventId === event.id ? 'border-l-8 bg-[#e8dccc]' : 'border-l-2'}
              `}
            >
              <div className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs text-[#4a3020] tracking-wider">
                        [{String(idx + 1).padStart(2, '0')}]
                      </span>
                      <h2 className="text-lg font-bold tracking-tight text-[#2c1810]">
                        {event.title}
                      </h2>
                    </div>
                    <p className="text-sm text-[#4a3020] leading-relaxed mb-2">
                      {event.description?.substring(0, 120)}...
                    </p>
                    <div className="flex gap-4 text-xs text-[#4a3020] tracking-wider">
                      <span>📅 {new Date(event.startDate).toLocaleDateString()}</span>
                      <span>📍 {event.location || 'TBD'}</span>
                      <span>🎤 {event.sessionCount} SESSIONS</span>
                    </div>
                  </div>
                  <div className="text-2xl text-[#2c1810] opacity-50">
                    {selectedEventId === event.id ? '⌄' : '›'}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* event detail panel */}
        {selectedEventId && eventDetail && (
          <div className="mt-8 border-t-2 border-[#2c1810] pt-8">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-xl font-bold tracking-tight text-[#2c1810]">
                {">"} EVENT DETAILS
              </h3>
              <button
                onClick={() => {
                  setSelectedEventId("");
                  setSelectedRoom("");
                }}
                className="text-xs text-[#4a3020] hover:text-[#2c1810] tracking-wider"
              >
                [CLOSE]
              </button>
            </div>

            <div className="border border-[#2c1810] bg-[#e8dccc] p-6 mb-8">
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div>
                  <div className="text-xs text-[#4a3020] tracking-wider mb-1">TITLE</div>
                  <div className="text-lg font-bold text-[#2c1810]">{eventDetail.title}</div>
                </div>
                <div>
                  <div className="text-xs text-[#4a3020] tracking-wider mb-1">LOCATION</div>
                  <div className="text-md text-[#2c1810]">{eventDetail.location || 'NOT SPECIFIED'}</div>
                </div>
                <div>
                  <div className="text-xs text-[#4a3020] tracking-wider mb-1">DATE RANGE</div>
                  <div className="text-md text-[#2c1810]">
                    {new Date(eventDetail.startDate).toLocaleDateString()} — {new Date(eventDetail.endDate).toLocaleDateString()}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-[#4a3020] tracking-wider mb-1">DESCRIPTION</div>
                  <div className="text-sm text-[#2c1810]">{eventDetail.description || 'NO DESCRIPTION'}</div>
                </div>
              </div>

              {/* rooms section */}
              <div className="border-t border-[#2c1810] pt-6">
                <h4 className="text-sm font-bold tracking-wider text-[#2c1810] mb-3">
                  {">"} ROOMS
                </h4>
                {roomsLoading ? (
                  <div className="flex gap-2">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="w-24 h-8 bg-[#d4c8b0] animate-pulse"></div>
                    ))}
                  </div>
                ) : (
                  <div className="flex gap-2 flex-wrap">
                    {rooms?.data.map((room) => (
                      <button
                        key={room.id}
                        onClick={() => setSelectedRoom(room.name)}
                        className={`
                          px-3 py-1 text-xs tracking-wider border border-[#2c1810]
                          transition-colors font-mono
                          ${selectedRoom === room.name ? 'bg-[#2c1810] text-[#f5f0e8]' : 'bg-transparent text-[#2c1810] hover:bg-[#d4c8b0]'}
                        `}
                      >
                        {room.name.toUpperCase()}
                      </button>
                    ))}
                  </div>
                )}

                {/* room sessions */}
                {selectedRoom && roomSessions && (
                  <div className="mt-6">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-2 h-2 bg-[#2c1810]"></div>
                      <h4 className="text-sm font-bold tracking-wider text-[#2c1810]">
                        SESSIONS IN {selectedRoom.toUpperCase()}
                      </h4>
                    </div>
                    {roomSessionsLoading ? (
                      <div className="space-y-2">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="h-16 bg-[#d4c8b0] animate-pulse"></div>
                        ))}
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {roomSessions.data.map((session) => (
                          <div key={session.id} className="border border-[#2c1810] p-3 bg-[#f5f0e8]">
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-xs text-[#4a3020]">
                                    {new Date(session.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                  </span>
                                  <span className="text-xs text-[#4a3020]">→</span>
                                  <span className="text-xs text-[#4a3020]">
                                    {new Date(session.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                  </span>
                                  {session.isLive && (
                                    <span className="text-xs bg-[#2c1810] text-[#f5f0e8] px-2 py-0.5 tracking-wider">
                                      LIVE
                                    </span>
                                  )}
                                </div>
                                <p className="font-bold text-[#2c1810] mb-1">{session.title}</p>
                                <p className="text-xs text-[#4a3020]">
                                  SPEAKERS: {session.speakers.map((s) => s.name).join(", ")}
                                </p>
                              </div>
                              <div className="text-[#2c1810] opacity-30 text-xl">⌄</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* footer */}
      <div className="border-t-2 border-[#2c1810] bg-[#e8dccc] mt-10">
        <div className="max-w-6xl mx-auto px-8 py-4">
          <div className="text-xs text-[#4a3020] tracking-wider text-center">
            {">"} HIBENTO v1.0 {"<"}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function EventsPage() {
  return (
    <QueryClientProvider client={queryClient}>
      <EventsPageContent />
    </QueryClientProvider>
  );
}