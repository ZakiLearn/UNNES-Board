'use client';
import { useState } from 'react';
import ThreadCard from './ThreadCard';

export default function ThreadList({ posts, userReactions, onReaction }) {
  const [currentFilter, setCurrentFilter] = useState('all');

  const filteredPosts = currentFilter === 'all'
    ? posts
    : posts.filter(post => post.tag === currentFilter);

  const categories = ['all', 'Akademik', 'Curhat', 'Info', 'Asmara', 'Kantin'];

  return (
    <div className="flex flex-col gap-3">
      {/* Header and Filters */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
        <h2 className="text-lg md:text-xl uppercase">💬 Menfess Kampus</h2>
        
        <div className="flex gap-1.5 overflow-x-auto pb-1 max-w-full">
          {categories.map(cat => (
            <span 
              key={cat} 
              className={`px-2 py-1 text-xs font-bold rounded-sm border-2 border-neo-black cursor-pointer transition-colors duration-150 select-none ${
                currentFilter === cat 
                  ? 'bg-blue text-white shadow-none translate-x-[1px] translate-y-[1px]' 
                  : 'bg-white text-neo-black hover:bg-dark-white shadow-[2px_2px_0px_0px_#1A1A1A] hover:translate-x-[0.5px] hover:translate-y-[0.5px] hover:shadow-[1px_1px_0px_0px_#1A1A1A]'
              }`}
              onClick={() => setCurrentFilter(cat)}
            >
              {cat === 'all' ? 'Semua' : `#${cat}`}
            </span>
          ))}
        </div>
      </div>

      {/* Threads List */}
      <div className="flex flex-col gap-3">
        {filteredPosts.length === 0 ? (
          <div className="neo-card text-center py-10 px-5 bg-white">
            <span className="text-5xl block mb-3">📭</span>
            <h3 className="mt-3">Belum ada Menfess di kategori ini</h3>
            <p className="text-neo-black/60 mt-2 text-sm">
              Jadilah orang pertama yang mengirim menfess di kategori #{currentFilter}!
            </p>
          </div>
        ) : (
          filteredPosts.map(post => (
            <ThreadCard 
              key={post.id} 
              post={post} 
              userReactions={userReactions} 
              onReaction={onReaction} 
            />
          ))
        )}
      </div>
    </div>
  );
}
