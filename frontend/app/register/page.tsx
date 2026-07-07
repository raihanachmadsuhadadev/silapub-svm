"use client";

import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { GlassButton } from "@/components/ui/GlassButton";
import { GlassInput } from "@/components/ui/GlassInput";
import { useToast } from "@/components/ui/ToastProvider";
import { useAuth, type RegisterPayload } from "@/context/AuthContext";

function getErrorMessage(error: unknown) {
  if (axios.isAxiosError<{ message?: string; errors?: Record<string, string[]> }>(error)) {
    const errors = error.response?.data?.errors;
    const firstError = errors ? Object.values(errors)[0]?.[0] : undefined;
    return firstError ?? error.response?.data?.message ?? "Registrasi gagal.";
  }

  return "Registrasi gagal.";
}

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { showToast } = useToast();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const payload: RegisterPayload = {
      name: String(formData.get("name") ?? ""),
      nik: String(formData.get("nik") ?? ""),
      phone: String(formData.get("phone") ?? ""),
      email: String(formData.get("email") ?? ""),
      rt: String(formData.get("rt") ?? ""),
      rw: String(formData.get("rw") ?? ""),
      address: String(formData.get("address") ?? ""),
      password: String(formData.get("password") ?? ""),
      password_confirmation: String(formData.get("password_confirmation") ?? ""),
    };

    try {
      await register(payload);
      showToast({ type: "success", title: "Registrasi berhasil." });
      router.replace("/warga/dashboard");
    } catch (submitError) {
      const message = getErrorMessage(submitError);
      setError(message);
      showToast({ type: "error", title: "Registrasi gagal.", description: message });
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout
      title="Daftar Sebagai Warga"
      description="Buat akun warga untuk mulai mengajukan aspirasi dan memantau tindak lanjutnya."
    >
      <form onSubmit={handleSubmit} className="mx-auto max-w-3xl">
        <p className="text-sm font-bold uppercase text-blue-700">Registrasi warga</p>
        <h2 className="mt-2 text-3xl font-bold text-slate-900">Daftar Warga</h2>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          Isi data dasar untuk menyiapkan akun warga. Integrasi backend belum diaktifkan.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <GlassInput label="Nama Lengkap" name="name" placeholder="Nama lengkap" required />
          <GlassInput label="NIK" name="nik" placeholder="Nomor induk kependudukan" required />
          <GlassInput label="Nomor HP" name="phone" placeholder="08xxxxxxxxxx" required />
          <GlassInput label="Email" name="email" type="email" placeholder="nama@email.com" required />
          <GlassInput label="RT" name="rt" placeholder="001" required />
          <GlassInput label="RW" name="rw" placeholder="003" required />
          <GlassInput
            label="Alamat Lengkap"
            name="address"
            placeholder="Alamat tempat tinggal"
            textarea
            className="md:col-span-2"
            required
          />
          <GlassInput label="Password" name="password" type="password" placeholder="Password" required />
          <GlassInput
            label="Konfirmasi Password"
            name="password_confirmation"
            type="password"
            placeholder="Ulangi password"
            required
          />
        </div>

        {error ? (
          <p className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 ring-1 ring-red-100">
            {error}
          </p>
        ) : null}

        <div className="mt-6 flex flex-col-reverse gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-600">
            Sudah punya akun?{" "}
            <Link href="/login" className="font-bold text-blue-700">
              Masuk
            </Link>
          </p>
          <GlassButton type="submit" className="w-full sm:w-auto" disabled={loading}>
            {loading ? "Memproses..." : "Daftar Warga"}
          </GlassButton>
        </div>
      </form>
    </AuthLayout>
  );
}
