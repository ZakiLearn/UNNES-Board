'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register, isLoggedIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoggedIn) {
      router.replace('/feed');
    }
  }, [isLoggedIn, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (name.trim().length < 3) {
        setError('Nama minimal 3 karakter.');
        setLoading(false);
        return;
      }
      if (!email.includes('@')) {
        setError('Silakan masukkan email yang valid.');
        setLoading(false);
        return;
      }
      if (password.length < 4) {
        setError('Password minimal 4 karakter.');
        setLoading(false);
        return;
      }

      await register(name.trim(), email, password);
      router.push('/feed');
    } catch (err) {
      setError('Pendaftaran gagal. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  if (isLoggedIn) return null;

  return (
    <div className="flex justify-center items-center py-10 px-4">
      <div className="neo-card w-full max-w-[440px] !p-8 !mb-0">
        <div className="text-center mb-6">
          <span className="text-4xl block mb-3">📝</span>
          <h2 className="text-2xl uppercase mt-3">Daftar UnnesBoard</h2>
          <p className="text-neo-black/60 font-semibold text-sm">
            Buat akun untuk mulai berinteraksi dengan mahasiswa lainnya
          </p>
        </div>

        {error && (
          <div className="bg-orange border-2 border-neo-black rounded-sm p-3 font-extrabold text-xs mb-4">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="register-name">Nama Panggilan / Alias</label>
            <input
              type="text"
              id="register-name"
              className="form-control"
              placeholder="Contoh: SecretMaba / KatingBaik"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="register-email">Email Mahasiswa</label>
            <input
              type="email"
              id="register-email"
              className="form-control"
              placeholder="contoh: maba@students.unnes.ac.id"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group mb-6">
            <label className="form-label" htmlFor="register-password">Kata Sandi</label>
            <input
              type="password"
              id="register-password"
              className="form-control"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="neo-btn blue w-full justify-center text-lg py-3"
            disabled={loading}
          >
            {loading ? 'Membuat Akun...' : 'Daftar Sekarang 🚀'}
          </button>
        </form>

        <div className="mt-6 text-center font-bold text-sm border-t-2 border-neo-black pt-4">
          Sudah punya akun?{' '}
          <Link href="/login" className="text-blue underline">
            Masuk di sini
          </Link>
        </div>
      </div>
    </div>
  );
}
