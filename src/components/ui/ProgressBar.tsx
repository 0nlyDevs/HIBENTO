"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export function ProgressBar() {
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const prevPathname = useRef(pathname);
  const progressRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // Show progress bar on Link clicks
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const link = (e.target as HTMLElement).closest("a");
      if (!link?.href) return;
      try {
        const url = new URL(link.href);
        if (
          url.origin === window.location.origin &&
          url.pathname !== window.location.pathname
        ) {
          clearInterval(timerRef.current);
          clearTimeout(hideTimerRef.current);
          setVisible(true);
          progressRef.current = 30;
          setProgress(30);
          timerRef.current = setInterval(() => {
            progressRef.current = Math.min(
              progressRef.current + (100 - progressRef.current) * 0.2,
              90,
            );
            setProgress(Math.round(progressRef.current * 10) / 10);
          }, 150);
        }
      } catch {
        // ignore invalid URLs
      }
    };
    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("click", handleClick);
      clearInterval(timerRef.current);
      clearTimeout(hideTimerRef.current);
    };
  }, []);

  // Hide when navigation completes (pathname or search params change)
  useEffect(() => {
    if (prevPathname.current === pathname) return;
    prevPathname.current = pathname;
    clearInterval(timerRef.current);
    progressRef.current = 100;
    setProgress(100);
    hideTimerRef.current = setTimeout(() => {
      setVisible(false);
      setProgress(0);
      progressRef.current = 0;
    }, 300);
  }, [pathname, searchParams]);

  if (!visible) return null;

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[9999] h-[3px] pointer-events-none"
      style={{ opacity: progress >= 100 ? 0 : 1, transition: "opacity 0.2s" }}
    >
      <div
        className="h-full bg-chartreuse"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
