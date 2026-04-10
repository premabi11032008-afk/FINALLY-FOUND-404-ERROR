import React from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for leaflet markers in modern react setups
import L from 'leaflet';
delete (L.Icon.Default.prototype as any)._getIconUrl;

const dataPoints = [
  { coord: [20.5937, 78.9629], intensity: 80, region: 'Central India', volume: '12,500 tons' },
  { coord: [19.0760, 72.8777], intensity: 95, region: 'Mumbai', volume: '25,000 tons' },
  { coord: [28.7041, 77.1025], intensity: 90, region: 'Delhi NCR', volume: '22,100 tons' },
  { coord: [12.9716, 77.5946], intensity: 85, region: 'Bangalore', volume: '18,400 tons' },
  { coord: [13.0827, 80.2707], intensity: 70, region: 'Chennai', volume: '9,800 tons' },
];

const HeatMap = () => {
  return (
    <div className="h-[300px] w-full rounded-xl overflow-hidden glass z-0 relative">
      <MapContainer 
        center={[20.5937, 78.9629]} 
        zoom={4} 
        style={{ height: '100%', width: '100%', background: '#09090b' }}
        zoomControl={false}
        attributionControl={false}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png"
        />
        {dataPoints.map((point, idx) => (
          <CircleMarker
            key={idx}
            center={point.coord as [number, number]}
            radius={point.intensity / 5}
            pathOptions={{ 
              fillColor: '#10b981', 
              color: '#34d399', 
              weight: 1, 
              opacity: 0.8, 
              fillOpacity: 0.5 
            }}
          >
            <Popup className="eco-popup">
              <div className="bg-slate-900 p-2 rounded text-slate-200">
                <p className="font-bold text-eco-green">{point.region}</p>
                <p className="text-sm">Volume: {point.volume}</p>
              </div>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
};

export default HeatMap;
