import { EventSession } from "@prisma/client";

export interface PaginationOptions {
  page?: number;
  limit?: number;
}

export interface PaginationResult {
  skip: number;
  take: number;
}

export function getPagination(options: PaginationOptions): PaginationResult {
  const page = Math.max(1, options.page || 1);
  const limit = Math.min(100, Math.max(1, options.limit || 20));
  return {
    skip: (page - 1) * limit,
    take: limit,
  };
}

export function isSessionLive(session: Pick<EventSession, "startTime" | "endTime">): boolean {
  const now = new Date();
  return now >= session.startTime && now <= session.endTime;
}

export function getSessionStatus(
  session: Pick<EventSession, "startTime" | "endTime">
): "live" | "upcoming" | "ended" {
  const now = new Date();
  if (now < session.startTime) return "upcoming";
  if (now > session.endTime) return "ended";
  return "live";
}

export function toISOString(date: Date): string {
  return date.toISOString();
}

export function fromISOString(isoString: string): Date {
  return new Date(isoString);
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

export function createSuccessResponse<T>(data: T): ApiResponse<T> {
  return { success: true, data };
}

export function createErrorResponse(error: string): ApiResponse {
  return { success: false, error };
}

export function isValidUUID(str: string): boolean {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str);
}

export function isValidUrl(str: string): boolean {
  try {
    new URL(str);
    return true;
  } catch {
    return false;
  }
}
