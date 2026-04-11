import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User, ArrowDownCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SYSTEM_PROMPT = `You are "Re-Cover AI", an intelligent assistant for the Re-Cover platform. 
Our mission is to combat e-waste. We educate users that old tech holds a "toxic fortune".
If a user wants to check their device value or recycle, use the 'evaluate_device_redirect' tool to send them to the AI Assessment Matrix page.
Encourage users to liquidize their hardware for instant INR payouts.`;

import { useNavigate } from 'react-router-dom';

interface Message {
  role: 'user' | 'model';
  text: string;
}

const ChatbotBubble: React.FC = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: 'Hello! I am the Re-Cover AI. How can I help you extract value from your old devices today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    try {
      // Backend handles the Gemini key and logic securely
      const response = await fetch('http://127.0.0.1:8000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMsg,
          history: messages.map(m => ({
            role: m.role,
            parts: [{ text: m.text }]
          }))
        })
      });

      if (!response.ok) throw new Error('Failed to chat');
      
      const data = await response.json();
      
      setMessages(prev => [...prev, { role: 'model', text: data.text }]);

      if (data.redirect) {
        // AI used the navigation tool
        setTimeout(() => {
          navigate('/dashboard/resale');
        }, 1500);
      }

    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: 'model', text: 'Sorry, my sensors are currently offline. Please try again later.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-50 p-4 rounded-full shadow-[0_0_20px_rgba(16,185,129,0.3)] bg-eco-green hover:bg-eco-light text-slate-900 transition-transform hover:scale-110 ${isOpen ? 'scale-0 opacity-0 pointer-events-none' : 'scale-100 opacity-100'}`}
      >
        <MessageSquare size={28} className="animate-pulse" />
      </button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-6 right-6 z-50 w-[380px] h-[550px] max-h-[80vh] flex flex-col bg-slate-900 border border-slate-700/50 rounded-2xl shadow-2xl overflow-hidden glass"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 bg-slate-800/80 border-b border-slate-700">
              <div className="flex items-center gap-2">
                <Bot className="text-eco-light" />
                <div>
                  <h3 className="font-bold text-white tracking-wider">Re-Cover AI</h3>
                  <p className="text-[10px] text-eco-green uppercase tracking-widest flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-eco-light animate-pulse" /> Online
                  </p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((m, i) => (
                <div key={i} className={`flex gap-3 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-8 h-8 flex items-center justify-center rounded-full shrink-0 ${m.role === 'user' ? 'bg-cyan-500/20 text-cyan-400' : 'bg-eco-green/20 text-eco-green'}`}>
                    {m.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                  </div>
                  <div className={`p-3 rounded-2xl max-w-[80%] text-sm leading-relaxed ${m.role === 'user' ? 'bg-cyan-600 outline outline-1 outline-cyan-500 text-white rounded-tr-none' : 'bg-slate-800 outline outline-1 outline-slate-700 text-slate-200 rounded-tl-none'}`}>
                    {m.text}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 flex items-center justify-center rounded-full shrink-0 bg-eco-green/20 text-eco-green">
                    <Bot size={16} />
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-800 outline outline-1 outline-slate-700 text-slate-200 rounded-tl-none flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce" />
                    <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-slate-800/50 border-t border-slate-700/50">
              <div className="flex items-center gap-2 relative">
                <input
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSend()}
                  placeholder="Ask about your toxic tech..."
                  className="flex-1 bg-slate-900/80 border border-slate-700 text-slate-200 py-3 pr-12 pl-4 rounded-xl focus:outline-none focus:border-eco-light/50 transition-colors"
                />
                <button 
                  onClick={handleSend}
                  disabled={isLoading || !input.trim()}
                  className="absolute right-2 p-2 text-eco-green hover:text-eco-light hover:bg-eco-green/10 rounded-lg disabled:opacity-50 disabled:hover:bg-transparent transition-colors"
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatbotBubble;
