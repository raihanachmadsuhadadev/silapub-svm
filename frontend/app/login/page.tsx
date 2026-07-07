"use client";

import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { GlassButton } from "@/components/ui/GlassButton";
import { GlassInput } from "@/components/ui/GlassInput";
import { useToast } from "@/components/ui/ToastProvider";
import { useAuth, type UserRole } from "@/context/AuthContext";

function dashboardPath(role: UserRole) {
  return role === "admin" ? "/admin/dashboard" : "/warga/dashboard";
}

function getErrorMessage(error: unknown) {
  if (axios.isAxiosError<{ message?: string; errors?: Record<string, string[]> }>(error)) {
    const errors = error.response?.data?.errors;
    const firstError = errors ? Object.values(errors)[0]?.[0] : undefined;
    return firstError ?? error.response?.data?.message ?? "Login gagal.";
  }

  return "Login gagal.";
}

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { showToast } = useToast();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(event.currentTarget);

    try {
      const user = await login({
        email: String(formData.get("email") ?? ""),
        password: String(formData.get("password") ?? ""),
      });

      showToast({ type: "success", title: "Login berhasil." });
      router.replace(dashboardPath(user.role));
    } catch (submitError) {
      const message = getErrorMessage(submitError);
      setError(message);
      showToast({ type: "error", title: "Login gagal.", description: message });
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout
      title="Selamat Datang Kembali"
      description="Masuk untuk mengelola atau memantau aspirasi warga."
    >
      <form onSubmit={handleSubmit} className="mx-auto flex h-full max-w-lg flex-col justify-center">
        <p className="text-sm font-bold uppercase text-blue-700">Akses akun</p>
        <h2 className="mt-2 text-3xl font-bold text-slate-900">Masuk ke SILAPUB</h2>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          Gunakan email dan password untuk masuk sebagai warga atau admin kelurahan.
        </p>

        <div className="mt-8 space-y-4">
          <GlassInput
            label="Email"
            name="email"
            type="email"
            placeholder="nama@email.com"
            required
          />
          <GlassInput
            label="Password"
            name="password"
            type="password"
            placeholder="Password"
            required
          />
        </div>

        {error ? (
          <p className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 ring-1 ring-red-100">
            {error}
          </p>
        ) : null}

        <GlassButton type="submit" className="mt-6 w-full" disabled={loading}>
          {loading ? "Memproses..." : "Masuk"}
        </GlassButton>

        <p className="mt-5 text-center text-sm text-slate-600">
          Belum punya akun?{" "}
          <Link href="/register" className="font-bold text-blue-700">
            Daftar Warga
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
