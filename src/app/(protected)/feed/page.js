'use client';
import { useState, useEffect } from 'react';
import UpcomingEventBanner from '@/components/features/feed/UpcomingEventBanner';
import ThreadList from '@/components/features/feed/ThreadList';
import PollWidget from '@/components/features/poll/PollWidget';
import MenfessForm from '@/components/features/menfess/MenfessForm';

const defaultMenfess = [
  {
    id: 1,
    sender: "MabaSambatTI",
    recipient: "Dosen Pengampu Algoritma",
    content: "Pak, mohon maaf tugas praktikum minggu ini bisa diundur ga ya deadline-nya? Bentrok sama makul Matematika Diskrit nih pak 😭",
    tag: "Akademik",
    timestamp: new Date(Date.now() - 15 * 60000).toISOString(),
    reactions: { fire: 12, laugh: 3, heart: 8 }
  },
  {
    id: 2,
    sender: "SecretAdmirer",
    recipient: "Kak tingkat jaket kuning yang duduk di perpus lt 2 kemarin siang",
    content: "Kamu manis banget pas lagi fokus baca buku. Semoga postingan ini lewat di fyp kamu ya! Salam dari maba FKIP.",
    tag: "Asmara",
    timestamp: new Date(Date.now() - 45 * 60000).toISOString(),
    reactions: { fire: 2, laugh: 0, heart: 24 }
  },
  {
    id: 3,
    sender: "KenyangTerus",
    recipient: "Semua mahasiswa kelaparan",
    content: "Guys, rekomendasi kantin di deket FIP yang porsinya kuli tapi harganya ramah dompet dong! Dompet akhir bulan kritis banget nih.",
    tag: "Kantin",
    timestamp: new Date(Date.now() - 120 * 60000).toISOString(),
    reactions: { fire: 8, laugh: 15, heart: 5 }
  },
  {
    id: 4,
    sender: "InfoUNNES",
    recipient: "Seluruh Mahasiswa UNNES",
    content: "Reminder! Pembayaran UKT semester ganjil ditutup tanggal 20 Juni. Jangan sampai kelewat nanti malah cuti otomatis, nyesek guys!",
    tag: "Info",
    timestamp: new Date(Date.now() - 240 * 60000).toISOString(),
    reactions: { fire: 34, laugh: 2, heart: 18 }
  }
];

const defaultPoll = {
  question: "Enakan kuliah pagi (07:00) atau kuliah sore (15:00) sih sebenernya?",
  options: [
    { id: 1, text: "Kuliah Pagi (Otak masih fresh, siang bisa turu)", votes: 148 },
    { id: 2, text: "Kuliah Sore (Bisa bangun siang, no macet-macet club)", votes: 92 },
    { id: 3, text: "Nggak kuliah sekalian (Kaum rebahan sejati)", votes: 56 }
  ]
};

export default function FeedPage() {
  const [menfessList, setMenfessList] = useState([]);
  const [pollData, setPollData] = useState({ question: '', options: [] });
  const [votedPollId, setVotedPollId] = useState(null);
  const [userReactions, setUserReactions] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const savedMenfess = localStorage.getItem('menfess_list');
    const savedPoll = localStorage.getItem('poll_data');
    const savedVotedId = localStorage.getItem('voted_poll_id');
    const savedReactions = localStorage.getItem('user_reactions');

    setMenfessList(savedMenfess ? JSON.parse(savedMenfess) : defaultMenfess);
    setPollData(savedPoll ? JSON.parse(savedPoll) : defaultPoll);
    setVotedPollId(savedVotedId ? savedVotedId : null);
    setUserReactions(savedReactions ? JSON.parse(savedReactions) : {});
  }, []);

  const showToast = (message) => {
    const newToast = { id: Date.now(), message };
    setToasts(prev => [...prev, newToast]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== newToast.id));
    }, 3000);
  };

  const handleReaction = (postId, type) => {
    const reactionKey = `post-${postId}-${type}`;
    const updatedList = menfessList.map(post => {
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

    setMenfessList(updatedList);
    setUserReactions(nextUserReactions);
    localStorage.setItem('menfess_list', JSON.stringify(updatedList));
    localStorage.setItem('user_reactions', JSON.stringify(nextUserReactions));
  };

  const handleVote = (optionId) => {
    if (votedPollId) return;

    const nextOptions = pollData.options.map(opt => {
      if (opt.id === optionId) {
        return { ...opt, votes: opt.votes + 1 };
      }
      return opt;
    });

    const nextPollData = { ...pollData, options: nextOptions };
    setPollData(nextPollData);
    setVotedPollId(optionId);
    
    localStorage.setItem('poll_data', JSON.stringify(nextPollData));
    localStorage.setItem('voted_poll_id', optionId);
    showToast("Vote Anda berhasil terekam! 🌊");
  };

  const handleCreateMenfess = ({ sender, recipient, tag, content, wasFiltered }) => {
    const newPost = {
      id: Date.now(),
      sender,
      recipient,
      content,
      tag,
      timestamp: new Date().toISOString(),
      reactions: { fire: 0, laugh: 0, heart: 0 }
    };

    const nextList = [newPost, ...menfessList];
    setMenfessList(nextList);
    localStorage.setItem('menfess_list', JSON.stringify(nextList));
    setIsModalOpen(false);

    if (wasFiltered) {
      showToast("Menfess dikirim! (Pesan disensor otomatis demi kesopanan) 😉");
    } else {
      showToast("Menfess berhasil diterbangkan! 🚀");
    }
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '30px' }} className="feed-layout-grid">
      
      {/* Center Feed Column */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <UpcomingEventBanner />
        
        {/* Quick Post card */}
        <div className="neo-card" style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 0 }}>
          <h3 style={{ fontSize: '1.1rem', margin: 0 }}>Punya uneg-uneg hari ini? 📨</h3>
          <button className="neo-btn blue" onClick={() => setIsModalOpen(true)} style={{ margin: 0 }}>
            Kirim Menfess
          </button>
        </div>

        <ThreadList 
          posts={menfessList}
          userReactions={userReactions}
          onReaction={handleReaction}
        />
      </div>

      {/* Right Column (Widgets) */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }} className="feed-right-column">
        <PollWidget 
          pollData={pollData}
          votedOptionId={votedPollId}
          onVote={handleVote}
        />
      </div>

      <MenfessForm 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSubmit={handleCreateMenfess} 
      />

      {/* Toast Notification */}
      <div className="toast-container">
        {toasts.map(toast => (
          <div key={toast.id} className="toast">
            <span>✨</span> <span>{toast.message}</span>
          </div>
        ))}
      </div>

      <style jsx>{`
        @media (max-width: 1024px) {
          .feed-layout-grid {
            grid-template-columns: 1fr !important;
          }
          .feed-right-column {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
