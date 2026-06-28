import { getSessionStatus } from "./session-status";

export function getEventSessionStatus(session: {
  startTime: Date;
  endTime: Date;
}): "live" | "upcoming" | "ended" {
  const status = getSessionStatus({
    startTime: session.startTime,
    endTime: session.endTime,
  });
  if (status.isLive) return "live";
  if (status.isUpcoming) return "upcoming";
  return "ended";
}