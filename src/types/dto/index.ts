// ==================== PAGINATION DTO ====================
export interface PaginationDto {
  page: number;
  limit: number;
  total: number;
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
  sessionCount: number;
}

export interface ExternalLinkDto {
  type: string;
  url: string;
}

// ==================== EVENT DTOs ====================
export interface EventSummaryDto {
  id: string;
  title: string;
  description?: string | null;
  startDate: string;
  endDate: string;
  location?: string | null;
  sessionCount: number;
}

export interface EventDetailDto {
  id: string;
  title: string;
  description?: string | null;
  startDate: string;
  endDate: string;
  location?: string | null;
  sessions: SessionSummaryDto[];
}

// ==================== SESSION DTOs ====================
export interface SessionSummaryDto {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  room: string;
  isLive: boolean;
  speakers: SpeakerRefDto[];
  questionCount: number;
}

export interface SessionDetailDto {
  id: string;
  title: string;
  description?: string | null;
  startTime: string;
  endTime: string;
  room: string;
  capacity?: number | null;
  isLive: boolean;
  speakers: SpeakerDetailDto[];
  questions?: QuestionDto[];
}

// ==================== ROOM DTOs ====================
export interface RoomDto {
  id: string;
  name: string;
}

// ==================== SPEAKER PROFILE DTO ====================
export interface SpeakerProfileDto extends SpeakerDetailDto {
  sessions: SpeakerSessionDto[];
}

export interface SpeakerSessionDto {
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