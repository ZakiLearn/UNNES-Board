'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CreateCommunityPage() {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Hobi');
  const [description, setDescription] = useState('');
  const [logo, setLogo] = useState('👾');
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !description.trim()) return;

    // Show a success message
    alert(`Sukses! Usulan Komunitas "${name}" berhasil dikirim ke moderator. Status persetujuan akan dikirim lewat Notifikasi. 🚀`);
    
    // Redirect back to explore
    router.push('/explore');
  };

  const logoOptions = ['👾', '⚽', '🍗', '🎮', '🎶', '📚', '🎬', '🎨', '🏕️', '📸'];

  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '20px 0' }}>
      <div className="neo-card" style={{ width: '100%', maxWidth: '520px', padding: '32px' }}>
        <h2 style={{ fontSize: '1.8rem', textTransform: 'uppercase', marginBottom: '8px', textAlign: 'center' }}>
          🤝 Usulkan Komunitas Baru
        </h2>
        <p style={{ color: 'rgba(26,26,26,0.6)', fontWeight: 600, fontSize: '0.9rem', marginBottom: '24px', textAlign: 'center' }}>
          Ajukan pembuatan papan komunitas hobi, olahraga, atau tongkrongan mahasiswa baru.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="group-name">Nama Komunitas / Papan</label>
            <input 
              type="text"
              id="group-name"
              className="form-control"
              placeholder="Contoh: UNNES Anime Club / Penikmat Kopi Sekaran"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              maxLength={50}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="group-category">Kategori</label>
              <select
                id="group-category"
                className="form-control"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="Hobi">Hobi</option>
                <option value="Olahraga">Olahraga</option>
                <option value="Gaming">Gaming</option>
                <option value="Kuliner">Kuliner</option>
                <option value="Seni">Seni / Musik</option>
                <option value="Akademik">Akademik</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Emoji Logo</label>
              <select
                className="form-control"
                value={logo}
                onChange={(e) => setLogo(e.target.value)}
              >
                {logoOptions.map(emoji => (
                  <option key={emoji} value={emoji}>{emoji}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '24px' }}>
            <label className="form-label" htmlFor="group-desc">Deskripsi & Aturan Papan</label>
            <textarea
              id="group-desc"
              className="form-control"
              placeholder="Jelaskan tujuan grup, tipe anggota, dan aturan dasar berkumpul..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              maxLength={300}
              style={{ minHeight: '100px' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button 
              type="button" 
              className="neo-btn small sky"
              onClick={() => router.back()}
              style={{ flexGrow: 1, justifyContent: 'center', margin: 0, padding: '12px' }}
            >
              Batal
            </button>
            <button 
              type="submit" 
              className="neo-btn small blue"
              style={{ flexGrow: 2, justifyContent: 'center', margin: 0, padding: '12px' }}
            >
              Kirim Usulan 🚀
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
