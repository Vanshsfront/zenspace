"use client";

import { createContext, useCallback, useContext, useState, type ReactNode } from "react";

type ConfirmOptions = {
  title?: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
};

type Ctx = { confirm: (opts: ConfirmOptions) => Promise<boolean> };

const ConfirmCtx = createContext<Ctx | null>(null);

export function ConfirmProvider({ children }: { children: ReactNode }) {
  const [opts, setOpts] = useState<ConfirmOptions | null>(null);
  const [resolver, setResolver] = useState<((v: boolean) => void) | null>(null);

  const confirm = useCallback((next: ConfirmOptions) => {
    return new Promise<boolean>((resolve) => {
      setOpts(next);
      setResolver(() => resolve);
    });
  }, []);

  const close = (value: boolean) => {
    resolver?.(value);
    setResolver(null);
    setOpts(null);
  };

  return (
    <ConfirmCtx.Provider value={{ confirm }}>
      {children}
      {opts && (
        <div className="fixed inset-0 z-[1100] flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-sm" onClick={() => close(false)}>
          <div
            role="dialog"
            aria-modal="true"
            className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 animate-[fadeUp_0.2s_ease-out_both]"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="font-serif text-2xl text-stone-900 mb-2">{opts.title || "Are you sure?"}</h2>
            <p className="text-stone-600 mb-6">{opts.message}</p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => close(false)}
                className="px-4 py-2 rounded-full text-sm text-stone-700 hover:bg-stone-100"
              >
                {opts.cancelLabel || "Cancel"}
              </button>
              <button
                onClick={() => close(true)}
                className={`px-5 py-2 rounded-full text-sm text-white ${opts.destructive ? "bg-red-600 hover:bg-red-700" : "bg-stone-900 hover:bg-stone-800"}`}
              >
                {opts.confirmLabel || (opts.destructive ? "Delete" : "Confirm")}
              </button>
            </div>
          </div>
        </div>
      )}
    </ConfirmCtx.Provider>
  );
}

export function useConfirm() {
  const ctx = useContext(ConfirmCtx);
  if (!ctx) {
    return { confirm: async (o: ConfirmOptions) => window.confirm(o.message) } as Ctx;
  }
  return ctx;
}
