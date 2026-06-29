import prisma from "@/lib/db/prisma";
import { SpeakerSummaryDto } from "@/types";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
): Promise<NextResponse<{ data: SpeakerSummaryDto[]; pagination: { page: number; limit: number; total: number } } | { error: string }>> {
  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(
      100,
      Math.max(1, parseInt(searchParams.get("limit") || "20")),
    );
    const q = searchParams.get("q");

    const where = q
      ? {
          OR: [
            { name: { contains: q, mode: "insensitive" as const } },
            { bio: { contains: q, mode: "insensitive" as const } },
          ],
        }
      : {};

    const [speakers, total] = await Promise.all([
      prisma.speaker.findMany({
        where,
        select: {
          id: true,
          name: true,
          avatarUrl: true,
          bio: true,
          _count: {
            select: {
              sessions: true,
            },
          },
        },
        take: limit,
        skip: (page - 1) * limit,
      }),
      prisma.speaker.count({ where }),
    ]);
    
const mappedSpeakers: SpeakerSummaryDto[] = speakers.map((s) => ({
  id: s.id,
  name: s.name,
  bio: s.bio,
  avatar: s.avatarUrl ?? null,
  eventSessionCount: s._count.sessions,
}));
    
    return NextResponse.json({ data: mappedSpeakers, pagination: { page, limit, total } });
  } catch (err) {
    console.error("GET /api/speakers error: ", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}