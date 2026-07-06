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

type Category = {
  id: number;
  code: string;
  name: string;
  description: string | null;
  is_active: boolean;
};

type CategoryForm = {
  code: string;
  name: string;
  description: string;
  is_active: boolean;
};

type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

const initialForm: CategoryForm = {
  code: "",
  name: "",
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

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState<CategoryForm>(initialForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const filteredCategories = useMemo(() => {
    const keyword = search.toLowerCase();

    return categories.filter((category) =>
      [category.code, category.name, category.description ?? ""]
        .join(" ")
        .toLowerCase()
        .includes(keyword),
    );
  }, [categories, search]);

  async function fetchCategories() {
    setLoading(true);
    setError("");

    try {
      const response = await api.get<ApiResponse<Category[]>>("/aspiration-categories");
      setCategories(response.data.data);
    } catch (fetchError) {
      setError(getErrorMessage(fetchError));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let active = true;

    async function loadCategories() {
      await Promise.resolve();

      if (active) {
        await fetchCategories();
      }
    }

    loadCategories();

    return () => {
      active = false;
    };
  }, []);

  function resetForm() {
    setForm(initialForm);
    setEditingId(null);
  }

  function editCategory(category: Category) {
    setEditingId(category.id);
    setForm({
      code: category.code,
      name: category.name,
      description: category.description ?? "",
      is_active: category.is_active,
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      if (editingId) {
        await api.put(`/aspiration-categories/${editingId}`, form);
        alert("Kategori berhasil diperbarui.");
      } else {
        await api.post("/aspiration-categories", form);
        alert("Kategori berhasil ditambahkan.");
      }

      resetForm();
      await fetchCategories();
    } catch (submitError) {
      setError(getErrorMessage(submitError));
    } finally {
      setSaving(false);
    }
  }

  async function deleteCategory(category: Category) {
    if (!window.confirm(`Hapus kategori ${category.name}?`)) {
      return;
    }

    setError("");

    try {
      await api.delete(`/aspiration-categories/${category.id}`);
      alert("Kategori berhasil dihapus.");
      await fetchCategories();
    } catch (deleteError) {
      setError(getErrorMessage(deleteError));
    }
  }

  return (
    <ProtectedRoute role="admin">
      <DashboardLayout
        sidebarItems={adminSidebarItems}
        activeLabel="Kategori"
        roleLabel="Admin Kelurahan"
        title="Kategori Aspirasi"
        subtitle="Kelola master kategori untuk pengajuan aspirasi"
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
                  {editingId ? "Edit Kategori" : "Tambah Kategori"}
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
                placeholder="KAT-INFRA"
                required
              />
              <GlassInput
                label="Nama Kategori"
                value={form.name}
                onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                placeholder="Infrastruktur"
                required
              />
              <GlassInput
                label="Deskripsi"
                value={form.description}
                onChange={(event) =>
                  setForm((current) => ({ ...current, description: event.target.value }))
                }
                placeholder="Keterangan kategori"
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
                {saving ? "Menyimpan..." : editingId ? "Simpan Perubahan" : "Tambah Kategori"}
              </GlassButton>
            </form>
          </GlassCard>

          <GlassCard>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-bold uppercase text-teal-700">
                  Daftar kategori
                </p>
                <h2 className="mt-1 text-2xl font-bold text-slate-900">
                  {categories.length} data kategori
                </h2>
              </div>
              <label className="relative sm:w-72">
                <Search
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  size={18}
                />
                <input
                  className="h-11 w-full rounded-xl border border-white/60 bg-white/55 pl-10 pr-4 text-sm outline-none focus:border-blue-300 focus:ring-4 focus:ring-blue-500/10"
                  placeholder="Cari kategori..."
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                />
              </label>
            </div>

            <div className="mt-6 overflow-x-auto rounded-2xl ring-1 ring-white/60">
              <table className="w-full min-w-[760px] border-collapse bg-white/35 text-left text-sm">
                <thead className="bg-white/55 text-xs uppercase text-slate-500">
                  <tr>
                    <th className="px-4 py-3">Kode</th>
                    <th className="px-4 py-3">Nama Kategori</th>
                    <th className="px-4 py-3">Deskripsi</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td className="px-4 py-10 text-center text-slate-500" colSpan={5}>
                        <Loader2 className="mx-auto mb-2 animate-spin text-blue-700" />
                        Memuat kategori...
                      </td>
                    </tr>
                  ) : filteredCategories.length === 0 ? (
                    <tr>
                      <td className="px-4 py-10 text-center text-slate-500" colSpan={5}>
                        Belum ada kategori yang cocok.
                      </td>
                    </tr>
                  ) : (
                    filteredCategories.map((category) => (
                      <tr className="border-t border-white/60" key={category.id}>
                        <td className="px-4 py-4 font-bold text-slate-800">{category.code}</td>
                        <td className="px-4 py-4 font-semibold text-slate-700">{category.name}</td>
                        <td className="px-4 py-4 text-slate-500">
                          {category.description || "-"}
                        </td>
                        <td className="px-4 py-4">
                          <StatusBadge tone={category.is_active ? "green" : "slate"}>
                            {category.is_active ? "Aktif" : "Nonaktif"}
                          </StatusBadge>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex justify-end gap-2">
                            <button
                              className="flex size-9 items-center justify-center rounded-xl bg-white/55 text-blue-700 ring-1 ring-white/70"
                              type="button"
                              onClick={() => editCategory(category)}
                              aria-label={`Edit ${category.name}`}
                            >
                              <Edit3 size={16} />
                            </button>
                            <button
                              className="flex size-9 items-center justify-center rounded-xl bg-white/55 text-red-600 ring-1 ring-white/70"
                              type="button"
                              onClick={() => deleteCategory(category)}
                              aria-label={`Hapus ${category.name}`}
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
