import { Menu, Sparkles } from "lucide-react";
import Link from "next/link";
import { GlassButton } from "@/components/ui/GlassButton";

export function PublicNavbar() {
  return (
    <header className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
      <Link href="/" className="flex items-center gap-3">
        <span className="flex size-11 items-center justify-center rounded-2xl bg-white/65 text-[#2563eb] shadow-sm ring-1 ring-white/70">
          <Sparkles size={20} />
        </span>
        <span>
          <span className="block text-lg font-bold text-slate-900">SILAPUB</span>
          <span className="block text-xs font-medium text-slate-500">
            Sistem Layanan Aspirasi Publik
          </span>
        </span>
      </Link>

      <nav className="hidden items-center gap-8 text-sm font-medium text-slate-600 md:flex">
        <a href="#beranda" className="hover:text-blue-700">
          Beranda
        </a>
        <a href="#fitur" className="hover:text-blue-700">
          Fitur
        </a>
        <a href="#alur" className="hover:text-blue-700">
          Alur
        </a>
        <a href="#aspirasi" className="hover:text-blue-700">
          Aspirasi
        </a>
      </nav>

      <div className="hidden items-center gap-3 sm:flex">
        <GlassButton href="/login" variant="ghost" className="px-4">
          Masuk
        </GlassButton>
        <GlassButton href="/register" className="px-4">
          Daftar Warga
        </GlassButton>
      </div>

      <Link
        href="/login"
        className="flex size-11 items-center justify-center rounded-xl bg-white/50 text-slate-700 ring-1 ring-white/60 md:hidden"
        aria-label="Buka menu"
      >
        <Menu size={20} />
      </Link>
    </header>
  );
}
