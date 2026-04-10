import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';

const Layout = () => {
  return (
    <div className="flex h-screen bg-eco-darker overflow-hidden font-sans">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-y-auto p-8 relative">
          <div className="absolute top-0 left-0 w-full h-[500px] bg-eco-green/5 blur-[120px] rounded-full pointer-events-none -z-10"></div>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
