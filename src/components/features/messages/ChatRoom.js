'use client';
import { useState, useEffect, useRef } from 'react';

export default function ChatRoom({ chat }) {
  const [messages, setMessages] = useState([
    { id: 1, sender: 'them', text: 'Halo bro, nanya tugas lab yang kemarin dong' },
    { id: 2, sender: 'me', text: 'Halo! Yang mana ya? Yang disuruh bikin laporan praktikum?' },
    { id: 3, sender: 'them', text: 'Iya betul, formatnya pake Word atau tulis tangan ya?' },
  ]);
  const [inputText, setInputText] = useState('');
  const chatEndRef = useRef(null);

  useEffect(() => {
    // Reset messages for different chats
    if (chat) {
      setMessages([
        { id: 1, sender: 'them', text: `Halo! Ini ${chat.name} di sini.` },
        { id: 2, sender: 'me', text: `Hai ${chat.name}, ada apa nih?` },
        { id: 3, sender: 'them', text: chat.lastMessage },
      ]);
    }
  }, [chat]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMsg = {
      id: Date.now(),
      sender: 'me',
      text: inputText.trim()
    };

    setMessages([...messages, newMsg]);
    setInputText('');

    // Simulate auto response from target after 1.5s
    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'them',
          text: `Sip! Makasih responnya. (Simulated auto-reply) 👍`
        }
      ]);
    }, 1500);
  };

  if (!chat) {
    return (
      <div className="neo-card" style={{
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        textAlign: 'center',
        padding: '40px 20px',
        color: 'rgba(26,26,26,0.6)',
        marginBottom: 0
      }}>
        <span style={{ fontSize: '3rem' }}>💬</span>
        <h3 style={{ marginTop: '16px' }}>Pilih obrolan untuk memulai chat</h3>
        <p style={{ marginTop: '8px', fontSize: '0.9rem', fontWeight: 600 }}>100% obrolan dienkripsi dan anonim secara default.</p>
      </div>
    );
  }

  return (
    <div className="neo-card" style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      padding: '20px',
      marginBottom: 0
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        borderBottom: 'var(--border-stroke)',
        paddingBottom: '12px',
        marginBottom: '16px'
      }}>
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
        <div>
          <h3 style={{ fontSize: '1.05rem', margin: 0 }}>{chat.name}</h3>
          <span className="neo-badge" style={{ backgroundColor: 'var(--accent-mint)', fontSize: '0.6rem', padding: '1px 6px' }}>Aktif</span>
        </div>
      </div>

      {/* Messages Log */}
      <div style={{
        flexGrow: 1,
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        paddingRight: '4px',
        marginBottom: '16px',
        maxHeight: '400px'
      }}>
        {messages.map(msg => {
          const isMe = msg.sender === 'me';
          return (
            <div
              key={msg.id}
              style={{
                alignSelf: isMe ? 'flex-end' : 'flex-start',
                maxWidth: '75%',
                backgroundColor: isMe ? 'var(--accent-blue)' : 'var(--bg-white)',
                color: isMe ? 'var(--bg-white)' : 'var(--color-black)',
                border: 'var(--border-stroke)',
                borderRadius: 'var(--border-radius-md)',
                padding: '10px 16px',
                fontSize: '0.9rem',
                fontWeight: 600,
                boxShadow: isMe ? '2px 2px 0 0 var(--color-black)' : '2px 2px 0 0 rgba(0,0,0,0.15)',
              }}
            >
              {msg.text}
            </div>
          );
        })}
        <div ref={chatEndRef} />
      </div>

      {/* Input Form */}
      <form onSubmit={handleSendMessage} style={{
        display: 'flex',
        gap: '12px',
        borderTop: 'var(--border-stroke)',
        paddingTop: '16px'
      }}>
        <input
          type="text"
          className="form-control"
          placeholder="Tulis pesan..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          style={{ flexGrow: 1, padding: '10px 16px', margin: 0 }}
          required
        />
        <button type="submit" className="neo-btn blue" style={{ padding: '10px 20px', margin: 0 }}>
          Kirim 🚀
        </button>
      </form>
    </div>
  );
}
