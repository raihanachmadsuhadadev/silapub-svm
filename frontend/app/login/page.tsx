"use client";

import Link from "next/link";
import { Building2, Users } from "lucide-react";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { GlassButton } from "@/components/ui/GlassButton";
import { GlassInput } from "@/components/ui/GlassInput";

export default function LoginPage() {
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    console.log("Login dummy submitted");
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
          <GlassInput label="Email" name="email" type="email" placeholder="nama@email.com" />
          <GlassInput label="Password" name="password" type="password" placeholder="Password" />
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            className="flex items-center gap-3 rounded-2xl bg-white/45 p-4 text-left text-sm font-semibold text-slate-700 ring-1 ring-white/70"
          >
            <Users size={19} className="text-blue-700" />
            Masuk sebagai Warga
          </button>
          <button
            type="button"
            className="flex items-center gap-3 rounded-2xl bg-white/45 p-4 text-left text-sm font-semibold text-slate-700 ring-1 ring-white/70"
          >
            <Building2 size={19} className="text-teal-700" />
            Masuk sebagai Admin
          </button>
        </div>

        <GlassButton type="submit" className="mt-6 w-full">
          Masuk
        </GlassButton>

        <p className="mt-5 text-center text-sm text-slate-600">
          Belum punya akun?{" "}
          <Link href="/register" className="font-bold text-blue-700">
            Daftar Warga
          </Link>
        </p>
        <p className="mt-4 rounded-2xl bg-white/38 p-3 text-xs leading-5 text-slate-500 ring-1 ring-white/60">
          Demo: admin@silapub.test / password atau warga@silapub.test / password
        </p>
      </form>
    </AuthLayout>
  );
}
