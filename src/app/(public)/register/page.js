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
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '40px 0'
    }}>
      <div className="neo-card" style={{ width: '100%', maxWidth: '440px', padding: '32px' }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <span style={{ fontSize: '2.5rem' }}>📝</span>
          <h2 style={{ fontSize: '1.8rem', textTransform: 'uppercase', marginTop: '12px' }}>Daftar UnnesBoard</h2>
          <p style={{ color: 'rgba(26,26,26,0.6)', fontWeight: 600, fontSize: '0.9rem' }}>
            Buat akun untuk mulai berinteraksi dengan mahasiswa lainnya
          </p>
        </div>

        {error && (
          <div style={{
            backgroundColor: 'var(--accent-orange)',
            border: 'var(--border-stroke)',
            borderRadius: 'var(--border-radius-sm)',
            padding: '10px 14px',
            fontWeight: 800,
            fontSize: '0.85rem',
            marginBottom: '16px'
          }}>
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

          <div className="form-group" style={{ marginBottom: '24px' }}>
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
            className="neo-btn blue"
            style={{ width: '100%', justifyContent: 'center', fontSize: '1.05rem', padding: '12px' }}
            disabled={loading}
          >
            {loading ? 'Membuat Akun...' : 'Daftar Sekarang 🚀'}
          </button>
        </form>

        <div style={{
          marginTop: '24px',
          textAlign: 'center',
          fontWeight: 700,
          fontSize: '0.9rem',
          borderTop: 'var(--border-stroke)',
          paddingTop: '16px'
        }}>
          Sudah punya akun?{' '}
          <Link href="/login" style={{ color: 'var(--accent-blue)', textDecoration: 'underline' }}>
            Masuk di sini
          </Link>
        </div>
      </div>
    </div>
  );
}
