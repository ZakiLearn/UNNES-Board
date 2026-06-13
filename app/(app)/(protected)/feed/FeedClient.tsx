'use client';

import React, { useState, useTransition } from "react";
import { 
  togglePostReaction, 
  addPostComment, 
  createMenfessPost, 
  submitPollVote 
} from "./actions";
import { MessageSquare, Heart, Flame, Smile, Send, Loader2 } from "lucide-react";

interface CommentAuthor {
  aliasName: string | null;
}

interface Comment {
  id: number;
  content: string;
  createdAt: Date;
  author: CommentAuthor;
}

interface PostAuthor {
  aliasName: string | null;
}

interface PostTag {
  id: number;
  name: string;
}

interface PostReaction {
  id: number;
  emoji: string;
  profileId: string;
}

interface Post {
  id: number;
  content: string;
  createdAt: Date;
  author: PostAuthor;
  tag: PostTag;
  comments: Comment[];
  reactions: PostReaction[];
}

interface PollOption {
  id: number;
  text: string;
  votes: { profileId: string }[];
}

interface Poll {
  id: number;
  question: string;
  options: PollOption[];
}

interface FeedClientProps {
  initialPosts: Post[];
  initialPoll: Poll | null;
  currentUserId: string;
  tagsList: string[];
}

const dummyEvents = [
  {
    id: 1,
    title: "UNNES Music Festival 2026",
    date: "Kamis, 25 Juni 2026 | 15.00 WIB",
    location: "Lapangan Rektorat UNNES",
    description: "Festival musik tahunan terbesar mahasiswa dengan penampilan bintang tamu spesial, bazaar kuliner Sekaran, dan pameran seni mahasiswa.",
    badge: "Konser Musik 🎸",
    colorClass: "bg-sky",
    image: "/events/music.png"
  },
  {
    id: 2,
    title: "Seminar Nasional: Karir di Era Gen-AI",
    date: "Senin, 15 Juni 2026 | 09.00 WIB",
    location: "Auditorium Universitas",
    description: "Kupas tuntas peluang kerja dan skill krusial yang dicari industri teknologi masa kini bersama para praktisi kecerdasan buatan terkemuka.",
    badge: "Seminar 💡",
    colorClass: "bg-mint",
    image: "/events/ai.png"
  },
  {
    id: 3,
    title: "Malam Keakraban & Menfess Meetup",
    date: "Sabtu, 20 Juni 2026 | 18.30 WIB",
    location: "Gedung Serbaguna Sekaran",
    description: "Waktunya saling kenal antar angkatan secara santai! Ada live music acoustic, sharing session, dan stand up comedy mahasiswa.",
    badge: "Sosial 🤝",
    colorClass: "bg-orange",
    image: "/events/meetup.png"
  }
];

export default function FeedClient({
  initialPosts,
  initialPoll,
  currentUserId,
  tagsList
}: FeedClientProps) {
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [showComposer, setShowComposer] = useState(false);
  const [expandedComments, setExpandedComments] = useState<Record<number, boolean>>({});
  const [newComments, setNewComments] = useState<Record<number, string>>({});
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  // Events slider state
  const [activeEventIndex, setActiveEventIndex] = useState(0);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setActiveEventIndex((prev) => (prev + 1) % dummyEvents.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const [isPending, startTransition] = useTransition();
  const [submittingCommentId, setSubmittingCommentId] = useState<number | null>(null);
  const [votingOptionId, setVotingOptionId] = useState<number | null>(null);

  // Form states for composer
  const [menfessContent, setMenfessContent] = useState("");
  const [menfessTag, setMenfessTag] = useState("Curhat");

  // Filtering posts
  const filteredPosts = activeCategory === "Semua"
    ? initialPosts
    : initialPosts.filter(post => post.tag.name.toLowerCase() === activeCategory.toLowerCase());

  // Handle Menfess creation
  const handleCreateMenfess = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!menfessContent.trim()) return;

    const formData = new FormData();
    formData.append("content", menfessContent);
    formData.append("tag", menfessTag);

    startTransition(async () => {
      setErrorMsg(null);
      const res = await createMenfessPost(null, formData);
      if (res?.error) {
        setErrorMsg(res.error);
      } else {
        setMenfessContent("");
        setShowComposer(false);
      }
    });
  };

  // Handle reactions (🔥, 😂, ❤️)
  const handleReaction = (postId: number, emoji: string) => {
    startTransition(async () => {
      await togglePostReaction(postId, emoji);
    });
  };

  // Handle comment submit
  const handleAddComment = async (postId: number) => {
    const content = newComments[postId];
    if (!content || !content.trim()) return;

    setSubmittingCommentId(postId);
    const res = await addPostComment(postId, content);
    setSubmittingCommentId(null);

    if (res?.error) {
      alert(res.error);
    } else {
      setNewComments(prev => ({ ...prev, [postId]: "" }));
    }
  };

  // Handle poll voting
  const handleVote = async (optionId: number) => {
    setVotingOptionId(optionId);
    await submitPollVote(optionId);
    setVotingOptionId(null);
  };

  // Format date safely
  const formatDate = (dateInput: Date) => {
    const d = new Date(dateInput);
    return d.toLocaleString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
      day: "numeric",
      month: "short"
    });
  };

  // Calculate poll stats
  const totalVotes = initialPoll
    ? initialPoll.options.reduce((sum, opt) => sum + opt.votes.length, 0)
    : 0;

  const hasVotedPoll = initialPoll
    ? initialPoll.options.some(opt => opt.votes.some(v => v.profileId === currentUserId))
    : false;

  const userVotedOptionId = initialPoll
    ? initialPoll.options.find(opt => opt.votes.some(v => v.profileId === currentUserId))?.id
    : null;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      
      {/* Event Carousel Widget */}
      <div className="neo-card bg-white !p-0 relative overflow-hidden flex flex-col md:flex-row border-2 border-neo-black">
        {/* Banner Image / Poster */}
        <div className="w-full md:w-1/4 relative border-b-2 md:border-b-0 md:border-r-2 border-neo-black min-h-[160px] md:min-h-0 bg-neo-black flex items-center justify-center">
          <img 
            src={dummyEvents[activeEventIndex].image} 
            alt={dummyEvents[activeEventIndex].title}
            className="w-full h-full object-cover select-none"
          />
          <div className="absolute top-3 left-3">
            <span className="neo-badge !bg-white text-[9px] uppercase tracking-wide">
              Event 📅
            </span>
          </div>
          <div className="absolute bottom-3 left-3">
            <span className={`neo-badge text-[10px] ${dummyEvents[activeEventIndex].colorClass}`}>
              {dummyEvents[activeEventIndex].badge}
            </span>
          </div>
        </div>

        {/* Content detail column */}
        <div className="w-full md:w-3/4 p-5 flex flex-col justify-between bg-white gap-4">
          <div className="space-y-2">
            <h4 className="text-xl md:text-2xl font-heading font-black uppercase text-neo-black leading-tight">
              {dummyEvents[activeEventIndex].title}
            </h4>
            
            <div className="flex flex-wrap gap-2 text-[10px] font-heading font-black text-neo-black/60 pt-1">
              <span className="bg-cream px-2 py-0.5 border-2 border-neo-black rounded-md">
                📅 {dummyEvents[activeEventIndex].date}
              </span>
              <span className="bg-cream px-2 py-0.5 border-2 border-neo-black rounded-md">
                📍 {dummyEvents[activeEventIndex].location}
              </span>
            </div>
            
            <p className="font-body font-bold text-xs md:text-sm text-neo-black/70 leading-relaxed pt-1">
              {dummyEvents[activeEventIndex].description}
            </p>
          </div>

          <div className="flex items-center justify-between pt-3 border-t-2 border-neo-black/10">
            <button className="neo-btn small sky hover:bg-sky/90 transition-all">
              Detail Acara ➜
            </button>
            
            {/* Navigation controls (prev, dots, next) */}
            <div className="flex items-center gap-3">
              {/* Prev Button */}
              <button 
                onClick={() => setActiveEventIndex((prev) => (prev - 1 + dummyEvents.length) % dummyEvents.length)}
                className="w-7 h-7 flex items-center justify-center border-2 border-neo-black bg-white rounded-md hover:bg-dark-white shadow-neo-sm font-bold text-xs select-none active:translate-y-0.5 cursor-pointer"
                title="Sebelumnya"
              >
                ◀
              </button>
              
              {/* Dots Indicators */}
              <div className="flex gap-1.2">
                {dummyEvents.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveEventIndex(idx)}
                    className={`w-3 h-3 rounded-full border-2 border-neo-black transition-all cursor-pointer ${
                      idx === activeEventIndex ? 'bg-blue scale-110' : 'bg-white hover:bg-dark-white'
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>

              {/* Next Button */}
              <button 
                onClick={() => setActiveEventIndex((prev) => (prev + 1) % dummyEvents.length)}
                className="w-7 h-7 flex items-center justify-center border-2 border-neo-black bg-white rounded-md hover:bg-dark-white shadow-neo-sm font-bold text-xs select-none active:translate-y-0.5 cursor-pointer"
                title="Berikutnya"
              >
                ▶
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
      {/* Main Feed Column */}
      <div className="lg:col-span-2 space-y-6">
        
        {/* Composer Toggle Card */}
        <div className="neo-card bg-white p-5 flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-4 justify-between w-full">
            <span className="font-heading font-black text-neo-black text-sm text-center sm:text-left">
              Punya uneg-uneg hari ini? Kirim menfess secara anonim! 💬
            </span>
            <button 
              onClick={() => setShowComposer(!showComposer)} 
              className={`neo-btn w-full sm:w-auto ${showComposer ? 'bg-orange text-neo-black' : 'blue'}`}
            >
              {showComposer ? 'Tutup Composer' : 'Kirim Menfess'}
            </button>
          </div>

          {/* Composer Form */}
          {showComposer && (
            <form onSubmit={handleCreateMenfess} className="mt-4 border-t-2 border-neo-black/10 pt-4 space-y-4">
              {errorMsg && (
                <div className="p-3 border-2 border-neo-black bg-orange rounded-md text-xs font-bold text-neo-black">
                  {errorMsg}
                </div>
              )}
              
              <div className="form-group">
                <label className="form-label" htmlFor="content">Uneg-uneg Anda (maksimal 500 karakter)</label>
                <textarea
                  id="content"
                  rows={4}
                  className="form-control w-full min-h-[100px] resize-y p-3 border-2 border-neo-black rounded-md bg-white font-body"
                  placeholder="Ketik menfess kamu di sini..."
                  value={menfessContent}
                  onChange={(e) => setMenfessContent(e.target.value)}
                  maxLength={500}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="form-group mb-0">
                  <label className="form-label" htmlFor="tag">Pilih Hashtag/Kategori</label>
                  <select
                    id="tag"
                    className="form-control w-full p-2 border-2 border-neo-black rounded-md bg-white font-heading font-black"
                    value={menfessTag}
                    onChange={(e) => setMenfessTag(e.target.value)}
                  >
                    {tagsList.map((tag) => (
                      <option key={tag} value={tag}>#{tag}</option>
                    ))}
                  </select>
                </div>
                <div className="flex items-end">
                  <button
                    type="submit"
                    disabled={isPending || !menfessContent.trim()}
                    className="neo-btn mint w-full justify-center gap-2"
                  >
                    {isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Mengirim...</span>
                      </>
                    ) : (
                      <span>Kirim Menfess Sekarang 🚀</span>
                    )}
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>

        {/* Filter Navigation */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="font-heading font-black text-2xl uppercase tracking-tight text-neo-black">
            Menfess Kampus
          </h2>
          <div className="flex flex-wrap gap-1.5">
            {["Semua", ...tagsList].map((cat) => {
              const isActive = activeCategory.toLowerCase() === cat.toLowerCase();
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1 text-xs font-heading font-black border-2 border-neo-black rounded-md shadow-neo-sm transition-all duration-100 ${
                    isActive
                      ? "bg-blue text-white translate-x-[1px] translate-y-[1px] shadow-none"
                      : "bg-white text-neo-black hover:bg-dark-white hover:translate-x-[0.5px] hover:translate-y-[0.5px]"
                  }`}
                >
                  {cat === "Semua" ? "Semua" : `#${cat}`}
                </button>
              );
            })}
          </div>
        </div>

        {/* Menfess Posts List */}
        <div className="space-y-4">
          {filteredPosts.length === 0 ? (
            <div className="neo-card bg-white text-center py-10">
              <p className="font-heading font-black text-neo-black/60 text-lg">Belum ada menfess untuk kategori ini. Yuk jadi yang pertama bercerita!</p>
            </div>
          ) : (
            filteredPosts.map((post) => {
              // Extract count of specific emojis
              const fireCount = post.reactions.filter(r => r.emoji === "🔥").length;
              const laughCount = post.reactions.filter(r => r.emoji === "😂").length;
              const heartCount = post.reactions.filter(r => r.emoji === "❤️").length;

              // Check if current user reacted
              const userReactions = post.reactions.filter(r => r.profileId === currentUserId);
              const hasReactedFire = userReactions.some(r => r.emoji === "🔥");
              const hasReactedLaugh = userReactions.some(r => r.emoji === "😂");
              const hasReactedHeart = userReactions.some(r => r.emoji === "❤️");

              const isExpanded = !!expandedComments[post.id];

              return (
                <div key={post.id} className="neo-card bg-white space-y-4">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-sky border-2 border-neo-black rounded-full flex items-center justify-center font-heading font-black text-neo-black text-sm">
                        {(post.author.aliasName || "Anonim").charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-wrap items-center gap-1.5 flex-row">
                          <span className="font-heading font-black text-sm text-blue">
                            {post.author.aliasName || "Anonim"}
                          </span>
                          <span className="text-[10px] font-bold text-neo-black/50">
                            kepada Semua Mahasiswa
                          </span>
                        </div>
                        <span className="text-[10px] font-bold text-neo-black/40">
                          {formatDate(post.createdAt)}
                        </span>
                      </div>
                    </div>
                    <span className="neo-badge orange text-[10px] py-0.5 px-2">
                      #{post.tag.name}
                    </span>
                  </div>

                  {/* Content */}
                  <p className="font-heading font-bold text-sm text-neo-black/85 leading-relaxed whitespace-pre-wrap">
                    {post.content}
                  </p>

                  {/* Footer Actions */}
                  <div className="flex items-center justify-between pt-2 border-t border-neo-black/10">
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleReaction(post.id, "🔥")}
                        className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-heading font-black border-2 border-neo-black rounded-md shadow-neo-sm active:translate-y-0.5 transition-all ${
                          hasReactedFire ? 'bg-orange text-neo-black' : 'bg-white hover:bg-dark-white'
                        }`}
                      >
                        <Flame className="h-3 w-3" />
                        <span>{fireCount}</span>
                      </button>
                      <button 
                        onClick={() => handleReaction(post.id, "😂")}
                        className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-heading font-black border-2 border-neo-black rounded-md shadow-neo-sm active:translate-y-0.5 transition-all ${
                          hasReactedLaugh ? 'bg-sky text-neo-black' : 'bg-white hover:bg-dark-white'
                        }`}
                      >
                        <Smile className="h-3 w-3" />
                        <span>{laughCount}</span>
                      </button>
                      <button 
                        onClick={() => handleReaction(post.id, "❤️")}
                        className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-heading font-black border-2 border-neo-black rounded-md shadow-neo-sm active:translate-y-0.5 transition-all ${
                          hasReactedHeart ? 'bg-mint text-neo-black' : 'bg-white hover:bg-dark-white'
                        }`}
                      >
                        <Heart className="h-3 w-3" />
                        <span>{heartCount}</span>
                      </button>
                    </div>
                    
                    <button 
                      onClick={() => setExpandedComments(prev => ({ ...prev, [post.id]: !isExpanded }))}
                      className="flex items-center gap-1 px-3 py-1 text-xs font-heading font-black border-2 border-neo-black rounded-md shadow-neo-sm bg-white hover:bg-dark-white"
                    >
                      <MessageSquare className="h-3.5 w-3.5" />
                      <span>{post.comments.length} Komentar</span>
                    </button>
                  </div>

                  {/* Comment Section (Expanded) */}
                  {isExpanded && (
                    <div className="mt-4 border-t-2 border-neo-black/10 pt-4 space-y-4 bg-dark-white/50 p-3 rounded-lg border border-neo-black/5">
                      
                      {/* Comments List */}
                      {post.comments.length > 0 && (
                        <div className="space-y-3 max-h-[250px] overflow-y-auto pr-1">
                          {post.comments.map(comment => (
                            <div key={comment.id} className="bg-white border border-neo-black/10 p-2.5 rounded-md text-xs font-body shadow-sm">
                              <div className="flex justify-between items-center mb-1">
                                <span className="font-heading font-black text-blue">
                                  {comment.author.aliasName || "Anonim"}
                                </span>
                                <span className="text-[9px] font-bold text-neo-black/40">
                                  {formatDate(comment.createdAt)}
                                </span>
                              </div>
                              <p className="text-neo-black/85 font-medium">{comment.content}</p>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Add Comment Input */}
                      <div className="flex gap-2">
                        <input
                          type="text"
                          className="flex-grow p-2 text-xs border-2 border-neo-black rounded-md bg-white font-body"
                          placeholder="Tulis tanggapan atau komentar..."
                          value={newComments[post.id] || ""}
                          onChange={(e) => setNewComments(prev => ({ ...prev, [post.id]: e.target.value }))}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") handleAddComment(post.id);
                          }}
                        />
                        <button
                          onClick={() => handleAddComment(post.id)}
                          disabled={submittingCommentId === post.id || !(newComments[post.id] || "").trim()}
                          className="neo-btn mint small !p-2 !shadow-sm flex items-center justify-center shrink-0"
                        >
                          {submittingCommentId === post.id ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <Send className="h-3.5 w-3.5" />
                          )}
                        </button>
                      </div>
                    </div>
                  )}

                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Right Column - Widgets */}
      <div className="space-y-6">
        {/* Tes Ombak Poll Card */}
        {initialPoll && (
          <div className="neo-card bg-white space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-heading font-black text-lg text-neo-black flex items-center gap-1.5">
                <span>🌊</span> Tes Ombak
              </h3>
              <span className="neo-badge orange py-0.5 px-2 text-[10px]">
                AKTIF
              </span>
            </div>

            <p className="font-heading font-bold text-sm text-neo-black leading-relaxed">
              {initialPoll.question}
            </p>

            <div className="space-y-2.5">
              {initialPoll.options.map((opt) => {
                const optVotes = opt.votes.length;
                const percentage = totalVotes > 0 ? Math.round((optVotes / totalVotes) * 100) : 0;
                const isSelected = opt.id === userVotedOptionId;

                if (hasVotedPoll) {
                  return (
                    <div 
                      key={opt.id} 
                      onClick={() => handleVote(opt.id)}
                      className={`relative border-2 border-neo-black rounded-md p-3 overflow-hidden cursor-pointer transition-all duration-100 ${
                        isSelected ? 'ring-2 ring-blue ring-offset-2' : ''
                      }`}
                    >
                      <div 
                        className={`absolute top-0 left-0 bottom-0 z-0 transition-all duration-300 ${
                          isSelected ? 'bg-[#CBE4FF]' : 'bg-[#FFE5B5]'
                        }`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                      <div className="relative z-10 flex justify-between font-heading font-black text-xs">
                        <span>{opt.text} {isSelected && "✅"}</span>
                        <span className="text-blue">{percentage}%</span>
                      </div>
                    </div>
                  );
                } else {
                  return (
                    <button
                      key={opt.id}
                      onClick={() => handleVote(opt.id)}
                      disabled={votingOptionId === opt.id}
                      className="w-full text-left font-heading font-black text-xs border-2 border-neo-black rounded-md p-3 bg-white hover:bg-dark-white transition-all shadow-neo-sm active:translate-y-0.5 flex justify-between items-center"
                    >
                      <span>{opt.text}</span>
                      {votingOptionId === opt.id && <Loader2 className="h-3 w-3 animate-spin text-neo-black" />}
                    </button>
                  );
                }
              })}
            </div>

            <p className="text-[10px] font-bold text-neo-black/50 text-center">
              Total Suara: {totalVotes} Responden
            </p>
          </div>
        )}
      </div>
    </div>
  </div>
  );
}
