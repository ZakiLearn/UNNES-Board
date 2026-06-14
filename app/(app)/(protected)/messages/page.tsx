"use client";

import React, { useEffect, useState, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { RealtimeChannel } from "@supabase/supabase-js";
import { Search, Send, UserPlus, Check, X, MessageSquare, AlertCircle } from "lucide-react";

interface Profile {
  id: string;
  aliasName: string;
}

interface Connection {
  connectionId: number;
  profile: Profile;
  lastMessage?: string;
  time?: string;
}

interface PendingRequest {
  connectionId: number;
  sender: Profile;
  createdAt: string;
}

interface Message {
  id: number;
  senderId: string;
  receiverId: string;
  content: string;
  createdAt: string;
}

interface SearchResult {
  id: string;
  aliasName: string;
  connection: {
    id: number;
    status: string;
    isSender: boolean;
  } | null;
}

export default function MessagesPage() {
  const [currentUser, setCurrentUser] = useState<Profile | null>(null);
  const [activeChats, setActiveChats] = useState<Connection[]>([]);
  const [pendingRequests, setPendingRequests] = useState<PendingRequest[]>([]);
  const [activeChat, setActiveChat] = useState<Profile | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState("");
  const [activeTab, setActiveTab] = useState<"chats" | "requests">("chats");
  
  // Search state
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);

  const activeChannelRef = useRef<RealtimeChannel | null>(null);
  const globalChannelRef = useRef<RealtimeChannel | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // 1. Fetch current user & connection data
  const fetchData = async () => {
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const userProfile = {
          id: user.id,
          aliasName: user.user_metadata?.aliasName || "Anonim",
        };
        setCurrentUser(userProfile);

        // Fetch connections
        const res = await fetch("/api/messages/connections");
        const data = await res.json();
        if (res.ok) {
          setActiveChats(data.activeChats || []);
          setPendingRequests(data.pendingRequests || []);
        }
      }
    } catch (err) {
      console.error("Error loading data:", err);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchData();
  }, []);

  // 2. Setup Global Realtime channel for incoming chat notifications
  useEffect(() => {
    if (!currentUser) return;

    const supabase = createClient();
    const globalChannel = supabase.channel(`notifications-${currentUser.id}`, {
      config: { broadcast: { self: false } },
    });

    globalChannel
      .on("broadcast", { event: "new_msg" }, () => {
        // Refresh sidebar active chats when receiving a new message notification
        fetchData();
      })
      .subscribe();

    globalChannelRef.current = globalChannel;

    return () => {
      supabase.removeChannel(globalChannel);
    };
  }, [currentUser]);

  // Scroll to bottom when new message arrives
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 3. Connect to specific active chat room when activeChat changes
  useEffect(() => {
    if (!currentUser || !activeChat) return;

    const supabase = createClient();
    
    // Sort IDs to make room name deterministic/unique
    const room = [currentUser.id, activeChat.id].sort().join("_");
    const activeChannel = supabase.channel(`room-${room}`, {
      config: { broadcast: { self: false } },
    });

    activeChannel
      .on("broadcast", { event: "message" }, ({ payload }) => {
        setMessages((prev) => {
          if (prev.some((m) => m.id === payload.id)) return prev;
          return [...prev, payload];
        });
      })
      .subscribe();

    activeChannelRef.current = activeChannel;

    // Load message history from DB
    const loadHistory = async () => {
      try {
        const res = await fetch(`/api/messages?receiverId=${activeChat.id}`);
        const data = await res.json();
        if (res.ok && data.messages) {
          setMessages(data.messages);
        }
      } catch (err) {
        console.error("Error loading history:", err);
      }
    };
    loadHistory();

    return () => {
      supabase.removeChannel(activeChannel);
    };
  }, [activeChat, currentUser]);

  // Handle send message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() || !currentUser || !activeChat) return;

    const textToSend = messageText.trim();
    setMessageText("");

    // Optimistic message UI insert
    const tempId = Date.now();
    const tempMessage: Message = {
      id: tempId,
      senderId: currentUser.id,
      receiverId: activeChat.id,
      content: textToSend,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, tempMessage]);

    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ receiverId: activeChat.id, content: textToSend }),
      });
      const data = await res.json();

      if (res.ok && data.message) {
        const finalMessage = data.message;
        // Replace temp optimistic message with db message
        setMessages((prev) => prev.map((m) => (m.id === tempId ? finalMessage : m)));

        // Broadcast to active room WebSocket channel
        if (activeChannelRef.current) {
          activeChannelRef.current.send({
            type: "broadcast",
            event: "message",
            payload: finalMessage,
          });
        }

        // Notify recipient's global notification channel
        const supabase = createClient();
        const notificationChannel = supabase.channel(`notifications-${activeChat.id}`);
        notificationChannel.subscribe((status) => {
          if (status === "SUBSCRIBED") {
            notificationChannel.send({
              type: "broadcast",
              event: "new_msg",
              payload: { senderId: currentUser.id },
            });
            supabase.removeChannel(notificationChannel);
          }
        });

        fetchData();
      } else {
        alert(data.error || "Gagal mengirim pesan");
        setMessages((prev) => prev.filter((m) => m.id !== tempId));
      }
    } catch (err) {
      console.error("Send message error:", err);
      setMessages((prev) => prev.filter((m) => m.id !== tempId));
    }
  };

  // Search users
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setSearchLoading(true);
    try {
      const res = await fetch(`/api/messages/search-users?q=${encodeURIComponent(searchQuery)}`);
      const data = await res.json();
      if (res.ok) {
        setSearchResults(data.users || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSearchLoading(false);
    }
  };

  // Send connection request
  const sendRequest = async (receiverId: string) => {
    try {
      const res = await fetch("/api/messages/connections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ receiverId }),
      });
      if (res.ok) {
        // Refresh search results to show pending status
        if (searchQuery) {
          const searchRes = await fetch(`/api/messages/search-users?q=${encodeURIComponent(searchQuery)}`);
          const searchData = await searchRes.json();
          if (searchRes.ok) setSearchResults(searchData.users || []);
        }
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Respond to connection request (Accept / Reject)
  const handleRequestResponse = async (connectionId: number, status: "ACCEPTED" | "REJECTED") => {
    try {
      const res = await fetch("/api/messages/connections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ connectionId, status }),
      });
      if (res.ok) {
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-6xl mx-auto h-[calc(100vh-12rem)] flex rounded-lg border-2 border-neo-black bg-white overflow-hidden shadow-neo relative">
      {/* Sidebar - Threads / Requests */}
      <div className="w-full md:w-80 border-r-2 border-neo-black flex flex-col bg-white shrink-0">
        {/* Sidebar Header */}
        <div className="p-4 border-b-2 border-neo-black bg-cream/35 flex justify-between items-center">
          <h1 className="text-xl font-heading font-black text-neo-black uppercase tracking-tight">Obrolan</h1>
          <button
            onClick={() => setSearchOpen(true)}
            className="p-2 bg-yellow hover:bg-yellow/90 border-2 border-neo-black rounded-md shadow-neo-sm font-black text-xs flex items-center gap-1.5 cursor-pointer transition-transform hover:scale-105"
          >
            <UserPlus className="h-4 w-4" />
            <span>Cari</span>
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="grid grid-cols-2 border-b-2 border-neo-black">
          <button
            onClick={() => setActiveTab("chats")}
            className={`py-3 text-xs font-heading font-black border-r-2 border-neo-black transition-colors ${
              activeTab === "chats" ? "bg-sky text-neo-black" : "bg-white text-neo-black/60 hover:bg-dark-white"
            }`}
          >
            Pesan ({activeChats.length})
          </button>
          <button
            onClick={() => setActiveTab("requests")}
            className={`py-3 text-xs font-heading font-black transition-colors flex justify-center items-center gap-1.5 ${
              activeTab === "requests" ? "bg-sky text-neo-black" : "bg-white text-neo-black/60 hover:bg-dark-white"
            }`}
          >
            <span>Permintaan</span>
            {pendingRequests.length > 0 && (
              <span className="h-5 w-5 rounded-full bg-orange border border-neo-black text-[10px] text-neo-black flex items-center justify-center font-bold">
                {pendingRequests.length}
              </span>
            )}
          </button>
        </div>

        {/* List Container */}
        <div className="flex-1 overflow-y-auto divide-y-2 divide-neo-black/10">
          {activeTab === "chats" ? (
            activeChats.length === 0 ? (
              <div className="p-8 text-center text-xs font-bold text-neo-black/40 flex flex-col items-center gap-2">
                <MessageSquare className="h-8 w-8 text-neo-black/25" />
                <p>Belum ada chat aktif.</p>
                <p className="text-[10px]">Klik tombol cari untuk memulai obrolan baru.</p>
              </div>
            ) : (
              activeChats.map((chat) => (
                <div
                  key={chat.connectionId}
                  onClick={() => setActiveChat(chat.profile)}
                  className={`flex items-center gap-3 p-4 cursor-pointer hover:bg-dark-white transition-colors ${
                    activeChat?.id === chat.profile.id ? "bg-cream/40" : ""
                  }`}
                >
                  <div className="shrink-0">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-orange border-2 border-neo-black shadow-neo-sm font-heading font-black text-neo-black">
                      {chat.profile.aliasName.substring(0, 2).toUpperCase()}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-heading font-black truncate text-neo-black">
                        {chat.profile.aliasName}
                      </h3>
                    </div>
                    <p className="text-xs truncate text-neo-black/60">
                      Mulai chat sekarang...
                    </p>
                  </div>
                </div>
              ))
            )
          ) : pendingRequests.length === 0 ? (
            <div className="p-8 text-center text-xs font-bold text-neo-black/40 flex flex-col items-center gap-2">
              <Check className="h-8 w-8 text-neo-black/25" />
              <p>Tidak ada permintaan chat masuk.</p>
            </div>
          ) : (
            pendingRequests.map((req) => (
              <div key={req.connectionId} className="p-4 flex flex-col gap-2.5 bg-cream/10">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sky border border-neo-black font-heading font-black text-xs text-neo-black">
                    {req.sender.aliasName.substring(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-heading font-black text-neo-black truncate">
                      {req.sender.aliasName}
                    </h4>
                    <p className="text-[10px] text-neo-black/50">Meminta terhubung</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleRequestResponse(req.connectionId, "ACCEPTED")}
                    className="flex-1 py-1.5 bg-mint hover:bg-mint/95 border-2 border-neo-black rounded-md shadow-neo-sm font-heading font-black text-xs text-neo-black flex items-center justify-center gap-1 cursor-pointer transition-transform hover:scale-102"
                  >
                    <Check className="h-3.5 w-3.5" />
                    <span>Terima</span>
                  </button>
                  <button
                    onClick={() => handleRequestResponse(req.connectionId, "REJECTED")}
                    className="py-1.5 px-3 bg-orange/40 hover:bg-orange/50 border-2 border-neo-black rounded-md shadow-neo-sm font-heading font-black text-xs text-neo-black flex items-center justify-center cursor-pointer transition-transform hover:scale-102"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Main Conversation Window */}
      {activeChat ? (
        <div className="flex flex-1 flex-col bg-cream/15">
          {/* Active Header */}
          <div className="flex h-16 items-center justify-between px-6 border-b-2 border-neo-black bg-white shrink-0">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange border-2 border-neo-black shadow-neo-sm font-heading font-black text-neo-black">
                {activeChat.aliasName.substring(0, 2).toUpperCase()}
              </div>
              <div>
                <h3 className="font-heading font-black text-sm text-neo-black">{activeChat.aliasName}</h3>
                <p className="text-[10px] font-bold text-mint-600 flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-mint border border-neo-black animate-pulse inline-block" />
                  <span>Koneksi Aktif</span>
                </p>
              </div>
            </div>
          </div>

          {/* Message Bubble Area */}
          <div className="flex-1 p-6 space-y-4 overflow-y-auto bg-dark-white/50">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col justify-center items-center text-xs font-bold text-neo-black/45 gap-2">
                <AlertCircle className="h-6 w-6 text-neo-black/30" />
                <p>Kirim pesan untuk memulai percakapan secara aman.</p>
              </div>
            ) : (
              messages.map((msg, index) => {
                const isMe = msg.senderId === currentUser?.id;
                return (
                  <div
                    key={index}
                    className={`flex items-start gap-2.5 max-w-[75%] ${
                      isMe ? "ml-auto justify-end" : ""
                    }`}
                  >
                    {!isMe && (
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-cream border-2 border-neo-black text-xxs font-heading font-black shrink-0 shadow-neo-sm">
                        {activeChat.aliasName.substring(0, 2).toUpperCase()}
                      </div>
                    )}
                    <div
                      className={`rounded-md border-2 border-neo-black p-3.5 text-xs font-bold text-neo-black shadow-neo-sm ${
                        isMe ? "bg-sky" : "bg-white"
                      }`}
                    >
                      <p className="break-all whitespace-pre-wrap">{msg.content}</p>
                      <span className="block text-[8px] text-neo-black/40 text-right mt-1.5 font-bold">
                        {new Date(msg.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Action input panel */}
          <div className="p-4 bg-white border-t-2 border-neo-black shrink-0">
            <form onSubmit={handleSendMessage} className="flex gap-3">
              <input
                type="text"
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                placeholder="Tulis pesan Anda disini..."
                className="flex-1 rounded-md border-2 border-neo-black bg-white px-4 py-2.5 text-xs font-bold shadow-neo-sm focus:outline-none focus:translate-x-[1px] focus:translate-y-[1px] focus:shadow-neo-hover"
              />
              <button
                type="submit"
                className="neo-btn sky py-2.5 px-5 text-xs font-heading font-black flex items-center gap-1.5 cursor-pointer"
              >
                <span>Kirim</span>
                <Send className="h-3.5 w-3.5" />
              </button>
            </form>
          </div>
        </div>
      ) : (
        <div className="hidden md:flex flex-1 flex-col items-center justify-center bg-cream/10 p-8">
          <div className="max-w-md text-center space-y-4">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-yellow border-2 border-neo-black shadow-neo font-heading font-black text-2xl text-neo-black">
              💬
            </div>
            <h2 className="text-xl font-heading font-black text-neo-black uppercase tracking-tight">
              Ruang Obrolan
            </h2>
            <p className="text-xs font-bold text-neo-black/60 leading-relaxed">
              Mulai komunikasi aman antar mahasiswa UNNES secara terenkripsi. Silakan pilih teman mengobrol atau gunakan pencarian untuk menemukan pengguna lain.
            </p>
          </div>
        </div>
      )}

      {/* User Search Dialog Modal */}
      {searchOpen && (
        <div className="absolute inset-0 bg-neo-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-md bg-white border-4 border-neo-black rounded-lg shadow-neo overflow-hidden flex flex-col max-h-[80vh]">
            {/* Modal Header */}
            <div className="p-4 border-b-4 border-neo-black bg-orange/95 flex justify-between items-center">
              <h3 className="font-heading font-black text-sm text-neo-black uppercase tracking-wider">
                Cari Pengguna
              </h3>
              <button
                onClick={() => {
                  setSearchOpen(false);
                  setSearchQuery("");
                  setSearchResults([]);
                }}
                className="p-1.5 bg-white border-2 border-neo-black rounded-md hover:bg-dark-white cursor-pointer"
              >
                <X className="h-4 w-4 text-neo-black" />
              </button>
            </div>

            {/* Modal Search Input */}
            <div className="p-4 border-b-2 border-neo-black bg-cream/20">
              <form onSubmit={handleSearch} className="flex gap-2">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Masukkan nama alias..."
                  className="flex-1 rounded-md border-2 border-neo-black bg-white px-3 py-2 text-xs font-bold shadow-neo-sm focus:outline-none"
                />
                <button
                  type="submit"
                  className="neo-btn yellow py-2 px-4 text-xs font-heading font-black flex items-center gap-1 cursor-pointer"
                >
                  <Search className="h-3.5 w-3.5" />
                  <span>Cari</span>
                </button>
              </form>
            </div>

            {/* Modal Results List */}
            <div className="flex-1 overflow-y-auto p-4 divide-y-2 divide-neo-black/10">
              {searchLoading ? (
                <div className="py-8 text-center text-xs font-bold text-neo-black/50">
                  Mencari...
                </div>
              ) : searchResults.length === 0 ? (
                <div className="py-8 text-center text-xs font-bold text-neo-black/40">
                  {searchQuery ? "Tidak ada pengguna ditemukan." : "Ketik nama alias di atas."}
                </div>
              ) : (
                searchResults.map((result) => (
                  <div key={result.id} className="py-3 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-cream border border-neo-black font-heading font-black text-xs text-neo-black">
                        {result.aliasName.substring(0, 2).toUpperCase()}
                      </div>
                      <span className="text-xs font-bold text-neo-black">{result.aliasName}</span>
                    </div>

                    {result.connection ? (
                      result.connection.status === "ACCEPTED" ? (
                        <span className="text-[10px] font-heading font-black bg-mint border border-neo-black rounded-md py-1 px-2.5 shadow-neo-sm">
                          Terhubung
                        </span>
                      ) : result.connection.isSender ? (
                        <span className="text-[10px] font-heading font-black bg-yellow/45 border border-neo-black rounded-md py-1 px-2.5 text-neo-black/60">
                          Menunggu Persetujuan
                        </span>
                      ) : (
                        <button
                          onClick={() => handleRequestResponse(result.connection!.id, "ACCEPTED")}
                          className="neo-btn mint py-1 px-2.5 text-[10px] font-heading font-black flex items-center gap-1 cursor-pointer"
                        >
                          <Check className="h-3 w-3" />
                          <span>Terima Request</span>
                        </button>
                      )
                    ) : (
                      <button
                        onClick={() => sendRequest(result.id)}
                        className="neo-btn sky py-1.5 px-3 text-[10px] font-heading font-black flex items-center gap-1.5 cursor-pointer"
                      >
                        <UserPlus className="h-3 w-3" />
                        <span>Kirim Permintaan</span>
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
