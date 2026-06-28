import { NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";

export const dynamic = "force-dynamic";

export async function GET(): Promise<NextResponse<{ count: number }>> {
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
    return NextResponse.json({ count: 0 });
  }
}
