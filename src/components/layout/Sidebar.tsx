import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FileText, Settings, Database, FolderSearch, CheckSquare, BarChart, CalendarDays, PlusCircle, Server } from 'lucide-react';
import { cn } from '@/src/lib/utils';

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  badge?: number;
}

function NavItem({ to, icon, label, badge }: NavItemProps) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          "flex items-center gap-3 px-3 py-2 text-[13px] font-medium rounded-sm transition-colors",
          isActive
            ? "bg-[#005A9E] text-white"
            : "text-[#D1D5DB] hover:bg-[#1E293B] hover:text-white"
        )
      }
    >
      {icon}
      <span className="flex-1">{label}</span>
      {badge !== undefined && (
        <span className="bg-[#DC3545] text-white text-[10px] px-1.5 py-0.5 rounded-sm font-bold">
          {badge}
        </span>
      )}
    </NavLink>
  );
}

export function Sidebar() {
  return (
    <aside className="w-64 bg-[#0F172A] flex flex-col h-full flex-shrink-0">
      <div className="h-14 flex items-center px-6 border-b border-[#1E293B] shrink-0">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 bg-[#005A9E] rounded flex items-center justify-center">
            <span className="text-white text-xs font-bold font-mono">ALP</span>
          </div>
          <span className="text-[14px] font-bold tracking-wider text-white">AUDIT ALP</span>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
        <div>
          <p className="px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider mb-2">Planning & Strategy</p>
          <div className="space-y-1">
            <NavItem to="/dashboard" icon={<LayoutDashboard className="h-4 w-4" />} label="Annual Dashboard" />
            <NavItem to="/audit/new" icon={<PlusCircle className="h-4 w-4" />} label="Create Planning" />
          </div>
        </div>
      </div>
      
      <div className="p-4 border-t border-[#1E293B] shrink-0">
        <NavItem to="/settings" icon={<Settings className="h-4 w-4" />} label="Settings" />
      </div>
    </aside>
  );
}
