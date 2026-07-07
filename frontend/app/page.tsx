import {
  ArrowRight,
  ClipboardCheck,
  ClipboardList,
  GitBranch,
  LogIn,
  MessageSquarePlus,
  MessageSquareText,
  SearchCheck,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { GlassButton } from "@/components/ui/GlassButton";
import { GlassCard } from "@/components/ui/GlassCard";
import { PublicNavbar } from "@/components/layout/PublicNavbar";
import { StatusBadge } from "@/components/ui/StatusBadge";
import {
  formatDate,
  priorityLabel,
  priorityTone,
  statusLabels,
  statusTones,
  type AspirationStatus,
  type MasterOption,
} from "@/lib/aspirations";

type PublicAspiration = {
  id: number;
  code: string;
  title: string;
  status: AspirationStatus;
  priority_recommendation: string | null;
  submitted_at: string | null;
  category?: Pick<MasterOption, "id" | "name"> | null;
  region?: Pick<MasterOption, "id" | "rt" | "rw" | "name"> | null;
};

type LatestResponse = {
  success: boolean;
  message: string;
  data: PublicAspiration[];
};

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
    description: "Aspirasi dapat dipetakan berdasarkan prioritas agar tindak lanjut lebih terarah.",
    icon: Sparkles,
  },
  {
    title: "Tanggapan Kelurahan",
    description: "Admin kelurahan dapat memberi tindak lanjut yang mudah dipantau warga.",
    icon: ShieldCheck,
  },
];

const flows = [
  {
    title: "Warga daftar/login",
    description: "Akses layanan memakai akun warga agar riwayat aspirasi tersimpan.",
    icon: LogIn,
  },
  {
    title: "Ajukan aspirasi",
    description: "Isi kategori, wilayah, lokasi, uraian masalah, dan lampiran pendukung.",
    icon: MessageSquarePlus,
  },
  {
    title: "Rekomendasi prioritas",
    description: "Sistem menyiapkan rekomendasi awal berbasis data latih SVM.",
    icon: Sparkles,
  },
  {
    title: "Verifikasi dan tanggapan",
    description: "Admin meninjau detail aspirasi, memperbarui status, dan memberi respons.",
    icon: ClipboardCheck,
  },
  {
    title: "Pantau perkembangan",
    description: "Warga melihat timeline status dan tanggapan terbaru dari dashboard.",
    icon: SearchCheck,
  },
];

async function getLatestAspirations(): Promise<PublicAspiration[]> {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000/api";

  try {
    const response = await fetch(`${apiBaseUrl}/public/latest-aspirations`, {
      cache: "no-store",
    });

    if (!response.ok) {
      return [];
    }

    const payload = (await response.json()) as LatestResponse;
    return payload.data ?? [];
  } catch {
    return [];
  }
}

export default async function Home() {
  const latestAspirations = await getLatestAspirations();

  return (
    <main className="app-gradient-bg min-h-screen overflow-hidden">
      <PublicNavbar />

      <section
        id="beranda"
        className="mx-auto grid w-full max-w-7xl scroll-mt-24 items-center gap-10 px-4 pb-14 pt-8 sm:px-6 lg:grid-cols-[1fr_0.86fr] lg:px-8 lg:pb-20 lg:pt-14"
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
              Lihat Status Aspirasi
            </GlassButton>
          </div>
        </div>

        <GlassCard className="relative overflow-hidden p-6 sm:p-8">
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

      <section id="fitur" className="mx-auto w-full max-w-7xl scroll-mt-24 px-4 py-12 sm:px-6 lg:px-8">
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

      <section id="alur" className="mx-auto w-full max-w-7xl scroll-mt-24 px-4 py-12 sm:px-6 lg:px-8">
        <GlassCard className="p-6 sm:p-8">
          <div className="grid gap-8 lg:grid-cols-[0.78fr_1.22fr] lg:items-start">
            <div>
              <p className="text-sm font-bold uppercase text-blue-700">
                Alur layanan
              </p>
              <h2 className="mt-2 text-3xl font-bold text-slate-900">
                Dari laporan warga sampai tindak lanjut.
              </h2>
              <p className="mt-4 text-sm leading-7 text-slate-600">
                Setiap aspirasi yang dikirim warga akan diproses melalui alur yang
                jelas, mulai dari pengajuan, rekomendasi prioritas, verifikasi admin,
                hingga tindak lanjut.
              </p>
              <div className="mt-6 grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
                {[
                  ["Transparan", "Status dan timeline mudah dipantau"],
                  ["Terarah", "Prioritas membantu admin meninjau antrean"],
                  ["Tertib", "Semua tanggapan tersimpan dalam satu riwayat"],
                ].map(([title, description]) => (
                  <div className="rounded-2xl bg-white/42 p-4 ring-1 ring-white/60" key={title}>
                    <p className="text-sm font-bold text-slate-900">{title}</p>
                    <p className="mt-1 text-xs leading-5 text-slate-500">{description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-3">
              {flows.map((flow, index) => {
                const Icon = flow.icon;
                return (
                  <div
                    className="grid gap-4 rounded-2xl bg-white/45 p-4 ring-1 ring-white/60 sm:grid-cols-[auto_1fr] sm:items-start"
                    key={flow.title}
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#0f766e] text-sm font-bold text-white">
                        {index + 1}
                      </span>
                      <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700 ring-1 ring-blue-100">
                        <Icon size={18} />
                      </span>
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900">{flow.title}</h3>
                      <p className="mt-1 text-sm leading-6 text-slate-600">{flow.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </GlassCard>
      </section>

      <section id="aspirasi" className="mx-auto w-full max-w-7xl scroll-mt-24 px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-bold uppercase text-teal-700">Transparansi layanan</p>
            <h2 className="mt-2 text-3xl font-bold text-slate-900">Aspirasi Terupdate</h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
              Pantau beberapa aspirasi terbaru dan progres tindak lanjutnya secara transparan.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <GlassButton href="/login" variant="secondary">Lihat Status Aspirasi</GlassButton>
            <GlassButton href="/register">Ajukan Aspirasi</GlassButton>
          </div>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          {latestAspirations.length === 0 ? (
            <GlassCard className="lg:col-span-2">
              <p className="text-sm font-bold text-slate-900">Data aspirasi terbaru belum tersedia.</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Landing page tetap dapat dibuka. Data akan tampil otomatis ketika backend aktif
                dan aspirasi sudah tersedia.
              </p>
            </GlassCard>
          ) : (
            latestAspirations.map((aspiration) => (
              <GlassCard className="p-5" key={aspiration.id}>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <p className="text-xs font-bold uppercase text-blue-700">{aspiration.code}</p>
                    <h3 className="mt-2 line-clamp-2 text-lg font-bold text-slate-900">
                      {aspiration.title}
                    </h3>
                  </div>
                  <StatusBadge tone={statusTones[aspiration.status]}>
                    {statusLabels[aspiration.status]}
                  </StatusBadge>
                </div>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <Info label="Kategori" value={aspiration.category?.name ?? "-"} />
                  <Info
                    label="Wilayah"
                    value={`RT ${aspiration.region?.rt ?? "-"} / RW ${aspiration.region?.rw ?? "-"}`}
                  />
                  <div className="rounded-2xl bg-white/40 p-3 ring-1 ring-white/60">
                    <p className="text-xs font-bold uppercase text-slate-500">Prioritas</p>
                    <div className="mt-2">
                      <StatusBadge tone={priorityTone(aspiration.priority_recommendation)}>
                        {priorityLabel(aspiration.priority_recommendation)}
                      </StatusBadge>
                    </div>
                  </div>
                  <Info label="Tanggal" value={formatDate(aspiration.submitted_at)} />
                </div>
              </GlassCard>
            ))
          )}
        </div>
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

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white/40 p-3 ring-1 ring-white/60">
      <p className="text-xs font-bold uppercase text-slate-500">{label}</p>
      <p className="mt-1 truncate text-sm font-semibold text-slate-700">{value}</p>
    </div>
  );
}
