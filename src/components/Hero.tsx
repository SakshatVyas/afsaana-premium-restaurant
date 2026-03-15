"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function Hero() {
  const brandName = "AFSAANA".split("");

  return (
    <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Video with Overlay */}
      <div className="absolute inset-0 z-0 bg-black">
        <video 
          autoPlay 
          loop 
          muted 
          playsInline
          className="w-full h-full object-cover opacity-60"
        >
          <source src="/videos/Video-559.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/80"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full flex flex-col justify-center items-center text-center pt-24 h-full">
        
        {/* Animated Typographic Layout */}
        <div className="mb-6 perspective-1000">
          <h1 className="flex justify-center flex-wrap gap-x-2 md:gap-x-4 lg:gap-x-6">
            {brandName.map((letter, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, y: 100, rotateX: -90 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{ 
                  duration: 1.2, 
                  ease: [0.2, 0.65, 0.3, 0.9], 
                  delay: index * 0.1 
                }}
                className="text-5xl sm:text-6xl md:text-8xl lg:text-[9rem] font-serif tracking-tighter text-white drop-shadow-2xl inline-block origin-bottom"
              >
                {letter}
              </motion.span>
            ))}
          </h1>
        </div>

        <motion.div
           initial={{ opacity: 0, scale: 0.9 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ duration: 1.5, ease: "easeOut", delay: 0.8 }}
           className="mb-8"
        >
          <span className="text-gold text-3xl md:text-5xl lg:text-6xl font-serif italic text-transparent bg-clip-text bg-gradient-to-r from-gold to-yellow-600 drop-shadow-lg">
            by Scooters
          </span>
        </motion.div>
        
        <motion.p 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 1.2 }}
          className="text-lg md:text-2xl text-white/80 font-light max-w-2xl italic tracking-wide mb-12"
        >
          "A story of taste and elegance."
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 1.4 }}
          className="flex flex-wrap justify-center gap-6"
        >
          <Link 
            href="/reservations"
            className="px-8 py-4 bg-gradient-to-r from-gold/90 to-gold text-black uppercase tracking-widest text-sm font-semibold hover:shadow-[0_0_30px_rgba(207,174,109,0.5)] transition-all duration-300"
          >
            Reserve Table
          </Link>
          <Link 
            href="/menu"
            className="px-8 py-4 bg-transparent border border-gold/50 text-gold uppercase tracking-widest text-sm font-semibold hover:bg-gold hover:text-black hover:border-gold transition-colors duration-300"
          >
            Explore Menu
          </Link>
        </motion.div>

      </div>
    </section>
  );
}
