import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";
import type { EventSessionSummaryDto } from "@/types/dto";
import { toEventSessionSummary, toRoomDto } from "@/lib/utils/mappers";
import { isValidUUID } from "@/lib/utils/validation";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ eventId: string; roomId: string }> }
): Promise<NextResponse<{ data: EventSessionSummaryDto[] } | { error: string }>> {
  try {
    const { eventId, roomId } = await params;

    if (!isValidUUID(eventId) || !isValidUUID(roomId)) {
      return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
    }

    const event = await prisma.event.findUnique({
      where: { id: eventId },
      select: { isOnline: true },
    });

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
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
      const room = await prisma.room.findUnique({ where: { id: roomId } });
      if (!room) {
        return NextResponse.json({ error: "Room not found" }, { status: 404 });
      }
    }

    const data: EventSessionSummaryDto[] = sessions.map((session) =>
      toEventSessionSummary({ session, eventIsOnline: event.isOnline }),
    );

    return NextResponse.json({ data });
  } catch (error) {
    console.error("[GET /api/events/:eventId/rooms/:roomId/sessions]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}