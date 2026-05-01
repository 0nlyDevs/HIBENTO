import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
  const limit = Math.min(
    100,
    Math.max(1, parseInt(searchParams.get("limit") || "20"))
  );
  const upcoming = searchParams.get("upcoming") !== "false";

  const skip = (page - 1) * limit;

  const where: { startDate?: { gte: Date } } = {};
  if (upcoming) {
    where.startDate = { gte: new Date() };
  }

  const [events, total] = await Promise.all([
    prisma.event.findMany({
      where,
      skip,
      take: limit,
      orderBy: { startDate: "asc" },
      select: {
        id: true,
        title: true,
        description: true,
        startDate: true,
        endDate: true,
        location: true,
        _count: {
          select: { sessions: true },
        },
      },
    }),
    prisma.event.count({ where }),
  ]);

  const data = events.map((event) => ({
    id: event.id,
    title: event.title,
    description: event.description,
    startDate: event.startDate.toISOString(),
    endDate: event.endDate.toISOString(),
    location: event.location,
    sessionCount: event._count.sessions,
  }));

  return NextResponse.json({
    data,
    pagination: {
      page,
      limit,
      total,
    },
  });
}
