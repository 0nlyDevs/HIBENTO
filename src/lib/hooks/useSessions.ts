import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { api, GetEventSessionsParams } from "@/lib/api";
import type { SessionSummaryDto, SessionDetailDto } from "@/types/dto";

export const sessionKeys = {
  all: ["sessions"] as const,
  eventSessions: (eventId: string, params?: GetEventSessionsParams) =>
    [...sessionKeys.all, "event", eventId, params] as const,
  detail: (id: string) => [...sessionKeys.all, "detail", id] as const,
};

export function useGetEventSessions(
  eventId: string,
  params?: GetEventSessionsParams,
  options?: Omit<UseQueryOptions<{ data: SessionSummaryDto[] }>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: sessionKeys.eventSessions(eventId, params),
    queryFn: () => api.getEventSessions(eventId, params),
    enabled: !!eventId,
    ...options,
  });
}

export function useGetSession(
  sessionId: string,
  options?: Omit<UseQueryOptions<SessionDetailDto>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: sessionKeys.detail(sessionId),
    queryFn: () => api.getSession(sessionId),
    enabled: !!sessionId,
    ...options,
  });
}