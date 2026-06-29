"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";
import { useEffect, useState } from "react";

export function SpeakersSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(searchParams.get("q") || "");

  useEffect(() => {
    const trimmed = value.trim();
    const params = new URLSearchParams();
    if (trimmed) params.set("q", trimmed);
    params.set("page", "1");
    const qs = params.toString();
    router.replace(`/speakers${qs ? `?${qs}` : ""}`, { scroll: false });
  }, [value, router]);

  return (
    <div className="relative w-56">
      <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-ivory/40 pointer-events-none" />
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search a speaker"
        className="w-full h-9 pl-8 pr-8 text-sm font-medium text-ivory placeholder-ivory/40 focus:outline-none transition-colors rounded-lg"
        style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
      />
      {value && (
        <button
          onClick={() => setValue("")}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-ivory/40 hover:text-ivory transition-colors cursor-pointer"
        >
          <X size={13} />
        </button>
      )}
    </div>
  );
}
