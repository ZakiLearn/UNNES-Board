import React from "react";

export default function MarketplacePage() {
  const items = [
    {
      id: 1,
      title: "Buku Kalkulus Edisi 8 - Dale Varberg",
      price: "Rp 75.000",
      condition: "Bekas (Sangat Baik)",
      badgeColor: "bg-sky",
      seller: "Rian Hidayat",
      location: "Fakultas MIPA",
      time: "3 jam yang lalu",
      image: "📚",
    },
    {
      id: 2,
      title: "iPad Air 4 64GB Wi-Fi Only",
      price: "Rp 5.200.000",
      condition: "Bekas (Mulus)",
      badgeColor: "bg-mint",
      seller: "Putri Amanda",
      location: "Fakultas Ekonomi",
      time: "Yesterday",
      image: "📱",
    },
    {
      id: 3,
      title: "Jasa Print & Jilid Skripsi / Laporan",
      price: "Rp 5.000",
      condition: "Baru / Jasa",
      badgeColor: "bg-cream",
      seller: "Koperasi Mahasiswa",
      location: "Gedung Student Center",
      time: "2 hari yang lalu",
      image: "🖨️",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <h1 className="text-4xl font-heading font-black text-neo-black tracking-tight uppercase">
            Pasar Kampus
          </h1>
          <p className="font-heading font-bold text-neo-black/80">
            Cari buku pelajaran bekas, kost-kostan, atau tawarkan keahlian Anda di sini.
          </p>
        </div>
        <button className="neo-btn flex items-center gap-2">
          <span>➕</span> Pasang Iklan Baru
        </button>
      </div>

      {/* Grid of Listings */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <div
            key={item.id}
            className="neo-card interactive bg-white flex flex-col justify-between"
          >
            <div>
              {/* Product preview */}
              <div className="flex h-44 items-center justify-center bg-cream border-2 border-neo-black rounded-md text-6xl shadow-neo-sm mb-4">
                {item.image}
              </div>

              <div className="space-y-3">
                <span className={`neo-badge ${item.badgeColor} small`}>
                  {item.condition}
                </span>
                <h3 className="font-heading font-black text-lg text-neo-black line-clamp-2 min-h-[56px]">
                  {item.title}
                </h3>
                <p className="text-2xl font-heading font-black text-neo-black bg-orange/20 border-2 border-neo-black inline-block px-3 py-1 rounded-sm shadow-neo-sm">
                  {item.price}
                </p>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t-2 border-neo-black/10 space-y-4">
              <div className="text-xs font-semibold text-neo-black/75 space-y-1">
                <p>👤 Penjual: <span className="font-heading font-black text-neo-black">{item.seller}</span></p>
                <p>📍 Lokasi: {item.location}</p>
                <p>🕒 Diiklankan: {item.time}</p>
              </div>

              <button className="w-full neo-btn sky">
                Hubungi Penjual
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
