import type { ReactNode } from "react";
import Link from "next/link";
import { Building2 } from "lucide-react";

type AuthLayoutProps = {
  children: ReactNode;
  title: string;
  description: string;
};

export function AuthLayout({ children, title, description }: AuthLayoutProps) {
  return (
    <main className="app-gradient-bg flex min-h-screen items-center justify-center px-4 py-8 sm:px-6">
      <section className="glass-card grid w-full max-w-6xl overflow-hidden rounded-3xl p-0 lg:grid-cols-[0.95fr_1.05fr]">
        <aside className="relative min-h-80 overflow-hidden bg-gradient-to-br from-blue-600/90 via-teal-600/80 to-violet-600/80 p-8 text-white sm:p-10">
          <Link href="/" className="inline-flex items-center gap-3">
            <span className="flex size-11 items-center justify-center rounded-2xl bg-white/20 ring-1 ring-white/30">
              <Building2 size={21} />
            </span>
            <span>
              <span className="block text-lg font-bold">SILAPUB</span>
              <span className="block text-xs text-white/75">
                Aspirasi warga terstruktur
              </span>
            </span>
          </Link>

          <div className="relative z-10 mt-20 max-w-md">
            <p className="text-sm font-semibold uppercase text-white/70">
              Layanan publik digital
            </p>
            <h1 className="mt-3 text-4xl font-bold leading-tight">{title}</h1>
            <p className="mt-4 text-base leading-7 text-white/82">
              {description}
            </p>
          </div>

          <div className="absolute bottom-8 right-8 h-36 w-36 rounded-full bg-white/16 blur-2xl" />
          <div className="absolute right-14 top-24 h-28 w-28 rounded-3xl border border-white/25 bg-white/12 backdrop-blur-xl" />
          <div className="absolute bottom-16 left-16 h-20 w-44 rounded-3xl border border-white/20 bg-white/10 backdrop-blur-xl" />
        </aside>

        <div className="bg-white/35 p-6 sm:p-10">{children}</div>
      </section>
    </main>
  );
}
