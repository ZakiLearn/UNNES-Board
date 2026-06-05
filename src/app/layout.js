import './globals.css';

export const metadata = {
  title: 'ZonaKampus - Tongkrongan Digital UnnesBoard',
  description: 'ZonaKampus (UnnesBoard) - Papan pengumuman digital dan ruang nongkrong mahasiswa UNNES yang social-first, interaktif, dan penuh estetika Gen-Z.',
  keywords: ['UNNES', 'Universitas Negeri Semarang', 'UnnesBoard', 'ZonaKampus', 'Menfess', 'Polling Kampus', 'Event Kampus'],
  authors: [{ name: 'ZonaKampus Team' }],
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>
        {children}
      </body>
    </html>
  );
}
