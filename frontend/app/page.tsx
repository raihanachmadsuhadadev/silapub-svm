import {
  ArrowRight,
  ClipboardList,
  GitBranch,
  MessageSquareText,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { GlassButton } from "@/components/ui/GlassButton";
import { GlassCard } from "@/components/ui/GlassCard";
import { PublicNavbar } from "@/components/layout/PublicNavbar";

const features = [
  {
    title: "Ajukan Aspirasi",
    description: "Warga dapat menyampaikan kebutuhan lingkungan secara ringkas dan rapi.",
    icon: MessageSquareText,
  },
  {
    title: "Pantau Status",
    description: "Perkembangan aspirasi ditampilkan jelas dari verifikasi sampai selesai.",
    icon: ClipboardList,
  },
  {
    title: "Rekomendasi Prioritas SVM",
    description: "Fondasi UI disiapkan untuk menampilkan rekomendasi prioritas berbasis SVM.",
    icon: Sparkles,
  },
  {
    title: "Tanggapan Kelurahan",
    description: "Admin kelurahan dapat memberi tindak lanjut yang mudah dipantau warga.",
    icon: ShieldCheck,
  },
];

const flows = [
  "Warga daftar/login",
  "Ajukan aspirasi",
  "Sistem memberi rekomendasi prioritas",
  "Admin memverifikasi dan memberi tanggapan",
  "Warga memantau perkembangan",
];

export default function Home() {
  return (
    <main className="app-gradient-bg min-h-screen overflow-hidden">
      <PublicNavbar />

      <section
        id="beranda"
        className="mx-auto grid w-full max-w-7xl items-center gap-10 px-4 pb-14 pt-8 sm:px-6 lg:grid-cols-[1fr_0.86fr] lg:px-8 lg:pb-20 lg:pt-14"
      >
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/45 px-4 py-2 text-sm font-semibold text-slate-600 backdrop-blur">
            <Sparkles size={16} className="text-[#8b5cf6]" />
            Layanan aspirasi warga berbasis digital
          </div>
          <h1 className="mt-6 max-w-3xl text-4xl font-bold leading-tight text-slate-950 sm:text-5xl lg:text-6xl">
            Sampaikan Aspirasi Warga Secara{" "}
            <span className="text-gradient">Digital</span>
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
            Sistem untuk mengajukan aspirasi, memantau status, dan membantu
            kelurahan menentukan prioritas tindak lanjut secara lebih terstruktur.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <GlassButton href="/register" className="sm:w-auto">
              Mulai Ajukan Aspirasi
              <ArrowRight size={18} />
            </GlassButton>
            <GlassButton href="/login" variant="secondary" className="sm:w-auto">
              Masuk Admin
            </GlassButton>
          </div>
        </div>

        <GlassCard className="relative overflow-hidden p-6 sm:p-8">
          <div className="absolute right-6 top-6 h-24 w-24 rounded-full bg-blue-300/30 blur-2xl" />
          <div className="relative">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-slate-500">
                  Dashboard ringkas
                </p>
                <h2 className="mt-1 text-2xl font-bold text-slate-900">
                  Aspirasi Kelurahan
                </h2>
              </div>
              <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-bold text-green-700 ring-1 ring-green-200">
                Aktif
              </span>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-4">
              {["Masuk", "Diproses", "Tinggi", "Selesai"].map((label, index) => (
                <div
                  className="rounded-2xl bg-white/50 p-4 ring-1 ring-white/60"
                  key={label}
                >
                  <p className="text-sm text-slate-500">{label}</p>
                  <p className="mt-2 text-3xl font-bold text-slate-900">
                    {[24, 9, 4, 11][index]}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-6 space-y-3">
              {["Jalan lingkungan berlubang", "Lampu jalan mati", "Sampah menumpuk"].map(
                (item) => (
                  <div
                    className="flex items-center gap-3 rounded-2xl bg-white/48 p-3 ring-1 ring-white/60"
                    key={item}
                  >
                    <span className="flex size-10 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                      <GitBranch size={18} />
                    </span>
                    <span className="min-w-0 flex-1 text-sm font-semibold text-slate-700">
                      {item}
                    </span>
                  </div>
                ),
              )}
            </div>
          </div>
        </GlassCard>
      </section>

      <section id="fitur" className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <GlassCard className="h-full" key={feature.title}>
                <span className="flex size-12 items-center justify-center rounded-2xl bg-blue-600/10 text-blue-700">
                  <Icon size={22} />
                </span>
                <h3 className="mt-5 text-lg font-bold text-slate-900">
                  {feature.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  {feature.description}
                </p>
              </GlassCard>
            );
          })}
        </div>
      </section>

      <section id="alur" className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <GlassCard>
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-md">
              <p className="text-sm font-bold uppercase text-blue-700">
                Alur layanan
              </p>
              <h2 className="mt-2 text-3xl font-bold text-slate-900">
                Dari laporan warga sampai tindak lanjut.
              </h2>
            </div>
            <div className="grid flex-1 gap-3">
              {flows.map((flow, index) => (
                <div
                  className="flex items-center gap-4 rounded-2xl bg-white/45 p-4 ring-1 ring-white/60"
                  key={flow}
                >
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#0f766e] text-sm font-bold text-white">
                    {index + 1}
                  </span>
                  <p className="font-semibold text-slate-700">{flow}</p>
                </div>
              ))}
            </div>
          </div>
        </GlassCard>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 pb-16 pt-8 sm:px-6 lg:px-8">
        <div className="glass-card rounded-3xl px-6 py-10 text-center sm:px-10">
          <h2 className="text-3xl font-bold text-slate-900">
            Siap menyampaikan aspirasi?
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-slate-600">
            Mulai dari satu laporan kecil, lalu pantau tindak lanjutnya dengan lebih jelas.
          </p>
          <GlassButton href="/register" className="mt-6">
            Daftar Warga
          </GlassButton>
        </div>
      </section>
    </main>
  );
}
