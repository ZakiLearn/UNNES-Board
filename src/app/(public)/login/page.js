'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login, isLoggedIn } = useAuth();
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
      
      await login(email, password);
      router.push('/feed');
    } catch (err) {
      setError('Login gagal. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  if (isLoggedIn) return null;

  return (
    <div className="flex justify-center items-center py-10 px-4">
      <div className="neo-card w-full max-w-[440px] !p-8 !mb-0">
        <div className="text-center mb-6">
          <span className="text-4xl block mb-3">🔑</span>
          <h2 className="text-2xl uppercase mt-3">Masuk UnnesBoard</h2>
          <p className="text-neo-black/60 font-semibold text-sm">
            Nongkrong seru bareng warga kampus UNNES
          </p>
        </div>

        {error && (
          <div className="bg-orange border-2 border-neo-black rounded-sm p-3 font-extrabold text-xs mb-4">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="email-input">Email Mahasiswa</label>
            <input
              type="email"
              id="email-input"
              className="form-control"
              placeholder="contoh: maba@students.unnes.ac.id"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group mb-6">
            <label className="form-label" htmlFor="password-input">Kata Sandi</label>
            <input
              type="password"
              id="password-input"
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
            {loading ? 'Menghubungkan...' : 'Masuk Sekarang 🚀'}
          </button>
        </form>

        <div className="mt-6 text-center font-bold text-sm border-t-2 border-neo-black pt-4">
          Belum punya akun?{' '}
          <Link href="/register" className="text-blue underline">
            Daftar di sini
          </Link>
        </div>
      </div>
    </div>
  );
}
