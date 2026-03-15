"use client";

import { useEffect, useState } from "react";

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [hoverElement, setHoverElement] = useState<HTMLElement | null>(null);

  useEffect(() => {
    const updatePosition = (e: MouseEvent) => {
      let x = e.clientX;
      let y = e.clientY;

      if (isHovered && hoverElement) {
        // Calculate magnetic pull
        const rect = hoverElement.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        // Pull cursor 30% towards the center of the element
        x = x + (centerX - x) * 0.3;
        y = y + (centerY - y) * 0.3;
      }

      setPosition({ x, y });
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const clickable = target.closest("a") || target.closest("button");
      
      if (clickable) {
        setIsHovered(true);
        setHoverElement(clickable as HTMLElement);
      } else {
        setIsHovered(false);
        setHoverElement(null);
      }
    };

    window.addEventListener("mousemove", updatePosition);
    window.addEventListener("mouseover", handleMouseOver);

    return () => {
      window.removeEventListener("mousemove", updatePosition);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, [isHovered, hoverElement]);

  // Use a transform translation for buttery smooth hardware-accelerated movement
  return (
    <div
      className={`custom-cursor hidden md:block ${isHovered ? "hovered" : ""}`}
      style={{ 
        transform: `translate3d(${position.x}px, ${position.y}px, 0) translate(-50%, -50%)`,
      }}
    />
  );
}
