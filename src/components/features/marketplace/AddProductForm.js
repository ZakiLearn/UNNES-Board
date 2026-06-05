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
    <div className="modal-overlay active">
      <div className="modal-content neo-card" style={{ maxWidth: '480px' }}>
        <div className="modal-header">
          <h3>Jual Barang Baru 🛍️</h3>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>
        <div className="modal-body">
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

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
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

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '12px' }}>
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

            <div className="form-group" style={{ marginBottom: '20px' }}>
              <label className="form-label" htmlFor="product-description">Deskripsi Barang</label>
              <textarea 
                className="form-control" 
                id="product-description"
                placeholder="Tulis kelengkapan barang, minus pemakaian, dll..." 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                style={{ minHeight: '80px' }}
              ></textarea>
            </div>
            
            <button type="submit" className="neo-btn blue" style={{ width: '100%', justifyContent: 'center', margin: 0 }}>
              Pasang Iklan 🚀
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
