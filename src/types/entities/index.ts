import type { Event, Room, Speaker, SpeakerExternalLink, Session, SessionSpeaker, Question } from "@/generated/prisma/client";

// Re-export Prisma generated types
export type {
  Event,
  Room,
  Speaker,
  SpeakerExternalLink,
  Session,
  SessionSpeaker,
  Question,
};

// Extended types with relations
export type EventWithRelations = Event & {
  rooms?: Room[];
  sessions?: Session[];
  _count?: {
    sessions: number;
  };
};

export type RoomWithRelations = Room & {
  event?: Event;
  sessions?: Session[];
};

export type SpeakerWithRelations = Speaker & {
  links?: SpeakerExternalLink[];
  sessions?: (SessionSpeaker & {
    session?: Session & {
      event?: Pick<Event, "id" | "title">;
    };
  })[];
  _count?: {
    sessions: number;
  };
};

export type SessionWithRelations = Session & {
  event?: Event;
  room?: Room;
  speakers?: (SessionSpeaker & {
    speaker?: Speaker;
  })[];
  questions?: Question[];
  _count?: {
    questions: number;
  };
};

export type QuestionWithRelations = Question & {
  session?: Session & {
    event?: Pick<Event, "id" | "title">;
  };
};
