'use client';
import { useState } from 'react';
import ChatList from '@/components/features/messages/ChatList';
import ChatRoom from '@/components/features/messages/ChatRoom';

export default function MessagesPage() {
  const [selectedChat, setSelectedChat] = useState(null);

  const handleSelectChat = (chat) => {
    setSelectedChat(chat);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', height: '100%' }}>
      <div>
        <h2 style={{ fontSize: '2rem', textTransform: 'uppercase', marginBottom: '8px' }}>💬 Direct Messages</h2>
        <p style={{ color: 'rgba(26,26,26,0.7)', fontWeight: 600 }}>Obrolan pribadi anonim dengan sesama mahasiswa UNNES.</p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1.2fr 1.8fr',
        gap: '30px',
        alignItems: 'stretch',
        minHeight: '500px'
      }} className="chat-layout-grid">
        
        {/* Chat List Left */}
        <div style={{ height: '100%' }}>
          <ChatList activeChatId={selectedChat?.id} onSelectChat={handleSelectChat} />
        </div>

        {/* Chat Room Right */}
        <div style={{ height: '100%' }}>
          <ChatRoom chat={selectedChat} />
        </div>

      </div>

      <style jsx>{`
        @media (max-width: 768px) {
          .chat-layout-grid {
            grid-template-columns: 1fr !important;
            gap: 20px !important;
          }
        }
      `}</style>
    </div>
  );
}
