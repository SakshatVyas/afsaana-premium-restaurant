"use client";

import { useState, useEffect } from "react";
import { Phone } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function MobileCallButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 200);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.a
          href="tel:07095000024"
          initial={{ opacity: 0, y: 20, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.8 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="fixed bottom-6 left-4 z-[80] md:hidden flex items-center gap-2 bg-gold text-black px-4 py-3 rounded-full shadow-[0_0_24px_rgba(207,174,109,0.5)] font-semibold text-sm uppercase tracking-wider"
          aria-label="Call Afsaana"
        >
          <Phone size={16} strokeWidth={2.5} />
          Call Us
        </motion.a>
      )}
    </AnimatePresence>
  );
}
