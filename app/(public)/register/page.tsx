'use client';

import Link from "next/link";
import React, { useActionState } from "react";
import { signUp } from "@/app/auth/actions";

export default function RegisterPage() {
  const [state, formAction, isPending] = useActionState(signUp, null);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2 text-center">
        <h1 className="text-4xl font-heading font-black text-neo-black uppercase tracking-tight">
          Daftar Akun
        </h1>
        <p className="text-sm font-heading font-bold text-neo-black/60">
          Buat akun untuk berinteraksi di UNNES Board.
        </p>
      </div>

      {state?.error && (
        <div className="p-3 border-2 border-neo-black bg-orange rounded-md text-xs font-bold text-neo-black">
          {state.error}
        </div>
      )}

      {/* Form */}
      <form action={formAction} className="space-y-4">
        <div className="form-group">
          <label className="form-label" htmlFor="name">Nama Lengkap</label>
          <input
            id="name"
            name="name"
            type="text"
            required
            placeholder="Masukkan nama lengkap Anda"
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="nim">NIM (Nomor Induk Mahasiswa)</label>
          <input
            id="nim"
            name="nim"
            type="text"
            required
            placeholder="Contoh: 240001890"
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="email">Email Mahasiswa</label>
          <input
            id="email"
            name="email"
            type="email"
            required
            placeholder="username@students.unnes.ac.id"
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="password">Kata Sandi</label>
          <input
            id="password"
            name="password"
            type="password"
            required
            placeholder="Buat sandi minimal 8 karakter"
            className="form-control"
          />
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full neo-btn disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isPending ? "Mendaftarkan..." : "Buat Akun Sekarang"}
        </button>
      </form>

      {/* Footer */}
      <p className="text-center text-xs font-heading font-bold text-neo-black/60">
        Sudah memiliki akun?{" "}
        <Link href="/login" className="font-heading font-black text-blue hover:underline">
          Masuk di sini
        </Link>
      </p>
    </div>
  );
}

