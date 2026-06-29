"use client";

import { useNotifications } from "@/lib/hooks/NotificationContext";
import { Bell } from "lucide-react";

export function NotificationBell() {
  const { hasNew, toggle } = useNotifications();

  return (
    <button
      onClick={toggle}
      className="relative p-2 -m-2 text-white/70 hover:text-white transition-colors"
      aria-label={hasNew ? "New recommendations available" : "Recommendations"}
    >
      <Bell size={18} />
      {hasNew && (
        <span className="absolute top-0.5 right-0.5 w-2 h-2 rounded-full bg-red-500 ring-2 ring-[#0a0a0a]" />
      )}
    </button>
  );
}
