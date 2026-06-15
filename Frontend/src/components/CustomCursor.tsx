import React, { useEffect } from 'react';
import { motion, useSpring, useMotionValue } from 'motion/react';

export const CustomCursor = () => {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  
  const springConfig = { damping: 25, stiffness: 400, mass: 0.5 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };
    window.addEventListener('mousemove', moveCursor);
    
    // Fallback for when cursor leaves window
    document.addEventListener('mouseleave', () => {
      cursorX.set(-100);
      cursorY.set(-100);
    });

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      document.removeEventListener('mouseleave', () => {});
    };
  }, [cursorX, cursorY]);

  return (
    <motion.div
      className="fixed top-0 left-0 w-12 h-12 rounded-full bg-purple/40 dark:bg-purple/60 blur-xl pointer-events-none z-[9999]"
      style={{
        x: cursorXSpring,
        y: cursorYSpring,
        translateX: '-50%',
        translateY: '-50%',
      }}
    />
  );
};
