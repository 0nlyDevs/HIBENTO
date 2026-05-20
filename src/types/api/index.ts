import type {
  EventSummaryDto,
  EventDetailDto,
  EventSessionSummaryDto,
  EventSessionDetailDto,
  RoomDto,
  SpeakerSummaryDto,
  SpeakerProfileDto,
  QuestionDto,
  PaginationDto,
} from "@/types/dto";

const API_BASE = "/api";

async function fetchApi<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: "Request failed" }));
    throw new Error(error.error || `HTTP ${res.status}`);
  }

  return res.json();
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationDto;
}

export const api = {
  // Events
  getEvents: (params?: {
    page?: number;
    limit?: number;
    city?: string;
    status?: "live" | "upcoming" | "ended" | "all";
  }) => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set("page", String(params.page));
    if (params?.limit) searchParams.set("limit", String(params.limit));
    if (params?.city) searchParams.set("city", params.city);
    if (params?.status && params.status !== "all") searchParams.set("status", params.status);
    const qs = searchParams.toString();
    return fetchApi<PaginatedResponse<EventSummaryDto>>(`/events${qs ? `?${qs}` : ""}`);
  },

  getEvent: (eventId: string) =>
    fetchApi<EventDetailDto>(`/events/${eventId}`),

  // Sessions
  getEventSessions: (eventId: string, params?: { room?: string; liveOnly?: boolean }) => {
    const searchParams = new URLSearchParams();
    if (params?.room) searchParams.set("roomId", params.room);
    if (params?.liveOnly) searchParams.set("liveOnly", "true");
    const qs = searchParams.toString();
    return fetchApi<{ data: EventSessionSummaryDto[] }>(
      `/events/${eventId}/sessions${qs ? `?${qs}` : ""}`
    );
  },

  getSession: (sessionId: string) =>
    fetchApi<EventSessionDetailDto>(`/event-sessions/${sessionId}`),

  // Rooms
  getEventRooms: (eventId: string) =>
    fetchApi<{ data: RoomDto[] }>(`/events/${eventId}/rooms`),

  getRoomSessions: (eventId: string, roomId: string) =>
    fetchApi<{ data: EventSessionSummaryDto[] }>(
      `/events/${eventId}/rooms/${roomId}/sessions`
    ),

  // Speakers
  getSpeakers: (params?: { page?: number; limit?: number }) => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set("page", String(params.page));
    if (params?.limit) searchParams.set("limit", String(params.limit));
    const qs = searchParams.toString();
    return fetchApi<PaginatedResponse<SpeakerSummaryDto>>(`/speakers${qs ? `?${qs}` : ""}`);
  },

  getSpeaker: (speakerId: string) =>
    fetchApi<SpeakerProfileDto>(`/speakers/${speakerId}`),

  // Questions
  getQuestions: (sessionId: string) =>
    fetchApi<{ data: QuestionDto[] }>(`/event-sessions/${sessionId}/questions`),

  createQuestion: (sessionId: string, data: { content: string; authorName?: string }) =>
    fetchApi<QuestionDto>(`/event-sessions/${sessionId}/questions`, {
      method: "POST",
      body: JSON.stringify(data),
    }),
};