'use client';
import { useState, useEffect } from 'react';
import ChatList from '@/components/features/messages/ChatList';
import ChatRoom from '@/components/features/messages/ChatRoom';

const allAvailableAccounts = [
  { name: 'MabaSambatTI', avatar: '🦊' },
  { name: 'SecretAdmirer', avatar: '🐱' },
  { name: 'KenyangTerus', avatar: '🐼' },
  { name: 'InfoUNNES', avatar: '🏫' },
  { name: 'KatingAlmetKuning', avatar: '🦁' },
  { name: 'AnonKimia', avatar: '🧪' },
  { name: 'GeprekBuRum', avatar: '🍗' },
  { name: 'BEM KM UNNES', avatar: '📢' },
  { name: 'HIMA Teknik Informatika', avatar: '💻' },
  { name: 'KSR PMI Unit UNNES', avatar: '🩸' }
];

const defaultChats = [
  { 
    id: 1, 
    name: 'AnonKimia', 
    avatar: '🧪', 
    time: '14.25', 
    unread: true, 
    messages: [
      { id: 1, sender: 'them', text: 'Halo! Ini AnonKimia di sini.' },
      { id: 2, sender: 'me', text: 'Hai AnonKimia, ada apa nih?' },
      { id: 3, sender: 'them', text: 'Jas labnya besok pagi aja ya bro' }
    ]
  },
  { 
    id: 2, 
    name: 'GeprekBuRum', 
    avatar: '🍗', 
    time: 'Kemarin', 
    unread: false, 
    messages: [
      { id: 1, sender: 'them', text: 'Halo! Ini GeprekBuRum di sini.' },
      { id: 2, sender: 'me', text: 'Hai GeprekBuRum, ada apa nih?' },
      { id: 3, sender: 'them', text: 'Ada diskon buat kating almet kuning!' }
    ]
  },
  { 
    id: 3, 
    name: 'KatingAlmetKuning', 
    avatar: '🦁', 
    time: 'Kamis', 
    unread: false, 
    messages: [
      { id: 1, sender: 'them', text: 'Halo! Ini KatingAlmetKuning di sini.' },
      { id: 2, sender: 'me', text: 'Hai KatingAlmetKuning, ada apa nih?' },
      { id: 3, sender: 'them', text: 'Makanya kalau kuliah pagi jangan begadang dek' }
    ]
  }
];

export default function MessagesPage() {
  const [chats, setChats] = useState([]);
  const [selectedChatId, setSelectedChatId] = useState(null);

  useEffect(() => {
    const savedChats = localStorage.getItem('unnes_board_chats');
    if (savedChats) {
      setChats(JSON.parse(savedChats));
    } else {
      setChats(defaultChats);
      localStorage.setItem('unnes_board_chats', JSON.stringify(defaultChats));
    }
  }, []);

  const handleSelectChat = (chatId) => {
    setSelectedChatId(chatId);
    
    // Mark chat as read
    const updatedChats = chats.map(c => {
      if (c.id === chatId) {
        return { ...c, unread: false };
      }
      return c;
    });
    setChats(updatedChats);
    localStorage.setItem('unnes_board_chats', JSON.stringify(updatedChats));
  };

  const handleStartNewChat = (accountName) => {
    const account = allAvailableAccounts.find(a => a.name === accountName);
    if (!account) return;

    // Check if chat already exists
    const existingChat = chats.find(c => c.name === accountName);
    if (existingChat) {
      handleSelectChat(existingChat.id);
      return;
    }

    const newChatId = Date.now();
    const newChat = {
      id: newChatId,
      name: account.name,
      avatar: account.avatar,
      time: 'Baru',
      unread: false,
      messages: [
        { id: Date.now(), sender: 'them', text: `Halo! Ini ${account.name} di sini. Ada yang bisa dibantu? 💬` }
      ]
    };

    const updatedChats = [newChat, ...chats];
    setChats(updatedChats);
    setSelectedChatId(newChatId);
    localStorage.setItem('unnes_board_chats', JSON.stringify(updatedChats));
  };

  const handleSendMessage = (chatId, text) => {
    const now = new Date();
    const timeString = `${String(now.getHours()).padStart(2, '0')}.${String(now.getMinutes()).padStart(2, '0')}`;

    const updatedChats = chats.map(c => {
      if (c.id === chatId) {
        const nextMessages = [
          ...c.messages,
          { id: Date.now(), sender: 'me', text: text.trim() }
        ];
        return {
          ...c,
          time: timeString,
          messages: nextMessages
        };
      }
      return c;
    });

    setChats(updatedChats);
    localStorage.setItem('unnes_board_chats', JSON.stringify(updatedChats));

    // Simulated response
    setTimeout(() => {
      const simulatedTime = new Date();
      const simTimeString = `${String(simulatedTime.getHours()).padStart(2, '0')}.${String(simulatedTime.getMinutes()).padStart(2, '0')}`;

      setChats(prevChats => {
        const next = prevChats.map(c => {
          if (c.id === chatId) {
            const isCurrentActive = selectedChatId === chatId;
            return {
              ...c,
              time: simTimeString,
              unread: !isCurrentActive,
              messages: [
                ...c.messages,
                {
                  id: Date.now(),
                  sender: 'them',
                  text: `Sip! Makasih responnya. (Simulated auto-reply) 👍`
                }
              ]
            };
          }
          return c;
        });
        localStorage.setItem('unnes_board_chats', JSON.stringify(next));
        return next;
      });
    }, 1500);
  };

  const selectedChat = chats.find(c => c.id === selectedChatId) || null;

  return (
    <div className="flex flex-col gap-4 md:gap-5 h-full">
      <div>
        <h2 className="text-xl md:text-2xl uppercase mb-1">💬 Direct Messages</h2>
        <p className="text-neo-black/70 font-semibold text-xs md:text-sm">Obrolan pribadi anonim dengan sesama mahasiswa UNNES.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1.2fr_1.8fr] gap-4 md:gap-5 items-stretch min-h-[500px]">
        {/* Chat List Left */}
        <div className="h-full">
          <ChatList 
            chats={chats}
            activeChatId={selectedChatId} 
            onSelectChat={handleSelectChat}
            onStartNewChat={handleStartNewChat}
            allAvailableAccounts={allAvailableAccounts}
          />
        </div>

        {/* Chat Room Right */}
        <div className="h-full">
          <ChatRoom 
            chat={selectedChat} 
            onSendMessage={handleSendMessage}
          />
        </div>
      </div>
    </div>
  );
}
