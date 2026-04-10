import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User, ArrowDownCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SYSTEM_PROMPT = `You are "Re-Cover AI", an intelligent assistant for the Re-Cover platform (formerly EcoMine AI). 
Our motive is to combat the silent crisis of e-waste (electronic waste). We educate users that their old tech (phones, laptops) holds a "toxic fortune" — they contain precious metals like gold and lithium, but also leak neurotoxins into landfills if discarded improperly.
Your goal is to be helpful, informative, and to occasionally encourage users to recycle or extract value from their old devices.
If the user expresses interest in cleaning the earth, recycling, seeing how much their device is worth, or taking action, you MUST use the "scroll_to_evaluator" tool to scroll their screen to the interactive device evaluator widget where they can begin.`;

interface Message {
  role: 'user' | 'model';
  text: string;
}

const ChatbotBubble: React.FC = () => {
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
      // In a real app we'd proxy this through our backend to hide the key, 
      // but for this hackathon we use VITE_GEMINI_API_KEY from the environment
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (!apiKey) {
        setMessages(prev => [...prev, { role: 'model', text: 'Error: VITE_GEMINI_API_KEY is not set in your frontend .env file!' }]);
        setIsLoading(false);
        return;
      }

      const payload = {
        systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents: [
          ...messages.filter(m => m.text).map(m => ({
            role: m.role,
            parts: [{ text: m.text }]
          })),
          { role: 'user', parts: [{ text: userMsg }] }
        ],
        tools: [{
          functionDeclarations: [{
            name: 'scroll_to_evaluator',
            description: 'Scroll the user screen to the actionable device evaluator widget when they indicate interest in recycling, extracting value from old tech, or cleaning the earth.'
          }]
        }]
      };

      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      
      if (data.error) {
        console.error(data.error);
        setMessages(prev => [...prev, { role: 'model', text: 'Sorry, I encountered an API error.' }]);
        return;
      }

      const candidate = data.candidates?.[0]?.content?.parts?.[0];
      
      // Check if LLM decided to call our tool
      if (candidate?.functionCall) {
        if (candidate.functionCall.name === 'scroll_to_evaluator') {
          // LLM used the tool! Execute the client-side scrolling.
          const evalSection = document.getElementById('evaluator');
          if (evalSection) {
            evalSection.scrollIntoView({ behavior: 'smooth' });
            setMessages(prev => [...prev, { role: 'model', text: 'I am scrolling you to our extraction widget right now! Let me know if you need any help with it.' }]);
          } else {
             setMessages(prev => [...prev, { role: 'model', text: 'The evaluator widget seems to represent a page section we cannot currently scroll to, but you can find it scrolling down!' }]);
          }
        }
      } else if (candidate?.text) {
        setMessages(prev => [...prev, { role: 'model', text: candidate.text }]);
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
        className={\`fixed bottom-6 right-6 z-50 p-4 rounded-full shadow-[0_0_20px_rgba(16,185,129,0.3)] bg-eco-green hover:bg-eco-light text-slate-900 transition-transform hover:scale-110 \${isOpen ? 'scale-0 opacity-0 pointer-events-none' : 'scale-100 opacity-100'}\`\}
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
                <div key={i} className={\`flex gap-3 \${m.role === 'user' ? 'flex-row-reverse' : ''}\`\}>
                  <div className={\`w-8 h-8 flex items-center justify-center rounded-full shrink-0 \${m.role === 'user' ? 'bg-cyan-500/20 text-cyan-400' : 'bg-eco-green/20 text-eco-green'}\`\}>
                    {m.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                  </div>
                  <div className={\`p-3 rounded-2xl max-w-[80%] text-sm leading-relaxed \${m.role === 'user' ? 'bg-cyan-600 outline outline-1 outline-cyan-500 text-white rounded-tr-none' : 'bg-slate-800 outline outline-1 outline-slate-700 text-slate-200 rounded-tl-none'}\`\}>
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
