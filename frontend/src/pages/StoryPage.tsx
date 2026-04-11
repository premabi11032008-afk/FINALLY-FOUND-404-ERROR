import React, { useState, useEffect } from 'react';
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

  // Added stats fetch for Act 2 Metrics
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/stats');
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };
    fetchStats();
  }, []);

  // Forecast states
  const [forecastDevice, setForecastDevice] = useState<'Smartphone' | 'Laptop' | 'Desktop' | 'Server'>('Smartphone');
  const [forecastYear, setForecastYear] = useState(2024);

  const getForecastEmissions = () => {
    const base = {
        'Smartphone': { C: 12, CO: 2.4, O: 0.5, CO2: 45 },
        'Laptop': { C: 45, CO: 8.2, O: 1.8, CO2: 120 },
        'Desktop': { C: 110, CO: 18.5, O: 4.2, CO2: 350 },
        'Server': { C: 450, CO: 85.0, O: 18.4, CO2: 1200 },
    }[forecastDevice];

    const yearDiff = forecastYear - 2024;
    const multiplier = 1 + (yearDiff * 0.15); // Cumulative leakage per year dumped

    return {
        C: (base.C * multiplier).toFixed(1),
        CO: (base.CO * multiplier).toFixed(1),
        O: (base.O * multiplier).toFixed(2),
        CO2: (base.CO2 * multiplier).toFixed(1)
    };
  };
  const deviceEmissions = getForecastEmissions();

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
    <div className="min-h-screen text-slate-200 selection:bg-eco-green selection:text-slate-900 font-sans relative">

      {/* Persistent Global Video Background (Hidden during Hero) */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/impact-video.mp4" type="video/mp4" />
        </video>
        {/* Dark Readability Overlay for Fixed Video */}
        <div className="absolute inset-0 bg-black/70"></div>
      </div>

      {/* Act 1: The Hook */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 overflow-hidden z-20 bg-eco-darker">
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
      <section className="py-32 px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-24">
            <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6">This isn't charity.<br />This is an industrial revolution.</h2>
            <p className="text-xl text-slate-400">We don't mine the earth anymore. We mine your trash.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="glass p-12 rounded-[2rem] border border-yellow-500/30 relative overflow-hidden group shadow-2xl">
              <div className="absolute -right-20 -top-20 w-64 h-64 bg-yellow-500/10 blur-[80px] rounded-full group-hover:bg-yellow-500/20 transition-all duration-700"></div>
              <h3 className="text-7xl font-extrabold text-white mb-4">
                {stats?.metrics?.totalRevenue || "₹24"} <span className="text-4xl text-yellow-500">Revenue</span>
              </h3>
              <p className="text-2xl font-bold text-slate-200 mb-6">Recovered directly from community-driven scrap liquidation.</p>
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-700 shadow-inner">
                <p className="text-slate-300 text-sm leading-relaxed">
                  <span className="text-yellow-500 font-bold mr-2">☠️ BRUTAL TRUTH:</span>
                  While people fight over physical gold mines, society threw away enough gold to fund an entire hospital wing. We took it back.
                </p>
              </div>
            </div>

            <div className="glass p-12 rounded-[2rem] border border-eco-green/30 relative overflow-hidden group shadow-2xl">
              <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-eco-green/10 blur-[80px] rounded-full group-hover:bg-eco-green/20 transition-all duration-700"></div>
              <h3 className="text-7xl font-extrabold text-white mb-4">
                {stats?.metrics?.totalDevices || "1.4"} <span className="text-4xl text-eco-green">Items</span>
              </h3>
              <p className="text-2xl font-bold text-slate-200 mb-6">Dead devices ripped apart before they could poison the soil.</p>
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-700 shadow-inner">
                <p className="text-slate-300 text-sm leading-relaxed">
                  <span className="text-eco-green font-bold mr-2">💧 DID YOU KNOW?</span>
                  A single phone battery can contaminate 60,000 liters of groundwater. We stopped over {stats?.metrics?.totalDevices || "1.4 Crore"} of them from reaching your drinking supply.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Act 3: The Catalyst (Interactive Evaluator) */}
      <section id="evaluator" className="py-32 px-4 relative z-10 border-y border-slate-800 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
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
            <div className="relative bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-[40px] p-12 text-center overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-eco-green/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -ml-32 -mb-32"></div>

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
                    onClick={() => navigate('/resale')}
                    className="px-10 py-5 bg-white hover:bg-slate-200 text-slate-900 font-black text-xl rounded-2xl transition-all hover:scale-[1.05] active:scale-95 shadow-[0_0_30px_rgba(255,255,255,0.2)] flex items-center justify-center gap-2"
                  >
                    EVALUATE YOUR DEVICE <TrendingUp className="w-6 h-6" />
                  </button>

                  <button
                    onClick={() => navigate('/auth')}
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
                      onClick={() => navigate('/auth')}
                      className="text-eco-green hover:text-eco-light ml-2 underline decoration-eco-green/30 underline-offset-4 font-bold transition-colors cursor-pointer"
                    >
                      Learn how you can join us here.
                    </button>
                  </p>
                </div>
              </div>
            </div>
          </div >
        </div >
      </section >

      {/* Act 4: Scale (Business / Scrap UI minimized) */}
      < section className="py-32 px-4 relative z-20" >
        <div className="max-w-6xl mx-auto">
          {/* Device-Specific Emissions Terminal */}
          <div className="mt-16 glass p-8 rounded-[2.5rem] border border-eco-green/30 relative shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden group">
            <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-eco-green/10 rounded-full blur-[100px] pointer-events-none group-hover:bg-eco-green/20 transition-all duration-700"></div>

            <div className="relative z-10 text-center mb-10">
              <h3 className="text-3xl lg:text-4xl font-black text-white tracking-tight mb-4">Device-Level Emissions Forecaster</h3>
              <p className="text-slate-400 font-medium max-w-2xl mx-auto leading-relaxed text-sm">
                Calculate projected cumulative toxin release for individual hardware configurations left untreated from 2024 onwards. Focuses on core hazardous outputs.
              </p>
            </div>

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-slate-900/60 p-6 lg:p-8 rounded-[2rem] border border-slate-700/50">

              {/* Controls */}
              <div className="lg:col-span-6 space-y-10">
                <div>
                  <label className="block text-sm font-bold text-slate-400 mb-4 uppercase tracking-widest">Select Hardware Class</label>
                  <div className="grid grid-cols-2 gap-3">
                    {['Smartphone', 'Laptop', 'Desktop', 'Server'].map((dev) => (
                      <button
                        key={dev}
                        onClick={() => setForecastDevice(dev as any)}
                        className={`py-4 px-4 rounded-xl font-bold transition-all border-2 text-sm uppercase tracking-wide ${forecastDevice === dev ? 'bg-eco-green/10 text-white border-eco-green shadow-[0_0_15px_rgba(16,185,129,0.2)]' : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700 hover:text-white'}`}
                      >
                        {dev}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800">
                  <label className="flex justify-between items-end text-sm font-bold text-slate-400 mb-6 uppercase tracking-widest">
                    <span>Projection Year</span>
                    <span className="text-3xl font-black text-eco-green">{forecastYear}</span>
                  </label>
                  <input
                    type="range" min="2024" max="2034" step="1"
                    value={forecastYear}
                    onChange={(e) => setForecastYear(parseInt(e.target.value))}
                    className="w-full h-3 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-eco-green border border-slate-700"
                  />
                  <div className="flex justify-between text-xs font-bold text-slate-500 mt-4">
                    <span>2024 Base</span>
                    <span>2034 Projected</span>
                  </div>
                </div>
              </div>

              {/* Results Output Console */}
              <div className="lg:col-span-6 bg-black/40 rounded-3xl border border-slate-800 p-8 font-mono relative overflow-hidden shadow-inner h-full flex flex-col justify-center">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-5 pointer-events-none">
                  <Cpu className="w-64 h-64 text-eco-green animate-pulse" />
                </div>

                <div className="relative z-10 flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
                  <p className="text-eco-green font-bold text-sm uppercase tracking-widest flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-eco-green animate-pulse shadow-[0_0_8px_rgba(16,185,129,1)]"></span> DIAGNOSTIC OUTPUT
                  </p>
                  <span className="text-xs text-slate-500">VALUES IN GRAMS/UNIT</span>
                </div>

                <div className="space-y-4 relative z-10">
                  <div className="flex justify-between items-center bg-slate-900/80 p-4 rounded-xl border-l-4 border-slate-400 hover:bg-slate-800 transition-colors">
                    <span className="text-slate-400 font-bold uppercase text-xs tracking-widest">Carbon (C)</span>
                    <span className="text-white font-black text-2xl">{deviceEmissions.C}</span>
                  </div>

                  <div className="flex justify-between items-center bg-slate-900/80 p-4 rounded-xl border-l-4 border-red-500 hover:bg-slate-800 transition-colors">
                    <span className="text-red-400 font-bold uppercase text-xs tracking-widest">Carbon Monoxide (CO)</span>
                    <span className="text-white font-black text-2xl">{deviceEmissions.CO}</span>
                  </div>

                  <div className="flex justify-between items-center bg-slate-900/80 p-4 rounded-xl border-l-4 border-blue-400 hover:bg-slate-800 transition-colors">
                    <span className="text-blue-400 font-bold uppercase text-xs tracking-widest">Oxygen (O)</span>
                    <span className="text-white font-black text-2xl">{deviceEmissions.O}</span>
                  </div>

                  <div className="flex justify-between items-center bg-slate-900/80 p-4 rounded-xl border-l-4 border-cyan-400 hover:bg-slate-800 transition-colors">
                    <span className="text-cyan-400 font-bold uppercase text-xs tracking-widest">Carbon Dioxide (CO₂)</span>
                    <span className="text-white font-black text-2xl">{deviceEmissions.CO2}</span>
                  </div>
                </div>
                <p className="text-center text-[10px] text-slate-500 font-sans mt-8 bg-slate-900/50 py-2 rounded-lg">* Multiplier calculated via legacy degradation index</p>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      < footer className="py-32 px-4 bg-eco-green text-slate-900 text-center relative z-20 border-t-8 border-eco-light" >
        <div className="max-w-5xl mx-auto">
          <h2 className="text-5xl md:text-7xl font-black mb-8 tracking-tighter uppercase drop-shadow-md">Become A Strategic Partner.<br />Process Global E-Waste.</h2>
          <p className="text-2xl font-bold mb-12 max-w-3xl mx-auto text-slate-800 leading-relaxed">
            Connect your recycling and refurbishing facilities directly with our AI engine. We route over {stats?.metrics?.goldRecovered || "8,400"}g of high-value, pre-evaluated corporate and consumer e-waste straight to your loading docks.
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
