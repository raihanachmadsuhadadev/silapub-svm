"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { CheckCircle2, Info, TriangleAlert, X, XCircle } from "lucide-react";

type ToastType = "success" | "error" | "warning" | "info";

type Toast = {
  id: number;
  type: ToastType;
  title: string;
  description?: string;
};

type ToastContextValue = {
  showToast: (toast: Omit<Toast, "id">) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

const config = {
  success: { icon: CheckCircle2, className: "text-green-700 bg-green-50 ring-green-100" },
  error: { icon: XCircle, className: "text-red-700 bg-red-50 ring-red-100" },
  warning: { icon: TriangleAlert, className: "text-amber-700 bg-amber-50 ring-amber-100" },
  info: { icon: Info, className: "text-blue-700 bg-blue-50 ring-blue-100" },
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: number) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback((toast: Omit<Toast, "id">) => {
    const id = Date.now() + Math.random();
    setToasts((current) => [...current, { ...toast, id }]);
    window.setTimeout(() => removeToast(id), 3800);
  }, [removeToast]);

  const value = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex w-[calc(100%-2rem)] max-w-sm flex-col gap-3 sm:bottom-6 sm:right-6">
        {toasts.map((toast) => {
          const item = config[toast.type];
          const Icon = item.icon;
          return (
            <div
              className={`glass-card flex items-start gap-3 rounded-2xl p-4 ring-1 ${item.className}`}
              key={toast.id}
            >
              <Icon className="mt-0.5 shrink-0" size={18} />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold">{toast.title}</p>
                {toast.description ? (
                  <p className="mt-1 text-xs leading-5 text-slate-600">{toast.description}</p>
                ) : null}
              </div>
              <button
                className="rounded-lg p-1 text-slate-500 hover:bg-white/50"
                type="button"
                onClick={() => removeToast(toast.id)}
                aria-label="Tutup notifikasi"
              >
                <X size={15} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used inside ToastProvider");
  }

  return context;
}
