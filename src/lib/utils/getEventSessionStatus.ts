export function getEventSessionStatus(session: { 
  startTime: Date; 
  endTime: Date; 
}): "live" | "upcoming" | "ended" {
  const now = new Date();
  if (now < session.startTime) return "upcoming";
  if (now > session.endTime) return "ended";
  return "live";
}