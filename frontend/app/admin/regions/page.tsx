"use client";

import axios from "axios";
import { Edit3, Loader2, Plus, Search, Trash2, X } from "lucide-react";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { adminSidebarItems } from "@/components/layout/adminSidebarItems";
import { GlassButton } from "@/components/ui/GlassButton";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlassInput } from "@/components/ui/GlassInput";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { api } from "@/lib/api";

type Region = {
  id: number;
  code: string;
  rt: string;
  rw: string;
  name: string | null;
  address: string | null;
  description: string | null;
  is_active: boolean;
};

type RegionForm = {
  code: string;
  rt: string;
  rw: string;
  name: string;
  address: string;
  description: string;
  is_active: boolean;
};

type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

const initialForm: RegionForm = {
  code: "",
  rt: "",
  rw: "",
  name: "",
  address: "",
  description: "",
  is_active: true,
};

function getErrorMessage(error: unknown) {
  if (axios.isAxiosError<{ message?: string; errors?: Record<string, string[]> }>(error)) {
    const errors = error.response?.data?.errors;
    const firstError = errors ? Object.values(errors)[0]?.[0] : undefined;
    return firstError ?? error.response?.data?.message ?? "Terjadi kesalahan.";
  }

  return "Terjadi kesalahan.";
}

export default function AdminRegionsPage() {
  const [regions, setRegions] = useState<Region[]>([]);
  const [form, setForm] = useState<RegionForm>(initialForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const filteredRegions = useMemo(() => {
    const keyword = search.toLowerCase();

    return regions.filter((region) =>
      [
        region.code,
        region.rt,
        region.rw,
        region.name ?? "",
        region.address ?? "",
        region.description ?? "",
      ]
        .join(" ")
        .toLowerCase()
        .includes(keyword),
    );
  }, [regions, search]);

  async function fetchRegions() {
    setLoading(true);
    setError("");

    try {
      const response = await api.get<ApiResponse<Region[]>>("/regions");
      setRegions(response.data.data);
    } catch (fetchError) {
      setError(getErrorMessage(fetchError));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let active = true;

    async function loadRegions() {
      await Promise.resolve();

      if (active) {
        await fetchRegions();
      }
    }

    loadRegions();

    return () => {
      active = false;
    };
  }, []);

  function resetForm() {
    setForm(initialForm);
    setEditingId(null);
  }

  function editRegion(region: Region) {
    setEditingId(region.id);
    setForm({
      code: region.code,
      rt: region.rt,
      rw: region.rw,
      name: region.name ?? "",
      address: region.address ?? "",
      description: region.description ?? "",
      is_active: region.is_active,
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      if (editingId) {
        await api.put(`/regions/${editingId}`, form);
        alert("Wilayah berhasil diperbarui.");
      } else {
        await api.post("/regions", form);
        alert("Wilayah berhasil ditambahkan.");
      }

      resetForm();
      await fetchRegions();
    } catch (submitError) {
      setError(getErrorMessage(submitError));
    } finally {
      setSaving(false);
    }
  }

  async function deleteRegion(region: Region) {
    if (!window.confirm(`Hapus wilayah ${region.code}?`)) {
      return;
    }

    setError("");

    try {
      await api.delete(`/regions/${region.id}`);
      alert("Wilayah berhasil dihapus.");
      await fetchRegions();
    } catch (deleteError) {
      setError(getErrorMessage(deleteError));
    }
  }

  return (
    <ProtectedRoute role="admin">
      <DashboardLayout
        sidebarItems={adminSidebarItems}
        activeLabel="Wilayah"
        roleLabel="Admin Kelurahan"
        title="Wilayah RT/RW"
        subtitle="Kelola master wilayah untuk lokasi aspirasi"
        showNotification
      >
        <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
          <GlassCard>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-bold uppercase text-blue-700">
                  Master data
                </p>
                <h2 className="mt-1 text-2xl font-bold text-slate-900">
                  {editingId ? "Edit Wilayah" : "Tambah Wilayah"}
                </h2>
              </div>
              {editingId ? (
                <button
                  className="flex size-10 items-center justify-center rounded-xl bg-white/55 text-slate-600 ring-1 ring-white/70"
                  type="button"
                  onClick={resetForm}
                  aria-label="Batal edit"
                >
                  <X size={18} />
                </button>
              ) : null}
            </div>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <GlassInput
                label="Kode"
                value={form.code}
                onChange={(event) => setForm((current) => ({ ...current, code: event.target.value }))}
                placeholder="WIL-RT01-RW01"
                required
              />
              <div className="grid gap-4 sm:grid-cols-2">
                <GlassInput
                  label="RT"
                  value={form.rt}
                  onChange={(event) => setForm((current) => ({ ...current, rt: event.target.value }))}
                  placeholder="01"
                  required
                />
                <GlassInput
                  label="RW"
                  value={form.rw}
                  onChange={(event) => setForm((current) => ({ ...current, rw: event.target.value }))}
                  placeholder="01"
                  required
                />
              </div>
              <GlassInput
                label="Nama Wilayah"
                value={form.name}
                onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                placeholder="Lingkungan Watubelah Utara"
              />
              <GlassInput
                label="Alamat"
                value={form.address}
                onChange={(event) =>
                  setForm((current) => ({ ...current, address: event.target.value }))
                }
                placeholder="Keterangan alamat"
                textarea
              />
              <GlassInput
                label="Deskripsi"
                value={form.description}
                onChange={(event) =>
                  setForm((current) => ({ ...current, description: event.target.value }))
                }
                placeholder="Catatan wilayah"
                textarea
              />
              <label className="flex items-center gap-3 rounded-2xl bg-white/40 px-4 py-3 text-sm font-semibold text-slate-700 ring-1 ring-white/60">
                <input
                  type="checkbox"
                  checked={form.is_active}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, is_active: event.target.checked }))
                  }
                  className="size-4 accent-blue-600"
                />
                Status aktif
              </label>

              {error ? (
                <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 ring-1 ring-red-100">
                  {error}
                </p>
              ) : null}

              <GlassButton type="submit" className="w-full" disabled={saving}>
                {saving ? <Loader2 className="animate-spin" size={18} /> : <Plus size={18} />}
                {saving ? "Menyimpan..." : editingId ? "Simpan Perubahan" : "Tambah Wilayah"}
              </GlassButton>
            </form>
          </GlassCard>

          <GlassCard>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-bold uppercase text-teal-700">
                  Daftar wilayah
                </p>
                <h2 className="mt-1 text-2xl font-bold text-slate-900">
                  {regions.length} data wilayah
                </h2>
              </div>
              <label className="relative sm:w-72">
                <Search
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  size={18}
                />
                <input
                  className="h-11 w-full rounded-xl border border-white/60 bg-white/55 pl-10 pr-4 text-sm outline-none focus:border-blue-300 focus:ring-4 focus:ring-blue-500/10"
                  placeholder="Cari wilayah..."
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                />
              </label>
            </div>

            <div className="mt-6 overflow-x-auto rounded-2xl ring-1 ring-white/60">
              <table className="w-full min-w-[860px] border-collapse bg-white/35 text-left text-sm">
                <thead className="bg-white/55 text-xs uppercase text-slate-500">
                  <tr>
                    <th className="px-4 py-3">Kode</th>
                    <th className="px-4 py-3">RT</th>
                    <th className="px-4 py-3">RW</th>
                    <th className="px-4 py-3">Nama Wilayah</th>
                    <th className="px-4 py-3">Alamat</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td className="px-4 py-10 text-center text-slate-500" colSpan={7}>
                        <Loader2 className="mx-auto mb-2 animate-spin text-blue-700" />
                        Memuat wilayah...
                      </td>
                    </tr>
                  ) : filteredRegions.length === 0 ? (
                    <tr>
                      <td className="px-4 py-10 text-center text-slate-500" colSpan={7}>
                        Belum ada wilayah yang cocok.
                      </td>
                    </tr>
                  ) : (
                    filteredRegions.map((region) => (
                      <tr className="border-t border-white/60" key={region.id}>
                        <td className="px-4 py-4 font-bold text-slate-800">{region.code}</td>
                        <td className="px-4 py-4 font-semibold text-slate-700">{region.rt}</td>
                        <td className="px-4 py-4 font-semibold text-slate-700">{region.rw}</td>
                        <td className="px-4 py-4 text-slate-600">{region.name || "-"}</td>
                        <td className="px-4 py-4 text-slate-500">{region.address || "-"}</td>
                        <td className="px-4 py-4">
                          <StatusBadge tone={region.is_active ? "green" : "slate"}>
                            {region.is_active ? "Aktif" : "Nonaktif"}
                          </StatusBadge>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex justify-end gap-2">
                            <button
                              className="flex size-9 items-center justify-center rounded-xl bg-white/55 text-blue-700 ring-1 ring-white/70"
                              type="button"
                              onClick={() => editRegion(region)}
                              aria-label={`Edit ${region.code}`}
                            >
                              <Edit3 size={16} />
                            </button>
                            <button
                              className="flex size-9 items-center justify-center rounded-xl bg-white/55 text-red-600 ring-1 ring-white/70"
                              type="button"
                              onClick={() => deleteRegion(region)}
                              aria-label={`Hapus ${region.code}`}
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </GlassCard>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
