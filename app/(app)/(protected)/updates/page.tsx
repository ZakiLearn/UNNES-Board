import React from 'react';
import { createClient } from '@/lib/supabase/server';
import { db } from '@/lib/db';
import { profile as profileTable } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { redirect } from 'next/navigation';
import { Plus, Newspaper, BookOpen, Clock, User } from 'lucide-react';
import EventCarousel from './EventCarousel';

export const dynamic = 'force-dynamic';

export default async function UpdatesPage() {
  // 1. Authenticate user and verify role in Drizzle
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const profileList = await db
    .select()
    .from(profileTable)
    .where(eq(profileTable.id, user.id))
    .limit(1);
  const profile = profileList[0];
  const role = profile?.role || 'USER';
  const isAdmin = role === 'ADMIN';

  interface MockEvent {
    id: number;
    title: string;
    slug: string;
    location: string;
    startDate: string;
    description: unknown;
    thumbnail: { url: string } | null;
    author: { name: string };
  }

  interface MockNews {
    id: number;
    title: string;
    category: string;
    createdAt: string;
    excerpt: string;
    content: unknown;
    thumbnail: { url: string } | null;
    author: { name: string };
  }

  interface MockArticle {
    id: number;
    title: string;
    createdAt: string;
    content: unknown;
    author: { name: string };
    coverImage: { url: string } | null;
    tags: { tag: string }[];
  }

  // 2. Mock updates data (Payload CMS removed)
  const mockEvents: MockEvent[] = [
    {
      id: 1,
      title: "Dies Natalis UNNES Ke-61",
      slug: "dies-natalis-61",
      location: "Auditorium UNNES Sekaran",
      startDate: "2026-06-21T10:00:00.000Z",
      description: {
        root: {
          children: [
            {
              children: [
                {
                  text: "Perayaan puncak Dies Natalis Universitas Negeri Semarang ke-61 dengan tema 'Unggul dan Berkarakter untuk Indonesia Emas'. Dihadiri oleh seluruh civitas akademika dan alumni."
                }
              ]
            }
          ]
        }
      },
      thumbnail: null,
      author: {
        name: "Humas UNNES"
      }
    },
    {
      id: 2,
      title: "UNNES Career Expo 2026",
      slug: "career-expo-2026",
      location: "Gedung PKMU Lantai 2",
      startDate: "2026-06-28T09:00:00.000Z",
      description: {
        root: {
          children: [
            {
              children: [
                {
                  text: "Temukan karir impianmu di UNNES Career Expo! Diikuti oleh puluhan perusahaan nasional dan multinasional. Buka untuk umum dan mahasiswa tingkat akhir."
                }
              ]
            }
          ]
        }
      },
      thumbnail: null,
      author: {
        name: "Pusat Karir"
      }
    }
  ];

  const mockNews: MockNews[] = [
    {
      id: 1,
      title: "Mahasiswa UNNES Meraih Medali Emas di Pimnas 2026",
      category: "Prestasi",
      createdAt: "2026-06-14T19:00:00.000Z",
      excerpt: "Tim Program Kreativitas Mahasiswa (PKM) dari Universitas Negeri Semarang berhasil menyabet medali emas kategori poster dalam ajang Pimnas ke-39.",
      content: {
        root: {
          children: [
            {
              children: [
                {
                  text: "Tim Program Kreativitas Mahasiswa (PKM) dari Universitas Negeri Semarang berhasil menyabet medali emas kategori poster dalam ajang Pimnas ke-39."
                }
              ]
            }
          ]
        }
      },
      thumbnail: null,
      author: {
        name: "Kemahasiswaan"
      }
    },
    {
      id: 2,
      title: "Pendaftaran KKN Alternatif Tahap 2 Resmi Dibuka",
      category: "Akademik",
      createdAt: "2026-06-12T08:30:00.000Z",
      excerpt: "LPPM UNNES kembali membuka pendaftaran Kuliah Kerja Nyata (KKN) Alternatif Tahap 2 untuk mahasiswa angkatan 2023. Simak syarat dan jadwalnya.",
      content: null,
      thumbnail: null,
      author: {
        name: "LPPM UNNES"
      }
    }
  ];

  const mockArticles: MockArticle[] = [
    {
      id: 1,
      title: "Pemanfaatan AI dalam Pembelajaran Kolaboratif di Era Digital",
      createdAt: "2026-06-09T14:15:00.000Z",
      content: {
        root: {
          children: [
            {
              children: [
                {
                  text: "Artikel ini membahas bagaimana kecerdasan buatan (AI) dapat diintegrasikan secara efektif dalam ruang kelas perguruan tinggi untuk menunjang interaksi antar mahasiswa secara lebih dinamis."
                }
              ]
            }
          ]
        }
      },
      author: {
        name: "Dr. Budi Santoso"
      },
      coverImage: null,
      tags: [
        { tag: "Teknologi" },
        { tag: "Edukasi" }
      ]
    },
    {
      id: 2,
      title: "Menjaga Kesehatan Mental Mahasiswa Menjelang Ujian Akhir",
      createdAt: "2026-06-04T10:00:00.000Z",
      content: {
        root: {
          children: [
            {
              children: [
                {
                  text: "Ujian akhir sering kali memicu kecemasan yang berlebihan. Menemukan keseimbangan antara belajar dan istirahat adalah kunci utama menjaga produktivitas dan kesehatan mental."
                }
              ]
            }
          ]
        }
      },
      author: {
        name: "Diana Putri, M.Psi."
      },
      coverImage: null,
      tags: [
        { tag: "KesehatanMental" },
        { tag: "Tips" }
      ]
    }
  ];

  const eventsRes = { docs: mockEvents };
  const newsRes = { docs: mockNews };
  const articlesRes = { docs: mockArticles };

  // Helper to extract plaintext excerpt from Lexical richText
  const getExcerpt = (content: unknown, length = 150) => {
    if (!content) return '';
    try {
      const data = (typeof content === 'string' ? JSON.parse(content) : content) as {
        root?: {
          children?: {
            children?: {
              text?: string;
            }[];
          }[];
        };
      };
      if (data?.root?.children) {
        const text = data.root.children
          .map((node) => {
            if (node.children) {
              return node.children.map((child) => child.text || '').join('');
            }
            return '';
          })
          .join(' ');
        if (text.length > length) {
          return text.substring(0, length) + '...';
        }
        return text;
      }
    } catch (e) {}
    return '';
  };

  const formattedDate = (dateStr?: string | null) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Title Header with Admin Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-4 border-neo-black pb-6">
        <div>
          <h1 className="text-4xl font-heading font-black text-neo-black tracking-tight uppercase">
            Info & Updates Kampus
          </h1>
          <p className="text-sm font-heading font-extrabold text-neo-black/60 mt-1">
            Berita resmi, acara mendatang, dan artikel akademis Universitas Negeri Semarang.
          </p>
        </div>

        {isAdmin && (
          <a
            href="/admin"
            target="_blank"
            rel="noopener noreferrer"
            className="self-start sm:self-center neo-btn bg-orange hover:bg-orange/90 flex items-center gap-2 cursor-pointer"
          >
            <Plus className="h-5 w-5 text-neo-black" />
            <span>Tambah Konten</span>
          </a>
        )}
      </div>

      {/* Events Carousel Section */}
      <div className="space-y-3">
        <h2 className="text-xl font-heading font-black text-neo-black uppercase tracking-wide">
          Event Kampus
        </h2>
        <EventCarousel events={eventsRes.docs} />
      </div>

      {/* News and Articles Split Section */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Left Column: News (Berita Kampus) */}
        <div className="space-y-4">
          <h2 className="text-xl font-heading font-black text-neo-black uppercase tracking-wide flex items-center gap-2 pb-2 border-b-2 border-neo-black">
            <Newspaper className="h-5 w-5 text-orange" />
            <span>Berita Terbaru</span>
          </h2>

          {newsRes.docs.length === 0 ? (
            <div className="neo-card bg-white p-6 text-center border-2 border-neo-black shadow-neo-sm">
              <p className="text-sm font-semibold text-neo-black/50">Belum ada berita yang diterbitkan.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {newsRes.docs.map((news: MockNews) => {
                const thumbnailUrl = news.thumbnail && typeof news.thumbnail === 'object'
                  ? news.thumbnail.url
                  : null;

                return (
                  <article
                    key={news.id}
                    className="neo-card bg-white p-4 border-2 border-neo-black shadow-neo-sm flex gap-4 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-neo-hover transition-all"
                  >
                    {thumbnailUrl && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={thumbnailUrl}
                        alt={news.title}
                        className="w-24 h-24 object-cover rounded-sm border-2 border-neo-black shadow-neo-xs flex-shrink-0"
                      />
                    )}
                    <div className="flex flex-col justify-between flex-grow min-w-0">
                      <div className="space-y-1">
                        <div className="flex items-center justify-between gap-2">
                          <span className="neo-badge bg-sky/30 text-[10px] font-heading font-extrabold px-2 py-0.5 rounded-sm">
                            {news.category || 'Berita'}
                          </span>
                          <span className="text-[10px] text-neo-black/50 font-bold flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formattedDate(news.createdAt)}
                          </span>
                        </div>
                        <h3 className="font-heading font-black text-sm text-neo-black leading-snug line-clamp-2">
                          {news.title}
                        </h3>
                        <p className="text-xs font-semibold text-neo-black/70 line-clamp-2 leading-relaxed">
                          {news.excerpt || getExcerpt(news.content, 100)}
                        </p>
                      </div>
                      <div className="text-[10px] text-neo-black/40 font-bold mt-2 flex items-center gap-1">
                        <User className="h-3 w-3" />
                        <span>Oleh: {news.author && typeof news.author === 'object' ? news.author.name : 'Staf'}</span>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Articles (Artikel & Edukasi) */}
        <div className="space-y-4">
          <h2 className="text-xl font-heading font-black text-neo-black uppercase tracking-wide flex items-center gap-2 pb-2 border-b-2 border-neo-black">
            <BookOpen className="h-5 w-5 text-sky" />
            <span>Artikel & Wawasan</span>
          </h2>

          {articlesRes.docs.length === 0 ? (
            <div className="neo-card bg-white p-6 text-center border-2 border-neo-black shadow-neo-sm">
              <p className="text-sm font-semibold text-neo-black/50">Belum ada artikel yang diterbitkan.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {articlesRes.docs.map((article: MockArticle) => {
                const coverUrl = article.coverImage && typeof article.coverImage === 'object'
                  ? article.coverImage.url
                  : null;

                return (
                  <article
                    key={article.id}
                    className="neo-card bg-white p-4 border-2 border-neo-black shadow-neo-sm flex flex-col justify-between hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-neo-hover transition-all"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex flex-wrap gap-1">
                          {article.tags?.map((t: { tag: string }, idx: number) => (
                            <span key={idx} className="neo-badge bg-mint/40 text-[9px] font-heading font-extrabold px-1.5 py-0.5 rounded-sm">
                              #{t.tag}
                            </span>
                          ))}
                        </div>
                        <span className="text-[10px] text-neo-black/50 font-bold flex items-center gap-1 flex-shrink-0">
                          <Clock className="h-3 w-3" />
                          {formattedDate(article.createdAt)}
                        </span>
                      </div>
                      
                      <h3 className="font-heading font-black text-base text-neo-black leading-snug line-clamp-2">
                        {article.title}
                      </h3>

                      <p className="text-xs font-semibold text-neo-black/70 line-clamp-3 leading-relaxed">
                        {getExcerpt(article.content, 180)}
                      </p>
                    </div>

                    <div className="border-t border-neo-black/5 pt-3 mt-3 flex items-center justify-between">
                      <span className="text-[10px] text-neo-black/40 font-bold flex items-center gap-1">
                        <User className="h-3 w-3" />
                        <span>Penulis: {article.author && typeof article.author === 'object' ? article.author.name : 'Dosen'}</span>
                      </span>
                      {coverUrl && (
                        <span className="text-[10px] text-sky font-bold uppercase tracking-wider">Tersedia Cover</span>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
