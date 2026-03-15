"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Preloader() {
  const [percentage, setPercentage] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Lock scroll during preloader
    if (!isLoaded) {
      document.body.style.overflow = 'hidden';
    } 

    const duration = 2500; // 2.5 seconds total loading time
    const intervalTime = 20; // Update every 20ms for buttery smoothness
    const steps = duration / intervalTime;
    const increment = 100 / steps;

    const interval = setInterval(() => {
      setPercentage(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setIsLoaded(true), 600); // Elegant pause at 100%
          return 100;
        }
        return prev + increment;
      });
    }, intervalTime);

    return () => clearInterval(interval);
  }, [isLoaded]);

  // Round for display
  const displayPercent = Math.min(100, Math.floor(percentage));

  return (
    <AnimatePresence>
      {!isLoaded && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, filter: "blur(10px)" }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className="fixed inset-0 z-[9999] bg-[#030303] flex items-center justify-center p-6"
        >
          {/* Subtle slow-pulse ambient glow */}
          <div className="absolute inset-0 z-0 opacity-40 pointer-events-none flex justify-center items-center">
            <motion.div 
              animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="w-[400px] h-[400px] bg-gold/10 blur-[120px] rounded-full mix-blend-screen"
            ></motion.div>
          </div>
          
          <div className="text-center relative z-10 flex flex-col items-center justify-center h-full">
            <div className="overflow-hidden mb-8">
              <motion.div 
                initial={{ y: "100%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                className="text-7xl md:text-9xl font-sans font-thin text-white tracking-[0.1em]"
              >
                {displayPercent}<span className="text-gold text-5xl md:text-7xl absolute align-top inline-block ml-2 opacity-50">%</span>
              </motion.div>
            </div>
            
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 1 }}
              className="mt-12 flex items-center gap-6"
            >
              <div className="w-24 h-[1px] bg-white/10 overflow-hidden">
                <div 
                  className="h-full bg-gold transition-all"
                  style={{ width: `${percentage}%`, transitionDuration: '20ms' }}
                ></div>
              </div>
              <span className="uppercase tracking-[0.5em] text-[9px] text-gold/70 font-light">
                Curating Elegance
              </span>
              <div className="w-24 h-[1px] bg-white/10 overflow-hidden flex justify-end">
                <div 
                  className="h-full bg-gold transition-all"
                  style={{ width: `${percentage}%`, transitionDuration: '20ms' }}
                ></div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
