import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";
import type { SessionRegistrationResponseDto } from "@/types/dto";
import { isValidUUID } from "@/lib/utils/validation";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
): Promise<NextResponse<SessionRegistrationResponseDto | { error: string }>> {
  try {
    const { sessionId } = await params;

    if (!isValidUUID(sessionId)) {
      return NextResponse.json(
        { error: "Invalid session ID format" },
        { status: 400 }
      );
    }

    const session = await prisma.eventSession.findUnique({
      where: { id: sessionId },
      select: { id: true, capacity: true, event: { select: { isOnline: true } } },
    });

    if (!session) {
      return NextResponse.json(
        { error: "Session not found" },
        { status: 404 }
      );
    }

    if (session.event.isOnline) {
      return NextResponse.json(
        { error: "Online sessions do not require registration" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { name, email } = body as { name?: string; email?: string };

    if (!name || !email || typeof name !== "string" || typeof email !== "string") {
      return NextResponse.json(
        { error: "Name and email are required" },
        { status: 400 }
      );
    }

    if (session.capacity) {
      const count = await prisma.sessionRegistration.count({
        where: { eventSessionId: sessionId },
      });

      if (count >= session.capacity) {
        return NextResponse.json(
          { error: "Session is full" },
          { status: 409 }
        );
      }
    }

    const existing = await prisma.sessionRegistration.findUnique({
      where: {
        eventSessionId_email: {
          eventSessionId: sessionId,
          email,
        },
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: "You are already registered for this session" },
        { status: 409 }
      );
    }

    const registration = await prisma.sessionRegistration.create({
      data: {
        eventSessionId: sessionId,
        name,
        email,
      },
    });

    const response: SessionRegistrationResponseDto = {
      id: registration.id,
      name: registration.name,
      email: registration.email,
      createdAt: registration.createdAt.toISOString(),
    };

    return NextResponse.json(response, { status: 201 });
  } catch (err) {
    console.error("[POST /api/event-sessions/:sessionId/registrations] error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
