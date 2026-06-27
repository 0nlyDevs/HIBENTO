export const ROUTES = {
  HOME: "/",
  EVENTS: "/events",
  SPEAKERS: "/speakers",
  FAVORITES: "/favorites",
  SESSION_DETAIL: (id: string) => `/sessions/detail/${id}`,
  SESSION_LIVE: (id: string) => `/sessions/${id}/live`,
  SPEAKER_DETAIL: (id: string) => `/speakers/${id}`,
  EVENT_DETAIL: (id: string) => `/events/${id}`,
} as const;
