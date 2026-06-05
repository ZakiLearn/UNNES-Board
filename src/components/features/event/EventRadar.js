'use client';

export default function EventRadar({ events }) {
  return (
    <section className="radar-section" id="radar-section-anchor">
      <div style={{ display: 'flex', alignItems: 'center', justifyBetween: 'space-between', marginBottom: '16px', justifyContent: 'space-between' }}>
        <h3 style={{ fontSize: '1.4rem' }}>📡 Radar Event</h3>
        <span className="neo-badge" style={{ backgroundColor: 'var(--accent-sky)' }}>HOT</span>
      </div>
      
      {/* Event Carousel */}
      <div className="radar-carousel">
        {events.map((event, index) => (
          <div 
            key={index}
            className="neo-card event-card interactive"
            onClick={() => window.open(event.link, '_blank')}
          >
            <div className="event-poster-container">
              <span className="neo-badge event-badge" style={{ backgroundColor: event.badgeColor }}>{event.badge}</span>
              <img 
                className="event-poster" 
                src={event.image} 
                alt={event.title} 
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/280x350/F8E6A0/1A1A1A?text=Event+Poster';
                }}
              />
            </div>
            <div className="event-info">
              <div>
                <h4 className="event-title" style={{ minHeight: '44px' }}>{event.title}</h4>
                <div className="event-meta">📍 {event.organizer}</div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent-blue)' }}>{event.date}</span>
                <span className="neo-btn small blue">Daftar</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
