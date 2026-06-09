import React from "react";

export default function FeedPage() {
  const posts = [
    {
      id: 1,
      author: "MabaSambatTI",
      target: "untuk Dosen Pengampu Algoritma",
      time: "15m yang lalu",
      category: "#AKADEMIK",
      content: "Pak, mohon maaf tugas praktikum minggu ini bisa diundur ga ya deadline-nya? Bentrok sama makul Matematika Diskrit nih pak 😭",
      likes: 12,
      dislikes: 3,
      hearts: 8,
      comments: 2,
    },
    {
      id: 2,
      author: "SecretAdmirer",
      target: "untuk Kak tingkat jaket kuning yang duduk di perpus lt 2 kemarin siang",
      time: "45m yang lalu",
      category: "#ASMARA",
      content: "Kamu manis banget pas lagi fokus baca buku. Semoga postingan ini lewat di fyp kamu ya! Salam dari maba FKIP.",
      likes: 2,
      dislikes: 0,
      hearts: 24,
      comments: 2,
    },
    {
      id: 3,
      author: "KenyongTerus",
      target: "untuk Semua mahasiswa kelaparan",
      time: "2j yang lalu",
      category: "#KANTIN",
      content: "Guys, rekomendasi kantin di deket FIP yang porsinya kuli tapi harganya ramah dompet dong! Dompet akhir bulan kritis banget nih.",
      likes: 8,
      dislikes: 15,
      hearts: 5,
      comments: 2,
    },
    {
      id: 4,
      author: "InfoUNNES",
      target: "untuk Seluruh Mahasiswa UNNES",
      time: "4j yang lalu",
      category: "#INFO",
      content: "Reminder! Pembayaran UKT semester ganjil ditutup tanggal 20 Juni. Jangan sampai kelewat nanti malah cuti otomatis, nyesek guys!",
      likes: 34,
      dislikes: 2,
      hearts: 18,
      comments: 2,
    },
  ];

  const categories = ["Semua", "#Akademik", "#Curhat", "#Info", "#Asmara", "#Kantin"];

  return (
    <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
      {/* Main Feed Column */}
      <div className="lg:col-span-2 space-y-6">
        {/* Composer Card */}
        <div className="neo-card bg-white p-5 flex flex-col sm:flex-row items-center gap-4 justify-between">
          <span className="font-heading font-black text-neo-black text-sm text-center sm:text-left">
            Punya uneg-uneg hari ini? 💬
          </span>
          <button className="neo-btn blue w-full sm:w-auto">
            Kirim Menfess
          </button>
        </div>

        {/* Filter Navigation */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="font-heading font-black text-2xl uppercase tracking-tight text-neo-black">
            Menfess Kampus
          </h2>
          <div className="flex flex-wrap gap-1.5">
            {categories.map((cat, i) => (
              <button
                key={i}
                className={`px-3 py-1 text-xs font-heading font-black border-2 border-neo-black rounded-md shadow-neo-sm transition-all duration-100 ${
                  i === 0
                    ? "bg-blue text-white translate-x-[1px] translate-y-[1px] shadow-none"
                    : "bg-white text-neo-black hover:bg-dark-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Menfess Posts */}
        <div className="space-y-4">
          {posts.map((post) => (
            <div key={post.id} className="neo-card bg-white space-y-4">
              {/* Header */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-sky border-2 border-neo-black rounded-full flex items-center justify-center font-heading font-black text-neo-black text-sm">
                    👤
                  </div>
                  <div>
                    <div className="flex items-wrap items-center gap-1.5 flex-row">
                      <span className="font-heading font-black text-sm text-blue">
                        {post.author}
                      </span>
                      <span className="text-[10px] font-bold text-neo-black/50">
                        {post.target}
                      </span>
                    </div>
                    <span className="text-[10px] font-bold text-neo-black/40">
                      {post.time}
                    </span>
                  </div>
                </div>
                <span className="neo-badge orange text-[10px] py-0.5 px-2">
                  {post.category}
                </span>
              </div>

              {/* Text */}
              <p className="font-heading font-bold text-sm text-neo-black/85 leading-relaxed">
                {post.content}
              </p>

              {/* Footer Actions */}
              <div className="flex items-center justify-between pt-2 border-t border-neo-black/10">
                <div className="flex gap-2">
                  <button className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-heading font-black border-2 border-neo-black rounded-md shadow-neo-sm bg-white hover:bg-dark-white active:translate-y-0.5">
                    👍 <span>{post.likes}</span>
                  </button>
                  <button className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-heading font-black border-2 border-neo-black rounded-md shadow-neo-sm bg-white hover:bg-dark-white active:translate-y-0.5">
                    👎 <span>{post.dislikes}</span>
                  </button>
                  <button className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-heading font-black border-2 border-neo-black rounded-md shadow-neo-sm bg-white hover:bg-dark-white active:translate-y-0.5">
                    ❤️ <span>{post.hearts}</span>
                  </button>
                </div>
                <button className="flex items-center gap-1 px-3 py-1 text-xs font-heading font-black border-2 border-neo-black rounded-md shadow-neo-sm bg-white hover:bg-dark-white">
                  💬 <span>{post.comments} Komentar</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Column - Widgets */}
      <div className="space-y-6">
        {/* Tes Ombak Poll Card */}
        <div className="neo-card bg-white space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-black text-lg text-neo-black flex items-center gap-1.5">
              <span>🌊</span> Tes Ombak
            </h3>
            <span className="neo-badge orange py-0.5 px-2 text-[10px]">
              AKTIF
            </span>
          </div>

          <p className="font-heading font-bold text-sm text-neo-black leading-relaxed">
            Enakan kuliah pagi (07:00) atau kuliah sore (15:00) sih sebenernya?
          </p>

          <div className="space-y-2.5">
            <button className="w-full text-left font-heading font-black text-xs border-2 border-neo-black rounded-md p-3 bg-white hover:bg-dark-white transition-all shadow-neo-sm">
              Kuliah Pagi (Otak masih fresh, siang bisa turu)
            </button>
            <button className="w-full text-left font-heading font-black text-xs border-2 border-neo-black rounded-md p-3 bg-white hover:bg-dark-white transition-all shadow-neo-sm">
              Kuliah Sore (Bisa bangun siang, no macet macet club)
            </button>
            <button className="w-full text-left font-heading font-black text-xs border-2 border-neo-black rounded-md p-3 bg-white hover:bg-dark-white transition-all shadow-neo-sm">
              Nggak kuliah sekalian (Kaum rebahan sejati)
            </button>
          </div>

          <p className="text-[10px] font-bold text-neo-black/50 text-center">
            Total Suara: 296 Responden
          </p>
        </div>
      </div>
    </div>
  );
}
