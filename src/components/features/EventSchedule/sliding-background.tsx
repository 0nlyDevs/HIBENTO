"use client";

import { useState, useEffect, useRef, useCallback } from "react";

interface SlidingBackgroundProps {
  activeIndex: number;
  pillRefs: React.MutableRefObject<(HTMLButtonElement | null)[]>;
}

export function SlidingBackground({ activeIndex, pillRefs }: SlidingBackgroundProps) {
  const [position, setPosition] = useState({ left: 0, width: 0 });
  const rafId = useRef<number>(null);

  const updatePosition = useCallback(() => {
    const activePill = pillRefs.current[activeIndex];
    if (activePill?.parentElement) {
      const parent = activePill.parentElement;
      const pillRect = activePill.getBoundingClientRect();
      const parentRect = parent.getBoundingClientRect();
      setPosition({
        left: pillRect.left - parentRect.left,
        width: pillRect.width,
      });
    }
  }, [activeIndex, pillRefs]);

  useEffect(() => {
    rafId.current = requestAnimationFrame(updatePosition);
    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [updatePosition]);

  useEffect(() => {
    const handleResize = () => {
      rafId.current = requestAnimationFrame(updatePosition);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [updatePosition]);

  return (
    <div
      className="absolute top-1 bottom-1 bg-chartreuse rounded-full transition-all duration-300 ease-in-out z-0"
      style={{ left: position.left, width: position.width }}
    />
  );
}
