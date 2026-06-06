'use client';
import { useState } from 'react';

export default function ChatList({ 
  chats = [], 
  activeChatId, 
  onSelectChat, 
  onStartNewChat,
  allAvailableAccounts = [] 
}) {
  const [searchQuery, setSearchQuery] = useState('');

  // Filter existing active chats matching query
  const filteredActiveChats = chats.filter(chat => 
    chat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filter new potential accounts matching query (that are not yet active chats)
  const matchingNewAccounts = searchQuery.trim() === ''
    ? []
    : allAvailableAccounts.filter(acc => 
        acc.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !chats.some(c => c.name.toLowerCase() === acc.name.toLowerCase())
      );

  return (
    <div className="neo-card !p-4 h-full !mb-0 flex flex-col gap-3.5">
      <h3 className="uppercase mb-0 text-base md:text-lg">💬 Percakapan</h3>
      
      {/* Search Input */}
      <div className="relative">
        <input
          type="text"
          placeholder="Cari akun atau mulai obrolan..."
          className="form-control !p-2.5 !m-0 !text-xs !shadow-neo-sm"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {searchQuery && (
          <button 
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-bold text-neo-black/40 hover:text-neo-black"
          >
            &times;
          </button>
        )}
      </div>

      <div className="flex flex-col gap-2 overflow-y-auto max-h-[350px] pr-1">
        {/* Active Chats Header if search query is active */}
        {searchQuery && filteredActiveChats.length > 0 && (
          <div className="text-[10px] font-black text-neo-black/40 uppercase mb-1">Obrolan Aktif</div>
        )}

        {filteredActiveChats.map(chat => {
          const isActive = chat.id === activeChatId;
          const lastMsg = chat.messages && chat.messages.length > 0
            ? chat.messages[chat.messages.length - 1].text
            : 'Mulai percakapan';
          
          return (
            <div
              key={chat.id}
              onClick={() => onSelectChat(chat.id)}
              className={`neo-card interactive !m-0 !p-2.5 flex items-center gap-2.5 border-2 border-neo-black rounded-md transition-all duration-150 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                isActive 
                  ? 'bg-sky translate-x-[2px] translate-y-[2px] shadow-[2px_2px_0_0_#1A1A1A]' 
                  : 'bg-white shadow-neo hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-neo-hover'
              }`}
            >
              <div className="text-lg bg-cream border-2 border-neo-black rounded-full w-9 h-9 flex items-center justify-center flex-shrink-0">
                {chat.avatar}
              </div>
              
              <div className="flex-grow min-w-0">
                <div className="flex justify-between items-center mb-0.5">
                  <span className="font-extrabold text-xs truncate text-neo-black">
                    {chat.name}
                  </span>
                  <span className="text-[9px] text-neo-black/50 font-semibold">
                    {chat.time}
                  </span>
                </div>
                
                <p className={`text-[10px] text-neo-black/70 truncate m-0 ${
                  chat.unread ? 'font-black text-blue' : 'font-medium'
                }`}>
                  {lastMsg}
                </p>
              </div>

              {chat.unread && (
                <div className="w-2.5 h-2.5 rounded-full bg-orange border border-neo-black flex-shrink-0 animate-pulse"></div>
              )}
            </div>
          );
        })}

        {/* Start New Chat Section */}
        {searchQuery && matchingNewAccounts.length > 0 && (
          <div className="mt-3">
            <div className="text-[10px] font-black text-neo-black/40 uppercase mb-1.5">Mulai Obrolan Baru</div>
            <div className="flex flex-col gap-1.5">
              {matchingNewAccounts.map(acc => (
                <div
                  key={acc.name}
                  onClick={() => {
                    onStartNewChat(acc.name);
                    setSearchQuery('');
                  }}
                  className="neo-card interactive !m-0 !p-2 flex items-center justify-between border-2 border-neo-black rounded-md bg-cream shadow-neo-sm hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0_0_#1A1A1A]"
                >
                  <div className="flex items-center gap-2">
                    <div className="text-base bg-white border-2 border-neo-black rounded-full w-7 h-7 flex items-center justify-center flex-shrink-0">
                      {acc.avatar}
                    </div>
                    <span className="font-extrabold text-xs text-neo-black">{acc.name}</span>
                  </div>
                  <span className="neo-badge !bg-blue text-white !text-[9px] !py-0.5 !px-1.5 flex items-center gap-0.5">
                    Chat ➕
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty Search Result */}
        {searchQuery && filteredActiveChats.length === 0 && matchingNewAccounts.length === 0 && (
          <div className="text-center py-6 text-xs text-neo-black/50 font-semibold">
            Akun "{searchQuery}" tidak ditemukan 😢
          </div>
        )}

        {/* Default Empty Active Chats */}
        {!searchQuery && chats.length === 0 && (
          <div className="text-center py-6 text-xs text-neo-black/50 font-semibold">
            Belum ada obrolan aktif.
          </div>
        )}
      </div>
    </div>
  );
}
