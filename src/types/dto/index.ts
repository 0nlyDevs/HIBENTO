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
  eventId: string;
  title: string;
  description: string | null;
  eventName: string;
  startTime: string;
  endTime: string;
  room: string;
  neighborhood: string | null;
  isLive: boolean;
  speakers: { id: string; name: string }[];
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
  eventId: string;
  title: string;
  description: string | null;
  startTime: string;
  endTime: string;
  room: RoomDto | null;
  isOnline: boolean;
  isLive: boolean;
  speakers: SpeakerRefDto[];
  questionCount: number;
  capacity: number | null;
}

export interface EventSessionDetailDto {
  id: string;
  eventId: string;
  title: string;
  description: string | null;
  startTime: string;
  endTime: string;
  room: RoomDto | null;
  venue: VenueDto | null;
  capacity: number | null;
  isOnline: boolean;
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

export interface UpvoteResponseDto {
  success: boolean;
  upvotes: number;
}

export interface SearchResultDto {
  id: string;
  title: string;
  description: string | null;
  startDate: string;
  endDate: string;
  isOnline: boolean;
  type: "event" | "session" | "speaker";
  score: number;
  match: {
    venue: VenueDto | null;
    speakers: SpeakerRefDto[];
  } | null;
}

export interface DuplicateCheckResponseDto {
  isDuplicate: boolean;
  similarity: number;
  similarQuestion: QuestionDto | null;
}

export interface PaginationDto {
  page: number;
  limit: number;
  total: number;
}

