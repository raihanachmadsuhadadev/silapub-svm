import type { LucideIcon } from "lucide-react";
import { Building2 } from "lucide-react";
import Link from "next/link";

export type SidebarItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

type SidebarProps = {
  items: SidebarItem[];
  activeLabel: string;
  roleLabel: string;
};

export function Sidebar({ items, activeLabel, roleLabel }: SidebarProps) {
  return (
    <aside className="hidden w-72 shrink-0 p-4 lg:block">
      <div className="glass-card sticky top-4 flex min-h-[calc(100vh-2rem)] flex-col rounded-3xl p-5">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex size-11 items-center justify-center rounded-2xl bg-blue-600 text-white">
            <Building2 size={20} />
          </span>
          <span>
            <span className="block text-lg font-bold text-slate-900">SILAPUB</span>
            <span className="block text-xs font-medium text-slate-500">
              {roleLabel}
            </span>
          </span>
        </Link>

        <nav className="mt-8 space-y-2">
          {items.map((item) => {
            const Icon = item.icon;
            const active = item.label === activeLabel;

            return (
              <Link
                href={item.href}
                key={item.label}
                className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                  active
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                    : "text-slate-600 hover:bg-white/55 hover:text-slate-900"
                }`}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
