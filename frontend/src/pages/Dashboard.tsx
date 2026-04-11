import React, { useState } from 'react';
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend 
} from 'recharts';
import { Activity, Coins, Server, TrendingUp, X, FileText, Download } from 'lucide-react';
import FuturisticPredictionMap from '../components/dashboard/FuturisticPredictionMap';

const lineData = [
  { year: '2019', generation: 2100 },
  { year: '2020', generation: 2400 },
  { year: '2021', generation: 2800 },
  { year: '2022', generation: 3200 },
  { year: '2023', generation: 3800 },
  { year: '2024', generation: 4500 },
];

const barData = [
  { name: 'Smartphones', resold: 4000, recycled: 2400 },
  { name: 'Laptops', resold: 3000, recycled: 1398 },
  { name: 'Tablets', resold: 2000, recycled: 9800 },
  { name: 'Desktop/TV', resold: 2780, recycled: 3908 },
];

const MetricCard = ({ title, value, subtext, icon: Icon, trend }: any) => (
  <div className="glass p-6 rounded-2xl flex flex-col justify-between hover:border-eco-green/40 transition-all">
    <div className="flex justify-between items-start mb-4">
      <div>
        <p className="text-slate-400 text-sm font-medium mb-1">{title}</p>
        <h3 className="text-3xl font-bold text-white tracking-tight">{value}</h3>
      </div>
      <div className="w-12 h-12 rounded-xl bg-slate-800/80 flex items-center justify-center border border-slate-700">
        <Icon className="text-eco-green w-6 h-6" />
      </div>
    </div>
    <div className="flex items-center gap-2">
      <div className={`flex items-center gap-1 text-sm ${trend > 0 ? 'text-eco-green' : 'text-red-400'}`}>
        <TrendingUp className={`w-4 h-4 ${trend < 0 && 'rotate-180'}`} />
        <span>{Math.abs(trend)}%</span>
      </div>
      <span className="text-slate-500 text-xs">{subtext}</span>
    </div>
  </div>
);

const Dashboard = () => {
  const [showReport, setShowReport] = useState(false);

  return (
    <div className="space-y-6 relative">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Analytics Dashboard</h1>
          <p className="text-slate-400">Real-time e-waste processing and recovery metrics.</p>
        </div>
        <button 
          onClick={() => setShowReport(true)}
          className="bg-eco-green hover:bg-eco-light text-slate-900 px-6 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2"
        >
          <Activity className="w-4 h-4" /> Generate Report
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard title="Total Devices Processed" value="142,509" subtext="vs last month" icon={Server} trend={12.5} />
        <MetricCard title="Gold Recovered (g)" value="8,405" subtext="vs last month" icon={Coins} trend={4.2} />
        <MetricCard title="Total Revenue" value="₹20.4 Cr" subtext="vs last month" icon={Activity} trend={18.1} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <div className="glass p-6 rounded-2xl">
          <h3 className="text-lg font-semibold text-white mb-6">Yearly E-Waste Generation (Tons)</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="year" stroke="#94a3b8" axisLine={false} tickLine={false} />
                <YAxis stroke="#94a3b8" axisLine={false} tickLine={false} />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }}
                  itemStyle={{ color: '#10b981' }}
                />
                <Line type="monotone" dataKey="generation" stroke="#10b981" strokeWidth={3} dot={{ r: 4, fill: '#0f172a', stroke: '#10b981', strokeWidth: 2 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass p-6 rounded-2xl">
          <h3 className="text-lg font-semibold text-white mb-6">Resale vs Recycled Devices</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" axisLine={false} tickLine={false} />
                <YAxis stroke="#94a3b8" axisLine={false} tickLine={false} />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }}
                  cursor={{ fill: 'rgba(51, 65, 85, 0.2)' }}
                />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                <Bar dataKey="resold" name="Resold" fill="#10b981" radius={[4, 4, 0, 0]} barSize={24} />
                <Bar dataKey="recycled" name="Recycled" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="glass p-6 rounded-2xl mt-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 blur-[100px] pointer-events-none"></div>
        <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
          <Activity className="text-cyan-400 w-5 h-5" /> 
          Global Predictive E-Waste Assessment
        </h3>
        <FuturisticPredictionMap />
      </div>

      {showReport && (
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
      )}
    </div>
  );
};

export default Dashboard;
