"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";

type SnackbarKind = "success" | "error";
type SnackbarMessage = { text: string; kind: SnackbarKind };
type SnackbarContextValue = { notify: (text: string, kind?: SnackbarKind) => void };

const SnackbarContext = createContext<SnackbarContextValue | null>(null);

export function SnackbarProvider({ children }: { children: ReactNode }) {
  const [message, setMessage] = useState<SnackbarMessage | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const notify = useCallback((text: string, kind: SnackbarKind = "success") => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setMessage({ text, kind });
    timeoutRef.current = setTimeout(() => setMessage(null), 5000);
  }, []);

  useEffect(() => () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  }, []);

  return (
    <SnackbarContext.Provider value={{ notify }}>
      {children}
      {message && (
        <div
          role={message.kind === "error" ? "alert" : "status"}
          aria-live={message.kind === "error" ? "assertive" : "polite"}
          className={`fixed bottom-5 left-1/2 z-[100] flex w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 items-center justify-between gap-4 rounded-xl px-5 py-4 text-sm font-semibold text-white shadow-xl ${
            message.kind === "error" ? "bg-red-700" : "bg-emerald-700"
          }`}
        >
          <span>{message.text}</span>
          <button
            type="button"
            onClick={() => setMessage(null)}
            aria-label="Fechar notificação"
            className="shrink-0 text-xl leading-none"
          >
            ×
          </button>
        </div>
      )}
    </SnackbarContext.Provider>
  );
}

export function useSnackbar() {
  const context = useContext(SnackbarContext);
  if (!context) {
    throw new Error("useSnackbar deve ser usado dentro de SnackbarProvider.");
  }
  return context;
}
