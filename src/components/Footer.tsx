"use client";

import Link from "next/link";
import { Instagram } from "lucide-react";
import { useState } from "react";

export default function Footer() {
  const [tapCount, setTapCount] = useState(0);
  const [lastTap, setLastTap] = useState(0);

  // Secret admin entry: tap the copyright 5 times within 3 seconds
  const handleCopyrightTap = () => {
    const now = Date.now();
    if (now - lastTap > 3000) {
      setTapCount(1);
    } else {
      const newCount = tapCount + 1;
      if (newCount >= 5) {
        window.location.href = "/admin";
        setTapCount(0);
      } else {
        setTapCount(newCount);
      }
    }
    setLastTap(now);
  };

  return (
    <footer className="bg-secondary-bg pt-20 pb-10 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
        <div className="col-span-1 md:col-span-2">
          <Link href="/" className="font-serif text-3xl tracking-wide text-gold inline-block mb-4">
            Afsaana <span className="text-sm font-sans tracking-widest text-white/70 block uppercase mt-1">by Scooters</span>
          </Link>
          <p className="text-body-text max-w-sm mt-4 leading-relaxed">
            A story of taste and elegance. Experience hyper-premium luxury dining where every dish is a masterpiece.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-white font-serif text-xl mb-6">Explore</h4>
          <ul className="space-y-3">
            {[
              { label: "Reserve a Table", href: "/reservations" },
              { label: "Our Menu", href: "/menu" },
              { label: "About Us", href: "/#about" },
              { label: "Gallery", href: "/#gallery" },
              { label: "Find Us", href: "/#contact" },
            ].map(({ label, href }) => (
              <li key={label}>
                <Link href={href} className="text-body-text hover:text-gold transition-colors text-sm">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Connect */}
        <div>
          <h4 className="text-white font-serif text-xl mb-6">Connect</h4>
          <ul className="space-y-4">
            <li>
              <a
                href="https://www.instagram.com/afsaanapathankot/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-body-text inline-flex items-center gap-2 hover:text-gold cursor-pointer transition-colors"
              >
                <Instagram size={18} /> @afsaanapathankot
              </a>
            </li>
            <li>
              <a
                href="tel:07095000024"
                className="text-body-text inline-flex items-center gap-2 hover:text-gold cursor-pointer transition-colors text-sm"
              >
                📞 07095000024
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between pt-8 border-t border-white/5">
        {/* Copyright — secret admin tap trigger */}
        <p
          className="text-white/40 text-sm select-none cursor-default"
          onClick={handleCopyrightTap}
        >
          © {new Date().getFullYear()} Afsaana by Scooters. All rights reserved.
        </p>
        <div className="flex gap-6 mt-4 md:mt-0">
          <span className="text-white/20 text-sm">Privacy Policy</span>
          <span className="text-white/20 text-sm">Terms of Service</span>
        </div>
      </div>
    </footer>
  );
}
