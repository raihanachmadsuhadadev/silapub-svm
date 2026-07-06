"use client";

import Link from "next/link";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { GlassButton } from "@/components/ui/GlassButton";
import { GlassInput } from "@/components/ui/GlassInput";

export default function RegisterPage() {
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    console.log("Register warga dummy submitted");
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
          <GlassInput label="Nama Lengkap" name="name" placeholder="Nama lengkap" />
          <GlassInput label="NIK" name="nik" placeholder="Nomor induk kependudukan" />
          <GlassInput label="Nomor HP" name="phone" placeholder="08xxxxxxxxxx" />
          <GlassInput label="Email" name="email" type="email" placeholder="nama@email.com" />
          <GlassInput label="RT" name="rt" placeholder="001" />
          <GlassInput label="RW" name="rw" placeholder="003" />
          <GlassInput
            label="Alamat Lengkap"
            name="address"
            placeholder="Alamat tempat tinggal"
            textarea
            className="md:col-span-2"
          />
          <GlassInput label="Password" name="password" type="password" placeholder="Password" />
          <GlassInput
            label="Konfirmasi Password"
            name="password_confirmation"
            type="password"
            placeholder="Ulangi password"
          />
        </div>

        <div className="mt-6 flex flex-col-reverse gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-600">
            Sudah punya akun?{" "}
            <Link href="/login" className="font-bold text-blue-700">
              Masuk
            </Link>
          </p>
          <GlassButton type="submit" className="w-full sm:w-auto">
            Daftar Warga
          </GlassButton>
        </div>
      </form>
    </AuthLayout>
  );
}
