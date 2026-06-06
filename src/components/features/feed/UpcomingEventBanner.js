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
    <section className="m-0 mb-4" id="radar-section-anchor">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg md:text-xl uppercase">📡 Radar Event Kampus</h2>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory">
        {campusEvents.map(event => (
          <div key={event.id} className="neo-card flex-shrink-0 w-[230px] md:w-[250px] snap-start !p-4 !mb-0 bg-white flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="neo-badge" style={{ backgroundColor: event.badgeColor, color: event.badgeColor === 'var(--accent-blue)' ? '#fff' : '#000' }}>
                  {event.badge}
                </span>
                <span className="text-xl">{event.emoji}</span>
              </div>
              
              <h4 className="font-extrabold text-[13px] md:text-sm mb-0.5 min-h-[40px] leading-snug">
                {event.title}
              </h4>
              
              <div className="text-[10px] md:text-xs text-neo-black/60 font-semibold mb-3">
                Oleh: {event.organizer}
              </div>
            </div>

            <div className="flex justify-between items-center border-t-2 border-dashed border-neo-black pt-2.5 mt-2.5">
              <span className="text-xs font-black text-blue">
                {event.date}
              </span>
              
              <a 
                href={event.link} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="neo-btn small sky !m-0"
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
