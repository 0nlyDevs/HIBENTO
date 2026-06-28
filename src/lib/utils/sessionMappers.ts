import type {
  EventSessionDetailDto,
  EventSessionSummaryDto,
  SpeakerEventSessionDto,
} from "@/types/dto";
import type { ScheduleSession } from "@/types/schedule";

export function fromEventSessionSummary(
  dto: EventSessionSummaryDto,
  eventId: string,
): ScheduleSession {
  return {
    id: dto.id,
    title: dto.title,
    description: dto.description ?? "",
    startTime: new Date(dto.startTime),
    endTime: new Date(dto.endTime),
    venue: dto.isOnline ? "Online" : dto.room?.name ?? "TBD",
    speakers: dto.speakers.map((s) => ({
      id: s.id,
      name: s.name,
      image: s.avatar || undefined,
      bio: s.bio,
    })),
    isLive: dto.isLive,
    eventId,
    isOnline: dto.isOnline,
  };
}

export function fromEventSessionDetail(dto: EventSessionDetailDto): ScheduleSession {
  return {
    id: dto.id,
    title: dto.title,
    description: dto.description ?? "",
    startTime: new Date(dto.startTime),
    endTime: new Date(dto.endTime),
    venue: dto.isOnline ? "Online" : dto.room?.name ?? "TBD",
    speakers: dto.speakers.map((s) => ({
      id: s.id,
      name: s.name,
      image: s.avatar || undefined,
      bio: s.bio,
    })),
    isLive: dto.isLive,
    eventId: dto.eventId,
    isOnline: dto.isOnline,
  };
}

export function fromSpeakerEventSession(dto: SpeakerEventSessionDto): ScheduleSession {
  return {
    id: dto.id,
    title: dto.title,
    description: dto.description ?? "",
    startTime: new Date(dto.startTime),
    endTime: new Date(dto.endTime),
    venue: dto.room || "TBD",
    speakers: dto.speakers.map((s) => ({
      id: s.id,
      name: s.name,
    })),
    isLive: dto.isLive,
    eventId: "",
    subtitle: dto.eventName,
  };
}
