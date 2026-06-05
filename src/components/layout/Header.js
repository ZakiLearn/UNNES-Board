'use client';

export default function Header({ onlineCount, onOpenModal }) {
  return (
    <header className="sticky-header">
      <div className="header-inner">
        <div className="logo-container">
          <div className="logo-icon">🏫</div>
          <div className="logo-text">
            UnnesBoard<span style={{ color: 'var(--accent-blue)' }}>.</span>
          </div>
        </div>

        {/* Active User indicator */}
        <div className="online-indicator" id="online-counter-container">
          <span className="online-dot"></span>
          <span id="online-counter">{onlineCount}</span> online
        </div>

        {/* Desktop CTA button */}
        <button
          className="neo-btn desktop-only-btn"
          onClick={onOpenModal}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
          Kirim Menfess
        </button>
      </div>
    </header>
  );
}
