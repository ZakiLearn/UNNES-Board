'use client';
import Link from 'next/link';

export default function GuestHeader() {
  return (
    <header className="sticky-header">
      <div className="header-inner">
        <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div className="logo-container">
            <div className="logo-icon">🏫</div>
            <div className="logo-text">
              UnnesBoard<span style={{ color: 'var(--accent-blue)' }}>.</span>
            </div>
          </div>
        </Link>

        <div style={{ display: 'flex', gap: '12px' }}>
          <Link href="/login" className="neo-btn small sky">
            Login
          </Link>
          <Link href="/register" className="neo-btn small blue">
            Daftar
          </Link>
        </div>
      </div>
    </header>
  );
}
