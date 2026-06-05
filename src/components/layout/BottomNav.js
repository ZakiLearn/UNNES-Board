'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { name: 'Feed', path: '/feed', icon: '🏠' },
    { name: 'Explore', path: '/explore', icon: '📡' },
    { name: 'Direct', path: '/messages', icon: '💬' },
    { name: 'Pasar', path: '/marketplace', icon: '🛍️' },
    { name: 'Profil', path: '/profile', icon: '👤' },
  ];

  return (
    <nav className="mobile-navbar" style={{ display: 'block' }}>
      <div className="mobile-nav-links">
        {navItems.map(item => {
          const isActive = pathname.startsWith(item.path);
          return (
            <Link 
              key={item.path} 
              href={item.path} 
              className="mobile-nav-link"
              style={{
                color: isActive ? 'var(--accent-blue)' : 'var(--color-black)',
                fontWeight: isActive ? '800' : '500',
                textDecoration: 'none',
              }}
            >
              <span style={{ fontSize: '1.4rem' }}>{item.icon}</span>
              <span>{item.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
