'use client';

export default function PollWidget({ pollData, votedOptionId, onVote }) {
  const totalVotes = pollData.options.reduce((sum, opt) => sum + opt.votes, 0);

  return (
    <section className="neo-card" id="polling-widget">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <h3 style={{ fontSize: '1.4rem' }}>🌊 Tes Ombak</h3>
        <span className="neo-badge" style={{ backgroundColor: 'var(--accent-orange)' }} id="poll-status-badge">Aktif</span>
      </div>
      <p id="poll-question" style={{ fontWeight: 800, fontSize: '1.1rem', marginBottom: '20px' }}>
        {pollData.question}
      </p>
      
      {/* Options Container */}
      <div id="poll-options-container">
        {pollData.options.map(option => {
          const percent = totalVotes > 0 ? Math.round((option.votes / totalVotes) * 100) : 0;
          const isVoted = votedOptionId == option.id;
          
          return (
            <div 
              key={option.id}
              className={`poll-option ${votedOptionId ? 'voted' : ''}`}
              onClick={() => !votedOptionId && onVote(option.id)}
            >
              <div 
                className="poll-option-progress" 
                style={{ width: `${votedOptionId ? percent : 0}%` }}
              ></div>
              <div className="poll-option-content">
                <span>{option.text}</span>
                {votedOptionId && (
                  <span style={{ fontWeight: 800, color: 'var(--accent-blue)' }}>{percent}%</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
      
      <div style={{ marginTop: '16px', fontSize: '0.8rem', color: 'rgba(26, 26, 26, 0.6)', fontWeight: 600 }}>
        Total Suara: {totalVotes} responden
      </div>
    </section>
  );
}
