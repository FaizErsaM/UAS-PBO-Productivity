import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Play, Pause, Square } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export const DeepWorkView = ({ onClose }: { onClose: () => void }) => {
  const { tasks } = useAppContext();
  const mainFocus = tasks.find(t => !t.completed) || tasks[0];
  
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 mins
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      setIsActive(false);
      // could play sound here
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft]);

  const toggleTimer = () => setIsActive(!isActive);
  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(25 * 60);
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  // Minecraft-esque animation for background elements
  const generateBlocks = () => {
    return Array.from({ length: 15 }).map((_, i) => {
      const size = Math.random() * 40 + 20;
      return (
        <motion.div
          key={i}
          className="absolute bg-white/10 border-2 border-white/20"
          style={{
            width: size,
            height: size,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            boxShadow: 'inset -2px -2px 0px rgba(0,0,0,0.2), inset 2px 2px 0px rgba(255,255,255,0.4)'
          }}
          animate={{
            y: ['0%', '-50%', '0%'],
            rotate: [0, 90, 180, 270, 360],
          }}
          transition={{
            duration: Math.random() * 10 + 10,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      );
    });
  };

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 1.05 }}
        className="fixed inset-0 z-50 bg-[#2b2b2b] flex items-center justify-center overflow-hidden font-mono"
      >
        {/* Animated Minecraft blocks */}
        {generateBlocks()}

        <div className="absolute top-8 right-8 z-10 flex gap-4">
          <button 
            onClick={onClose}
            className="p-3 bg-red-500 hover:bg-red-600 text-white border-b-4 border-red-700 active:border-b-0 active:translate-y-1 transition-all"
            style={{ imageRendering: 'pixelated' }}
            title="Exit Deep Work"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="relative z-10 text-center flex flex-col items-center max-w-2xl px-6 w-full">
          <motion.div 
             initial={{ y: -20, opacity: 0 }}
             animate={{ y: 0, opacity: 1 }}
             className="mb-8 p-4 bg-[#3c3c3c] border-4 border-[#1a1a1a] shadow-[inset_-2px_-2px_0_rgba(0,0,0,0.5),inset_2px_2px_0_rgba(255,255,255,0.2)] rounded-none w-full"
          >
             <h2 className="text-xl md:text-2xl text-emerald-400 font-bold uppercase tracking-wider mb-2" style={{ textShadow: '2px 2px 0 #000' }}>
               Current Focus
             </h2>
             <p className="text-white text-lg font-medium">{mainFocus ? mainFocus.title : 'Free Focus'}</p>
          </motion.div>

          <motion.div 
             className="mb-12 font-black text-white text-8xl md:text-[8rem] tracking-widest drop-shadow-[4px_4px_0_rgba(0,0,0,0.8)]"
          >
             {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
          </motion.div>

          <div className="flex items-center gap-6">
             <motion.button 
               whileHover={{ scale: 1.05 }}
               whileTap={{ scale: 0.95, y: 4 }}
               onClick={toggleTimer}
               className="px-8 py-4 bg-emerald-500 text-white font-bold text-xl uppercase border-4 border-emerald-700 shadow-[inset_-4px_-4px_0_rgba(0,0,0,0.3),inset_4px_4px_0_rgba(255,255,255,0.4)] flex items-center gap-3"
             >
               {isActive ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current" />}
               {isActive ? 'Pause' : 'Start'}
             </motion.button>

             <motion.button 
               whileHover={{ scale: 1.05 }}
               whileTap={{ scale: 0.95, y: 4 }}
               onClick={resetTimer}
               className="px-8 py-4 bg-amber-500 text-white font-bold text-xl uppercase border-4 border-amber-700 shadow-[inset_-4px_-4px_0_rgba(0,0,0,0.3),inset_4px_4px_0_rgba(255,255,255,0.4)] flex items-center gap-3"
             >
               <Square className="w-6 h-6 fill-current" />
               Reset
             </motion.button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
