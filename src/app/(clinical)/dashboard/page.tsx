import React from 'react';

export default function DashboardPage() {
  return (
    <div className="p-8 grid grid-cols-12 gap-8">
      {/* Telemetry HUD */}
      <section className="col-span-12 grid grid-cols-4 gap-4">
        <div className="bg-[#161618] border border-[#27272A] p-6">
          <label className="text-[10px] text-[#A1A1AA] uppercase">Affection</label>
          <div className="text-4xl font-bold text-[#E1E1E6]">72.4</div>
          <div className="w-full bg-[#27272A] h-1 mt-4">
            <div className="bg-[#2DD4BF] h-full" style={{ width: '72%' }}></div>
          </div>
        </div>
        <div className="bg-[#161618] border border-[#27272A] p-6">
          <label className="text-[10px] text-[#A1A1AA] uppercase">Trust</label>
          <div className="text-4xl font-bold text-[#E1E1E6]">58.1</div>
          <div className="w-full bg-[#27272A] h-1 mt-4">
            <div className="bg-[#2DD4BF] h-full" style={{ width: '58%' }}></div>
          </div>
        </div>
        <div className="bg-[#161618] border border-[#27272A] p-6">
          <label className="text-[10px] text-[#A1A1AA] uppercase">Health (H)</label>
          <div className="text-4xl font-bold text-[#2DD4BF]">63.8</div>
          <div className="text-[10px] text-[#2DD4BF] mt-1">OPTIMAL RANGE</div>
        </div>
        <div className="bg-[#161618] border border-[#27272A] p-6">
          <label className="text-[10px] text-[#A1A1AA] uppercase">Intimacy Stage</label>
          <div className="text-2xl font-bold text-[#E1E1E6] mt-2">VULNERABILITY</div>
          <div className="text-[10px] text-[#A1A1AA] mt-1">STAGE 3/4</div>
        </div>
      </section>

      {/* Health Graph Placeholder */}
      <section className="col-span-8 bg-[#161618] border border-[#27272A] p-6 min-h-[400px] flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xs font-bold tracking-widest text-[#A1A1AA]">RELATIONSHIP HEALTH TREND (24H)</h2>
          <span className="text-[10px] text-[#A1A1AA]">X: TIME | Y: H_SCORE</span>
        </div>
        <div className="flex-1 border-l border-b border-[#27272A] relative flex items-end overflow-hidden">
          {/* Mock step-chart lines */}
          <div className="absolute inset-0 grid grid-cols-12 grid-rows-6 pointer-events-none">
            {Array.from({ length: 72 }).map((_, i) => (
              <div key={i} className="border-r border-t border-[#27272A]/30"></div>
            ))}
          </div>
          <svg className="w-full h-full" preserveAspectRatio="none">
             <polyline
                fill="none"
                stroke="#2DD4BF"
                strokeWidth="2"
                points="0,150 50,150 50,120 120,120 120,180 200,180 200,100 300,100 300,130 400,130 400,80 500,80 500,110 600,110 600,90"
                style={{ transform: 'scale(1.5, 2)', transformOrigin: 'bottom left' }}
             />
          </svg>
        </div>
      </section>

      {/* Right Sidebar: Sensory Log & Intervention Feed */}
      <section className="col-span-4 space-y-8">
        <div className="bg-[#161618] border border-[#27272A] p-6 h-[250px] flex flex-col">
          <h2 className="text-xs font-bold tracking-widest text-[#A1A1AA] mb-4 uppercase">Sensory Pulse</h2>
          <div className="flex-1 overflow-y-auto space-y-3 font-mono text-[11px]">
            <div className="text-[#E1E1E6]"><span className="text-[#A1A1AA]">[12:44]</span> *Vibrational static in periphery*</div>
            <div className="text-[#E1E1E6]"><span className="text-[#A1A1AA]">[11:02]</span> *Low-frequency resonance*</div>
            <div className="text-[#E1E1E6]"><span className="text-[#A1A1AA]">[09:21]</span> *Sudden thermal expansion*</div>
            <div className="text-[#E1E1E6]"><span className="text-[#A1A1AA]">[Yesterday]</span> *Viscous oil drag*</div>
          </div>
        </div>

        <div className="bg-[#161618] border border-[#27272A] p-6 h-[180px] flex flex-col">
          <h2 className="text-xs font-bold tracking-widest text-[#EF4444] mb-4 uppercase">System Interventions</h2>
          <div className="flex-1 overflow-y-auto space-y-2 font-mono text-[11px]">
            <div className="text-[#F59E0B] flex items-start">
              <span className="mr-2">[!]</span>
              <span>REPETITION_DETECTED: Conversation stalling. Recommend vulnerability injection.</span>
            </div>
          </div>
        </div>
      </section>
      
      {/* Quality Log */}
      <section className="col-span-12 bg-[#161618] border border-[#27272A] p-6">
        <h2 className="text-xs font-bold tracking-widest text-[#A1A1AA] mb-4 uppercase">Interaction Quality Log</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[11px] border-collapse">
            <thead>
              <tr className="border-b border-[#27272A] text-[#A1A1AA]">
                <th className="py-2 font-normal uppercase">Timestamp</th>
                <th className="py-2 font-normal uppercase">Score (q)</th>
                <th className="py-2 font-normal uppercase">Depth</th>
                <th className="py-2 font-normal uppercase">Respect</th>
                <th className="py-2 font-normal uppercase">Presence</th>
                <th className="py-2 font-normal uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="text-[#E1E1E6]">
              <tr className="border-b border-[#27272A]/50">
                <td className="py-3">2026-04-25 22:01</td>
                <td className="py-3">4.2</td>
                <td className="py-3">8/10</td>
                <td className="py-3">9/10</td>
                <td className="py-3">7/10</td>
                <td className="py-3 text-[#2DD4BF]">OPTIMAL</td>
              </tr>
              <tr className="border-b border-[#27272A]/50">
                <td className="py-3">2026-04-25 21:15</td>
                <td className="py-3">2.8</td>
                <td className="py-3">4/10</td>
                <td className="py-3">5/10</td>
                <td className="py-3">3/10</td>
                <td className="py-3 text-[#F59E0B]">STAGNANT</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
