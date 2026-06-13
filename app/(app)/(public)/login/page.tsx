'use client';

import Link from "next/link";
import React, { useActionState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { login } from "@/app/(app)/auth/actions";

function LoginForm() {
  const [state, formAction, isPending] = useActionState(login, null);
  const searchParams = useSearchParams();
  const message = searchParams.get("message");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2 text-center">
        <h1 className="text-4xl font-heading font-black text-neo-black uppercase tracking-tight">
          Masuk
        </h1>
        <p className="text-sm font-heading font-bold text-neo-black/60">
          Selamat datang kembali di UNNES Board!
        </p>
      </div>

      {message && (
        <div className="p-3 border-2 border-neo-black bg-mint rounded-md text-xs font-bold text-neo-black">
          {message}
        </div>
      )}

      {state?.error && (
        <div className="p-3 border-2 border-neo-black bg-orange rounded-md text-xs font-bold text-neo-black">
          {state.error}
        </div>
      )}

      {/* Form */}
      <form action={formAction} className="space-y-4">
        <div className="form-group">
          <label className="form-label" htmlFor="email">Email Kampus</label>
          <input
            id="email"
            name="email"
            type="email"
            required
            placeholder="nim@students.unnes.ac.id"
            className="form-control"
          />
        </div>

        <div className="form-group">
          <div className="flex items-center justify-between mb-2">
            <label className="form-label mb-0" htmlFor="password">Kata Sandi</label>
            <a href="#" className="text-xs font-heading font-black text-blue hover:underline">
              Lupa sandi?
            </a>
          </div>
          <input
            id="password"
            name="password"
            type="password"
            required
            placeholder="••••••••"
            className="form-control"
          />
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full neo-btn disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isPending ? "Memuat..." : "Masuk ke Akun"}
        </button>
      </form>

      {/* Divider */}
      <div className="relative flex py-2 items-center">
        <div className="flex-grow border-t-2 border-neo-black/10"></div>
        <span className="flex-shrink mx-4 text-xs font-heading font-black uppercase text-neo-black/60">Atau masuk dengan</span>
        <div className="flex-grow border-t-2 border-neo-black/10"></div>
      </div>

      {/* SSO Buttons */}
      <button className="w-full neo-btn sky flex items-center justify-center gap-2">
        🏫 SSO UNNES Mail
      </button>

      {/* Footer */}
      <p className="text-center text-xs font-heading font-bold text-neo-black/60">
        Belum punya akun?{" "}
        <Link href="/register" className="font-heading font-black text-blue hover:underline">
          Daftar sekarang
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="space-y-6 text-center py-12">
        <div className="text-sm font-heading font-bold text-neo-black/60 animate-pulse">
          Memuat halaman masuk...
        </div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}

