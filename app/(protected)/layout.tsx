"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { 
  Home, 
  Search, 
  MessageSquare, 
  ShoppingCart, 
  Bell, 
  User, 
  GraduationCap, 
  Users, 
  LogOut 
} from "lucide-react";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [userData, setUserData] = useState<{ nim: string; alias: string } | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        setUserData({
          nim: user.user_metadata?.nim || "-",
          alias: user.user_metadata?.aliasName || "Anonim",
        });
      }
    };
    fetchUser();
  }, []);

  const handleSignOut = async (e: React.MouseEvent) => {
    e.preventDefault();
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  const navigation = [
    { name: "Feed", href: "/feed", icon: Home },
    { name: "Explore", href: "/explore", icon: Search },
    { name: "Messages", href: "/messages", icon: MessageSquare },
    { name: "Marketplace", href: "/marketplace", icon: ShoppingCart },
    { name: "Notifications", href: "/notifications", icon: Bell },
    { name: "Profile", href: "/profile", icon: User },
  ];

  return (
    <div className="flex min-h-screen bg-cream text-neo-black">
      {/* Sidebar - Desktop */}
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r-2 border-neo-black bg-cream lg:flex flex-col z-30 overflow-y-auto p-4 gap-4">
        {/* User Card */}
        <div className="neo-card bg-white p-4 flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange border-2 border-neo-black font-heading font-black text-neo-black shadow-neo-sm">
            {userData?.alias.charAt(0).toUpperCase() || "U"}
          </div>
          <div className="min-w-0">
            <h4 className="font-heading font-black text-sm text-neo-black truncate">
              {userData?.alias || "Memuat..."}
            </h4>
            <p className="text-[10px] font-bold text-neo-black/60">NIM: {userData?.nim || "-"}</p>
          </div>
        </div>

        {/* Navigation List */}
        <nav className="flex flex-col gap-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-md px-4 py-2.5 text-sm font-heading font-extrabold border-2 border-neo-black shadow-neo-sm transition-all duration-100 ${
                  isActive
                    ? "bg-blue text-white translate-x-[2px] translate-y-[2px] shadow-neo-hover"
                    : "bg-white text-neo-black hover:bg-dark-white hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-neo-hover"
                }`}
              >
                <Icon className={`h-5 w-5 ${isActive ? "text-white" : "text-neo-black"}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Status Indicator */}
        <div className="flex items-center justify-center gap-2 border-2 border-neo-black bg-white rounded-md py-1.5 px-3 text-xs font-heading font-black shadow-neo-sm">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          <span>142 Online</span>
        </div>

        {/* Log Out Button */}
        <button
          onClick={handleSignOut}
          className="w-full neo-btn sky py-2.5 text-sm flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>Keluar</span>
          <LogOut className="h-4 w-4" />
        </button>

        {/* Developer Info Card */}
        <div className="neo-card bg-white p-4 space-y-3 mt-auto text-[10px] leading-relaxed">
          <div>
            <h5 className="font-heading font-black text-[11px] uppercase border-b border-neo-black/10 pb-1 flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5" />
              <span>Tim Pengembang</span>
            </h5>
            <ul className="list-disc pl-3 text-neo-black/70 font-semibold space-y-0.5 mt-1.5">
              <li>M. Farraz Aqil Zaydan</li>
              <li>Farrel Fausta Widyatama</li>
              <li>Ahmad Abyan Zaki</li>
              <li>Firman Adi Juliawan</li>
            </ul>
          </div>
          <div>
            <h5 className="font-heading font-black text-[11px] uppercase border-b border-neo-black/10 pb-1 flex items-center gap-1.5">
              <GraduationCap className="h-3.5 w-3.5" />
              <span>Dosen Pembimbing</span>
            </h5>
            <p className="text-neo-black/70 font-semibold pl-3 mt-1.5">Yahya Nur Iriza</p>
          </div>
          <div className="text-center text-[9px] font-bold text-neo-black/40 border-t border-neo-black/10 pt-2">
            UNNES Board © 2026
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col lg:pl-64">
        {/* Top Header */}
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b-2 border-neo-black bg-white px-6">
          <div className="flex items-center gap-2">
            <Link href="/feed" className="flex items-center gap-2 font-heading font-black text-xl text-neo-black">
              <span className="bg-orange p-1.5 rounded-sm border-2 border-neo-black shadow-neo-sm flex items-center justify-center">
                <Home className="h-5 w-5 text-neo-black" />
              </span>
              <span>UnnesBoard.</span>
            </Link>
          </div>

          {/* Topbar Search Input */}
          <div className="relative w-64 hidden sm:block">
            <input
              type="text"
              placeholder="Cari di UnnesBoard..."
              className="w-full rounded-md border-2 border-neo-black bg-white px-3 py-1.5 pr-8 text-xs font-bold shadow-neo-sm focus:outline-none"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs">🔍</span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/profile"
              className="flex items-center gap-2 rounded-full border-2 border-neo-black bg-orange py-1 px-3 text-xs font-heading font-black shadow-neo-sm"
            >
              <span className="h-5 w-5 bg-white border border-neo-black rounded-full flex items-center justify-center text-[10px]">
                {userData?.alias.charAt(0).toUpperCase() || "U"}
              </span>
              <span>{userData?.alias || "Memuat..."}</span>
            </Link>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="flex-1 p-6 pb-24 lg:pb-6 bg-cream">{children}</main>
      </div>

      {/* Bottom Bar - Mobile */}
      <nav className="fixed bottom-0 left-0 right-0 z-30 flex h-16 items-center justify-around border-t-2 border-neo-black bg-white px-2 pb-safe lg:hidden">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center flex-1 py-1 transition-all duration-100 ${
                isActive ? "text-blue font-extrabold" : "text-neo-black/60"
              }`}
            >
              <span className={`p-1.5 rounded-sm border-2 transition-all flex items-center justify-center ${
                isActive ? "bg-sky border-neo-black shadow-[1px_1px_0px_0px_#1A1A1A]" : "border-transparent"
              }`}>
                <Icon className="h-5 w-5" />
              </span>
              <span className="text-[9px] font-heading font-black mt-0.5">
                {item.name}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

