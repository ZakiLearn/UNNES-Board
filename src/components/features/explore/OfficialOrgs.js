'use client';

const officialCommunities = [
  { id: 'bem-km', name: 'BEM KM UNNES', members: 1240, description: 'Badan Eksekutif Mahasiswa Keluarga Mahasiswa UNNES. Pusat koordinasi aspirasi & event.', logo: '🏛️', tag: 'BEM' },
  { id: 'hima-ti', name: 'HIMA Teknik Informatika', members: 450, description: 'Himpunan Mahasiswa TI UNNES. Diskusi seputar coding, tugas, lab, dan karir.', logo: '💻', tag: 'HIMA' },
  { id: 'ksr-pmi', name: 'KSR PMI Unit UNNES', members: 310, description: 'Korps Sukarela Palang Merah Indonesia. Info aksi sosial, donor darah, dan kemanusiaan.', logo: '🩸', tag: 'UKM' },
];

export default function OfficialOrgs({ onSelectBoard }) {
  return (
    <div className="mb-8">
      <h3 className="uppercase mb-4 text-base md:text-lg">
        🏛️ Papan Resmi Organisasi (Official Boards)
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {officialCommunities.map(org => (
          <div key={org.id} className="neo-card interactive !m-0 flex flex-col justify-between bg-white" onClick={() => onSelectBoard(org.name)}>
            <div>
              <div className="flex justify-between items-center mb-3">
                <div className="text-3xl bg-sky border-2 border-neo-black rounded-sm w-[45px] h-[45px] flex items-center justify-center shadow-[2px_2px_0_0_#1A1A1A]">{org.logo}</div>
                <span className="neo-badge !bg-orange">
                  {org.tag}
                </span>
              </div>
              <h4 className="text-base md:text-lg mb-1">{org.name}</h4>
              <p className="text-xs md:text-sm text-neo-black/70 font-semibold mb-4">
                {org.description}
              </p>
            </div>
            <div className="flex justify-between items-center border-t-2 border-dashed border-neo-black pt-3 mt-3 text-xs font-black">
              <span className="text-neo-black/60">👥 {org.members} Pengikut</span>
              <span className="text-blue underline">Intip Papan ➡️</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
