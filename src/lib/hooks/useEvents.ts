import { useQuery, keepPreviousData, UseQueryOptions } from "@tanstack/react-query";
import { api, GetEventsParams, PaginatedResponse } from "@/lib/api";
import type { EventSummaryDto, EventDetailDto, SearchResultDto } from "@/types/dto";

export const eventKeys = {
  all: ["events"] as const,
  lists: () => [...eventKeys.all, "list"] as const,
  list: (params?: GetEventsParams) => [...eventKeys.lists(), params] as const,
  details: () => [...eventKeys.all, "detail"] as const,
  detail: (id: string) => [...eventKeys.details(), id] as const,
  search: (q: string) => [...eventKeys.all, "search", q] as const,
};

export function useGetEvents(
  params?: GetEventsParams,
  options?: Omit<UseQueryOptions<PaginatedResponse<EventSummaryDto>>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: eventKeys.list(params),
    queryFn: () => api.getEvents(params),
    staleTime: 5 * 60 * 1000,
    placeholderData: keepPreviousData,
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
    staleTime: 5 * 60 * 1000,
    placeholderData: keepPreviousData,
    ...options,
  });
}

export function useSearchEvents(
  query: string,
  params?: { city?: string; dateFrom?: string; dateTo?: string; status?: string },
  options?: Omit<UseQueryOptions<{ data: SearchResultDto[] }>, "queryKey" | "queryFn">,
) {
  return useQuery({
    queryKey: eventKeys.search(`${query}|${JSON.stringify(params || {})}`),
    queryFn: () => api.searchEvents(query, params),
    enabled: query.length > 0,
    staleTime: 30 * 1000,
    ...options,
  });
}
