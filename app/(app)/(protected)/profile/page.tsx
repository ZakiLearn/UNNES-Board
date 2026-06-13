import React from "react";
import { createClient } from "@/lib/supabase/server";
import { db } from "@/lib/db";
import { profile as profileTable, post as postTable } from "@/lib/db/schema";
import { eq, count } from "drizzle-orm";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const profileList = await db.select().from(profileTable).where(eq(profileTable.id, user.id)).limit(1);
  const profile = profileList[0];

  const countRes = await db.select({ value: count() }).from(postTable).where(eq(postTable.authorId, user.id));
  const postCount = countRes[0]?.value || 0;

  const name = user.user_metadata?.full_name || "Nama Lengkap";
  const nim = user.user_metadata?.nim || "-";
  const aliasName = profile?.aliasName || "Belum diatur";
  const role = profile?.role || "USER";

  const roleConfig = {
    ADMIN: { label: "Admin", colorClass: "!bg-orange" },
    MODERATOR: { label: "Moderator", colorClass: "!bg-mint" },
    USER: { label: "Mahasiswa", colorClass: "!bg-sky" },
  };
  const currentRole = roleConfig[role as keyof typeof roleConfig] || roleConfig.USER;

  const userStats = [
    { label: "Postingan", value: postCount.toString(), color: "bg-orange" },
    { label: "Komunitas", value: "0", color: "bg-sky" },
    { label: "Koin Reputasi", value: "100", color: "bg-mint" },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Banner & Avatar Container */}
      <div className="neo-card bg-white p-0 overflow-hidden">
        {/* Banner Cover */}
        <div className="h-40 bg-gradient-to-r from-orange to-sky border-b-2 border-neo-black" />
        
        {/* User Card info */}
        <div className="p-6 relative flex flex-col sm:flex-row items-center sm:items-end justify-between gap-4 -mt-14 sm:-mt-18">
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 text-center sm:text-left">
            <div className="h-28 w-28 rounded-full border-4 border-neo-black bg-cream flex items-center justify-center text-5xl font-heading font-black shadow-neo-sm shrink-0">
              {aliasName.charAt(0).toUpperCase()}
            </div>
            <div className="space-y-2 pb-1">
              <div className="flex flex-col sm:flex-row items-center sm:items-center gap-2">
                <h2 className="text-3xl font-heading font-black text-neo-black">
                  {name} ({aliasName})
                </h2>
                <span className={`neo-badge ${currentRole.colorClass} text-neo-black uppercase tracking-wider text-[10px]`}>
                  {currentRole.label}
                </span>
              </div>
              <p className="text-sm font-heading font-extrabold text-neo-black/60">
                Mahasiswa UNNES • NIM. {nim} • {user.email}
              </p>
            </div>
          </div>
          <button className="neo-btn">
            Edit Profil
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 border-t-2 border-neo-black divide-x-2 divide-neo-black text-center bg-cream/25">
          {userStats.map((stat, i) => (
            <div key={i} className="py-5">
              <span className={`inline-block text-xl font-heading font-black text-neo-black border-2 border-neo-black px-4 py-1.5 rounded-sm shadow-neo-sm ${stat.color} mb-1`}>
                {stat.value}
              </span>
              <p className="text-xs font-heading font-extrabold text-neo-black/60 mt-2">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Main Info Blocks */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Bio Block */}
        <div className="md:col-span-1 neo-card bg-white space-y-4">
          <h3 className="text-xl font-heading font-black text-neo-black uppercase">Tentang Saya</h3>
          <p className="text-sm font-semibold text-neo-black/85 leading-relaxed">
            Mahasiswa Universitas Negeri Semarang yang berpartisipasi aktif dalam membagikan cerita dan kontribusi positif di UNNES Board.
          </p>
        </div>

        {/* Post History Sandbox */}
        <div className="md:col-span-2 neo-card bg-white space-y-4">
          <h3 className="text-xl font-heading font-black text-neo-black uppercase">Postingan Terakhir</h3>
          <div className="space-y-4">
            {postCount === 0 ? (
              <p className="text-sm font-semibold text-neo-black/50">Anda belum membuat postingan apapun.</p>
            ) : (
              <div className="p-5 rounded-md border-2 border-neo-black bg-cream/15 hover:bg-cream/30 cursor-pointer transition-colors space-y-2">
                <h4 className="font-heading font-black text-base text-neo-black">
                  Postingan Anda tersimpan aman dan terintegrasi secara anonim.
                </h4>
                <p className="text-xs font-heading font-extrabold text-neo-black/50">
                  Total postingan aktif: {postCount}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
