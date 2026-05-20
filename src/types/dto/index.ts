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

export interface RoomDto {
  id: string;
  name: string;
  capacity: number | null;
  venueId: string;
}

export interface SpeakerRefDto {
  id: string;
  name: string;
  avatar: string | null;
  bio: string | null;
}

export interface SpeakerDetailDto {
  id: string;
  name: string;
  avatar: string | null;
  bio: string | null;
  externalLinks?: ExternalLinkDto[];
}

export interface SpeakerSummaryDto {
  id: string;
  name: string;
  avatar: string | null;
  bio: string | null;
  eventSessionCount: number;
}

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

export interface ExternalLinkDto {
  type: string;
  url: string;
}

export interface EventSummaryDto {
  id: string;
  title: string;
  description: string | null;
  startDate: string;
  endDate: string;
  venue: VenueDto | null;
  isOnline: boolean;
  eventSessionCount: number;
}

export interface EventDetailDto {
  id: string;
  title: string;
  description: string | null;
  startDate: string;
  endDate: string;
  venue: VenueDto | null;
  isOnline: boolean;
  eventSessions: EventSessionSummaryDto[];
}

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
  description: string | null;
  startTime: string;
  endTime: string;
  room: RoomDto;
  capacity: number | null;
  isLive: boolean;
  speakers: SpeakerDetailDto[];
  questions: QuestionDto[];
}

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

export interface PaginationDto {
  page: number;
  limit: number;
  total: number;
}