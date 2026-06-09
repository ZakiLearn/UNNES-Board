import Link from "next/link";
import React from "react";

export default function Home() {
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
    <div className="flex flex-col min-h-screen bg-cream text-neo-black justify-between">
      {/* Header Navbar */}
      <header className="px-6 h-16 flex items-center justify-between border-b-2 border-neo-black bg-white">
        <div className="flex items-center gap-2 font-heading font-black text-xl tracking-tight text-neo-black">
          <span className="bg-orange p-1.5 rounded-sm border-2 border-neo-black shadow-neo-sm">🏠</span>
          <span>UnnesBoard.</span>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/login"
            className="px-4 py-1.5 text-xs font-heading font-black border-2 border-neo-black bg-sky rounded-md shadow-neo-sm hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_#1A1A1A] transition-all"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="px-4 py-1.5 text-xs font-heading font-black border-2 border-neo-black bg-blue text-white rounded-md shadow-neo-sm hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_#1A1A1A] transition-all"
          >
            Daftar
          </Link>
        </div>
      </header>

      {/* Hero Body */}
      <main className="max-w-6xl mx-auto px-6 py-12 space-y-16">
        {/* Top Hero Section */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center py-10">
          <div className="flex flex-col items-start text-left">
            <div className="neo-badge !bg-orange !mb-3">
              #SocialFirst
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-[3.2rem] leading-none mb-5 uppercase font-heading font-black">
              Tongkrongan Digital Mahasiswa UNNES
            </h1>
            <p className="text-lg text-neo-black/80 mb-7 leading-relaxed font-semibold">
              Platform anonim terpercaya untuk mahasiswa Universitas Negeri Semarang. Bebas curhat (menfess), jajak pendapat (polling), intip event kece, dan transaksi jual beli barang bekas di sekitar Sekaran. 100% anonim, 100% asyik.
            </p>
            <div className="flex gap-4 flex-wrap">
              <Link href="/register" className="neo-btn blue !text-lg !px-7 !py-3.5">
                <span>Gabung Sekarang 🚀</span>
              </Link>
              <Link href="/login" className="neo-btn sky !text-lg !px-7 !py-3.5">
                <span>Masuk 🔑</span>
              </Link>
            </div>
          </div>
          <div className="relative h-[240px] md:h-[300px] flex justify-center items-center mt-6 lg:mt-0">
            {/* Floating Card 1 */}
            <div className="neo-card w-[200px] md:w-[220px] absolute -rotate-6 z-10 shadow-neo hover:rotate-0 hover:scale-105 transition-all duration-150 ease-[cubic-bezier(0.16,1,0.3,1)] !bg-orange !mb-0 !p-5 select-none">
              <div className="flex justify-between items-center mb-3">
                <span className="neo-badge !bg-white">#Curhat</span>
                <span className="text-[10px] text-neo-black/60 font-semibold">Just Now</span>
              </div>
              <p className="font-extrabold text-[13px] md:text-sm text-neo-black leading-snug">
                {"\"Info loker magang buat anak semester 6 dong guys, butuh buat konversi SKS nih 😭\""}
              </p>
            </div>
            {/* Floating Card 2 */}
            <div className="neo-card w-[180px] md:w-[200px] absolute rotate-[8deg] translate-x-[40px] md:translate-x-[80px] translate-y-[20px] md:translate-y-[40px] z-0 shadow-neo hover:rotate-0 hover:scale-105 transition-all duration-150 ease-[cubic-bezier(0.16,1,0.3,1)] !bg-sky !mb-0 !p-5 select-none">
              <div className="flex justify-between items-center mb-3">
                <span className="neo-badge !bg-orange">#Kantin</span>
                <span className="text-[10px] text-neo-black/60 font-semibold">2m ago</span>
              </div>
              <p className="font-extrabold text-[13px] md:text-sm text-neo-black leading-snug">
                {"\"Geprek Bu Rum tetep juara bertahan nomor 1 se-UNNES!\""}
              </p>
            </div>
          </div>
        </section>

        {/* Sekilas Info Segment */}
        <section className="mt-10 border-t-2 border-neo-black pt-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl uppercase mb-2 font-heading font-black">Sekilas Info UnnesBoard 📡</h2>
            <p className="text-neo-black/70 font-semibold">Apa saja yang sedang ramai dibicarakan hari ini?</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[1.8fr_1.2fr] gap-8 text-left">
            
            {/* Left Side: Mockup Feed */}
            <div>
              <h3 className="mb-4 uppercase text-lg font-heading font-black">💬 Cerita Mahasiswa</h3>
              <div className="flex flex-col gap-4">
                {mockupPosts.map(post => (
                  <div key={post.id} className="neo-card !mb-0">
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full border-2 border-neo-black flex items-center justify-center text-lg font-bold bg-sky shrink-0">
                          {post.sender.charAt(0)}
                        </div>
                        <div>
                          <div className="font-extrabold text-sm text-neo-black">{post.sender} ➡️ {post.recipient}</div>
                          <div className="text-[10px] text-neo-black/50 font-semibold">{post.time}</div>
                        </div>
                      </div>
                      <span className="neo-badge !bg-cream">#{post.tag}</span>
                    </div>
                    <p className="text-base font-semibold mb-4 text-neo-black">{post.content}</p>
                    
                    <div className="flex gap-3 border-t-2 border-neo-black pt-3">
                      <button className="px-2.5 py-1 text-xs font-bold border-2 border-neo-black rounded-md shadow-neo-sm bg-white hover:translate-y-0 cursor-default" disabled>🔥 {post.reactions.fire}</button>
                      <button className="px-2.5 py-1 text-xs font-bold border-2 border-neo-black rounded-md shadow-neo-sm bg-white hover:translate-y-0 cursor-default" disabled>😂 {post.reactions.laugh}</button>
                      <button className="px-2.5 py-1 text-xs font-bold border-2 border-neo-black rounded-md shadow-neo-sm bg-white hover:translate-y-0 cursor-default" disabled>❤️ {post.reactions.heart}</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Side: Mockup Widgets */}
            <div className="flex flex-col gap-6">
              {/* Polling Widget */}
              <div className="neo-card !mb-0">
                <h3 className="text-lg mb-3 font-heading font-black">🌊 Tes Ombak Harian</h3>
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
              <div className="neo-card !mb-0 text-center p-6 !bg-mint border-4 border-neo-black shadow-neo">
                <h3 className="uppercase mb-2 text-lg font-heading font-black">Ingin Ikut Berbagi Cerita?</h3>
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
      </main>

      {/* Footer */}
      <footer className="py-6 text-center border-t-2 border-neo-black bg-white text-xs font-heading font-black text-neo-black">
        © 2026 UNNES Board. Semua hak cipta dilindungi.
      </footer>
    </div>
  );
}
