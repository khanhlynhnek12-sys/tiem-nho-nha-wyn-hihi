import { useEffect, useState } from "react";
import { motion } from "motion/react";

interface SweetItem {
  id: number;
  emoji: string;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  yOffset: number;
}

const EMOJIS = ["🍓"];

export default function FloatingIceCreams() {
  const [items, setItems] = useState<SweetItem[]>([]);

  useEffect(() => {
    // Generate static details on client mount to avoid hydration mismatch
    const newItems = Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      emoji: EMOJIS[i % EMOJIS.length],
      x: Math.random() * 100, // percentage width
      y: Math.random() * 100, // percentage height
      size: Math.random() * 20 + 20, // size in pixels (20px to 40px)
      duration: Math.random() * 10 + 10, // duration in seconds (10s to 20s)
      delay: Math.random() * -20, // negative delay so they start out of sync immediately
      yOffset: Math.random() * 200 + 150 // vertical movement (150px to 350px)
    }));
    setItems(newItems);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 fixed">
      {items.map((item) => (
        <motion.div
          key={item.id}
          className="absolute select-none opacity-40 dark:opacity-20"
          style={{
            left: `${item.x}%`,
            top: `${item.y}%`,
            fontSize: `${item.size}px`,
          }}
          animate={{
            y: [0, -item.yOffset, 0, item.yOffset, 0],
            x: [0, 20, 0, -20, 0],
            rotate: [0, 15, -5, 15, 0],
          }}
          transition={{
            duration: item.duration,
            repeat: Infinity,
            delay: item.delay,
            ease: "easeInOut",
          }}
        >
          {item.emoji}
        </motion.div>
      ))}
    </div>
  );
}
