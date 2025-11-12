import React from 'react';

export const HeroIllustration: React.FC = () => (
<svg viewBox="0 0 512 341" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="hero-grad1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#06b6d4" />
      <stop offset="100%" stopColor="#3b82f6" />
    </linearGradient>
    <linearGradient id="hero-grad2" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#67e8f9" />
      <stop offset="100%" stopColor="#60a5fa" />
    </linearGradient>
    <filter id="hero-glow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="8" result="coloredBlur" />
      <feMerge>
        <feMergeNode in="coloredBlur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
  </defs>
  <g fill="none" fillRule="evenodd">
    {/* Glowing Background Shapes */}
    <circle cx="256" cy="170" r="150" fill="url(#hero-grad2)" opacity="0.1" filter="url(#hero-glow)" />
    <path d="M-20 350 C 150 250, 350 400, 550 150" stroke="url(#hero-grad1)" strokeWidth="2" opacity="0.3" />

    {/* Central UI Element - Document */}
    <g transform="translate(100 50)">
      <rect x="0" y="0" width="312" height="241" rx="12" className="fill-white dark:fill-slate-800 shadow-2xl" />
      <rect fill="url(#hero-grad1)" x="20" y="20" width="100" height="8" rx="4" />
      <rect x="20" y="45" width="272" height="6" rx="3" className="fill-slate-200 dark:fill-slate-700" />
      <rect x="20" y="60" width="240" height="6" rx="3" className="fill-slate-200 dark:fill-slate-700" />
      <rect x="20" y="75" width="272" height="6" rx="3" className="fill-slate-200 dark:fill-slate-700" />
    </g>

    {/* Floating Analytics Card */}
    <g transform="translate(250 150)">
      <rect x="0" y="0" width="220" height="150" rx="12" className="fill-white dark:fill-slate-800 shadow-2xl" />
      <path d="M20 100 C 60 40, 100 120, 190 70" stroke="url(#hero-grad1)" strokeWidth="4" strokeLinecap="round" />
      <circle cx="20" cy="100" r="6" fill="#06b6d4" />
      <circle cx="190" cy="70" r="6" fill="#3b82f6" />
      <rect x="20" y="20" width="80" height="8" rx="4" className="fill-slate-200 dark:fill-slate-700" />
      <rect fill="#10B981" x="170" y="20" width="30" height="8" rx="4" />
    </g>

    {/* Floating Score Card */}
    <g transform="translate(40 180)">
       <rect x="0" y="0" width="160" height="100" rx="12" className="fill-white dark:fill-slate-800 shadow-2xl" />
       <text x="20" y="50" fontFamily="Inter, sans-serif" fontSize="24" fontWeight="bold" className="fill-slate-800 dark:fill-slate-200">Score: 
         <tspan fill="#06b6d4"> 8.2</tspan>
       </text>
       <rect fill="#06b6d4" x="20" y="70" width="120" height="4" rx="2" />
       <rect x="20" y="70" width="120" height="4" rx="2" opacity="0.3" className="fill-slate-200 dark:fill-slate-700" />
    </g>

     {/* Floating Icon Elements */}
     <g transform="translate(450 40)" className="opacity-80">
        <circle fill="url(#hero-grad1)" r="20" />
        <path d="M-6 -6 L 6 6 M -6 6 L 6 -6" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" transform="translate(0, 0)"/>
     </g>
     <g transform="translate(60 40)" className="opacity-80">
        <circle fill="url(#hero-grad2)" r="15" />
        <path d="M-5 0 H 5 M 0 -5 V 5" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" transform="translate(0, 0)"/>
     </g>
  </g>
</svg>
);

export const MissionIllustration: React.FC = () => (
<svg viewBox="0 0 512 341" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="mission-grad1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#06b6d4" />
      <stop offset="100%" stopColor="#3b82f6" />
    </linearGradient>
    <linearGradient id="mission-grad2" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#67e8f9" />
      <stop offset="100%" stopColor="#60a5fa" />
    </linearGradient>
    <filter id="mission-glow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="10" result="coloredBlur" />
      <feMerge>
        <feMergeNode in="coloredBlur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
  </defs>
  <g fill="none" fillRule="evenodd">
    {/* Background elements */}
    <rect className="fill-transparent" width="512" height="341" />
    <path d="M-10 200 C 150 100, 350 250, 520 100" stroke="url(#mission-grad2)" strokeWidth="1" opacity="0.2" />
    <path d="M-10 250 C 200 180, 300 300, 520 150" stroke="url(#mission-grad2)" strokeWidth="1" opacity="0.2" />

    {/* Platforms representing the chasm */}
    <path d="M0 200 L 150 220 L 150 341 L 0 341 Z" className="fill-slate-200 dark:fill-slate-800" />
    <path d="M512 180 L 362 160 L 362 341 L 512 341 Z" className="fill-slate-200 dark:fill-slate-800" />
    
    {/* Stylized human figure */}
    <g transform="translate(100, 165)">
      <circle cx="15" cy="15" r="8" className="fill-slate-700 dark:fill-slate-300" />
      <rect x="7" y="23" width="16" height="30" rx="8" className="fill-slate-700 dark:fill-slate-300" />
    </g>

    {/* AI Bridge */}
    <g filter="url(#mission-glow)">
      <path d="M150 220 C 220 230, 292 150, 362 160" stroke="url(#mission-grad1)" strokeWidth="5" strokeLinecap="round" />
      <path d="M150 220 C 220 230, 292 150, 362 160" stroke="white" strokeWidth="10" strokeLinecap="round" opacity="0.2" />
    </g>
    
    {/* AI Nodes */}
    <g>
      <circle cx="150" cy="220" r="6" fill="url(#mission-grad1)" />
      <circle cx="256" cy="180" r="8" fill="url(#mission-grad1)" filter="url(#mission-glow)" />
      <circle cx="362" cy="160" r="6" fill="url(#mission-grad1)" />

      <path d="M256 180 L 200 130" stroke="url(#mission-grad2)" strokeWidth="1.5" opacity="0.7" />
      <path d="M256 180 L 312 130" stroke="url(#mission-grad2)" strokeWidth="1.5" opacity="0.7" />
      <circle cx="200" cy="130" r="4" fill="url(#mission-grad2)" />
      <circle cx="312" cy="130" r="4" fill="url(#mission-grad2)" />
    </g>

    {/* Destination symbol */}
    <g transform="translate(420, 100)">
        <path d="M18 36 C 27.941 36 36 27.941 36 18 S 27.941 0 18 0 S 0 8.059 0 18 S 8.059 36 18 36 Z" fill="url(#mission-grad2)" opacity="0.3" filter="url(#mission-glow)"/>
        <path d="M18 8 L 21.163 14.528 L 28.326 15.528 L 23.163 20.472 L 24.326 27.472 L 18 24 L 11.674 27.472 L 12.837 20.472 L 7.674 15.528 L 14.837 14.528 Z" fill="white"/>
    </g>
  </g>
</svg>
);


export const AuthIllustration: React.FC = () => (
<svg viewBox="0 0 512 341" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style={{stopColor: '#06b6d4', stopOpacity: 1}} />
      <stop offset="100%" style={{stopColor: '#3b82f6', stopOpacity: 1}} />
    </linearGradient>
    <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style={{stopColor: '#67e8f9', stopOpacity: 1}} />
      <stop offset="100%" style={{stopColor: '#60a5fa', stopOpacity: 1}} />
    </linearGradient>
     <filter id="glow">
      <feGaussianBlur stdDeviation="3.5" result="coloredBlur" />
      <feMerge>
        <feMergeNode in="coloredBlur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
  </defs>
  <g fill="none" fillRule="evenodd">
    {/* Base Background */}
    <rect className="fill-slate-100 dark:fill-slate-950" width="512" height="341" rx="20" />
    
    {/* Abstract Shapes */}
    <path d="M450,50 Q500,150 400,250 T250,300" stroke="url(#grad2)" strokeWidth="2" className="opacity-50" />
    <path d="M50,300 Q150,200 250,250 T400,150" stroke="url(#grad2)" strokeWidth="2" className="opacity-30" />
    
    {/* Main Document Shape */}
    <g transform="translate(120, 40) rotate(-5, 136, 131)">
      <rect className="fill-white dark:fill-slate-800 stroke-slate-200 dark:stroke-slate-700" strokeWidth="2" x="0" y="0" width="272" height="262" rx="12" />
      <rect fill="url(#grad1)" x="20" y="25" width="232" height="12" rx="6" />
      
      <rect className="fill-slate-200 dark:fill-slate-600" x="20" y="55" width="180" height="8" rx="4" />
      <rect className="fill-slate-200 dark:fill-slate-600" x="20" y="73" width="210" height="8" rx="4" />
      <rect className="fill-slate-200 dark:fill-slate-600" x="20" y="91" width="195" height="8" rx="4" />
      
      <rect fill="url(#grad2)" x="20" y="125" width="90" height="8" rx="4" />
      <rect className="fill-slate-200 dark:fill-slate-600" x="20" y="148" width="232" height="6" rx="3" />
      <rect className="fill-slate-200 dark:fill-slate-600" x="20" y="162" width="232" height="6" rx="3" />
      <rect className="fill-slate-200 dark:fill-slate-600" x="20" y="176" width="190" height="6" rx="3" />

    </g>

    {/* Floating UI Elements */}
    <g transform="translate(330, 180)">
       <rect className="fill-white dark:fill-slate-800 stroke-slate-200 dark:stroke-slate-700" strokeWidth="2" x="0" y="0" width="150" height="110" rx="12" filter="url(#glow)" />
       <circle fill="#10b981" cx="30" cy="30" r="10" />
       <rect className="fill-slate-200 dark:fill-slate-600" x="50" y="26" width="70" height="8" rx="4" />
       <circle fill="#f59e0b" cx="30" cy="60" r="10" />
       <rect className="fill-slate-200 dark:fill-slate-600" x="50" y="56" width="50" height="8" rx="4" />
       <path d="M20 85 L 130 85" stroke="#3b82f6" strokeWidth="4" strokeLinecap="round" />
    </g>

    <g transform="translate(50, 80)">
       <rect className="fill-white dark:fill-slate-800 stroke-slate-200 dark:stroke-slate-700" strokeWidth="2" x="0" y="0" width="120" height="70" rx="12" filter="url(#glow)" />
       <path d="M20 25 L 50 45 L 100 20" stroke="#06b6d4" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
    </g>

    {/* Sparkle Icons */}
    <path d="M480 40 L 485 50 L 490 40 L 485 30 Z" className="fill-cyan-400 opacity-80" />
    <path d="M80 280 L 83 290 L 86 280 L 83 270 Z" className="fill-blue-400 opacity-80" />
    <circle cx="430" cy="150" r="5" className="fill-cyan-300 opacity-70" />
    <circle cx="120" cy="50" r="7" className="fill-blue-300 opacity-70" />
  </g>
</svg>
);