"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import ScrambleText from "./ScrambleText";

const dishes = [
  {
    id: 1,
    name: "Butter Chicken",
    description: "Creamy, rich tomato gravy with tender chicken, infused with smoky charcoal flavor.",
    image: "/images/2025-07-07.jpg",
    price: "₹650"
  },
  {
    id: 2,
    name: "Afsaana Special Biryani",
    description: "Aromatic basmati rice cooked with saffron, exotic spices, and succulent prime meat.",
    image: "/images/unnamed.jpg",
    price: "₹850"
  },
  {
    id: 3,
    name: "Tandoori Platter",
    description: "An assortment of premium meats and paneer, marinated overnight and charred to perfection.",
    image: "/images/unnamed-2.jpg",
    price: "₹1200"
  },
  {
    id: 4,
    name: "Paneer Lababdar",
    description: "Cubes of fresh cottage cheese in a luscious, spiced cashew and tomato reduction.",
    image: "/images/2025-07-07.jpg",
    price: "₹550"
  }
];

import { useState, useEffect } from "react";
import { useMotionValue, useSpring, useTransform } from "framer-motion";

// --- Custom Tilt Card Component ---
const TiltCard = ({ dish, index }: { dish: any; index: number }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const [isTouch, setIsTouch] = useState(false);

  // Detect touch device on mount
  useEffect(() => {
    setIsTouch(window.matchMedia("(pointer: coarse)").matches);
  }, []);

  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 20 });
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["7.5deg", "-7.5deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-7.5deg", "7.5deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (isTouch) return;
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut", delay: index * 0.1 }}
      viewport={{ once: true, margin: "-50px" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={isTouch ? {} : { rotateX, rotateY, transformStyle: "preserve-3d" }}
      className="group relative overflow-hidden rounded-sm h-[350px] md:h-[400px] cursor-pointer"
    >
      <div className="absolute inset-0">
        <Image
          src={dish.image}
          alt={dish.name}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover transform group-hover:scale-110 transition-all duration-1000 ease-[cubic-bezier(0.25,1,0.5,1)]"
        />
      </div>
      
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-80" />
      
      <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-end">
        <div className="flex justify-between items-end mb-3">
          <h3 className="text-2xl md:text-3xl font-serif text-white group-hover:text-gold transition-colors duration-300">
            {dish.name}
          </h3>
          {/* On touch: always show price. On desktop: show on hover */}
          <span className={`text-gold font-sans tracking-widest text-lg ml-4 drop-shadow-md transition-opacity duration-500 ${
            isTouch ? "opacity-100" : "opacity-0 group-hover:opacity-100 delay-100"
          }`}>
            {dish.price}
          </span>
        </div>
        <div className="w-0 h-[1px] bg-gold mb-4 group-hover:w-full transition-all duration-700 ease-out" />
        {/* On touch: always show description. On desktop: show on hover */}
        <p className={`text-white/80 font-light text-sm tracking-wide leading-relaxed max-w-sm drop-shadow-md transition-opacity duration-500 ${
          isTouch ? "opacity-100" : "opacity-0 group-hover:opacity-100 delay-100"
        }`}>
          {dish.description}
        </p>
      </div>
    </motion.div>
  );
};

export default function SignatureDishes() {
  return (
    <section id="menu" className="py-32 px-6 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="flex justify-center mb-4"
          >
            <ScrambleText text="Culinary Masterpieces" className="text-gold tracking-[0.3em] text-xs uppercase font-medium block" />
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl lg:text-6xl font-serif text-white leading-tight"
          >
            Signature <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-gold to-yellow-600">Dishes</span>
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 perspective-[2000px]">
          {dishes.map((dish, index) => (
            <TiltCard key={dish.id} dish={dish} index={index} />
          ))}
        </div>
        
        <div className="mt-20 text-center">
          <motion.a
            href="/menu"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="inline-block border border-gold/50 text-gold hover:bg-gold hover:text-black hover:shadow-[0_0_20px_rgba(207,174,109,0.3)] transition-all duration-300 px-10 py-4 uppercase tracking-widest text-sm font-semibold"
          >
            View Full Menu
          </motion.a>
        </div>
      </div>
    </section>
  );
}
