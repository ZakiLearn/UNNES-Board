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
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '40px 0'
    }}>
      <div className="neo-card" style={{ width: '100%', maxWidth: '440px', padding: '32px' }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <span style={{ fontSize: '2.5rem' }}>🔑</span>
          <h2 style={{ fontSize: '1.8rem', textTransform: 'uppercase', marginTop: '12px' }}>Masuk UnnesBoard</h2>
          <p style={{ color: 'rgba(26,26,26,0.6)', fontWeight: 600, fontSize: '0.9rem' }}>
            Nongkrong seru bareng warga kampus UNNES
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

          <div className="form-group" style={{ marginBottom: '24px' }}>
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
            className="neo-btn blue"
            style={{ width: '100%', justifyContent: 'center', fontSize: '1.05rem', padding: '12px' }}
            disabled={loading}
          >
            {loading ? 'Menghubungkan...' : 'Masuk Sekarang 🚀'}
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
          Belum punya akun?{' '}
          <Link href="/register" style={{ color: 'var(--accent-blue)', textDecoration: 'underline' }}>
            Daftar di sini
          </Link>
        </div>
      </div>
    </div>
  );
}
