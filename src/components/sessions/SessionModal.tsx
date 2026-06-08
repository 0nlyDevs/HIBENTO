"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import * as Dialog from "@radix-ui/react-dialog";
import { useGetEventSession } from "@/lib/hooks/useSessions";
import { useToast } from "@/components/Toast";
import { api } from "@/lib/api";
import {
  X, Play, MapPin, Wifi, Users, Clock, Calendar,
  BadgeCheck, ChevronRight,
} from "lucide-react";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { formatSessionStartsAt } from "@/lib/utils/dates";

const AVATAR_COLORS = [
  "hsl(61 69% 80%)", "hsl(220 35% 62%)", "hsl(280 35% 68%)",
  "hsl(160 35% 62%)", "hsl(30 65% 68%)", "hsl(340 45% 68%)",
];

function fmtTime(d: Date) {
  return d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
}
function fmtDate(d: Date) {
  return d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
}

interface SessionModalProps {
  sessionId: string;
  children: React.ReactNode; // trigger
  defaultOpenRegister?: boolean; // auto-open registration form
}

export function SessionModal({ sessionId, children, defaultOpenRegister }: SessionModalProps) {
  const router = useRouter();
  const { toast } = useToast();

  const [open, setOpen] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: session, isLoading } = useGetEventSession(sessionId, {
    enabled: open,
  });

  // Auto-open registration form when modal opens with defaultOpenRegister
  useEffect(() => {
    if (open && defaultOpenRegister && session) {
      setShowRegister(true);
    }
  }, [open, defaultOpenRegister, session]);

  const now        = session ? new Date() : null;
  const startTime  = session ? new Date(session.startTime) : null;
  const endTime    = session ? new Date(session.endTime) : null;
  const isLive     = session?.isLive ?? false;
  const isUpcoming = now && startTime ? now < startTime : false;
  const isEnded    = now && endTime ? now > endTime : false;
  const isOnline   = session?.isOnline ?? false;

  const spotsLeft  = session?.capacity && session.capacity > 0
    ? session.capacity - session.registrationCount
    : null;
  const isFull     = spotsLeft !== null && spotsLeft <= 0;

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    setIsSubmitting(true);
    try {
      await api.registerForSession(sessionId, { name: name.trim(), email: email.trim() });
      setName(""); setEmail(""); setShowRegister(false);
      toast("Spot confirmed! Check your email.", "success");
    } catch (err) {
      toast(err instanceof Error ? err.message : "Registration failed", "error");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>

      <Dialog.Portal>
        {/* Overlay */}
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm data-[state=open]:animate-fade-in" />

        {/* Content */}
        <Dialog.Content
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ outline: "none" }}
        >
          <div
            className="relative w-full max-w-2xl max-h-[85vh] squircle-lg animate-slide-up flex flex-col"
            style={{
              background: "#131418",
              border: "1px solid rgba(255,255,255,0.08)",
              boxShadow: "0 32px 80px rgba(0,0,0,0.8)",
            }}
          >
            {/* Chartreuse top accent */}
            <div className="h-1 w-full bg-chartreuse shrink-0 rounded-t-[1rem]" />

            {/* Close button */}
            <Dialog.Close asChild>
              <button
                className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full flex items-center justify-center text-ivory/40 hover:text-ivory transition-all bg-black/40 backdrop-blur-sm hover:bg-white/10"
              >
                <X size={15} />
              </button>
            </Dialog.Close>

            {/* Scrollable content with custom scrollbar */}
            <div
              className="flex-1 overflow-y-auto px-7 py-6 scrollbar-custom"
            >
              {/* Loading */}
              {isLoading && (
                <div className="flex items-center justify-center py-20">
                  <div className="w-8 h-8 border-2 border-white/20 border-t-chartreuse rounded-full animate-spin" />
                </div>
              )}

              {!isLoading && !session && (
                <div className="flex items-center justify-center py-20">
                  <p className="label-mono text-ivory/30">Session not found</p>
                </div>
              )}

              {!isLoading && session && (
                <>
                  {/* ── Header ── */}
                  <div className="mb-7">
                    {/* Badges row */}
                    <div className="flex items-center gap-2 mb-4 flex-wrap">
                      {isLive && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full label-mono text-xs glow-chip">
                          <span className="w-1.5 h-1.5 rounded-full bg-charcoal animate-pulse" />LIVE NOW
                        </span>
                      )}
                      {isUpcoming && !isLive && (
                        <span className="label-mono text-xs font-bold text-charcoal px-3 py-1 rounded-full"
                          style={{ background: "hsl(59 73% 52%)" }}>
                          UPCOMING
                        </span>
                      )}
                      {isEnded && (
                        <span className="label-mono text-xs text-ivory/40 px-3 py-1 rounded-full"
                          style={{ background: "rgba(255,255,255,0.06)", border: "1px dashed rgba(255,255,255,0.15)" }}>
                          ENDED
                        </span>
                      )}
                      {isOnline && (
                        <span className="inline-flex items-center gap-1 label-mono text-xs px-3 py-1 rounded-full"
                          style={{ background: "rgba(99,102,241,0.15)", border: "1px dashed rgba(99,102,241,0.4)", color: "#a5b4fc" }}>
                          <Wifi size={11} />ONLINE
                        </span>
                      )}
                      {!isOnline && session.room && (
                        <span className="inline-flex items-center gap-1 label-mono text-xs text-ivory/60 px-3 py-1 rounded-full"
                          style={{ background: "rgba(255,255,255,0.06)", border: "1px dashed rgba(255,255,255,0.15)" }}>
                          <MapPin size={11} />{session.room.name}
                        </span>
                      )}
                    </div>

                    <Dialog.Title className="text-display text-[clamp(1.5rem,3.5vw,2.2rem)] text-ivory leading-tight mb-3">
                      {session.title}
                    </Dialog.Title>
                    {session.description && (
                      <p className="text-sm text-ivory/55 leading-relaxed max-w-xl">{session.description}</p>
                    )}
                  </div>

                  {/* ── Info cards (2 cols on mobile, 3 on desktop) ── */}
                  <div className="grid sm:grid-cols-3 gap-3 mb-7">
                    {/* Date & Time */}
                    <div
                      className="rounded-xl p-4 flex flex-col gap-1.5 transition-all hover:-translate-y-0.5"
                      style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-chartreuse/10">
                          <Calendar size={13} className="text-chartreuse" />
                        </div>
                        <span className="label-mono text-ivory/40 text-[0.6rem]">DATE & TIME</span>
                      </div>
                      <p className="text-sm font-semibold text-ivory leading-snug">
                        {startTime && fmtDate(startTime)}
                      </p>
                      <p className="text-xs text-ivory/50">
                        {startTime && fmtTime(startTime)} – {endTime && fmtTime(endTime)}
                      </p>
                    </div>

                    {/* Location */}
                    <div
                      className="rounded-xl p-4 flex flex-col gap-1.5 transition-all hover:-translate-y-0.5"
                      style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-chartreuse/10">
                          <MapPin size={13} className="text-chartreuse" />
                        </div>
                        <span className="label-mono text-ivory/40 text-[0.6rem]">LOCATION</span>
                      </div>
                      <p className="text-sm font-semibold text-ivory">
                        {isOnline ? "Online" : session.room?.name ?? "TBD"}
                      </p>
                      {session.venue && !isOnline && (
                        <p className="text-xs text-ivory/50">{session.venue.name}, {session.venue.city}</p>
                      )}
                    </div>

                    {/* Capacity */}
                    <div
                      className="rounded-xl p-4 flex flex-col gap-1.5 transition-all hover:-translate-y-0.5"
                      style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-chartreuse/10">
                          <Users size={13} className="text-chartreuse" />
                        </div>
                        <span className="label-mono text-ivory/40 text-[0.6rem]">CAPACITY</span>
                      </div>
                      <p className="text-sm font-semibold text-ivory">
                        {session.capacity ? `${session.capacity} seats` : "Open enrollment"}
                      </p>
                      {session.capacity && !isOnline && (
                        <>
                          <div className="w-full h-1.5 rounded-full bg-white/8 overflow-hidden mt-1">
                            <div
                              className="h-full bg-chartreuse rounded-full transition-all"
                              style={{ width: `${Math.min(100, (session.registrationCount / session.capacity) * 100)}%` }}
                            />
                          </div>
                          <p className="text-xs text-ivory/50">
                            {spotsLeft !== null && spotsLeft > 0
                              ? `${spotsLeft} spots left`
                              : spotsLeft === 0 ? "Full" : `${session.registrationCount} registered`}
                          </p>
                        </>
                      )}
                    </div>
                  </div>

                  {/* ── Capacity progress bar (full-width when available) ── */}
                  {session.capacity && !isOnline && spotsLeft !== null && spotsLeft > 0 && spotsLeft <= Math.floor(session.capacity * 0.2) && (
                    <div
                      className="rounded-xl px-4 py-3 flex items-center gap-3 mb-6"
                      style={{ background: "rgba(200,210,50,0.08)", border: "1px solid rgba(200,210,50,0.2)" }}
                    >
                      <span className="text-sm">🔥</span>
                      <p className="text-xs font-semibold text-chartreuse">
                        Almost full — only <strong>{spotsLeft} {spotsLeft === 1 ? "spot" : "spots"}</strong> remaining!
                      </p>
                    </div>
                  )}

                  {/* ── Speakers ── */}
                  {session.speakers.length > 0 && (
                    <div className="mb-7">
                      <p className="label-mono text-ivory/40 mb-3 text-xs flex items-center gap-2">
                        <BadgeCheck size={12} className="text-chartreuse" />
                        SPEAKERS
                      </p>
                      <div className="grid sm:grid-cols-2 gap-2">
                        {session.speakers.map((sp, i) => (
                          <Link
                            key={sp.id}
                            href={`/speakers/${sp.id}`}
                            onClick={() => setOpen(false)}
                            className="flex items-center gap-3 px-3.5 py-3 rounded-xl transition-all hover:-translate-y-0.5 group"
                            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}
                          >
                            <div
                              className="w-10 h-10 rounded-full shrink-0 overflow-hidden flex items-center justify-center text-sm font-bold"
                              style={{ background: AVATAR_COLORS[i % AVATAR_COLORS.length], color: "rgba(0,0,0,0.5)" }}
                            >
                              {sp.avatar
                                ? <Image src={sp.avatar} alt={sp.name} width={40} height={40} className="object-cover w-full h-full" />
                                : sp.name.charAt(0)
                              }
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-semibold text-ivory group-hover:text-chartreuse transition-colors flex items-center gap-1.5">
                                {sp.name}
                                <BadgeCheck size={12} className="text-chartreuse shrink-0" />
                              </p>
                              {sp.bio && (
                                <p className="text-xs text-ivory/45 line-clamp-1 leading-relaxed mt-0.5">
                                  {sp.bio.split(".")[0]}.
                                </p>
                              )}
                            </div>
                            <ChevronRight size={14} className="text-ivory/20 group-hover:text-chartreuse/50 group-hover:translate-x-0.5 transition-all shrink-0" />
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* ── Map (onsite only) ── */}
                  {!isOnline && session.venue && (
                    <div className="mb-7 rounded-xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.06)" }}>
                      <div className="h-36 flex items-center justify-center relative" style={{ background: "#0e0f12" }}>
                        <div className="absolute inset-0 opacity-15"
                          style={{ backgroundImage: "radial-gradient(circle, hsl(59 73% 52% / 0.5) 1.5px, transparent 1.5px)", backgroundSize: "20px 20px" }} />
                        <div className="text-center relative z-10">
                          <div className="w-10 h-10 rounded-full glow-chip flex items-center justify-center mx-auto mb-2">
                            <MapPin size={16} className="text-charcoal" />
                          </div>
                          <p className="text-sm font-bold text-ivory">{session.venue.city}</p>
                          <p className="label-mono text-ivory/40 text-[0.55rem] mt-0.5">{session.venue.neighborhood}</p>
                        </div>
                      </div>
                      <div className="px-4 py-3 flex items-center justify-between" style={{ background: "rgba(255,255,255,0.02)" }}>
                        <div>
                          <p className="text-sm font-semibold text-ivory">{session.venue.name}</p>
                          <p className="text-xs text-ivory/45">{session.venue.neighborhood}, {session.venue.city}</p>
                        </div>
                        {session.room && (
                          <span className="label-mono text-chartreuse text-xs">{session.room.name}</span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* ── Registration form (inline, collapsible) ── */}
                  {!isOnline && isUpcoming && !isEnded && (
                    <div className="mb-7">
                      {!showRegister ? (
                        <button
                          onClick={() => setShowRegister(true)}
                          disabled={isFull}
                          className="w-full flex items-center justify-between px-5 py-4 rounded-xl transition-all hover:border-chartreuse/40 disabled:opacity-40 group/reg"
                          style={{ background: "rgba(255,255,255,0.04)", border: "1px dashed rgba(255,255,255,0.15)" }}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-chartreuse/10 group-hover/reg:bg-chartreuse/20 transition-colors">
                              <Users size={15} className="text-chartreuse" />
                            </div>
                            <div className="text-left">
                              <p className="label-mono text-ivory/80 text-sm font-semibold">
                                {isFull ? "This session is full" : "Attend in person"}
                              </p>
                              {spotsLeft !== null && !isFull && (
                                <p className="label-mono text-ivory/40 text-[0.6rem] mt-0.5">
                                  {spotsLeft} {spotsLeft === 1 ? "spot" : "spots"} remaining
                                </p>
                              )}
                            </div>
                          </div>
                          {!isFull && (
                            <div className="flex items-center gap-1 text-chartreuse">
                              <span className="label-mono text-xs">REGISTER</span>
                              <ChevronRight size={14} className="group-hover/reg:translate-x-0.5 transition-transform" />
                            </div>
                          )}
                        </button>
                      ) : (
                        <form onSubmit={handleRegister} className="rounded-xl p-6 space-y-4"
                          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-chartreuse/10">
                                <Users size={13} className="text-chartreuse" />
                              </div>
                              <p className="label-mono text-ivory/60 text-xs">REGISTER FOR ONSITE</p>
                            </div>
                            <button type="button" onClick={() => setShowRegister(false)}
                              className="w-7 h-7 rounded-lg flex items-center justify-center text-ivory/30 hover:text-ivory hover:bg-white/10 transition-colors">
                              <X size={13} />
                            </button>
                          </div>
                          <input
                            type="text"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            placeholder="Full name"
                            className="w-full px-4 py-3 text-sm text-ivory placeholder-ivory/25 focus:outline-none rounded-lg transition-all focus:border-chartreuse/40"
                            style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
                            required
                          />
                          <input
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            placeholder="Email address"
                            className="w-full px-4 py-3 text-sm text-ivory placeholder-ivory/25 focus:outline-none rounded-lg transition-all focus:border-chartreuse/40"
                            style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
                            required
                          />
                          <button
                            type="submit"
                            disabled={isSubmitting || !name.trim() || !email.trim()}
                            className="w-full py-3 rounded-xl label-mono text-sm font-bold text-charcoal disabled:opacity-50 transition-all hover:brightness-110 active:scale-[0.98]"
                            style={{ background: "hsl(59 73% 52%)", boxShadow: "0 0 0 1px hsl(59 73% 52%/0.3), 0 6px 20px -6px hsl(59 73% 52%/0.5)" }}
                          >
                            {isSubmitting ? "Confirming…" : "Confirm My Spot"}
                          </button>
                        </form>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>

            {/* ── Sticky CTA footer ── */}
            {!isLoading && session && (
              <div
                className="shrink-0 px-7 py-4 flex items-center gap-3"
                style={{ borderTop: "1px solid rgba(255,255,255,0.06)", background: "rgba(0,0,0,0.3)", backdropFilter: "blur(8px)" }}
              >
                {isLive ? (
                  <button
                    onClick={() => { router.push(`/sessions/${sessionId}/live`); setOpen(false); }}
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl label-mono text-sm font-bold text-charcoal hover:brightness-110 transition-all active:scale-[0.98]"
                    style={{ background: "hsl(59 73% 52%)", boxShadow: "0 0 0 1px hsl(59 73% 52%/0.4), 0 8px 20px -8px hsl(59 73% 52%/0.5)" }}
                  >
                    <Play size={14} fill="currentColor" />
                    WATCH LIVE
                  </button>
                ) : isUpcoming ? (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        disabled
                        className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl label-mono text-sm font-bold text-ivory/40 cursor-not-allowed transition-all"
                        style={{
                          background: "rgba(255,255,255,0.04)",
                          border: "1px dashed rgba(255,255,255,0.12)",
                        }}
                      >
                        <Clock size={14} />
                        NOT YET LIVE
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      {startTime ? formatSessionStartsAt(startTime) : "Session not yet started"}
                    </TooltipContent>
                  </Tooltip>
                ) : (
                  <div className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl label-mono text-sm text-ivory/40"
                    style={{ background: "rgba(255,255,255,0.04)", border: "1px dashed rgba(255,255,255,0.12)" }}>
                    <Clock size={14} />
                    SESSION ENDED
                  </div>
                )}
              </div>
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}