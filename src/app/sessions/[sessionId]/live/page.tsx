"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { PageLoader } from "@/components/ui/Spinner";

export default function SessionLiveRedirectPage() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const router = useRouter();

  useEffect(() => {
    if (sessionId) {
      router.replace(`/sessions/${sessionId}`);
    }
  }, [sessionId, router]);

  return <PageLoader className="min-h-screen" />;
}
