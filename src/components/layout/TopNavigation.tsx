import React from 'react';
import { Search, Bell, Settings, LogOut, User } from 'lucide-react';
import { useStore } from '@/src/store';
import { useNavigate } from 'react-router-dom';

export function TopNavigation() {
  const { user, setUser } = useStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login');
  };

  return (
    <header className="h-14 bg-white border-b border-[#DEE2E6] flex items-center justify-between px-6 flex-shrink-0">
      <div className="flex items-center flex-1">
        <div className="relative w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6C757D]" />
          <input
            type="text"
            placeholder="Search audits, documents, findings..."
            className="w-full h-8 pl-9 pr-4 text-[13px] bg-[#F8F9FA] border border-[#DEE2E6] rounded-sm focus:outline-none focus:border-[#005A9E] focus:ring-1 focus:ring-[#005A9E] transition-all"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <button className="relative text-[#495057] hover:text-[#212529] transition-colors">
          <Bell className="h-5 w-5" />
          <span className="absolute -top-1 -right-1 h-3 w-3 bg-[#DC3545] rounded-full border-2 border-white"></span>
        </button>
        <button className="text-[#495057] hover:text-[#212529] transition-colors">
          <Settings className="h-5 w-5" />
        </button>
        <div className="h-8 w-px bg-[#DEE2E6] mx-2"></div>
        <div className="flex items-center gap-3">
          <div className="flex flex-col items-end">
            <span className="text-[13px] font-medium text-[#212529] leading-tight">{user?.name || user?.email || 'User'}</span>
            <span className="text-[11px] text-[#6C757D] leading-tight">{user?.role || 'Auditor'}</span>
          </div>
          <div className="h-8 w-8 bg-[#E5F0FA] text-[#005A9E] rounded-full flex items-center justify-center border border-[#005A9E]/20">
            <User className="h-4 w-4" />
          </div>
          <button onClick={handleLogout} className="text-[#6C757D] hover:text-[#DC3545] transition-colors ml-2">
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
