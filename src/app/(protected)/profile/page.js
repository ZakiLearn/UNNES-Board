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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
      {/* Profile Info Card */}
      <div className="neo-card" style={{
        backgroundColor: 'var(--accent-sky)',
        display: 'flex',
        alignItems: 'center',
        gap: '24px',
        padding: '32px',
        flexWrap: 'wrap',
        marginBottom: 0
      }}>
        <div style={{
          fontSize: '3rem',
          background: 'var(--bg-white)',
          border: 'var(--border-stroke)',
          borderRadius: '50%',
          width: '90px',
          height: '90px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '4px 4px 0 0 var(--color-black)'
        }}>
          {user.avatar}
        </div>
        <div>
          <h2 style={{ fontSize: '2rem', textTransform: 'uppercase', marginBottom: '4px' }}>{user.name}</h2>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center', marginBottom: '8px' }}>
            <span className="neo-badge" style={{ backgroundColor: 'var(--accent-orange)' }}>{user.role}</span>
            <span className="neo-badge" style={{ backgroundColor: 'var(--bg-white)' }}>NIM: {user.nim}</span>
          </div>
          <div style={{ fontWeight: 700, color: 'rgba(26,26,26,0.8)' }}>📧 {user.email}</div>
        </div>
      </div>

      {/* Stats Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '20px'
      }} className="profile-stats-grid">
        <div className="neo-card" style={{ textAlign: 'center', margin: 0, padding: '16px' }}>
          <span style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--accent-blue)', display: 'block' }}>
            {myMenfess.length}
          </span>
          <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'rgba(26,26,26,0.6)' }}>
            MENFESS TERKIRIM
          </span>
        </div>
        <div className="neo-card" style={{ textAlign: 'center', margin: 0, padding: '16px' }}>
          <span style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--accent-blue)', display: 'block' }}>
            {myMenfess.reduce((sum, item) => sum + Object.values(item.reactions).reduce((a, b) => a + b, 0), 0)}
          </span>
          <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'rgba(26,26,26,0.6)' }}>
            REAKSI DITERIMA
          </span>
        </div>
        <div className="neo-card" style={{ textAlign: 'center', margin: 0, padding: '16px' }}>
          <span style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--accent-blue)', display: 'block' }}>
            Aktif
          </span>
          <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'rgba(26,26,26,0.6)' }}>
            STATUS AKUN
          </span>
        </div>
      </div>

      {/* My Posts Feed */}
      <div>
        <h3 style={{ textTransform: 'uppercase', marginBottom: '16px', fontSize: '1.3rem' }}>
          📝 Riwayat Menfess Saya
        </h3>
        
        {myMenfess.length === 0 ? (
          <div className="neo-card" style={{ textAlign: 'center', padding: '40px 20px' }}>
            <span style={{ fontSize: '2.5rem' }}>📭</span>
            <h4 style={{ marginTop: '12px' }}>Belum ada kiriman</h4>
            <p style={{ color: 'rgba(26,26,26,0.6)', marginTop: '8px', fontSize: '0.9rem', fontWeight: 600 }}>
              Kirim menfess pertamamu lewat Halaman Utama!
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
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

      <style jsx>{`
        @media (max-width: 600px) {
          .profile-stats-grid {
            grid-template-columns: 1fr !important;
            gap: 12px !important;
          }
        }
      `}</style>
    </div>
  );
}
