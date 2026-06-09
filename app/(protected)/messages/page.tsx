import React from "react";

export default function MessagesPage() {
  const threads = [
    {
      id: 1,
      name: "Rian Hidayat",
      avatar: "RH",
      lastMsg: "Kalkulusnya masih ada kak? Bisa COD di Sekaran?",
      time: "14:20",
      unread: true,
      online: true,
    },
    {
      id: 2,
      name: "Grup PKM-K 2026",
      avatar: "PKM",
      lastMsg: "Budi Santoso: Laporannya sudah saya upload ke drive ya...",
      time: "Kemarin",
      unread: false,
      online: false,
    },
    {
      id: 3,
      name: "Siti Rahma",
      avatar: "SR",
      lastMsg: "Jangan lupa nanti malam ada rapat koordinasi.",
      time: "2 hari lalu",
      unread: false,
      online: true,
    },
  ];

  return (
    <div className="max-w-6xl mx-auto h-[calc(100vh-12rem)] flex rounded-lg border-2 border-neo-black bg-white overflow-hidden shadow-neo">
      {/* Sidebar - Threads List */}
      <div className="w-full md:w-80 border-r-2 border-neo-black flex flex-col bg-white">
        <div className="p-4 border-b-2 border-neo-black bg-cream/35">
          <h1 className="text-xl font-heading font-black text-neo-black uppercase tracking-tight">Obrolan</h1>
        </div>
        <div className="flex-1 overflow-y-auto divide-y-2 divide-neo-black/10">
          {threads.map((thread) => (
            <div
              key={thread.id}
              className={`flex items-center gap-3 p-4 cursor-pointer hover:bg-dark-white transition-colors ${
                thread.unread ? "bg-sky/15" : ""
              }`}
            >
              <div className="relative shrink-0">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-cream border-2 border-neo-black shadow-neo-sm font-heading font-black text-neo-black">
                  {thread.avatar}
                </div>
                {thread.online && (
                  <span className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full bg-mint border-2 border-neo-black" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className={`text-sm font-heading font-black truncate ${thread.unread ? "text-blue" : "text-neo-black"}`}>
                    {thread.name}
                  </h3>
                  <span className="text-xxs font-bold text-neo-black/50">{thread.time}</span>
                </div>
                <p className={`text-xs truncate ${thread.unread ? "text-neo-black font-extrabold" : "text-neo-black/60"}`}>
                  {thread.lastMsg}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Conversation Window */}
      <div className="hidden md:flex flex-1 flex-col bg-cream/15">
        {/* Active Header */}
        <div className="flex h-16 items-center px-6 border-b-2 border-neo-black bg-white">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange border-2 border-neo-black shadow-neo-sm font-heading font-black text-neo-black">
              RH
            </div>
            <div>
              <h3 className="font-heading font-black text-sm text-neo-black">Rian Hidayat</h3>
              <p className="text-xs font-bold text-mint-600">Aktif Sekarang</p>
            </div>
          </div>
        </div>

        {/* Message Bubble Area */}
        <div className="flex-1 p-6 space-y-4 overflow-y-auto bg-dark-white/50">
          {/* Incoming message */}
          <div className="flex items-start gap-2.5 max-w-[75%]">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-cream border-2 border-neo-black text-xs font-heading font-black shrink-0">
              RH
            </div>
            <div className="rounded-md border-2 border-neo-black bg-white p-4 text-sm font-semibold text-neo-black shadow-neo-sm">
              Halo kak, Kalkulusnya masih ada kah? Bisa COD siang ini di depan LP2M?
            </div>
          </div>

          {/* Outgoing message */}
          <div className="flex items-start gap-2.5 max-w-[75%] ml-auto justify-end">
            <div className="rounded-md border-2 border-neo-black bg-sky p-4 text-sm font-semibold text-neo-black shadow-neo-sm">
              Halo! Masih ada kok. Boleh, jam 1 siang nanti ya di depan LP2M.
            </div>
          </div>
        </div>

        {/* Action input panel */}
        <div className="p-4 bg-white border-t-2 border-neo-black">
          <form className="flex gap-3">
            <input
              type="text"
              placeholder="Tulis pesan Anda disini..."
              className="form-control"
            />
            <button className="neo-btn">
              Kirim
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
