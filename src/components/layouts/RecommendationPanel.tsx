"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { X, ExternalLink, TrendingUp, Heart, MapPin, Sparkles } from "lucide-react";
import { useNotifications } from "@/lib/hooks/NotificationContext";
import { formatShortDate } from "@/lib/utils/dates";
import type { RecommendedEventDto } from "@/types/dto";

const REASON_ICONS: Record<string, React.ReactNode> = {
  favorite: <Heart size={12} className="text-red-400 shrink-0" />,
  viewing: <Sparkles size={12} className="text-chartreuse shrink-0" />,
  trending: <TrendingUp size={12} className="text-orange-400 shrink-0" />,
  venue: <MapPin size={12} className="text-blue-400 shrink-0" />,
};

function reasonIcon(reason: string): React.ReactNode {
  if (reason.startsWith("Because you favorited")) return REASON_ICONS.favorite;
  if (reason.startsWith("Similar to")) return REASON_ICONS.viewing;
  if (reason.startsWith("Trending")) return REASON_ICONS.trending;
  if (reason.startsWith("Also happening")) return REASON_ICONS.venue;
  return <Sparkles size={12} className="text-chartreuse shrink-0" />;
}

function shortDate(iso: string) {
  try {
    return formatShortDate(new Date(iso));
  } catch {
    return "";
  }
}

export function RecommendationPanel() {
  const { recommendations, isOpen, close } = useNotifications();
  const panelRef = useRef<HTMLDivElement>(null);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, close]);

  // Close on click outside
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: MouseEvent) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(e.target as Node)
      ) {
        close();
      }
    };
    // Delay to avoid closing on the toggle button click
    const timer = setTimeout(() => {
      document.addEventListener("mousedown", handler);
    }, 0);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("mousedown", handler);
    };
  }, [isOpen, close]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-40 bg-black/40"
          />

          {/* Panel */}
          <motion.div
            ref={panelRef}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 z-50 h-full w-full max-w-sm border-l border-white/10 bg-[#0a0a0a] shadow-2xl overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
              <div>
                <p className="label-mono text-chartreuse text-xs tracking-wider">
                  § AI RECOMMENDED
                </p>
                <h2 className="text-lg font-semibold text-ivory mt-0.5">
                  You might also like
                </h2>
              </div>
              <button
                onClick={close}
                className="p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-colors"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            {/* List */}
            {recommendations.length === 0 ? (
              <div className="px-5 py-12 text-center">
                <Sparkles size={28} className="mx-auto text-white/20 mb-3" />
                <p className="text-sm text-white/40">
                  No recommendations yet.
                </p>
                <p className="text-xs text-white/25 mt-1">
                  Favourite some sessions and we&apos;ll find events you&apos;ll love.
                </p>
              </div>
            ) : (
              <div className="px-4 py-3 space-y-3">
                {recommendations.map((rec) => (
                  <RecommendationCard key={rec.id} rec={rec} />
                ))}
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function RecommendationCard({ rec }: { rec: RecommendedEventDto }) {
  return (
    <Link
      href={`/events/${rec.id}`}
      onClick={() => {
        // Small delay to let the navigation happen before panel closes
        setTimeout(() => {
          const event = new MouseEvent("mousedown", { bubbles: true });
          document.dispatchEvent(event);
        }, 50);
      }}
      className="block card-glass squircle-lg p-4 hover:bg-ivory/[0.07] transition-colors group"
    >
      <p className="text-sm font-semibold text-ivory group-hover:text-chartreuse transition-colors mb-1 line-clamp-1">
        {rec.title}
      </p>

      {rec.description && (
        <p className="text-xs text-ivory/50 line-clamp-2 mb-2.5">
          {rec.description}
        </p>
      )}

      {/* Info row */}
      <div className="flex items-center justify-between mb-2.5">
        <span className="text-[10px] font-semibold text-ivory/40 label-mono">
          {rec.match?.venue?.city ?? "Online"} · {shortDate(rec.startDate)}
        </span>
        <span className="text-[10px] font-semibold text-chartreuse/60 label-mono">
          {Math.round(rec.score * 100)}% match
        </span>
      </div>

      {/* Reasons */}
      {rec.reasons.length > 0 && (
        <div className="space-y-1">
          {rec.reasons.map((reason, i) => (
            <div
              key={i}
              className="flex items-start gap-1.5 text-[10px] text-ivory/40 leading-tight"
            >
              {reasonIcon(reason)}
              <span>{reason}</span>
            </div>
          ))}
        </div>
      )}
    </Link>
  );
}
