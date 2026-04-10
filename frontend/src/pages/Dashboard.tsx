import React from 'react';
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend 
} from 'recharts';
import { Activity, Coins, Server, TrendingUp } from 'lucide-react';
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
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Analytics Dashboard</h1>
          <p className="text-slate-400">Real-time e-waste processing and recovery metrics.</p>
        </div>
        <button className="bg-eco-green hover:bg-eco-light text-slate-900 px-6 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2">
          <Activity className="w-4 h-4" /> Generate Report
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard title="Total Devices Processed" value="142,509" subtext="vs last month" icon={Server} trend={12.5} />
        <MetricCard title="Gold Recovered (g)" value="8,405" subtext="vs last month" icon={Coins} trend={4.2} />
        <MetricCard title="Total Revenue" value="$2.4M" subtext="vs last month" icon={Activity} trend={18.1} />
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
    </div>
  );
};

export default Dashboard;
