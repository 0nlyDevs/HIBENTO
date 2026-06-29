"use client";

import { useState, useDeferredValue } from "react";
import Link from "next/link";
import { useFavorites } from "@/lib/hooks/useFavorites";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { fromEventSessionDetail } from "@/lib/utils/sessionMappers";
import { sortScheduleSessions } from "@/lib/utils/sortSessions";
import { ScheduleTable } from "@/components/sessions/ScheduleTable";
import { TablePagination } from "@/components/ui/TablePagination";
import { Search } from "lucide-react";

const PAGE_SIZE = 5;

export default function FavoritesPage() {
  const { favorites } = useFavorites();
  const ids = [...favorites];
  const [favPage, setFavPage] = useState(1);

  const { data: sessions, isLoading } = useQuery({
    queryKey: ["favorite-sessions", ids],
    queryFn: async () => {
      const results = await Promise.all(
        ids.map((id) => api.getEventSession(id)),
      );
      return results.filter(Boolean);
    },
    enabled: ids.length > 0,
    placeholderData: keepPreviousData,
  });

  const [favSearch, setFavSearch] = useState("");
  const deferredFavSearch = useDeferredValue(favSearch);

  const sorted = sortScheduleSessions(
    (sessions ?? []).filter(Boolean).map(fromEventSessionDetail),
    "asc",
  );
  const searchedSessions = deferredFavSearch
    ? sorted.filter((s) =>
        s.title.toLowerCase().includes(deferredFavSearch.toLowerCase()),
      )
    : sorted;

  const totalFavPages = Math.max(1, Math.ceil(searchedSessions.length / PAGE_SIZE));
  const safeFavPage = Math.min(favPage, totalFavPages);
  const paginatedSessions = searchedSessions.slice(
    (safeFavPage - 1) * PAGE_SIZE,
    safeFavPage * PAGE_SIZE,
  );

  return (
    <div className="pt-16 pb-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-start justify-between mb-8">
          <div>
            <p className="label-mono text-chartreuse mb-2">§ COMMUNITY</p>
            <h1 className="text-display text-[clamp(2.2rem,5vw,4rem)] text-ivory leading-none mb-3">
              Your Favourites
            </h1>
            <p className="text-sm text-ivory/70 leading-relaxed">
              Keep track of your favourite sessions and watch them anytime.
            </p>
          </div>
          <p className="label-mono text-ivory/40 pt-0.5 shrink-0">
            {ids.length} {ids.length === 1 ? "session" : "sessions"} saved
          </p>
        </div>

        {ids.length === 0 ? (
          <div className="card-glass squircle-lg py-24 text-center">
            <svg
              className="w-10 h-10 text-ivory/20 mx-auto mb-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            <p className="text-ivory/60 text-sm tracking-wider mb-1">
              No favorites yet
            </p>
            <p className="text-ivory/40 text-xs">
              Browse sessions and tap the heart to save them here
            </p>
            <Link
              href="/events"
              className="inline-flex items-center gap-1.5 mt-6 px-4 py-2 text-xs font-bold tracking-widest bg-chartreuse text-charcoal rounded-full hover:brightness-110 transition-all"
            >
              BROWSE EVENTS
            </Link>
          </div>
        ) : isLoading && !sessions ? (
          <div className="card-glass squircle-lg p-6">
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-16 rounded-xl bg-white/4 animate-pulse"
                />
              ))}
            </div>
          </div>
        ) : (
          <>
          <div
            className="flex items-center gap-3 p-3 mb-6 squircle-lg"
            style={{ background: "#222222E6", border: "1px dashed rgba(255,255,255,0.18)" }}
          >
            <div className="relative w-56">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-ivory/40 pointer-events-none" />
              <input
                type="text"
                value={favSearch}
                onChange={(e) => { setFavSearch(e.target.value); setFavPage(1); }}
                placeholder="Search favorites"
                className="w-full h-9 pl-8 pr-3 text-sm font-medium text-ivory placeholder-ivory/40 focus:outline-none transition-colors rounded-lg"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
              />
            </div>
          </div>
          <ScheduleTable
            sessions={paginatedSessions}
            variant="extended"
            sort={false}
            emptyMessage="No favorite sessions found"
          />
          </>
        )}

        <TablePagination
          page={safeFavPage}
          totalPages={totalFavPages}
          onChange={setFavPage}
        />
      </div>
    </div>
  );
}
