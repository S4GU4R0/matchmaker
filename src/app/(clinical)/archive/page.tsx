import React from 'react';

export default function ArchivePage() {
  const memories = [
    { id: '1', title: 'Initial Calibration', weight: 8, sf: 2.4, status: 'SYNCED', date: '2026-04-20' },
    { id: '2', title: 'First Sensory Exchange', weight: 7, sf: 1.8, status: 'SYNCED', date: '2026-04-21' },
    { id: '3', title: 'Boundary Testing', weight: 9, sf: 3.1, status: 'PENDING', date: '2026-04-22' },
  ];

  return (
    <div className="p-8 space-y-8">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold tracking-widest uppercase">Shadow Library</h1>
          <p className="text-[10px] text-[#A1A1AA]">SECURE MEMORY ARCHIVE</p>
        </div>
        <button className="p-2 border border-[#2DD4BF] text-[#2DD4BF] text-[10px] hover:bg-[#2DD4BF] hover:text-black transition-colors uppercase">
          Manual Sync to Notion
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {memories.map((m) => (
          <div key={m.id} className="bg-[#161618] border border-[#27272A] p-6 space-y-4 relative overflow-hidden group">
            {/* Core Memory Flag */}
            {m.weight === 10 && (
              <div className="absolute top-0 right-0 p-1 bg-[#EF4444] text-black text-[8px] font-bold">CORE</div>
            )}
            
            <div className="flex justify-between items-start">
              <span className="text-[10px] text-[#A1A1AA]">{m.date}</span>
              <span className={`text-[8px] px-1 ${m.status === 'SYNCED' ? 'bg-[#2DD4BF]/20 text-[#2DD4BF]' : 'bg-[#F59E0B]/20 text-[#F59E0B]'}`}>
                {m.status}
              </span>
            </div>

            <h3 className="text-sm font-bold uppercase truncate">{m.title}</h3>
            
            <div className="grid grid-cols-2 gap-4 text-[10px]">
              <div>
                <label className="text-[#A1A1AA] block uppercase">Weight</label>
                <span className="text-[#E1E1E6]">{m.weight}/10</span>
              </div>
              <div>
                <label className="text-[#A1A1AA] block uppercase">Salience</label>
                <span className="text-[#E1E1E6]">{m.sf.toFixed(1)}</span>
              </div>
            </div>

            <div className="pt-4 border-t border-[#27272A] flex justify-between items-center">
              <button className="text-[9px] text-[#A1A1AA] hover:text-[#E1E1E6] uppercase">Inspect Metadata</button>
              <div className="flex space-x-2">
                 <div className="w-1 h-1 bg-[#2DD4BF]"></div>
                 <div className="w-1 h-1 bg-[#2DD4BF]/50"></div>
                 <div className="w-1 h-1 bg-[#2DD4BF]/20"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
