"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";
import { api } from "@/lib/api";
import { useFavorites } from "./useFavorites";
import type { RecommendedEventDto } from "@/types/dto";

interface NotificationContextValue {
  recommendations: RecommendedEventDto[];
  hasNew: boolean;
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
  refresh: () => Promise<void>;
  setCurrentEventId: (id: string | null) => void;
}

const NotificationContext =
  createContext<NotificationContextValue | null>(null);

const SEEN_KEY = "hibento_recommendations_seen";

function loadSeen(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = localStorage.getItem(SEEN_KEY);
    return new Set<string>(raw ? JSON.parse(raw) : []);
  } catch {
    return new Set();
  }
}

export function NotificationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { favorites } = useFavorites();
  const [recommendations, setRecommendations] = useState<
    RecommendedEventDto[]
  >([]);
  const [seenIds, setSeenIds] = useState<Set<string>>(() => loadSeen());
  const [isOpen, setIsOpen] = useState(false);
  const currentEventIdRef = useRef<string | null>(null);

  // Expose currentEventId for the page-level component to set
  const setCurrentEventId = useCallback((id: string | null) => {
    currentEventIdRef.current = id;
  }, []);

  const hasNew = recommendations.some((r) => !seenIds.has(r.id));

  const fetchRecs = useCallback(async () => {
    try {
      const favArray = [...favorites];
      const res = await api.getGlobalRecommendations(
        favArray.length > 0 ? favArray : undefined,
        currentEventIdRef.current ?? undefined,
      );
      setRecommendations(res.data ?? []);
    } catch {
      // silent fail — recommendations are non-critical
    }
  }, [favorites]);

  // Refresh when favorites change
  useEffect(() => {
    fetchRecs();
  }, [fetchRecs]);

  const open = useCallback(() => {
    setIsOpen(true);
    // Mark all current recommendations as seen
    setSeenIds((prev) => {
      const next = new Set(prev);
      for (const r of recommendations) next.add(r.id);
      localStorage.setItem(SEEN_KEY, JSON.stringify([...next]));
      return next;
    });
  }, [recommendations]);

  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => {
    setIsOpen((p) => {
      if (!p) {
        // Opening — mark as seen
        setSeenIds((prev) => {
          const next = new Set(prev);
          for (const r of recommendations) next.add(r.id);
          localStorage.setItem(SEEN_KEY, JSON.stringify([...next]));
          return next;
        });
      }
      return !p;
    });
  }, [recommendations]);

  const refresh = useCallback(async () => {
    await fetchRecs();
  }, [fetchRecs]);

  const value = useMemo(
    ({
      recommendations,
      hasNew,
      isOpen,
      open,
      close,
      toggle,
      refresh,
      setCurrentEventId,
    } satisfies NotificationContextValue),
    [recommendations, hasNew, isOpen, open, close, toggle, refresh, setCurrentEventId],
  );

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationContext);
  if (!ctx) {
    throw new Error(
      "useNotifications must be used within a NotificationProvider",
    );
  }
  return ctx;
}
