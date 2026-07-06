"use client";

import Link from "next/link";
import {
  Eye,
  Loader2,
  MessageSquarePlus,
  MessagesSquare,
  WalletCards,
} from "lucide-react";
import { useEffect, useState } from "react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { wargaSidebarItems } from "@/components/layout/wargaSidebarItems";
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
  type AspirationResponse,
} from "@/lib/aspirations";

type ResponseItem = AspirationResponse & {
  aspiration?: Aspiration;
};

type WargaDashboardData = {
  summary: {
    total_aspirations: number;
    submitted: number;
    in_progress: number;
    completed: number;
    rejected: number;
  };
  latest_aspirations: Aspiration[];
  latest_responses: ResponseItem[];
};

const emptyDashboard: WargaDashboardData = {
  summary: {
    total_aspirations: 0,
    submitted: 0,
    in_progress: 0,
    completed: 0,
    rejected: 0,
  },
  latest_aspirations: [],
  latest_responses: [],
};

export default function WargaDashboardPage() {
  const [dashboard, setDashboard] = useState<WargaDashboardData>(emptyDashboard);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadDashboard() {
      await Promise.resolve();

      try {
        const response = await api.get<ApiResponse<WargaDashboardData>>("/warga/dashboard");
        if (active) {
          setDashboard(response.data.data);
        }
      } catch {
        if (active) {
          setError("Gagal memuat dashboard warga.");
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

  return (
    <ProtectedRoute role="warga">
      <DashboardLayout
        sidebarItems={wargaSidebarItems}
        activeLabel="Dashboard"
        roleLabel="Warga"
        title="Dashboard Warga"
        subtitle="Pantau aspirasi, prioritas, dan tanggapan terbaru dari admin kelurahan"
      >
        {error ? (
          <p className="mb-5 rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 ring-1 ring-red-100">
            {error}
          </p>
        ) : null}

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-5">
          {[
            ["Total Aspirasi Saya", dashboard.summary.total_aspirations, "text-blue-700"],
            ["Diajukan", dashboard.summary.submitted, "text-amber-600"],
            ["Diproses", dashboard.summary.in_progress, "text-violet-700"],
            ["Selesai", dashboard.summary.completed, "text-green-700"],
            ["Ditolak", dashboard.summary.rejected, "text-red-600"],
          ].map(([label, value, tone]) => (
            <GlassCard className="p-5" key={label}>
              <p className="text-sm font-medium text-slate-500">{label}</p>
              <p className={`mt-3 text-3xl font-bold ${tone}`}>{value}</p>
            </GlassCard>
          ))}
        </div>

        <GlassCard className="mt-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <span className="flex size-11 items-center justify-center rounded-2xl bg-blue-100 text-blue-700">
                <MessageSquarePlus size={20} />
              </span>
              <div>
                <p className="text-sm font-bold uppercase text-blue-700">Aspirasi baru</p>
                <h2 className="text-2xl font-bold text-slate-900">Sampaikan kebutuhan lingkungan</h2>
              </div>
            </div>
            <GlassButton href="/warga/aspirations/create">
              <MessageSquarePlus size={18} />
              Ajukan Aspirasi Baru
            </GlassButton>
          </div>
        </GlassCard>

        <div className="mt-6 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <GlassCard>
            <div className="flex items-center gap-3">
              <span className="flex size-11 items-center justify-center rounded-2xl bg-teal-100 text-teal-700">
                <WalletCards size={20} />
              </span>
              <div>
                <p className="text-sm font-bold uppercase text-teal-700">Aspirasi terbaru</p>
                <h2 className="text-xl font-bold text-slate-900">Riwayat pengajuan saya</h2>
              </div>
            </div>

            <div className="mt-6 overflow-x-auto rounded-2xl ring-1 ring-white/60">
              <table className="w-full min-w-[720px] bg-white/35 text-left text-sm">
                <thead className="bg-white/55 text-xs uppercase text-slate-500">
                  <tr>
                    <th className="px-4 py-3">Kode</th>
                    <th className="px-4 py-3">Judul</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Prioritas</th>
                    <th className="px-4 py-3 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td className="px-4 py-10 text-center text-slate-500" colSpan={5}>
                        <Loader2 className="mx-auto mb-2 animate-spin text-blue-700" />
                        Memuat aspirasi...
                      </td>
                    </tr>
                  ) : dashboard.latest_aspirations.length === 0 ? (
                    <tr>
                      <td className="px-4 py-10 text-center text-slate-500" colSpan={5}>
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
                      <td className="px-4 py-4">
                        <Link
                          className="ml-auto flex size-9 items-center justify-center rounded-xl bg-white/55 text-blue-700 ring-1 ring-white/70"
                          href={`/warga/aspirations/${item.id}`}
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

          <GlassCard>
            <div className="flex items-center gap-3">
              <span className="flex size-11 items-center justify-center rounded-2xl bg-violet-100 text-violet-700">
                <MessagesSquare size={20} />
              </span>
              <div>
                <p className="text-sm font-bold uppercase text-violet-700">Tanggapan terbaru</p>
                <h2 className="text-xl font-bold text-slate-900">Dari admin kelurahan</h2>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              {loading ? (
                <p className="rounded-2xl bg-white/40 p-4 text-sm text-slate-500 ring-1 ring-white/60">
                  Memuat tanggapan...
                </p>
              ) : dashboard.latest_responses.length === 0 ? (
                <p className="rounded-2xl bg-white/40 p-4 text-sm text-slate-500 ring-1 ring-white/60">
                  Belum ada tanggapan admin.
                </p>
              ) : dashboard.latest_responses.map((item) => (
                <div className="rounded-2xl bg-white/40 p-4 ring-1 ring-white/60" key={item.id}>
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-bold text-slate-900">{item.aspiration?.code}</p>
                    <StatusBadge tone={statusTones[item.status]}>{statusLabels[item.status]}</StatusBadge>
                  </div>
                  <p className="mt-2 text-sm font-semibold text-slate-700">{item.aspiration?.title}</p>
                  <p className="mt-2 line-clamp-3 text-sm text-slate-500">{item.response_text}</p>
                  <p className="mt-3 text-xs font-medium text-slate-400">{formatDate(item.created_at)}</p>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
