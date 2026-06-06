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
      <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
        <h3 className="uppercase text-base md:text-lg">
          🤝 Komunitas Hobi & Tongkrongan (Unofficial Groups)
        </h3>
        <Link href="/communities/create" className="neo-btn small blue !m-0">
          + Buat Baru
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {unofficialCommunities.map(group => {
          const isJoined = joinedList[group.id];
          return (
            <div key={group.id} className="neo-card interactive !m-0 !p-4 bg-white flex flex-col justify-between" onClick={() => onSelectBoard(group.name)}>
              <div className="flex gap-3 items-center mb-3">
                <div className="text-2xl bg-mint border-2 border-neo-black rounded-sm w-10 h-10 flex items-center justify-center shadow-[2px_2px_0_0_#1A1A1A] flex-shrink-0">{group.logo}</div>
                <div>
                  <h4 className="text-sm font-extrabold text-neo-black leading-tight mb-1">{group.name}</h4>
                  <span className="neo-badge !bg-cream !px-2 !py-0.5 !text-[10px]">
                    {group.category}
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-center border-t-2 border-dashed border-neo-black pt-3 mt-3">
                <span className="text-xs font-bold text-neo-black/60">
                  👤 {group.members + (isJoined ? 1 : 0)} anggota
                </span>
                
                <button 
                  onClick={(e) => toggleJoin(group.id, e)}
                  className={`neo-btn small !m-0 !py-1 !px-2.5 text-xs ${isJoined ? 'mint' : 'sky'}`}
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
