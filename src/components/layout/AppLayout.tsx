import React from 'react';
import { Sidebar } from './Sidebar';
import { TopNavigation } from './TopNavigation';

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-[#F8F9FA] overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <TopNavigation />
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-6 relative">
          {children}
        </main>
      </div>
    </div>
  );
}
