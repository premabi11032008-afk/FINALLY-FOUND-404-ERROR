import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, Cpu, HardDrive, Smartphone, CheckCircle, RefreshCcw, Trash2, Phone, CreditCard, ShieldAlert, TrendingUp, DollarSign, ArrowLeft } from 'lucide-react';

const ResaleExchange = () => {
  const navigate = useNavigate();
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [manualRating, setManualRating] = useState(3); // 1-5 scale
  
  // Order flow states
  const [orderStep, setOrderStep] = useState<'none' | 'identifying' | 'finalized'>('none');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [orderResponse, setOrderResponse] = useState<any>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setSelectedFiles(prev => [...prev, ...newFiles]);
      setPreviewUrls(prev => [...prev, ...newFiles.map(f => URL.createObjectURL(f))]);
      setResult(null);
      setOrderStep('none');
    }
  };

  const removeFile = (index: number) => {
    const newFiles = [...selectedFiles];
    const newUrls = [...previewUrls];
    newFiles.splice(index, 1);
    newUrls.splice(index, 1);
    setSelectedFiles(newFiles);
    setPreviewUrls(newUrls);
    
    if (newFiles.length === 0) {
      setResult(null);
      setOrderStep('none');
    }
  };

  const conditionLabels = [
    { label: "Scrapped", color: "text-red-500", desc: "Non-functional, parts only" },
    { label: "Poor", color: "text-orange-500", desc: "Significant damage/wear" },
    { label: "Average", color: "text-yellow-500", desc: "Working with signs of use" },
    { label: "Good", color: "text-eco-light", desc: "Minor scratches, fully functional" },
    { label: "Mint", color: "text-eco-green", desc: "Brand new condition" }
  ];

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFiles.length) {
      alert("Please upload device images first!");
      return;
    }
    
    setAnalyzing(true);
    setResult(null);
    setOrderStep('none');

    const formData = new FormData();
    selectedFiles.forEach(file => formData.append('files', file));

    try {
      const response = await fetch('http://127.0.0.1:8000/api/evaluate', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Failed to evaluate image');
      
      const data = await response.json();
      
      // HYBRID LOGIC: Adjust AI price based on Manual Rating
      // Each manual point above 3 adds 15%, below 3 subtracts 15%
      const rawPrice = data.raw_price || 1500;
      const confidenceMultiplier = 1 + (manualRating - 3) * 0.15;
      const adjustedPrice = Math.round(rawPrice * confidenceMultiplier);

      setResult({
        decision: data.is_verified ? data.condition : "Unverified Device",
        price: `₹${adjustedPrice.toLocaleString()}`,
        rawPrice: adjustedPrice,
        rating: data.rating,
        recommendation: data.recommendation,
        damage: data.damage_percent,
        isVerified: data.is_verified,
        deviceType: data.device_type
      });
    } catch (error) {
      alert("AI Backend not responding. Ensure server is running.");
    } finally {
      setAnalyzing(false);
    }
  };

  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  
  const handlePlaceOrder = async () => {
    if (!phoneNumber) { alert("Please enter your phone number"); return; }
    setIsPlacingOrder(true);
    try {
      const response = await fetch('http://127.0.0.1:8000/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: phoneNumber,
          price: result.price,
          condition: result.decision,
          type: result.deviceType
        }),
      });
      
      if (!response.ok) throw new Error("Server error");
      
      const data = await response.json();
      setOrderResponse(data || { message: "Order processed successfully." });
      setOrderStep('finalized');
    } catch (error) { 
      alert("Order failed. Please check your connection."); 
    } finally {
      setIsPlacingOrder(false);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-20 pt-8 text-left">
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/')}
            className="w-12 h-12 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-white hover:border-eco-green transition-all shadow-lg"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-4xl font-black text-white mb-2 tracking-tight">AI Assessment Matrix</h1>
            <p className="text-slate-400 font-medium">Hybrid YOLO + Human verification for maximum device value.</p>
          </div>
        </div>
        <div className="flex gap-2">
           <div className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-full text-[10px] font-black text-eco-green uppercase tracking-widest">Nodes Active</div>
           <div className="px-4 py-2 bg-eco-green/10 border border-eco-green/20 rounded-full text-[10px] font-black text-eco-green uppercase tracking-widest flex items-center gap-2">
             <CheckCircle className="w-3 h-3"/> Live Payouts
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3 space-y-6">
          <div className="glass p-8 rounded-[2rem] border-2 border-slate-800 transition-all hover:border-slate-700 bg-slate-900/40 backdrop-blur-md">
            <h3 className="text-xl font-black text-white mb-8 border-b border-slate-800 pb-4 flex items-center gap-2">
              <HardDrive className="w-5 h-5 text-eco-green" /> 1. PHYSICAL CAPTURE
            </h3>
            
            <div className="space-y-8">
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-700 hover:border-eco-green/50 rounded-[1.5rem] p-10 text-center cursor-pointer transition-all bg-slate-900/50 group relative overflow-hidden min-h-[220px] flex flex-col items-center justify-center shadow-inner"
              >
                <div className="relative z-10 space-y-4">
                   <div className="w-20 h-20 bg-slate-800 rounded-[1.5rem] flex items-center justify-center mx-auto group-hover:scale-110 transition-transform shadow-2xl border border-slate-700">
                      <Upload className="w-10 h-10 text-eco-green" />
                   </div>
                   <div>
                     <p className="text-xl font-black text-white tracking-tight">Capture Device Angles</p>
                     <p className="text-sm text-slate-500 font-medium">Multiple photos are analyzed for damage clustering.</p>
                   </div>
                </div>
                <input type="file" ref={fileInputRef} onChange={handleFileChange} multiple className="hidden" accept="image/*" />
              </div>

              {previewUrls.length > 0 && (
                <div className="grid grid-cols-4 sm:grid-cols-5 gap-4 animate-in slide-in-from-bottom-4 duration-500">
                   {previewUrls.map((url, idx) => (
                     <div key={idx} className="relative group aspect-square rounded-[1rem] overflow-hidden border border-slate-800 shadow-lg">
                        <img src={url} className="w-full h-full object-cover" />
                        <button 
                          onClick={(e) => { e.stopPropagation(); removeFile(idx); }}
                          className="absolute inset-0 bg-red-600/90 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300"
                        >
                          <Trash2 className="w-6 h-6" />
                        </button>
                     </div>
                   ))}
                   <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="aspect-square rounded-[1rem] border-2 border-dashed border-slate-800 flex items-center justify-center text-slate-600 hover:border-eco-green/50 hover:text-eco-green transition-all bg-slate-800/20"
                   >
                     <Upload className="w-6 h-6" />
                   </button>
                </div>
              )}

              <div className="space-y-6 pt-6 border-t border-slate-800">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-xl font-black text-white flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-eco-green" /> 2. HUMAN CONFIDENCE
                  </h3>
                  <div className={`px-4 py-1 rounded-full bg-slate-800 border border-slate-700 text-[10px] font-black uppercase tracking-[0.2em] ${conditionLabels[manualRating-1].color}`}>
                    {conditionLabels[manualRating-1].label}
                  </div>
                </div>
                
                <div className="px-2">
                  <input 
                    type="range" min="1" max="5" step="1"
                    value={manualRating}
                    onChange={(e) => setManualRating(parseInt(e.target.value))}
                    className="w-full h-4 bg-slate-800 rounded-full appearance-none cursor-pointer accent-eco-green shadow-inner border border-slate-700"
                  />
                  <div className="flex justify-between mt-6">
                    {conditionLabels.map((l, i) => (
                      <div key={i} className={`flex flex-col items-center gap-2 transition-all duration-300 ${manualRating === i+1 ? 'scale-110 opacity-100' : 'opacity-25 grayscale scale-90'}`}>
                        <div className={`w-3 h-3 rounded-full bg-current ${l.color}`}></div>
                        <div className={`text-[9px] font-black uppercase tracking-tighter text-center max-w-[50px] ${l.color}`}>
                          {l.label}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-8 p-4 rounded-xl bg-slate-800/30 border border-dashed border-slate-700 text-center">
                    <p className="text-sm font-bold text-slate-400">"{conditionLabels[manualRating-1].desc}"</p>
                  </div>
                </div>
              </div>

              <button 
                onClick={handleAnalyze} 
                disabled={analyzing || !selectedFiles.length} 
                className="w-full bg-white hover:bg-slate-100 text-slate-900 font-black text-2xl py-6 rounded-[1.5rem] transition-all shadow-[0_20px_40px_rgba(255,255,255,0.1)] hover:-translate-y-1 active:scale-95 disabled:opacity-30 flex justify-center items-center gap-4 mt-12"
              >
                {analyzing ? (
                   <><RefreshCcw className="w-7 h-7 animate-spin" /> RUNNING MATRIX...</>
                ) : (
                   <><Cpu className="w-7 h-7"/> INITIATE AI EXTRACTION</>
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className={`glass p-8 rounded-[2rem] h-full transition-all duration-700 bg-slate-900/40 backdrop-blur-xl ${result ? 'border-eco-green shadow-[0_0_60px_rgba(16,185,129,0.15)]' : 'border-slate-800 opacity-60'}`}>
            <h3 className="text-xl font-black text-white mb-8 border-b border-slate-800 pb-4 tracking-tighter">AI RESULT ENGINE</h3>
            
            {!result ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-600 space-y-6 py-24">
                <div className="relative">
                   <div className="absolute inset-0 bg-eco-green/20 blur-3xl rounded-full"></div>
                   <RefreshCcw className="w-24 h-24 opacity-20 animate-spin-slow relative z-10" />
                </div>
                <p className="font-black text-center px-12 text-lg leading-tight uppercase tracking-widest opacity-30">Awaiting Data Ingestion</p>
              </div>
            ) : (
              <div className="space-y-8 animate-in zoom-in-95 duration-700">
                <div className="relative p-8 rounded-[1.5rem] bg-gradient-to-br from-eco-green/20 to-blue-500/10 border-2 border-eco-green/40 overflow-hidden shadow-2xl">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-bl-[100px] z-0"></div>
                  <div className="relative z-10 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-black text-eco-green uppercase tracking-[0.3em] mb-2">Neural Link: {result.isVerified ? 'ENCRYPTED' : 'UNSTABLE'}</p>
                      <h2 className={`text-4xl font-black tracking-tighter ${result.rating >= 7 ? 'text-white' : 'text-yellow-400'}`}>
                        {result.decision}
                      </h2>
                      <p className="text-xs font-black text-slate-400 mt-2 uppercase tracking-[0.2em]">{result.deviceType}</p>
                    </div>
                    <div className="text-right">
                       <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Damage</p>
                       <p className="text-3xl font-black text-white">{result.damage}%</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-8 rounded-[1.5rem] bg-slate-900/80 border border-slate-800 shadow-inner group">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2">Verified INR Extraction</p>
                    <p className="text-6xl font-black text-white tracking-tighter group-hover:scale-110 transition-transform origin-left duration-500">{result.price}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-6 rounded-[1.2rem] bg-slate-950/50 border border-slate-800">
                       <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Matrix Score</p>
                       <p className="text-2xl font-black text-white">{result.rating}/10</p>
                    </div>
                    <div className="p-6 rounded-[1.2rem] bg-slate-950/50 border border-slate-800">
                       <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Matrix Path</p>
                       <p className="text-2xl font-black text-eco-green">{result.recommendation.split(' ')[0]}</p>
                    </div>
                  </div>
                </div>

                {orderStep === 'none' && (
                  <button 
                    onClick={() => setOrderStep('identifying')}
                    className="w-full bg-eco-green hover:bg-eco-light text-slate-900 font-black text-2xl py-6 rounded-[1.5rem] transition-all shadow-[0_20px_40px_rgba(16,185,129,0.3)] hover:-translate-y-2 uppercase tracking-tight"
                  >
                    FINALIZE EXTRACTION
                  </button>
                )}

                {orderStep === 'identifying' && (
                  <div className="space-y-4 animate-in slide-in-from-right-8 duration-500">
                    <input 
                      type="tel" 
                      placeholder="CONTACT_MOBILE_ID" 
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="w-full bg-slate-950 border-2 border-slate-800 rounded-2xl px-6 py-6 text-white font-black text-xl focus:outline-none focus:border-eco-green transition-all shadow-inner"
                    />
                    <button 
                      onClick={handlePlaceOrder}
                      disabled={isPlacingOrder}
                      className="w-full bg-white text-slate-900 font-black py-6 rounded-2xl hover:bg-slate-200 transition-all text-xl shadow-2xl flex items-center justify-center gap-2"
                    >
                      {isPlacingOrder ? (
                        <><RefreshCcw className="w-6 h-6 animate-spin" /> EXECUTING...</>
                      ) : (
                        "EXECUTE PROTOCOL"
                      )}
                    </button>
                  </div>
                )}

                {orderStep === 'finalized' && orderResponse && (
                  <div className="text-center space-y-8 pt-6 animate-in zoom-in duration-700">
                    <div className="relative inline-block">
                        <div className="absolute inset-0 bg-eco-green/40 blur-3xl"></div>
                        <CheckCircle className="w-24 h-24 text-eco-green mx-auto relative z-10" />
                    </div>
                    <h4 className="text-3xl font-black text-white uppercase tracking-tighter">PROTOCOL INITIATED</h4>
                    <p className="text-slate-400 font-medium leading-relaxed px-4">{orderResponse.message}</p>
                    <div className="bg-black/60 p-5 rounded-2xl border border-slate-800 font-mono text-[10px] text-eco-green/80 flex items-center justify-between">
                       <span>TRANSACTION_HASH</span>
                       <span className="font-black text-white">REC-3948520</span>
                    </div>
                    <button 
                      onClick={() => { setResult(null); setSelectedFiles([]); setPreviewUrls([]); setOrderStep('none'); setPhoneNumber(''); }}
                      className="text-eco-green font-black uppercase text-xs tracking-[0.3em] border-b-2 border-eco-green/20 pb-2 hover:border-eco-green/50 transition-all"
                    >
                      New Environment Assessment
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResaleExchange;
