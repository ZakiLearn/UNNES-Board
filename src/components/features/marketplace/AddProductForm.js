'use client';
import { useState } from 'react';

export default function AddProductForm({ isOpen, onClose, onSubmit }) {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [condition, setCondition] = useState('Sangat Baik');
  const [location, setLocation] = useState('Gg. Kalimasada');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('📚');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !price.trim() || !description.trim()) return;

    onSubmit({
      id: Date.now(),
      title: title.trim(),
      price: price.trim(),
      condition,
      location,
      description: description.trim(),
      image,
      status: 'Tersedia',
      seller: 'AnonSeller'
    });

    // Reset Form
    setTitle('');
    setPrice('');
    setCondition('Sangat Baik');
    setLocation('Gg. Kalimasada');
    setDescription('');
    setImage('📚');
  };

  const emojiOptions = ['📚', '💻', '🚲', '🧥', '🎸', '👟', '🔌', '🍳', '🛋️', '🎒'];

  return (
    <div className="fixed inset-0 bg-neo-black/60 backdrop-blur-[3px] z-[200] flex items-center justify-center p-4">
      <div className="bg-cream border-2 border-neo-black rounded-lg shadow-neo w-full max-w-[480px] flex flex-col overflow-hidden !mb-0">
        <div className="flex justify-between items-center border-b-2 border-neo-black p-4 bg-white">
          <h3 className="text-lg md:text-xl m-0">Jual Barang Baru 🛍️</h3>
          <button className="text-3xl leading-none font-bold hover:text-orange transition-colors cursor-pointer" onClick={onClose}>
            &times;
          </button>
        </div>
        <div className="p-5 overflow-y-auto max-h-[calc(100vh-140px)]">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="product-title">Nama Barang</label>
              <input 
                type="text" 
                className="form-control" 
                id="product-title"
                placeholder="Contoh: Buku Kalkulus Purcel Edisi 9" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="form-group">
                <label className="form-label" htmlFor="product-price">Harga (Rp)</label>
                <input 
                  type="text" 
                  className="form-control" 
                  id="product-price"
                  placeholder="Contoh: Rp 50.000" 
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="product-condition">Kondisi</label>
                <select 
                  className="form-control" 
                  id="product-condition"
                  value={condition}
                  onChange={(e) => setCondition(e.target.value)}
                >
                  <option value="Baru">Baru (Segel)</option>
                  <option value="Sangat Baik">Sangat Baik (Mulus)</option>
                  <option value="Baik">Baik (Layak Pakai)</option>
                  <option value="Bekas">Bekas (Ada Lecet)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="form-group">
                <label className="form-label">Emoji Ilustrasi</label>
                <select 
                  className="form-control" 
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                >
                  {emojiOptions.map(emoji => (
                    <option key={emoji} value={emoji}>{emoji}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="product-location">Lokasi COD</label>
                <input 
                  type="text" 
                  className="form-control" 
                  id="product-location"
                  placeholder="Gg. Kalimasada / FIP" 
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group mb-5">
              <label className="form-label" htmlFor="product-description">Deskripsi Barang</label>
              <textarea 
                className="form-control h-20" 
                id="product-description"
                placeholder="Tulis kelengkapan barang, minus pemakaian, dll..." 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              ></textarea>
            </div>
            
            <button type="submit" className="neo-btn blue w-full justify-center !m-0">
              Pasang Iklan 🚀
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
