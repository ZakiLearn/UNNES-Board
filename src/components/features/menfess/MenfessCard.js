'use client';

// Emojis mapping
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
  if (minutes < 60) return `${minutes}m yang lalu`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}j yang lalu`;
  const days = Math.floor(hours / 24);
  return `${days}h yang lalu`;
}

export default function MenfessCard({ post, userReactions, onReaction }) {
  const avatar = getRandomAvatar(post.sender);
  const reactionsList = ['fire', 'laugh', 'heart'];
  const emojis = { fire: '🔥', laugh: '😂', heart: '❤️' };

  return (
    <article className="neo-card menfess-card">
      <div className="menfess-header">
        <div className="menfess-meta">
          <div className="avatar-abstract" style={{ backgroundColor: 'var(--accent-sky)' }}>{avatar}</div>
          <div>
            <div className="menfess-sender">{post.sender}</div>
            <div className="menfess-recipient">Untuk: <strong>{post.recipient}</strong></div>
          </div>
        </div>
        <span className="menfess-time">{timeAgo(post.timestamp)}</span>
      </div>
      
      <p className="menfess-body">{post.content}</p>
      
      <div style={{ marginBottom: '12px' }}>
        <span className="neo-badge" style={{ backgroundColor: 'var(--bg-cream)', fontSize: '0.7rem' }}>#{post.tag}</span>
      </div>
      
      <div className="menfess-reactions">
        {reactionsList.map(type => {
          const reacted = userReactions[`post-${post.id}-${type}`] ? 'reacted' : '';
          return (
            <button 
              key={type} 
              className={`reaction-btn ${reacted}`}
              onClick={() => onReaction(post.id, type)}
            >
              {emojis[type]} <span>{post.reactions[type] || 0}</span>
            </button>
          );
        })}
      </div>
    </article>
  );
}
