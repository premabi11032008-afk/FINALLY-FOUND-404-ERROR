import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Activity } from 'lucide-react';
import L from 'leaflet';
delete (L.Icon.Default.prototype as any)._getIconUrl;

// Map logical region names to lat/lng coordinates in India
const regionCoordinates: Record<string, [number, number]> = {
  'North': [28.7041, 77.1025], // Delhi
  'South': [12.9716, 77.5946], // Bangalore
  'East': [22.5726, 88.3639],  // Kolkata
  'West': [19.0760, 72.8777],  // Mumbai
  'Central': [21.1458, 79.0882], // Nagpur
};

interface Prediction {
  region: string;
  predicted_total: number;
  is_top_hotspot: boolean;
}

const FuturisticPredictionMap = () => {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Hardcoded for demo, could be dynamic
  const [year, setYear] = useState(2026);
  const [month, setMonth] = useState(5);

  useEffect(() => {
    const fetchPredictions = async () => {
      setLoading(true);
      try {
        const res = await fetch(`http://127.0.0.1:8000/api/predict?month=${month}&year=${year}`);
        if (!res.ok) throw new Error('Failed to fetch predictions');
        const data = await res.json();
        setPredictions(data.predictions);
      } catch (err: any) {
        console.error(err);
        setError('Error loading AI predictions. Is the backend running?');
        // Fallback dummy data for visual testing if backend is off
        setPredictions([
          { region: 'North', predicted_total: 45.2, is_top_hotspot: true },
          { region: 'South', predicted_total: 38.1, is_top_hotspot: false },
          { region: 'East', predicted_total: 21.0, is_top_hotspot: false },
          { region: 'West', predicted_total: 42.8, is_top_hotspot: true },
          { region: 'Central', predicted_total: 19.5, is_top_hotspot: false },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchPredictions();
  }, [month, year]);

  return (
    <div className="flex flex-col h-[450px] w-full rounded-2xl overflow-hidden glass border border-slate-800/60 relative">
      <div className="absolute top-4 left-4 z-[400] bg-slate-900/80 backdrop-blur-md border border-slate-700/50 p-4 rounded-xl max-w-sm pointer-events-auto">
        <div className="flex items-center gap-2 mb-2">
          <Activity className="w-5 h-5 text-cyan-400 animate-pulse" />
          <h3 className="text-white font-bold tracking-wide">Predictive Analysis</h3>
        </div>
        <p className="text-slate-400 text-xs mb-4">
          XGBoost AI Model extrapolating E-Waste generation for Period: <span className="text-cyan-400 font-mono">{year}-{month.toString().padStart(2, '0')}</span>
        </p>

        {loading ? (
          <div className="text-cyan-400 text-sm animate-pulse">Running Neural Simulation...</div>
        ) : error ? (
          <div className="text-red-400 text-xs">⚠️ {error} (Using Mock Data)</div>
        ) : (
          <div className="text-xs text-eco-green">✓ Neural mapping complete</div>
        )}
      </div>

      <div className="h-full w-full relative z-0">
        <MapContainer
          center={[20.5937, 78.9629]}
          zoom={5}
          style={{ height: '100%', width: '100%', background: '#020617' }}
          zoomControl={false}
          attributionControl={false}
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png"
          />
          {predictions.map((p, idx) => {
            const coord = regionCoordinates[p.region] || [20.0, 78.0];
            const radius = Math.max(10, p.predicted_total / 2); // Scale radius by prediction

            // Futuristic styles depending on priority
            const color = p.is_top_hotspot ? '#06b6d4' : '#10b981'; // Cyan for hotspot, Eco Green for normal

            return (
              <CircleMarker
                key={idx}
                center={coord}
                radius={p.is_top_hotspot ? radius * 1.5 : radius}
                pathOptions={{
                  fillColor: color,
                  color: color,
                  weight: p.is_top_hotspot ? 3 : 1,
                  opacity: 0.9,
                  fillOpacity: p.is_top_hotspot ? 0.4 : 0.2,
                  className: p.is_top_hotspot ? "animate-pulse" : ""
                }}
              >
                <Popup className="eco-popup border-0">
                  <div className="bg-slate-900/95 border border-slate-700 p-3 rounded-lg text-slate-200 min-w-[150px]">
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`w-2 h-2 rounded-full ${p.is_top_hotspot ? 'bg-cyan-400 animate-pulse' : 'bg-eco-green'}`} />
                      <p className="font-bold text-white uppercase tracking-wider text-xs">{p.region} Region</p>
                    </div>
                    <p className="text-sm border-t border-slate-800 pt-2 flex justify-between">
                      <span className="text-slate-400">Total:</span>
                      <span className="font-mono text-white">{p.predicted_total} <span className="text-[10px] text-slate-500">M Tons</span></span>
                    </p>
                    {p.is_top_hotspot && (
                      <div className="mt-2 text-[10px] text-cyan-400 font-mono bg-cyan-400/10 inline-block px-2 py-1 rounded">
                        CRITICAL HOTSPOT
                      </div>
                    )}
                  </div>
                </Popup>
              </CircleMarker>
            );
          })}
        </MapContainer>
      </div>
    </div>
  );
};

export default FuturisticPredictionMap;
