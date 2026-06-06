'use client';
import Link from 'next/link';

export default function HeroSection() {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center py-10">
      <div className="flex flex-col items-start text-left">
        <div className="neo-badge !bg-orange !mb-3">
          #SocialFirst
        </div>
        <h1 className="text-4xl md:text-5xl lg:text-[3.2rem] leading-none mb-5 uppercase">
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
            "Info loker magang buat anak semester 6 dong guys, butuh buat konversi SKS nih 😭"
          </p>
        </div>
        {/* Floating Card 2 */}
        <div className="neo-card w-[180px] md:w-[200px] absolute rotate-[8deg] translate-x-[40px] md:translate-x-[80px] translate-y-[20px] md:translate-y-[40px] z-0 shadow-neo hover:rotate-0 hover:scale-105 transition-all duration-150 ease-[cubic-bezier(0.16,1,0.3,1)] !bg-sky !mb-0 !p-5 select-none">
          <div className="flex justify-between items-center mb-3">
            <span className="neo-badge !bg-orange">#Kantin</span>
            <span className="text-[10px] text-neo-black/60 font-semibold">2m ago</span>
          </div>
          <p className="font-extrabold text-[13px] md:text-sm text-neo-black leading-snug">
            "Geprek Bu Rum tetep juara bertahan nomor 1 se-UNNES!"
          </p>
        </div>
      </div>
    </section>
  );
}
