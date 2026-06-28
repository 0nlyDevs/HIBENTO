import { NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";
import type { EventDetailDto } from "@/types/dto";
import { toVenueDto, toEventSessionSummary } from "@/lib/utils/mappers";
import { isValidUUID } from "@/lib/utils/validation";

type EventSessionWithRelations = {
  id: string;
  title: string;
  description: string | null;
  startTime: Date;
  endTime: Date;
  roomId: string | null;
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
        venue: {
          select: {
            id: true,
            name: true,
            city: true,
            neighborhood: true,
            totalRooms: true,
          },
        },
        eventSessions: {
          include: {
            room: {
              select: {
                id: true,
                name: true,
                capacity: true,
                venueId: true,
              },
            },
            speakers: {
              include: {
                speaker: {
                  select: {
                    id: true,
                    name: true,
                    avatarUrl: true,
                    bio: true,
                  },
                },
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

    const response: EventDetailDto = {
      id: event.id,
      title: event.title,
      description: event.description,
      startDate: event.startDate.toISOString(),
      endDate: event.endDate.toISOString(),
      venue: toVenueDto(event.venue),
      isOnline: event.isOnline,
      eventSessions: event.eventSessions.map((s) => toEventSessionSummary({ session: s, eventIsOnline: event.isOnline })),
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