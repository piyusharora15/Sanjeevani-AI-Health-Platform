import React from 'react';

const HumanBody = ({ highlightedPart }) => {
 const getPartClass = (part) => {
    return highlightedPart === part
      ? 'fill-red-400 opacity-90 transition-all duration-300 ease-in-out'
      : 'fill-gray-300 opacity-60 transition-all duration-300 ease-in-out';
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center p-4">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 200 400"
        className="max-w-full max-h-full"
        aria-label="Diagram of a human body"
      >
        <g stroke="#6B7280" strokeWidth="1" strokeLinejoin="round">
          {/* Head */}
          <path
            id="head"
            className={getPartClass('head')}
            d="M 100,50 a 20,20 0 1,1 0.1,0 z"
            aria-label="Head area"
          />
          
          {/* Neck */}
          <path
            d="M 95,70 h 10 v 10 h -10 Z"
            className="fill-gray-300 opacity-60"
          />

          {/* Torso (Chest and Abdomen) */}
          <path
            id="chest"
            className={getPartClass('chest')}
            d="M 80,80 C 75,85 70,110 70,120 L 75,140 h 50 l 5,-20 C 130,110 125,85 120,80 Z"
            aria-label="Chest area"
          />
          <path
            id="abdomen"
            className={getPartClass('abdomen')}
            d="M 75,140 C 75,150 70,170 80,180 h 40 c 10,-10 5,-30 5,-40 Z"
            aria-label="Abdomen area"
          />

          {/* Arms */}
          <g id="arms" className={getPartClass('arms')}>
            <path d="M 70,85 C 60,95 40,120 35,170 l 15,0 C 55,130 65,110 72,90 Z" aria-label="Left arm"/>
            <path d="M 130,85 C 140,95 160,120 165,170 l -15,0 C 145,130 135,110 128,90 Z" aria-label="Right arm"/>
          </g>

          {/* Legs */}
          <g id="legs" className={getPartClass('legs')}>
            <path d="M 80,180 C 70,230 65,280 65,330 l 20,0 C 85,280 85,230 82,180 Z" aria-label="Left leg"/>
            <path d="M 120,180 C 130,230 135,280 135,330 l -20,0 C 115,280 115,230 118,180 Z" aria-label="Right leg"/>
          </g>
        </g>
      </svg>
    </div>
  );
};

export default HumanBody;