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
    <article className="neo-card !p-4 !mb-3">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full border-2 border-neo-black flex items-center justify-center text-base font-bold bg-sky flex-shrink-0">
            {avatar}
          </div>
          <div>
            <div className="font-extrabold text-xs text-neo-black">
              {post.sender} 
              <span className="font-normal text-neo-black/60 ml-1.5 text-[10px]">
                untuk {post.recipient}
              </span>
            </div>
            <div className="text-[9px] text-neo-black/50 font-semibold">{timeAgo(post.timestamp)} yang lalu</div>
          </div>
        </div>
        <span className="neo-badge !bg-cream">
          #{post.tag}
        </span>
      </div>

      <p className="text-sm font-semibold text-neo-black mt-1.5 mb-3 leading-relaxed">
        {post.content}
      </p>

      {/* Footer / Actions */}
      <div className="flex items-center justify-between border-t-2 border-neo-black pt-2.5">
        <div className="flex gap-1.5">
          {reactionsList.map(type => {
            const reacted = userReactions[`post-${post.id}-${type}`];
            return (
              <button 
                key={type} 
                className={`px-2 py-1 text-xs font-bold rounded-sm border-2 border-neo-black transition-all duration-150 flex items-center gap-1.5 ${
                  reacted 
                    ? 'bg-mint translate-x-[1px] translate-y-[1px] shadow-none' 
                    : 'bg-white shadow-[2px_2px_0px_0px_#1A1A1A] hover:translate-x-[0.5px] hover:translate-y-[0.5px] hover:shadow-[1px_1px_0px_0px_#1A1A1A]'
                }`}
                onClick={() => onReaction(post.id, type)}
              >
                <span>{emojis[type]}</span>
                <span>{post.reactions[type] || 0}</span>
              </button>
            );
          })}
        </div>

        <button 
          onClick={() => setShowComments(!showComments)}
          className="px-2 py-1 text-xs font-bold rounded-sm border-2 border-neo-black transition-all duration-150 flex items-center gap-1.5 bg-white shadow-[2px_2px_0px_0px_#1A1A1A] hover:translate-x-[0.5px] hover:translate-y-[0.5px] hover:shadow-[1px_1px_0px_0px_#1A1A1A]"
        >
          <span>💬</span> <span>{comments.length} Komentar</span>
        </button>
      </div>

      {/* Expanded Comments Drawer */}
      {showComments && (
        <div className="mt-4 pt-4 border-t-2 border-dashed border-neo-black">
          <div className="flex flex-col gap-2 mb-3">
            {comments.map(c => (
              <div key={c.id} className="bg-dark-white border-2 border-neo-black rounded-sm px-3 py-2 text-xs font-semibold">
                <span className="font-extrabold text-blue">{c.sender}: </span>
                <span>{c.text}</span>
              </div>
            ))}
          </div>

          <form onSubmit={handleAddComment} className="flex gap-2">
            <input 
              type="text" 
              className="form-control !p-2 !text-xs !shadow-neo-sm flex-grow" 
              placeholder="Tulis balasan..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              required
            />
            <button type="submit" className="neo-btn small blue !m-0 !py-2 !px-3 font-bold">
              Kirim
            </button>
          </form>
        </div>
      )}
    </article>
  );
}
