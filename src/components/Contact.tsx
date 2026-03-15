"use client";

import { motion } from "framer-motion";
import { Phone, Clock, MapPin } from "lucide-react";

export default function Contact() {
  return (
    <section id="contact" className="py-32 px-6 bg-background">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        
        <div className="flex flex-col items-start space-y-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <span className="text-gold tracking-[0.3em] text-xs uppercase font-medium mb-4 block">Visit Us</span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-white leading-tight">
              Get in <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-gold to-yellow-600">Touch</span>
            </h2>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="space-y-8 w-full"
          >
            <div className="flex items-start gap-4 pb-8 border-b border-white/10 w-full sm:w-3/4">
              <MapPin className="text-gold mt-1" size={24} />
              <div>
                <h4 className="text-white font-serif text-xl mb-2 tracking-wide">Location</h4>
                <p className="text-white/60 font-light leading-relaxed mb-4">
                  Near DLM Valley Resort <br />
                  8Q32+PR Bungal, DLM City <br />
                  Punjab 145001
                </p>
                <a 
                  href="https://www.google.com/maps/dir//8Q32%2BPR+Bungal,+Punjab" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-xs uppercase tracking-widest text-gold hover:text-white transition-colors border-b border-gold hover:border-white pb-1"
                >
                  Get Directions
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4 pb-8 border-b border-white/10 w-full sm:w-3/4">
              <Phone className="text-gold mt-1" size={24} />
              <div>
                <h4 className="text-white font-serif text-xl mb-2 tracking-wide">Reservations</h4>
                <p className="text-white/60 font-light">07095000024</p>
              </div>
            </div>

            <div className="flex items-start gap-4 w-full sm:w-3/4">
              <Clock className="text-gold mt-1" size={24} />
              <div>
                <h4 className="text-white font-serif text-xl mb-2 tracking-wide">Hours</h4>
                <p className="text-white/60 font-light">
                  Monday – Sunday <br />
                  11:00 AM – 11:00 PM
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="h-[500px] w-full bg-secondary-bg p-2 border border-white/10"
        >
          {/* Real Google Maps Embed for the specified location */}
          <iframe 
            src="https://maps.google.com/maps?q=8Q32%2BPR%20Bungal,%20Punjab&t=&z=15&ie=UTF8&iwloc=&output=embed" 
            width="100%" 
            height="100%" 
            style={{ border: 0, filter: "grayscale(100%) invert(90%) hue-rotate(180deg)" }} 
            allowFullScreen={false} 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
            className="opacity-80"
          ></iframe>
        </motion.div>

      </div>
    </section>
  );
}
