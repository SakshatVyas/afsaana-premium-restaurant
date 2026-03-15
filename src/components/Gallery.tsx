"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { X } from "lucide-react";

// Mixed array of images and videos for a dynamic masonry gallery
const galleryMedia = [
  { type: 'image', src: "/images/2025-07-07.jpg" },
  { type: 'video', src: "/videos/Video-721.mp4" },
  { type: 'image', src: "/images/unnamed-2.jpg" },
  { type: 'video', src: "/videos/Video-310.mp4" },
  { type: 'image', src: "/images/unnamed.jpg" },
  { type: 'video', src: "/videos/Video-579.mp4" },
];

export default function Gallery() {
  const [selectedMedia, setSelectedMedia] = useState<{type: string, src: string} | null>(null);

  return (
    <section id="gallery" className="py-32 px-6 bg-secondary-bg">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-gold tracking-[0.3em] text-xs uppercase font-medium mb-4 block"
          >
            Visual Journey
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl lg:text-6xl font-serif text-white leading-tight"
          >
            The <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-gold to-yellow-600">Gallery</span>
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleryMedia.map((media, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: (index % 3) * 0.1 }}
              viewport={{ once: true, margin: "-50px" }}
              className={`relative overflow-hidden group rounded-sm shadow-lg ${
                index === 0 ? "md:col-span-2 aspect-video" : "aspect-[4/3]"
              }`}
            >
              {media.type === 'image' ? (
                <Image
                  src={media.src}
                  alt={`Afsaana Gallery ${index + 1}`}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover transform group-hover:scale-110 transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]"
                />
              ) : (
                <video 
                  src={media.src} 
                  autoPlay 
                  loop 
                  muted 
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]"
                />
              )}
              
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-colors duration-500 flex items-center justify-center pointer-events-none">
                <span className="text-white opacity-0 group-hover:opacity-100 transition-all duration-300 tracking-widest uppercase text-sm border border-gold/50 text-gold shadow-[0_0_15px_rgba(207,174,109,0.3)] px-8 py-3 bg-black/50 backdrop-blur-sm">
                  View
                </span>
              </div>
              
              {/* Invisible top-level clickable surface */}
              <div 
                className="absolute inset-0 z-20 cursor-pointer" 
                onClick={() => setSelectedMedia(media)}
              ></div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Cinematic Lightbox overlay */}
      <AnimatePresence>
        {selectedMedia && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-md p-4 md:p-12 cursor-pointer"
            onClick={() => setSelectedMedia(null)}
          >
            {/* Close Button */}
            <button 
              className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors z-50 p-2"
              onClick={(e) => { e.stopPropagation(); setSelectedMedia(null); }}
            >
               <X size={36} />
            </button>

            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: -20 }}
              transition={{ duration: 0.4, type: "spring", stiffness: 100 }}
              className="relative w-full max-w-6xl max-h-[90vh] h-full shadow-[0_0_50px_rgba(0,0,0,0.8)] border border-white/10 rounded-sm overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {selectedMedia.type === 'image' ? (
                <Image
                  src={selectedMedia.src}
                  alt="Expanded view"
                  fill
                  className="object-contain"
                />
              ) : (
                <video 
                  src={selectedMedia.src}
                  autoPlay 
                  loop 
                  muted 
                  controls
                  className="w-full h-full object-contain"
                />
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

