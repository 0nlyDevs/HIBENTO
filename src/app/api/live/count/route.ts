import { NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";

export const dynamic = "force-dynamic";

export async function GET(): Promise<
  NextResponse<{ count: number } | { error: string }>
> {
  try {
    const count = await prisma.eventSession.count({
      where: {
        startTime: { lte: new Date() },
        endTime: { gte: new Date() },
      },
    });

    return NextResponse.json({ count });
  } catch (err) {
    console.error("GET /api/live/count error:", err);
    return NextResponse.json(
      { error: "Failed to fetch live session count" },
      { status: 500 },
    );
  }
}
