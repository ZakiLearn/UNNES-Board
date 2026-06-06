'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useState, useEffect } from 'react';

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [onlineCount, setOnlineCount] = useState(142);

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

  const menuItems = [
    { name: 'Feed', path: '/feed', icon: '🏠' },
    { name: 'Explore', path: '/explore', icon: '📡' },
    { name: 'Messages', path: '/messages', icon: '💬' },
    { name: 'Marketplace', path: '/marketplace', icon: '🛍️' },
    { name: 'Notifications', path: '/notifications', icon: '🔔' },
    { name: 'Profile', path: '/profile', icon: '👤' },
  ];

  return (
    <aside className="sticky top-4 max-h-[calc(100vh-100px)] flex flex-col gap-3.5 overflow-y-auto pr-1">
      {/* User Card (Facebook Style) */}
      {user && (
        <div className="neo-card !p-3 !mb-0 flex-shrink-0 flex items-center gap-2.5 border-2 border-neo-black rounded-md bg-white">
          <div className="w-8 h-8 rounded-full border-2 border-neo-black flex items-center justify-center text-sm font-bold bg-orange flex-shrink-0">
            {user.avatar}
          </div>
          <div className="min-w-0">
            <div className="font-extrabold text-xs leading-tight truncate">{user.name}</div>
            <div className="text-[9px] text-neo-black/60 font-semibold truncate">NIM: {user.nim}</div>
          </div>
        </div>
      )}

      {/* Navigation Menu */}
      <nav className="neo-card !p-3 flex flex-col gap-1.5 flex-grow !mb-0 min-h-fit">
        {menuItems.map(item => {
          const isActive = pathname.startsWith(item.path);
          return (
            <Link
              key={item.path}
              href={item.path}
              className={`flex items-center gap-2.5 px-3 py-2 text-sm rounded-sm no-underline border-2 border-neo-black transition-all duration-150 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                isActive 
                  ? 'bg-blue text-white shadow-none translate-x-[2px] translate-y-[2px]' 
                  : 'bg-white text-neo-black shadow-neo hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-neo-hover hover:bg-dark-white'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span className="font-extrabold">{item.name}</span>
            </Link>
          );
        })}

        {/* Live Indicator */}
        <div className="flex items-center gap-2 bg-white border-2 border-neo-black px-3 py-1 rounded-full text-[10px] font-bold justify-center mt-auto">
          <span className="online-dot"></span>
          <span>{onlineCount} Online</span>
        </div>

        {/* Logout Button */}
        <button
          onClick={logout}
          className="neo-btn small sky w-full justify-center mt-2"
        >
          Keluar 🚪
        </button>
      </nav>

      {/* Footer Credit Card */}
      <div className="neo-card !p-3 !mb-0 bg-white text-[10px] font-semibold text-neo-black/70 border-2 border-neo-black rounded-md flex flex-col gap-1.5 shadow-[2px_2px_0_0_#1A1A1A]">
        <div className="font-extrabold text-[10px] text-neo-black uppercase border-b border-neo-black/20 pb-1 mb-0.5">
          👥 Tim Pengembang
        </div>
        <ul className="space-y-1">
          <li>
            <a href="https://www.instagram.com/zayrezan?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" target="_blank" rel="noopener noreferrer" className="hover:text-blue transition-colors flex items-center gap-1 font-bold">
              <span>🔗</span> M. Farras Aqil Zaydan
            </a>
          </li>
          <li>
            <a href="https://www.instagram.com/far_elf.w?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" target="_blank" rel="noopener noreferrer" className="hover:text-blue transition-colors flex items-center gap-1 font-bold">
              <span>🔗</span> Farrel Fauzta Widyatama
            </a>
          </li>
          <li>
            <a href="https://www.instagram.com/zaaaakkkyy16/" target="_blank" rel="noopener noreferrer" className="hover:text-blue transition-colors flex items-center gap-1 font-bold">
              <span>🔗</span> Ahmad Abyan Zaki
            </a>
          </li>
          <li>
            <a href="https://www.instagram.com/azulliann?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" target="_blank" rel="noopener noreferrer" className="hover:text-blue transition-colors flex items-center gap-1 font-bold">
              <span>🔗</span> Firman Adi Juliawan
            </a>
          </li>
        </ul>
        <div className="font-extrabold text-[10px] text-neo-black uppercase border-b border-neo-black/20 pb-1 mt-1 mb-0.5">
          🎓 Dosen Pembimbing
        </div>
        <a href="https://id.linkedin.com/in/yahya-nur-ifriza-114b6849" target="_blank" rel="noopener noreferrer" className="hover:text-blue transition-colors flex items-center gap-1 font-bold">
          <span>🔗</span> Yahya Nur Ifriza
        </a>
        <div className="text-center text-[9px] font-black text-neo-black/40 mt-1 border-t border-neo-black/10 pt-1">
          UNNES Board © 2026
        </div>
      </div>
    </aside>
  );
}
