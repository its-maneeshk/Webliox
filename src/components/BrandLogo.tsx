/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface BrandLogoProps {
  size?: number;
  className?: string;
  animate?: boolean;
}

export default function BrandLogo({ size = 48, className = '', animate = true }: BrandLogoProps) {
  return (
    <div 
      className={`relative flex items-center justify-center shrink-0 ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Outer elegant glow backdrop */}
      <div 
        className={`absolute inset-0 rounded-[28%] bg-gradient-to-tr from-emerald-500/20 to-cyan-500/25 blur-md opacity-70 ${
          animate ? 'animate-pulse' : ''
        }`}
        style={{ animationDuration: '3s' }}
      />

      {/* Deep premium squircle container */}
      <div 
        className="absolute inset-0 rounded-[24%] bg-gradient-to-b from-[#181a20] to-[#0e0f12] border border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.6)] flex items-center justify-center overflow-hidden group"
      >
        {/* Subtle internal shine */}
        <div className="absolute top-0 left-0 right-0 h-[40%] bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />

        {/* Premium SVG Glowing W */}
        <svg
          viewBox="0 0 100 100"
          className={`w-[60%] h-[60%] relative z-10 ${animate ? 'hover:scale-105 transition-transform duration-300' : ''}`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* The signature lime-to-cyan gradient */}
            <linearGradient id="brand-grad" x1="0%" y1="20%" x2="100%" y2="80%">
              <stop offset="0%" stopColor="#a8ff35" />   {/* Lime green */}
              <stop offset="50%" stopColor="#10b981" />  {/* Emerald green */}
              <stop offset="100%" stopColor="#06b6d4" /> {/* Cyan */}
            </linearGradient>

            {/* Glowing filter effect */}
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Glowing code brackets representing the web/development portal [ ] */}
          <path
            d="M 18,25 L 10,25 L 10,75 L 18,75"
            stroke="url(#brand-grad)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.4"
            className={animate ? 'path-glow-animation' : ''}
          />
          <path
            d="M 82,25 L 90,25 L 90,75 L 82,75"
            stroke="url(#brand-grad)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.4"
            className={animate ? 'path-glow-animation' : ''}
          />

          {/* Glowing W Path (Symmetrical, high-tech, geometric) */}
          <path
            d="M 24,32 L 39,70 L 50,48 L 61,70 L 76,32"
            stroke="url(#brand-grad)"
            strokeWidth="8"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#glow)"
            className={animate ? 'path-glow-animation' : ''}
          />
          
          {/* Inner metallic highlight path */}
          <path
            d="M 24,32 L 39,70 L 50,48 L 61,70 L 76,32"
            stroke="#ffffff"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.8"
          />
        </svg>

        {/* Ambient background light circle */}
        <div className="absolute w-6 h-6 rounded-full bg-cyan-400/10 blur-xl bottom-2 right-2 pointer-events-none" />
        <div className="absolute w-6 h-6 rounded-full bg-lime-400/5 blur-xl top-2 left-2 pointer-events-none" />
      </div>
    </div>
  );
}
