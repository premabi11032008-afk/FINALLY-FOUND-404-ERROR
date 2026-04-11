import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import StoryPage from './pages/StoryPage';
import AuthPage from './pages/AuthPage';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import ResaleExchange from './pages/ResaleExchange';
import ScrapRecovery from './pages/ScrapRecovery';

import ChatbotBubble from './components/ChatbotBubble';

// Simple placeholder for Contribution page
const ContributionPage = () => (
  <div className="min-h-screen bg-slate-900 flex items-center justify-center p-8">
    <div className="glass p-12 rounded-[2rem] text-center border border-slate-700 max-w-xl">
      <h1 className="text-4xl font-black text-white mb-6 uppercase tracking-tighter">Partner Network</h1>
      <p className="text-slate-400 mb-8 leading-relaxed">
        Our global recovery network is currently expanding. We are onboarding certified collection partners and regional executives.
      </p>
      <button
        onClick={() => window.history.back()}
        className="px-8 py-4 bg-eco-green text-slate-900 font-black rounded-xl hover:bg-eco-light transition-all"
      >
        RETURN TO HUB
      </button>
    </div>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<StoryPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/dashboard" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="resale" element={<ResaleExchange />} />
          <Route path="scrap" element={<ScrapRecovery />} />
          <Route path="contribution" element={<ContributionPage />} />
        </Route>
        {/* Fallback to home */}
        <Route path="*" element={<StoryPage />} />
      </Routes >
    <ChatbotBubble />
    </BrowserRouter >
  );
}

export default App;
