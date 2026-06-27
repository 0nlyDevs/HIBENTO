import { NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";
import type {
  EventSessionDetailDto,
  SpeakerDetailDto,
  QuestionDto,
  RoomDto,
  VenueDto,
} from "@/types/dto";
import { isValidUUID } from "@/lib/utils/validation";
import { getEventSessionStatus } from "@/lib/utils/getEventSessionStatus";

type EventSessionWithDetails = {
  id: string;
  eventId: string;
  title: string;
  description: string | null;
  startTime: Date;
  endTime: Date;
  capacity: number | null;
  roomId: string | null;
  event: {
    isOnline: boolean;
  };
  room: {
    id: string;
    name: string;
    capacity: number | null;
    venueId: string;
    venue: {
      id: string;
      name: string;
      city: string;
      neighborhood: string;
      totalRooms: number;
    } | null;
  } | null;
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
  _count: {
    registrations: number;
  };
};

export async function GET(
  request: Request,
  { params }: { params: Promise<{ sessionId: string }> }
): Promise<NextResponse<EventSessionDetailDto | { error: string }>> {
  try {
    const { sessionId } = await params;

    if (!isValidUUID(sessionId)) {
      return NextResponse.json(
        { error: "Invalid session ID format" },
        { status: 400 }
      );
    }

    const session = (await prisma.eventSession.findUnique({
      where: { id: sessionId },
      include: {
        event: {
          select: { isOnline: true },
        },
        room: {
          include: {
            venue: true,
          },
        },
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
        _count: {
          select: { registrations: true },
        },
      },
    })) as EventSessionWithDetails | null;

    if (!session) {
      return NextResponse.json(
        { error: "Session not found" },
        { status: 404 }
      );
    }

    if (session.speakers.length === 0) {
      console.warn(`[GET /api/event-sessions/:sessionId] Session ${sessionId} has no speakers`);
    }

    const isLive = getEventSessionStatus(session) === "live";
    const isOnline = session.event.isOnline;

    const roomDto: RoomDto | null = session.room
      ? {
          id: session.room.id,
          name: session.room.name,
          capacity: session.room.capacity,
          venueId: session.room.venueId,
        }
      : null;

    const venueDto: VenueDto | null = session.room?.venue
      ? {
          id: session.room.venue.id,
          name: session.room.venue.name,
          city: session.room.venue.city,
          neighborhood: session.room.venue.neighborhood,
          totalRooms: session.room.venue.totalRooms,
        }
      : null;

    const response: EventSessionDetailDto = {
      id: session.id,
      eventId: session.eventId,
      title: session.title,
      description: session.description,
      startTime: session.startTime.toISOString(),
      endTime: session.endTime.toISOString(),
      room: roomDto,
      venue: venueDto,
      capacity: session.capacity,
      isOnline: isOnline,
      isLive: isLive,
      registrationCount: session._count.registrations,
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