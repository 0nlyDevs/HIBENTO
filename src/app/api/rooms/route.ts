import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";
import type { RoomDto } from "@/types/dto";

export async function GET(
  request: NextRequest
): Promise<NextResponse<{ data: RoomDto[]; pagination: { page: number; limit: number; total: number } } | { error: string }>> {
  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "20")));
    const q = searchParams.get("q");
    const venueId = searchParams.get("venueId");

    const where: Record<string, unknown> = {};
    if (q) {
      where.name = { contains: q, mode: "insensitive" };
    }
    if (venueId) {
      where.venueId = venueId;
    }

    const [rooms, total] = await Promise.all([
      prisma.room.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { name: "asc" },
      }),
      prisma.room.count({ where }),
    ]);

    const data: RoomDto[] = rooms.map((room) => ({
      id: room.id,
      name: room.name,
      capacity: room.capacity,
      venueId: room.venueId,
    }));

    return NextResponse.json({
      data,
      pagination: { page, limit, total },
    });
  } catch (error) {
    console.error("Error fetching rooms:", error);
    return NextResponse.json(
      { error: "Failed to fetch rooms" },
      { status: 500 }
    );
  }
}
