import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export function useLiveSessionCount() {
  return useQuery({
    queryKey: ["live-sessions-count"],
    queryFn: async () => {
      const { data: events } = await api.getEvents({ status: "live", limit: 100 });
      if (events.length === 0) return 0;

      const results = await Promise.all(
        events.map((event) => api.getEventSessions(event.id, { liveOnly: true })),
      );
      return results.reduce((sum, result) => sum + result.data.length, 0);
    },
    refetchInterval: 30_000,
  });
}
