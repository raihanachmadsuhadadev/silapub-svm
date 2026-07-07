"use client";

import { Loader2, TriangleAlert } from "lucide-react";
import { GlassButton } from "@/components/ui/GlassButton";

type ConfirmDialogProps = {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "primary";
  loading?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Ya, lanjutkan",
  cancelLabel = "Batal",
  variant = "primary",
  loading = false,
  onCancel,
  onConfirm,
}: ConfirmDialogProps) {
  if (!open) {
    return null;
  }

  const confirmClass = variant === "danger" ? "bg-red-600 text-white hover:bg-red-700" : "";

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/35 p-4 backdrop-blur-sm">
      <div className="glass-card w-full max-w-md rounded-2xl p-6">
        <div className="flex items-start gap-3">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-amber-50 text-amber-700 ring-1 ring-amber-100">
            <TriangleAlert size={20} />
          </span>
          <div>
            <h2 className="text-lg font-bold text-slate-900">{title}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
          </div>
        </div>
        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <GlassButton variant="secondary" onClick={onCancel} disabled={loading}>
            {cancelLabel}
          </GlassButton>
          <GlassButton className={confirmClass} onClick={onConfirm} disabled={loading}>
            {loading ? <Loader2 className="animate-spin" size={18} /> : null}
            {confirmLabel}
          </GlassButton>
        </div>
      </div>
    </div>
  );
}
