'use client';

const mockNotifications = [
  { id: 1, type: 'like', text: 'KatingAlmetKuning menyukai menfess Anda tentang Kuliah Pagi.', time: '5 menit yang lalu', unread: true, icon: '❤️' },
  { id: 2, type: 'comment', text: 'AnonMaba membalas menfess Anda: "Wkwk bener banget kating!"', time: '1 jam yang lalu', unread: true, icon: '💬' },
  { id: 3, type: 'system', text: 'Pendaftaran Anda di Webinar Kepemimpinan Nasional berhasil didaftarkan.', time: '1 hari yang lalu', unread: false, icon: '📢' },
  { id: 4, type: 'marketplace', text: 'Seseorang tertarik dengan barang jualan Anda: Sepeda Gunung Phoenix.', time: '2 hari yang lalu', unread: false, icon: '🛍️' },
];

export default function NotificationsPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h2 style={{ fontSize: '2rem', textTransform: 'uppercase', marginBottom: '8px' }}>🔔 Notifikasi Anda</h2>
        <p style={{ color: 'rgba(26,26,26,0.7)', fontWeight: 600 }}>Update interaksi dan reaksi terbaru seputar aktivitas Anda.</p>
      </div>

      <div className="neo-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {mockNotifications.map(notif => (
          <div
            key={notif.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              padding: '14px',
              backgroundColor: notif.unread ? 'var(--bg-cream)' : 'var(--bg-dark-white)',
              border: 'var(--border-stroke)',
              borderRadius: 'var(--border-radius-sm)',
              boxShadow: notif.unread ? '3px 3px 0 0 var(--color-black)' : '1px 1px 0 0 rgba(0,0,0,0.1)'
            }}
          >
            <div style={{
              fontSize: '1.4rem',
              background: 'var(--bg-white)',
              border: 'var(--border-stroke)',
              borderRadius: '50%',
              width: '38px',
              height: '38px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>{notif.icon}</div>
            
            <div style={{ flexGrow: 1 }}>
              <p style={{ fontSize: '0.9rem', fontWeight: notif.unread ? 800 : 600, margin: 0 }}>
                {notif.text}
              </p>
              <span style={{ fontSize: '0.75rem', color: 'rgba(26,26,26,0.5)', fontWeight: 600 }}>
                {notif.time}
              </span>
            </div>

            {notif.unread && (
              <div style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: 'var(--accent-orange)',
                border: '1px solid var(--color-black)'
              }}></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
