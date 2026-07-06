"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { FileUp, Loader2, Send } from "lucide-react";
import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { wargaSidebarItems } from "@/components/layout/wargaSidebarItems";
import { GlassButton } from "@/components/ui/GlassButton";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlassInput } from "@/components/ui/GlassInput";
import { api } from "@/lib/api";
import type { ApiResponse, MasterOption } from "@/lib/aspirations";

type RegionOption = MasterOption & {
  rt: string;
  rw: string;
};

type ApiErrorResponse = {
  message?: string;
  errors?: Record<string, string[] | string>;
  data?: {
    errors?: Record<string, string[] | string>;
  };
};

function firstValidationMessage(errors?: Record<string, string[] | string>) {
  if (!errors) {
    return undefined;
  }

  const firstValue = Object.values(errors)[0];

  if (Array.isArray(firstValue)) {
    return firstValue[0];
  }

  return firstValue;
}

function getErrorMessage(error: unknown) {
  if (axios.isAxiosError<ApiErrorResponse>(error)) {
    const data = error.response?.data;
    const validationMessage =
      firstValidationMessage(data?.errors) ?? firstValidationMessage(data?.data?.errors);

    if (validationMessage) {
      return validationMessage;
    }

    if (data?.message) {
      return data.message;
    }

    if (typeof error.response?.data === "string") {
      return error.response.data;
    }
  }

  return "Aspirasi gagal dikirim.";
}

export default function CreateAspirationPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<MasterOption[]>([]);
  const [regions, setRegions] = useState<RegionOption[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [loadingOptions, setLoadingOptions] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadOptions() {
      await Promise.resolve();

      try {
        const [categoryResponse, regionResponse] = await Promise.all([
          api.get<ApiResponse<MasterOption[]>>("/aspiration-categories?active=1"),
          api.get<ApiResponse<RegionOption[]>>("/regions?active=1"),
        ]);

        if (active) {
          setCategories(categoryResponse.data.data);
          setRegions(regionResponse.data.data);
        }
      } catch (loadError) {
        if (active) {
          setError(getErrorMessage(loadError));
        }
      } finally {
        if (active) {
          setLoadingOptions(false);
        }
      }
    }

    loadOptions();

    return () => {
      active = false;
    };
  }, []);

  function handleFiles(event: ChangeEvent<HTMLInputElement>) {
    setFiles(Array.from(event.target.files ?? []).slice(0, 3));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    const formElement = event.currentTarget;
    const source = new FormData(formElement);
    const form = new FormData();

    form.append("aspiration_category_id", String(source.get("aspiration_category_id") ?? ""));
    form.append("region_id", String(source.get("region_id") ?? ""));
    form.append("title", String(source.get("title") ?? ""));
    form.append("content", String(source.get("content") ?? ""));

    const locationDetail = String(source.get("location_detail") ?? "");

    if (locationDetail) {
      form.append("location_detail", locationDetail);
    }

    if (process.env.NODE_ENV === "development") {
      console.log(
        files.map((file) => ({
          name: file.name,
          size: file.size,
          type: file.type,
          isFile: file instanceof File,
        })),
      );
    }

    files
      .filter((file) => file instanceof File)
      .forEach((file) => form.append("attachments[]", file));

    try {
      await api.post("/my-aspirations", form, {
        headers: {
          Accept: "application/json",
        },
      });
      alert("Aspirasi berhasil diajukan.");
      router.replace("/warga/aspirations");
    } catch (submitError) {
      setError(getErrorMessage(submitError));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <ProtectedRoute role="warga">
      <DashboardLayout
        sidebarItems={wargaSidebarItems}
        activeLabel="Ajukan Aspirasi"
        roleLabel="Warga"
        title="Ajukan Aspirasi"
        subtitle="Sampaikan aspirasi atau pengaduan warga"
      >
        <GlassCard className="mx-auto max-w-4xl">
          <div>
            <p className="text-sm font-bold uppercase text-blue-700">
              Form aspirasi
            </p>
            <h2 className="mt-1 text-2xl font-bold text-slate-900">
              Lengkapi detail aspirasi
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Pilih kategori dan wilayah yang sesuai agar aspirasi mudah dipetakan.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 grid gap-4 md:grid-cols-2">
            <label className="block text-sm font-medium text-slate-700">
              Kategori Aspirasi
              <select
                className="mt-2 h-12 w-full rounded-xl border border-white/60 bg-white/55 px-4 text-sm text-slate-900 outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10"
                name="aspiration_category_id"
                required
                disabled={loadingOptions}
              >
                <option value="">Pilih kategori</option>
                {categories.map((category) => (
                  <option value={category.id} key={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="block text-sm font-medium text-slate-700">
              Wilayah RT/RW
              <select
                className="mt-2 h-12 w-full rounded-xl border border-white/60 bg-white/55 px-4 text-sm text-slate-900 outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10"
                name="region_id"
                required
                disabled={loadingOptions}
              >
                <option value="">Pilih wilayah</option>
                {regions.map((region) => (
                  <option value={region.id} key={region.id}>
                    RT {region.rt} / RW {region.rw} - {region.name}
                  </option>
                ))}
              </select>
            </label>

            <GlassInput
              label="Judul Aspirasi"
              name="title"
              placeholder="Contoh: Jalan berlubang di depan RT 01"
              maxLength={150}
              required
              className="md:col-span-2"
            />
            <GlassInput
              label="Lokasi Detail"
              name="location_detail"
              placeholder="Contoh: depan balai warga, dekat pos ronda"
              maxLength={255}
              className="md:col-span-2"
            />
            <GlassInput
              label="Isi Aspirasi"
              name="content"
              placeholder="Jelaskan kondisi, dampak, dan harapan tindak lanjut."
              textarea
              required
              className="md:col-span-2"
            />

            <div className="md:col-span-2 rounded-2xl bg-white/40 p-4 ring-1 ring-white/60">
              <label className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-blue-200 bg-white/35 px-4 py-6 text-center text-sm text-slate-600">
                <FileUp className="text-blue-700" size={26} />
                <span className="font-semibold text-slate-700">
                  Upload Bukti Pendukung
                </span>
                <span className="text-xs">
                  Maksimal 3 file, 5MB per file. Format: jpg, jpeg, png, pdf, doc, docx.
                </span>
                <input
                  className="sr-only"
                  name="attachments_picker"
                  type="file"
                  multiple
                  accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
                  onChange={handleFiles}
                />
              </label>
              {files.length > 0 ? (
                <div className="mt-3 space-y-2">
                  {files.map((file) => (
                    <p className="rounded-xl bg-white/45 px-3 py-2 text-xs font-medium text-slate-600" key={file.name}>
                      {file.name}
                    </p>
                  ))}
                </div>
              ) : null}
            </div>

            {error ? (
              <p className="md:col-span-2 rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 ring-1 ring-red-100">
                {error}
              </p>
            ) : null}

            <div className="md:col-span-2 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <GlassButton href="/warga/aspirations" variant="secondary">
                Batal
              </GlassButton>
              <GlassButton type="submit" disabled={submitting || loadingOptions}>
                {submitting ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
                {submitting ? "Mengirim..." : "Kirim Aspirasi"}
              </GlassButton>
            </div>
          </form>
        </GlassCard>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
