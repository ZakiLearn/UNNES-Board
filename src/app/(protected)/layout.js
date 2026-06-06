'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Sidebar from '@/components/layout/Sidebar';
import BottomNav from '@/components/layout/BottomNav';

export default function ProtectedLayout({ children }) {
  const { isLoggedIn, loading, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isLoggedIn) {
      router.replace('/login');
    }
  }, [isLoggedIn, loading, router]);

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: 'var(--bg-cream)',
        fontFamily: 'var(--font-heading)',
        fontWeight: 800,
        fontSize: '1.5rem',
      }}>
        Loading UnnesBoard... 🏫
      </div>
    );
  }

  if (!isLoggedIn) {
    return null;
  }

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      {/* Top Header */}
      <header className="sticky top-0 z-50 w-full bg-white border-b-2 border-neo-black py-2.5 px-4 md:px-5 flex justify-between items-center shadow-[4px_4px_0_0_#1A1A1A]">
        {/* Left: Brand */}
        <div className="flex items-center gap-2">
          <div className="bg-orange border-2 border-neo-black rounded-sm w-7.5 h-7.5 w-[30px] h-[30px] flex items-center justify-center text-base font-black shadow-[2px_2px_0px_0px_#1A1A1A]">
            🏫
          </div>
          <span className="font-heading font-black text-lg md:text-xl tracking-tight">UnnesBoard.</span>
        </div>

        {/* Center: Search Box (Facebook/Reddit Style) */}
        <div className="hidden sm:block max-w-[320px] w-full mx-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Cari di UnnesBoard..."
              className="form-control !py-1.5 !px-3 !m-0 !text-xs !shadow-neo-sm bg-dark-white"
              readOnly
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs">🔍</span>
          </div>
        </div>

        {/* Right: Profile */}
        <div className="flex items-center gap-3">
          {user && (
            <div className="flex items-center gap-2 bg-white border-2 border-neo-black py-1 px-2.5 rounded-full shadow-[2px_2px_0_0_#1A1A1A]">
              <div className="w-5.5 h-5.5 w-[22px] h-[22px] rounded-full border border-neo-black flex items-center justify-center text-[10px] font-bold bg-orange">
                {user.avatar}
              </div>
              <span className="font-extrabold text-[10px] text-neo-black hidden md:inline">{user.name}</span>
            </div>
          )}
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-grow">
        {/* Layout Grid */}
        <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-4 md:gap-5 w-full p-3 md:p-4">
          
          {/* Left Side Sidebar - hidden on mobile */}
          <div className="hidden md:block">
            <Sidebar />
          </div>

          {/* Right Side main content */}
          <main className="min-h-[calc(100vh-100px)] w-full">
            {children}
          </main>

        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="block md:hidden">
        <BottomNav />
      </div>
    </div>
  );
}
