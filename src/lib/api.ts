import type {
  EventSummaryDto,
  EventDetailDto,
  EventSessionSummaryDto,
  EventSessionDetailDto,
  RoomDto,
  SpeakerSummaryDto,
  SpeakerProfileDto,
  VenueDto,
  VenueDetailDto,
  QuestionDto,
  UpvoteResponseDto,
  SearchResultDto,
} from "@/types/dto";
import { API_BASE_URL } from "./constants";

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
}

export interface GetEventsParams {
  page?: number;
  limit?: number;
  upcoming?: boolean;
  status?: "all" | "live" | "upcoming" | "ended";
  city?: string;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface GetEventSessionsParams {
  room?: string;
  liveOnly?: boolean;
}

const DEFAULT_TIMEOUT_MS = 15_000;

async function http<T>(
  path: string,
  init?: RequestInit & { timeout?: number },
): Promise<T> {
  const timeout = init?.timeout ?? DEFAULT_TIMEOUT_MS;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);

  const isGet = !init?.method || init.method === "GET";

  try {
    const res = await fetch(`${API_BASE_URL}${path}`, {
      ...init,
      cache: isGet ? (init?.cache ?? "no-store") : undefined,
      headers: {
        "Content-Type": "application/json",
        ...(init?.headers || {}),
      },
      signal: controller.signal,
    });

    if (!res.ok) {
      let errorMessage = `${res.status} ${res.statusText}`;
      try {
        const body = await res.json();
        if (body?.error) errorMessage = body.error;
      } catch {
      }
      throw new Error(errorMessage);
    }

    const text = await res.text();
    if (!text) return {} as T;
    
    try {
      return JSON.parse(text) as T;
    } catch {
      throw new Error("Invalid JSON response from server");
    }
  } catch (err) {
    if (err instanceof Error && err.name === "AbortError") {
      throw new Error(`Request timed out after ${timeout}ms`);
    }
    throw err;
  } finally {
    clearTimeout(timer);
  }
}

export const api = {
  getVenues: () => http<{ data: VenueDto[] }>("/api/venues"),
  getVenue: (venueId: string) => http<VenueDetailDto>(`/api/venues/${venueId}`),

  getSpeakers: (params?: { page?: number; limit?: number }) => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set("page", params.page.toString());
    if (params?.limit) searchParams.set("limit", params.limit.toString());
    const query = searchParams.toString();
    return http<{ data: SpeakerSummaryDto[]; pagination: { page: number; limit: number; total: number } }>(
      `/api/speakers${query ? `?${query}` : ""}`
    );
  },
  getSpeaker: (speakerId: string) => 
    http<SpeakerProfileDto>(`/api/speakers/${speakerId}`),

  getEvents: (params?: GetEventsParams) => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set("page", params.page.toString());
    if (params?.limit) searchParams.set("limit", params.limit.toString());
    if (params?.upcoming !== undefined)
      searchParams.set("upcoming", params.upcoming.toString());
    if (params?.status && params.status !== "all")
      searchParams.set("status", params.status);
    if (params?.city)
      searchParams.set("city", params.city);
    if (params?.search)
      searchParams.set("search", params.search);
    if (params?.dateFrom)
      searchParams.set("dateFrom", params.dateFrom);
    if (params?.dateTo)
      searchParams.set("dateTo", params.dateTo);

    const query = searchParams.toString();
    return http<PaginatedResponse<EventSummaryDto>>(
      `/api/events${query ? `?${query}` : ""}`,
    );
  },
  getEvent: (eventId: string) => http<EventDetailDto>(`/api/events/${eventId}`),

  getEventSessions: (eventId: string, params?: GetEventSessionsParams) => {
    const searchParams = new URLSearchParams();
    if (params?.room) searchParams.set("room", params.room);
    if (params?.liveOnly)
      searchParams.set("liveOnly", params.liveOnly.toString());

    const query = searchParams.toString();
    return http<{ data: EventSessionSummaryDto[] }>(
      `/api/events/${eventId}/event-sessions${query ? `?${query}` : ""}`,
    );
  },
  getEventSession: (sessionId: string) =>
    http<EventSessionDetailDto>(`/api/event-sessions/${sessionId}`),

  getEventRooms: (eventId: string) =>
    http<{ data: RoomDto[] }>(`/api/events/${eventId}/rooms`),
  getRoomSessions: (eventId: string, roomId: string) =>
    http<{ data: EventSessionSummaryDto[] }>(`/api/events/${eventId}/rooms/${roomId}/sessions`),

  getQuestions: (eventSessionId: string) =>
    http<{ data: QuestionDto[] }>(`/api/event-sessions/${eventSessionId}/questions`),
  createQuestion: (eventSessionId: string, content: string, authorName?: string) =>
    http<QuestionDto>(`/api/event-sessions/${eventSessionId}/questions`, {
      method: "POST",
      body: JSON.stringify({ content, authorName }),
    }),
  upvoteQuestion: (questionId: string, visitorId: string) =>
    http<UpvoteResponseDto>(`/api/questions/${questionId}/upvote`, {
      method: "POST",
      body: JSON.stringify({ visitorId }),
    }),

  getLiveSessionCount: () => http<{ count: number }>("/api/live/count"),

  searchEvents: (q: string) =>
    http<{ data: SearchResultDto[] }>(`/api/ai/search?q=${encodeURIComponent(q)}`),
};

export function isEventLive(event: {
  startDate: string;
  endDate: string;
}): boolean {
  const now = new Date();
  return now >= new Date(event.startDate) && now <= new Date(event.endDate);
}

export function isEventSessionLive(session: {
  startTime: string;
  endTime: string;
}): boolean {
  const now = new Date();
  return now >= new Date(session.startTime) && now <= new Date(session.endTime);
}

export function formatEventDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function formatSessionTime(dateString: string): string {
  return new Date(dateString).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function getVenueDisplayName(venue: VenueDto): string {
  return `${venue.neighborhood}, ${venue.city} - ${venue.name}`;
}