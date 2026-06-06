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
    <div className="flex justify-center items-center py-5">
      <div className="neo-card w-full max-w-[520px] !p-8 !mb-0">
        <h2 className="text-xl md:text-2xl uppercase mb-2 text-center">
          🤝 Usulkan Komunitas Baru
        </h2>
        <p className="text-neo-black/60 font-semibold text-xs md:text-sm mb-6 text-center">
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

          <div className="grid grid-cols-2 gap-4">
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

          <div className="form-group mb-6">
            <label className="form-label" htmlFor="group-desc">Deskripsi & Aturan Papan</label>
            <textarea
              id="group-desc"
              className="form-control h-28"
              placeholder="Jelaskan tujuan grup, tipe anggota, dan aturan dasar berkumpul..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              maxLength={300}
            />
          </div>

          <div className="flex gap-3">
            <button 
              type="button" 
              className="neo-btn small sky w-full justify-center !m-0 !py-3"
              onClick={() => router.back()}
            >
              Batal
            </button>
            <button 
              type="submit" 
              className="neo-btn small blue w-full justify-center !m-0 !py-3"
            >
              Kirim Usulan 🚀
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
