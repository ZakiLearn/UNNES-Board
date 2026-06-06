'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import ThreadCard from '@/components/features/feed/ThreadCard';

export default function ProfilePage() {
  const { user } = useAuth();
  const [myMenfess, setMyMenfess] = useState([]);
  const [userReactions, setUserReactions] = useState({});

  useEffect(() => {
    const savedMenfess = localStorage.getItem('menfess_list');
    const savedReactions = localStorage.getItem('user_reactions');
    
    if (savedMenfess && user) {
      const parsed = JSON.parse(savedMenfess);
      // Filter posts where sender matches user's name
      const filtered = parsed.filter(p => p.sender === user.name || p.sender === 'Saya');
      setMyMenfess(filtered);
    }
    
    if (savedReactions) {
      setUserReactions(JSON.parse(savedReactions));
    }
  }, [user]);

  const handleReaction = (postId, type) => {
    const reactionKey = `post-${postId}-${type}`;
    const updatedList = myMenfess.map(post => {
      if (post.id === postId) {
        const hasReacted = userReactions[reactionKey];
        const nextReactions = { ...post.reactions };
        
        if (hasReacted) {
          nextReactions[type] = Math.max(0, (nextReactions[type] || 1) - 1);
        } else {
          nextReactions[type] = (nextReactions[type] || 0) + 1;
        }

        return { ...post, reactions: nextReactions };
      }
      return post;
    });

    const nextUserReactions = { ...userReactions, [reactionKey]: !userReactions[reactionKey] };

    setMyMenfess(updatedList);
    setUserReactions(nextUserReactions);
    localStorage.setItem('user_reactions', JSON.stringify(nextUserReactions));
    
    // Also update main list
    const globalMenfess = localStorage.getItem('menfess_list');
    if (globalMenfess) {
      const parsed = JSON.parse(globalMenfess);
      const updatedGlobal = parsed.map(p => {
        if (p.id === postId) {
          return { ...p, reactions: updatedList.find(x => x.id === postId).reactions };
        }
        return p;
      });
      localStorage.setItem('menfess_list', JSON.stringify(updatedGlobal));
    }
  };

  if (!user) return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-4 md:gap-5">
      {/* Left Column */}
      <div className="flex flex-col gap-4">
        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-3">
          <div className="neo-card text-center !m-0 !p-3 bg-white">
            <span className="text-xl md:text-2xl font-black text-blue block mb-0.5">
              {myMenfess.length}
            </span>
            <span className="text-[9px] font-black text-neo-black/60">
              MENFESS TERKIRIM
            </span>
          </div>
          <div className="neo-card text-center !m-0 !p-3 bg-white">
            <span className="text-xl md:text-2xl font-black text-blue block mb-0.5">
              {myMenfess.reduce((sum, item) => sum + Object.values(item.reactions).reduce((a, b) => a + b, 0), 0)}
            </span>
            <span className="text-[9px] font-black text-neo-black/60">
              REAKSI DITERIMA
            </span>
          </div>
          <div className="neo-card text-center !m-0 !p-3 bg-white">
            <span className="text-xl md:text-2xl font-black text-blue block mb-0.5">
              Aktif
            </span>
            <span className="text-[9px] font-black text-neo-black/60">
              STATUS AKUN
            </span>
          </div>
        </div>

        {/* My Posts Feed */}
        <div>
          <h3 className="uppercase mb-3 text-sm md:text-base">
            📝 Riwayat Menfess Saya
          </h3>
          
          {myMenfess.length === 0 ? (
            <div className="neo-card text-center py-8 px-4 bg-white">
              <span className="text-4xl block mb-2">📭</span>
              <h4 className="text-sm font-extrabold">Belum ada kiriman</h4>
              <p className="text-neo-black/60 mt-1 text-xs">
                Kirim menfess pertamamu lewat Halaman Utama!
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {myMenfess.map(post => (
                <ThreadCard
                  key={post.id}
                  post={post}
                  userReactions={userReactions}
                  onReaction={handleReaction}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right Column */}
      <div className="hidden lg:flex flex-col gap-4">
        {/* Profile Card (Reddit style About card) */}
        <div className="neo-card !p-4 !mb-0 bg-sky">
          <div className="flex items-center gap-3 mb-3 pb-3 border-b-2 border-neo-black">
            <div className="text-3xl bg-white border-2 border-neo-black rounded-full w-14 h-14 flex items-center justify-center shadow-neo">
              {user.avatar}
            </div>
            <div>
              <h2 className="text-base font-black uppercase m-0 leading-tight">{user.name}</h2>
              <span className="neo-badge !bg-orange !text-[9px] !py-0.5 !px-1.5 mt-1">{user.role}</span>
            </div>
          </div>

          <div className="space-y-2 text-xs font-semibold text-neo-black/80">
            <div>
              <span className="text-[10px] text-neo-black/50 block font-bold">NIM MAHASISWA</span>
              <span>{user.nim}</span>
            </div>
            <div>
              <span className="text-[10px] text-neo-black/50 block font-bold">EMAIL AKUN</span>
              <span className="truncate block">{user.email}</span>
            </div>
            <div>
              <span className="text-[10px] text-neo-black/50 block font-bold">TERDAFTAR SEJAK</span>
              <span>Semester Gasal 2024</span>
            </div>
            <div className="pt-2">
              <div className="flex items-center gap-1.5 bg-white border-2 border-neo-black p-2 rounded-sm text-[10px] text-neo-black">
                <span>🛡️</span>
                <span>Mahasiswa UNNES Terverifikasi</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
