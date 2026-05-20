import type {
  PaginationDto,
  EventSummaryDto,
  EventDetailDto,
  RoomDto,
  SpeakerSummaryDto,
  SpeakerProfileDto,
  QuestionDto,
  QuestionCreateRequestDto,
  UpvoteResponseDto,
  FavoriteResponseDto,
  EventSessionSummaryDto,
  EventSessionDetailDto,
} from "@/types/dto";

// ==================== COMMON RESPONSES ====================
export interface ApiErrorResponse {
  error: string;
}

// ==================== EVENTS API ====================
export interface GetEventsQuery {
  page?: string;
  limit?: string;
  upcoming?: string;
}

export interface GetEventsResponse {
  data: EventSummaryDto[];
  pagination: PaginationDto;
}

export interface GetEventParams {
  eventId: string;
}

// Use type alias instead of empty interface
export type GetEventResponse = EventDetailDto;

// ==================== SESSIONS API ====================
export interface GetSessionsQuery {
  room?: string;
  liveOnly?: string;
}

export interface GetSessionsResponse {
  data: EventSessionSummaryDto[];
}

export interface GetSessionParams {
  sessionId: string;
}

export type GetSessionResponse = EventSessionDetailDto;

export interface GetEventSessionsParams {
  eventId: string;
}

export interface GetEventSessionsQuery {
  room?: string;
  liveOnly?: string;
}

// ==================== ROOMS API ====================
export interface GetRoomsParams {
  eventId: string;
}

export interface GetRoomsResponse {
  data: RoomDto[];
}

export interface GetRoomSessionsParams {
  eventId: string;
  roomName: string;
}

// ==================== SPEAKERS API ====================
export interface GetSpeakersQuery {
  page?: string;
  limit?: string;
}

export interface GetSpeakersResponse {
  data: SpeakerSummaryDto[];
  pagination: PaginationDto;
}

export interface GetSpeakerParams {
  speakerId: string;
}

export type GetSpeakerResponse = SpeakerProfileDto;

// ==================== QUESTIONS API ====================
export interface GetQuestionsParams {
  sessionId: string;
}

export interface GetQuestionsResponse {
  data: QuestionDto[];
}

export interface CreateQuestionParams {
  sessionId: string;
}

export type CreateQuestionBody = QuestionCreateRequestDto;

export type CreateQuestionResponse = QuestionDto;

export interface UpvoteQuestionParams {
  questionId: string;
}

export type UpvoteQuestionResponse = UpvoteResponseDto;

// ==================== FAVORITES API ====================
export interface FavoriteSessionParams {
  sessionId: string;
}

export type FavoriteSessionResponse = FavoriteResponseDto;