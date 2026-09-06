import { useEffect, useState } from "react";
import { motion } from "motion/react";

interface IceCream {
  id: number;
  emoji: string;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
}

const EMOJIS = ["🍦", "🍧", "🍨", "🍭", "🍩"];

export default function FloatingIceCreams() {
  const [items, setItems] = useState<IceCream[]>([]);

  useEffect(() => {
    // Generate static details on client mount to avoid hydration mismatch
    const newItems = Array.from({ length: 12 }).map((_, i) => ({
      id: i,
      emoji: EMOJIS[i % EMOJIS.length],
      x: Math.random() * 100, // percentage width
      y: Math.random() * 100, // percentage height
      size: Math.random() * 24 + 20, // size in pixels (20px to 44px)
      duration: Math.random() * 8 + 8, // duration in seconds (8s to 16s)
      delay: Math.random() * 5 // start delay
    }));
    setItems(newItems);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
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
            y: [0, -30, 30, 0],
            x: [0, 10, -10, 0],
            rotate: [0, 15, -15, 0],
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
