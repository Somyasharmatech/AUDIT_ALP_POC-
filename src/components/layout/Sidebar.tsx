import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FileText, Settings, History, Activity, FileSpreadsheet } from 'lucide-react';
import { cn } from '@/src/lib/utils';

export function Sidebar() {
  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', to: '/dashboard' },
    { icon: FileSpreadsheet, label: 'New Audit', to: '/audit/new' },
    { icon: Activity, label: 'Live Audits', to: '/audits/running' },
    { icon: FileText, label: 'Reports', to: '/reports' },
    { icon: History, label: 'Enterprise Memory', to: '/memory' },
    { icon: Settings, label: 'Settings', to: '/settings' },
  ];

  return (
    <div className="flex h-screen w-64 flex-col border-r bg-card px-4 py-6">
      <div className="flex items-center gap-2 px-2 mb-8">
        <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
          <span className="text-primary-foreground font-bold text-lg">A</span>
        </div>
        <div className="flex flex-col">
          <span className="font-semibold text-lg tracking-tight">AUDIT ALP</span>
          <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Enterprise UI</span>
        </div>
      </div>
      
      <nav className="flex flex-1 flex-col gap-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-secondary text-secondary-foreground'
                  : 'text-muted-foreground hover:bg-secondary/50 hover:text-foreground'
              )
            }
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </NavLink>
        ))}
      </nav>
      
      <div className="mt-auto px-2">
        <div className="flex items-center gap-3 rounded-lg border p-3">
          <div className="h-8 w-8 rounded-full bg-secondary" />
          <div className="flex flex-col">
            <span className="text-sm font-medium">System Admin</span>
            <span className="text-xs text-muted-foreground">Admin Role</span>
          </div>
        </div>
      </div>
    </div>
  );
}
