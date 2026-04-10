import React from 'react';
import FuturisticWorldMap from './FuturisticWorldMap';

/**
 * Thin wrapper — places FuturisticWorldMap as a full-bleed
 * pointer-events-none background layer inside the StoryPage hero section.
 */
const WorldPredictionBackground: React.FC = () => (
  <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
    {/* Only fade to dark at the very bottom so text stays readable */}
    <div
      className="absolute inset-0 z-10 pointer-events-none"
      style={{
        background:
          'linear-gradient(to bottom, rgba(2,6,23,0) 0%, rgba(2,6,23,0.05) 45%, rgba(2,6,23,0.88) 82%, rgba(2,6,23,1) 100%)',
      }}
    />
    <FuturisticWorldMap />
  </div>
);

export default WorldPredictionBackground;
