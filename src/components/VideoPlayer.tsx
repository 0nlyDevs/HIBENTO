"use client";

import { useState, useEffect } from "react";

interface VideoPlayerProps {
  mode: "live" | "recorded";
}

export function VideoPlayer({ mode }: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(mode === "live");
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    if (mode === "live") {
      const interval = setInterval(() => {
        setCurrentTime((prev) => prev + 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [mode]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="relative bg-charcoal w-full aspect-video flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 bg-yellow/20 flex items-center justify-center mx-auto mb-4">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" className="text-yellow">
              <path d="M15 10L35 20L15 30V10Z" fill="currentColor"/>
            </svg>
          </div>
          <p className="text-cream/80 text-sm tracking-wider font-medium">
            {mode === "live" ? "LIVE STREAM" : "RECORDING"}
          </p>
          {mode === "live" && (
            <div className="flex items-center justify-center gap-2 mt-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-nori opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-nori"></span>
              </span>
              <span className="text-cream/60 text-xs tracking-wider">{formatTime(currentTime)}</span>
            </div>
          )}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-charcoal/90 to-transparent">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-8 h-8 bg-cream/20 flex items-center justify-center hover:bg-cream/30 transition-colors"
            >
              {isPlaying ? (
                <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" className="text-cream">
                  <rect x="2" y="1" width="3" height="10" />
                  <rect x="7" y="1" width="3" height="10" />
                </svg>
              ) : (
                <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" className="text-cream">
                  <path d="M3 1L11 6L3 11V1Z" />
                </svg>
              )}
            </button>
            <span className="text-cream/60 text-xs tracking-wider">
              {formatTime(currentTime)} {mode === "live" && "/ LIVE"}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button className="w-8 h-8 bg-cream/20 flex items-center justify-center hover:bg-cream/30 transition-colors">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-cream">
                <rect x="3" y="6" width="8" height="2" />
                {["M3 3L5 1H9L11 3", "M3 11L5 13H9L11 11"].map((d, i) => (
                  <path key={i} d={d} stroke="currentColor" strokeWidth="1" />
                ))}
              </svg>
            </button>
            <button className="w-8 h-8 bg-cream/20 flex items-center justify-center hover:bg-cream/30 transition-colors">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-cream">
                <rect x="1" y="1" width="12" height="12" stroke="currentColor" strokeWidth="1" />
                <path d="M1 4H13M1 8H13M1 12H13" stroke="currentColor" strokeWidth="0.5" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
