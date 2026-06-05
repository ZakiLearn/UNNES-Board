'use client';
import { useState } from 'react';

const avatars = ['🦊', '🐱', '🐸', '🐨', '🐼', '🐯', '🦁', '🐵', '🦉', '🦄'];
function getRandomAvatar(senderName) {
  let hash = 0;
  for (let i = 0; i < senderName.length; i++) {
    hash = senderName.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % avatars.length;
  return avatars[index];
}

function timeAgo(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);
  
  if (seconds < 60) return 'Baru saja';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}j`;
  const days = Math.floor(hours / 24);
  return `${days}h`;
}

export default function ThreadCard({ post, userReactions, onReaction }) {
  const avatar = getRandomAvatar(post.sender);
  const reactionsList = ['fire', 'laugh', 'heart'];
  const emojis = { fire: '🔥', laugh: '😂', heart: '❤️' };
  
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState(post.comments || [
    { id: 1, sender: 'AnonMaba', text: 'Wkwk bener banget kating!' },
    { id: 2, sender: 'KatingAlmetKuning', text: 'Makanya kalau kuliah pagi jangan begadang dek' }
  ]);

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    
    const newComment = {
      id: Date.now(),
      sender: 'Saya',
      text: commentText.trim()
    };
    
    setComments([...comments, newComment]);
    setCommentText('');
  };

  return (
    <article className="neo-card menfess-card" style={{ padding: '20px', marginBottom: '16px' }}>
      <div className="menfess-header">
        <div className="menfess-meta">
          <div className="avatar-abstract" style={{ backgroundColor: 'var(--accent-sky)' }}>
            {avatar}
          </div>
          <div>
            <div className="menfess-sender">
              {post.sender} 
              <span style={{ fontWeight: 400, color: 'rgba(26,26,26,0.6)', marginLeft: '6px' }}>
                untuk {post.recipient}
              </span>
            </div>
            <div className="menfess-time">{timeAgo(post.timestamp)} yang lalu</div>
          </div>
        </div>
        <span className="neo-badge" style={{ backgroundColor: 'var(--bg-cream)' }}>
          #{post.tag}
        </span>
      </div>

      <p className="menfess-body" style={{ fontSize: '1rem', fontWeight: 600, marginTop: '8px', marginBottom: '16px' }}>
        {post.content}
      </p>

      {/* Footer / Actions */}
      <div className="menfess-reactions" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderTop: 'var(--border-stroke)',
        paddingTop: '12px'
      }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          {reactionsList.map(type => {
            const reacted = userReactions[`post-${post.id}-${type}`] ? 'reacted' : '';
            return (
              <button 
                key={type} 
                className={`reaction-btn ${reacted}`}
                onClick={() => onReaction(post.id, type)}
                style={{ padding: '4px 10px', fontSize: '0.85rem' }}
              >
                {emojis[type]} <span>{post.reactions[type] || 0}</span>
              </button>
            );
          })}
        </div>

        <button 
          onClick={() => setShowComments(!showComments)}
          className="reaction-btn"
          style={{ padding: '4px 10px', fontSize: '0.85rem' }}
        >
          💬 <span>{comments.length} Komentar</span>
        </button>
      </div>

      {/* Expanded Comments Drawer */}
      {showComments && (
        <div style={{
          marginTop: '16px',
          paddingTop: '16px',
          borderTop: '2px dashed var(--color-black)'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '12px' }}>
            {comments.map(c => (
              <div key={c.id} style={{
                background: 'var(--bg-dark-white)',
                border: 'var(--border-stroke)',
                borderRadius: 'var(--border-radius-sm)',
                padding: '8px 12px',
                fontSize: '0.85rem'
              }}>
                <span style={{ fontWeight: 800, color: 'var(--accent-blue)' }}>{c.sender}: </span>
                <span style={{ fontWeight: 600 }}>{c.text}</span>
              </div>
            ))}
          </div>

          <form onSubmit={handleAddComment} style={{ display: 'flex', gap: '8px' }}>
            <input 
              type="text" 
              className="form-control" 
              placeholder="Tulis balasan..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              style={{ padding: '8px 12px', fontSize: '0.85rem', flexGrow: 1 }}
              required
            />
            <button type="submit" className="neo-btn small blue" style={{ padding: '8px 12px', margin: '0' }}>
              Kirim
            </button>
          </form>
        </div>
      )}
    </article>
  );
}
