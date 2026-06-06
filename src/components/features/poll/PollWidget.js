'use client';

export default function PollWidget({ pollData, votedOptionId, onVote }) {
  const totalVotes = pollData.options.reduce((sum, opt) => sum + opt.votes, 0);

  return (
    <section className="neo-card !p-4 !mb-4" id="polling-widget">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg">🌊 Tes Ombak</h3>
        <span className="neo-badge !bg-orange" id="poll-status-badge">Aktif</span>
      </div>
      <p id="poll-question" className="font-extrabold text-sm mb-3.5">
        {pollData.question}
      </p>
      
      {/* Options Container */}
      <div className="flex flex-col gap-2" id="poll-options-container">
        {pollData.options.map(option => {
          const percent = totalVotes > 0 ? Math.round((option.votes / totalVotes) * 100) : 0;
          const isVoted = votedOptionId == option.id;
          
          return (
            <div 
              key={option.id}
              className={`border-2 border-neo-black rounded-md p-3 relative overflow-hidden transition-all duration-150 select-none ${
                votedOptionId 
                  ? 'cursor-default shadow-none translate-x-[1px] translate-y-[1px] bg-dark-white' 
                  : 'cursor-pointer hover:bg-dark-white shadow-[2px_2px_0px_0px_#1A1A1A] hover:translate-x-[0.5px] hover:translate-y-[0.5px] hover:shadow-[1px_1px_0px_0px_#1A1A1A] bg-white'
              }`}
              onClick={() => !votedOptionId && onVote(option.id)}
            >
              <div 
                className="absolute top-0 left-0 bottom-0 bg-orange/35 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] z-0" 
                style={{ width: `${votedOptionId ? percent : 0}%` }}
              ></div>
              <div className="relative z-10 flex justify-between font-bold text-xs">
                <span>{option.text}</span>
                {votedOptionId && (
                  <span className="font-extrabold text-blue">{percent}%</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="mt-3 text-[10px] md:text-xs text-neo-black/60 font-semibold">
        Total Suara: {totalVotes} Responden
      </div>
    </section>
  );
}
