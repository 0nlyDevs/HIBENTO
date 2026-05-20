// ==================== VENUE DTOs ====================
export interface VenueDto {
  id: string;
  name: string;
  city: string;
  neighborhood: string;
  totalRooms: number;
}

export interface VenueDetailDto extends VenueDto {
  rooms: RoomDto[];
}

// ==================== EVENT DTOs ====================
export interface EventSummaryDto {
  id: string;
  title: string;
  description?: string | null;
  startDate: string;
  endDate: string;
  venue: VenueDto;
  eventSessionCount: number;
}

export interface EventDetailDto {
  id: string;
  title: string;
  description?: string | null;
  startDate: string;
  endDate: string;
  venue: VenueDto;
  eventSessions: EventSessionSummaryDto[];
}

// ==================== EVENT SESSION DTOs ====================
export interface EventSessionSummaryDto {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  room: RoomDto;
  isLive: boolean;
  speakers: SpeakerRefDto[];
  questionCount: number;
}

export interface EventSessionDetailDto {
  id: string;
  title: string;
  description?: string | null;
  startTime: string;
  endTime: string;
  room: RoomDto;
  capacity?: number | null;
  isLive: boolean;
  speakers: SpeakerDetailDto[];
  questions?: QuestionDto[];
}

// ==================== ROOM DTOs ====================
export interface RoomDto {
  id: string;
  name: string;
  capacity?: number | null;
  venueId: string;
}

export interface RoomDetailDto extends RoomDto {
  venue: VenueDto;
  currentEventSessions?: EventSessionSummaryDto[];
}

// ==================== SPEAKER DTOs ====================
export interface SpeakerRefDto {
  id: string;
  name: string;
}

export interface SpeakerDetailDto {
  id: string;
  name: string;
  avatar?: string | null;
  bio?: string | null;
  externalLinks?: ExternalLinkDto[];
}

export interface SpeakerSummaryDto {
  id: string;
  name: string;
  avatar?: string | null;
  bio?: string | null;
  eventSessionCount: number;
}

export interface ExternalLinkDto {
  type: string;
  url: string;
}

// ==================== SPEAKER PROFILE DTO ====================
export interface SpeakerProfileDto extends SpeakerDetailDto {
  eventSessions: SpeakerEventSessionDto[];
}

export interface SpeakerEventSessionDto {
  id: string;
  title: string;
  eventName: string;
  startTime: string;
  room: string;
}

// ==================== QUESTION DTOs ====================
export interface QuestionDto {
  id: string;
  content: string;
  authorName: string;
  upvotes: number;
  createdAt: string;
}

export interface QuestionCreateRequestDto {
  content: string;
  authorName?: string;
}

export interface UpvoteResponseDto {
  success: boolean;
  upvotes: number;
}

export interface FavoriteResponseDto {
  success: boolean;
  message: string;
}

// ==================== PAGINATION DTO ====================
export interface PaginationDto {
  page: number;
  limit: number;
  total: number;
}