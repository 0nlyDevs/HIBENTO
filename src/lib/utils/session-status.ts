export interface SessionStatus {
  isLive: boolean;
  isUpcoming: boolean;
  isEnded: boolean;
}

export function getSessionStatus(session: {
  startTime: string | Date;
  endTime: string | Date;
  isLive?: boolean;
}): SessionStatus {
  const now = new Date();
  const startTime = new Date(session.startTime);
  const endTime = new Date(session.endTime);
  return {
    isLive: session.isLive ?? (now >= startTime && now <= endTime),
    isUpcoming: now < startTime,
    isEnded: now > endTime,
  };
}
