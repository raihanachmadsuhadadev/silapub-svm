"use client";

import { Loader2 } from "lucide-react";

export function LoadingState({ label = "Memuat data..." }: { label?: string }) {
  return (
    <div className="flex items-center justify-center gap-3 rounded-2xl bg-white/35 px-6 py-10 text-sm font-semibold text-slate-600 ring-1 ring-white/60">
      <Loader2 className="animate-spin text-blue-700" size={20} />
      {label}
    </div>
  );
}
