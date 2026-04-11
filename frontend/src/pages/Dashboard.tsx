
import React, { useState, useEffect } from 'react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell
} from 'recharts';
import { Activity, Coins, Server, TrendingUp, RefreshCcw, Box, Zap, X, FileText, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import FuturisticPredictionMap from '../components/dashboard/FuturisticPredictionMap';

const MetricCard = ({ title, value, subtext, icon: Icon, trend, index }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
    className="glass p-6 rounded-2xl flex flex-col justify-between hover:border-eco-green/40 transition-all group overflow-hidden relative"
  >
    <div className="absolute top-0 right-0 w-24 h-24 bg-eco-green/5 blur-3xl -mr-12 -mt-12 group-hover:bg-eco-green/10 transition-colors"></div>
    <div className="flex justify-between items-start mb-4 relative z-10">
      <div>
        <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1">{title}</p>
        <h3 className="text-3xl font-black text-white tracking-tighter">{value}</h3>
      </div>
      <div className="w-12 h-12 rounded-xl bg-slate-800/80 flex items-center justify-center border border-slate-700 group-hover:border-eco-green/50 transition-colors shadow-lg">
        <Icon className="text-eco-green w-6 h-6 group-hover:scale-110 transition-transform" />
      </div>
    </div>
    <div className="flex items-center gap-2 relative z-10">
      <div className={`flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full bg-slate-800 border ${trend > 0 ? 'text-eco-green border-eco-green/20' : 'text-red-400 border-red-400/20'}`}>
        <TrendingUp className={`w-3 h-3 ${trend < 0 && 'rotate-180'}`} />
        <span>{Math.abs(trend)}%</span>
      </div>
      <span className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">{subtext}</span>
    </div>
  </motion.div>
);

const Dashboard = () => {
  const [showReport, setShowReport] = useState(false);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/stats');
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-slate-400 space-y-4">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <RefreshCcw className="w-12 h-12 text-eco-green" />
        </motion.div>
        <p className="font-bold uppercase tracking-widest text-sm animate-pulse">Syncing with Neural Grid...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto relative">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
        <div>
          <h1 className="text-4xl font-black text-white mb-2 tracking-tighter uppercase italic">Control <span className="text-eco-green">Center</span></h1>
          <p className="text-slate-400 font-medium">Global AI e-waste processing and material recovery matrix.</p>
        </div>
        <div className="flex gap-4">
          <div className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-xl text-xs font-bold text-slate-300">
            <Zap className="w-4 h-4 text-yellow-500" /> API Latency: 42ms
          </div>
          <button 
            onClick={() => setShowReport(true)}
            className="bg-eco-green hover:bg-eco-light text-slate-900 px-6 py-3 rounded-xl font-black uppercase tracking-widest text-xs transition-all flex items-center gap-2 shadow-[0_10px_20px_rgba(16,185,129,0.2)] hover:-translate-y-1"
          >
            <FileText className="w-4 h-4" /> Generate Report
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard 
          index={0}
          title="Total Extraction" 
          value={stats?.metrics?.totalDevices || "0"} 
          subtext="vs last month" 
          icon={Box} 
          trend={stats?.metrics?.devicesTrend || 0} 
        />
        <MetricCard 
          index={1}
          title="Gold Recovered (g)" 
          value={stats?.metrics?.goldRecovered || "0"} 
          subtext="vs last month" 
          icon={Coins} 
          trend={stats?.metrics?.goldTrend || 0} 
        />
        <MetricCard 
          index={2}
          title="Platform Yield" 
          value={stats?.metrics?.totalRevenue || "₹0L"} 
          subtext="vs last month" 
          icon={TrendingUp} 
          trend={stats?.metrics?.revenueTrend || 0} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        {/* Main Area Chart */}
        <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2 glass p-8 rounded-[2rem] relative overflow-hidden"
        >
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
                <Activity className="w-5 h-5 text-eco-green" /> Extraction Velocity
            </h3>
            <div className="flex gap-2">
                <span className="px-3 py-1 bg-eco-green/10 text-eco-green rounded-full text-[10px] font-black uppercase tracking-widest">Monthly Tons</span>
            </div>
          </div>
          
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats?.monthlyGeneration || []}>
                <defs>
                  <linearGradient id="colorGen" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis 
                    dataKey="name" 
                    stroke="#475569" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fontWeight: 700 }}
                    dy={10}
                />
                <YAxis 
                    stroke="#475569" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fontWeight: 700 }}
                    dx={-10}
                />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}
                  itemStyle={{ color: '#10b981', fontWeight: 900 }}
                  labelStyle={{ color: '#94a3b8', marginBottom: '8px', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em' }}
                />
                <Area 
                    type="monotone" 
                    dataKey="generation" 
                    stroke="#10b981" 
                    strokeWidth={4} 
                    fillOpacity={1} 
                    fill="url(#colorGen)" 
                    animationDuration={2000}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Material Composition Pie Chart */}
        <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass p-8 rounded-[2rem] flex flex-col"
        >
          <h3 className="text-xl font-black text-white mb-8 tracking-tight flex items-center gap-2">
            <Server className="w-5 h-5 text-eco-green" /> Recovery Mix
          </h3>
          <div className="flex-1 min-h-[300px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats?.materialComposition || []}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  animationDuration={1500}
                >
                  {(stats?.materialComposition || []).map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <RechartsTooltip 
                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Efficiency</span>
                <span className="text-2xl font-black text-white">94%</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-6">
            {(stats?.materialComposition || []).map((item: any, idx: number) => (
                <div key={idx} className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.fill }}></div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter truncate">{item.name}</span>
                </div>
            ))}
          </div>
        </motion.div>
      </div >

  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
    {/* Resale vs Recycled Bar Chart */}
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass p-8 rounded-[2rem]"
    >
      <div className="flex justify-between items-center mb-10">
        <h3 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
          <Box className="w-5 h-5 text-eco-green" /> Path Distribution
        </h3>
        <Legend verticalAlign="top" align="right" iconType="circle" wrapperStyle={{ paddingBottom: '20px' }} />
      </div>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={stats?.deviceComparison || []}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis
              dataKey="name"
              stroke="#475569"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fontWeight: 700 }}
            />
            <YAxis
              stroke="#475569"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fontWeight: 700 }}
            />
            <RechartsTooltip
              contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }}
              cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }}
            />
            <Bar dataKey="resold" name="Resold" fill="#10b981" radius={[10, 10, 10, 10]} barSize={20} animationDuration={2000} />
            <Bar dataKey="recycled" name="Recycled" fill="#3b82f6" radius={[10, 10, 10, 10]} barSize={20} animationDuration={2000} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>

    {/* Global Predictive Map */}
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass p-8 rounded-[2rem] relative overflow-hidden"
    >
      <h3 className="text-xl font-black text-white mb-6 flex items-center gap-2 relative z-10">
        <Activity className="text-cyan-400 w-5 h-5" />
        Predictive Hotspots
      </h3>
      <div className="relative z-10 h-[320px]">
        <FuturisticPredictionMap />
      </div>
      <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-slate-900 to-transparent pointer-events-none"></div>
    </motion.div>
  </div>

{
  showReport && (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="glass w-full max-w-4xl p-8 rounded-3xl border border-slate-700 shadow-2xl relative max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={() => setShowReport(false)}
          className="absolute top-6 right-6 p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="flex justify-between items-center mb-8 border-b border-slate-800 pb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-eco-green/20 flex items-center justify-center border border-eco-green/50">
              <FileText className="text-eco-green w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white uppercase tracking-wider">Executive Summary Report</h2>
              <p className="text-slate-400 text-sm">Generated: {new Date().toLocaleDateString()}</p>
            </div>
          </div>
          <button
            onClick={() => {
              alert("Report initiated for download.");
              setShowReport(false);
            }}
            className="hidden md:flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-5 py-2.5 rounded-lg font-bold border border-slate-600 transition-all"
          >
            <Download className="w-4 h-4" /> Download PDF
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <h4 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-2">Financial Overview</h4>
              <p className="text-3xl font-black text-white">₹20.4 <span className="text-eco-green text-xl">Crores</span></p>
              <p className="text-slate-400 text-sm mt-1">Total revenue generated through AI-driven resale strategies and high-margin liquidations.</p>
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-2">Yield Metrics</h4>
              <ul className="space-y-3">
                <li className="flex justify-between items-center text-slate-300 border-b border-slate-800 pb-2">
                  <span>Total Devices Processed</span>
                  <span className="font-bold text-white">142,509</span>
                </li>
                <li className="flex justify-between items-center text-slate-300 border-b border-slate-800 pb-2">
                  <span>Gold Extracted (Au)</span>
                  <span className="font-bold text-yellow-500">8,405 g</span>
                </li>
                <li className="flex justify-between items-center text-slate-300 border-b border-slate-800 pb-2">
                  <span>Lithium Reclaimed (Li)</span>
                  <span className="font-bold text-cyan-400">12,201 kg</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800">
            <h4 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">Strategic Intelligence</h4>
            <p className="text-slate-300 leading-relaxed text-sm mb-4">
              The <strong className="text-white">YOLO-Powered AI Matrix</strong> successfully detected and assessed over 140k hardware components this period.
            </p>
            <p className="text-slate-300 leading-relaxed text-sm">
              Smartphones remain the highest margin category, while bulk enterprise server ingestion yielded an 18% month-over-month increase in raw gold extraction.
            </p>
            <div className="mt-6 p-4 rounded-xl bg-eco-green/10 border border-eco-green/20">
              <p className="text-eco-green font-bold text-sm">Recommendation:</p>
              <p className="text-slate-300 text-sm mt-1">Scale processing capacity in the Southern grid to meet rising predicted inflow for next quarter.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
    </div >
  );
};

export default Dashboard;
