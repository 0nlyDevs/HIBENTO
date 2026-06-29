import { NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";
import type { RoomDto } from "@/types/dto";
import { isValidUUID } from "@/lib/utils/validation";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ roomId: string }> }
): Promise<NextResponse<RoomDto | { error: string }>> {
  try {
    const { roomId } = await params;

    if (!isValidUUID(roomId)) {
      return NextResponse.json(
        { error: "Invalid room ID format" },
        { status: 400 }
      );
    }

    const room = await prisma.room.findUnique({
      where: { id: roomId },
    });

    if (!room) {
      return NextResponse.json(
        { error: "Room not found" },
        { status: 404 }
      );
    }

    const response: RoomDto = {
      id: room.id,
      name: room.name,
      capacity: room.capacity,
      venueId: room.venueId,
    };

    return NextResponse.json(response, { status: 200 });
  } catch (err) {
    console.error("[GET /api/rooms/:roomId] error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
