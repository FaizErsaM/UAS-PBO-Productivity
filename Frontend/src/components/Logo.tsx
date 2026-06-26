import React from 'react';

export const Logo = ({ className = "h-8" }: { className?: string }) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Abstract U / Speech Bubble Logo matching the image */}
      <svg 
        viewBox="0 0 100 100" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="h-full aspect-square"
      >
        <defs>
          <linearGradient id="purpleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#A78BFA" />
            <stop offset="100%" stopColor="#8B5CF6" />
          </linearGradient>
        </defs>
        
        {/* Main U Shape with triangle tail */}
        <path 
          d="M25 20 C25 20, 25 60, 25 65 C25 80, 75 80, 75 65 C75 60, 75 20, 75 20 C75 14, 85 14, 85 20 C85 65, 85 70, 85 70 C85 95, 15 95, 15 70 L10 85 L20 70 C15 65, 15 20, 15 20 C15 14, 25 14, 25 20 Z" 
          fill="url(#purpleGradient)"
        />
        
        {/* Inner Dot */}
        <circle cx="50" cy="45" r="8" fill="url(#purpleGradient)" />
      </svg>
      
      {/* HeyJipro Text Logo */}
      <div className="font-bold text-2xl tracking-tight hidden md:flex items-center">
        <span className="text-current">HEY</span>
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8B5CF6] to-[#A78BFA]">JIPRO</span>
      </div>
    </div>
  );
};
