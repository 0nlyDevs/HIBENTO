import type { VenueDto, RoomDto, SpeakerRefDto, EventSessionSummaryDto, QuestionDto } from "@/types/dto";
import { getEventSessionStatus } from "./getEventSessionStatus";

export function toVenueDto(venue: {
  id: string;
  name: string;
  city: string;
  neighborhood: string;
  totalRooms: number;
} | null): VenueDto | null {
  if (!venue) return null;
  return {
    id: venue.id,
    name: venue.name,
    city: venue.city,
    neighborhood: venue.neighborhood,
    totalRooms: venue.totalRooms,
  };
}

export function toRoomDto(room: {
  id: string;
  name: string;
  capacity: number | null;
  venueId: string;
} | null): RoomDto | null {
  if (!room) return null;
  return {
    id: room.id,
    name: room.name,
    capacity: room.capacity,
    venueId: room.venueId,
  };
}

export function toSpeakerRef(speaker: {
  id: string;
  name: string;
  avatarUrl: string | null;
  bio: string | null;
}): SpeakerRefDto {
  return {
    id: speaker.id,
    name: speaker.name,
    avatar: speaker.avatarUrl,
    bio: speaker.bio,
  };
}

export function toSpeakerRefs(speakers: Array<{
  speaker: {
    id: string;
    name: string;
    avatarUrl: string | null;
    bio: string | null;
  };
}>): SpeakerRefDto[] {
  return speakers.map((s) => toSpeakerRef(s.speaker));
}

export function toEventSessionSummary(params: {
  session: {
    id: string;
    title: string;
    description: string | null;
    startTime: Date;
    endTime: Date;
    room: {
      id: string;
      name: string;
      capacity: number | null;
      venueId: string;
    } | null;
    speakers: Array<{
      speaker: {
        id: string;
        name: string;
        avatarUrl: string | null;
        bio: string | null;
      };
    }>;
    _count: { questions: number };
  };
  eventIsOnline: boolean;
}): EventSessionSummaryDto {
  return {
    id: params.session.id,
    title: params.session.title,
    description: params.session.description,
    startTime: params.session.startTime.toISOString(),
    endTime: params.session.endTime.toISOString(),
    room: toRoomDto(params.session.room),
    isOnline: params.eventIsOnline || params.session.room === null,
    isLive: getEventSessionStatus(params.session) === "live",
    speakers: toSpeakerRefs(params.session.speakers),
    questionCount: params.session._count.questions,
  };
}

export function toQuestionDto(question: {
  id: string;
  content: string;
  authorName: string;
  upvotes: number;
  createdAt: Date;
}): QuestionDto {
  return {
    id: question.id,
    content: question.content,
    authorName: question.authorName,
    upvotes: question.upvotes,
    createdAt: question.createdAt.toISOString(),
  };
}
