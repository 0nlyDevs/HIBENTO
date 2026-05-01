import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../lib/db/prisma";
import type { EventSummaryDto } from "@/types";


type EventWithCount = {
  id: string;
  title: string;
  description: string | null;
  startDate: Date;
  endDate: Date;
  location: string | null;
  sessions: { id: string }[];  
};

export async function GET(request: NextRequest): Promise<NextResponse<{
  data: EventSummaryDto[];
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
}>> {
  const { searchParams } = new URL(request.url);
  const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
  const limit = Math.min(
    100,
    Math.max(1, parseInt(searchParams.get("limit") || "20"))
  );
  const upcoming = searchParams.get("upcoming") === "true";

  const skip = (page - 1) * limit;

  const where: {
    startDate?: {
      gte: Date;
    };
  } = {};
  
  if (upcoming) {
    where.startDate = { gte: new Date() };
  }

  const [events, total] = await Promise.all([
    prisma.event.findMany({
      where,
      skip,
      take: limit,
      orderBy: { startDate: "asc" as const },
      include: {
        sessions: {
          select: { id: true } 
        }
      }
    }),
    prisma.event.count({ where }),
  ]);

  const data: EventSummaryDto[] = events.map((event:EventWithCount) => ({
    id: event.id,
    title: event.title,
    description: event.description,
    startDate: event.startDate.toISOString(),
    endDate: event.endDate.toISOString(),
    location: event.location,
    sessionCount: event.sessions.length,
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