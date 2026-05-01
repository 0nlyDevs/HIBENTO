import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { api, GetEventsParams, PaginatedResponse } from "@/lib/api";
import type { EventSummaryDto, EventDetailDto } from "@/types/dto";

export const eventKeys = {
  all: ["events"] as const,
  lists: () => [...eventKeys.all, "list"] as const,
  list: (params?: GetEventsParams) => [...eventKeys.lists(), params] as const,
  details: () => [...eventKeys.all, "detail"] as const,
  detail: (id: string) => [...eventKeys.details(), id] as const,
};

export function useGetEvents(
  params?: GetEventsParams,
  options?: Omit<UseQueryOptions<PaginatedResponse<EventSummaryDto>>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: eventKeys.list(params),
    queryFn: () => api.getEvents(params),
    ...options,
  });
}

export function useGetEvent(
  eventId: string,
  options?: Omit<UseQueryOptions<EventDetailDto>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: eventKeys.detail(eventId),
    queryFn: () => api.getEvent(eventId),
    enabled: !!eventId,
    ...options,
  });
}