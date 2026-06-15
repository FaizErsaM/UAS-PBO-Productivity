import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';

const Paper = ({ delay }: { delay: number }) => {
  const [position] = useState({
    x: Math.random() * 100,
    rotate: Math.random() * 360,
    size: Math.random() * 10 + 15,
  });

  return (
    <motion.div
      initial={{ 
        top: '-10%', 
        left: `${position.x}%`, 
        rotate: position.rotate, 
        opacity: 0,
      }}
      animate={{ 
        top: '110%', 
        left: `${Math.max(0, Math.min(100, position.x + (Math.random() * 20 - 10)))}%`, 
        rotate: position.rotate + (Math.random() * 360),
        opacity: [0, 1, 1, 0],
      }}
      transition={{
        duration: Math.random() * 5 + 5,
        repeat: Infinity,
        delay: delay,
        ease: "linear"
      }}
      className="absolute bg-white border border-slate-200 shadow-sm pointer-events-none"
      style={{
        width: position.size,
        height: position.size * 1.4,
      }}
    >
      {/* simulated lines of text */}
      <div className="w-[60%] h-[1px] bg-slate-300 mt-[20%] mx-auto rounded-full"></div>
      <div className="w-[80%] h-[1px] bg-slate-300 mt-[15%] mx-auto rounded-full"></div>
      <div className="w-[70%] h-[1px] bg-slate-200 mt-[15%] mx-auto rounded-full"></div>
    </motion.div>
  );
};

export const PaperConfetti = () => {
  const [papers, setPapers] = useState<number[]>([]);

  useEffect(() => {
    // Generate 20 papers
    setPapers(Array.from({ length: 20 }).map((_, i) => i));
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {papers.map((_, i) => (
        <Paper key={i} delay={Math.random() * 10} />
      ))}
    </div>
  );
};
