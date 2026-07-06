import {
  Activity,
  BarChart3,
  CheckCircle2,
  ClipboardCheck,
  Database,
  FileBarChart,
  FolderKanban,
  Gauge,
  Home,
  Layers3,
  MapPinned,
  ShieldCheck,
  Users,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { GlassCard } from "@/components/ui/GlassCard";
import { StatusBadge } from "@/components/ui/StatusBadge";

const sidebarItems = [
  { label: "Dashboard", href: "/admin/dashboard", icon: Home },
  { label: "Data Aspirasi", href: "/admin/dashboard", icon: FolderKanban },
  { label: "Verifikasi Aspirasi", href: "/admin/dashboard", icon: ClipboardCheck },
  { label: "Rekomendasi Prioritas", href: "/admin/dashboard", icon: Gauge },
  { label: "Data Latih SVM", href: "/admin/dashboard", icon: Database },
  { label: "Kategori", href: "/admin/dashboard", icon: Layers3 },
  { label: "Wilayah", href: "/admin/dashboard", icon: MapPinned },
  { label: "User", href: "/admin/dashboard", icon: Users },
  { label: "Laporan", href: "/admin/dashboard", icon: FileBarChart },
];

const stats = [
  { label: "Aspirasi Masuk", value: "48", tone: "text-blue-700" },
  { label: "Menunggu Verifikasi", value: "14", tone: "text-amber-600" },
  { label: "Prioritas Tinggi", value: "7", tone: "text-red-600" },
  { label: "Selesai", value: "21", tone: "text-green-700" },
];

const latest = [
  { title: "Drainase tersumbat", area: "RW 01", priority: "Tinggi", tone: "red" as const },
  { title: "Perbaikan pos ronda", area: "RW 03", priority: "Sedang", tone: "amber" as const },
  { title: "Penambahan tempat sampah", area: "RW 05", priority: "Rendah", tone: "green" as const },
];

const activities = [
  "Verifikasi aspirasi jalan berlubang",
  "Update tanggapan lampu jalan mati",
  "Review rekomendasi prioritas drainase",
];

export default function AdminDashboardPage() {
  return (
    <DashboardLayout
      sidebarItems={sidebarItems}
      activeLabel="Dashboard"
      roleLabel="Admin Kelurahan"
      title="Dashboard Admin"
      subtitle="Kelola aspirasi dan prioritas tindak lanjut"
      showNotification
    >
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <GlassCard className="p-5" key={stat.label}>
            <p className="text-sm font-medium text-slate-500">{stat.label}</p>
            <p className={`mt-3 text-3xl font-bold ${stat.tone}`}>{stat.value}</p>
          </GlassCard>
        ))}
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <GlassCard>
          <div className="flex items-center gap-3">
            <span className="flex size-11 items-center justify-center rounded-2xl bg-blue-100 text-blue-700">
              <BarChart3 size={20} />
            </span>
            <div>
              <p className="text-sm font-bold uppercase text-blue-700">
                Aspirasi terbaru
              </p>
              <h2 className="text-2xl font-bold text-slate-900">
                Masuk untuk ditinjau
              </h2>
            </div>
          </div>

          <div className="mt-6 overflow-hidden rounded-2xl ring-1 ring-white/60">
            {latest.map((item) => (
              <div
                className="grid gap-3 border-b border-white/60 bg-white/35 p-4 last:border-b-0 sm:grid-cols-[1fr_auto_auto] sm:items-center"
                key={item.title}
              >
                <div>
                  <p className="font-bold text-slate-900">{item.title}</p>
                  <p className="mt-1 text-sm text-slate-500">{item.area}</p>
                </div>
                <StatusBadge tone={item.tone}>{item.priority}</StatusBadge>
                <StatusBadge tone="blue">Baru</StatusBadge>
              </div>
            ))}
          </div>
        </GlassCard>

        <div className="grid gap-6">
          <GlassCard>
            <div className="flex items-center gap-3">
              <span className="flex size-11 items-center justify-center rounded-2xl bg-violet-100 text-violet-700">
                <ShieldCheck size={20} />
              </span>
              <div>
                <p className="text-sm font-bold uppercase text-violet-700">
                  Ringkasan prioritas
                </p>
                <h2 className="text-xl font-bold text-slate-900">Rekomendasi</h2>
              </div>
            </div>
            <div className="mt-5 grid grid-cols-3 gap-3">
              <div className="rounded-2xl bg-red-50 p-4 text-center ring-1 ring-red-100">
                <p className="text-2xl font-bold text-red-600">7</p>
                <p className="mt-1 text-xs font-semibold text-red-700">Tinggi</p>
              </div>
              <div className="rounded-2xl bg-amber-50 p-4 text-center ring-1 ring-amber-100">
                <p className="text-2xl font-bold text-amber-600">16</p>
                <p className="mt-1 text-xs font-semibold text-amber-700">Sedang</p>
              </div>
              <div className="rounded-2xl bg-green-50 p-4 text-center ring-1 ring-green-100">
                <p className="text-2xl font-bold text-green-700">25</p>
                <p className="mt-1 text-xs font-semibold text-green-700">Rendah</p>
              </div>
            </div>
          </GlassCard>

          <GlassCard>
            <div className="flex items-center gap-3">
              <span className="flex size-11 items-center justify-center rounded-2xl bg-teal-100 text-teal-700">
                <Activity size={20} />
              </span>
              <div>
                <p className="text-sm font-bold uppercase text-teal-700">
                  Aktivitas admin
                </p>
                <h2 className="text-xl font-bold text-slate-900">Terbaru</h2>
              </div>
            </div>
            <div className="mt-5 space-y-3">
              {activities.map((activity) => (
                <div
                  className="flex items-center gap-3 rounded-2xl bg-white/40 p-3 ring-1 ring-white/60"
                  key={activity}
                >
                  <CheckCircle2 size={18} className="shrink-0 text-green-600" />
                  <p className="text-sm font-medium text-slate-600">{activity}</p>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>
    </DashboardLayout>
  );
}
