'use client';

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus, Users, Loader2, FileText, Check } from "lucide-react";
import { createCommunity, joinCommunityRequest, simulatedApproveMember } from "./actions";

interface ProfileItem {
  id: string;
  aliasName: string;
}

interface CommunityItem {
  id: number;
  name: string;
  description: string;
  memberCount: number;
  createdAt: string;
}

interface MembershipItem {
  communityId: number;
  status: string;
  role: string;
}

interface CommunitiesClientProps {
  profile: { id: string; role: string; aliasName: string | null };
  communities: CommunityItem[];
  initialMemberships: MembershipItem[];
  allProfiles: ProfileItem[];
}

export default function CommunitiesClient({
  profile,
  communities,
  initialMemberships,
  allProfiles
}: CommunitiesClientProps) {
  const router = useRouter();
  const [memberships, setMemberships] = useState<MembershipItem[]>(initialMemberships);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [selectedCommunity, setSelectedCommunity] = useState<CommunityItem | null>(null);
  
  // Create Community Form state
  const [newName, setNewName] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newModeratorId, setNewModeratorId] = useState(profile.id);
  const [createError, setCreateError] = useState("");
  
  // Join Request Form state
  const [alasan, setAlasan] = useState("");
  const [joinError, setJoinError] = useState("");
  
  // Simulation states
  const [simulatingId, setSimulatingId] = useState<number | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleCreateCommunity = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateError("");

    startTransition(async () => {
      const res = await createCommunity({
        name: newName,
        description: newDescription,
        initialModeratorId: newModeratorId
      });

      if (res.success) {
        setIsCreateModalOpen(false);
        setNewName("");
        setNewDescription("");
        setNewModeratorId(profile.id);
        // Reload page data
        router.refresh();
      } else {
        setCreateError(res.error || "Gagal membuat komunitas");
      }
    });
  };

  const handleJoinClick = (community: CommunityItem) => {
    setSelectedCommunity(community);
    setAlasan("");
    setJoinError("");
    setIsJoinModalOpen(true);
  };

  const handleJoinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCommunity) return;
    setJoinError("");

    const communityId = selectedCommunity.id;

    startTransition(async () => {
      // 1. Send PENDING membership to DB
      const res = await joinCommunityRequest(communityId, alasan);

      if (res.success) {
        // Add pending membership to local state
        setMemberships(prev => [
          ...prev,
          { communityId, status: "PENDING", role: "MEMBER" }
        ]);
        setIsJoinModalOpen(false);
        
        // 2. Start simulated auto-approval delay
        setSimulatingId(communityId);
        
        setTimeout(async () => {
          // 3. Call Server Action to APPROVED
          const approveRes = await simulatedApproveMember(communityId);
          if (approveRes.success) {
            // Update local state to APPROVED
            setMemberships(prev =>
              prev.map(m => m.communityId === communityId ? { ...m, status: "APPROVED" } : m)
            );
            setSimulatingId(null);
            // 4. Redirect straight to detail page
            router.push(`/communities/${communityId}`);
          } else {
            setJoinError(approveRes.error || "Gagal melakukan persetujuan otomatis.");
            setSimulatingId(null);
          }
        }, 2000);
      } else {
        setJoinError(res.error || "Gagal mengirim permintaan.");
      }
    });
  };

  const getMembershipStatus = (communityId: number) => {
    const membership = memberships.find(m => m.communityId === communityId);
    return membership ? membership.status : null;
  };

  return (
    <div className="space-y-6">
      {/* Admin Action Header */}
      {profile.role === "ADMIN" && (
        <div className="flex justify-end">
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="neo-btn orange flex items-center gap-2 cursor-pointer font-heading font-black text-sm"
          >
            <Plus className="h-4 w-4 stroke-[3px]" />
            <span>Buat Komunitas Baru</span>
          </button>
        </div>
      )}

      {/* Communities Grid */}
      {communities.length === 0 ? (
        <div className="neo-card bg-white p-12 text-center space-y-4">
          <Users className="h-16 w-16 mx-auto text-neo-black/30" />
          <h3 className="text-xl font-heading font-black text-neo-black">Belum ada komunitas</h3>
          <p className="text-sm font-semibold text-neo-black/60 max-w-md mx-auto">
            Belum ada komunitas yang terdaftar di UNNES-Board. Hubungi Admin untuk membuat komunitas pertama!
          </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {communities.map((community) => {
            const status = getMembershipStatus(community.id);
            const isSimulating = simulatingId === community.id;

            return (
              <div key={community.id} className="neo-card bg-white p-6 flex flex-col gap-4 justify-between min-h-[200px]">
                <div className="space-y-3">
                  <div className="flex justify-between items-start gap-2">
                    <h3 className="font-heading font-black text-xl text-neo-black leading-tight truncate">
                      {community.name}
                    </h3>
                    <span className="neo-badge !bg-sky text-xs flex items-center gap-1 shrink-0 font-heading font-extrabold border-2 border-neo-black py-0.5 px-2 rounded-sm shadow-[1px_1px_0px_0px_#1A1A1A]">
                      <Users className="h-3 w-3" />
                      <span>{community.memberCount}</span>
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-neo-black/70 font-body line-clamp-3">
                    {community.description}
                  </p>
                </div>

                <div className="pt-2">
                  {status === "APPROVED" ? (
                    <button
                      onClick={() => router.push(`/communities/${community.id}`)}
                      className="neo-btn mint w-full text-center flex items-center justify-center gap-2 font-heading font-black text-sm py-2"
                    >
                      <span>Masuk Komunitas</span>
                    </button>
                  ) : isSimulating || status === "PENDING" ? (
                    <button
                      disabled
                      className="neo-btn bg-yellow-300 opacity-90 w-full text-center flex items-center justify-center gap-2 font-heading font-black text-sm py-2 cursor-not-allowed border-2 border-neo-black shadow-neo-hover"
                    >
                      <Loader2 className="h-4 w-4 animate-spin text-neo-black" />
                      <span>Menunggu Persetujuan...</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => handleJoinClick(community)}
                      className="neo-btn orange w-full text-center flex items-center justify-center gap-2 font-heading font-black text-sm py-2"
                    >
                      <span>Gabung</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal: Create Community (Admin Only) */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neo-black/60 p-4 animate-fadeIn">
          <div className="neo-card bg-white w-full max-w-md p-6 relative border-2 border-neo-black shadow-[8px_8px_0px_0px_#1A1A1A]">
            <h2 className="text-2xl font-heading font-black text-neo-black uppercase mb-4">
              Buat Komunitas Baru
            </h2>
            
            <form onSubmit={handleCreateCommunity} className="space-y-4">
              {createError && (
                <div className="bg-red-100 border-2 border-neo-black p-3 rounded-sm text-xs font-bold text-red-700">
                  {createError}
                </div>
              )}

              <div className="form-group">
                <label className="form-label text-xs uppercase tracking-wider font-heading font-black">
                  Nama Komunitas
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: HIMA Ilmu Komputer"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="form-control"
                />
              </div>

              <div className="form-group">
                <label className="form-label text-xs uppercase tracking-wider font-heading font-black">
                  Deskripsi Komunitas
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Ceritakan visi atau deskripsi singkat..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="form-control"
                />
              </div>

              <div className="form-group">
                <label className="form-label text-xs uppercase tracking-wider font-heading font-black">
                  Moderator Awal (Pemilik Pertama)
                </label>
                <select
                  value={newModeratorId}
                  onChange={(e) => setNewModeratorId(e.target.value)}
                  className="form-control"
                >
                  {allProfiles.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.aliasName} ({p.id.substring(0, 5)}...)
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t-2 border-neo-black/10">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="neo-btn sky py-2 px-4 text-xs font-heading font-black"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="neo-btn orange py-2 px-4 text-xs font-heading font-black flex items-center gap-1.5"
                >
                  {isPending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                  <span>Buat</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Join Request */}
      {isJoinModalOpen && selectedCommunity && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neo-black/60 p-4 animate-fadeIn">
          <div className="neo-card bg-white w-full max-w-md p-6 relative border-2 border-neo-black shadow-[8px_8px_0px_0px_#1A1A1A]">
            <h2 className="text-2xl font-heading font-black text-neo-black uppercase mb-1">
              Pengajuan Gabung
            </h2>
            <p className="text-xs font-bold text-neo-black/60 mb-4">
              Komunitas: <span className="text-neo-black underline font-black">{selectedCommunity.name}</span>
            </p>
            
            <form onSubmit={handleJoinSubmit} className="space-y-4">
              {joinError && (
                <div className="bg-red-100 border-2 border-neo-black p-3 rounded-sm text-xs font-bold text-red-700">
                  {joinError}
                </div>
              )}

              <div className="form-group">
                <label className="form-label text-xs uppercase tracking-wider font-heading font-black">
                  Alasan Bergabung
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Mengapa Anda ingin bergabung? (Contoh: Ingin belajar praktikum dan diskusi tugas)"
                  value={alasan}
                  onChange={(e) => setAlasan(e.target.value)}
                  className="form-control"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t-2 border-neo-black/10">
                <button
                  type="button"
                  onClick={() => setIsJoinModalOpen(false)}
                  className="neo-btn sky py-2 px-4 text-xs font-heading font-black"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="neo-btn orange py-2 px-4 text-xs font-heading font-black flex items-center gap-1.5"
                >
                  {isPending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                  <span>Kirim</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
