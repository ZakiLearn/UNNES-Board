import React from "react";

export default function ProfilePage() {
  const userStats = [
    { label: "Postingan", value: "12", color: "bg-orange" },
    { label: "Komunitas", value: "5", color: "bg-sky" },
    { label: "Koin Reputasi", value: "148", color: "bg-mint" },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Banner & Avatar Container */}
      <div className="neo-card bg-white p-0 overflow-hidden">
        {/* Banner Cover */}
        <div className="h-40 bg-gradient-to-r from-orange to-sky border-b-2 border-neo-black" />
        
        {/* User Card info */}
        <div className="p-6 relative flex flex-col sm:flex-row items-center sm:items-end justify-between gap-4 -mt-14 sm:-mt-18">
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 text-center sm:text-left">
            <div className="h-28 w-28 rounded-full border-4 border-neo-black bg-cream flex items-center justify-center text-5xl font-heading font-black shadow-neo-sm shrink-0">
              U
            </div>
            <div className="space-y-1 pb-1">
              <h2 className="text-3xl font-heading font-black text-neo-black">
                User Unnes Board
              </h2>
              <p className="text-sm font-heading font-extrabold text-neo-black/60">
                Mahasiswa Teknik Informatika • NIM. 240001890
              </p>
            </div>
          </div>
          <button className="neo-btn">
            Edit Profil
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 border-t-2 border-neo-black divide-x-2 divide-neo-black text-center bg-cream/25">
          {userStats.map((stat, i) => (
            <div key={i} className="py-5">
              <span className={`inline-block text-xl font-heading font-black text-neo-black border-2 border-neo-black px-4 py-1.5 rounded-sm shadow-neo-sm ${stat.color} mb-1`}>
                {stat.value}
              </span>
              <p className="text-xs font-heading font-extrabold text-neo-black/60 mt-2">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Main Info Blocks */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Bio Block */}
        <div className="md:col-span-1 neo-card bg-white space-y-4">
          <h3 className="text-xl font-heading font-black text-neo-black uppercase">Tentang Saya</h3>
          <p className="text-sm font-semibold text-neo-black/85 leading-relaxed">
            Mahasiswa semester 4 yang menyukai pemrograman web, UI/UX design, dan gemar berkolaborasi dalam proyek PKM.
          </p>
        </div>

        {/* Post History Sandbox */}
        <div className="md:col-span-2 neo-card bg-white space-y-4">
          <h3 className="text-xl font-heading font-black text-neo-black uppercase">Postingan Terakhir</h3>
          <div className="space-y-4">
            <div className="p-5 rounded-md border-2 border-neo-black bg-cream/15 hover:bg-cream/30 cursor-pointer transition-colors space-y-2">
              <h4 className="font-heading font-black text-base text-neo-black">
                Cara Belajar Next.js App Router dengan Cepat
              </h4>
              <p className="text-xs font-heading font-extrabold text-neo-black/50">
                Ditulis 3 hari yang lalu • 12 suka • 2 komentar
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
