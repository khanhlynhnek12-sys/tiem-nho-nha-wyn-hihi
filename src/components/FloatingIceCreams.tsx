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

const EMOJIS = ["🍦", "🍧", "🍨", "🍭", "🍩", "🍬", "🍫", "🧁", "🍰", "🍪", "🍡", "🍧", "🍮", "🍯"];

export default function FloatingIceCreams() {
  const [items, setItems] = useState<SweetItem[]>([]);

  useEffect(() => {
    // Generate static details on client mount to avoid hydration mismatch
    const newItems = Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      emoji: EMOJIS[i % EMOJIS.length],
      x: Math.random() * 100, // percentage width
      y: Math.random() * 100, // percentage height
      size: Math.random() * 24 + 16, // size in pixels (16px to 40px)
      duration: Math.random() * 12 + 12, // duration in seconds (12s to 24s)
      delay: Math.random() * -20, // negative delay so they start out of sync immediately
      yOffset: Math.random() * 300 + 200 // large vertical movement (200px to 500px)
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
            x: [0, 40, 0, -40, 0],
            rotate: [0, 35, 0, -35, 0],
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
