'use client';

const mockChats = [
  { id: 1, name: 'AnonKimia', lastMessage: 'Jas labnya besok pagi aja ya bro', time: '14.25', unread: true, avatar: '🧪' },
  { id: 2, name: 'GeprekBuRum', lastMessage: 'Ada diskon buat kating almet kuning!', time: 'Kemarin', unread: false, avatar: '🍗' },
  { id: 3, name: 'KatingAlmetKuning', lastMessage: 'Makanya kalau kuliah pagi jangan begadang dek', time: 'Kamis', unread: false, avatar: '🦁' },
];

export default function ChatList({ activeChatId, onSelectChat }) {
  return (
    <div className="neo-card" style={{ padding: '20px', height: '100%', marginBottom: 0 }}>
      <h3 style={{ textTransform: 'uppercase', marginBottom: '16px', fontSize: '1.2rem' }}>💬 Percakapan</h3>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {mockChats.map(chat => {
          const isActive = chat.id === activeChatId;
          return (
            <div
              key={chat.id}
              onClick={() => onSelectChat(chat)}
              className="neo-card interactive"
              style={{
                margin: 0,
                padding: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                backgroundColor: isActive ? 'var(--accent-sky)' : 'var(--bg-white)',
                border: 'var(--border-stroke)',
                boxShadow: isActive ? '2px 2px 0 0 var(--color-black)' : 'var(--box-shadow-neo)',
                transform: isActive ? 'translate(2px, 2px)' : 'none'
              }}
            >
              <div style={{
                fontSize: '1.5rem',
                background: 'var(--bg-cream)',
                border: 'var(--border-stroke)',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>{chat.avatar}</div>
              
              <div style={{ flexGrow: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
                  <span style={{ fontWeight: 800, fontSize: '0.9rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {chat.name}
                  </span>
                  <span style={{ fontSize: '0.7rem', color: 'rgba(26,26,26,0.5)', fontWeight: 600 }}>
                    {chat.time}
                  </span>
                </div>
                
                <p style={{
                  fontSize: '0.8rem',
                  color: 'rgba(26,26,26,0.7)',
                  fontWeight: chat.unread ? 800 : 500,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  margin: 0
                }}>
                  {chat.lastMessage}
                </p>
              </div>

              {chat.unread && (
                <div style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--accent-orange)',
                  border: '1px solid var(--color-black)'
                }}></div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
