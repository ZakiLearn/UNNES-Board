'use client';
import { useState } from 'react';
import OfficialOrgs from '@/components/features/explore/OfficialOrgs';
import UnofficialOrgs from '@/components/features/explore/UnofficialOrgs';

export default function ExplorePage() {
  const [selectedBoard, setSelectedBoard] = useState(null);

  const mockBoardMessages = {
    'BEM KM UNNES': [
      { id: 1, sender: 'KabinetHarmoni', text: 'Konsolidasi Akbar menyambut Dies Natalis ke-61 UNNES diadakan hari Senin besok di Rektorat.' },
      { id: 2, sender: 'AdvokasiBEM', text: 'Bagi mahasiswa yang terkendala UKT, silakan unggah berkas bantuan keringanan sebelum jam 17.00.' }
    ],
    'HIMA Teknik Informatika': [
      { id: 1, sender: 'AslabStrukturData', text: 'Tugas Praktikum 4 sudah diunggah di ELENA. Deadline Jumat malam!' },
      { id: 2, sender: 'KetuaHima', text: 'Pendaftaran Hackathon UNNES diperpanjang sampai hari Rabu ini. Buruan daftar!' }
    ],
    'KSR PMI Unit UNNES': [
      { id: 1, sender: 'HumasPMI', text: 'Terima kasih atas partisipasi 150 pendonor hari ini. Total 120 kantong darah terkumpul!' }
    ]
  };

  const handleSelectBoard = (name) => {
    setSelectedBoard(name);
  };

  const activeMessages = mockBoardMessages[selectedBoard] || [
    { id: 1, sender: 'AdminGrup', text: `Selamat datang di papan komunitas ${selectedBoard}! Yuk sharing bareng di sini.` },
    { id: 2, sender: 'AnonMaba', text: 'Ada yang besok mau barengan COD di Sekaran?' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
      <div>
        <h2 style={{ fontSize: '2rem', textTransform: 'uppercase', marginBottom: '8px' }}>📡 Explore Communities</h2>
        <p style={{ color: 'rgba(26,26,26,0.7)', fontWeight: 600 }}>Temukan papan pengumuman resmi dan obrolan komunitas mahasiswa UNNES.</p>
      </div>

      <OfficialOrgs onSelectBoard={handleSelectBoard} />
      <UnofficialOrgs onSelectBoard={handleSelectBoard} />

      {/* Interactive Board Modal */}
      {selectedBoard && (
        <div className="modal-overlay active">
          <div className="modal-content neo-card" style={{ maxWidth: '500px' }}>
            <div className="modal-header">
              <h3>📌 Papan {selectedBoard}</h3>
              <button className="modal-close" onClick={() => setSelectedBoard(null)}>&times;</button>
            </div>
            <div className="modal-body">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
                {activeMessages.map(msg => (
                  <div key={msg.id} style={{
                    background: 'var(--bg-white)',
                    border: 'var(--border-stroke)',
                    borderRadius: 'var(--border-radius-sm)',
                    padding: '12px',
                    boxShadow: '2px 2px 0 0 var(--color-black)'
                  }}>
                    <div style={{ fontWeight: 800, fontSize: '0.85rem', color: 'var(--accent-blue)', marginBottom: '4px' }}>
                      @{msg.sender}
                    </div>
                    <p style={{ fontSize: '0.9rem', fontWeight: 600, margin: 0 }}>{msg.text}</p>
                  </div>
                ))}
              </div>
              <button 
                onClick={() => setSelectedBoard(null)}
                className="neo-btn blue" 
                style={{ width: '100%', justifyContent: 'center', margin: 0 }}
              >
                Tutup Papan 🚪
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
