export const API = {
  VENUES: "/api/venues",
  VENUE: (id: string) => `/api/venues/${id}`,
  SPEAKERS: "/api/speakers",
  SPEAKER: (id: string) => `/api/speakers/${id}`,
  EVENTS: "/api/events",
  EVENT: (id: string) => `/api/events/${id}`,
  EVENT_SESSIONS: (eventId: string) => `/api/events/${eventId}/event-sessions`,
  EVENT_SESSION: (sessionId: string) => `/api/event-sessions/${sessionId}`,
  EVENT_ROOMS: (eventId: string) => `/api/events/${eventId}/rooms`,
  ROOM_SESSIONS: (eventId: string, roomId: string) => `/api/events/${eventId}/rooms/${roomId}/sessions`,
  QUESTIONS: (sessionId: string) => `/api/event-sessions/${sessionId}/questions`,
  UPVOTE: (questionId: string) => `/api/questions/${questionId}/upvote`,
  REGISTRATIONS: (sessionId: string) => `/api/event-sessions/${sessionId}/registrations`,
} as const;

export const TIMEOUT_MS = 15_000;

export const REVALIDATE = {
  NEVER: 0,
  MINUTE: 60,
  HOUR: 3600,
  DAY: 86400,
} as const;
