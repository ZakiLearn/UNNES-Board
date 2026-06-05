'use client';
import { useState } from 'react';
import Link from 'next/link';

const unofficialCommunities = [
  { id: 'futsal-unnes', name: 'UNNES Futsal Kere', members: 154, category: 'Olahraga', logo: '⚽' },
  { id: 'geprek-hunters', name: 'Geprek Sekaran Hunters', members: 420, category: 'Kuliner', logo: '🍗' },
  { id: 'valorant-unnes', name: 'Kaum Rebahan Valorant', members: 98, category: 'Gaming', logo: '🎮' },
  { id: 'kpop-sekaran', name: 'K-Popers Gang Sekaran', members: 112, category: 'Hobi', logo: '🎶' },
];

export default function UnofficialOrgs({ onSelectBoard }) {
  const [joinedList, setJoinedList] = useState({});

  const toggleJoin = (id, e) => {
    e.stopPropagation();
    setJoinedList(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h3 style={{ textTransform: 'uppercase', fontSize: '1.3rem' }}>
          🤝 Komunitas Hobi & Tongkrongan (Unofficial Groups)
        </h3>
        <Link href="/communities/create" className="neo-btn small blue" style={{ margin: '0' }}>
          + Buat Baru
        </Link>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
        gap: '20px'
      }}>
        {unofficialCommunities.map(group => {
          const isJoined = joinedList[group.id];
          return (
            <div key={group.id} className="neo-card interactive" style={{
              margin: 0,
              padding: '16px',
              backgroundColor: 'var(--bg-white)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }} onClick={() => onSelectBoard(group.name)}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '12px' }}>
                <div style={{
                  fontSize: '1.6rem',
                  background: 'var(--accent-mint)',
                  border: 'var(--border-stroke)',
                  borderRadius: 'var(--border-radius-sm)',
                  width: '40px',
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '2px 2px 0 0 var(--color-black)'
                }}>{group.logo}</div>
                <div>
                  <h4 style={{ fontSize: '0.95rem', marginBottom: '2px' }}>{group.name}</h4>
                  <span className="neo-badge" style={{ backgroundColor: 'var(--bg-cream)', fontSize: '0.65rem', padding: '2px 8px' }}>
                    {group.category}
                  </span>
                </div>
              </div>

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderTop: '2px dashed var(--color-black)',
                paddingTop: '10px',
                marginTop: '10px'
              }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'rgba(26,26,26,0.6)' }}>
                  👤 {group.members + (isJoined ? 1 : 0)} anggota
                </span>
                
                <button 
                  onClick={(e) => toggleJoin(group.id, e)}
                  className={`neo-btn small ${isJoined ? 'mint' : 'sky'}`}
                  style={{ padding: '4px 8px', fontSize: '0.75rem', margin: '0' }}
                >
                  {isJoined ? '✓ Joined' : 'Join'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
