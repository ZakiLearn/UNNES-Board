"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const navigation = [
    { name: "Feed", href: "/feed", icon: "🏠" },
    { name: "Explore", href: "/explore", icon: "🔍" },
    { name: "Messages", href: "/messages", icon: "💬" },
    { name: "Marketplace", href: "/marketplace", icon: "🛒" },
    { name: "Notifications", href: "/notifications", icon: "🔔" },
    { name: "Profile", href: "/profile", icon: "👤" },
  ];

  return (
    <div className="flex min-h-screen bg-cream text-neo-black">
      {/* Sidebar - Desktop */}
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r-2 border-neo-black bg-cream lg:flex flex-col z-30 overflow-y-auto p-4 gap-4">
        {/* User Card */}
        <div className="neo-card bg-white p-4 flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange border-2 border-neo-black font-heading font-black text-neo-black shadow-neo-sm">
            A
          </div>
          <div className="min-w-0">
            <h4 className="font-heading font-black text-sm text-neo-black truncate">adsda</h4>
            <p className="text-[10px] font-bold text-neo-black/60">NIM: 1201422837</p>
          </div>
        </div>

        {/* Navigation List */}
        <nav className="flex flex-col gap-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
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
                <span className="text-lg">{item.icon}</span>
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Status Indicator */}
        <div className="border-2 border-neo-black bg-white rounded-md py-1 px-3 text-center text-xs font-heading font-black shadow-neo-sm">
          🟢 142 Online
        </div>

        {/* Log Out Button */}
        <Link
          href="/login"
          className="neo-btn sky py-2.5 text-sm flex items-center justify-center gap-2"
        >
          <span>Keluar</span>
          <span className="text-red-500 font-bold">|</span>
        </Link>

        {/* Developer Info Card */}
        <div className="neo-card bg-white p-4 space-y-3 mt-auto text-[10px] leading-relaxed">
          <div>
            <h5 className="font-heading font-black text-[11px] uppercase border-b border-neo-black/10 pb-1">⚙️ Tim Pengembang</h5>
            <ul className="list-disc pl-3 text-neo-black/70 font-semibold space-y-0.5 mt-1.5">
              <li>M. Farraz Aqil Zaydan</li>
              <li>Farrel Fausta Widyatama</li>
              <li>Ahmad Abyan Zaki</li>
              <li>Firman Adi Juliawan</li>
            </ul>
          </div>
          <div>
            <h5 className="font-heading font-black text-[11px] uppercase border-b border-neo-black/10 pb-1">🎓 Dosen Pembimbing</h5>
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
              <span className="bg-orange p-1.5 rounded-sm border-2 border-neo-black shadow-neo-sm">🏠</span>
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
              <span className="h-5 w-5 bg-white border border-neo-black rounded-full flex items-center justify-center text-[10px]">A</span>
              <span>adsda</span>
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
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center flex-1 py-1 transition-all duration-100 ${
                isActive ? "text-blue font-extrabold" : "text-neo-black/60"
              }`}
            >
              <span className={`text-xl p-1 rounded-sm border-2 transition-all ${
                isActive ? "bg-sky border-neo-black shadow-[1px_1px_0px_0px_#1A1A1A]" : "border-transparent"
              }`}>{item.icon}</span>
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
