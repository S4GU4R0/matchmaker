import React from 'react';
import Link from 'next/link';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-[#0A0A0B] text-[#E1E1E6] font-mono">
      {/* Sidebar */}
      <aside className="w-[240px] border-r border-[#27272A] flex flex-col">
        <div className="p-6 border-b border-[#27272A]">
          <h1 className="text-lg font-bold tracking-widest text-[#2DD4BF]">MATCHMAKER</h1>
          <p className="text-[10px] text-[#A1A1AA]">CLINICAL INTERFACE V1.0</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <Link href="/dashboard" className="block p-2 border border-[#27272A] hover:bg-[#161618] transition-colors">
            DASHBOARD
          </Link>
          <Link href="/archive" className="block p-2 border border-transparent hover:border-[#27272A] hover:bg-[#161618] transition-colors">
            LIBRARY
          </Link>
          <Link href="/threshold" className="block p-2 border border-transparent hover:border-[#27272A] hover:bg-[#161618] transition-colors">
            THRESHOLD
          </Link>
          <Link href="/settings" className="block p-2 border border-transparent hover:border-[#27272A] hover:bg-[#161618] transition-colors">
            SETTINGS
          </Link>
        </nav>

        <div className="p-4 border-t border-[#27272A]">
          <div className="text-[10px] text-[#A1A1AA] mb-2">USER_ID: 8829-PX</div>
          <button className="w-full p-2 border border-[#EF4444] text-[#EF4444] text-xs hover:bg-[#EF4444] hover:text-white transition-colors">
            END SESSION
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Global Status Bar */}
        <header className="h-[40px] border-b border-[#27272A] flex items-center justify-between px-6 bg-[#161618]">
          <div className="flex items-center space-x-4">
            <span className="text-xs text-[#A1A1AA]">AGENT: <span className="text-[#E1E1E6]">LYRA (SH.RA-V8)</span></span>
            <span className="text-[10px] px-1 bg-[#2DD4BF] text-black">STABLE</span>
          </div>
          <div className="text-xs text-[#A1A1AA]">
            {new Date().toLocaleTimeString()}
          </div>
        </header>

        <div className="flex-1 overflow-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
