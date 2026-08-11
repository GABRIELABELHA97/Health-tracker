import { useState, useCallback } from "react";

export type SaveStatus = "idle" | "saving" | "saved" | "error";

export function useSaveStatus(resetDelay = 2000) {
  const [status, setStatus] = useState<SaveStatus>("idle");

  const markSaving = useCallback(() => {
    setStatus("saving");
  }, []);

  const markSaved = useCallback(() => {
    setStatus("saved");
    const timer = setTimeout(() => setStatus("idle"), resetDelay);
    return () => clearTimeout(timer);
  }, [resetDelay]);

  const markError = useCallback(() => {
    setStatus("error");
    const timer = setTimeout(() => setStatus("idle"), resetDelay);
    return () => clearTimeout(timer);
  }, [resetDelay]);

  return { status, markSaving, markSaved, markError };
}
