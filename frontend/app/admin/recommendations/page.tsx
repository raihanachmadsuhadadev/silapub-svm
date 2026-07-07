"use client";

import Link from "next/link";
import { Eye, Loader2, RefreshCw, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { adminSidebarItems } from "@/components/layout/adminSidebarItems";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { EmptyState } from "@/components/ui/EmptyState";
import { GlassButton } from "@/components/ui/GlassButton";
import { GlassCard } from "@/components/ui/GlassCard";
import { Pagination } from "@/components/ui/Pagination";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { useToast } from "@/components/ui/ToastProvider";
import { api } from "@/lib/api";
import {
  priorityLabel,
  priorityTone,
  statusLabels,
  statusTones,
  type ApiResponse,
  type Aspiration,
} from "@/lib/aspirations";

type PriorityFilter = "all" | "none" | "tinggi" | "sedang" | "rendah";

export default function RecommendationsPage() {
  const [aspirations, setAspirations] = useState<Aspiration[]>([]);
  const [search, setSearch] = useState("");
  const [priority, setPriority] = useState<PriorityFilter>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<number | null>(null);
  const [confirmItem, setConfirmItem] = useState<Aspiration | null>(null);
  const [error, setError] = useState("");
  const { showToast } = useToast();

  async function fetchAspirations(active = true) {
    try {
      const response = await api.get<ApiResponse<Aspiration[]>>("/admin/aspirations");
      if (active) setAspirations(response.data.data);
    } catch {
      if (active) setError("Gagal memuat data rekomendasi.");
    } finally {
      if (active) setLoading(false);
    }
  }

  useEffect(() => {
    let active = true;

    async function loadAspirations() {
      await Promise.resolve();
      await fetchAspirations(active);
    }

    loadAspirations();

    return () => {
      active = false;
    };
  }, []);

  const filtered = useMemo(() => {
    const keyword = search.toLowerCase();
    return aspirations.filter((item) => {
      const matchPriority =
        priority === "all" ||
        (priority === "none" && !item.priority_recommendation) ||
        item.priority_recommendation === priority;
      const matchKeyword = [item.code, item.title, item.category?.name ?? ""]
        .join(" ")
        .toLowerCase()
        .includes(keyword);
      return matchPriority && matchKeyword;
    });
  }, [aspirations, priority, search]);

  const paginated = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filtered.slice(start, start + itemsPerPage);
  }, [currentPage, filtered, itemsPerPage]);

  const summary = {
    none: aspirations.filter((item) => !item.priority_recommendation).length,
    tinggi: aspirations.filter((item) => item.priority_recommendation === "tinggi").length,
    sedang: aspirations.filter((item) => item.priority_recommendation === "sedang").length,
    rendah: aspirations.filter((item) => item.priority_recommendation === "rendah").length,
  };

  async function predict(item: Aspiration) {
    setProcessingId(item.id);
    setError("");
    try {
      await api.post(`/admin/aspirations/${item.id}/predict-priority`);
      showToast({ type: "success", title: "Rekomendasi prioritas berhasil dibuat." });
      await fetchAspirations();
    } catch {
      setError("Rekomendasi gagal dibuat. Pastikan ML Service aktif dan data latih cukup.");
      showToast({
        type: "error",
        title: "Rekomendasi gagal dibuat.",
        description: "Pastikan ML Service aktif dan data latih cukup.",
      });
    } finally {
      setProcessingId(null);
      setConfirmItem(null);
    }
  }

  return (
    <ProtectedRoute role="admin">
      <DashboardLayout
        sidebarItems={adminSidebarItems}
        activeLabel="Rekomendasi Prioritas"
        roleLabel="Admin Kelurahan"
        title="Rekomendasi Prioritas"
        subtitle="Kelola hasil rekomendasi prioritas aspirasi berbasis TF-IDF dan SVM"
        showNotification
      >
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {[["Belum Diproses", summary.none, "slate"], ["Prioritas Tinggi", summary.tinggi, "red"], ["Prioritas Sedang", summary.sedang, "amber"], ["Prioritas Rendah", summary.rendah, "green"]].map(([label, value, tone]) => (
            <GlassCard className="p-5" key={label}>
              <p className="text-sm font-medium text-slate-500">{label}</p>
              <p className="mt-3 text-3xl font-bold text-slate-900">{value}</p>
              <div className="mt-2"><StatusBadge tone={tone as "red" | "amber" | "green" | "slate"}>{String(label)}</StatusBadge></div>
            </GlassCard>
          ))}
        </div>

        <GlassCard className="mt-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-bold uppercase text-blue-700">Daftar rekomendasi</p>
              <h2 className="mt-1 text-2xl font-bold text-slate-900">{filtered.length} aspirasi ditampilkan</h2>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <label className="relative sm:w-72"><Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} /><input className="h-11 w-full rounded-xl border border-white/60 bg-white/55 pl-10 pr-4 text-sm outline-none" placeholder="Cari aspirasi..." value={search} onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }} /></label>
              <select className="h-11 rounded-xl border border-white/60 bg-white/55 px-4 text-sm" value={priority} onChange={(e) => { setPriority(e.target.value as PriorityFilter); setCurrentPage(1); }}>
                <option value="all">Semua</option><option value="none">Belum diproses</option><option value="tinggi">Tinggi</option><option value="sedang">Sedang</option><option value="rendah">Rendah</option>
              </select>
            </div>
          </div>
          {error ? <p className="mt-5 rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 ring-1 ring-red-100">{error}</p> : null}
          <div className="mt-6 overflow-x-auto rounded-2xl ring-1 ring-white/60">
            <table className="w-full min-w-[980px] bg-white/35 text-left text-sm">
              <thead className="bg-white/55 text-xs uppercase text-slate-500"><tr><th className="px-4 py-3">Kode</th><th className="px-4 py-3">Judul</th><th className="px-4 py-3">Kategori</th><th className="px-4 py-3">Wilayah</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Prioritas</th><th className="px-4 py-3">Score</th><th className="px-4 py-3 text-right">Aksi</th></tr></thead>
              <tbody>
                {loading ? <tr><td className="px-4 py-10 text-center text-slate-500" colSpan={8}><Loader2 className="mx-auto mb-2 animate-spin text-blue-700" />Memuat aspirasi...</td></tr> : filtered.length === 0 ? <tr><td className="px-4 py-10 text-center text-slate-500" colSpan={8}><EmptyState title="Belum ada rekomendasi" description="Tidak ada aspirasi yang cocok dengan filter rekomendasi saat ini." /></td></tr> : paginated.map((item) => (
                  <tr className="border-t border-white/60" key={item.id}>
                    <td className="px-4 py-4 font-bold text-slate-800">{item.code}</td>
                    <td className="px-4 py-4 font-semibold text-slate-700">{item.title}</td>
                    <td className="px-4 py-4 text-slate-500">{item.category?.name}</td>
                    <td className="px-4 py-4 text-slate-500">RT {item.region?.rt} / RW {item.region?.rw}</td>
                    <td className="px-4 py-4"><StatusBadge tone={statusTones[item.status]}>{statusLabels[item.status]}</StatusBadge></td>
                    <td className="px-4 py-4"><StatusBadge tone={priorityTone(item.priority_recommendation)}>{priorityLabel(item.priority_recommendation)}</StatusBadge></td>
                    <td className="px-4 py-4 text-slate-500">{item.svm_score ?? "-"}</td>
                    <td className="px-4 py-4"><div className="flex justify-end gap-2"><Link className="flex size-9 items-center justify-center rounded-xl bg-white/55 text-blue-700" href={`/admin/aspirations/${item.id}`}><Eye size={16} /></Link><GlassButton className="min-h-9 px-3 py-2" onClick={() => item.priority_recommendation ? setConfirmItem(item) : predict(item)} disabled={processingId === item.id}>{processingId === item.id ? <Loader2 className="animate-spin" size={16} /> : <RefreshCw size={16} />}{item.priority_recommendation ? "Ulang" : "Proses"}</GlassButton></div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination currentPage={currentPage} totalItems={filtered.length} itemsPerPage={itemsPerPage} onPageChange={setCurrentPage} onItemsPerPageChange={(value) => { setItemsPerPage(value); setCurrentPage(1); }} />
        </GlassCard>
        <ConfirmDialog
          open={Boolean(confirmItem)}
          title="Proses ulang rekomendasi?"
          description="Hasil prioritas tersimpan akan diperbarui memakai data latih SVM aktif saat ini."
          confirmLabel="Proses Ulang"
          loading={processingId === confirmItem?.id}
          onCancel={() => setConfirmItem(null)}
          onConfirm={() => confirmItem ? predict(confirmItem) : undefined}
        />
      </DashboardLayout>
    </ProtectedRoute>
  );
}
