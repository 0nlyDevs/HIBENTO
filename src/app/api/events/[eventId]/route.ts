import { NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";
import type { EventDetailDto, SessionSummaryDto, SpeakerRefDto } from "@/types";
import { isValidUUID } from "@/lib/utils/validation";
import { getSessionStatus } from "@/lib/utils/getSessionStatus";

type SessionWithSpeakersAndCount = {
  id: string;
  title: string;
  startTime: Date;
  endTime: Date;
  room: string;
  speakers: Array<{
    speaker: {
      id: string;
      name: string;
    };
  }>;
  _count: {
    questions: number;
  };
};

type EventWithSessions = {
  id: string;
  title: string;
  description: string | null;
  startDate: Date;
  endDate: Date;
  location: string | null;
  sessions: SessionWithSpeakersAndCount[];
};

function transformToSessionSummary(session: SessionWithSpeakersAndCount): SessionSummaryDto {
  return {
    id: session.id,
    title: session.title,
    startTime: session.startTime.toISOString(),
    endTime: session.endTime.toISOString(),
    room: session.room,
    isLive: getSessionStatus(session) === "live",
    speakers: session.speakers.map((sessionSpeaker): SpeakerRefDto => ({
      id: sessionSpeaker.speaker.id,
      name: sessionSpeaker.speaker.name
    })),
    questionCount: session._count.questions
  };
}

export async function GET(
  req: Request,
  context: RouteContext<"/api/events/[eventId]">
): Promise<NextResponse<EventDetailDto | { error: string }>> {
  try {
    const { eventId } = await context.params;

    if (!isValidUUID(eventId)) {
      return NextResponse.json(
        { error: "invalid event id format" },
        { status: 400 }
      );
    }

    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: {
        sessions: {
          include: {
            speakers: {
              include: {
                speaker: true
              }
            },
            _count: {
              select: { questions: true }
            }
          },
          orderBy: {
            startTime: "asc" as const
          }
        }
      }
    }) as EventWithSessions | null;

    if (!event) {
      return NextResponse.json(
        { error: "event not found" },
        { status: 404 }
      );
    }

    const response: EventDetailDto = {
      id: event.id,
      title: event.title,
      description: event.description,
      startDate: event.startDate.toISOString(),
      endDate: event.endDate.toISOString(),
      location: event.location,
      sessions: event.sessions.map(transformToSessionSummary)
    };

    return NextResponse.json(response, { status: 200 });
  } catch (err) {
    console.error("[GET /api/events/:eventId] error:", err);
    return NextResponse.json(
      { error: "internal server error" },
      { status: 500 }
    );
  }
}