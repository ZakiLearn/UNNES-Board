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
    <div className="feed-container">
      {/* Header and Filters */}
      <div className="feed-header">
        <h2 style={{ fontSize: '1.6rem', textTransform: 'uppercase' }}>💬 Menfess Kampus</h2>
        
        <div className="filter-tags" style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
          {categories.map(cat => (
            <span 
              key={cat} 
              className={`filter-tag ${currentFilter === cat ? 'active' : ''}`}
              onClick={() => setCurrentFilter(cat)}
            >
              {cat === 'all' ? 'Semua' : `#${cat}`}
            </span>
          ))}
        </div>
      </div>

      {/* Threads List */}
      <div className="threads-list" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {filteredPosts.length === 0 ? (
          <div className="neo-card" style={{ textAlign: 'center', padding: '40px 20px', backgroundColor: 'var(--bg-white)' }}>
            <span style={{ fontSize: '3rem' }}>📭</span>
            <h3 style={{ marginTop: '12px' }}>Belum ada Menfess di kategori ini</h3>
            <p style={{ color: 'rgba(26,26,26,0.6)', marginTop: '8px' }}>
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
