import Link from "next/link";
import React from "react";

export default function RegisterPage() {
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

      {/* Form */}
      <form className="space-y-4">
        <div className="form-group">
          <label className="form-label">Nama Lengkap</label>
          <input
            type="text"
            placeholder="Masukkan nama lengkap Anda"
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label className="form-label">NIM (Nomor Induk Mahasiswa)</label>
          <input
            type="text"
            placeholder="Contoh: 240001890"
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Email Mahasiswa</label>
          <input
            type="email"
            placeholder="username@students.unnes.ac.id"
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Kata Sandi</label>
          <input
            type="password"
            placeholder="Buat sandi minimal 8 karakter"
            className="form-control"
          />
        </div>

        <button
          type="submit"
          className="w-full neo-btn"
        >
          Buat Akun Sekarang
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
