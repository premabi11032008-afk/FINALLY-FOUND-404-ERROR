import React, { useState } from 'react';
import { Leaf, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/dashboard');
  };

  return (
    <div className="h-screen w-full flex items-center justify-center bg-eco-dark relative overflow-hidden">
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-eco-green/10 blur-[100px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-eco-light/10 blur-[100px] rounded-full pointer-events-none"></div>

      <div className="w-full max-w-md glass p-10 rounded-3xl z-10 mx-4">
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-xl bg-eco-green flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.5)]">
            <Leaf className="text-white w-7 h-7" />
          </div>
          <h1 className="text-3xl font-bold tracking-wider text-white">Re-<span className="text-eco-light">Cover</span></h1>
        </div>

        <h2 className="text-xl text-white font-semibold mb-2 text-center">
          {isLogin ? 'Welcome Back' : 'Create an Account'}
        </h2>
        <p className="text-slate-400 text-sm text-center mb-8">
          {isLogin ? 'Login to access your industrial dashboard.' : 'Sign up to start optimizing your e-waste.'}
        </p>

        <form onSubmit={handleAuth} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-sm text-slate-400 mb-1">Company Name</label>
              <input type="text" required className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-slate-200 focus:outline-none focus:border-eco-green/50 transition-colors" placeholder="e.g. GreenRecover Inc." />
            </div>
          )}
          
          <div>
            <label className="block text-sm text-slate-400 mb-1">Email Address</label>
            <input type="email" required className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-slate-200 focus:outline-none focus:border-eco-green/50 transition-colors" placeholder="hello@example.com" />
          </div>

          <div>
            <label className="block text-sm text-slate-400 mb-1">Password</label>
            <input type="password" required className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-slate-200 focus:outline-none focus:border-eco-green/50 transition-colors" placeholder="••••••••" />
          </div>

          <button type="submit" className="w-full bg-eco-green hover:bg-eco-light text-slate-900 font-bold py-3 rounded-xl mt-4 transition-all flex items-center justify-center gap-2 group">
            {isLogin ? 'Sign In' : 'Sign Up'} 
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        <div className="mt-8 text-center">
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm text-slate-400 hover:text-eco-light transition-colors"
          >
            {isLogin ? 'Don\'t have an account? Sign up' : 'Already have an account? Sign in'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
