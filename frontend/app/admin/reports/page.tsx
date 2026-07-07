"use client";

import Link from "next/link";
import { Eye, Loader2, Printer, RotateCcw, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { adminSidebarItems } from "@/components/layout/adminSidebarItems";
import { EmptyState } from "@/components/ui/EmptyState";
import { GlassButton } from "@/components/ui/GlassButton";
import { GlassCard } from "@/components/ui/GlassCard";
import { Pagination } from "@/components/ui/Pagination";
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
  type AspirationStatus,
  type MasterOption,
} from "@/lib/aspirations";

type PriorityFilter = "" | "tinggi" | "sedang" | "rendah" | "unprocessed";

type ReportFilters = {
  search: string;
  start_date: string;
  end_date: string;
  status: "" | AspirationStatus;
  priority: PriorityFilter;
  category_id: string;
  region_id: string;
};

type ReportData = {
  summary: {
    total: number;
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
  items: Aspiration[];
};

const emptyFilters: ReportFilters = {
  search: "",
  start_date: "",
  end_date: "",
  status: "",
  priority: "",
  category_id: "",
  region_id: "",
};

const emptyReport: ReportData = {
  summary: {
    total: 0,
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
  items: [],
};

const statusOptions: AspirationStatus[] = [
  "submitted",
  "verified",
  "in_progress",
  "completed",
  "rejected",
];

export default function AdminReportsPage() {
  const [filters, setFilters] = useState<ReportFilters>(emptyFilters);
  const [appliedFilters, setAppliedFilters] = useState<ReportFilters>(emptyFilters);
  const [report, setReport] = useState<ReportData>(emptyReport);
  const [categories, setCategories] = useState<MasterOption[]>([]);
  const [regions, setRegions] = useState<MasterOption[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [printedAt, setPrintedAt] = useState("");

  useEffect(() => {
    let active = true;

    async function loadMasterData() {
      await Promise.resolve();

      try {
        const [categoryResponse, regionResponse] = await Promise.all([
          api.get<ApiResponse<MasterOption[]>>("/aspiration-categories"),
          api.get<ApiResponse<MasterOption[]>>("/regions"),
        ]);

        if (active) {
          setCategories(categoryResponse.data.data);
          setRegions(regionResponse.data.data);
        }
      } catch {
        if (active) {
          setError("Gagal memuat data filter kategori atau wilayah.");
        }
      }
    }

    loadMasterData();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;

    async function loadReport() {
      await Promise.resolve();
      setLoading(true);
      setError("");

      try {
        const params = Object.fromEntries(
          Object.entries(appliedFilters).filter(([, value]) => value !== ""),
        );
        const response = await api.get<ApiResponse<ReportData>>("/admin/reports/aspirations", { params });
        if (active) {
          setReport(response.data.data);
        }
      } catch {
        if (active) {
          setError("Gagal memuat laporan aspirasi.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadReport();

    return () => {
      active = false;
    };
  }, [appliedFilters]);

  const activeFilterCount = useMemo(
    () => Object.values(appliedFilters).filter(Boolean).length,
    [appliedFilters],
  );
  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return report.items.slice(start, start + itemsPerPage);
  }, [currentPage, itemsPerPage, report.items]);
  const filterSummary = useMemo(() => {
    const category = categories.find((item) => String(item.id) === appliedFilters.category_id);
    const region = regions.find((item) => String(item.id) === appliedFilters.region_id);
    const period =
      appliedFilters.start_date || appliedFilters.end_date
        ? `${appliedFilters.start_date || "awal"} s/d ${appliedFilters.end_date || "akhir"}`
        : "Semua periode";

    return {
      period,
      status: appliedFilters.status ? statusLabels[appliedFilters.status] : "Semua",
      priority: appliedFilters.priority ? priorityLabel(appliedFilters.priority === "unprocessed" ? null : appliedFilters.priority) : "Semua",
      category: category?.name ?? "Semua",
      region: region ? `RT ${region.rt} / RW ${region.rw}` : "Semua",
      search: appliedFilters.search || "-",
    };
  }, [appliedFilters, categories, regions]);

  function updateFilter(key: keyof ReportFilters, value: string) {
    setFilters((current) => ({ ...current, [key]: value }));
  }

  function applyFilters() {
    setCurrentPage(1);
    setAppliedFilters(filters);
  }

  function resetFilters() {
    setFilters(emptyFilters);
    setCurrentPage(1);
    setAppliedFilters(emptyFilters);
  }

  function handlePrint() {
    setPrintedAt(formatPrintDate(new Date()));
    window.setTimeout(() => window.print(), 0);
  }

  return (
    <ProtectedRoute role="admin">
      <DashboardLayout
        sidebarItems={adminSidebarItems}
        activeLabel="Laporan"
        roleLabel="Admin Kelurahan"
        title="Laporan Aspirasi"
        subtitle="Pantau dan filter data aspirasi warga berdasarkan status, prioritas, kategori, wilayah, dan periode."
        showNotification
      >
        <div className="print-only print-area">
          <header>
            <p className="print-brand">SILAPUB</p>
            <h1>Laporan Aspirasi Warga</h1>
            <div className="print-meta">
              <p>Tanggal Cetak: {printedAt || formatPrintDate(new Date())}</p>
              <p>Dicetak Oleh: Admin Kelurahan</p>
            </div>
          </header>

          <section className="print-section">
            <h2>Filter</h2>
            <div className="print-filter-grid">
              <p>Periode: {filterSummary.period}</p>
              <p>Status: {filterSummary.status}</p>
              <p>Prioritas: {filterSummary.priority}</p>
              <p>Kategori: {filterSummary.category}</p>
              <p>Wilayah: {filterSummary.region}</p>
              <p>Search: {filterSummary.search}</p>
            </div>
          </section>

          <section className="print-section">
            <h2>Ringkasan</h2>
            <div className="print-summary-grid">
              <p>Total Aspirasi: {report.summary.total}</p>
              <p>Diajukan: {report.summary.submitted}</p>
              <p>Diverifikasi: {report.summary.verified}</p>
              <p>Diproses: {report.summary.in_progress}</p>
              <p>Selesai: {report.summary.completed}</p>
              <p>Ditolak: {report.summary.rejected}</p>
              <p>Prioritas Tinggi: {report.summary.priority_high}</p>
              <p>Prioritas Sedang: {report.summary.priority_medium}</p>
              <p>Prioritas Rendah: {report.summary.priority_low}</p>
              <p>Belum Diproses: {report.summary.priority_unprocessed}</p>
            </div>
          </section>

          <section className="print-section">
            <h2>Tabel Data Aspirasi</h2>
            {report.items.length === 0 ? (
              <p className="print-empty">Tidak ada data laporan untuk filter yang dipilih.</p>
            ) : (
              <table className="print-table">
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Kode</th>
                    <th>Judul</th>
                    <th>Warga</th>
                    <th>Kategori</th>
                    <th>Wilayah</th>
                    <th>Status</th>
                    <th>Prioritas</th>
                    <th>Tanggal Pengajuan</th>
                  </tr>
                </thead>
                <tbody>
                  {report.items.map((item, index) => (
                    <tr key={item.id}>
                      <td>{index + 1}</td>
                      <td>{item.code}</td>
                      <td>{item.title}</td>
                      <td>{item.user?.name ?? "-"}</td>
                      <td>{item.category?.name ?? "-"}</td>
                      <td>RT {item.region?.rt} / RW {item.region?.rw}</td>
                      <td>{statusLabels[item.status]}</td>
                      <td>{priorityLabel(item.priority_recommendation)}</td>
                      <td>{formatDate(item.submitted_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </section>
        </div>

        <GlassCard className="screen-only">
          <div className="grid gap-4 lg:grid-cols-[1.3fr_0.7fr_0.7fr]">
            <label className="block text-sm font-medium text-slate-700">
              Search
              <span className="relative mt-2 block">
                <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  className="h-11 w-full rounded-xl border border-white/60 bg-white/55 pl-10 pr-4 text-sm outline-none focus:border-blue-300 focus:ring-4 focus:ring-blue-500/10"
                  placeholder="Kode, judul, atau nama warga"
                  value={filters.search}
                  onChange={(event) => updateFilter("search", event.target.value)}
                />
              </span>
            </label>
            <FilterInput label="Tanggal mulai" type="date" value={filters.start_date} onChange={(value) => updateFilter("start_date", value)} />
            <FilterInput label="Tanggal akhir" type="date" value={filters.end_date} onChange={(value) => updateFilter("end_date", value)} />
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <FilterSelect label="Status" value={filters.status} onChange={(value) => updateFilter("status", value)}>
              <option value="">Semua status</option>
              {statusOptions.map((status) => (
                <option value={status} key={status}>{statusLabels[status]}</option>
              ))}
            </FilterSelect>
            <FilterSelect label="Prioritas" value={filters.priority} onChange={(value) => updateFilter("priority", value)}>
              <option value="">Semua prioritas</option>
              <option value="tinggi">Tinggi</option>
              <option value="sedang">Sedang</option>
              <option value="rendah">Rendah</option>
              <option value="unprocessed">Belum diproses</option>
            </FilterSelect>
            <FilterSelect label="Kategori" value={filters.category_id} onChange={(value) => updateFilter("category_id", value)}>
              <option value="">Semua kategori</option>
              {categories.map((category) => (
                <option value={category.id} key={category.id}>{category.name}</option>
              ))}
            </FilterSelect>
            <FilterSelect label="Wilayah" value={filters.region_id} onChange={(value) => updateFilter("region_id", value)}>
              <option value="">Semua wilayah</option>
              {regions.map((region) => (
                <option value={region.id} key={region.id}>
                  RT {region.rt} / RW {region.rw}
                </option>
              ))}
            </FilterSelect>
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm font-medium text-slate-500">
              {activeFilterCount > 0 ? `${activeFilterCount} filter diterapkan` : "Menampilkan semua data aspirasi"}
            </p>
            <div className="flex flex-wrap gap-2">
              <GlassButton variant="ghost" onClick={resetFilters}>
                <RotateCcw size={18} />
                Reset
              </GlassButton>
              <GlassButton variant="secondary" onClick={handlePrint}>
                <Printer size={18} />
                Print
              </GlassButton>
              <GlassButton onClick={applyFilters}>Terapkan Filter</GlassButton>
            </div>
          </div>
        </GlassCard>

        {error ? (
          <p className="mt-5 rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 ring-1 ring-red-100">
            {error}
          </p>
        ) : null}

        <div className="screen-only mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-6">
          {[
            ["Total", report.summary.total, "text-blue-700"],
            ["Diajukan", report.summary.submitted, "text-amber-600"],
            ["Diproses", report.summary.in_progress, "text-violet-700"],
            ["Selesai", report.summary.completed, "text-green-700"],
            ["Ditolak", report.summary.rejected, "text-red-600"],
            ["Prioritas Tinggi", report.summary.priority_high, "text-red-600"],
          ].map(([label, value, tone]) => (
            <GlassCard className="p-5" key={label}>
              <p className="text-sm font-medium text-slate-500">{label}</p>
              <p className={`mt-3 text-3xl font-bold ${tone}`}>{value}</p>
            </GlassCard>
          ))}
        </div>

        <GlassCard className="screen-only mt-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-bold uppercase text-blue-700">Tabel laporan</p>
              <h2 className="mt-1 text-2xl font-bold text-slate-900">{report.items.length} aspirasi ditampilkan</h2>
            </div>
            <p className="text-sm font-medium text-slate-500">Export PDF/Excel belum diaktifkan pada tahap ini.</p>
          </div>

          <div className="mt-6 overflow-x-auto rounded-2xl ring-1 ring-white/60">
            <table className="w-full min-w-[1120px] bg-white/35 text-left text-sm">
              <thead className="bg-white/55 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-4 py-3">Kode</th>
                  <th className="px-4 py-3">Judul</th>
                  <th className="px-4 py-3">Warga</th>
                  <th className="px-4 py-3">Kategori</th>
                  <th className="px-4 py-3">Wilayah</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Prioritas</th>
                  <th className="px-4 py-3">Tanggal Pengajuan</th>
                  <th className="px-4 py-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td className="px-4 py-10 text-center text-slate-500" colSpan={9}>
                      <Loader2 className="mx-auto mb-2 animate-spin text-blue-700" />
                      Memuat laporan...
                    </td>
                  </tr>
                ) : report.items.length === 0 ? (
                  <tr>
                    <td className="px-4 py-10 text-center text-slate-500" colSpan={9}>
                      <EmptyState
                        title="Tidak ada data laporan"
                        description="Tidak ada data aspirasi yang sesuai filter yang dipilih."
                      />
                    </td>
                  </tr>
                ) : paginatedItems.map((item) => (
                  <tr className="border-t border-white/60" key={item.id}>
                    <td className="px-4 py-4 font-bold text-slate-800">{item.code}</td>
                    <td className="px-4 py-4 font-semibold text-slate-700">{item.title}</td>
                    <td className="px-4 py-4 text-slate-500">{item.user?.name}</td>
                    <td className="px-4 py-4 text-slate-500">{item.category?.name}</td>
                    <td className="px-4 py-4 text-slate-500">RT {item.region?.rt} / RW {item.region?.rw}</td>
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
          <Pagination
            currentPage={currentPage}
            totalItems={report.items.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
            onItemsPerPageChange={(value) => {
              setItemsPerPage(value);
              setCurrentPage(1);
            }}
          />
        </GlassCard>
      </DashboardLayout>
    </ProtectedRoute>
  );
}

function formatPrintDate(date: Date) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function FilterInput({
  label,
  type,
  value,
  onChange,
}: {
  label: string;
  type: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block text-sm font-medium text-slate-700">
      {label}
      <input
        className="mt-2 h-11 w-full rounded-xl border border-white/60 bg-white/55 px-4 text-sm outline-none focus:border-blue-300 focus:ring-4 focus:ring-blue-500/10"
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  children,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  children: React.ReactNode;
}) {
  return (
    <label className="block text-sm font-medium text-slate-700">
      {label}
      <select
        className="mt-2 h-11 w-full rounded-xl border border-white/60 bg-white/55 px-4 text-sm outline-none focus:border-blue-300 focus:ring-4 focus:ring-blue-500/10"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        {children}
      </select>
    </label>
  );
}
