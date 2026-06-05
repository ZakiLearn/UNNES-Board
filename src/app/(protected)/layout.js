'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Sidebar from '@/components/layout/Sidebar';
import BottomNav from '@/components/layout/BottomNav';

export default function ProtectedLayout({ children }) {
  const { isLoggedIn, loading } = useAuth();
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
    <div className="protected-dashboard-layout" style={{
      minHeight: '100vh',
      backgroundColor: 'var(--bg-cream)',
    }}>
      {/* Layout Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '280px 1fr',
        gap: '30px',
        maxWidth: '1300px',
        margin: '0 auto',
        padding: '20px',
      }} className="desktop-dashboard-grid">
        
        {/* Left Side Sidebar - hidden on mobile via CSS wrapper if we make it responsive */}
        <div className="desktop-sidebar-wrapper">
          <Sidebar />
        </div>

        {/* Right Side main content */}
        <main style={{ minHeight: 'calc(100vh - 40px)' }}>
          {children}
        </main>

      </div>

      {/* Mobile Bottom Navigation */}
      <div className="mobile-nav-wrapper">
        <BottomNav />
      </div>

      {/* Quick CSS helper for hiding/showing elements on screen sizes */}
      <style jsx global>{`
        @media (max-width: 900px) {
          .desktop-dashboard-grid {
            grid-template-columns: 1fr !important;
            padding: 12px !important;
          }
          .desktop-sidebar-wrapper {
            display: none !important;
          }
          .mobile-navbar {
            display: block !important;
          }
        }
        @media (min-width: 901px) {
          .mobile-navbar {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
