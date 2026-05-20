import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";
import type { EventSessionSummaryDto, RoomDto } from "@/types/dto";
import { isValidUUID } from "@/lib/utils/validation";
import { getEventSessionStatus } from "@/lib/utils/getEventSessionStatus";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ eventId: string; roomId: string }> }
): Promise<NextResponse<{ data: EventSessionSummaryDto[] } | { error: string }>> {
  try {
    const { eventId, roomId } = await params;

    if (!isValidUUID(eventId) || !isValidUUID(roomId)) {
      return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
    }

    const sessions = await prisma.eventSession.findMany({
      where: {
        eventId,
        roomId,
      },
      include: {
        room: true,
        speakers: {
          include: { speaker: true },
        },
        _count: {
          select: { questions: true },
        },
      },
      orderBy: { startTime: "asc" },
    });

    if (sessions.length === 0) {
      // Check if room exists
      const room = await prisma.room.findUnique({ where: { id: roomId } });
      if (!room) {
        return NextResponse.json({ error: "Room not found" }, { status: 404 });
      }
    }

    const data: EventSessionSummaryDto[] = sessions.map((session) => {
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
        speakers: session.speakers.map((s) => ({
          id: s.speaker.id,
          name: s.speaker.name,
          avatar: s.speaker.avatarUrl,
          bio: s.speaker.bio,
        })),
        questionCount: session._count.questions,
      };
    });

    return NextResponse.json({ data });
  } catch (error) {
    console.error("[GET /api/events/:eventId/rooms/:roomId/sessions]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}