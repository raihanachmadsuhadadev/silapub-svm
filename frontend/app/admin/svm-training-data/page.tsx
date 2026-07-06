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
import { priorityTone, type ApiResponse } from "@/lib/aspirations";

type Label = "tinggi" | "sedang" | "rendah";
type TrainingData = {
  id: number;
  title: string | null;
  text: string;
  label: Label;
  is_active: boolean;
};

const initialForm = { title: "", text: "", label: "sedang" as Label, is_active: true };

function errorMessage(error: unknown) {
  if (axios.isAxiosError<{ message?: string; errors?: Record<string, string[]> }>(error)) {
    const first = error.response?.data?.errors ? Object.values(error.response.data.errors)[0]?.[0] : undefined;
    return first ?? error.response?.data?.message ?? "Aksi gagal diproses.";
  }
  return "Aksi gagal diproses.";
}

export default function SvmTrainingDataPage() {
  const [items, setItems] = useState<TrainingData[]>([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [label, setLabel] = useState<"all" | Label>("all");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function fetchItems(active = true) {
    try {
      const response = await api.get<ApiResponse<TrainingData[]>>("/admin/svm-training-data");
      if (active) setItems(response.data.data);
    } catch (fetchError) {
      if (active) setError(errorMessage(fetchError));
    } finally {
      if (active) setLoading(false);
    }
  }

  useEffect(() => {
    let active = true;

    async function loadItems() {
      await Promise.resolve();
      await fetchItems(active);
    }

    loadItems();

    return () => {
      active = false;
    };
  }, []);

  const filtered = useMemo(() => {
    const keyword = search.toLowerCase();
    return items.filter((item) => {
      const matchLabel = label === "all" || item.label === label;
      const matchText = [item.title ?? "", item.text].join(" ").toLowerCase().includes(keyword);
      return matchLabel && matchText;
    });
  }, [items, label, search]);

  const summary = {
    total: items.length,
    tinggi: items.filter((item) => item.label === "tinggi").length,
    sedang: items.filter((item) => item.label === "sedang").length,
    rendah: items.filter((item) => item.label === "rendah").length,
  };

  function resetForm() {
    setForm(initialForm);
    setEditingId(null);
  }

  function edit(item: TrainingData) {
    setEditingId(item.id);
    setForm({
      title: item.title ?? "",
      text: item.text,
      label: item.label,
      is_active: item.is_active,
    });
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      if (editingId) {
        await api.put(`/admin/svm-training-data/${editingId}`, form);
        alert("Data latih berhasil diperbarui.");
      } else {
        await api.post("/admin/svm-training-data", form);
        alert("Data latih berhasil ditambahkan.");
      }
      resetForm();
      await fetchItems();
    } catch (submitError) {
      setError(errorMessage(submitError));
    } finally {
      setSaving(false);
    }
  }

  async function remove(item: TrainingData) {
    if (!window.confirm("Hapus data latih ini?")) return;
    await api.delete(`/admin/svm-training-data/${item.id}`);
    await fetchItems();
  }

  return (
    <ProtectedRoute role="admin">
      <DashboardLayout
        sidebarItems={adminSidebarItems}
        activeLabel="Data Latih SVM"
        roleLabel="Admin Kelurahan"
        title="Data Latih SVM"
        subtitle="Kelola teks latih dan label prioritas untuk model SVM"
        showNotification
      >
        <div className="mb-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {[["Total Data Latih", summary.total, "slate"], ["Prioritas Tinggi", summary.tinggi, "red"], ["Prioritas Sedang", summary.sedang, "amber"], ["Prioritas Rendah", summary.rendah, "green"]].map(([title, value, tone]) => (
            <GlassCard className="p-5" key={title}>
              <p className="text-sm font-medium text-slate-500">{title}</p>
              <p className="mt-3 text-3xl font-bold text-slate-900">{value}</p>
              <div className="mt-2"><StatusBadge tone={tone as "red" | "amber" | "green" | "slate"}>{String(title)}</StatusBadge></div>
            </GlassCard>
          ))}
        </div>

        <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
          <GlassCard>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-bold uppercase text-blue-700">Form data latih</p>
                <h2 className="mt-1 text-2xl font-bold text-slate-900">{editingId ? "Edit Data Latih" : "Tambah Data Latih"}</h2>
              </div>
              {editingId ? <button className="flex size-10 items-center justify-center rounded-xl bg-white/55" type="button" onClick={resetForm}><X size={18} /></button> : null}
            </div>
            <form className="mt-6 space-y-4" onSubmit={submit}>
              <GlassInput label="Judul" value={form.title} onChange={(e) => setForm((c) => ({ ...c, title: e.target.value }))} maxLength={150} />
              <GlassInput label="Teks Latih" value={form.text} onChange={(e) => setForm((c) => ({ ...c, text: e.target.value }))} textarea required />
              <label className="block text-sm font-medium text-slate-700">
                Label Prioritas
                <select className="mt-2 h-12 w-full rounded-xl border border-white/60 bg-white/55 px-4 text-sm" value={form.label} onChange={(e) => setForm((c) => ({ ...c, label: e.target.value as Label }))}>
                  <option value="tinggi">Tinggi</option>
                  <option value="sedang">Sedang</option>
                  <option value="rendah">Rendah</option>
                </select>
              </label>
              <label className="flex items-center gap-3 rounded-2xl bg-white/40 px-4 py-3 text-sm font-semibold text-slate-700 ring-1 ring-white/60">
                <input type="checkbox" checked={form.is_active} onChange={(e) => setForm((c) => ({ ...c, is_active: e.target.checked }))} className="size-4 accent-blue-600" />
                Status aktif
              </label>
              {error ? <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 ring-1 ring-red-100">{error}</p> : null}
              <GlassButton type="submit" className="w-full" disabled={saving}>
                {saving ? <Loader2 className="animate-spin" size={18} /> : <Plus size={18} />}
                {editingId ? "Simpan Perubahan" : "Tambah Data Latih"}
              </GlassButton>
            </form>
          </GlassCard>

          <GlassCard>
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-sm font-bold uppercase text-teal-700">Daftar data latih</p>
                <h2 className="mt-1 text-2xl font-bold text-slate-900">{filtered.length} data ditampilkan</h2>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <label className="relative sm:w-72"><Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} /><input className="h-11 w-full rounded-xl border border-white/60 bg-white/55 pl-10 pr-4 text-sm outline-none" placeholder="Cari data latih..." value={search} onChange={(e) => setSearch(e.target.value)} /></label>
                <select className="h-11 rounded-xl border border-white/60 bg-white/55 px-4 text-sm" value={label} onChange={(e) => setLabel(e.target.value as "all" | Label)}>
                  <option value="all">Semua</option><option value="tinggi">Tinggi</option><option value="sedang">Sedang</option><option value="rendah">Rendah</option>
                </select>
              </div>
            </div>
            <div className="mt-6 overflow-x-auto rounded-2xl ring-1 ring-white/60">
              <table className="w-full min-w-[820px] bg-white/35 text-left text-sm">
                <thead className="bg-white/55 text-xs uppercase text-slate-500"><tr><th className="px-4 py-3">Judul</th><th className="px-4 py-3">Teks</th><th className="px-4 py-3">Label</th><th className="px-4 py-3">Status</th><th className="px-4 py-3 text-right">Aksi</th></tr></thead>
                <tbody>
                  {loading ? <tr><td className="px-4 py-10 text-center text-slate-500" colSpan={5}><Loader2 className="mx-auto mb-2 animate-spin text-blue-700" />Memuat data...</td></tr> : filtered.length === 0 ? <tr><td className="px-4 py-10 text-center text-slate-500" colSpan={5}>Belum ada data latih.</td></tr> : filtered.map((item) => (
                    <tr className="border-t border-white/60" key={item.id}>
                      <td className="px-4 py-4 font-semibold text-slate-700">{item.title || "-"}</td>
                      <td className="px-4 py-4 text-slate-500">{item.text}</td>
                      <td className="px-4 py-4"><StatusBadge tone={priorityTone(item.label)}>{item.label}</StatusBadge></td>
                      <td className="px-4 py-4"><StatusBadge tone={item.is_active ? "green" : "slate"}>{item.is_active ? "Aktif" : "Nonaktif"}</StatusBadge></td>
                      <td className="px-4 py-4"><div className="flex justify-end gap-2"><button className="flex size-9 items-center justify-center rounded-xl bg-white/55 text-blue-700" type="button" onClick={() => edit(item)}><Edit3 size={16} /></button><button className="flex size-9 items-center justify-center rounded-xl bg-white/55 text-red-600" type="button" onClick={() => remove(item)}><Trash2 size={16} /></button></div></td>
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
