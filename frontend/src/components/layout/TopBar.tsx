import React from 'react';
import { Bell, Search, User } from 'lucide-react';

const TopBar = () => {
  return (
    <header className="h-20 border-b border-eco-green/20 glass flex items-center justify-between px-8">
      <div className="flex items-center gap-4 flex-1">
        <div className="relative w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search devices, parts, metrics..." 
            className="w-full bg-slate-800/50 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-eco-green/50 transition-colors"
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <button className="relative text-slate-400 hover:text-white transition-colors">
          <Bell className="w-6 h-6" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-eco-green rounded-full shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
        </button>
        
        <div className="flex items-center gap-3 cursor-pointer">
          <div className="text-right">
            <p className="text-sm font-semibold text-slate-200">Admin User</p>
            <p className="text-xs text-eco-green">Facility Manager</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-slate-800 border-2 border-eco-green/50 flex items-center justify-center">
            <User className="w-5 h-5 text-slate-400" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopBar;
