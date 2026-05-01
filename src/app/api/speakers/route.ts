import prisma from "@/lib/db/prisma";
import { SpeakerSummaryDto } from "@/types";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
): Promise<NextResponse<SpeakerSummaryDto[] | { error: string }>> {
  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(
      100,
      Math.max(1, parseInt(searchParams.get("limit") || "20")),
    );
    const speakers = await prisma.speaker.findMany({
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
    });
    const mappedSpeakers = speakers.map(
      (s) =>
        ({
          id: s.id,
          name: s.name,
          bio: s.bio,
          avatar: s.avatarUrl ?? "",
          sessionCount: s._count.sessions,
        }) as SpeakerSummaryDto,
    );
    return NextResponse.json(mappedSpeakers);
  } catch (err) {
    console.error("GET /api/speakers error: ", err);
    return NextResponse.json({ error: "Internal Server Error" });
  }
}
