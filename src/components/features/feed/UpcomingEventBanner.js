'use client';
import { useState } from 'react';

const campusEvents = [
  {
    id: 1,
    title: "Webinar Kepemimpinan Nasional 2026",
    organizer: "BEM KM UNNES",
    date: "12 Juni 2026",
    badge: "Webinar",
    badgeColor: "var(--accent-orange)",
    emoji: "📢",
    link: "https://bem.unnes.ac.id/webinar-leadership"
  },
  {
    id: 2,
    title: "Hackathon UNNES 2026 - Digital Innovation",
    organizer: "HIMA Teknik Informatika",
    date: "18-20 Juni 2026",
    badge: "HIMA",
    badgeColor: "var(--accent-blue)",
    emoji: "💻",
    link: "https://hackathon.unnes.ac.id"
  },
  {
    id: 3,
    title: "Donor Darah Peduli Sesama",
    organizer: "KSR PMI Unit UNNES",
    date: "25 Juni 2026",
    badge: "Sosial",
    badgeColor: "var(--accent-sky)",
    emoji: "🩸",
    link: "https://ksrpmi.unnes.ac.id/donor"
  }
];

export default function UpcomingEventBanner() {
  return (
    <section className="radar-section" style={{ marginTop: '0', marginBottom: '24px' }} id="radar-section-anchor">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <h2 style={{ fontSize: '1.6rem', textTransform: 'uppercase' }}>📡 Radar Event Kampus</h2>
      </div>

      <div className="radar-carousel" style={{ paddingBottom: '12px' }}>
        {campusEvents.map(event => (
          <div key={event.id} className="event-card neo-card" style={{
            flex: '0 0 300px',
            padding: '20px',
            marginBottom: '0',
            backgroundColor: 'var(--bg-white)',
            justifyContent: 'space-between',
          }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span className="neo-badge" style={{ backgroundColor: event.badgeColor, color: event.badgeColor === 'var(--accent-blue)' ? '#fff' : '#000' }}>
                  {event.badge}
                </span>
                <span style={{ fontSize: '1.5rem' }}>{event.emoji}</span>
              </div>
              
              <h4 className="event-title" style={{ minHeight: '48px', fontSize: '1.1rem', marginBottom: '4px' }}>
                {event.title}
              </h4>
              
              <div style={{ fontSize: '0.8rem', color: 'rgba(26, 26, 26, 0.6)', fontWeight: 600, marginBottom: '16px' }}>
                Oleh: {event.organizer}
              </div>
            </div>

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderTop: '2px dashed var(--color-black)',
              paddingTop: '12px',
              marginTop: '12px'
            }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--accent-blue)' }}>
                {event.date}
              </span>
              
              <a 
                href={event.link} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="neo-btn small sky"
                style={{ textDecoration: 'none', margin: '0' }}
              >
                Daftar ➡️
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
