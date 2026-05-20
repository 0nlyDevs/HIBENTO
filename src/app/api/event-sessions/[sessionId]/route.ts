import { NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";
import type {
  EventSessionDetailDto,
  SpeakerDetailDto,
  QuestionDto,
  RoomDto,
} from "@/types/dto";
import { isValidUUID } from "@/lib/utils/validation";
import { getEventSessionStatus } from "@/lib/utils/getEventSessionStatus";

type EventSessionWithDetails = {
  id: string;
  title: string;
  description: string | null;
  startTime: Date;
  endTime: Date;
  capacity: number | null;
  room: {
    id: string;
    name: string;
    capacity: number | null;
    venueId: string;
  };
  speakers: Array<{
    speaker: {
      id: string;
      name: string;
      avatarUrl: string | null;
      bio: string | null;
    };
  }>;
  questions: Array<{
    id: string;
    content: string;
    authorName: string;
    upvotes: number;
    createdAt: Date;
  }>;
};

export async function GET(
  request: Request,
  context: RouteContext<"/api/event-sessions/[sessionId]">
): Promise<NextResponse<EventSessionDetailDto | { error: string }>> {
  try {
    const { sessionId } = await context.params;

    if (!isValidUUID(sessionId)) {
      return NextResponse.json(
        { error: "Invalid session ID format" },
        { status: 400 }
      );
    }

    const session = (await prisma.eventSession.findUnique({
      where: { id: sessionId },
      include: {
        room: true,
        speakers: {
          include: {
            speaker: true,
          },
        },
        questions: {
          orderBy: {
            upvotes: "desc",
          },
        },
      },
    })) as EventSessionWithDetails | null;

    if (!session) {
      return NextResponse.json(
        { error: "Session not found" },
        { status: 404 }
      );
    }

    const isLive = getEventSessionStatus(session) === "live";

    const roomDto: RoomDto = {
      id: session.room.id,
      name: session.room.name,
      capacity: session.room.capacity,
      venueId: session.room.venueId,
    };

    const response: EventSessionDetailDto = {
      id: session.id,
      title: session.title,
      description: session.description,
      startTime: session.startTime.toISOString(),
      endTime: session.endTime.toISOString(),
      room: roomDto,
      capacity: session.capacity,
      isLive: isLive,
      speakers: session.speakers.map(
        (sessionSpeaker): SpeakerDetailDto => ({
          id: sessionSpeaker.speaker.id,
          name: sessionSpeaker.speaker.name,
          avatar: sessionSpeaker.speaker.avatarUrl,
          bio: sessionSpeaker.speaker.bio,
        })
      ),
      questions: isLive
        ? session.questions.map(
            (question): QuestionDto => ({
              id: question.id,
              content: question.content,
              authorName: question.authorName,
              upvotes: question.upvotes,
              createdAt: question.createdAt.toISOString(),
            })
          )
        : [],
    };

    return NextResponse.json(response, { status: 200 });
  } catch (err) {
    console.error("[GET /api/event-sessions/:sessionId] error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}