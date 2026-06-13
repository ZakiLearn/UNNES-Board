import React from "react";

export default function NotificationsPage() {
  const notifications = [
    {
      id: 1,
      type: "like",
      icon: "❤️",
      badgeColor: "bg-orange",
      text: "Ahmad Fauzi menyukai postingan Anda tentang Jadwal Kuliah.",
      time: "10 menit yang lalu",
      read: false,
    },
    {
      id: 2,
      type: "comment",
      icon: "💬",
      badgeColor: "bg-sky",
      text: "Siti Rahma mengomentari pertanyaan Anda di komunitas Pendidikan.",
      time: "2 jam yang lalu",
      read: false,
    },
    {
      id: 3,
      type: "announcement",
      icon: "📢",
      badgeColor: "bg-mint",
      text: "Admin Unnes Board membagikan panduan penggunaan fitur baru Marketplace.",
      time: "1 hari yang lalu",
      read: true,
    },
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Title */}
      <div className="space-y-2">
        <h1 className="text-4xl font-heading font-black text-neo-black tracking-tight uppercase">
          Kotak Masuk
        </h1>
        <p className="font-heading font-bold text-neo-black/80">
          Kelola pemberitahuan aktivitas postingan, obrolan, dan informasi penting kampus.
        </p>
      </div>

      <div className="neo-card bg-white p-0 overflow-hidden divide-y-2 divide-neo-black">
        {notifications.map((notif) => (
          <div
            key={notif.id}
            className={`flex items-start gap-4 p-5 transition-colors duration-150 ${
              !notif.read ? "bg-cream/20" : "hover:bg-dark-white"
            }`}
          >
            <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-sm border-2 border-neo-black shadow-neo-sm text-xl ${notif.badgeColor}`}>
              {notif.icon}
            </span>
            <div className="flex-1 min-w-0">
              <p className={`text-sm ${!notif.read ? "text-neo-black font-extrabold" : "text-neo-black/85 font-semibold"}`}>
                {notif.text}
              </p>
              <span className="text-xs font-bold text-neo-black/50 block mt-1">{notif.time}</span>
            </div>
            {!notif.read && (
              <span className="h-4.5 w-4.5 rounded-full bg-orange border-2 border-neo-black mt-2 shrink-0 shadow-neo-sm" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
