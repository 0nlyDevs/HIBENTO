import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export function useLiveSessionCount() {
  return useQuery({
    queryKey: ["live-sessions-count"],
    queryFn: async () => {
      const result = await api.getLiveSessionCount();
      return result.count;
    },
    staleTime: 15_000,
    refetchInterval: 30_000,
  });
}
