'use client';
import { useState, useEffect, useRef } from 'react';

export default function ChatRoom({ chat, onSendMessage }) {
  const [inputText, setInputText] = useState('');
  const chatEndRef = useRef(null);

  const messages = chat ? chat.messages || [] : [];

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    onSendMessage(chat.id, inputText);
    setInputText('');
  };

  if (!chat) {
    return (
      <div className="neo-card flex flex-col justify-center items-center text-center p-10 text-neo-black/60 h-full !mb-0">
        <span className="text-5xl block mb-3">💬</span>
        <h3 className="mt-4">Pilih obrolan untuk memulai chat</h3>
        <p className="mt-2 text-sm font-semibold">100% obrolan dienkripsi dan anonim secara default.</p>
      </div>
    );
  }

  return (
    <div className="neo-card flex flex-col h-full !p-4 !mb-0 min-h-[500px] justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center gap-3 border-b-2 border-neo-black pb-3 mb-4">
          <div className="text-xl bg-cream border-2 border-neo-black rounded-full w-9 h-9 flex items-center justify-center flex-shrink-0">
            {chat.avatar}
          </div>
          <div>
            <h3 className="text-base m-0 leading-tight">{chat.name}</h3>
            <span className="neo-badge !bg-mint !text-[9px] !py-0.5 !px-1.5 mt-1">Aktif</span>
          </div>
        </div>

        {/* Messages Log */}
        <div className="flex-grow overflow-y-auto flex flex-col gap-3 pr-1 mb-4 max-h-[300px] md:max-h-[350px]">
          {messages.map(msg => {
            const isMe = msg.sender === 'me';
            return (
              <div
                key={msg.id}
                className={`max-w-[75%] rounded-md border-2 border-neo-black px-4 py-2.5 text-xs md:text-sm font-semibold shadow-[2px_2px_0_0_#1a1a1a] ${
                  isMe 
                    ? 'self-end bg-blue text-white' 
                    : 'self-start bg-white text-neo-black shadow-[2px_2px_0_0_rgba(0,0,0,0.15)]'
                }`}
              >
                {msg.text}
              </div>
            );
          })}
          <div ref={chatEndRef} />
        </div>
      </div>

      {/* Input Form */}
      <form onSubmit={handleSendMessage} className="flex gap-3 border-t-2 border-neo-black pt-4 mt-auto">
        <input
          type="text"
          className="form-control !p-2.5 !m-0 flex-grow !text-xs"
          placeholder="Tulis pesan..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          required
        />
        <button type="submit" className="neo-btn blue small !m-0 !py-2.5 !px-4 flex-shrink-0">
          Kirim 🚀
        </button>
      </form>
    </div>
  );
}
