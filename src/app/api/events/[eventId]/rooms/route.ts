import { NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";
import type { RoomDto } from "@/types/dto";
import { isValidUUID } from "@/lib/utils/validation";

export async function GET(
  request: Request,
  context: RouteContext<"/api/events/[eventId]/rooms">
): Promise<NextResponse<{ data: RoomDto[] } | { error: string }>> {
  try {
    const { eventId } = await context.params;

    if (!isValidUUID(eventId)) {
      return NextResponse.json(
        { error: "Invalid event ID format" },
        { status: 400 }
      );
    }

    const eventExists = await prisma.event.findUnique({
      where: { id: eventId },
      select: { id: true },
    });

    if (!eventExists) {
      return NextResponse.json(
        { error: "Event not found" },
        { status: 404 }
      );
    }

    // Get unique rooms used by sessions in this event
    const sessionsWithRooms = await prisma.eventSession.findMany({
      where: { eventId },
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
    });

    const data: RoomDto[] = sessionsWithRooms.map((session) => ({
      id: session.room.id,
      name: session.room.name,
      capacity: session.room.capacity,
      venueId: session.room.venueId,
    }));

    return NextResponse.json({ data }, { status: 200 });
  } catch (err) {
    console.error("[GET /api/events/:eventId/rooms] error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}