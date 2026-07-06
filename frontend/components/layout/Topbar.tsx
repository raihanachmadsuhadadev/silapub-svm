import { Bell, Search, UserCircle2 } from "lucide-react";

type TopbarProps = {
  title: string;
  subtitle?: string;
  showNotification?: boolean;
};

export function Topbar({ title, subtitle, showNotification = false }: TopbarProps) {
  return (
    <header className="glass-panel sticky top-0 z-20 flex flex-col gap-4 rounded-none border-x-0 border-t-0 px-4 py-4 sm:px-6 lg:rounded-b-3xl lg:border-x lg:px-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{subtitle}</p>
          <h1 className="mt-1 text-2xl font-bold text-slate-900">{title}</h1>
        </div>

        <div className="flex items-center gap-3">
          <label className="relative min-w-0 flex-1 md:w-72">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />
            <input
              className="h-11 w-full rounded-xl border border-white/60 bg-white/55 pl-10 pr-4 text-sm outline-none focus:border-blue-300 focus:ring-4 focus:ring-blue-500/10"
              placeholder="Cari..."
            />
          </label>

          {showNotification ? (
            <button
              className="flex size-11 items-center justify-center rounded-xl bg-white/55 text-slate-600 ring-1 ring-white/70"
              aria-label="Notifikasi"
              type="button"
            >
              <Bell size={19} />
            </button>
          ) : null}

          <button
            className="flex h-11 items-center gap-2 rounded-xl bg-white/55 px-3 text-sm font-semibold text-slate-700 ring-1 ring-white/70"
            type="button"
          >
            <UserCircle2 size={19} />
            <span className="hidden sm:inline">Akun</span>
          </button>
        </div>
      </div>
    </header>
  );
}
