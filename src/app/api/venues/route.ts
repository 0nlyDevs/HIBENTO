import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";
import type { VenueDto } from "@/types/dto";

export async function GET(
  request: NextRequest
): Promise<NextResponse<{ data: VenueDto[]; pagination: { page: number; limit: number; total: number } } | { error: string }>> {
  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "20")));
    const q = searchParams.get("q");

    const where = q
      ? {
          OR: [
            { name: { contains: q, mode: "insensitive" as const } },
            { city: { contains: q, mode: "insensitive" as const } },
            { neighborhood: { contains: q, mode: "insensitive" as const } },
          ],
        }
      : {};

    const [venues, total] = await Promise.all([
      prisma.venue.findMany({
        where,
        orderBy: { name: "asc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.venue.count({ where }),
    ]);

    const data: VenueDto[] = venues.map((venue) => ({
      id: venue.id,
      name: venue.name,
      city: venue.city,
      neighborhood: venue.neighborhood,
      totalRooms: venue.totalRooms,
    }));

    return NextResponse.json({ data, pagination: { page, limit, total } });
  } catch (error) {
    console.error("Error fetching venues:", error);
    return NextResponse.json(
      { error: "Failed to fetch venues" },
      { status: 500 }
    );
  }
}