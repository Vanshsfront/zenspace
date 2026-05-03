"use client";

import { createContext, useCallback, useContext, useState, type ReactNode } from "react";

type ToastKind = "success" | "error" | "info";
type ToastItem = { id: number; kind: ToastKind; message: string };
type Ctx = { push: (kind: ToastKind, message: string) => void };

const ToastCtx = createContext<Ctx | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);

  const push = useCallback((kind: ToastKind, message: string) => {
    const id = Date.now() + Math.random();
    setItems((prev) => [...prev, { id, kind, message }]);
    setTimeout(() => setItems((prev) => prev.filter((t) => t.id !== id)), 3500);
  }, []);

  return (
    <ToastCtx.Provider value={{ push }}>
      {children}
      <div
        role="status"
        aria-live="polite"
        className="fixed bottom-6 right-6 z-[1000] flex flex-col gap-2 pointer-events-none"
      >
        {items.map((t) => (
          <div
            key={t.id}
            className={`pointer-events-auto px-5 py-3 rounded-xl shadow-2xl text-sm font-medium backdrop-blur-md border animate-[fadeUp_0.25s_ease-out_both] ${
              t.kind === "success"
                ? "bg-emerald-600/90 text-white border-emerald-500"
                : t.kind === "error"
                ? "bg-red-600/90 text-white border-red-500"
                : "bg-stone-900/90 text-white border-stone-700"
            }`}
          >
            {t.message}
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastCtx);
  if (!ctx) {
    // Fallback so a stray call from outside the provider doesn't crash;
    // useful in tests / storybook stubs.
    return { push: (_: ToastKind, m: string) => console.warn("[toast]", m) } as Ctx;
  }
  return ctx;
}
