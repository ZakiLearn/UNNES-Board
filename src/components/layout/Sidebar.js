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
    <aside className="sidebar-container" style={{
      position: 'sticky',
      top: '20px',
      height: 'calc(100vh - 40px)',
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
    }}>
      {/* Brand Card */}
      <div className="neo-card" style={{ padding: '20px', marginBottom: '0' }}>
        <div className="logo-container" style={{ justifyContent: 'center' }}>
          <div className="logo-icon">🏫</div>
          <div className="logo-text">UnnesBoard.</div>
        </div>
        
        {/* User Card */}
        {user && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginTop: '16px',
            paddingTop: '16px',
            borderTop: 'var(--border-stroke)',
          }}>
            <div className="avatar-abstract" style={{ backgroundColor: 'var(--accent-orange)' }}>
              {user.avatar}
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>{user.name}</div>
              <div style={{ fontSize: '0.75rem', color: 'rgba(26,26,26,0.6)', fontWeight: 600 }}>{user.nim}</div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Menu */}
      <nav className="neo-card" style={{
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        flexGrow: 1,
        marginBottom: '0'
      }}>
        {menuItems.map(item => {
          const isActive = pathname.startsWith(item.path);
          return (
            <Link
              key={item.path}
              href={item.path}
              className={`filter-tag ${isActive ? 'active' : ''}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                fontSize: '1rem',
                borderRadius: 'var(--border-radius-sm)',
                textDecoration: 'none',
                color: isActive ? 'var(--bg-white)' : 'var(--color-black)',
                border: 'var(--border-stroke)',
                transition: 'all var(--transition-fast)',
              }}
            >
              <span style={{ fontSize: '1.2rem' }}>{item.icon}</span>
              <span style={{ fontWeight: 800 }}>{item.name}</span>
            </Link>
          );
        })}

        {/* Live Indicator */}
        <div className="online-indicator" style={{
          marginTop: 'auto',
          justifyContent: 'center',
          boxShadow: 'none',
          border: 'var(--border-stroke)',
        }}>
          <span className="online-dot"></span>
          <span>{onlineCount} Online</span>
        </div>

        {/* Logout Button */}
        <button
          onClick={logout}
          className="neo-btn small sky"
          style={{
            width: '100%',
            justifyContent: 'center',
            marginTop: '12px',
            border: 'var(--border-stroke)',
          }}
        >
          Keluar 🚪
        </button>
      </nav>
    </aside>
  );
}
