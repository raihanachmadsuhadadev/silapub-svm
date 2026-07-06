"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, FileText, Loader2 } from "lucide-react";
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
  statusLabels,
  statusTones,
  type ApiResponse,
  type Aspiration,
} from "@/lib/aspirations";

export default function WargaAspirationDetailPage() {
  const params = useParams<{ id: string }>();
  const [aspiration, setAspiration] = useState<Aspiration | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadDetail() {
      await Promise.resolve();

      try {
        const response = await api.get<ApiResponse<Aspiration>>(`/my-aspirations/${params.id}`);
        if (active) {
          setAspiration(response.data.data);
        }
      } catch {
        if (active) {
          setError("Gagal memuat detail aspirasi.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadDetail();

    return () => {
      active = false;
    };
  }, [params.id]);

  return (
    <ProtectedRoute role="warga">
      <DashboardLayout
        sidebarItems={wargaSidebarItems}
        activeLabel="Status Aspirasi"
        roleLabel="Warga"
        title="Detail Aspirasi"
        subtitle="Pantau status dan informasi aspirasi"
      >
        <div className="mb-5">
          <GlassButton href="/warga/aspirations" variant="secondary">
            <ArrowLeft size={18} />
            Kembali
          </GlassButton>
        </div>

        {loading ? (
          <GlassCard className="flex items-center gap-3 text-sm font-semibold text-slate-600">
            <Loader2 className="animate-spin text-blue-700" size={20} />
            Memuat detail aspirasi...
          </GlassCard>
        ) : error || !aspiration ? (
          <GlassCard>
            <p className="text-sm font-semibold text-red-700">{error || "Aspirasi tidak ditemukan."}</p>
          </GlassCard>
        ) : (
          <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
            <GlassCard>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-sm font-bold uppercase text-blue-700">{aspiration.code}</p>
                  <h2 className="mt-2 text-3xl font-bold text-slate-900">{aspiration.title}</h2>
                </div>
                <StatusBadge tone={statusTones[aspiration.status]}>
                  {statusLabels[aspiration.status]}
                </StatusBadge>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <Info label="Kategori" value={aspiration.category?.name} />
                <Info
                  label="Wilayah"
                  value={`RT ${aspiration.region?.rt} / RW ${aspiration.region?.rw} - ${aspiration.region?.name ?? ""}`}
                />
                <Info label="Lokasi Detail" value={aspiration.location_detail ?? "-"} />
                <Info label="Tanggal Pengajuan" value={formatDate(aspiration.submitted_at)} />
                <Info
                  label="Rekomendasi Prioritas"
                  value={priorityLabel(aspiration.priority_recommendation)}
                  className="md:col-span-2"
                />
              </div>

              <div className="mt-6 rounded-2xl bg-white/40 p-5 ring-1 ring-white/60">
                <p className="text-sm font-bold uppercase text-slate-500">Isi Aspirasi</p>
                <p className="mt-3 whitespace-pre-line text-sm leading-7 text-slate-700">
                  {aspiration.content}
                </p>
              </div>
            </GlassCard>

            <div className="grid gap-6">
              <GlassCard>
                <p className="text-sm font-bold uppercase text-teal-700">Bukti Pendukung</p>
                <div className="mt-4 space-y-3">
                  {aspiration.attachments && aspiration.attachments.length > 0 ? (
                    aspiration.attachments.map((attachment) => (
                      <Link
                        className="flex items-center gap-3 rounded-2xl bg-white/40 p-3 text-sm font-semibold text-slate-700 ring-1 ring-white/60"
                        href={attachment.url ?? "#"}
                        target="_blank"
                        key={attachment.id}
                      >
                        <FileText size={18} className="text-blue-700" />
                        {attachment.file_name}
                      </Link>
                    ))
                  ) : (
                    <p className="rounded-2xl bg-white/40 p-4 text-sm text-slate-500 ring-1 ring-white/60">
                      Tidak ada lampiran.
                    </p>
                  )}
                </div>
              </GlassCard>

              <GlassCard>
                <p className="text-sm font-bold uppercase text-violet-700">Timeline Status</p>
                <div className="mt-5 space-y-4">
                  {(aspiration.status_histories ?? []).map((history, index) => (
                    <div className="flex gap-3" key={history.id}>
                      <span className="mt-1 flex size-7 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
                        {index + 1}
                      </span>
                      <div className="rounded-2xl bg-white/40 px-4 py-3 ring-1 ring-white/60">
                        <StatusBadge tone={statusTones[history.status]}>
                          {statusLabels[history.status]}
                        </StatusBadge>
                        <p className="mt-2 text-sm font-medium text-slate-700">{history.note ?? "-"}</p>
                        <p className="mt-1 text-xs text-slate-500">{formatDate(history.created_at)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </div>
          </div>
        )}
      </DashboardLayout>
    </ProtectedRoute>
  );
}

function Info({ label, value, className = "" }: { label: string; value?: string; className?: string }) {
  return (
    <div className={`rounded-2xl bg-white/40 p-4 ring-1 ring-white/60 ${className}`}>
      <p className="text-xs font-bold uppercase text-slate-500">{label}</p>
      <p className="mt-2 text-sm font-semibold text-slate-800">{value || "-"}</p>
    </div>
  );
}
