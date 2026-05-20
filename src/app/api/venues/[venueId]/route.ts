import { NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";
import type { VenueDetailDto, RoomDto } from "@/types/dto";
import { isValidUUID } from "@/lib/utils/validation";

export async function GET(
  request: Request,
  context: RouteContext<"/api/venues/[venueId]">
): Promise<NextResponse<VenueDetailDto | { error: string }>> {
  try {
    const { venueId } = await context.params;

    if (!isValidUUID(venueId)) {
      return NextResponse.json(
        { error: "Invalid venue ID format" },
        { status: 400 }
      );
    }

    const venue = await prisma.venue.findUnique({
      where: { id: venueId },
      include: {
        rooms: true,
      },
    });

    if (!venue) {
      return NextResponse.json(
        { error: "Venue not found" },
        { status: 404 }
      );
    }

    const rooms: RoomDto[] = venue.rooms.map((room) => ({
      id: room.id,
      name: room.name,
      capacity: room.capacity,
      venueId: room.venueId,
    }));

    const response: VenueDetailDto = {
      id: venue.id,
      name: venue.name,
      city: venue.city,
      neighborhood: venue.neighborhood,
      totalRooms: venue.totalRooms,
      rooms,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching venue:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}