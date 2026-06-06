'use client';

const mockNotifications = [
  { id: 1, type: 'like', text: 'KatingAlmetKuning menyukai menfess Anda tentang Kuliah Pagi.', time: '5 menit yang lalu', unread: true, icon: '❤️' },
  { id: 2, type: 'comment', text: 'AnonMaba membalas menfess Anda: "Wkwk bener banget kating!"', time: '1 jam yang lalu', unread: true, icon: '💬' },
  { id: 3, type: 'system', text: 'Pendaftaran Anda di Webinar Kepemimpinan Nasional berhasil didaftarkan.', time: '1 hari yang lalu', unread: false, icon: '📢' },
  { id: 4, type: 'marketplace', text: 'Seseorang tertarik dengan barang jualan Anda: Sepeda Gunung Phoenix.', time: '2 hari yang lalu', unread: false, icon: '🛍️' },
];

export default function NotificationsPage() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-4 md:gap-5">
      {/* Left Column */}
      <div className="flex flex-col gap-4">
        <div>
          <h2 className="text-xl md:text-2xl uppercase mb-1">🔔 Notifikasi Anda</h2>
          <p className="text-neo-black/70 font-semibold text-xs md:text-sm">Update interaksi dan reaksi terbaru seputar aktivitas Anda.</p>
        </div>

        <div className="neo-card flex flex-col gap-2.5 !p-4 !mb-0 bg-white">
          {mockNotifications.map(notif => (
            <div
              key={notif.id}
              className={`flex items-center gap-3 p-3 border-2 border-neo-black rounded-sm transition-all duration-150 ${
                notif.unread 
                  ? 'bg-cream shadow-[2px_2px_0_0_#1A1A1A] translate-x-[1px] translate-y-[1px]' 
                  : 'bg-dark-white shadow-[1px_1px_0_0_rgba(0,0,0,0.1)]'
              }`}
            >
              <div className="text-xl bg-white border-2 border-neo-black rounded-full w-9 h-9 flex items-center justify-center flex-shrink-0">
                {notif.icon}
              </div>
              
              <div className="flex-grow">
                <p className={`text-xs m-0 leading-tight ${notif.unread ? 'font-black' : 'font-semibold'}`}>
                  {notif.text}
                </p>
                <span className="text-[9px] text-neo-black/50 font-semibold">
                  {notif.time}
                </span>
              </div>

              {notif.unread && (
                <div className="w-2 h-2 rounded-full bg-orange border border-neo-black flex-shrink-0"></div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Right Column */}
      <div className="hidden lg:flex flex-col gap-4">
        {/* Settings Widget */}
        <div className="neo-card !p-4 !mb-0">
          <h3 className="text-sm mb-3">⚙️ Pengaturan</h3>
          <div className="space-y-2 text-xs font-semibold text-neo-black/80">
            <div className="flex justify-between items-center py-1 border-b border-neo-black/10">
              <span>Email Notifikasi</span>
              <span className="text-blue cursor-pointer">Aktif</span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-neo-black/10">
              <span>Suara Notifikasi</span>
              <span className="text-blue cursor-pointer">Aktif</span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span>Menfess Baru</span>
              <span className="text-blue cursor-pointer">Aktif</span>
            </div>
          </div>
        </div>

        {/* Tip Widget */}
        <div className="neo-card !p-4 !mb-0 bg-mint">
          <h3 className="text-xs mb-2">💡 Tips Keamanan</h3>
          <p className="text-[10px] font-semibold text-neo-black/80 leading-relaxed m-0">
            Jangan pernah membagikan NIM atau kata sandi akun UnnesBoard Anda kepada siapa pun demi menjaga kerahasiaan identitas anonim Anda.
          </p>
        </div>
      </div>
    </div>
  );
}
