import { useQuery, keepPreviousData, UseQueryOptions } from "@tanstack/react-query";
import { api, GetEventSessionsParams } from "@/lib/api";
import type { EventSessionSummaryDto, EventSessionDetailDto } from "@/types/dto";

export const eventSessionKeys = {
  all: ["eventSessions"] as const,
  eventSessions: (eventId: string, params?: GetEventSessionsParams) =>
    [...eventSessionKeys.all, "event", eventId, params] as const,
  detail: (id: string) => [...eventSessionKeys.all, "detail", id] as const,
};

export function useGetEventSessions(
  eventId: string,
  params?: GetEventSessionsParams,
  options?: Omit<UseQueryOptions<{ data: EventSessionSummaryDto[] }>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: eventSessionKeys.eventSessions(eventId, params),
    queryFn: () => api.getEventSessions(eventId, params),
    enabled: !!eventId,
    staleTime: 5 * 60 * 1000,
    placeholderData: keepPreviousData,
    ...options,
  });
}

export function useGetEventSession(
  sessionId: string,
  options?: Omit<UseQueryOptions<EventSessionDetailDto>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: eventSessionKeys.detail(sessionId),
    queryFn: () => api.getEventSession(sessionId),
    enabled: !!sessionId,
    staleTime: 2 * 60 * 1000,
    placeholderData: keepPreviousData,
    ...options,
  });
}
