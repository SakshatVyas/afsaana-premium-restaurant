"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from "framer-motion";
import { X, Menu } from "lucide-react";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "About", href: "/#about" },
  { name: "Menu", href: "/menu" },
  { name: "Experience", href: "/#experience" },
  { name: "Gallery", href: "/#gallery" },
  { name: "Contact", href: "/#contact" },
];

export default function Navbar() {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    if (latest > previous && latest > 150) {
      setHidden(true);
    } else {
      setHidden(false);
    }
    setIsScrolled(latest > 50);
  });

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <>
      <motion.nav
        variants={{ visible: { y: 0 }, hidden: { y: "-100%" } }}
        animate={hidden ? "hidden" : "visible"}
        transition={{ duration: 0.35, ease: "easeInOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
          isScrolled ? "bg-black/80 backdrop-blur-md border-b border-white/10" : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 h-20 md:h-24 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="font-serif text-xl md:text-2xl tracking-wide text-gold" onClick={() => setMobileOpen(false)}>
            Afsaana <span className="text-xs md:text-sm font-sans tracking-widest text-white/70 block uppercase">by Scooters</span>
          </Link>

          {/* Center Links - Desktop only */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-sm tracking-widest text-white/70 hover:text-gold transition-colors font-medium uppercase relative group"
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-gold transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </div>

          {/* Desktop Reserve Button */}
          <div className="hidden md:block">
            <Link
              href="/reservations"
              className="px-6 py-3 bg-gradient-to-r from-gold/80 to-gold text-black text-sm uppercase tracking-widest font-semibold rounded-sm hover:shadow-[0_0_20px_rgba(207,174,109,0.4)] transition-all duration-300"
            >
              Reserve Table
            </Link>
          </div>

          {/* Mobile: Reserve + Hamburger */}
          <div className="flex items-center gap-3 md:hidden">
            <Link
              href="/reservations"
              className="px-4 py-2 bg-gold text-black text-xs uppercase tracking-widest font-bold rounded-sm"
              onClick={() => setMobileOpen(false)}
            >
              Book
            </Link>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="text-white p-2 focus:outline-none"
              aria-label="Toggle navigation"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* ===== MOBILE DRAWER ===== */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm md:hidden"
            />

            {/* Drawer panel */}
            <motion.div
              key="drawer"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-0 right-0 bottom-0 z-50 w-72 bg-[#080808] border-l border-white/10 flex flex-col md:hidden"
            >
              {/* Drawer header */}
              <div className="flex items-center justify-between px-6 h-20 border-b border-white/10">
                <span className="font-serif text-gold text-lg">Afsaana</span>
                <button onClick={() => setMobileOpen(false)} className="text-white/60 hover:text-white">
                  <X size={22} />
                </button>
              </div>

              {/* Nav links */}
              <div className="flex flex-col px-6 py-8 gap-1 flex-1">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.name}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 + 0.1 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center justify-between py-4 border-b border-white/5 text-white/70 hover:text-gold transition-colors uppercase tracking-widest text-sm font-medium"
                    >
                      {link.name}
                      <span className="text-gold/30 text-xs">→</span>
                    </Link>
                  </motion.div>
                ))}
              </div>

              {/* Drawer footer */}
              <div className="px-6 pb-8 space-y-3">
                <Link
                  href="/reservations"
                  onClick={() => setMobileOpen(false)}
                  className="block w-full py-4 bg-gold text-black text-center uppercase tracking-widest text-sm font-bold"
                >
                  Reserve a Table
                </Link>
                <a
                  href="tel:07095000024"
                  className="block w-full py-3 border border-white/20 text-white text-center uppercase tracking-widest text-xs hover:border-gold transition-colors"
                >
                  📞 Call Us: 07095000024
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
