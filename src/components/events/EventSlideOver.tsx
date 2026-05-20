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
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      {/* Panel */}
      <div className="relative w-full max-w-lg bg-cream h-full overflow-y-auto border-l border-charcoal/10 animate-slide-in-right">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-cream/95 backdrop-blur border-b border-charcoal/10 px-6 py-4 flex items-center justify-between">
          <h3 className="font-bold text-lg tracking-tighter text-charcoal truncate pr-4">
            {event.title}
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center border border-charcoal/10 hover:bg-charcoal/5 shrink-0"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 2L12 12M12 2L2 12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="p-6">
          {/* Event Info */}
          <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-paper border border-charcoal/10">
            <div>
              <div className="text-[0.6rem] tracking-wider text-charcoal/40 mb-1">DATES</div>
              <div className="text-xs font-bold text-charcoal">
                {formatDateRange(start, end)}
              </div>
            </div>
            <div>
              <div className="text-[0.6rem] tracking-wider text-charcoal/40 mb-1">LOCATION</div>
              {event.venue ? (
                <>
                  <div className="text-xs font-bold text-charcoal">{event.venue.city}</div>
                  <div className="text-[0.6rem] text-charcoal/40">{event.venue.neighborhood}</div>
                </>
              ) : (
                <div className="text-xs font-bold text-nori">ONLINE</div>
              )}
            </div>
            <div>
              <div className="text-[0.6rem] tracking-wider text-charcoal/40 mb-1">SESSIONS</div>
              <div className="text-xs font-bold text-charcoal">{event.eventSessionCount} TOTAL</div>
            </div>
          </div>

          {event.description && (
            <p className="text-sm text-charcoal/60 mb-6 leading-relaxed">{event.description}</p>
          )}

          {/* Room Selector */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 bg-charcoal" />
              <h4 className="text-sm font-bold tracking-wider text-charcoal">ROOMS</h4>
              <span className="text-[0.6rem] text-charcoal/40 ml-auto">{rooms.length} AVAILABLE</span>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {rooms.length > 0 ? (
                rooms.map((room) => {
                  const isSelected = selectedRoomId === room.id;
                  return (
                    <button
                      key={room.id}
                      onClick={() => setSelectedRoomId(isSelected ? "" : room.id)}
                      className={`shrink-0 p-3 text-left transition-all min-w-[140px] ${
                        isSelected
                          ? "bg-charcoal text-cream"
                          : "bg-rice border border-charcoal/10 text-charcoal hover:bg-yellow/10"
                      }`}
                    >
                      <div className="text-sm font-bold tracking-tighter">{room.name}</div>
                      <div className="text-[0.6rem] mt-1 opacity-60">
                        {room.capacity ? `Capacity: ${room.capacity}` : "Open"}
                      </div>
                    </button>
                  );
                })
              ) : (
                <p className="text-xs text-charcoal/40 p-3">No rooms available</p>
              )}
            </div>
          </div>

          {/* Sessions in Selected Room */}
          {selectedRoomId && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 bg-yellow" />
                <h4 className="text-sm font-bold tracking-wider text-charcoal">SCHEDULE</h4>
                <span className="text-[0.6rem] text-charcoal/40 ml-auto">{sessions.length} SESSIONS</span>
              </div>
              <div className="space-y-2">
                {sessions.length > 0 ? (
                  sessions
                    .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
                    .map((session) => (
                      <SessionCard key={session.id} session={session} compact />
                    ))
                ) : (
                  <div className="p-8 text-center border border-dashed border-charcoal/10">
                    <p className="text-xs text-charcoal/40">No sessions in this room</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {!selectedRoomId && rooms.length > 0 && (
            <div className="p-8 text-center bg-paper border border-dashed border-charcoal/10">
              <p className="text-sm text-charcoal/40 tracking-wider">SELECT A ROOM</p>
              <p className="text-xs text-charcoal/30 mt-1">Choose a room above to view sessions</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}