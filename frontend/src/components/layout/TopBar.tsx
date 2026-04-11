import React, { useState, useRef, useEffect } from 'react';
import { Bell, Search, User, ChevronDown, Settings, LogOut, ShieldCheck, Mail, Building } from 'lucide-react';

const TopBar = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="h-20 border-b border-eco-green/20 glass flex items-center justify-between px-8 relative z-50">
      <div className="flex items-center gap-4 flex-1">
        <div className="relative w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search devices, nodes, or regional partners..." 
            className="w-full bg-slate-800/50 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm font-medium text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-eco-green/50 transition-colors shadow-inner"
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <button className="relative text-slate-400 hover:text-white transition-colors">
          <Bell className="w-6 h-6 border-b-2 border-transparent" />
          <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-eco-green rounded-full shadow-[0_0_10px_rgba(16,185,129,0.8)] animate-pulse border-2 border-slate-900"></span>
        </button>
        
        {/* Profile Dropdown Area */}
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-3 hover:bg-slate-800/60 p-1.5 pr-3 rounded-2xl transition-colors outline-none cursor-pointer border border-transparent hover:border-slate-700"
          >
            <div className="text-right hidden md:block">
              <p className="text-sm font-black text-white tracking-wide leading-tight">Admin Executive</p>
              <div className="flex items-center justify-end gap-1 text-[11px] text-eco-green tracking-widest font-black uppercase mt-0.5">
                <ShieldCheck className="w-3 h-3" /> Partner Hub
              </div>
            </div>
            <div className="relative">
              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-eco-green to-blue-500 p-[2px] shadow-lg">
                <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center overflow-hidden">
                  <User className="w-6 h-6 text-slate-300" />
                </div>
              </div>
              <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-eco-light border-[3px] border-slate-900 rounded-full shadow-md"></div>
            </div>
            <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-300 ml-1 ${isProfileOpen ? 'rotate-180 text-eco-green' : ''}`} />
          </button>

          {/* Enhanced Dropdown Menu */}
          {isProfileOpen && (
            <div className="absolute right-0 mt-3 w-80 bg-slate-900/95 backdrop-blur-3xl border border-slate-700 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] py-2 overflow-hidden animate-in fade-in slide-in-from-top-4 duration-200">
              
              <div className="px-6 py-5 border-b border-slate-800 bg-slate-800/20">
                <p className="text-lg font-black text-white">Re-Cover Intelligence</p>
                <div className="flex items-center gap-2 mt-2">
                  <Mail className="w-3 h-3 text-slate-400" />
                  <p className="text-xs font-bold text-slate-400 truncate">admin@partner-portal.net</p>
                </div>
                <div className="mt-4 flex items-center gap-3">
                  <div className="px-3 py-1 bg-eco-green/10 border border-eco-green/30 rounded-lg text-xs font-black text-eco-green tracking-widest uppercase">
                    Clearance LvL 5
                  </div>
                  <div className="text-xs font-medium text-slate-500">Live Connect</div>
                </div>
              </div>
              
              <div className="py-2 px-3">
                <button className="w-full flex items-center justify-between px-4 py-3 text-sm font-bold text-slate-300 hover:text-white hover:bg-slate-800/80 rounded-xl transition-colors group">
                  <div className="flex items-center gap-3">
                    <Building className="w-4 h-4 text-eco-green group-hover:scale-110 transition-transform" /> 
                    Manage Partners
                  </div>
                  <span className="bg-slate-700 text-white text-[10px] px-2 py-0.5 rounded-full">12 pending</span>
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-300 hover:text-white hover:bg-slate-800/80 rounded-xl transition-colors group">
                  <Settings className="w-4 h-4 text-slate-400 group-hover:rotate-90 transition-transform" /> 
                  Platform Configuration
                </button>
              </div>

              <div className="border-t border-slate-800 mt-1 py-2 px-3 bg-red-500/5">
                <button className="w-full flex items-center gap-3 px-4 py-3 text-sm font-black tracking-wider uppercase text-red-500 hover:bg-red-500/10 rounded-xl transition-colors">
                  <LogOut className="w-4 h-4" /> Disconnect Session
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default TopBar;
