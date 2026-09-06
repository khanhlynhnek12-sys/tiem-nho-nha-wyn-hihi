import React from "react";
import { motion } from "motion/react";

export type WeatherMode = "none" | "snow" | "rain" | "leaves";

interface WeatherEffectsProps {
  mode: WeatherMode;
}

export default function WeatherEffects({ mode }: WeatherEffectsProps) {
  if (mode === "none") return null;

  // Generate 40 particles
  const particles = Array.from({ length: 40 }).map((_, i) => {
    const left = Math.random() * 100;
    const delay = Math.random() * 5; // up to 5s delay
    const duration = Math.random() * 5 + 5; // 5 to 10s duration
    const size = Math.random() * 8 + 4; // 4 to 12px
    const sway = Math.random() * 20 - 10; // -10vw to 10vw sway

    return { id: i, left, delay, duration, size, sway };
  });

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {mode === "snow" && particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute top-[-20px] rounded-full bg-white/60 dark:bg-white/40 blur-[1px]"
          style={{
            left: `${p.left}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
          }}
          initial={{ y: -20, x: 0, rotate: 0 }}
          animate={{
            y: ["0vh", "110vh"],
            x: [0, p.sway, -p.sway, 0],
            rotate: [0, 180, 360]
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "linear",
          }}
        />
      ))}

      {mode === "rain" && particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute top-[-20px] rounded-full bg-sky-400/40 dark:bg-sky-300/30"
          style={{
            left: `${p.left}%`,
            width: '1px',
            height: `${p.size * 3}px`,
          }}
          initial={{ y: -50, x: 0 }}
          animate={{
            y: ["0vh", "110vh"],
            x: [0, 10] // Slight wind angle
          }}
          transition={{
            duration: p.duration * 0.2, // Rain is faster
            repeat: Infinity,
            delay: p.delay * 0.2,
            ease: "linear",
          }}
        />
      ))}

      {mode === "leaves" && particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute top-[-30px] flex items-center justify-center opacity-70"
          style={{
            left: `${p.left}%`,
            fontSize: `${p.size * 1.5}px`,
          }}
          initial={{ y: -30, x: 0, rotate: 0 }}
          animate={{
            y: ["0vh", "110vh"],
            x: [0, p.sway * 2, -p.sway, 0],
            rotate: [0, 180, -90, 360]
          }}
          transition={{
            duration: p.duration * 1.2, // Leaves fall slower
            repeat: Infinity,
            delay: p.delay,
            ease: "easeInOut",
          }}
        >
          {Math.random() > 0.5 ? "🍁" : "🍂"}
        </motion.div>
      ))}
    </div>
  );
}
