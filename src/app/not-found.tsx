"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-6 text-center overflow-hidden relative">
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gold/10 blur-[120px] rounded-full mix-blend-screen"></div>
      </div>
      
      <div className="relative z-10 flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-8xl md:text-[10rem] font-serif text-transparent bg-clip-text bg-gradient-to-b from-white to-white/20 tracking-tighter shadow-2xl">
            404
          </h1>
        </motion.div>
        
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.8, delay: 0.2 }}
           className="mt-4 mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-serif text-gold italic mb-4">Lost in Luxury</h2>
          <p className="text-white/60 font-light max-w-md mx-auto">
            The experience you are looking for seems to have vanished into the ether. Let us guide you back to our culinary journey.
          </p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <Link 
            href="/"
            className="inline-flex items-center gap-2 px-8 py-4 bg-transparent border border-gold/50 text-gold uppercase tracking-widest text-sm font-semibold hover:bg-gold hover:text-black hover:border-gold transition-all duration-300"
          >
            <ArrowLeft size={16} /> Return Home
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
