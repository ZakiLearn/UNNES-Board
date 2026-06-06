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
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-neo-black z-40 p-3 block md:hidden">
      <div className="flex justify-around items-center">
        {navItems.map(item => {
          const isActive = pathname.startsWith(item.path);
          return (
            <Link 
              key={item.path} 
              href={item.path} 
              className={`flex flex-col items-center no-underline text-xs font-heading gap-1 font-extrabold transition-colors duration-150 ${
                isActive ? 'text-blue' : 'text-neo-black'
              }`}
            >
              <span className="text-2xl">{item.icon}</span>
              <span>{item.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
