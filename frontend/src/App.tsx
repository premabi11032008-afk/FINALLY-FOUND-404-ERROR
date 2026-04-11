import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import StoryPage from './pages/StoryPage';
import AuthPage from './pages/AuthPage';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import ResaleExchange from './pages/ResaleExchange';
import ScrapRecovery from './pages/ScrapRecovery';
// We will import PartnerDashboard soon
import ChatbotBubble from './components/ChatbotBubble';

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
        </Route>
      </Routes>
      <ChatbotBubble />
    </BrowserRouter>
  );
}

export default App;
