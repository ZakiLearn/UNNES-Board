import { db } from "@/lib/db";
import { poll as pollTable, pollOption as pollOptionTable } from "@/lib/db/schema";
import Link from "next/link";
import React from "react";

interface ReactionButtonProps {
  emoji: string;
  count: number;
}

function ReactionButton({ emoji, count }: ReactionButtonProps) {
  return (
    <button
      className="reaction-btn px-2.5 py-1 text-xs font-bold border-2 border-neo-black rounded-md shadow-neo-sm bg-white hover:translate-y-0 cursor-default"
      disabled
    >
      {emoji} {count}
    </button>
  );
}

interface Post {
  id: number;
  sender: string;
  recipient: string;
  content: string;
  tag: string;
  createdAt: Date;
  fire: number;
  laugh: number;
  heart: number;
}

interface PostCardProps {
  post: Post;
}

function PostCard({ post }: PostCardProps) {
  // Simple time ago calculation
  const timeStr = "1 jam yang lalu"; // Fallback or computed from post.createdAt
  
  return (
    <div className="neo-card !mb-0">
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full border-2 border-neo-black flex items-center justify-center text-lg font-bold bg-sky shrink-0">
            {post.sender.charAt(0)}
          </div>
          <div>
            <div className="font-extrabold text-sm text-neo-black">
              {post.sender} ➡️ {post.recipient}
            </div>
            <div className="text-[10px] text-neo-black/50 font-semibold">{timeStr}</div>
          </div>
        </div>
        <span className="neo-badge !bg-cream">#{post.tag}</span>
      </div>
      <p className="text-base font-semibold mb-4 text-neo-black">{post.content}</p>
      
      <div className="flex gap-3 border-t-2 border-neo-black pt-3">
        <ReactionButton emoji="🔥" count={post.fire} />
        <ReactionButton emoji="😂" count={post.laugh} />
        <ReactionButton emoji="❤️" count={post.heart} />
      </div>
    </div>
  );
}

export default async function Home() {
  // Fetch posts from database, fall back to mockup data if empty or fails
  let posts: Post[] = [];
  try {
    const dbPosts = await db.query.post.findMany({
      with: {
        author: {
          columns: {
            aliasName: true
          }
        },
        tag: {
          columns: {
            name: true
          }
        },
        reactions: true
      },
      orderBy: (p, { desc }) => [desc(p.createdAt)]
    });
    
    if (dbPosts.length > 0) {
      posts = dbPosts.map(post => {
        const fire = post.reactions.filter(r => r.emoji === "🔥").length;
        const laugh = post.reactions.filter(r => r.emoji === "😂").length;
        const heart = post.reactions.filter(r => r.emoji === "❤️").length;
        return {
          id: post.id,
          sender: post.author.aliasName || "Anonim",
          recipient: "Semua Anggota",
          content: post.content,
          tag: post.tag.name,
          createdAt: post.createdAt,
          fire,
          laugh,
          heart,
        };
      });
    } else {
      posts = [
        {
          id: 1,
          sender: "AnonKimia",
          recipient: "Semua Anggota Lab Kimia Dasar",
          content: "Siapa yang kemarin ninggalin jas lab basah di gantungan lemari belakang? Baunya asem banget tolong segera diambil sebelum didepak aslab 😭",
          tag: "Akademik",
          createdAt: new Date(),
          fire: 5,
          laugh: 12,
          heart: 2
        },
        {
          id: 2,
          sender: "PencintaKucingSekaran",
          recipient: "Pemberi Makan Kucing Kampus",
          content: "Kucing oren gemuk yang biasanya nongkrong di depan FIP tadi kelihatan lemas banget di bawah pos satpam. Ada yang punya wet food atau vitamin kah buat dikasih?",
          tag: "Sosial",
          createdAt: new Date(),
          fire: 1,
          laugh: 0,
          heart: 24
        }
      ];
    }
  } catch (error) {
    console.error("Database error fetching posts:", error);
    posts = [
      {
        id: 1,
        sender: "AnonKimia",
        recipient: "Semua Anggota Lab Kimia Dasar",
        content: "Siapa yang kemarin ninggalin jas lab basah di gantungan lemari belakang? Baunya asem banget tolong segera diambil sebelum didepak aslab 😭",
        tag: "Akademik",
        createdAt: new Date(),
        fire: 5,
        laugh: 12,
        heart: 2
      },
      {
        id: 2,
        sender: "PencintaKucingSekaran",
        recipient: "Pemberi Makan Kucing Kampus",
        content: "Kucing oren gemuk yang biasanya nongkrong di depan FIP tadi kelihatan lemas banget di bawah pos satpam. Ada yang punya wet food atau vitamin kah buat dikasih?",
        tag: "Sosial",
        createdAt: new Date(),
        fire: 1,
        laugh: 0,
        heart: 24
      }
    ];
  }

  // Fetch poll options from database, initialize if empty
  let pollOptions: { id: number; text: string; votes: number }[] = [];
  try {
    let poll = await db.query.poll.findFirst({
      with: {
        options: {
          with: {
            votes: {
              columns: {
                id: true
              }
            }
          }
        }
      },
      orderBy: (p, { desc }) => [desc(p.createdAt)]
    });
 
    if (!poll) {
      poll = await db.transaction(async (tx) => {
        const [newPoll] = await tx.insert(pollTable).values({
          question: "Berapa kali kalian makan geprek dalam satu minggu?"
        }).returning();

        const insertedOptions = await tx.insert(pollOptionTable).values([
          { text: "Setiap hari (Geprek is life)", pollId: newPoll.id },
          { text: "2-3 kali seminggu", pollId: newPoll.id },
          { text: "Jarang / Tidak pernah", pollId: newPoll.id }
        ]).returning();

        return {
          ...newPoll,
          options: insertedOptions.map(opt => ({
            ...opt,
            votes: []
          }))
        };
      });
    }

    pollOptions = poll.options.map(opt => ({
      id: opt.id,
      text: opt.text,
      votes: opt.votes.length
    }));
  } catch (error) {
    console.error("Database error fetching poll options:", error);
    pollOptions = [
      { id: 1, text: "Setiap hari (Geprek is life)", votes: 42 },
      { id: 2, text: "2-3 kali seminggu", votes: 48 },
      { id: 3, text: "Jarang / Tidak pernah", votes: 10 }
    ];
  }

  const totalVotes = pollOptions.reduce((sum, opt) => sum + opt.votes, 0) || 1;

  return (
    <div className="flex flex-col min-h-screen bg-cream text-neo-black justify-between">
      {/* Header Navbar */}
      <header className="px-6 h-16 flex items-center justify-between border-b-2 border-neo-black bg-white">
        <div className="flex items-center gap-2 font-heading font-black text-xl tracking-tight text-neo-black">
          <span className="bg-orange p-1.5 rounded-sm border-2 border-neo-black shadow-neo-sm">🏠</span>
          <span>UnnesBoard.</span>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/login"
            className="px-4 py-1.5 text-xs font-heading font-black border-2 border-neo-black bg-sky rounded-md shadow-neo-sm hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_#1A1A1A] transition-all"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="px-4 py-1.5 text-xs font-heading font-black border-2 border-neo-black bg-blue text-white rounded-md shadow-neo-sm hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_#1A1A1A] transition-all"
          >
            Daftar
          </Link>
        </div>
      </header>

      {/* Hero Body */}
      <main className="max-w-6xl mx-auto px-6 py-12 space-y-16">
        {/* Top Hero Section */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center py-10">
          <div className="flex flex-col items-start text-left">
            <div className="neo-badge !bg-orange !mb-3">
              #SocialFirst
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-[3.2rem] leading-none mb-5 uppercase font-heading font-black">
              Tongkrongan Digital Mahasiswa UNNES
            </h1>
            <p className="text-lg text-neo-black/80 mb-7 leading-relaxed font-semibold">
              Platform anonim terpercaya untuk mahasiswa Universitas Negeri Semarang. Bebas curhat (menfess), jajak pendapat (polling), intip event kece, dan transaksi jual beli barang bekas di sekitar Sekaran. 100% anonim, 100% asyik.
            </p>
            <div className="flex gap-4 flex-wrap">
              <Link href="/register" className="neo-btn blue !text-lg !px-7 !py-3.5">
                <span>Gabung Sekarang 🚀</span>
              </Link>
              <Link href="/login" className="neo-btn sky !text-lg !px-7 !py-3.5">
                <span>Masuk 🔑</span>
              </Link>
            </div>
          </div>
          <div className="relative w-full max-w-md mx-auto h-[280px] md:h-[320px] mt-6 lg:mt-0">
            {/* Floating Card 1 */}
            <div className="neo-card absolute left-[5%] top-[10%] w-[180px] sm:w-[200px] md:w-[220px] -rotate-6 z-10 shadow-neo hover:rotate-0 hover:scale-105 transition-all duration-150 ease-[cubic-bezier(0.16,1,0.3,1)] !bg-orange !mb-0 !p-5 select-none">
              <div className="flex justify-between items-center mb-3">
                <span className="neo-badge !bg-white">#Curhat</span>
                <span className="text-[10px] text-neo-black/60 font-semibold">Just Now</span>
              </div>
              <p className="font-extrabold text-[13px] md:text-sm text-neo-black leading-snug">
                {"\"Info loker magang buat anak semester 6 dong guys, butuh buat konversi SKS nih 😭\""}
              </p>
            </div>
            {/* Floating Card 2 */}
            <div className="neo-card absolute right-[5%] bottom-[10%] w-[160px] sm:w-[180px] md:w-[200px] rotate-[8deg] z-0 shadow-neo hover:rotate-0 hover:scale-105 transition-all duration-150 ease-[cubic-bezier(0.16,1,0.3,1)] !bg-sky !mb-0 !p-5 select-none">
              <div className="flex justify-between items-center mb-3">
                <span className="neo-badge !bg-orange">#Kantin</span>
                <span className="text-[10px] text-neo-black/60 font-semibold">2m ago</span>
              </div>
              <p className="font-extrabold text-[13px] md:text-sm text-neo-black leading-snug">
                {"\"Geprek Bu Rum tetep juara bertahan nomor 1 se-UNNES!\""}
              </p>
            </div>
          </div>
        </section>

        {/* Sekilas Info Segment */}
        <section className="mt-10 border-t-2 border-neo-black pt-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl uppercase mb-2 font-heading font-black">Sekilas Info UnnesBoard 📡</h2>
            <p className="text-neo-black/70 font-semibold">Apa saja yang sedang ramai dibicarakan hari ini?</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[1.8fr_1.2fr] gap-8 text-left">
            
            {/* Left Side: Mockup Feed */}
            <div>
              <h3 className="mb-4 uppercase text-lg font-heading font-black">💬 Cerita Mahasiswa</h3>
              <div className="flex flex-col gap-4">
                {posts.map(post => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            </div>

            {/* Right Side: Mockup Widgets */}
            <div className="flex flex-col gap-6">
              {/* Polling Widget */}
              <div className="neo-card !mb-0">
                <h3 className="text-lg mb-3 font-heading font-black">🌊 Tes Ombak Harian</h3>
                <p className="font-extrabold text-sm mb-4">
                  Berapa kali kalian makan geprek dalam satu minggu?
                </p>
                <div className="flex flex-col gap-2">
                  {pollOptions.map(opt => {
                    const percentage = Math.round((opt.votes / totalVotes) * 100);
                    return (
                      <div key={opt.id} className="bg-white border-2 border-neo-black rounded-md p-3 relative overflow-hidden transition-all duration-150">
                        <div 
                          className="absolute top-0 left-0 bottom-0 bg-[#FFD494] z-0"
                          style={{ width: `${percentage}%` }}
                        ></div>
                        <div className="relative z-10 flex justify-between font-bold text-xs">
                          <span>{opt.text}</span>
                          <span className="text-blue">{percentage}%</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* CTA Box */}
              <div className="neo-card !mb-0 text-center p-6 !bg-mint border-4 border-neo-black shadow-neo">
                <h3 className="uppercase mb-2 text-lg font-heading font-black">Ingin Ikut Berbagi Cerita?</h3>
                <p className="text-sm font-semibold mb-4 leading-relaxed text-neo-black/80">
                  Masuk dengan akun mahasiswa UNNES Anda sekarang juga untuk mulai mengirim menfess, membuat polling, dan berdiskusi.
                </p>
                <Link href="/register" className="neo-btn blue w-full justify-center">
                  Daftar Akun Baru 🚀
                </Link>
              </div>
            </div>

          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center border-t-2 border-neo-black bg-white text-xs font-heading font-black text-neo-black">
        © 2026 UNNES Board. Semua hak cipta dilindungi.
      </footer>
    </div>
  );
}
