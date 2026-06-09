import Link from "next/link";
import React from "react";

export default function LoginPage() {
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

      {/* Form */}
      <form className="space-y-4">
        <div className="form-group">
          <label className="form-label">Email Kampus / NIM</label>
          <input
            type="text"
            placeholder="nim@students.unnes.ac.id"
            className="form-control"
          />
        </div>

        <div className="form-group">
          <div className="flex items-center justify-between mb-2">
            <label className="form-label mb-0">Kata Sandi</label>
            <a href="#" className="text-xs font-heading font-black text-blue hover:underline">
              Lupa sandi?
            </a>
          </div>
          <input
            type="password"
            placeholder="••••••••"
            className="form-control"
          />
        </div>

        <button
          type="submit"
          className="w-full neo-btn"
        >
          Masuk ke Akun
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
