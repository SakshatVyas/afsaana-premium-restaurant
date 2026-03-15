"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

export default function WelcomeEntry() {
  const [showWelcome, setShowWelcome] = useState(true);

  // Lock scrolling when component mounts, unlock when faded out
  useEffect(() => {
    if (showWelcome) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showWelcome]);

  return (
    <>

      <AnimatePresence>
      {showWelcome && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, filter: "blur(10px)" }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          className="fixed inset-0 z-[999] bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center p-6"
        >
          {/* High-Fashion Vertical Pillar Modal Content */}
          <motion.div 
            initial={{ scale: 0.95, y: 30, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-[400px] h-[70vh] md:h-[80vh] bg-black rounded-full md:rounded-[100px] overflow-hidden flex flex-col items-center justify-between shadow-[0_0_80px_rgba(207,174,109,0.1)] group border border-white/5"
          >
            {/* Background Video in the Pillar */}
            <video 
              src="/videos/Video-806.mp4" 
              autoPlay 
              loop 
              muted 
              playsInline
              className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:opacity-50 group-hover:scale-105 transition-all duration-[2s] ease-out"
            />
            
            {/* Overlay Gradients */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black/90"></div>

            {/* Top Text */}
            <div className="relative z-10 pt-16 px-6 text-center">
              <motion.span
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.8 }}
                className="text-gold tracking-[0.5em] uppercase text-[10px] md:text-xs block"
              >
                A World of Elegance
              </motion.span>
            </div>

            {/* Middle Logo Elements (Optional spacing if needed) */}
            <div className="flex-1"></div>

            {/* Bottom Content Container */}
            <div className="relative z-10 pb-16 px-6 w-full flex flex-col items-center text-center">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.5, delay: 1 }}
                className="text-5xl md:text-6xl font-serif text-white tracking-widest uppercase mb-12 drop-shadow-2xl font-light"
              >
                Afsaana
              </motion.h1>

              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 1.5 }}
                whileHover={{ scale: 1.05, backgroundColor: "rgba(207,174,109,0.1)" }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowWelcome(false)}
                className="px-8 py-3 bg-transparent border border-gold/40 text-gold uppercase tracking-[0.3em] text-[10px] font-medium hover:text-white transition-all duration-700 rounded-full backdrop-blur-md"
              >
                Enter Experience
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
    </>
  );
}
