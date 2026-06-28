"use client";

import { createContext, useContext, useState, useEffect, useCallback, useMemo, useRef } from "react";

const STORAGE_KEY = "hibento_favorites";

function loadFavorites(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return new Set<string>(raw ? JSON.parse(raw) : []);
  } catch {
    return new Set();
  }
}

interface FavoritesContextValue {
  favorites: Set<string>;
  isFavorite: (sessionId: string) => boolean;
  toggleFavorite: (sessionId: string) => void;
  hydrated: boolean;
}

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setFavorites(loadFavorites());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...favorites]));
    }
  }, [favorites, hydrated]);

  const toggleFavorite = useCallback((sessionId: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(sessionId)) {
        next.delete(sessionId);
      } else {
        next.add(sessionId);
      }
      return next;
    });
  }, []);

  const favoritesRef = useRef(favorites);
  favoritesRef.current = favorites;

  const isFavorite = useCallback(
    (sessionId: string) => favoritesRef.current.has(sessionId),
    [],
  );

  const value = useMemo(
    () => ({ favorites, isFavorite, toggleFavorite, hydrated }),
    [favorites, isFavorite, toggleFavorite, hydrated],
  );

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return ctx;
}
