import React from 'react';

const DefaultCover = () => (
  <svg
    width="100%"
    height="100%"
    viewBox="0 0 400 225"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="playBg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FF3CAC" />
        <stop offset="50%" stopColor="#784BA0" />
        <stop offset="100%" stopColor="#2B86C5" />
      </linearGradient>
      <filter id="glow">
        <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
        <feMerge>
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>
    
    {/* 动态背景 */}
    <rect width="400" height="225" fill="url(#playBg)" opacity="0.1" />
    
    {/* 炫光播放按钮 */}
    <circle cx="200" cy="112.5" r="45" fill="url(#playBg)" opacity="0.2" filter="url(#glow)" />
    <circle cx="200" cy="112.5" r="35" fill="url(#playBg)" opacity="0.3" />
    <path
      d="M220 112.5L185 132.5V92.5L220 112.5Z"
      fill="white"
      filter="url(#glow)"
    />
  </svg>
);

export default DefaultCover; 