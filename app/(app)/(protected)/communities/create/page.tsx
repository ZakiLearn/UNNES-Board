import React from "react";

export default function CreateCommunityPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Title */}
      <div className="space-y-2">
        <h1 className="text-4xl font-heading font-black text-neo-black tracking-tight uppercase">
          Buat Komunitas
        </h1>
        <p className="font-heading font-bold text-neo-black/80">
          Bangun ruang diskusi atau klub mahasiswa Anda sendiri di UNNES Board.
        </p>
      </div>

      {/* Form Card */}
      <div className="neo-card bg-white">
        <form className="space-y-6">
          {/* Community Name */}
          <div className="form-group">
            <label className="form-label">Nama Komunitas</label>
            <input
              type="text"
              placeholder="Contoh: Himpunan Mahasiswa Informatika"
              className="form-control"
            />
          </div>

          {/* Category */}
          <div className="form-group">
            <label className="form-label">Kategori Komunitas</label>
            <select className="form-control">
              <option value="akademik">Akademik & Riset</option>
              <option value="olahraga">Kesehatan & Olahraga</option>
              <option value="seni">Seni & Kebudayaan</option>
              <option value="teknologi">Teknologi & Coding</option>
              <option value="sosial">Gerakan Sosial & Kemanusiaan</option>
            </select>
          </div>

          {/* Description */}
          <div className="form-group">
            <label className="form-label">Deskripsi Singkat</label>
            <textarea
              placeholder="Ceritakan secara singkat mengenai klub atau forum diskusi Anda..."
              rows={4}
              className="form-control"
            />
          </div>

          {/* Privacy Toggle */}
          <div className="flex items-center justify-between p-4 rounded-md border-2 border-neo-black bg-cream/35">
            <div>
              <h4 className="font-heading font-extrabold text-sm text-neo-black">Komunitas Privat</h4>
              <p className="text-xs font-semibold text-neo-black/60">
                Anggota baru membutuhkan persetujuan Anda sebelum bisa bergabung.
              </p>
            </div>
            <input
              type="checkbox"
              className="h-6 w-6 rounded-sm border-2 border-neo-black text-orange focus:ring-0"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t-2 border-neo-black/10">
            <button type="button" className="neo-btn sky small">
              Batal
            </button>
            <button type="submit" className="neo-btn">
              Buat Komunitas
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
