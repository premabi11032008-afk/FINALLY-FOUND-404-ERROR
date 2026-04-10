import React from 'react';
import { UploadCloud, Truck, DollarSign, TrendingUp, TrendingDown } from 'lucide-react';

const metalPrices = [
  { name: 'Gold (Au)', price: '$65.32/g', change: '+1.2%', up: true },
  { name: 'Copper (Cu)', price: '$8.45/kg', change: '-0.4%', up: false },
  { name: 'Lithium (Li)', price: '$35.20/kg', change: '+2.5%', up: true },
  { name: 'Silver (Ag)', price: '$0.75/g', change: '+0.1%', up: true },
];

const scrapData = [
  { id: '1', part: 'Motherboard (High Grade)', qty: '50 kg', gold: '15 g', copper: '10 kg', value: '$1,060' },
  { id: '2', part: 'Smartphone Batteries', qty: '120 kg', gold: '0 g', copper: '5 kg', value: '$420' },
  { id: '3', part: 'RAM Sticks', qty: '15 kg', gold: '8 g', copper: '2 kg', value: '$535' },
  { id: '4', part: 'CPU Processors', qty: '5 kg', gold: '12 g', copper: '0.5 kg', value: '$780' },
];

const ScrapRecovery = () => {
  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Scrap & Metal Recovery</h1>
        <p className="text-slate-400">Bulk upload and real-time metal valuation for recyclers.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Live Metal Prices Widget */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass p-6 rounded-2xl">
            <h3 className="text-lg font-semibold text-white mb-4">Live Metal Prices</h3>
            <div className="space-y-4">
              {metalPrices.map((metal, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-slate-800/30 border border-slate-700/50">
                  <span className="text-slate-200 font-medium">{metal.name}</span>
                  <div className="text-right">
                    <p className="text-white font-bold">{metal.price}</p>
                    <p className={`text-xs flex items-center justify-end gap-1 ${metal.up ? 'text-eco-green' : 'text-red-400'}`}>
                      {metal.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                      {metal.change}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-slate-500 mt-4 text-center">Updated 2 mins ago</p>
          </div>

          {/* Bulk Upload Widget */}
          <div className="glass p-6 rounded-2xl">
            <h3 className="text-lg font-semibold text-white mb-4">Bulk Inventory Upload</h3>
            <div className="border-2 border-dashed border-slate-700 hover:border-eco-green/50 rounded-xl p-8 text-center cursor-pointer transition-colors bg-slate-800/20">
              <UploadCloud className="w-10 h-10 text-slate-400 mx-auto mb-3" />
              <p className="text-sm font-medium text-slate-200">Shop Inventory CSV/Excel</p>
              <p className="text-xs text-slate-500 mt-1">Upload manifest for instant valuation</p>
            </div>
            <button className="w-full mt-4 bg-slate-700 hover:bg-slate-600 text-white font-medium py-2 rounded-lg transition-colors">
              Browse Files
            </button>
          </div>
        </div>

        {/* Central Table */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass p-6 rounded-2xl overflow-hidden flex flex-col h-full">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-white">Current Inventory Value</h3>
              <div className="px-4 py-1.5 rounded-full bg-eco-green/10 text-eco-green text-sm font-bold border border-eco-green/20">
                Total Est: $2,795.00
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-700 text-slate-400 text-sm">
                    <th className="pb-3 font-medium">Device Part</th>
                    <th className="pb-3 font-medium">Quantity</th>
                    <th className="pb-3 font-medium">Est. Gold</th>
                    <th className="pb-3 font-medium">Est. Copper</th>
                    <th className="pb-3 font-medium text-right">Market Value</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {scrapData.map((item) => (
                    <tr key={item.id} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                      <td className="py-4 text-slate-200">{item.part}</td>
                      <td className="py-4 text-slate-400">{item.qty}</td>
                      <td className="py-4 text-yellow-500">{item.gold}</td>
                      <td className="py-4 text-orange-400">{item.copper}</td>
                      <td className="py-4 text-eco-light font-bold text-right">{item.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-auto pt-8 flex gap-4">
              <button className="flex-1 bg-eco-green hover:bg-eco-light text-slate-900 font-bold py-3 rounded-xl transition-all flex justify-center items-center gap-2">
                <DollarSign className="w-5 h-5" /> Sell to Recycler
              </button>
              <button className="flex-1 bg-slate-700 hover:bg-slate-600 outline outline-1 outline-slate-500 text-white font-bold py-3 rounded-xl transition-all flex justify-center items-center gap-2">
                <Truck className="w-5 h-5" /> Request Pickup
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ScrapRecovery;
