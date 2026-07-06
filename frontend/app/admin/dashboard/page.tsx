"use client";

import Link from "next/link";
import {
  BarChart3,
  ClipboardList,
  Eye,
  FileBarChart,
  Gauge,
  Loader2,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { adminSidebarItems } from "@/components/layout/adminSidebarItems";
import { GlassButton } from "@/components/ui/GlassButton";
import { GlassCard } from "@/components/ui/GlassCard";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { api } from "@/lib/api";
import {
  formatDate,
  priorityLabel,
  priorityTone,
  statusLabels,
  statusTones,
  type ApiResponse,
  type Aspiration,
} from "@/lib/aspirations";

type Distribution = {
  label: string;
  value: number;
};

type AdminDashboardData = {
  summary: {
    total_aspirations: number;
    submitted: number;
    verified: number;
    in_progress: number;
    completed: number;
    rejected: number;
    priority_high: number;
    priority_medium: number;
    priority_low: number;
    priority_unprocessed: number;
  };
  status_distribution: Distribution[];
  priority_distribution: Distribution[];
  category_distribution: Distribution[];
  region_distribution: Distribution[];
  latest_aspirations: Aspiration[];
};

const emptyDashboard: AdminDashboardData = {
  summary: {
    total_aspirations: 0,
    submitted: 0,
    verified: 0,
    in_progress: 0,
    completed: 0,
    rejected: 0,
    priority_high: 0,
    priority_medium: 0,
    priority_low: 0,
    priority_unprocessed: 0,
  },
  status_distribution: [],
  priority_distribution: [],
  category_distribution: [],
  region_distribution: [],
  latest_aspirations: [],
};

export default function AdminDashboardPage() {
  const [dashboard, setDashboard] = useState<AdminDashboardData>(emptyDashboard);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadDashboard() {
      await Promise.resolve();

      try {
        const response = await api.get<ApiResponse<AdminDashboardData>>("/admin/dashboard");
        if (active) {
          setDashboard(response.data.data);
        }
      } catch {
        if (active) {
          setError("Gagal memuat dashboard admin.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadDashboard();

    return () => {
      active = false;
    };
  }, []);

  const maxStatus = useMemo(
    () => Math.max(...dashboard.status_distribution.map((item) => item.value), 1),
    [dashboard.status_distribution],
  );
  const maxPriority = useMemo(
    () => Math.max(...dashboard.priority_distribution.map((item) => item.value), 1),
    [dashboard.priority_distribution],
  );
  const maxCategory = useMemo(
    () => Math.max(...dashboard.category_distribution.map((item) => item.value), 1),
    [dashboard.category_distribution],
  );

  return (
    <ProtectedRoute role="admin">
      <DashboardLayout
        sidebarItems={adminSidebarItems}
        activeLabel="Dashboard"
        roleLabel="Admin Kelurahan"
        title="Dashboard Admin"
        subtitle="Ringkasan kondisi aspirasi, prioritas, kategori, dan tindak lanjut warga"
        showNotification
      >
        {error ? (
          <p className="mb-5 rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 ring-1 ring-red-100">
            {error}
          </p>
        ) : null}

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-6">
          {[
            ["Total Aspirasi", dashboard.summary.total_aspirations, "text-blue-700"],
            ["Diajukan", dashboard.summary.submitted, "text-amber-600"],
            ["Diproses", dashboard.summary.in_progress, "text-violet-700"],
            ["Selesai", dashboard.summary.completed, "text-green-700"],
            ["Prioritas Tinggi", dashboard.summary.priority_high, "text-red-600"],
            ["Belum Diproses SVM", dashboard.summary.priority_unprocessed, "text-slate-700"],
          ].map(([label, value, tone]) => (
            <GlassCard className="p-5" key={label}>
              <p className="text-sm font-medium text-slate-500">{label}</p>
              <p className={`mt-3 text-3xl font-bold ${tone}`}>{value}</p>
            </GlassCard>
          ))}
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_1fr]">
          <GlassCard>
            <div className="flex items-center gap-3">
              <span className="flex size-11 items-center justify-center rounded-2xl bg-blue-100 text-blue-700">
                <BarChart3 size={20} />
              </span>
              <div>
                <p className="text-sm font-bold uppercase text-blue-700">Distribusi status</p>
                <h2 className="text-xl font-bold text-slate-900">Per tahap aspirasi</h2>
              </div>
            </div>
            <div className="mt-5 space-y-4">
              {loading ? <LoadingLine /> : dashboard.status_distribution.map((item) => (
                <ProgressLine item={item} max={maxStatus} key={item.label} />
              ))}
            </div>
          </GlassCard>

          <GlassCard>
            <div className="flex items-center gap-3">
              <span className="flex size-11 items-center justify-center rounded-2xl bg-violet-100 text-violet-700">
                <Gauge size={20} />
              </span>
              <div>
                <p className="text-sm font-bold uppercase text-violet-700">Distribusi prioritas</p>
                <h2 className="text-xl font-bold text-slate-900">Hasil rekomendasi SVM</h2>
              </div>
            </div>
            <div className="mt-5 space-y-4">
              {loading ? <LoadingLine /> : dashboard.priority_distribution.map((item) => (
                <ProgressLine item={item} max={maxPriority} key={item.label} />
              ))}
            </div>
          </GlassCard>
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
          <GlassCard>
            <div className="flex items-center gap-3">
              <span className="flex size-11 items-center justify-center rounded-2xl bg-teal-100 text-teal-700">
                <ClipboardList size={20} />
              </span>
              <div>
                <p className="text-sm font-bold uppercase text-teal-700">Kategori terbanyak</p>
                <h2 className="text-xl font-bold text-slate-900">Top 5 kategori</h2>
              </div>
            </div>
            <div className="mt-5 space-y-4">
              {loading ? <LoadingLine /> : dashboard.category_distribution.map((item) => (
                <ProgressLine item={item} max={maxCategory} key={item.label} />
              ))}
              {!loading && dashboard.category_distribution.length === 0 ? (
                <p className="rounded-2xl bg-white/40 p-4 text-sm text-slate-500 ring-1 ring-white/60">
                  Belum ada data kategori.
                </p>
              ) : null}
            </div>
          </GlassCard>

          <GlassCard>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-bold uppercase text-blue-700">Aspirasi terbaru</p>
                <h2 className="mt-1 text-2xl font-bold text-slate-900">Masuk untuk dipantau</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                <GlassButton href="/admin/aspirations" variant="secondary">Data Aspirasi</GlassButton>
                <GlassButton href="/admin/recommendations" variant="secondary">Rekomendasi</GlassButton>
                <GlassButton href="/admin/reports" variant="secondary">
                  <FileBarChart size={18} />
                  Laporan
                </GlassButton>
              </div>
            </div>

            <div className="mt-6 overflow-x-auto rounded-2xl ring-1 ring-white/60">
              <table className="w-full min-w-[760px] bg-white/35 text-left text-sm">
                <thead className="bg-white/55 text-xs uppercase text-slate-500">
                  <tr>
                    <th className="px-4 py-3">Kode</th>
                    <th className="px-4 py-3">Judul</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Prioritas</th>
                    <th className="px-4 py-3">Tanggal</th>
                    <th className="px-4 py-3 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td className="px-4 py-10 text-center text-slate-500" colSpan={6}>
                        <Loader2 className="mx-auto mb-2 animate-spin text-blue-700" />
                        Memuat dashboard...
                      </td>
                    </tr>
                  ) : dashboard.latest_aspirations.length === 0 ? (
                    <tr>
                      <td className="px-4 py-10 text-center text-slate-500" colSpan={6}>
                        Belum ada aspirasi.
                      </td>
                    </tr>
                  ) : dashboard.latest_aspirations.map((item) => (
                    <tr className="border-t border-white/60" key={item.id}>
                      <td className="px-4 py-4 font-bold text-slate-800">{item.code}</td>
                      <td className="px-4 py-4 font-semibold text-slate-700">{item.title}</td>
                      <td className="px-4 py-4">
                        <StatusBadge tone={statusTones[item.status]}>{statusLabels[item.status]}</StatusBadge>
                      </td>
                      <td className="px-4 py-4">
                        <StatusBadge tone={priorityTone(item.priority_recommendation)}>
                          {priorityLabel(item.priority_recommendation)}
                        </StatusBadge>
                      </td>
                      <td className="px-4 py-4 text-slate-500">{formatDate(item.submitted_at)}</td>
                      <td className="px-4 py-4">
                        <Link
                          className="ml-auto flex size-9 items-center justify-center rounded-xl bg-white/55 text-blue-700 ring-1 ring-white/70"
                          href={`/admin/aspirations/${item.id}`}
                        >
                          <Eye size={16} />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GlassCard>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}

function ProgressLine({ item, max }: { item: Distribution; max: number }) {
  const width = `${Math.max(5, Math.round((item.value / max) * 100))}%`;

  return (
    <div className="rounded-2xl bg-white/40 p-4 ring-1 ring-white/60">
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm font-semibold text-slate-700">{item.label}</p>
        <p className="text-sm font-bold text-slate-900">{item.value}</p>
      </div>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/70">
        <div className="h-full rounded-full bg-blue-600" style={{ width }} />
      </div>
    </div>
  );
}

function LoadingLine() {
  return (
    <div className="rounded-2xl bg-white/40 p-4 text-sm text-slate-500 ring-1 ring-white/60">
      Memuat statistik...
    </div>
  );
}
