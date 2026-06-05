'use client';

const officialCommunities = [
  { id: 'bem-km', name: 'BEM KM UNNES', members: 1240, description: 'Badan Eksekutif Mahasiswa Keluarga Mahasiswa UNNES. Pusat koordinasi aspirasi & event.', logo: '🏛️', tag: 'BEM' },
  { id: 'hima-ti', name: 'HIMA Teknik Informatika', members: 450, description: 'Himpunan Mahasiswa TI UNNES. Diskusi seputar coding, tugas, lab, dan karir.', logo: '💻', tag: 'HIMA' },
  { id: 'ksr-pmi', name: 'KSR PMI Unit UNNES', members: 310, description: 'Korps Sukarela Palang Merah Indonesia. Info aksi sosial, donor darah, dan kemanusiaan.', logo: '🩸', tag: 'UKM' },
];

export default function OfficialOrgs({ onSelectBoard }) {
  return (
    <div style={{ marginBottom: '32px' }}>
      <h3 style={{ textTransform: 'uppercase', marginBottom: '16px', fontSize: '1.3rem' }}>
        🏛️ Papan Resmi Organisasi (Official Boards)
      </h3>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '20px'
      }}>
        {officialCommunities.map(org => (
          <div key={org.id} className="neo-card interactive" style={{
            margin: 0,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            backgroundColor: 'var(--bg-white)',
          }} onClick={() => onSelectBoard(org.name)}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <div style={{
                  fontSize: '1.8rem',
                  background: 'var(--accent-sky)',
                  border: 'var(--border-stroke)',
                  borderRadius: 'var(--border-radius-sm)',
                  width: '45px',
                  height: '45px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '2px 2px 0 0 var(--color-black)'
                }}>{org.logo}</div>
                <span className="neo-badge" style={{ backgroundColor: 'var(--accent-orange)' }}>
                  {org.tag}
                </span>
              </div>
              <h4 style={{ fontSize: '1.1rem', marginBottom: '6px' }}>{org.name}</h4>
              <p style={{ fontSize: '0.85rem', color: 'rgba(26,26,26,0.7)', fontWeight: 600, marginBottom: '16px' }}>
                {org.description}
              </p>
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderTop: '2px dashed var(--color-black)',
              paddingTop: '12px',
              marginTop: '12px',
              fontSize: '0.8rem',
              fontWeight: 800
            }}>
              <span style={{ color: 'rgba(26,26,26,0.6)' }}>👥 {org.members} Pengikut</span>
              <span style={{ color: 'var(--accent-blue)', textDecoration: 'underline' }}>Intip Papan ➡️</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
