"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";

import ScrambleText from "./ScrambleText";

export default function About() {
  const containerRef = useRef<HTMLElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

  return (
    <section 
      id="about" 
      ref={containerRef}
      className="py-32 px-6 bg-secondary-bg overflow-hidden relative"
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        
        {/* Parallax Image */}
        <div className="relative h-[600px] w-full overflow-hidden group rounded-sm">
          <motion.div style={{ y, height: "120%" }} className="absolute inset-0 top-[-10%] w-full">
            <Image 
              src="/images/2025-07-07.jpg"
              alt="Afsaana by Scooters Ambience"
              fill
              className="object-cover transform scale-100 group-hover:scale-105 transition-transform duration-[1.5s] ease-[cubic-bezier(0.25,1,0.5,1)]"
            />
          </motion.div>
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-700"></div>
          
          <div className="absolute bottom-6 left-6 right-6 border border-gold/30 p-6 backdrop-blur-md bg-black/40">
            <h3 className="font-serif text-2xl text-white mb-2 tracking-wide">A Legacy of Taste</h3>
            <p className="text-white/60 font-light text-sm italic">Est. 2024 • DLM Valley Resort</p>
          </div>
        </div>

        {/* Text Content */}
        <div className="flex flex-col items-start space-y-8">
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <ScrambleText text="Our Story" className="text-gold tracking-[0.3em] text-xs uppercase font-medium mb-4 block" />
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-white leading-tight">
              Where <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold to-yellow-600 italic">Tradition</span> Meets Modern Luxury
            </h2>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-body-text leading-relaxed font-light text-lg"
          >
            Nestled near the picturesque DLM Valley Resort in Pathankot, Punjab, Afsaana by Scooters
            is more than just a premium dining destination. It is a cinematic journey through authentic 
            flavors, curated for the modern connoisseur.
          </motion.p>
          
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-body-text leading-relaxed font-light text-lg"
          >
            Every dish we serve is a chapter in our story—crafted with the finest ingredients, 
            passion, and an unyielding commitment to culinary excellence. Experience luxury
            ambience paired with unforgettable hospitality.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
            viewport={{ once: true, margin: "-100px" }}
            className="pt-6"
          >
            <div className="font-serif italic text-4xl text-gold mb-2 signature-text">
              <span className="font-light tracking-wide">Afsaana</span>
            </div>
            <p className="uppercase tracking-widest text-[10px] text-white/40 mt-2">Executive Chef & Founder</p>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
