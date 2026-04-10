import React, { useState } from 'react';
import { Upload, Cpu, HardDrive, Smartphone, CheckCircle, RefreshCcw, Trash2 } from 'lucide-react';

const ResaleExchange = () => {
  const [condition, setCondition] = useState(50);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleAnalyze = (e: React.FormEvent) => {
    e.preventDefault();
    setAnalyzing(true);
    
    // Simulate AI analysis delay
    setTimeout(() => {
      setAnalyzing(false);
      setResult({
        decision: condition > 60 ? 'Resell' : condition > 30 ? 'Refurbish' : 'Scrap',
        price: condition > 60 ? '$250' : '$120',
        repair: condition > 60 ? '$0' : condition > 30 ? '$45' : 'N/A',
        margin: condition > 60 ? '35%' : condition > 30 ? '20%' : '15% (Materials)'
      });
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Resale & Exchange AI</h1>
        <p className="text-slate-400">Evaluate devices to determine the optimal recovery path.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Form */}
        <div className="glass p-8 rounded-2xl">
          <h3 className="text-xl font-semibold text-white mb-6">Device Details</h3>
          
          <form onSubmit={handleAnalyze} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-slate-400 mb-1">Device Type</label>
                <select className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-2 text-slate-200 focus:outline-none focus:border-eco-green/50">
                  <option>Smartphone</option>
                  <option>Laptop</option>
                  <option>Tablet</option>
                  <option>TV/Monitor</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Brand</label>
                <input type="text" placeholder="e.g. Apple" className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-2 text-slate-200 focus:outline-none focus:border-eco-green/50" />
              </div>
            </div>

            <div>
              <label className="block text-sm text-slate-400 mb-1">Model</label>
              <input type="text" placeholder="e.g. iPhone 13 Pro" className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-2 text-slate-200 focus:outline-none focus:border-eco-green/50" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-slate-400 mb-1 flex items-center gap-1"><Cpu className="w-4 h-4"/> RAM</label>
                <select className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-2 text-slate-200 focus:outline-none focus:border-eco-green/50">
                  <option>4 GB</option>
                  <option>8 GB</option>
                  <option>16 GB</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1 flex items-center gap-1"><HardDrive className="w-4 h-4"/> Storage</label>
                <select className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-2 text-slate-200 focus:outline-none focus:border-eco-green/50">
                  <option>64 GB</option>
                  <option>128 GB</option>
                  <option>256 GB</option>
                  <option>512 GB</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm text-slate-400 mb-1 flex justify-between">
                <span>Condition</span>
                <span className="text-eco-green">{condition > 60 ? 'Good' : condition > 30 ? 'Fair' : 'Poor'}</span>
              </label>
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={condition} 
                onChange={(e) => setCondition(parseInt(e.target.value))}
                className="w-full accent-eco-green" 
              />
            </div>

            <div>
              <label className="block text-sm text-slate-400 mb-1">Upload Device Image</label>
              <div className="border-2 border-dashed border-slate-700 hover:border-eco-green/50 rounded-xl p-6 text-center cursor-pointer transition-colors bg-slate-800/20">
                <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-sm text-slate-300">Drag & drop or click to upload</p>
                <p className="text-xs text-slate-500 mt-1">Supports JPG, PNG (Max 5MB)</p>
              </div>
            </div>

            <button type="submit" disabled={analyzing} className="w-full bg-eco-green hover:bg-eco-light text-slate-900 font-bold py-3 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2">
              {analyzing ? (
                <><RefreshCcw className="w-5 h-5 animate-spin" /> Analyzing...</>
              ) : (
                <><Smartphone className="w-5 h-5" /> Run AI Assessment</>
              )}
            </button>
          </form>
        </div>

        {/* Output Section */}
        <div className="flex flex-col gap-6">
          <div className={`glass p-8 rounded-2xl flex-1 transition-all duration-500 ${result ? 'opacity-100 translate-y-0' : 'opacity-50 translate-y-4 filter grayscale'}`}>
            <h3 className="text-xl font-semibold text-white mb-6">AI Decision Matrix</h3>
            
            {!result ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-500 min-h-[300px]">
                <Cpu className="w-16 h-16 mb-4 opacity-20" />
                <p>Awaiting device data...</p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="p-6 rounded-xl bg-slate-800/50 border border-slate-700 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">Recommendation</p>
                    <h2 className={`text-3xl font-bold mt-1 ${result.decision === 'Resell' ? 'text-eco-light' : result.decision === 'Refurbish' ? 'text-yellow-400' : 'text-red-400'}`}>
                      {result.decision}
                    </h2>
                  </div>
                  {result.decision === 'Resell' && <CheckCircle className="w-12 h-12 text-eco-light" />}
                  {result.decision === 'Refurbish' && <RefreshCcw className="w-12 h-12 text-yellow-400" />}
                  {result.decision === 'Scrap' && <Trash2 className="w-12 h-12 text-red-400" />}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-slate-800/30 border border-slate-700/50">
                    <p className="text-sm text-slate-400">Est. Resale Price</p>
                    <p className="text-xl font-bold text-white mt-1">{result.price}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-800/30 border border-slate-700/50">
                    <p className="text-sm text-slate-400">Repair Cost</p>
                    <p className="text-xl font-bold text-white mt-1">{result.repair}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-800/30 border border-slate-700/50 col-span-2">
                    <p className="text-sm text-slate-400">Profit Margin</p>
                    <p className="text-2xl font-bold text-eco-green mt-1">{result.margin}</p>
                  </div>
                </div>

                <div className="pt-4 flex gap-4">
                  <button className="flex-1 bg-eco-green hover:bg-eco-light text-slate-900 font-bold py-3 rounded-xl transition-all">
                    Sell Now
                  </button>
                  <button className="flex-1 bg-slate-700 hover:bg-slate-600 outline outline-1 outline-slate-500 text-white font-bold py-3 rounded-xl transition-all">
                    Send for {result.decision === 'Scrap' ? 'Recovery' : 'Refurbishment'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResaleExchange;
