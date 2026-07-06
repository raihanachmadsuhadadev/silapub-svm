import {
  ClipboardList,
  Home,
  MessageSquarePlus,
  UserCircle2,
  WalletCards,
} from "lucide-react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { GlassButton } from "@/components/ui/GlassButton";
import { GlassCard } from "@/components/ui/GlassCard";
import { StatusBadge } from "@/components/ui/StatusBadge";

const sidebarItems = [
  { label: "Dashboard", href: "/warga/dashboard", icon: Home },
  { label: "Ajukan Aspirasi", href: "/warga/dashboard", icon: MessageSquarePlus },
  { label: "Status Aspirasi", href: "/warga/dashboard", icon: ClipboardList },
  { label: "Profil", href: "/warga/dashboard", icon: UserCircle2 },
];

const stats = [
  { label: "Total Aspirasi", value: "12", tone: "text-blue-700" },
  { label: "Menunggu Verifikasi", value: "3", tone: "text-amber-600" },
  { label: "Diproses", value: "5", tone: "text-violet-700" },
  { label: "Selesai", value: "4", tone: "text-green-700" },
];

const aspirations = [
  { title: "Jalan berlubang", area: "RT 02 / RW 04", status: "Menunggu", tone: "amber" as const },
  { title: "Lampu jalan mati", area: "RT 01 / RW 03", status: "Diproses", tone: "violet" as const },
  { title: "Sampah menumpuk", area: "RT 05 / RW 02", status: "Selesai", tone: "green" as const },
];

const timeline = [
  "Aspirasi diterima sistem",
  "Menunggu verifikasi admin kelurahan",
  "Rekomendasi prioritas siap ditinjau",
  "Tanggapan akan tampil setelah diproses",
];

export default function WargaDashboardPage() {
  return (
    <ProtectedRoute role="warga">
      <DashboardLayout
        sidebarItems={sidebarItems}
        activeLabel="Dashboard"
        roleLabel="Warga"
        title="Dashboard Warga"
        subtitle="Pantau aspirasi dan tindak lanjut"
      >
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => (
            <GlassCard className="p-5" key={stat.label}>
              <p className="text-sm font-medium text-slate-500">{stat.label}</p>
              <p className={`mt-3 text-3xl font-bold ${stat.tone}`}>{stat.value}</p>
            </GlassCard>
          ))}
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
          <GlassCard>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-bold uppercase text-blue-700">
                  Aspirasi terbaru
                </p>
                <h2 className="mt-1 text-2xl font-bold text-slate-900">
                  Laporan warga terakhir
                </h2>
              </div>
              <GlassButton>
                <MessageSquarePlus size={18} />
                Ajukan Aspirasi
              </GlassButton>
            </div>

            <div className="mt-6 overflow-hidden rounded-2xl ring-1 ring-white/60">
              {aspirations.map((item) => (
                <div
                  className="grid gap-3 border-b border-white/60 bg-white/35 p-4 last:border-b-0 sm:grid-cols-[1fr_auto]"
                  key={item.title}
                >
                  <div className="min-w-0">
                    <p className="font-bold text-slate-900">{item.title}</p>
                    <p className="mt-1 text-sm text-slate-500">{item.area}</p>
                  </div>
                  <StatusBadge tone={item.tone}>{item.status}</StatusBadge>
                </div>
              ))}
            </div>
          </GlassCard>

          <GlassCard>
            <div className="flex items-center gap-3">
              <span className="flex size-11 items-center justify-center rounded-2xl bg-teal-100 text-teal-700">
                <WalletCards size={20} />
              </span>
              <div>
                <p className="text-sm font-bold uppercase text-teal-700">
                  Status tindak lanjut
                </p>
                <h2 className="text-xl font-bold text-slate-900">Timeline</h2>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              {timeline.map((item, index) => (
                <div className="flex gap-3" key={item}>
                  <span className="mt-1 flex size-7 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
                    {index + 1}
                  </span>
                  <p className="rounded-2xl bg-white/40 px-4 py-3 text-sm font-medium text-slate-600 ring-1 ring-white/60">
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
