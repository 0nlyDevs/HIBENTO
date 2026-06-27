"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Maximize2, Minimize2, Volume2, VolumeX, Clock } from "lucide-react";

interface VideoPanelProps {
  isLive: boolean;
  isUpcoming: boolean;
  isEnded: boolean;
  startTime: Date;
}

export function VideoPanel({ isLive, isUpcoming, isEnded, startTime }: VideoPanelProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(true);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, []);

  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;
    vid.volume = volume;
    vid.muted = isMuted;
  }, [volume, isMuted]);

  const handleVolumeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (val === 0) setIsMuted(true);
    else if (isMuted) setIsMuted(false);
  }, [isMuted]);

  const toggleMute = useCallback(() => setIsMuted((prev) => !prev), []);

  const handleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      videoContainerRef.current?.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }, []);

  return (
    <div ref={videoContainerRef} className="relative w-full aspect-video lg:aspect-auto lg:flex-1 overflow-hidden bg-black">
      <video
        ref={videoRef}
        src="/videos/taylor.mp4"
        autoPlay
        loop
        playsInline
        muted={isMuted}
        className="absolute inset-0 w-full h-full object-cover"
      />

      {(isUpcoming || isEnded) && (
        <div className="absolute inset-0 bg-black/55 z-1" />
      )}

      <div className="absolute inset-0 z-2 flex flex-col items-center justify-center pointer-events-none">
        {isUpcoming && (
          <div className="flex flex-col items-center gap-3 text-center px-8">
            <div className="w-14 h-14 bg-ivory/5 border border-ivory/10 rounded-full flex items-center justify-center text-ivory/50">
              <Clock size={26} />
            </div>
            <div>
              <h3 className="text-base font-bold text-ivory mb-1">Upcoming Session</h3>
              <p className="text-sm text-chartreuse font-medium">
                {startTime.toLocaleDateString("en-US", {
                  month: "long", day: "numeric", year: "numeric",
                })}{" "}
                at {startTime.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
              </p>
            </div>
          </div>
        )}
        {isEnded && (
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="w-14 h-14 bg-ivory/5 border border-dashed border-ivory/10 rounded-full flex items-center justify-center text-ivory/35">
              <Clock size={26} />
            </div>
            <div>
              <h3 className="text-base font-bold text-ivory/65 mb-1">Session Concluded</h3>
              <p className="text-xs text-ivory/35">The live broadcast has ended.</p>
            </div>
          </div>
        )}
      </div>

      {isLive && (
        <div className="absolute top-3 left-3 z-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-600/90 backdrop-blur-sm">
          <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
          <span className="label-mono text-[10px] font-bold text-white tracking-widest">LIVE</span>
        </div>
      )}

      <div className="absolute bottom-3 left-3 right-3 z-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/60 backdrop-blur-sm">
          <button
            onClick={toggleMute}
            className="text-ivory/70 hover:text-ivory transition-colors cursor-pointer shrink-0"
            aria-label={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted || volume === 0 ? <VolumeX size={13} /> : <Volume2 size={13} />}
          </button>
          <div className="relative w-20 h-3 flex items-center group">
            <div className="absolute inset-y-0 my-auto h-0.75 w-full rounded-full bg-white/15" />
            <div
              className="absolute inset-y-0 my-auto h-0.75 rounded-full bg-chartreuse transition-all duration-75"
              style={{ width: `${(isMuted ? 0 : volume) * 100}%` }}
            />
            <div
              className="absolute w-3 h-3 rounded-full bg-chartreuse shadow-[0_0_6px_rgba(210,255,0,0.6)] -translate-x-1/2 transition-all duration-75"
              style={{ left: `${(isMuted ? 0 : volume) * 100}%` }}
            />
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              className="absolute inset-0 w-full opacity-0 cursor-pointer"
              aria-label="Volume"
            />
          </div>
        </div>
        <button
          onClick={handleFullscreen}
          className="w-8 h-8 rounded-lg bg-black/60 backdrop-blur-sm border border-white/10 flex items-center justify-center text-ivory/60 hover:text-ivory hover:bg-black/80 transition-all cursor-pointer shrink-0"
          aria-label={isFullscreen ? "Exit full screen" : "Full screen"}
        >
          {isFullscreen ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
        </button>
      </div>
    </div>
  );
}
