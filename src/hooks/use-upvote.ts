"use client";

import { useState, useCallback } from "react";
import { api } from "@/lib/api";

const VISITOR_ID_KEY = "hibento_visitor_id";
const UPVOTED_STORAGE_PREFIX = "hibento_upvoted_";

function getVisitorId(): string {
  if (typeof window === "undefined") return "";
  let id = sessionStorage.getItem(VISITOR_ID_KEY);
  if (!id) {
    id = crypto.randomUUID();
    sessionStorage.setItem(VISITOR_ID_KEY, id);
  }
  return id;
}

function loadUpvotedSet(sessionId: string): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const saved = localStorage.getItem(`${UPVOTED_STORAGE_PREFIX}${sessionId}`);
    return saved ? new Set(JSON.parse(saved)) : new Set();
  } catch {
    return new Set();
  }
}

function persistUpvotedSet(sessionId: string, set: Set<string>): void {
  localStorage.setItem(
    `${UPVOTED_STORAGE_PREFIX}${sessionId}`,
    JSON.stringify(Array.from(set)),
  );
}

export function useUpvote(sessionId: string, onRefetch?: () => void) {
  const visitorId = getVisitorId();
  const [upvotedQuestions, setUpvotedQuestions] = useState<Set<string>>(() =>
    loadUpvotedSet(sessionId),
  );
  const [upvotingQuestions, setUpvotingQuestions] = useState<Set<string>>(new Set());
  const [upvoteCounts, setUpvoteCounts] = useState<Record<string, number>>({});

  const handleUpvote = useCallback(
    async (questionId: string, toast?: (message: string, type?: "success" | "error" | "info") => void) => {
      if (upvotingQuestions.has(questionId)) return;
      const isAlreadyUpvoted = upvotedQuestions.has(questionId);
      setUpvotingQuestions((prev) => new Set(prev).add(questionId));
      try {
        const res = await api.upvoteQuestion(questionId, visitorId);
        setUpvoteCounts((prev) => ({ ...prev, [questionId]: res.upvotes }));
        setUpvotedQuestions((prev) => {
          const next = new Set(prev);
          if (isAlreadyUpvoted) next.delete(questionId);
          else next.add(questionId);
          persistUpvotedSet(sessionId, next);
          return next;
        });
        toast?.(
          isAlreadyUpvoted ? "Upvote removed" : "Question upvoted!",
          "success",
        );
        onRefetch?.();
      } catch {
        toast?.("Error toggling upvote", "error");
      } finally {
        setUpvotingQuestions((prev) => {
          const next = new Set(prev);
          next.delete(questionId);
          return next;
        });
      }
    },
    [upvotedQuestions, upvotingQuestions, visitorId, onRefetch, sessionId],
  );

  return { upvotedQuestions, upvotingQuestions, handleUpvote, upvoteCounts };
}
