import React from "react";

export default function ExplorePage() {
  const trendingTags = [
    { name: "#UASGenap2026", posts: "128 posts", color: "bg-sky" },
    { name: "#KondisiUnnes", posts: "84 posts", color: "bg-orange" },
    { name: "#PildesaUnnes", posts: "56 posts", color: "bg-mint" },
    { name: "#KlipKreatif", posts: "42 posts", color: "bg-cream" },
  ];

  const popularCommunities = [
    { name: "Teknik Informatika UNNES", members: "1.2k anggota", category: "Pendidikan" },
    { name: "Pecinta Alam Sekitar Kampus", members: "450 anggota", category: "Hobi" },
    { name: "UNNES English Society", members: "820 anggota", category: "Bahasa" },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Title */}
      <div className="space-y-2">
        <h1 className="text-4xl font-heading font-black text-neo-black tracking-tight uppercase">
          Jelajahi Kampus
        </h1>
        <p className="font-heading font-bold text-neo-black/80">
          Temukan topik diskusi paling trending dan gabung ke komunitas favorit Anda.
        </p>
      </div>

      {/* Search Input */}
      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg">🔍</span>
        <input
          type="text"
          placeholder="Cari postingan, komunitas, atau mahasiswa..."
          className="form-control pl-12 py-4 shadow-neo"
        />
      </div>

      {/* Grid widgets */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Trending Tags */}
        <section className="neo-card bg-white space-y-4">
          <h2 className="text-2xl font-heading font-black text-neo-black flex items-center gap-2">
            <span>🔥</span> Tren Saat Ini
          </h2>
          <div className="divide-y-2 divide-neo-black/10">
            {trendingTags.map((tag, i) => (
              <div key={i} className="py-4 first:pt-0 last:pb-0 flex items-center justify-between">
                <div>
                  <p className="font-heading font-extrabold text-blue hover:underline cursor-pointer">
                    {tag.name}
                  </p>
                  <p className="text-xs font-semibold text-neo-black/60">{tag.posts}</p>
                </div>
                <span className={`neo-badge ${tag.color} small`}>Trending</span>
              </div>
            ))}
          </div>
        </section>

        {/* Suggested Communities */}
        <section className="neo-card bg-white space-y-4">
          <h2 className="text-2xl font-heading font-black text-neo-black flex items-center gap-2">
            <span>👥</span> Rekomendasi Komunitas
          </h2>
          <div className="divide-y-2 divide-neo-black/10">
            {popularCommunities.map((com, i) => (
              <div key={i} className="py-4 first:pt-0 last:pb-0 flex items-center justify-between">
                <div>
                  <h3 className="font-heading font-extrabold text-sm text-neo-black">
                    {com.name}
                  </h3>
                  <p className="text-xs font-semibold text-neo-black/60">
                    {com.members} • {com.category}
                  </p>
                </div>
                <button className="neo-btn small sky">
                  Gabung
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
