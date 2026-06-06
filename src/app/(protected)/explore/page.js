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
    <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-4 md:gap-5">
      {/* Left Column */}
      <div className="flex flex-col gap-4">
        <div>
          <h2 className="text-xl md:text-2xl uppercase mb-1">📡 Explore Communities</h2>
          <p className="text-neo-black/70 font-semibold text-xs md:text-sm">Temukan papan pengumuman resmi dan obrolan komunitas mahasiswa UNNES.</p>
        </div>

        <OfficialOrgs onSelectBoard={handleSelectBoard} />
        <UnofficialOrgs onSelectBoard={handleSelectBoard} />
      </div>

      {/* Right Column */}
      <div className="hidden lg:flex flex-col gap-4">
        {/* Guidelines Widget */}
        <div className="neo-card !p-4 !mb-0">
          <h3 className="text-base mb-3">📋 Ketentuan Papan</h3>
          <ol className="list-decimal pl-4 text-xs font-semibold text-neo-black/80 space-y-2">
            <li>Gunakan bahasa sopan dan saling menghargai.</li>
            <li>Dilarang spamming, beriklan di luar marketplace, atau menyebar hoax.</li>
            <li>Papan diskusi resmi dikelola oleh organisasi penanggung jawab.</li>
          </ol>
        </div>

        {/* Action Widget */}
        <div className="neo-card !p-4 !mb-0 bg-sky">
          <h3 className="text-base mb-2">Ingin buat grup baru? 📢</h3>
          <p className="text-xs font-semibold mb-3">Buat papan obrolan komunitas untuk UKM, paguyuban daerah, atau kelompok belajar Anda!</p>
          <a href="/communities/create" className="neo-btn small blue w-full justify-center !m-0">
            Buat Komunitas ➕
          </a>
        </div>
      </div>

      {/* Interactive Board Modal */}
      {selectedBoard && (
        <div className="fixed inset-0 bg-neo-black/60 backdrop-blur-[3px] z-[200] flex items-center justify-center p-4">
          <div className="bg-cream border-2 border-neo-black rounded-lg shadow-neo w-full max-w-[500px] flex flex-col overflow-hidden !mb-0">
            <div className="flex justify-between items-center border-b-2 border-neo-black p-4 bg-white">
              <h3 className="text-lg md:text-xl m-0">📌 Papan {selectedBoard}</h3>
              <button className="text-3xl leading-none font-bold hover:text-orange transition-colors cursor-pointer" onClick={() => setSelectedBoard(null)}>
                &times;
              </button>
            </div>
            <div className="p-5 overflow-y-auto max-h-[calc(100vh-140px)]">
              <div className="flex flex-col gap-3 mb-5">
                {activeMessages.map(msg => (
                  <div key={msg.id} className="bg-white border-2 border-neo-black rounded-sm p-3 shadow-[2px_2px_0px_0px_#1A1A1A]">
                    <div className="font-extrabold text-xs text-blue mb-1">
                      @{msg.sender}
                    </div>
                    <p className="text-sm font-semibold m-0">{msg.text}</p>
                  </div>
                ))}
              </div>
              <button 
                onClick={() => setSelectedBoard(null)}
                className="neo-btn blue w-full justify-center !m-0"
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
