import './globals.css';
import { AuthProvider } from '@/context/AuthContext';

export const metadata = {
  title: 'UnnesBoard - Tongkrongan Digital Mahasiswa UNNES',
  description: 'UnnesBoard - Papan pengumuman digital dan ruang nongkrong mahasiswa UNNES yang social-first, interaktif, dan penuh estetika Gen-Z.',
  keywords: ['UNNES', 'Universitas Negeri Semarang', 'UnnesBoard', 'ZonaKampus', 'Menfess', 'Polling Kampus', 'Event Kampus'],
  authors: [{ name: 'UnnesBoard Team' }],
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
