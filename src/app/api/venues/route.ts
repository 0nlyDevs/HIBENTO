import { NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";
import type { VenueDto } from "@/types/dto";

export async function GET(): Promise<NextResponse<{ data: VenueDto[] } | { error: string }>> {
  try {
    const venues = await prisma.venue.findMany({
      orderBy: { name: "asc" },
    });

    const data: VenueDto[] = venues.map((venue) => ({
      id: venue.id,
      name: venue.name,
      city: venue.city,
      neighborhood: venue.neighborhood,
      totalRooms: venue.totalRooms,
    }));

    return NextResponse.json({ data });
  } catch (error) {
    console.error("Error fetching venues:", error);
    return NextResponse.json(
      { error: "Failed to fetch venues" },
      { status: 500 }
    );
  }
}