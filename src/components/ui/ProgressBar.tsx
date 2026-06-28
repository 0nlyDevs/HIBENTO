"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export function ProgressBar() {
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const timerRef = useRef<ReturnType<typeof setInterval>>();
  const prevPathname = useRef(pathname);

  // Hide when navigation completes
  useEffect(() => {
    prevPathname.current = pathname;
    setProgress(100);
    const t = setTimeout(() => {
      setVisible(false);
      setProgress(0);
    }, 300);
    return () => clearTimeout(t);
  }, [pathname, searchParams]);

  // Detect Link clicks to show the bar
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const link = (e.target as HTMLElement).closest("a");
      if (!link || !link.href) return;
      try {
        const url = new URL(link.href);
        if (
          url.origin === window.location.origin &&
          url.pathname !== window.location.pathname
        ) {
          setVisible(true);
          setProgress(5);
          clearInterval(timerRef.current);
          timerRef.current = setInterval(() => {
            setProgress((p) => Math.min(p + (100 - p) * 0.05, 92));
          }, 200);
        }
      } catch {
        // ignore invalid URLs
      }
    };
    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("click", handleClick);
      clearInterval(timerRef.current);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[9999] h-[3px] pointer-events-none"
      style={{ opacity: progress >= 100 ? 0 : 1, transition: "opacity 0.2s" }}
    >
      <div
        className="h-full bg-chartreuse transition-all duration-300 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
