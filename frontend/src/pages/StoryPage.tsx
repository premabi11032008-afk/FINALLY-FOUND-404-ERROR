import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { ArrowDown, Cpu, Trash2, ShieldAlert, TrendingUp, DollarSign, Upload, RefreshCcw, CheckCircle } from 'lucide-react';
import WorldPredictionBackground from '../components/WorldPredictionBackground';

const StoryPage = () => {
  const navigate = useNavigate();

  const [device, setDevice] = useState('Smartphone');
  const [condition, setCondition] = useState(50);
  const [showResult, setShowResult] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [analyzing, setAnalyzing] = useState(false);
  const [yoloResult, setYoloResult] = useState<any>(null);

  // New interaction states
  const [isClaiming, setIsClaiming] = useState(false);
  const [phone, setPhone] = useState('');
  const [isFinalized, setIsFinalized] = useState(false);

  // Simulated calculation
  const getEarning = () => {
    const base = device === 'Servers' ? 120000 : 45000;
    const total = base * condition;
    return `₹${(total / 100000).toFixed(1)} Lakhs`;
  };

  const getImpact = () => {
    if (device === 'Servers') return `routed ${condition} tons of enterprise infrastructure to deep-recycling partners`;
    return `injected ${condition} tons of raw industrial materials back into the manufacturing grid`;
  };

  return (
    <div className="bg-eco-darker min-h-screen text-slate-200 selection:bg-eco-green selection:text-slate-900 font-sans">

      {/* Act 1: The Hook */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 overflow-hidden">
        {/* Live ML-powered world map: pointer-events-none, never blocks text */}
        <WorldPredictionBackground />


        <div className="z-20 max-w-4xl mx-auto space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/30 text-red-500 text-sm font-bold tracking-widest uppercase mb-4 shadow-[0_0_15px_rgba(239,68,68,0.2)]">
            <ShieldAlert className="w-4 h-4" /> The Silent Crisis In Your Home
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight leading-tight">
            Your junk drawer hides a <span className="text-transparent bg-clip-text bg-gradient-to-r from-eco-light to-eco-green">Toxic Fortune</span>.
          </h1>
          <p className="text-xl md:text-2xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Right now, your dead phones and laptops are either leaking neurotoxins into landfills—or hoarding precious metals that could revolutionize the economy. You are sitting on a gold mine. Literally.
          </p>

          <div className="pt-12 animate-bounce">
            <ArrowDown className="w-8 h-8 text-eco-green mx-auto opacity-70" />
            <p className="text-xs text-slate-500 uppercase tracking-widest mt-4 font-bold">Descend to Reality</p>
          </div>
        </div>
      </section>

      {/* Act 2: Relatable Impact Metrics */}
      <section className="py-32 px-4 relative z-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-24">
            <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6">This isn't charity.<br />This is an industrial revolution.</h2>
            <p className="text-xl text-slate-400">We don't mine the earth anymore. We mine your trash.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="glass p-12 rounded-[2rem] border border-yellow-500/30 relative overflow-hidden group shadow-2xl">
              <div className="absolute -right-20 -top-20 w-64 h-64 bg-yellow-500/10 blur-[80px] rounded-full group-hover:bg-yellow-500/20 transition-all duration-700"></div>
              <h3 className="text-7xl font-extrabold text-white mb-4">₹52 <span className="text-4xl text-yellow-500">Lakhs</span></h3>
              <p className="text-2xl font-bold text-slate-200 mb-6">Pure, 24k Gold stripped straight from dead motherboards.</p>
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-700 shadow-inner">
                <p className="text-slate-300 text-sm leading-relaxed">
                  <span className="text-yellow-500 font-bold mr-2">☠️ BRUTAL TRUTH:</span>
                  While people fight over physical gold mines, society threw away enough gold to fund an entire hospital wing. We took it back.
                </p>
              </div>
            </div>

            <div className="glass p-12 rounded-[2rem] border border-eco-green/30 relative overflow-hidden group shadow-2xl">
              <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-eco-green/10 blur-[80px] rounded-full group-hover:bg-eco-green/20 transition-all duration-700"></div>
              <h3 className="text-7xl font-extrabold text-white mb-4">1.4 <span className="text-4xl text-eco-green">Crore</span></h3>
              <p className="text-2xl font-bold text-slate-200 mb-6">Dead devices ripped apart before they could poison the soil.</p>
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-700 shadow-inner">
                <p className="text-slate-300 text-sm leading-relaxed">
                  <span className="text-eco-green font-bold mr-2">💧 DID YOU KNOW?</span>
                  A single phone battery can contaminate 60,000 liters of groundwater. We stopped 1.4 Crore of them from reaching your drinking supply.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Act 3: The Catalyst (Interactive Evaluator) */}
      <section id="evaluator" className="py-32 px-4 bg-slate-900/80 border-y border-slate-800 relative z-20 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
        <div className="max-w-4xl mx-auto text-center space-y-12">

          <div className="space-y-4">
            <h2 className="text-4xl md:text-6xl font-black text-white leading-tight">
              Bulk Liquidation Engine.
            </h2>
            <p className="text-xl text-slate-400">Calculate enterprise-grade scrap value in 3 seconds.</p>
          </div>

          {/* Main CTA Section */}
          <div className="relative group p-1">
            <div className="absolute -inset-1 bg-gradient-to-r from-eco-green/50 to-blue-500/50 rounded-[40px] blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative bg-slate-900 border border-slate-800 rounded-[40px] p-12 text-center overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-eco-green/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -ml-32 -mb-32"></div>
              
<<<<<<< HEAD
              <div className="space-y-8">
                <div>
                  <label className="block text-sm font-bold text-slate-400 mb-4 uppercase tracking-widest border-b border-slate-800 pb-2">Commodity Category...</label>
                  <div className="flex gap-4">
                    <button 
                      onClick={() => { setDevice('Servers'); setShowResult(false); }}
                      className={`flex-1 py-4 rounded-xl border-2 font-black transition-all ${device === 'Servers' ? 'border-eco-green bg-eco-green/10 text-white shadow-[0_0_15px_rgba(16,185,129,0.2)]' : 'border-slate-700 text-slate-400 hover:border-slate-500 bg-slate-800/50'}`}
                    >
                      SERVERS / WORKSTATIONS
                    </button>
                    <button 
                      onClick={() => { setDevice('Boards'); setShowResult(false); }}
                      className={`flex-1 py-4 rounded-xl border-2 font-black transition-all ${device === 'Boards' ? 'border-eco-green bg-eco-green/10 text-white shadow-[0_0_15px_rgba(16,185,129,0.2)]' : 'border-slate-700 text-slate-400 hover:border-slate-500 bg-slate-800/50'}`}
                    >
                      MIXED MOTHERBOARDS
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-400 mb-4 uppercase tracking-widest border-b border-slate-800 pb-2 flex justify-between items-end">
                    <span>Estimated Volume...</span>
                    <span className="text-lg font-black text-yellow-500">
                      {condition} TONS
                    </span>
                  </label>
                  <input 
                    type="range" min="1" max="100" 
                    value={condition} 
                    onChange={(e) => { setCondition(parseInt(e.target.value)); setShowResult(false); }}
                    className="w-full h-4 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-eco-green border border-slate-700" 
                  />
                  <div className="flex justify-between text-xs font-bold text-slate-600 mt-3 uppercase tracking-wider">
                    <span>1 Ton</span>
                    <span>100+ Tons</span>
                  </div>
                </div>

                <button 
                  onClick={() => setShowResult(true)}
                  className="w-full bg-white hover:bg-slate-200 text-slate-900 font-black text-xl py-5 rounded-xl transition-transform hover:scale-[1.02] active:scale-95 shadow-2xl"
                >
                  CALCULATE BATCH VALUE
                </button>
              </div>

              <div className="h-full">
                {showResult ? (
                  <div className="h-full flex flex-col justify-center bg-eco-green/10 border-2 border-eco-green shadow-[0_0_30px_rgba(16,185,129,0.2)] rounded-3xl p-8 animate-in fade-in zoom-in duration-500 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-bl-full z-0 pointer-events-none"></div>
                    <div className="relative z-10">
                      <p className="text-white font-black uppercase tracking-widest text-sm mb-2 opacity-80">B2B Liquidity Estimate</p>
                      <h4 className="text-6xl font-black text-white mb-6 tracking-tighter drop-shadow-lg">{getEarning()}</h4>
                      <div className="h-px w-full bg-eco-green/30 mb-6"></div>
                      <p className="text-slate-300 text-lg font-medium leading-relaxed mb-10">
                        Immediate capital injection available. More importantly? You just <strong className="text-eco-light font-bold">{getImpact()}</strong>.
                      </p>
                      <button onClick={() => navigate('/auth')} className="w-full bg-eco-green hover:bg-eco-light text-slate-900 font-black text-xl py-5 rounded-xl transition-all shadow-[0_0_20px_rgba(16,185,129,0.4)] hover:shadow-[0_0_40px_rgba(16,185,129,0.8)] hover:-translate-y-1">
                        LIST BATCH FOR PARTNERS
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex flex-col justify-center items-center text-slate-600 border-2 border-dashed border-slate-700 rounded-3xl p-8 bg-slate-900/50 min-h-[350px]">
                    <TrendingUp className="w-20 h-20 mb-6 opacity-40 animate-pulse" />
                    <p className="text-center font-bold text-lg max-w-[200px]">Hit Calculate to run the valuation matrix.</p>
                  </div>
                )}
=======
              <div className="relative z-10 max-w-3xl mx-auto space-y-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-eco-green/10 border border-eco-green/20 rounded-full mb-4">
          <ShieldAlert className="w-4 h-4 text-eco-green" />
          <span className="text-eco-green text-xs font-black uppercase tracking-widest">Global Recovery Network 2.0</span>
        </div>

        <h3 className="text-5xl md:text-6xl font-black text-white tracking-tighter leading-none mb-6">
          Liquidate your hardware <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-eco-green to-blue-400">with absolute confidence.</span>
        </h3>

        <p className="text-xl text-slate-400 font-medium max-w-2xl mx-auto leading-relaxed">
          Our YOLO-powered AI matrix assesses your old electronics in seconds, offering premium payouts that directly fuel the global transition to a circular economy.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
          <button
            onClick={() => navigate('/dashboard/resale')}
            className="px-10 py-5 bg-white hover:bg-slate-200 text-slate-900 font-black text-xl rounded-2xl transition-all hover:scale-[1.05] active:scale-95 shadow-[0_0_30px_rgba(255,255,255,0.2)] flex items-center justify-center gap-2"
          >
            EVALUATE YOUR DEVICE <TrendingUp className="w-6 h-6" />
          </button>

          <button
            onClick={() => navigate('/dashboard/contribution')}
            className="px-10 py-5 bg-slate-800 border-2 border-slate-700 hover:border-eco-green/50 text-white font-black text-xl rounded-2xl transition-all hover:scale-[1.05] active:scale-95 flex items-center justify-center gap-2"
          >
            BECOME A PARTNER <Cpu className="w-6 h-6" />
          </button>
        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-center gap-8 text-slate-500 font-bold uppercase tracking-widest text-xs">
          <div className="flex items-center gap-2"><DollarSign className="w-4 h-4" /> Instant INR Payouts</div>
          <div className="flex items-center gap-2"><Cpu className="w-4 h-4" /> AI Verified Logic</div>
          <div className="flex items-center gap-2"><ArrowDown className="w-4 h-4" /> Certified Recycling</div>
        </div>

        <div className="pt-4">
          <p className="text-slate-500 text-sm">
            Want to contribute to the global recovery network?
            <button
              onClick={() => navigate('/dashboard/contribution')}
              className="text-eco-green hover:text-eco-light ml-2 underline decoration-eco-green/30 underline-offset-4 font-bold transition-colors cursor-pointer"
            >
              Learn how you can join us here.
            </button>
          </p>
        </div>
>>>>>>> e59e4c0a26ec15e8462fbc6474ac1373fac69f56
      </div>
    </div>
          </div >
        </div >
      </section >

  {/* Act 4: Scale (Business / Scrap UI minimized) */ }
  < section className = "py-32 px-4 relative z-20" >
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col lg:flex-row gap-16 items-center">

        <div className="flex-1 space-y-8">
          <h2 className="text-5xl font-black text-white tracking-tight leading-tight">Corporate IT Graveyard?</h2>
          <p className="text-2xl text-slate-300 leading-relaxed font-light">
            Servers gathering dust? We don't do "junk removal". We execute military-grade data destruction and extract massive enterprise-level liquidity from your dead infrastructure.
          </p>
          <div className="pt-4">
            <button className="flex items-center gap-3 bg-slate-800 hover:bg-slate-700 text-white px-10 py-5 rounded-2xl font-black text-lg border border-slate-600 transition-colors shadow-xl group">
              <TrendingUp className="w-6 h-6 text-eco-green group-hover:scale-110 transition-transform" /> COMMAND BULK LIQUIDATION
            </button>
          </div>
        </div>

        <div className="flex-1 w-full glass rounded-3xl overflow-hidden border-2 border-slate-700/50 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
          <div className="bg-slate-900 p-6 border-b border-slate-800 flex justify-between items-center">
            <span className="font-black text-white text-sm uppercase tracking-widest">B2B Live Commodities</span>
            <span className="flex items-center gap-2 text-xs text-eco-darker px-3 py-1.5 bg-eco-green rounded-full font-black uppercase tracking-wider animate-pulse">
              <DollarSign className="w-3 h-3" /> Trading Live
            </span>
          </div>
          <div className="p-0 bg-slate-900/50">
            <table className="w-full text-left text-lg">
              <tbody>
                <tr className="border-b border-slate-800 hover:bg-slate-800/80 transition-colors">
                  <td className="py-6 px-8 text-slate-300 font-bold">Grade A Servers</td>
                  <td className="py-6 px-8 text-right text-eco-light font-black tracking-tight">₹1.2 Lakhs / ton</td>
                </tr>
                <tr className="border-b border-slate-800 hover:bg-slate-800/80 transition-colors">
                  <td className="py-6 px-8 text-slate-300 font-bold">Industrial Board Mix</td>
                  <td className="py-6 px-8 text-right text-white font-black tracking-tight">₹45,000 / ton</td>
                </tr>
                <tr className="hover:bg-slate-800/80 transition-colors">
                  <td className="py-6 px-8 text-slate-300 font-bold">Raw Li-ion Banks</td>
                  <td className="py-6 px-8 text-right text-white font-black tracking-tight">₹22,000 / ton</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
      </section >

  {/* Footer CTA */ }
  < footer className = "py-32 px-4 bg-eco-green text-slate-900 text-center relative z-20 border-t-8 border-eco-light" >
    <div className="max-w-5xl mx-auto">
      <h2 className="text-5xl md:text-7xl font-black mb-8 tracking-tighter uppercase drop-shadow-md">Become A Strategic Partner.<br />Process Global E-Waste.</h2>
      <p className="text-2xl font-bold mb-12 max-w-3xl mx-auto text-slate-800 leading-relaxed">
        Connect your recycling and refurbishing facilities directly with our AI engine. We route high-value, pre-evaluated corporate and consumer e-waste straight to your loading docks.
      </p>
      <button onClick={() => navigate('/auth')} className="bg-slate-900 hover:bg-black text-white px-12 py-6 rounded-3xl font-black text-2xl shadow-[0_20px_40px_rgba(0,0,0,0.4)] transition-all hover:-translate-y-2 hover:shadow-[0_30px_60px_rgba(0,0,0,0.6)] flex items-center justify-center gap-4 mx-auto">
        ACCESS PARTNER PORTAL
      </button>
    </div>
      </footer >

    </div >
  );
};

export default StoryPage;
