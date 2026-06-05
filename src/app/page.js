'use client';
import { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import MenfessCard from '@/components/features/menfess/MenfessCard';
import MenfessForm from '@/components/features/menfess/MenfessForm';
import PollWidget from '@/components/features/poll/PollWidget';
import EventRadar from '@/components/features/event/EventRadar';


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

const campusEvents = [
  {
    title: "Webinar Kepemimpinan Nasional 2026",
    organizer: "BEM KM UNNES",
    date: "12 Juni 2026",
    badge: "Webinar",
    badgeColor: "var(--accent-orange)",
    image: "/assets/webinar.png",
    link: "https://bem.unnes.ac.id/webinar-leadership"
  },
  {
    title: "Hackathon UNNES 2026 - Digital Innovation",
    organizer: "HIMA Teknik Informatika",
    date: "18-20 Juni 2026",
    badge: "HIMA",
    badgeColor: "var(--accent-blue)",
    image: "/assets/hackathon.png",
    link: "https://hackathon.unnes.ac.id"
  },
  {
    title: "Donor Darah Peduli Sesama",
    organizer: "KSR PMI Unit UNNES",
    date: "25 Juni 2026",
    badge: "Sosial",
    badgeColor: "var(--accent-sky)",
    image: "/assets/donor.png",
    link: "https://ksrpmi.unnes.ac.id/donor"
  }
];

export default function Home() {
  const [menfessList, setMenfessList] = useState([]);
  const [pollData, setPollData] = useState({ question: '', options: [] });
  const [votedPollId, setVotedPollId] = useState(null);
  const [userReactions, setUserReactions] = useState({});
  
  const [onlineCount, setOnlineCount] = useState(142);
  const [currentFilter, setCurrentFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [isClient, setIsClient] = useState(false);

  // Avoid hydration mismatch by waiting for client mount
  useEffect(() => {
    setIsClient(true);
    const savedMenfess = localStorage.getItem('menfess_list');
    const savedPoll = localStorage.getItem('poll_data');
    const savedVotedId = localStorage.getItem('voted_poll_id');
    const savedReactions = localStorage.getItem('user_reactions');

    setMenfessList(savedMenfess ? JSON.parse(savedMenfess) : defaultMenfess);
    setPollData(savedPoll ? JSON.parse(savedPoll) : defaultPoll);
    setVotedPollId(savedVotedId ? savedVotedId : null);
    setUserReactions(savedReactions ? JSON.parse(savedReactions) : {});
  }, []);

  // Simulating live users
  useEffect(() => {
    const timer = setInterval(() => {
      setOnlineCount(prev => {
        const change = Math.floor(Math.random() * 5) - 2;
        return Math.max(100, Math.min(250, prev + change));
      });
    }, 4000);
    return () => clearInterval(timer);
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

  const filteredFeed = currentFilter === 'all'
    ? menfessList
    : menfessList.filter(post => post.tag === currentFilter);

  // Render dummy component if server rendering to match hydrate
  if (!isClient) {
    return <div style={{ background: 'var(--bg-cream)', minHeight: '100vh' }}></div>;
  }

  return (
    <>
      <Header onlineCount={onlineCount} onOpenModal={() => setIsModalOpen(true)} />
      
      <div className="app-container">
        
        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-text">
            <div className="neo-badge" style={{ backgroundColor: 'var(--accent-orange)', marginBottom: '12px' }}>#SocialFirst</div>
            <h1>Tongkrongan Digital Mahasiswa</h1>
            <p>Bebas curhat, tes ombak (polling), dan intip event kece di sekitar Universitas Negeri Semarang. 100% anonim, 100% asyik.</p>
            <button 
              className="neo-btn blue" 
              onClick={() => document.getElementById('feed-section-anchor').scrollIntoView({ behavior: 'smooth' })}
            >
              <span>Mulai Nongkrong</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </button>
          </div>
          <div className="hero-graphics">
            <div className="neo-card floating-sticky">
              <div className="menfess-header">
                <span className="neo-badge" style={{ backgroundColor: 'var(--bg-white)' }}>#Curhat</span>
                <span className="menfess-time">Just Now</span>
              </div>
              <p style={{ fontWeight: 700, fontSize: '0.95rem' }}>"Info loker magang buat anak semester 6 dong guys, butuh buat konversi SKS nih 😭"</p>
            </div>
            <div className="neo-card floating-sticky-alt">
              <div className="menfess-header">
                <span className="neo-badge" style={{ backgroundColor: 'var(--accent-orange)' }}>#Kantin</span>
                <span className="menfess-time">2m ago</span>
              </div>
              <p style={{ fontWeight: 700, fontSize: '0.95rem' }}>"Geprek Bu Rum tetep juara bertahan nomor 1 se-UNNES!"</p>
            </div>
          </div>
        </section>

        {/* Main Dashboard Grid */}
        <main className="dashboard-grid">
          
          {/* Feed Section (Left) */}
          <section className="feed-section" id="feed-section-anchor">
            <div className="feed-header">
              <h2>Live Campus Feed</h2>
              
              {/* Category Filter Tags */}
              <div className="filter-tags">
                {['all', 'Akademik', 'Curhat', 'Info', 'Asmara', 'Kantin'].map(cat => (
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

            {/* Menfess List */}
            <div className="menfess-list">
              {filteredFeed.length === 0 ? (
                <div className="neo-card" style={{ textAlign: 'center', padding: '40px 20px' }}>
                  <span style={{ fontSize: '3rem' }}>📭</span>
                  <h3 style={{ marginTop: '12px' }}>Belum ada Menfess di kategori ini</h3>
                  <p style={{ color: 'rgba(26,26,26,0.6)', marginTop: '8px' }}>Jadilah orang pertama yang mengirim menfess di kategori #{currentFilter}!</p>
                </div>
              ) : (
                filteredFeed.map(post => (
                  <MenfessCard 
                    key={post.id} 
                    post={post} 
                    userReactions={userReactions} 
                    onReaction={handleReaction} 
                  />
                ))
              )}
            </div>
          </section>

          {/* Interactive Widget Panel (Right) */}
          <aside className="widget-panel">
            <PollWidget 
              pollData={pollData} 
              votedOptionId={votedPollId} 
              onVote={handleVote} 
            />

            <EventRadar events={campusEvents} />
          </aside>

        </main>
      </div>

      {/* Modal Dialog Form */}
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

      {/* Mobile Bottom Navigation Bar */}
      <nav className="mobile-navbar">
        <div className="mobile-nav-links">
          <a href="#feed-section-anchor" className="mobile-nav-link">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
            <span>Feed</span>
          </a>
          <a href="#polling-widget" className="mobile-nav-link">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
            <span>Tes Ombak</span>
          </a>
          <a href="#" className="mobile-nav-link" style={{ color: 'var(--accent-orange)', fontWeight: '800' }} onClick={(e) => { e.preventDefault(); setIsModalOpen(true); }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"></path></svg>
            <span>Kirim</span>
          </a>
          <a href="#radar-section-anchor" class="mobile-nav-link">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
            <span>Radar</span>
          </a>
        </div>
      </nav>
    </>
  );
}
