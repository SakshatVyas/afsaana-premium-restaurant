"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const experiences = [
  {
    title: "Cinematic Ambiance",
    subtitle: "A Visual Feast",
    video: "/videos/Video-904.mp4",
  },
  {
    title: "Evening Glow",
    subtitle: "Intimate & Elegant",
    video: "/videos/Video-806.mp4",
  },
  {
    title: "The Vibe",
    subtitle: "Vibrant Local Charm",
    video: "/videos/Video-685.mp4",
  },
  {
    title: "Culinary Highlights",
    subtitle: "Premium Craft",
    video: "/videos/Video-608.mp4",
  }
];

function ParallaxVideo({ video, title, subtitle, index }: { video: string, title: string, subtitle: string, index: number }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["-15%", "15%"]);
  
  return (
    <div ref={ref} className="relative h-[80vh] w-full overflow-hidden flex items-center justify-center">
      <motion.div style={{ y, height: "130%" }} className="absolute inset-0 top-[-15%] w-full">
        <video 
          src={video}
          autoPlay 
          loop 
          muted 
          playsInline
          className="w-full h-full object-cover"
        />
      </motion.div>
      <div className="absolute inset-0 bg-black/50"></div>
      
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true, margin: "-100px" }}
        className="relative z-10 text-center"
      >
        <span className="text-gold tracking-[0.4em] text-xs uppercase font-medium mb-4 block">{subtitle}</span>
        <h3 className="text-5xl md:text-7xl font-serif text-white px-4">{title}</h3>
      </motion.div>
    </div>
  );
}

export default function Experience() {
  return (
    <section id="experience" className="bg-black">
      {experiences.map((exp, index) => (
        <ParallaxVideo 
          key={exp.title}
          video={exp.video}
          title={exp.title}
          subtitle={exp.subtitle}
          index={index}
        />
      ))}
    </section>
  );
}

