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
    <section style={{ marginTop: '40px' }}>
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <h2 style={{ fontSize: '2.4rem', textTransform: 'uppercase' }}>Sekilas Info UnnesBoard 📡</h2>
        <p style={{ color: 'rgba(26,26,26,0.7)', fontWeight: 600 }}>Apa saja yang sedang ramai dibicarakan hari ini?</p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1.8fr 1.2fr',
        gap: '32px',
      }} className="landing-mockup-grid">
        
        {/* Left Side: Mockup Feed */}
        <div>
          <h3 style={{ marginBottom: '16px', textTransform: 'uppercase', fontSize: '1.2rem' }}>💬 Cerita Mahasiswa</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {mockupPosts.map(post => (
              <div key={post.id} className="neo-card" style={{ marginBottom: '0' }}>
                <div className="menfess-header">
                  <div className="menfess-meta">
                    <div className="avatar-abstract" style={{ backgroundColor: 'var(--accent-sky)' }}>
                      {post.sender.charAt(0)}
                    </div>
                    <div>
                      <div className="menfess-sender">{post.sender} ➡️ {post.recipient}</div>
                      <div className="menfess-time">{post.time}</div>
                    </div>
                  </div>
                  <span className="neo-badge" style={{ backgroundColor: 'var(--bg-cream)' }}>#{post.tag}</span>
                </div>
                <p className="menfess-body" style={{ fontSize: '1rem', fontWeight: 600 }}>{post.content}</p>
                
                <div className="menfess-reactions" style={{ borderTop: 'var(--border-stroke)', paddingTop: '12px' }}>
                  <button className="reaction-btn" disabled>🔥 {post.reactions.fire}</button>
                  <button className="reaction-btn" disabled>😂 {post.reactions.laugh}</button>
                  <button className="reaction-btn" disabled>❤️ {post.reactions.heart}</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Mockup Widgets */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Polling Widget */}
          <div className="neo-card" style={{ marginBottom: '0' }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '12px' }}>🌊 Tes Ombak Harian</h3>
            <p style={{ fontWeight: 800, fontSize: '0.95rem', marginBottom: '16px' }}>
              Berapa kali kalian makan geprek dalam satu minggu?
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div className="poll-option" style={{ padding: '10px 14px', margin: '0' }}>
                <div className="poll-option-content" style={{ fontSize: '0.85rem' }}>
                  <span>Setiap hari (Geprek is life)</span>
                  <span style={{ color: 'var(--accent-blue)' }}>42%</span>
                </div>
              </div>
              <div className="poll-option" style={{ padding: '10px 14px', margin: '0' }}>
                <div className="poll-option-content" style={{ fontSize: '0.85rem' }}>
                  <span>2-3 kali seminggu</span>
                  <span style={{ color: 'var(--accent-blue)' }}>48%</span>
                </div>
              </div>
              <div className="poll-option" style={{ padding: '10px 14px', margin: '0' }}>
                <div className="poll-option-content" style={{ fontSize: '0.85rem' }}>
                  <span>Jarang / Tidak pernah</span>
                  <span style={{ color: 'var(--accent-blue)' }}>10%</span>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Box */}
          <div className="neo-card" style={{
            backgroundColor: 'var(--accent-mint)',
            marginBottom: '0',
            textAlign: 'center',
            padding: '24px',
            borderWidth: '3px'
          }}>
            <h3 style={{ textTransform: 'uppercase', marginBottom: '8px' }}>Ingin Ikut Berbagi Cerita?</h3>
            <p style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '16px' }}>
              Masuk dengan akun mahasiswa UNNES Anda sekarang juga untuk mulai mengirim menfess, membuat polling, dan berdiskusi.
            </p>
            <Link href="/register" className="neo-btn blue" style={{ width: '100%', justifyContent: 'center' }}>
              Daftar Akun Baru 🚀
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}
