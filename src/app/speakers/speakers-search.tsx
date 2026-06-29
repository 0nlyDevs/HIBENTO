"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { useCallback, useState } from "react";

export function SpeakersSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(searchParams.get("q") || "");

  const onSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const trimmed = value.trim();
      const params = new URLSearchParams();
      if (trimmed) params.set("q", trimmed);
      params.set("page", "1");
      router.push(`/speakers?${params.toString()}`);
    },
    [value, router],
  );

  return (
    <form onSubmit={onSubmit}>
      <div className="relative w-56">
        <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-ivory/40 pointer-events-none" />
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Search a speaker"
          className="w-full h-9 pl-8 pr-3 text-sm font-medium text-ivory placeholder-ivory/40 focus:outline-none transition-colors rounded-lg"
          style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
        />
      </div>
    </form>
  );
}
