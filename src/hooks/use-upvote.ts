"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { api } from "@/lib/api";

const VISITOR_ID_KEY = "hibento_visitor_id";
const UPVOTED_STORAGE_PREFIX = "hibento_upvoted_";

function generateUUID(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function getVisitorId(): string {
  if (typeof window === "undefined") return "";
  let id = sessionStorage.getItem(VISITOR_ID_KEY);
  if (!id) {
    id = generateUUID();
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
  const visitorIdRef = useRef<string>("");
  const [upvotedQuestions, setUpvotedQuestions] = useState<Set<string>>(() =>
    loadUpvotedSet(sessionId),
  );
  const [upvotingQuestions, setUpvotingQuestions] = useState<Set<string>>(new Set());
  const upvotedRef = useRef(upvotedQuestions);
  const upvotingRef = useRef(upvotingQuestions);
  const onRefetchRef = useRef(onRefetch);

  useEffect(() => {
    upvotedRef.current = upvotedQuestions;
  }, [upvotedQuestions]);

  useEffect(() => {
    upvotingRef.current = upvotingQuestions;
  }, [upvotingQuestions]);

  useEffect(() => {
    onRefetchRef.current = onRefetch;
  }, [onRefetch]);

  useEffect(() => {
    visitorIdRef.current = getVisitorId();
  }, []);

  const handleUpvote = useCallback(
    async (questionId: string, toast?: (message: string, type?: "success" | "error" | "info") => void) => {
      if (upvotingRef.current.has(questionId)) return;
      const isAlreadyUpvoted = upvotedRef.current.has(questionId);
      setUpvotingQuestions((prev) => new Set(prev).add(questionId));
      try {
        await api.upvoteQuestion(questionId, visitorIdRef.current);
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
        onRefetchRef.current?.();
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
    [sessionId],
  );

  return { upvotedQuestions, upvotingQuestions, handleUpvote };
}
