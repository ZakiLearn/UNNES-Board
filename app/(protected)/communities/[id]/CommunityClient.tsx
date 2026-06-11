'use client';

import React, { useState, useEffect, useRef, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Hash, 
  Lock, 
  Plus, 
  Send, 
  ArrowLeft, 
  Calendar, 
  Newspaper, 
  Shield, 
  User, 
  UserCheck, 
  Volume2,
  Loader2
} from "lucide-react";
import { sendMessage, delegateModerator } from "./actions";

interface MessageItem {
  id: number;
  content: string;
  roomName: string;
  createdAt: string;
  profileId: string;
  aliasName: string;
  isMe: boolean;
}

interface MemberItem {
  profileId: string;
  aliasName: string;
  role: string;
}

interface CommunityClientProps {
  community: { id: number; name: string; description: string };
  activeProfile: {
    id: string;
    role: string;      // ADMIN, MODERATOR, USER
    aliasName: string | null;
    fullName: string;
    membershipRole: string; // MODERATOR, MEMBER
  };
  initialMessages: MessageItem[];
  members: MemberItem[];
}

export default function CommunityClient({
  community,
  activeProfile,
  initialMessages,
  members
}: CommunityClientProps) {
  const router = useRouter();
  const [messages, setMessages] = useState<MessageItem[]>(initialMessages);
  const [rooms, setRooms] = useState<Array<{ name: string; type: "public" | "announcement" }>>([
    { name: "pengumuman", type: "announcement" },
    { name: "chat-kasual", type: "public" }
  ]);
  const [activeRoom, setActiveRoom] = useState("chat-kasual");
  
  // Custom Room Modal state
  const [isAddRoomOpen, setIsAddRoomOpen] = useState(false);
  const [newRoomName, setNewRoomName] = useState("");
  
  // Delegate Moderator Modal state
  const [isDelegateOpen, setIsDelegateOpen] = useState(false);
  const [delegateTargetId, setDelegateTargetId] = useState("");
  const [delegateError, setDelegateError] = useState("");

  // Input chat state
  const [chatInput, setChatInput] = useState("");
  const [isPending, startTransition] = useTransition();

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Sync initial messages from props when server revalidates
  useEffect(() => {
    setMessages(initialMessages);
  }, [initialMessages]);

  // Scroll to bottom of chat area when messages or active room changes
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, activeRoom]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const content = chatInput.trim();
    setChatInput("");

    // Optimistic update
    const tempMessage: MessageItem = {
      id: Date.now(),
      content,
      roomName: activeRoom,
      createdAt: new Date().toISOString(),
      profileId: activeProfile.id,
      aliasName: activeProfile.fullName, // Show full name for active user
      isMe: true
    };

    setMessages(prev => [...prev, tempMessage]);

    startTransition(async () => {
      const res = await sendMessage(community.id, activeRoom, content);
      if (res.success) {
        router.refresh();
      } else {
        alert(res.error || "Gagal mengirim pesan");
        // Remove optimistic message on failure
        setMessages(prev => prev.filter(m => m.id !== tempMessage.id));
      }
    });
  };

  const handleAddRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoomName.trim()) return;

    // Clean name to kebab case/lowercase hash friendly
    const cleanedName = newRoomName
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");

    if (!cleanedName) return;

    // Add room to local state (statis client-side state)
    setRooms(prev => [...prev, { name: cleanedName, type: "public" }]);
    setIsAddRoomOpen(false);
    setNewRoomName("");
    setActiveRoom(cleanedName);
  };

  const handleDelegateModerator = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!delegateTargetId) return;
    setDelegateError("");

    startTransition(async () => {
      const res = await delegateModerator(community.id, delegateTargetId);
      if (res.success) {
        setIsDelegateOpen(false);
        setDelegateTargetId("");
        router.refresh();
      } else {
        setDelegateError(res.error || "Gagal mendelegasikan jabatan moderator.");
      }
    });
  };

  const isModerator = activeProfile.membershipRole === "MODERATOR";
  const isAdmin = activeProfile.role === "ADMIN";
  const canManageCommunity = isModerator || isAdmin;

  // Filter messages for current active room
  const filteredMessages = messages.filter(m => m.roomName === activeRoom);

  // Check if writing is restricted in current room
  const currentRoomObj = rooms.find(r => r.name === activeRoom);
  const isAnnouncementRoom = currentRoomObj?.type === "announcement";
  const isInputDisabled = isAnnouncementRoom && !canManageCommunity;

  // Render Indonesian role badges
  const getMemberRoleBadge = (role: string) => {
    if (role === "MODERATOR") {
      return <span className="neo-badge !bg-mint text-[9px] uppercase font-black py-0.5 px-1">MODERATOR</span>;
    }
    return <span className="neo-badge !bg-sky text-[9px] uppercase font-black py-0.5 px-1">ANGGOTA</span>;
  };

  return (
    <div className="h-[calc(100vh-12rem)] flex flex-col md:flex-row border-2 border-neo-black bg-white rounded-lg overflow-hidden shadow-[6px_6px_0px_0px_#1A1A1A]">
      
      {/* 1. Sidebar Kiri: Saluran / Rooms */}
      <aside className="w-full md:w-64 bg-cream/10 border-b-2 md:border-b-0 md:border-r-2 border-neo-black flex flex-col shrink-0">
        
        {/* Header Komunitas */}
        <div className="p-4 border-b-2 border-neo-black bg-cream/35 flex items-center justify-between gap-2">
          <div className="min-w-0">
            <h2 className="font-heading font-black text-lg text-neo-black truncate uppercase">
              {community.name}
            </h2>
            <p className="text-[10px] font-bold text-neo-black/60 truncate">
              {community.description}
            </p>
          </div>
          
          <Link
            href="/communities"
            className="p-1.5 rounded-sm border-2 border-neo-black bg-white hover:bg-dark-white shadow-[1px_1px_0px_0px_#1A1A1A] shrink-0"
            title="Kembali ke Daftar Komunitas"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </div>

        {/* Daftar Saluran */}
        <div className="flex-1 overflow-y-auto p-3 space-y-4">
          <div className="space-y-1">
            <div className="flex items-center justify-between px-2 pb-1">
              <span className="text-[10px] font-heading font-black text-neo-black/50 uppercase tracking-wider">
                Saluran Obrolan
              </span>
              {canManageCommunity && (
                <button
                  onClick={() => setIsAddRoomOpen(true)}
                  className="p-1 rounded-sm border-2 border-neo-black bg-white hover:bg-dark-white shadow-[1px_1px_0px_0px_#1A1A1A] cursor-pointer"
                  title="Tambah Room"
                  aria-label="Tambah saluran obrolan baru"
                >
                  <Plus className="h-3 w-3" />
                </button>
              )}
            </div>

            <div className="space-y-1.5">
              {rooms.map((room) => {
                const isActive = activeRoom === room.name;
                const isAnnounce = room.type === "announcement";
                
                return (
                  <button
                    key={room.name}
                    onClick={() => setActiveRoom(room.name)}
                    className={`w-full flex items-center gap-2 rounded-sm px-3 py-2 text-xs font-heading font-black border-2 border-neo-black transition-all ${
                      isActive
                        ? "bg-sky text-neo-black translate-x-[2px] translate-y-[2px] shadow-[1px_1px_0px_0px_#1A1A1A]"
                        : "bg-white text-neo-black/80 hover:bg-dark-white hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_#1A1A1A]"
                    }`}
                  >
                    {isAnnounce ? (
                      <Lock className="h-3.5 w-3.5 shrink-0 text-neo-black" />
                    ) : (
                      <Hash className="h-3.5 w-3.5 shrink-0 text-neo-black/60" />
                    )}
                    <span className="truncate">#{room.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
          
          {/* Moderator Delegation Section (Moderators Only) */}
          {canManageCommunity && (
            <div className="pt-4 border-t-2 border-neo-black/10 space-y-2">
              <span className="text-[10px] font-heading font-black text-neo-black/50 uppercase tracking-wider block px-2">
                Manajemen
              </span>
              <button
                onClick={() => setIsDelegateOpen(true)}
                className="w-full flex items-center justify-center gap-1.5 rounded-sm px-3 py-2 text-[11px] font-heading font-black border-2 border-neo-black bg-orange hover:bg-orange/90 shadow-[1px_1px_0px_0px_#1A1A1A] transition-all cursor-pointer"
              >
                <UserCheck className="h-3.5 w-3.5" />
                <span>Delegasikan Moderator</span>
              </button>
            </div>
          )}
        </div>

      </aside>

      {/* 2. Panel Chat Utama */}
      <main className="flex-1 flex flex-col bg-cream/15 overflow-hidden">
        {/* Header Room */}
        <div className="px-6 py-4 border-b-2 border-neo-black bg-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isAnnouncementRoom ? (
              <Lock className="h-4 w-4 text-neo-black" />
            ) : (
              <Hash className="h-4 w-4 text-neo-black/60" />
            )}
            <h3 className="font-heading font-black text-md text-neo-black uppercase">
              {activeRoom}
            </h3>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-xs font-semibold text-neo-black/60">Identitas Asli Terverifikasi</span>
            <User className="h-3.5 w-3.5 text-neo-black/50" />
          </div>
        </div>

        {/* List Pesan */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-cream/10">
          {filteredMessages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-2 p-6">
              {isAnnouncementRoom ? (
                <Volume2 className="h-10 w-10 text-neo-black/30" />
              ) : (
                <Hash className="h-10 w-10 text-neo-black/30" />
              )}
              <h4 className="font-heading font-black text-sm text-neo-black">Belum ada obrolan</h4>
              <p className="text-xs font-semibold text-neo-black/50 max-w-xs">
                {isAnnouncementRoom 
                  ? "Belum ada pengumuman resmi yang disiarkan di saluran ini." 
                  : "Mulai obrolan pertama kamu dengan menyapa anggota lainnya!"}
              </p>
            </div>
          ) : (
            filteredMessages.map((msg) => (
              <div 
                key={msg.id} 
                className={`flex flex-col max-w-xl space-y-1 ${msg.isMe ? "ml-auto items-end" : "mr-auto items-start"}`}
              >
                <div className="flex items-center gap-1 px-1">
                  <span className="font-heading font-black text-[11px] text-neo-black">
                    {msg.isMe ? activeProfile.fullName : msg.aliasName}
                  </span>
                  <span className="text-[9px] text-neo-black/40 font-bold">
                    {new Date(msg.createdAt).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>

                <div className="border-2 border-neo-black rounded-md p-3.5 bg-white shadow-[2px_2px_0px_0px_#1A1A1A] max-w-full">
                  <p className="text-xs font-semibold text-neo-black font-body whitespace-pre-wrap break-words">
                    {msg.content}
                  </p>
                </div>
              </div>
            ))
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Input Obrolan */}
        <div className="p-4 bg-white border-t-2 border-neo-black">
          {isInputDisabled ? (
            <div className="bg-cream/20 border-2 border-dashed border-neo-black/30 p-3 rounded-md text-center text-xs font-bold text-neo-black/50">
              Hanya moderator yang dapat mengirim pesan di saluran pengumuman.
            </div>
          ) : (
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <input
                type="text"
                required
                placeholder={`Kirim pesan ke #${activeRoom}...`}
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                className="form-control flex-1 text-xs"
              />
              <button
                type="submit"
                disabled={isPending}
                className="neo-btn orange p-2.5 flex items-center justify-center shrink-0"
                aria-label="Kirim pesan"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          )}
        </div>
      </main>

      {/* 3. Sidebar Kanan: Anggota & Mockup Events */}
      <aside className="w-full md:w-60 border-t-2 md:border-t-0 md:border-l-2 border-neo-black bg-cream/5 flex flex-col shrink-0">
        
        {/* Navigasi static News & Events */}
        <div className="p-4 border-b-2 border-neo-black bg-cream/10 space-y-2">
          <span className="text-[10px] font-heading font-black text-neo-black/50 uppercase tracking-wider block">
            Pintasan Cepat
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => alert("Fitur Berita Komunitas akan segera hadir!")}
              className="flex flex-col items-center justify-center gap-1.5 p-2 rounded-sm border-2 border-neo-black bg-white hover:bg-dark-white shadow-[1px_1px_0px_0px_#1A1A1A] transition-all text-center cursor-pointer"
            >
              <Newspaper className="h-4 w-4 text-neo-black" />
              <span className="text-[9px] font-heading font-black">Berita</span>
            </button>
            <button
              onClick={() => alert("Fitur Event Komunitas akan segera hadir!")}
              className="flex flex-col items-center justify-center gap-1.5 p-2 rounded-sm border-2 border-neo-black bg-white hover:bg-dark-white shadow-[1px_1px_0px_0px_#1A1A1A] transition-all text-center cursor-pointer"
            >
              <Calendar className="h-4 w-4 text-neo-black" />
              <span className="text-[9px] font-heading font-black">Event</span>
            </button>
          </div>
        </div>

        {/* Daftar Anggota */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          <span className="text-[10px] font-heading font-black text-neo-black/50 uppercase tracking-wider block">
            Anggota ({members.length})
          </span>
          
          <div className="space-y-2">
            {members.map((member) => (
              <div 
                key={member.profileId} 
                className="flex items-center justify-between gap-2 p-1.5 border-2 border-neo-black bg-white rounded-sm shadow-[1.5px_1.5px_0px_0px_#1A1A1A]"
              >
                <div className="flex items-center gap-1.5 min-w-0">
                  <div className="h-5 w-5 rounded-full border border-neo-black bg-cream flex items-center justify-center text-[9px] font-bold uppercase shrink-0">
                    {member.aliasName.charAt(0)}
                  </div>
                  <span className="text-xs font-bold text-neo-black truncate">
                    {member.aliasName}
                  </span>
                </div>
                {getMemberRoleBadge(member.role)}
              </div>
            ))}
          </div>
        </div>
      </aside>

      {/* Modal: Add Room (Moderators Only) */}
      {isAddRoomOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neo-black/60 p-4 animate-fadeIn">
          <div className="neo-card bg-white w-full max-w-sm p-6 relative border-2 border-neo-black shadow-[6px_6px_0px_0px_#1A1A1A]">
            <h3 className="text-xl font-heading font-black text-neo-black uppercase mb-4">
              Tambah Saluran Baru
            </h3>
            
            <form onSubmit={handleAddRoom} className="space-y-4">
              <div className="form-group">
                <label className="form-label text-xs uppercase font-heading font-black">
                  Nama Saluran (Room Name)
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: kuliah-praktikum"
                  value={newRoomName}
                  onChange={(e) => setNewRoomName(e.target.value)}
                  className="form-control"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t-2 border-neo-black/10">
                <button
                  type="button"
                  onClick={() => setIsAddRoomOpen(false)}
                  className="neo-btn sky py-1.5 px-3 text-xs font-heading font-black"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="neo-btn orange py-1.5 px-3 text-xs font-heading font-black"
                >
                  Buat
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Delegate Moderator */}
      {isDelegateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neo-black/60 p-4 animate-fadeIn">
          <div className="neo-card bg-white w-full max-w-md p-6 relative border-2 border-neo-black shadow-[6px_6px_0px_0px_#1A1A1A]">
            <h3 className="text-xl font-heading font-black text-neo-black uppercase mb-1">
              Delegasikan Moderator
            </h3>
            <p className="text-xs font-bold text-neo-black/50 mb-4">
              Maksimal 3 moderator aktif per komunitas.
            </p>
            
            <form onSubmit={handleDelegateModerator} className="space-y-4">
              {delegateError && (
                <div className="bg-red-100 border-2 border-neo-black p-3 rounded-sm text-xs font-bold text-red-700">
                  {delegateError}
                </div>
              )}

              <div className="form-group">
                <label className="form-label text-xs uppercase font-heading font-black">
                  Pilih Anggota
                </label>
                <select
                  required
                  value={delegateTargetId}
                  onChange={(e) => setDelegateTargetId(e.target.value)}
                  className="form-control"
                >
                  <option value="">-- Pilih Anggota --</option>
                  {members
                    .filter(m => m.role !== "MODERATOR")
                    .map(m => (
                      <option key={m.profileId} value={m.profileId}>
                        {m.aliasName}
                      </option>
                    ))}
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t-2 border-neo-black/10">
                <button
                  type="button"
                  onClick={() => setIsDelegateOpen(false)}
                  className="neo-btn sky py-1.5 px-3 text-xs font-heading font-black"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="neo-btn orange py-1.5 px-3 text-xs font-heading font-black flex items-center gap-1"
                >
                  {isPending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                  <span>Delegasikan</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
