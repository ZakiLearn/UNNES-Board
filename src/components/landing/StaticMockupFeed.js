'use client';
import Link from 'next/link';

export default function StaticMockupFeed() {
  const mockupPosts = [
    {
      id: 1,
      sender: "AnonKimia",
      recipient: "Semua Anggota Lab Kimia Dasar",
      content: "Siapa yang kemarin ninggalin jas lab basah di gantungan lemari belakang? Baunya asem banget tolong segera diambil sebelum didepak aslab 😭",
      tag: "Akademik",
      time: "15 menit yang lalu",
      reactions: { fire: 5, laugh: 12, heart: 2 }
    },
    {
      id: 2,
      sender: "PencintaKucingSekaran",
      recipient: "Pemberi Makan Kucing Kampus",
      content: "Kucing oren gemuk yang biasanya nongkrong di depan FIP tadi kelihatan lemas banget di bawah pos satpam. Ada yang punya wet food atau vitamin kah buat dikasih?",
      tag: "Sosial",
      time: "1 jam yang lalu",
      reactions: { fire: 1, laugh: 0, heart: 24 }
    }
  ];

  return (
    <section className="mt-10">
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl uppercase mb-2">Sekilas Info UnnesBoard 📡</h2>
        <p className="text-neo-black/70 font-semibold">Apa saja yang sedang ramai dibicarakan hari ini?</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1.8fr_1.2fr] gap-8">
        
        {/* Left Side: Mockup Feed */}
        <div>
          <h3 className="mb-4 uppercase text-lg">💬 Cerita Mahasiswa</h3>
          <div className="flex flex-col gap-4">
            {mockupPosts.map(post => (
              <div key={post.id} className="neo-card !mb-0">
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full border-2 border-neo-black flex items-center justify-center text-lg font-bold bg-sky">
                      {post.sender.charAt(0)}
                    </div>
                    <div>
                      <div className="font-extrabold text-sm">{post.sender} ➡️ {post.recipient}</div>
                      <div className="text-[10px] text-neo-black/50 font-semibold">{post.time}</div>
                    </div>
                  </div>
                  <span className="neo-badge !bg-cream">#{post.tag}</span>
                </div>
                <p className="text-base font-semibold mb-4 text-neo-black">{post.content}</p>
                
                <div className="flex gap-3 border-t-2 border-neo-black pt-3">
                  <button className="reaction-btn hover:translate-y-0 cursor-default" disabled>🔥 {post.reactions.fire}</button>
                  <button className="reaction-btn hover:translate-y-0 cursor-default" disabled>😂 {post.reactions.laugh}</button>
                  <button className="reaction-btn hover:translate-y-0 cursor-default" disabled>❤️ {post.reactions.heart}</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Mockup Widgets */}
        <div className="flex flex-col gap-6">
          {/* Polling Widget */}
          <div className="neo-card !mb-0">
            <h3 className="text-lg mb-3">🌊 Tes Ombak Harian</h3>
            <p className="font-extrabold text-sm mb-4">
              Berapa kali kalian makan geprek dalam satu minggu?
            </p>
            <div className="flex flex-col gap-2">
              <div className="bg-white border-2 border-neo-black rounded-md p-3 relative overflow-hidden transition-all duration-150">
                <div className="absolute top-0 left-0 bottom-0 w-[42%] bg-orange/35 z-0"></div>
                <div className="relative z-10 flex justify-between font-bold text-xs">
                  <span>Setiap hari (Geprek is life)</span>
                  <span className="text-blue">42%</span>
                </div>
              </div>
              <div className="bg-white border-2 border-neo-black rounded-md p-3 relative overflow-hidden transition-all duration-150">
                <div className="absolute top-0 left-0 bottom-0 w-[48%] bg-orange/35 z-0"></div>
                <div className="relative z-10 flex justify-between font-bold text-xs">
                  <span>2-3 kali seminggu</span>
                  <span className="text-blue">48%</span>
                </div>
              </div>
              <div className="bg-white border-2 border-neo-black rounded-md p-3 relative overflow-hidden transition-all duration-150">
                <div className="absolute top-0 left-0 bottom-0 w-[10%] bg-orange/35 z-0"></div>
                <div className="relative z-10 flex justify-between font-bold text-xs">
                  <span>Jarang / Tidak pernah</span>
                  <span className="text-blue">10%</span>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Box */}
          <div className="neo-card !mb-0 text-center p-6 !bg-mint border-4 border-neo-black">
            <h3 className="uppercase mb-2 text-lg">Ingin Ikut Berbagi Cerita?</h3>
            <p className="text-sm font-semibold mb-4 leading-relaxed text-neo-black/80">
              Masuk dengan akun mahasiswa UNNES Anda sekarang juga untuk mulai mengirim menfess, membuat polling, dan berdiskusi.
            </p>
            <Link href="/register" className="neo-btn blue w-full justify-center">
              Daftar Akun Baru 🚀
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}
