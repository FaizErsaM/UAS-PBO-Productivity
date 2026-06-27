import React, { useEffect } from 'react';
import { motion } from 'motion/react';

export const IntroSplashScreen = ({ onComplete }: { onComplete: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 3000); // 3 seconds intro duration
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
    >
      <div className="flex flex-col items-center">
        {/* Animated U-Logo */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative w-32 h-32 mb-8"
        >
          <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-xl">
            <defs>
              <linearGradient id="purpleGradient" x1="20" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#a855f7" />
                <stop offset="100%" stopColor="#6366f1" />
              </linearGradient>
            </defs>
            {/* Outline / Shape of U */}
            <path
              d="M35 30 L35 70 C35 85 85 85 85 70 L85 30"
              stroke="url(#purpleGradient)"
              strokeWidth="22"
              strokeLinecap="round"
            />
            {/* Left triangle/tail */}
            <path d="M30 75 L 25 100 L 50 85 Z" fill="url(#purpleGradient)" />
            {/* Center dot */}
            <circle cx="60" cy="55" r="9" fill="url(#purpleGradient)" />
          </svg>
        </motion.div>

        {/* Text Logo */}
        <motion.div
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           transition={{ duration: 0.8, delay: 0.4 }}
           className="text-5xl font-bold tracking-widest flex items-center mb-4"
        >
          <span className="text-[#0B1221]">HEY</span>
          <span className="text-transparent bg-clip-text bg-linear-to-r from-purple to-[#6366F1]">JIPRO</span>
        </motion.div>

        {/* Tagline */}
        <motion.div
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           transition={{ duration: 0.8, delay: 0.8 }}
           className="text-slate-600 tracking-[0.2em] uppercase text-sm font-medium"
        >
          Small progress, big change.
        </motion.div>
      </div>
    </motion.div>
  );
};
