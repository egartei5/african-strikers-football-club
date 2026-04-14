import React from 'react';

interface IconProps {
  className?: string;
}

export const UnityIcon: React.FC<IconProps> = ({ className = "w-10 h-10" }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="unityGrad" x1="0" y1="0" x2="100" y2="100">
        <stop offset="0%" stopColor="#2dd4bf" /> {/* teal-400 */}
        <stop offset="100%" stopColor="#047857" /> {/* emerald-700 */}
      </linearGradient>
    </defs>
    {/* Interlocking Rings */}
    <circle cx="35" cy="40" r="20" stroke="url(#unityGrad)" strokeWidth="8" />
    <circle cx="65" cy="40" r="20" stroke="url(#unityGrad)" strokeWidth="8" />
    <circle cx="50" cy="65" r="20" stroke="url(#unityGrad)" strokeWidth="8" />
    
    {/* Overlaps to create the interlocking effect */}
    <path d="M45 40 A 20 20 0 0 1 55 40" stroke="#020617" strokeWidth="12" />
    <path d="M45 40 A 20 20 0 0 1 55 40" stroke="url(#unityGrad)" strokeWidth="8" />
    
    <path d="M35 55 A 20 20 0 0 1 42 63" stroke="#020617" strokeWidth="12" />
    <path d="M35 55 A 20 20 0 0 1 42 63" stroke="url(#unityGrad)" strokeWidth="8" />
    
    <path d="M65 55 A 20 20 0 0 0 58 63" stroke="#020617" strokeWidth="12" />
    <path d="M65 55 A 20 20 0 0 0 58 63" stroke="url(#unityGrad)" strokeWidth="8" />
  </svg>
);

export const ExcellenceIcon: React.FC<IconProps> = ({ className = "w-10 h-10" }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="excGrad" x1="0" y1="0" x2="100" y2="100">
        <stop offset="0%" stopColor="#2dd4bf" />
        <stop offset="100%" stopColor="#047857" />
      </linearGradient>
    </defs>
    {/* Starburst / Diamond */}
    <path d="M50 5 L60 35 L95 35 L65 55 L75 90 L50 70 L25 90 L35 55 L5 35 L40 35 Z" stroke="url(#excGrad)" strokeWidth="6" strokeLinejoin="round" />
    <path d="M50 20 L55 40 L75 40 L60 50 L65 70 L50 60 L35 70 L40 50 L25 40 L45 40 Z" fill="url(#excGrad)" opacity="0.3" />
    <circle cx="50" cy="50" r="6" fill="url(#excGrad)" />
  </svg>
);

export const DisciplineIcon: React.FC<IconProps> = ({ className = "w-10 h-10" }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="discGrad" x1="0" y1="0" x2="100" y2="100">
        <stop offset="0%" stopColor="#2dd4bf" />
        <stop offset="100%" stopColor="#047857" />
      </linearGradient>
    </defs>
    {/* Shield with Target */}
    <path d="M50 10 L85 25 C85 60 65 85 50 95 C35 85 15 60 15 25 Z" stroke="url(#discGrad)" strokeWidth="6" strokeLinejoin="round" />
    <circle cx="50" cy="50" r="15" stroke="url(#discGrad)" strokeWidth="6" />
    <circle cx="50" cy="50" r="5" fill="url(#discGrad)" />
    <path d="M50 10 L50 95" stroke="url(#discGrad)" strokeWidth="4" opacity="0.3" />
    <path d="M15 25 L85 25" stroke="url(#discGrad)" strokeWidth="4" opacity="0.3" />
  </svg>
);

export const CommunityIcon: React.FC<IconProps> = ({ className = "w-10 h-10" }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="commGrad" x1="0" y1="0" x2="100" y2="100">
        <stop offset="0%" stopColor="#2dd4bf" />
        <stop offset="100%" stopColor="#047857" />
      </linearGradient>
    </defs>
    {/* Network / Globe */}
    <circle cx="50" cy="50" r="35" stroke="url(#commGrad)" strokeWidth="6" />
    <path d="M15 50 C30 60 70 60 85 50" stroke="url(#commGrad)" strokeWidth="6" strokeLinecap="round" />
    <path d="M15 50 C30 40 70 40 85 50" stroke="url(#commGrad)" strokeWidth="6" strokeLinecap="round" />
    <path d="M50 15 C40 30 40 70 50 85" stroke="url(#commGrad)" strokeWidth="6" strokeLinecap="round" />
    <path d="M50 15 C60 30 60 70 50 85" stroke="url(#commGrad)" strokeWidth="6" strokeLinecap="round" />
    <circle cx="50" cy="50" r="8" fill="url(#commGrad)" />
  </svg>
);
