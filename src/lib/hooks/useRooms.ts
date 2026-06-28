import { useQuery, keepPreviousData, UseQueryOptions } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { RoomDto, EventSessionSummaryDto } from "@/types/dto";

export const roomKeys = {
  all: ["rooms"] as const,
  eventRooms: (eventId: string) => [...roomKeys.all, "event", eventId] as const,
  roomSessions: (eventId: string, roomName: string) =>
    [...roomKeys.all, "sessions", eventId, roomName] as const,
};

export function useGetEventRooms(
  eventId: string,
  options?: Omit<UseQueryOptions<{ data: RoomDto[] }>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: roomKeys.eventRooms(eventId),
    queryFn: () => api.getEventRooms(eventId),
    enabled: !!eventId,
    placeholderData: keepPreviousData,
    ...options,
  });
}

export function useGetRoomSessions(
  eventId: string,
  roomName: string,
  options?: Omit<UseQueryOptions<{ data: EventSessionSummaryDto[] }>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: roomKeys.roomSessions(eventId, roomName),
    queryFn: () => api.getRoomSessions(eventId, roomName),
    enabled: !!eventId && !!roomName,
    placeholderData: keepPreviousData,
    ...options,
  });
}