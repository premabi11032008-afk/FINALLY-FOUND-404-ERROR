import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Smartphone, Factory, Leaf } from 'lucide-react';

const Sidebar = () => {
  return (
    <div className="w-64 h-screen glass border-r flex flex-col pt-6">
      <div className="px-6 flex items-center gap-3 mb-10">
        <div className="w-10 h-10 rounded-xl bg-eco-green flex items-center justify-center">
          <Leaf className="text-white w-6 h-6" />
        </div>
        <h1 className="text-xl font-bold tracking-wider text-white">Re-<span className="text-eco-light">Cover</span></h1>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        <NavLink
          to="/dashboard"
          end
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
              isActive
                ? 'bg-eco-green/20 text-eco-light border border-eco-green/30'
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`
          }
        >
          <LayoutDashboard className="w-5 h-5" />
          <span className="font-medium">Analytics</span>
        </NavLink>



        <NavLink
          to="/dashboard/scrap"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
              isActive
                ? 'bg-eco-green/20 text-eco-light border border-eco-green/30'
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`
          }
        >
          <Factory className="w-5 h-5" />
          <span className="font-medium">Scrap Recovery</span>
        </NavLink>
      </nav>

      <div className="p-6">
        <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
          <p className="text-xs text-slate-400">System Status</p>
          <div className="flex items-center gap-2 mt-2">
            <div className="w-2 h-2 rounded-full bg-eco-green animate-pulse"></div>
            <span className="text-sm text-eco-light font-medium">All systems operational</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
