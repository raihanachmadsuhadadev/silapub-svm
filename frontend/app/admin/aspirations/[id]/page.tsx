"use client";

import axios from "axios";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, CheckCircle2, FileText, Loader2, MessageSquareText, Send, XCircle } from "lucide-react";
import { useCallback, useEffect, useState, type FormEvent } from "react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { adminSidebarItems } from "@/components/layout/adminSidebarItems";
import { GlassButton } from "@/components/ui/GlassButton";
import { GlassCard } from "@/components/ui/GlassCard";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { api } from "@/lib/api";
import {
  formatDate,
  attachmentUrl,
  priorityLabel,
  statusLabels,
  statusTones,
  type ApiResponse,
  type Aspiration,
  type AspirationStatus,
} from "@/lib/aspirations";

type ActionMode = "verify" | "reject" | "in_progress" | "completed";

function getErrorMessage(error: unknown) {
  if (axios.isAxiosError<{ message?: string; errors?: Record<string, string[]> }>(error)) {
    const errors = error.response?.data?.errors;
    const firstError = errors ? Object.values(errors)[0]?.[0] : undefined;
    return firstError ?? error.response?.data?.message ?? "Aksi gagal diproses.";
  }

  return "Aksi gagal diproses.";
}

export default function AdminAspirationDetailPage() {
  const params = useParams<{ id: string }>();
  const [aspiration, setAspiration] = useState<Aspiration | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionMode, setActionMode] = useState<ActionMode | null>(null);
  const [note, setNote] = useState("");
  const [responseText, setResponseText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [actionError, setActionError] = useState("");

  const loadDetail = useCallback(async (active = true) => {
    try {
      const response = await api.get<ApiResponse<Aspiration>>(`/admin/aspirations/${params.id}`);
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
  }, [params.id]);

  useEffect(() => {
    let active = true;

    async function bootstrap() {
      await Promise.resolve();
      await loadDetail(active);
    }

    bootstrap();

    return () => {
      active = false;
    };
  }, [loadDetail]);

  async function handleActionSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!aspiration || !actionMode) {
      return;
    }

    setSubmitting(true);
    setActionError("");

    try {
      if (actionMode === "verify") {
        await api.put(`/admin/aspirations/${aspiration.id}/verify`, { note: note || undefined });
      } else if (actionMode === "reject") {
        await api.put(`/admin/aspirations/${aspiration.id}/reject`, { note });
      } else {
        await api.put(`/admin/aspirations/${aspiration.id}/status`, {
          status: actionMode,
          note: note || undefined,
        });
      }

      alert("Status aspirasi berhasil diperbarui.");
      setActionMode(null);
      setNote("");
      await loadDetail();
    } catch (submitError) {
      setActionError(getErrorMessage(submitError));
    } finally {
      setSubmitting(false);
    }
  }

  async function handleResponseSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!aspiration) {
      return;
    }

    setSubmitting(true);
    setActionError("");

    try {
      await api.post(`/admin/aspirations/${aspiration.id}/responses`, {
        response_text: responseText,
      });
      alert("Tanggapan berhasil dikirim.");
      setResponseText("");
      await loadDetail();
    } catch (submitError) {
      setActionError(getErrorMessage(submitError));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <ProtectedRoute role="admin">
      <DashboardLayout
        sidebarItems={adminSidebarItems}
        activeLabel="Data Aspirasi"
        roleLabel="Admin Kelurahan"
        title="Detail Aspirasi"
        subtitle="Lihat detail aspirasi masuk"
        showNotification
      >
        <div className="mb-5">
          <GlassButton href="/admin/aspirations" variant="secondary">
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
                <Info label="Nama Warga" value={aspiration.user?.name} />
                <Info label="Email Warga" value={aspiration.user?.email} />
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
              <AdminActionPanel
                status={aspiration.status}
                actionMode={actionMode}
                note={note}
                submitting={submitting}
                actionError={actionError}
                onModeChange={(mode) => {
                  setActionMode(mode);
                  setNote("");
                  setActionError("");
                }}
                onNoteChange={setNote}
                onSubmit={handleActionSubmit}
              />

              <GlassCard>
                <p className="text-sm font-bold uppercase text-blue-700">Tambah Tanggapan</p>
                <form className="mt-4 space-y-3" onSubmit={handleResponseSubmit}>
                  <textarea
                    className="min-h-28 w-full resize-none rounded-xl border border-white/60 bg-white/55 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:bg-white/75 focus:ring-4 focus:ring-blue-500/10"
                    placeholder="Tulis tanggapan yang akan dilihat warga..."
                    value={responseText}
                    onChange={(event) => setResponseText(event.target.value)}
                    required
                    minLength={5}
                  />
                  {actionError && !actionMode ? (
                    <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 ring-1 ring-red-100">
                      {actionError}
                    </p>
                  ) : null}
                  <GlassButton type="submit" className="w-full" disabled={submitting}>
                    {submitting ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
                    Kirim Tanggapan
                  </GlassButton>
                </form>
              </GlassCard>

              <GlassCard>
                <p className="text-sm font-bold uppercase text-teal-700">Tanggapan Terkirim</p>
                <div className="mt-4 space-y-3">
                  {aspiration.responses && aspiration.responses.length > 0 ? (
                    aspiration.responses.map((response) => (
                      <div
                        className="rounded-2xl bg-white/40 p-4 ring-1 ring-white/60"
                        key={response.id}
                      >
                        <div className="flex flex-wrap items-center gap-2">
                          <StatusBadge tone={statusTones[response.status]}>
                            {statusLabels[response.status]}
                          </StatusBadge>
                          <span className="text-xs font-medium text-slate-500">
                            {formatDate(response.created_at)}
                          </span>
                        </div>
                        <p className="mt-3 text-sm leading-6 text-slate-700">
                          {response.response_text}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="rounded-2xl bg-white/40 p-4 text-sm text-slate-500 ring-1 ring-white/60">
                      Belum ada tanggapan yang dikirim.
                    </p>
                  )}
                </div>
              </GlassCard>

              <GlassCard>
                <p className="text-sm font-bold uppercase text-teal-700">Bukti Pendukung</p>
                <div className="mt-4 space-y-3">
                  {aspiration.attachments && aspiration.attachments.length > 0 ? (
                    aspiration.attachments.map((attachment) => (
                      <Link
                        className="flex items-center gap-3 rounded-2xl bg-white/40 p-3 text-sm font-semibold text-slate-700 ring-1 ring-white/60"
                        href={attachmentUrl(attachment)}
                        target="_blank"
                        rel="noopener noreferrer"
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

function AdminActionPanel({
  status,
  actionMode,
  note,
  submitting,
  actionError,
  onModeChange,
  onNoteChange,
  onSubmit,
}: {
  status: AspirationStatus;
  actionMode: ActionMode | null;
  note: string;
  submitting: boolean;
  actionError: string;
  onModeChange: (mode: ActionMode) => void;
  onNoteChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}) {
  const actions =
    status === "submitted"
      ? [
          { mode: "verify" as const, label: "Verifikasi", icon: CheckCircle2 },
          { mode: "reject" as const, label: "Tolak", icon: XCircle },
        ]
      : status === "verified"
        ? [
            { mode: "in_progress" as const, label: "Proses", icon: MessageSquareText },
            { mode: "reject" as const, label: "Tolak", icon: XCircle },
          ]
        : status === "in_progress"
          ? [
              { mode: "completed" as const, label: "Selesaikan", icon: CheckCircle2 },
              { mode: "reject" as const, label: "Tolak", icon: XCircle },
            ]
          : [];

  const labels: Record<ActionMode, string> = {
    verify: "Verifikasi Aspirasi",
    reject: "Tolak Aspirasi",
    in_progress: "Proses Aspirasi",
    completed: "Selesaikan Aspirasi",
  };

  const noteRequired = actionMode === "reject" || actionMode === "completed";

  return (
    <GlassCard>
      <p className="text-sm font-bold uppercase text-violet-700">Aksi Admin</p>
      {actions.length === 0 ? (
        <p className="mt-4 rounded-2xl bg-white/40 p-4 text-sm text-slate-600 ring-1 ring-white/60">
          Aspirasi sudah berstatus final. Status tidak dapat diubah lagi.
        </p>
      ) : (
        <>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {actions.map((action) => {
              const Icon = action.icon;
              return (
                <button
                  className={`flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold ring-1 transition ${
                    actionMode === action.mode
                      ? "bg-blue-600 text-white ring-blue-600"
                      : "bg-white/45 text-slate-700 ring-white/70 hover:bg-white/65"
                  }`}
                  key={action.mode}
                  type="button"
                  onClick={() => onModeChange(action.mode)}
                >
                  <Icon size={18} />
                  {action.label}
                </button>
              );
            })}
          </div>

          {actionMode ? (
            <form className="mt-4 space-y-3" onSubmit={onSubmit}>
              <p className="text-sm font-bold text-slate-800">{labels[actionMode]}</p>
              <textarea
                className="min-h-28 w-full resize-none rounded-xl border border-white/60 bg-white/55 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:bg-white/75 focus:ring-4 focus:ring-blue-500/10"
                placeholder={noteRequired ? "Catatan wajib diisi..." : "Catatan opsional..."}
                value={note}
                onChange={(event) => onNoteChange(event.target.value)}
                required={noteRequired}
                minLength={noteRequired ? 5 : undefined}
              />
              {actionError ? (
                <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 ring-1 ring-red-100">
                  {actionError}
                </p>
              ) : null}
              <GlassButton type="submit" className="w-full" disabled={submitting}>
                {submitting ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
                Simpan Aksi
              </GlassButton>
            </form>
          ) : null}
        </>
      )}
    </GlassCard>
  );
}
