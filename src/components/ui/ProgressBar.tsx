"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState, startTransition } from "react";

export function ProgressBar() {
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const prevPathname = useRef(pathname);
  const prevSearchParams = useRef(searchParams.toString());
  const progressRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const startProgress = () => {
    clearInterval(timerRef.current);
    clearTimeout(hideTimerRef.current);
    startTransition(() => {
      setVisible(true);
      setProgress(30);
    });
    progressRef.current = 30;
    timerRef.current = setInterval(() => {
      progressRef.current = Math.min(
        progressRef.current + (100 - progressRef.current) * 0.2,
        90,
      );
      setProgress(Math.round(progressRef.current * 10) / 10);
    }, 150);
  };

  const completeProgress = () => {
    clearInterval(timerRef.current);
    progressRef.current = 100;
    setProgress(100);
    hideTimerRef.current = setTimeout(() => {
      setVisible(false);
      setProgress(0);
      progressRef.current = 0;
    }, 300);
  };

  // Catch <a> click navigations (Link components)
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const link = (e.target as HTMLElement).closest("a");
      if (!link?.href) return;
      try {
        const url = new URL(link.href);
        if (
          url.origin === window.location.origin &&
          (url.pathname !== window.location.pathname ||
            url.search !== window.location.search)
        ) {
          startProgress();
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

  // Catch all programmatic navigations (router.push, router.replace, back/forward)
  useEffect(() => {
    const originalPushState = history.pushState.bind(history);
    const originalReplaceState = history.replaceState.bind(history);

    history.pushState = (...args: unknown[]) => {
      document.dispatchEvent(new CustomEvent("navigation-start"));
      return originalPushState(...(args as [unknown, string, string | URL | null | undefined]));
    };
    history.replaceState = (...args: unknown[]) => {
      document.dispatchEvent(new CustomEvent("navigation-start"));
      return originalReplaceState(...(args as [unknown, string, string | URL | null | undefined]));
    };

    const handleNavigationStart = () => startProgress();

    document.addEventListener("navigation-start", handleNavigationStart);

    return () => {
      history.pushState = originalPushState;
      history.replaceState = originalReplaceState;
      document.removeEventListener("navigation-start", handleNavigationStart);
    };
  }, []);

  // Complete when navigation finishes (pathname or search params change)
  useEffect(() => {
    const currentPath = pathname;
    const currentSearch = searchParams.toString();
    if (prevPathname.current === currentPath && prevSearchParams.current === currentSearch) return;
    prevPathname.current = currentPath;
    prevSearchParams.current = currentSearch;
    completeProgress();
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
