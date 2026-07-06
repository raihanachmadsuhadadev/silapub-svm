"use client";

import Link from "next/link";
import { Eye, Loader2, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { adminSidebarItems } from "@/components/layout/adminSidebarItems";
import { GlassCard } from "@/components/ui/GlassCard";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { api } from "@/lib/api";
import {
  formatDate,
  priorityLabel,
  statusLabels,
  statusTones,
  type ApiResponse,
  type Aspiration,
  type AspirationStatus,
} from "@/lib/aspirations";

const statusOptions: Array<"all" | AspirationStatus> = [
  "all",
  "submitted",
  "verified",
  "in_progress",
  "completed",
  "rejected",
];

export default function AdminAspirationsPage() {
  const [aspirations, setAspirations] = useState<Aspiration[]>([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<"all" | AspirationStatus>("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadAspirations() {
      await Promise.resolve();

      try {
        const response = await api.get<ApiResponse<Aspiration[]>>("/admin/aspirations");
        if (active) {
          setAspirations(response.data.data);
        }
      } catch {
        if (active) {
          setError("Gagal memuat aspirasi masuk.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadAspirations();

    return () => {
      active = false;
    };
  }, []);

  const filtered = useMemo(() => {
    const keyword = search.toLowerCase();

    return aspirations.filter((aspiration) => {
      const matchesStatus = status === "all" || aspiration.status === status;
      const matchesKeyword = [
        aspiration.code,
        aspiration.title,
        aspiration.user?.name ?? "",
        aspiration.category?.name ?? "",
      ]
        .join(" ")
        .toLowerCase()
        .includes(keyword);

      return matchesStatus && matchesKeyword;
    });
  }, [aspirations, search, status]);

  return (
    <ProtectedRoute role="admin">
      <DashboardLayout
        sidebarItems={adminSidebarItems}
        activeLabel="Data Aspirasi"
        roleLabel="Admin Kelurahan"
        title="Data Aspirasi"
        subtitle="Daftar aspirasi masuk dari warga"
        showNotification
      >
        <GlassCard>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-bold uppercase text-blue-700">
                Aspirasi masuk
              </p>
              <h2 className="mt-1 text-2xl font-bold text-slate-900">
                {filtered.length} aspirasi ditampilkan
              </h2>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <label className="relative sm:w-72">
                <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  className="h-11 w-full rounded-xl border border-white/60 bg-white/55 pl-10 pr-4 text-sm outline-none focus:border-blue-300 focus:ring-4 focus:ring-blue-500/10"
                  placeholder="Cari aspirasi..."
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                />
              </label>
              <select
                className="h-11 rounded-xl border border-white/60 bg-white/55 px-4 text-sm text-slate-700 outline-none focus:border-blue-300 focus:ring-4 focus:ring-blue-500/10"
                value={status}
                onChange={(event) => setStatus(event.target.value as "all" | AspirationStatus)}
              >
                {statusOptions.map((option) => (
                  <option value={option} key={option}>
                    {option === "all" ? "Semua status" : statusLabels[option]}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {error ? (
            <p className="mt-5 rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 ring-1 ring-red-100">
              {error}
            </p>
          ) : null}

          <div className="mt-6 overflow-x-auto rounded-2xl ring-1 ring-white/60">
            <table className="w-full min-w-[980px] border-collapse bg-white/35 text-left text-sm">
              <thead className="bg-white/55 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-4 py-3">Kode</th>
                  <th className="px-4 py-3">Warga</th>
                  <th className="px-4 py-3">Judul</th>
                  <th className="px-4 py-3">Kategori</th>
                  <th className="px-4 py-3">Wilayah</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Prioritas</th>
                  <th className="px-4 py-3">Tanggal</th>
                  <th className="px-4 py-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td className="px-4 py-10 text-center text-slate-500" colSpan={9}>
                      <Loader2 className="mx-auto mb-2 animate-spin text-blue-700" />
                      Memuat aspirasi...
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td className="px-4 py-10 text-center text-slate-500" colSpan={9}>
                      Belum ada aspirasi yang cocok.
                    </td>
                  </tr>
                ) : (
                  filtered.map((aspiration) => (
                    <tr className="border-t border-white/60" key={aspiration.id}>
                      <td className="px-4 py-4 font-bold text-slate-800">{aspiration.code}</td>
                      <td className="px-4 py-4 text-slate-500">{aspiration.user?.name}</td>
                      <td className="px-4 py-4 font-semibold text-slate-700">{aspiration.title}</td>
                      <td className="px-4 py-4 text-slate-500">{aspiration.category?.name}</td>
                      <td className="px-4 py-4 text-slate-500">
                        RT {aspiration.region?.rt} / RW {aspiration.region?.rw}
                      </td>
                      <td className="px-4 py-4">
                        <StatusBadge tone={statusTones[aspiration.status]}>
                          {statusLabels[aspiration.status]}
                        </StatusBadge>
                      </td>
                      <td className="px-4 py-4 text-slate-500">
                        {priorityLabel(aspiration.priority_recommendation)}
                      </td>
                      <td className="px-4 py-4 text-slate-500">{formatDate(aspiration.submitted_at)}</td>
                      <td className="px-4 py-4">
                        <Link
                          className="ml-auto flex size-9 items-center justify-center rounded-xl bg-white/55 text-blue-700 ring-1 ring-white/70"
                          href={`/admin/aspirations/${aspiration.id}`}
                          aria-label={`Detail ${aspiration.code}`}
                        >
                          <Eye size={16} />
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </GlassCard>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
