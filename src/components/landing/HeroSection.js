'use client';
import Link from 'next/link';

export default function HeroSection() {
  return (
    <section className="hero-section" style={{ padding: '40px 0' }}>
      <div className="hero-text">
        <div className="neo-badge" style={{ backgroundColor: 'var(--accent-orange)', marginBottom: '12px' }}>
          #SocialFirst
        </div>
        <h1 style={{ fontSize: '3.2rem', marginBottom: '20px' }}>Tongkrongan Digital Mahasiswa UNNES</h1>
        <p style={{ fontSize: '1.2rem', color: 'rgba(26,26,26,0.8)', marginBottom: '28px', lineHeight: '1.6' }}>
          Platform anonim terpercaya untuk mahasiswa Universitas Negeri Semarang. Bebas curhat (menfess), jajak pendapat (polling), intip event kece, dan transaksi jual beli barang bekas di sekitar Sekaran. 100% anonim, 100% asyik.
        </p>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <Link href="/register" className="neo-btn blue" style={{ fontSize: '1.1rem', padding: '14px 28px' }}>
            <span>Gabung Sekarang 🚀</span>
          </Link>
          <Link href="/login" className="neo-btn sky" style={{ fontSize: '1.1rem', padding: '14px 28px' }}>
            <span>Masuk 🔑</span>
          </Link>
        </div>
      </div>
      <div className="hero-graphics">
        <div className="neo-card floating-sticky">
          <div className="menfess-header">
            <span className="neo-badge" style={{ backgroundColor: 'var(--bg-white)' }}>#Curhat</span>
            <span className="menfess-time">Just Now</span>
          </div>
          <p style={{ fontWeight: 700, fontSize: '0.95rem' }}>
            "Info loker magang buat anak semester 6 dong guys, butuh buat konversi SKS nih 😭"
          </p>
        </div>
        <div className="neo-card floating-sticky-alt">
          <div className="menfess-header">
            <span className="neo-badge" style={{ backgroundColor: 'var(--accent-orange)' }}>#Kantin</span>
            <span className="menfess-time">2m ago</span>
          </div>
          <p style={{ fontWeight: 700, fontSize: '0.95rem' }}>
            "Geprek Bu Rum tetep juara bertahan nomor 1 se-UNNES!"
          </p>
        </div>
      </div>
    </section>
  );
}
