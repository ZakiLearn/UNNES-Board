'use client';
import { useState } from 'react';

const BANNED_WORDS = ['anjing', 'bangsat', 'tolol', 'goblok', 'bego', 'jancok', 'kontol', 'memek', 'bajingan', 'pantek'];

function filterProfanity(text) {
  let filteredText = text;
  BANNED_WORDS.forEach(word => {
    const regex = new RegExp(word, 'gi');
    filteredText = filteredText.replace(regex, '***');
  });
  return filteredText;
}

export default function MenfessForm({ isOpen, onClose, onSubmit }) {
  const [sender, setSender] = useState('');
  const [recipient, setRecipient] = useState('');
  const [tag, setTag] = useState('Curhat');
  const [content, setContent] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!sender.trim() || !recipient.trim() || !content.trim()) return;

    const filteredContent = filterProfanity(content.trim());
    const filteredSender = filterProfanity(sender.trim());
    const filteredRecipient = filterProfanity(recipient.trim());
    const wasFiltered = 
      filteredContent !== content || 
      filteredSender !== sender || 
      filteredRecipient !== recipient;

    onSubmit({
      sender: filteredSender,
      recipient: filteredRecipient,
      tag,
      content: filteredContent,
      wasFiltered
    });

    // Reset Form
    setSender('');
    setRecipient('');
    setTag('Curhat');
    setContent('');
  };

  return (
    <div className="fixed inset-0 bg-neo-black/60 backdrop-blur-[3px] z-[200] flex items-center justify-center p-4">
      <div className="bg-cream border-2 border-neo-black rounded-lg shadow-neo w-full max-w-[500px] flex flex-col overflow-hidden !mb-0">
        <div className="flex justify-between items-center border-b-2 border-neo-black p-4 bg-white">
          <h3 className="text-lg md:text-xl m-0">Kirim Menfess Baru 📨</h3>
          <button className="text-3xl leading-none font-bold hover:text-orange transition-colors cursor-pointer" onClick={onClose}>
            &times;
          </button>
        </div>
        <div className="p-5 overflow-y-auto max-h-[calc(100vh-140px)]">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="form-sender">Dari (Sender)</label>
              <input 
                type="text" 
                className="form-control" 
                id="form-sender" 
                placeholder="Contoh: Anon-Informatika / Maba Pemalu" 
                value={sender}
                onChange={(e) => setSender(e.target.value)}
                required 
                maxLength={50}
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="form-recipient">Untuk (Recipient)</label>
              <input 
                type="text" 
                className="form-control" 
                id="form-recipient" 
                placeholder="Contoh: Kak tingkat ganteng jas almet / Semua warga UNNES" 
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                required 
                maxLength={50}
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="form-tag">Kategori / Tag</label>
              <select 
                className="form-control" 
                id="form-tag" 
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                required
              >
                <option value="Curhat">#Curhat</option>
                <option value="Akademik">#Akademik</option>
                <option value="Info">#Info</option>
                <option value="Asmara">#Asmara</option>
                <option value="Kantin">#Kantin</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="form-content">Isi Pesan (Menfess)</label>
              <textarea 
                className="form-control" 
                id="form-content" 
                placeholder="Tulis keluh kesahmu di sini... (Sensor kata-kata kotor otomatis!)" 
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required 
                maxLength={500}
              ></textarea>
            </div>
            
            <button type="submit" className="neo-btn blue w-full justify-center mt-3">
              Kirim Menfess 🚀
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
