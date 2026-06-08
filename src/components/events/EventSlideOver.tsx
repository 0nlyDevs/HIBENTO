"use client";

import { useState } from "react";
import type { EventSummaryDto } from "@/types/dto";
import { useGetEventRooms, useGetRoomSessions } from "@/lib/hooks/useRooms";
import { SessionCard } from "@/components/sessions/SessionCard";
import { formatDateRange } from "@/lib/utils/dates";

interface EventSlideOverProps {
  event: EventSummaryDto;
  onClose: () => void;
}

export function EventSlideOver({ event, onClose }: EventSlideOverProps) {
  const [selectedRoomId, setSelectedRoomId] = useState<string>("");
  const { data: roomsData } = useGetEventRooms(event.id);
  const { data: sessionsData } = useGetRoomSessions(event.id, selectedRoomId);

  const rooms = roomsData?.data || [];
  const sessions = sessionsData?.data || [];

  const start = new Date(event.startDate);
  const end = new Date(event.endDate);

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Panel */}
      <div
        className="relative w-full max-w-lg h-full overflow-y-auto animate-slide-up"
        style={{
          background: "hsl(260 9% 16%)",
          borderLeft: "1px dashed rgba(255,255,255,0.18)",
        }}
      >
        {/* Header */}
        <div
          className="sticky top-0 z-10 px-6 py-4 flex items-center justify-between backdrop-blur-md"
          style={{
            background: "#222222F0",
            borderBottom: "1px dashed rgba(255,255,255,0.12)",
          }}
        >
          <h3 className="font-display font-bold text-lg text-ivory truncate pr-4">
            {event.title}
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-ivory/40 hover:text-ivory hover:bg-white/10 transition-all shrink-0"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 2L12 12M12 2L2 12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="p-6">
          {/* Event Info */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="card-glass squircle p-4">
              <div className="label-mono text-ivory/40 mb-1">DATES</div>
              <div className="text-xs font-bold text-ivory">{formatDateRange(start, end)}</div>
            </div>
            <div className="card-glass squircle p-4">
              <div className="label-mono text-ivory/40 mb-1">LOCATION</div>
              {event.venue ? (
                <>
                  <div className="text-xs font-bold text-ivory">{event.venue.city}</div>
                  <div className="text-[0.6rem] text-ivory/40">{event.venue.neighborhood}</div>
                </>
              ) : (
                <div className="text-xs font-bold text-chartreuse">ONLINE</div>
              )}
            </div>
            <div className="card-glass squircle p-4">
              <div className="label-mono text-ivory/40 mb-1">SESSIONS</div>
              <div className="text-xs font-bold text-ivory">{event.eventSessionCount} TOTAL</div>
            </div>
          </div>

          {event.description && (
            <p className="text-sm text-ivory/50 mb-6 leading-relaxed">{event.description}</p>
          )}

          {/* Room Selector */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-4">
              <p className="label-mono text-chartreuse">§ ROOMS</p>
              <div className="flex-1 h-px bg-white/10" />
              <span className="label-mono text-ivory/30">{rooms.length} AVAILABLE</span>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {rooms.length > 0 ? (
                rooms.map((room) => {
                  const isSelected = selectedRoomId === room.id;
                  return (
                    <button
                      key={room.id}
                      onClick={() => setSelectedRoomId(isSelected ? "" : room.id)}
                      className="shrink-0 p-3 text-left transition-all min-w-[140px] squircle"
                      style={{
                        background: isSelected ? "hsl(59 73% 52%)" : "#222222E6",
                        border: isSelected
                          ? "1px solid transparent"
                          : "1px dashed rgba(255,255,255,0.18)",
                        color: isSelected ? "hsl(260 9% 18%)" : "hsl(84 64% 98% / 0.7)",
                        boxShadow: isSelected
                          ? "0 0 0 1px hsl(59 73% 52% / 0.4), 0 8px 20px -8px hsl(59 73% 52% / 0.5)"
                          : "none",
                      }}
                    >
                      <div className="text-sm font-bold tracking-tighter">{room.name}</div>
                      <div className="label-mono mt-1 opacity-60">
                        {room.capacity ? `Capacity: ${room.capacity}` : "Open"}
                      </div>
                    </button>
                  );
                })
              ) : (
                <p className="label-mono text-ivory/30 p-3">No rooms available</p>
              )}
            </div>
          </div>

          {/* Sessions in Selected Room */}
          {selectedRoomId && (
            <div>
              <div className="flex items-center gap-3 mb-4">
                <p className="label-mono text-chartreuse">§ SCHEDULE</p>
                <div className="flex-1 h-px bg-white/10" />
                <span className="label-mono text-ivory/30">{sessions.length} SESSIONS</span>
              </div>
              <div className="space-y-2">
                {sessions.length > 0 ? (
                  sessions
                    .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
                    .map((session) => (
                      <SessionCard key={session.id} session={session} compact />
                    ))
                ) : (
                  <div className="card-glass squircle-lg p-8 text-center">
                    <p className="label-mono text-ivory/30">No sessions in this room</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {!selectedRoomId && rooms.length > 0 && (
            <div className="card-glass squircle-lg p-8 text-center">
              <p className="label-mono text-ivory/40">SELECT A ROOM</p>
              <p className="text-xs text-ivory/30 mt-1">Choose a room above to view sessions</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
