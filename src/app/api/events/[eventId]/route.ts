import { NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";
import type {
  EventDetailDto,
  EventSessionSummaryDto,
  SpeakerRefDto,
  RoomDto,
  VenueDto,
} from "@/types/dto";
import { isValidUUID } from "@/lib/utils/validation";
import { getEventSessionStatus } from "@/lib/utils/getEventSessionStatus";

type EventSessionWithRelations = {
  id: string;
  title: string;
  startTime: Date;
  endTime: Date;
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
  _count: {
    questions: number;
  };
};

type EventWithRelations = {
  id: string;
  title: string;
  description: string | null;
  startDate: Date;
  endDate: Date;
  isOnline: boolean;
  venue: {
    id: string;
    name: string;
    city: string;
    neighborhood: string;
    totalRooms: number;
  } | null;
  eventSessions: EventSessionWithRelations[];
};

function transformToEventSessionSummary(
  session: EventSessionWithRelations
): EventSessionSummaryDto {
  const roomDto: RoomDto = {
    id: session.room.id,
    name: session.room.name,
    capacity: session.room.capacity,
    venueId: session.room.venueId,
  };

  return {
    id: session.id,
    title: session.title,
    startTime: session.startTime.toISOString(),
    endTime: session.endTime.toISOString(),
    room: roomDto,
    isLive: getEventSessionStatus(session) === "live",
    speakers: session.speakers.map(
      (sessionSpeaker): SpeakerRefDto => ({
        id: sessionSpeaker.speaker.id,
        name: sessionSpeaker.speaker.name,
        avatar: sessionSpeaker.speaker.avatarUrl,
        bio: sessionSpeaker.speaker.bio,
      })
    ),
    questionCount: session._count.questions,
  };
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ eventId: string }> }
): Promise<NextResponse<EventDetailDto | { error: string }>> {
  try {
    const { eventId } = await params;

    if (!isValidUUID(eventId)) {
      return NextResponse.json(
        { error: "Invalid event ID format" },
        { status: 400 }
      );
    }

    const event = (await prisma.event.findUnique({
      where: { id: eventId },
      include: {
        venue: true,
        eventSessions: {
          include: {
            room: true,
            speakers: {
              include: {
                speaker: true,
              },
            },
            _count: {
              select: { questions: true },
            },
          },
          orderBy: {
            startTime: "asc",
          },
        },
      },
    })) as EventWithRelations | null;

    if (!event) {
      return NextResponse.json(
        { error: "Event not found" },
        { status: 404 }
      );
    }

    const venueDto: VenueDto | null = event.venue
      ? {
          id: event.venue.id,
          name: event.venue.name,
          city: event.venue.city,
          neighborhood: event.venue.neighborhood,
          totalRooms: event.venue.totalRooms,
        }
      : null;

    const response: EventDetailDto = {
      id: event.id,
      title: event.title,
      description: event.description,
      startDate: event.startDate.toISOString(),
      endDate: event.endDate.toISOString(),
      venue: venueDto,
      isOnline: event.isOnline,
      eventSessions: event.eventSessions.map(transformToEventSessionSummary),
    };

    return NextResponse.json(response, { status: 200 });
  } catch (err) {
    console.error("[GET /api/events/:eventId] error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}