"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useGetEvents, useGetEvent, useGetEventRooms, useGetRoomSessions } from "@/lib/hooks";
import { useState } from "react";

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

  if (eventsLoading) return <div className="p-8">loading events...</div>;
  if (eventsError) return <div className="p-8 text-red-500">error: {eventsError.message}</div>;

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">events</h1>

      {/* events list */}
      <div className="grid gap-4 mb-8">
        {events?.data.map((event) => (
          <div
            key={event.id}
            className="p-4 border rounded-lg cursor-pointer hover:bg-gray-50"
            onClick={() => setSelectedEventId(event.id)}
          >
            <h2 className="text-xl font-semibold">{event.title}</h2>
            <p className="text-gray-600">{event.description}</p>
            <p className="text-sm text-gray-500 mt-2">
              {event.sessionCount} sessions • {new Date(event.startDate).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>

      {/* event details */}
      {selectedEventId && eventDetail && (
        <div className="mt-8 p-4 border rounded-lg">
          <h2 className="text-2xl font-bold mb-4">{eventDetail.title}</h2>
          <p className="text-gray-700 mb-2">{eventDetail.description}</p>
          <p className="text-sm text-gray-500">
            {new Date(eventDetail.startDate).toLocaleDateString()} -{" "}
            {new Date(eventDetail.endDate).toLocaleDateString()}
          </p>
          <p className="text-sm text-gray-500">{eventDetail.location}</p>

          {/* rooms */}
          <h3 className="text-xl font-semibold mt-4 mb-2">rooms</h3>
          {roomsLoading ? (
            <p>loading rooms...</p>
          ) : (
            <div className="flex gap-2 flex-wrap">
              {rooms?.data.map((room) => (
                <button
                  key={room.id}
                  onClick={() => setSelectedRoom(room.name)}
                  className="px-3 py-1 bg-blue-100 rounded hover:bg-blue-200"
                >
                  {room.name}
                </button>
              ))}
            </div>
          )}

          {/* room sessions */}
          {selectedRoom && roomSessions && (
            <div className="mt-4">
              <h3 className="text-xl font-semibold mb-2">sessions in {selectedRoom}</h3>
              {roomSessionsLoading ? (
                <p>loading sessions...</p>
              ) : (
                roomSessions.data.map((session) => (
                  <div key={session.id} className="p-3 border rounded mb-2">
                    <p className="font-medium">{session.title}</p>
                    <p className="text-sm text-gray-600">
                      {new Date(session.startTime).toLocaleTimeString()} -{" "}
                      {new Date(session.endTime).toLocaleTimeString()}
                    </p>
                    <p className="text-sm">
                      speakers: {session.speakers.map((s) => s.name).join(", ")}
                    </p>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      )}
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