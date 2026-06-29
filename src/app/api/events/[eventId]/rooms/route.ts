import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";
import type { RoomDto } from "@/types/dto";
import { isValidUUID } from "@/lib/utils/validation";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ eventId: string }> }
): Promise<NextResponse<{ data: RoomDto[] } | { error: string }>> {
  try {
    const { eventId } = await params;
    const q = new URL(request.url).searchParams.get("q");

    if (!isValidUUID(eventId)) {
      return NextResponse.json(
        { error: "Invalid event ID format" },
        { status: 400 }
      );
    }

    const where: Record<string, unknown> = { eventId };
    if (q) {
      where.room = { name: { contains: q, mode: "insensitive" } };
    }

    const [eventExists, sessionsWithRooms] = await Promise.all([
      prisma.event.findUnique({
        where: { id: eventId },
        select: { id: true },
      }),
      prisma.eventSession.findMany({
      where,
      select: {
        room: {
          select: {
            id: true,
            name: true,
            capacity: true,
            venueId: true,
          },
        },
      },
      distinct: ["roomId"],
    }),
  ]);

    if (!eventExists) {
      return NextResponse.json(
        { error: "Event not found" },
        { status: 404 }
      );
    }

    const data: RoomDto[] = sessionsWithRooms.map((session) => {
      const roomData = session.room!;
      return {
        id: roomData.id,
        name: roomData.name,
        capacity: roomData.capacity,
        venueId: roomData.venueId,
      };
    });

    return NextResponse.json({ data }, { status: 200 });
  } catch (err) {
    console.error("[GET /api/events/:eventId/rooms] error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}