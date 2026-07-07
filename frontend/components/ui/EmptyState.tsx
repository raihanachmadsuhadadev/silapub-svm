"use client";

import type { LucideIcon } from "lucide-react";
import { Inbox } from "lucide-react";
import { GlassButton } from "@/components/ui/GlassButton";

type EmptyStateProps = {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
};

export function EmptyState({
  icon: Icon = Inbox,
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl bg-white/35 px-6 py-10 text-center ring-1 ring-white/60">
      <span className="flex size-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-700 ring-1 ring-blue-100">
        <Icon size={22} />
      </span>
      <h3 className="mt-4 text-base font-bold text-slate-900">{title}</h3>
      <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">{description}</p>
      {actionLabel && (actionHref || onAction) ? (
        <GlassButton className="mt-5" href={actionHref} onClick={onAction}>
          {actionLabel}
        </GlassButton>
      ) : null}
    </div>
  );
}
