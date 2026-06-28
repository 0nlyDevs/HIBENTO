"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import * as Dialog from "@radix-ui/react-dialog";
import { useGetEventSession } from "@/lib/hooks/useSessions";
import {
  X, Play, MapPin, Calendar, Clock,
} from "lucide-react";
import {
  Tooltip, TooltipTrigger, TooltipContent, TooltipProvider,
} from "@/components/ui/tooltip";
import { Spinner } from "@/components/ui/Spinner";
import { SessionBadges } from "@/components/ui/SessionBadges";
import { SpeakerCard } from "@/components/ui/SpeakerCard";
import { VenueCard } from "@/components/ui/VenueCard";
import { formatSessionStartsAt, formatTime, formatFullDate } from "@/lib/utils/dates";
import { getSessionStatus } from "@/lib/utils/session-status";
import { ROUTES } from "@/constants/routes";

interface SessionModalProps {
  sessionId: string;
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

function InfoCard({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div
      className="rounded-xl p-4 flex flex-col gap-1.5 transition-all hover:-translate-y-0.5"
      style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
    >
      <div className="flex items-center gap-2 mb-1">
        <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-chartreuse/10">
          {icon}
        </div>
        <span className="label-mono text-ivory/40 text-[0.6rem]">{label}</span>
      </div>
      {children}
    </div>
  );
}

function ModalFooter({ sessionId, isLive, isUpcoming, startTime, onClose }: {
  sessionId: string;
  isLive: boolean;
  isUpcoming: boolean;
  startTime: Date | null;
  onClose: () => void;
}) {
  const router = useRouter();

  return (
    <div
      className="shrink-0 px-7 py-4 flex items-center gap-3"
      style={{
        borderTop: "1px solid rgba(255,255,255,0.06)",
        background: "rgba(0,0,0,0.3)",
        backdropFilter: "blur(8px)",
      }}
    >
      <Link
        href={ROUTES.SESSION_DETAIL(sessionId)}
        onClick={onClose}
        className="flex items-center justify-center gap-1.5 px-5 py-3 rounded-xl label-mono text-xs font-bold text-ivory/70 hover:text-ivory hover:bg-white/5 transition-all border border-dashed border-ivory/20 shrink-0"
      >
        VIEW FULL DETAILS
      </Link>
      {isLive ? (
        <button
          onClick={() => {
            router.push(ROUTES.SESSION_LIVE(sessionId));
            onClose();
          }}
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl label-mono text-sm font-bold text-charcoal hover:brightness-110 transition-all active:scale-[0.98]"
          style={{
            background: "hsl(59 73% 52%)",
            boxShadow: "0 0 0 1px hsl(59 73% 52%/0.4), 0 8px 20px -8px hsl(59 73% 52%/0.5)",
          }}
        >
          <Play size={14} fill="currentColor" />
          WATCH LIVE
        </button>
      ) : isUpcoming ? (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                disabled
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl label-mono text-sm font-bold text-ivory/40 cursor-not-allowed transition-all"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px dashed rgba(255,255,255,0.12)" }}
              >
                <Clock size={14} />
                NOT YET LIVE
              </button>
            </TooltipTrigger>
            <TooltipContent>
              {startTime ? formatSessionStartsAt(startTime) : "Session not yet started"}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ) : (
        <div
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl label-mono text-sm text-ivory/40"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px dashed rgba(255,255,255,0.12)" }}
        >
          <Clock size={14} />
          SESSION ENDED
        </div>
      )}
    </div>
  );
}

export function SessionModal({
  sessionId,
  children,
  open: controlledOpen,
  onOpenChange,
}: SessionModalProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setOpen = onOpenChange || setInternalOpen;

  const { data: session, isLoading } = useGetEventSession(sessionId, {
    enabled: open,
  });

  const startTime = session ? new Date(session.startTime) : null;
  const endTime = session ? new Date(session.endTime) : null;
  const sessionStatus = session
    ? getSessionStatus({ startTime: session.startTime, endTime: session.endTime, isLive: session.isLive })
    : { isLive: false, isUpcoming: false, isEnded: false };
  const { isLive, isUpcoming, isEnded } = sessionStatus;
  const isOnline = session?.isOnline ?? false;

  const closeModal = () => setOpen(false);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm data-[state=open]:animate-fade-in" />

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
            <div className="h-1 w-full bg-chartreuse shrink-0 rounded-t-[1rem]" />

            <Dialog.Close asChild>
              <button
                className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full flex items-center justify-center text-ivory/40 hover:text-ivory transition-all bg-black/40 backdrop-blur-sm hover:bg-white/10"
                aria-label="Close"
              >
                <X size={15} />
              </button>
            </Dialog.Close>

            <div className="flex-1 overflow-y-auto px-7 py-6 scrollbar-custom">
              {isLoading && !session && (
                <div className="flex items-center justify-center py-20">
                  <Spinner className="border-white/20" />
                </div>
              )}

              {!isLoading && !session && (
                <div className="flex items-center justify-center py-20">
                  <p className="label-mono text-ivory/30">Session not found</p>
                </div>
              )}

              {!isLoading && session && (
                <>
                  <div className="mb-7">
                    <SessionBadges
                      isLive={isLive}
                      isUpcoming={isUpcoming}
                      isEnded={isEnded}
                      isOnline={isOnline}
                      roomName={session.room?.name}
                    />

                    <Dialog.Title className="text-display text-[clamp(1.5rem,3.5vw,2.2rem)] text-ivory leading-tight mb-3">
                      {session.title}
                    </Dialog.Title>
                    {session.description && (
                      <p className="text-sm text-ivory/55 leading-relaxed max-w-xl">
                        {session.description}
                      </p>
                    )}
                  </div>

                  <div className="grid sm:grid-cols-2 gap-3 mb-7">
                    <InfoCard icon={<Calendar size={13} className="text-chartreuse" />} label="DATE & TIME">
                      <p className="text-sm font-semibold text-ivory leading-snug">
                        {startTime && formatFullDate(startTime)}
                      </p>
                      <p className="text-xs text-ivory/50">
                        {startTime && formatTime(startTime)} – {endTime && formatTime(endTime)}
                      </p>
                    </InfoCard>

                    <InfoCard icon={<MapPin size={13} className="text-chartreuse" />} label="LOCATION">
                      <p className="text-sm font-semibold text-ivory">
                        {isOnline ? "Online" : (session.room?.name ?? "TBD")}
                      </p>
                      {session.venue && !isOnline && (
                        <p className="text-xs text-ivory/50">
                          {session.venue.name}, {session.venue.city}
                        </p>
                      )}
                    </InfoCard>
                  </div>

                  {session.speakers.length > 0 && (
                    <div className="mb-7">
                      <p className="label-mono text-ivory/40 mb-3 text-xs flex items-center gap-2">
                        SPEAKERS
                      </p>
                      <div className="grid sm:grid-cols-2 gap-2">
                        {session.speakers.map((sp, i) => (
                          <SpeakerCard key={sp.id} speaker={sp} colorIndex={i} onClose={closeModal} />
                        ))}
                      </div>
                    </div>
                  )}

                  <VenueCard venue={session.venue!} room={session.room} isOnline={isOnline} />
                </>
              )}
            </div>

            {!isLoading && session && (
              <ModalFooter
                sessionId={sessionId}
                isLive={isLive}
                isUpcoming={isUpcoming}
                startTime={startTime}
                onClose={closeModal}
              />
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
