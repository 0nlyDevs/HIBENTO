"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useGetEventSession } from "@/lib/hooks/useSessions";
import { api } from "@/lib/api";
import { useToast } from "@/components/Toast";
import { formatDate } from "@/lib/utils/dates";

const baseTabs = [
  { id: "info" as const, label: "INFO" },
  { id: "speakers" as const, label: "SPEAKERS" },
];

export default function SessionDetailPage() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const router = useRouter();
  const { data: session, isLoading } = useGetEventSession(sessionId);
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState<"info" | "speakers" | "location">("info");

  const [showSignupForm, setShowSignupForm] = useState(false);
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [isSigningUp, setIsSigningUp] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-charcoal border-t-yellow animate-spin" />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-cream flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold text-charcoal">SESSION NOT FOUND</h1>
        <Link href="/events" className="text-sm text-charcoal/60 hover:text-charcoal underline">
          Back to events
        </Link>
      </div>
    );
  }

  const now = new Date();
  const startTime = new Date(session.startTime);
  const endTime = new Date(session.endTime);
  const isUpcoming = now < startTime;
  const isEnded = now > endTime;
  const isLive = session.isLive;
  const isOnline = session.isOnline;

  const handleEnterSession = () => {
    toast("You are now inside the session!", "success");
    router.push(`/sessions/${sessionId}/live`);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signupName.trim() || !signupEmail.trim()) return;

    setIsSigningUp(true);
    try {
      await api.registerForSession(sessionId, {
        name: signupName.trim(),
        email: signupEmail.trim(),
      });
      setSignupName("");
      setSignupEmail("");
      setShowSignupForm(false);
      toast("Check your email for confirmation!", "success");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Registration failed";
      toast(message, "error");
    } finally {
      setIsSigningUp(false);
    }
  };

  const spotsLeft = session.capacity ? session.capacity - session.registrationCount : null;
  const isFull = spotsLeft !== null && spotsLeft <= 0;

  return (
    <div className="min-h-screen bg-cream">
      {/* Navigation */}
      <nav className="sticky top-0 z-40 bg-cream/95 backdrop-blur border-b border-charcoal/10">
        <div className="max-w-full mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <Image src="/logo.svg" alt="HiBento" width={28} height={28} />
            <span className="font-bold text-xl tracking-tighter text-charcoal">HIBENTO</span>
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/events" className="text-sm font-bold text-charcoal border-b-2 border-charcoal">
              EVENTS
            </Link>
            <Link href="/speakers" className="text-sm text-charcoal/60 hover:text-charcoal">
              SPEAKERS
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-10">
        {/* Back link */}
        <Link
          href="/events"
          className="inline-flex items-center gap-2 text-xs tracking-wider text-charcoal/40 hover:text-charcoal mb-8"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M7 3L4 6L7 9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
          BACK TO EVENTS
        </Link>

        {/* Session Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            {isLive && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[0.6rem] font-bold bg-nori text-cream">
                <span className="w-1 h-1 bg-cream animate-pulse" />
                LIVE
              </span>
            )}
            {isUpcoming && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[0.6rem] font-bold bg-matcha text-cream">
                UPCOMING
              </span>
            )}
            {isEnded && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[0.6rem] font-bold text-charcoal/40 border border-charcoal/20">
                ENDED
              </span>
            )}
            {isOnline && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[0.6rem] font-bold bg-indigo text-cream">
                ONLINE
              </span>
            )}
            {!isOnline && session.room && (
              <span className="text-xs tracking-wider text-charcoal/40">{session.room.name}</span>
            )}
          </div>
          <h1 className="text-4xl font-black tracking-tighter text-charcoal mb-4">{session.title}</h1>
          {session.description && (
            <p className="text-base text-charcoal/60 leading-relaxed">{session.description}</p>
          )}
          {!isOnline && (
            <p className="text-xs text-charcoal/40 mt-3 flex items-center gap-2">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0">
                <rect x="2" y="3" width="20" height="14" rx="2" />
                <path d="M8 21H16" strokeLinecap="round" />
                <path d="M12 17V21" strokeLinecap="round" />
              </svg>
              This session is <strong>onsite</strong> — you can watch online or attend in person.
            </p>
          )}
        </div>

        {/* Tabs */}
        <div className="flex border-b border-charcoal/10 mb-8">
          {[...baseTabs, ...(!isOnline ? [{ id: "location" as const, label: "LOCATION" }] : [])].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 text-xs tracking-widest font-bold transition-all ${
                activeTab === tab.id
                  ? "text-charcoal border-b-2 border-charcoal"
                  : "text-charcoal/40 hover:text-charcoal/60"
              }`}
            >
              {tab.label}
              {tab.id === "speakers" && ` (${session.speakers.length})`}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="animate-fade-in min-h-[300px]">
          {/* Info Tab */}
          {activeTab === "info" && (
            <div className="grid grid-cols-2 gap-px bg-charcoal/10">
              <div className="bg-paper p-5">
                <div className="text-[0.6rem] tracking-wider text-charcoal/40 mb-1">DATE</div>
                <div className="text-sm font-bold text-charcoal">
                  {formatDate(startTime, "long")}
                </div>
              </div>
              <div className="bg-paper p-5">
                <div className="text-[0.6rem] tracking-wider text-charcoal/40 mb-1">TIME</div>
                <div className="text-sm font-bold text-charcoal">
                  {startTime.toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                  {" – "}
                  {endTime.toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
              <div className="bg-paper p-5">
                <div className="text-[0.6rem] tracking-wider text-charcoal/40 mb-1">ROOM</div>
                <div className="text-sm font-bold text-charcoal">
                  {isOnline ? "Online — Watch anywhere" : session.room?.name ?? "TBD"}
                </div>
                {!isOnline && session.venue && (
                  <div className="text-[0.6rem] text-charcoal/40 mt-1">
                    {session.venue.name}
                  </div>
                )}
              </div>
              <div className="bg-paper p-5">
                <div className="text-[0.6rem] tracking-wider text-charcoal/40 mb-1">CAPACITY</div>
                <div className="text-sm font-bold text-charcoal">
                  {session.capacity ? `${session.capacity} people` : "N/A"}
                </div>
                {!isOnline && session.capacity && (
                  <div className="text-[0.6rem] text-charcoal/40 mt-1">
                    {session.registrationCount} signed up
                    {session.registrationCount >= session.capacity && " — FULL"}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Speakers Tab */}
          {activeTab === "speakers" && (
            <div>
              {session.speakers.length === 0 ? (
                <p className="text-sm text-charcoal/40">No speakers assigned to this session.</p>
              ) : (
                <div className="grid sm:grid-cols-2 gap-4">
                  {session.speakers.map((speaker) => (
                    <Link
                      key={speaker.id}
                      href={`/speakers/${speaker.id}`}
                      className="flex items-center gap-4 p-4 border border-charcoal/10 bg-rice hover:bg-yellow/5 transition-all group"
                    >
                      <div className="w-14 h-14 bg-charcoal/5 flex items-center justify-center shrink-0 overflow-hidden">
                        {speaker.avatar ? (
                          <Image
                            src={speaker.avatar}
                            alt={speaker.name}
                            width={56}
                            height={56}
                            className="object-cover"
                          />
                        ) : (
                          <span className="text-xl font-bold text-charcoal/20">
                            {speaker.name.charAt(0)}
                          </span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-charcoal group-hover:text-yellow-dark transition-colors text-sm">
                          {speaker.name}
                        </h3>
                        {speaker.bio && (
                          <p className="text-xs text-charcoal/50 line-clamp-2 mt-1">{speaker.bio}</p>
                        )}
                      </div>
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 14 14"
                        fill="none"
                        className="text-charcoal/20 group-hover:text-charcoal/40 shrink-0"
                      >
                        <path
                          d="M5 3L9 7L5 11"
                          stroke="currentColor"
                          strokeWidth="1.2"
                          strokeLinecap="round"
                        />
                      </svg>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Location Tab */}
          {activeTab === "location" && (
            <div className="space-y-4">
              {isOnline ? (
                <div className="border border-charcoal/10 bg-paper p-8 flex flex-col items-center justify-center text-center">
                  <svg
                    width="40"
                    height="40"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    className="text-indigo mb-3"
                  >
                    <rect x="2" y="3" width="20" height="14" rx="2" />
                    <path d="M8 21H16" strokeLinecap="round" />
                    <path d="M12 17V21" strokeLinecap="round" />
                  </svg>
                  <p className="text-sm font-bold text-charcoal mb-1">Online Session</p>
                  <p className="text-xs text-charcoal/50">
                    This session is held online. No physical location.
                  </p>
                </div>
              ) : (
                <>
                  <div className="border border-charcoal/10 bg-paper p-5">
                    <div className="text-[0.6rem] tracking-wider text-charcoal/40 mb-1">ROOM</div>
                    <div className="text-sm font-bold text-charcoal">{session.room?.name ?? "TBD"}</div>
                    {session.room?.capacity && (
                      <div className="text-xs text-charcoal/40 mt-1">
                        Capacity: {session.room.capacity} people
                      </div>
                    )}
                  </div>

                  {session.venue && (
                    <div className="border border-charcoal/10 bg-paper p-5">
                      <div className="text-[0.6rem] tracking-wider text-charcoal/40 mb-1">VENUE</div>
                      <div className="text-sm font-bold text-charcoal">{session.venue.name}</div>
                      <div className="text-xs text-charcoal/50 mt-1">
                        {session.venue.neighborhood}, {session.venue.city}
                      </div>
                    </div>
                  )}

                  {/* Map Placeholder */}
                  <div className="w-full h-56 bg-paper border border-charcoal/10 flex items-center justify-center">
                    <div className="text-center text-charcoal/40">
                      <svg
                        width="40"
                        height="40"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        className="mx-auto mb-3"
                      >
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                      <p className="text-sm font-medium">Map Placeholder</p>
                      <p className="text-xs mt-1">
                        {session.venue
                          ? `${session.venue.name} – ${session.venue.city}`
                          : session.room?.name ?? "Location TBD"}
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Action Area */}
        <div className="mt-10 pt-8 border-t border-charcoal/10">
          {isLive || isUpcoming ? (
            <div className="flex flex-wrap items-start gap-6">
              {/* Watch Online — primary action for all sessions */}
              <div>
                <button onClick={handleEnterSession} className="btn-primary">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <polygon points="5 3 19 12 5 21 5 3" />
                  </svg>
                  {isLive ? "WATCH LIVE" : "WATCH ONLINE"}
                </button>
                <p className="text-[0.6rem] text-charcoal/40 mt-2 tracking-wider">
                  {isLive 
                    ? "Session is live — join the stream now"
                    : "No registration needed — just join and watch"}
                </p>
              </div>

              {/* Attend In Person — only for upcoming onsite sessions */}
              {!isOnline && isUpcoming && (
                <div>
                  <button
                    onClick={() => setShowSignupForm(true)}
                    disabled={isFull}
                    className={`btn-outline btn-sm ${isFull ? "opacity-40 cursor-not-allowed" : ""}`}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    {isFull
                      ? "ONSITE FULL"
                      : spotsLeft !== null
                        ? `ATTEND IN PERSON (${spotsLeft} LEFT)`
                        : "ATTEND IN PERSON"}
                  </button>
                  <p className="text-[0.6rem] text-charcoal/40 mt-2 tracking-wider">
                    {session.room?.name} · {session.venue?.name ?? ""}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2 text-sm text-charcoal/40">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1" />
                <path d="M8 5V8L10 10" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
              </svg>
              This session has ended
            </div>
          )}
        </div>

        {/* Signup Modal */}
        {showSignupForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40" onClick={() => { setShowSignupForm(false); setSignupName(""); setSignupEmail(""); }} />
            <div className="relative bg-cream border border-charcoal/10 w-full max-w-md animate-slide-up">
              <div className="p-8">
                {/* Close */}
                <button
                  onClick={() => { setShowSignupForm(false); setSignupName(""); setSignupEmail(""); }}
                  className="absolute top-4 right-4 text-charcoal/30 hover:text-charcoal"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M4 4L12 12M12 4L4 12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                  </svg>
                </button>

                {/* Header */}
                <div className="mb-6">
                  <div className="w-10 h-10 bg-yellow flex items-center justify-center mb-4">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-black tracking-tighter text-charcoal">Attend In Person</h2>
                  <p className="text-xs text-charcoal/50 mt-1">{session.title}</p>

                  {/* Spots indicator */}
                  {session.capacity && (
                    <div className="mt-4 flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-charcoal/10">
                        <div
                          className="h-full bg-yellow transition-all"
                          style={{ width: `${Math.min(100, (session.registrationCount / session.capacity) * 100)}%` }}
                        />
                      </div>
                      <span className="text-[0.6rem] font-bold tracking-wider text-charcoal/50 whitespace-nowrap">
                        {spotsLeft !== null ? `${spotsLeft} of ${session.capacity} left` : `${session.registrationCount} signed up`}
                      </span>
                    </div>
                  )}
                </div>

                {/* Form */}
                <form onSubmit={handleSignup} className="space-y-4">
                  <div>
                    <label className="block text-[0.6rem] tracking-widest text-charcoal/50 mb-1.5">NAME</label>
                    <input
                      type="text"
                      value={signupName}
                      onChange={(e) => setSignupName(e.target.value)}
                      placeholder="Your full name"
                      className="input-field text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[0.6rem] tracking-widest text-charcoal/50 mb-1.5">EMAIL</label>
                    <input
                      type="email"
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      placeholder="your@email.com"
                      className="input-field text-sm"
                      required
                    />
                  </div>
                  <div className="flex items-center gap-3 pt-2">
                    <button
                      type="submit"
                      disabled={isSigningUp || !signupName.trim() || !signupEmail.trim()}
                      className="btn-primary flex-1 justify-center text-sm"
                    >
                      {isSigningUp ? "REGISTERING..." : "REGISTER"}
                    </button>
                    <button
                      type="button"
                      onClick={() => { setShowSignupForm(false); setSignupName(""); setSignupEmail(""); }}
                      className="btn-ghost text-sm"
                    >
                      CANCEL
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
