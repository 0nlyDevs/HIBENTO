import type {
  EventSummaryDto,
  EventDetailDto,
  SessionSummaryDto,
  SessionDetailDto,
  RoomDto,
  SpeakerSummaryDto,
  SpeakerProfileDto,
} from "@/types/dto";
import { API_BASE_URL } from "./constants";

// ============= Types =============

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
}

export interface GetEventSessionsParams {
  room?: string;
  liveOnly?: boolean;
}

// ============= HTTP helper =============

const DEFAULT_TIMEOUT_MS = 15_000;

// src/lib/api.ts - Update the http function
async function http<T>(
  path: string,
  init?: RequestInit & { timeout?: number },
): Promise<T> {
  const timeout = init?.timeout ?? DEFAULT_TIMEOUT_MS;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);

  try {
    const res = await fetch(`${API_BASE_URL}${path}`, {
      ...init,
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
        // ignore JSON parse errors
      }
      throw new Error(errorMessage);
    }

    const text = await res.text();
    if (!text) return {} as T;
    
    try {
      return JSON.parse(text) as T;
    } catch (parseError) {
      console.error("Failed to parse response:", text);
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
// ============= API surface =============

export const api = {
  // Speakers
// src/lib/api.ts - Update the getSpeakers function
getSpeakers: (params?: { page?: number; limit?: number }) => {
  const searchParams = new URLSearchParams();
  if (params?.page) searchParams.set("page", params.page.toString());
  if (params?.limit) searchParams.set("limit", params.limit.toString());

  const query = searchParams.toString();
  return http<{ data: SpeakerSummaryDto[] }>(
    `/api/speakers${query ? `?${query}` : ""}`
  );
},

  getSpeaker: (speakerId: string) => 
    http<SpeakerProfileDto>(`/api/speakers/${speakerId}`),

  // Events
  // Events
  getEvents: (params?: GetEventsParams) => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set("page", params.page.toString());
    if (params?.limit) searchParams.set("limit", params.limit.toString());
    if (params?.upcoming !== undefined)
      searchParams.set("upcoming", params.upcoming.toString());

    const query = searchParams.toString();
    return http<PaginatedResponse<EventSummaryDto>>(
      `/api/events${query ? `?${query}` : ""}`,
    );
  },

  getEvent: (eventId: string) => http<EventDetailDto>(`/api/events/${eventId}`),

  // Sessions
  getEventSessions: (eventId: string, params?: GetEventSessionsParams) => {
    const searchParams = new URLSearchParams();
    if (params?.room) searchParams.set("room", params.room);
    if (params?.liveOnly)
      searchParams.set("liveOnly", params.liveOnly.toString());

    const query = searchParams.toString();
    return http<{ data: SessionSummaryDto[] }>(
      `/api/events/${eventId}/sessions${query ? `?${query}` : ""}`,
    );
  },

  getSession: (sessionId: string) =>
    http<SessionDetailDto>(`/api/sessions/${sessionId}`),

  // Rooms
  getEventRooms: (eventId: string) =>
    http<{ data: RoomDto[] }>(`/api/events/${eventId}/rooms`),

  getRoomSessions: (eventId: string, roomName: string) =>
    http<{ data: SessionSummaryDto[] }>(
      `/api/events/${eventId}/rooms/${encodeURIComponent(roomName)}/sessions`,
    ),
};

// ============= Helpers =============

export function isEventLive(event: {
  startDate: string;
  endDate: string;
}): boolean {
  const now = new Date();
  return now >= new Date(event.startDate) && now <= new Date(event.endDate);
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
