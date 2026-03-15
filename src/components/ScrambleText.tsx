"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

export default function ScrambleText({ text, className }: { text: string; className?: string }) {
  const [displayText, setDisplayText] = useState(text);
  const [isHovering, setIsHovering] = useState(false);
  const originalText = useRef(text);

  const startScramble = () => {
    let iteration = 0;
    setIsHovering(true);
    
    const interval = setInterval(() => {
      setDisplayText(prev => 
        prev
          .split("")
          .map((letter, index) => {
            if(index < iteration) {
              return originalText.current[index];
            }
            if (originalText.current[index] === " ") return " ";
            return letters[Math.floor(Math.random() * 26)];
          })
          .join("")
      );
      
      if(iteration >= originalText.current.length){ 
        clearInterval(interval);
        setTimeout(() => setIsHovering(false), 500);
      }
      iteration += 1 / 3; 
    }, 30);
  };

  return (
    <motion.div
      onHoverStart={!isHovering ? startScramble : undefined}
      onViewportEnter={!isHovering ? startScramble : undefined}
      viewport={{ once: true, margin: "-100px" }}
      className={`font-mono cursor-default select-none ${className}`}
    >
      {displayText}
    </motion.div>
  );
}
