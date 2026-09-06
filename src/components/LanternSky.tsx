import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Send, Star } from "lucide-react";
import { Lantern } from "../types";

const INITIAL_LANTERNS: Lantern[] = [
  { id: "1", message: "Hy vọng ngày mai sẽ rực rỡ hơn...", color: "bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-200", top: "15%", duration: 35, delay: 0 },
  { id: "2", message: "Gửi người tôi yêu nơi phương xa", color: "bg-primary-100 dark:bg-primary-900/40 text-primary-800 dark:text-primary-200", top: "45%", duration: 40, delay: 5 },
  { id: "3", message: "Mong ước một phép màu nhỏ nhoi", color: "bg-sky-100 dark:bg-sky-900/40 text-sky-800 dark:text-sky-200", top: "75%", duration: 30, delay: 2 },
  { id: "4", message: "Đọc truyện chữa lành thật sự...", color: "bg-rose-100 dark:bg-rose-900/40 text-rose-800 dark:text-rose-200", top: "30%", duration: 45, delay: 15 },
];

const COLORS = [
  "bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-200",
  "bg-primary-100 dark:bg-primary-900/40 text-primary-800 dark:text-primary-200",
  "bg-sky-100 dark:bg-sky-900/40 text-sky-800 dark:text-sky-200",
  "bg-rose-100 dark:bg-rose-900/40 text-rose-800 dark:text-rose-200",
  "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-200",
];

export default function LanternSky() {
  const [lanterns, setLanterns] = useState<Lantern[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("wyn_lanterns");
      if (saved) return JSON.parse(saved);
    }
    return INITIAL_LANTERNS;
  });

  const [newMessage, setNewMessage] = useState("");
  const [activeLantern, setActiveLantern] = useState<Lantern | null>(null);

  useEffect(() => {
    localStorage.setItem("wyn_lanterns", JSON.stringify(lanterns));
  }, [lanterns]);

  const handleRelease = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const newLantern: Lantern = {
      id: Date.now().toString(),
      message: newMessage.trim(),
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      top: `${Math.floor(Math.random() * 70 + 10)}%`, // 10% to 80%
      duration: Math.floor(Math.random() * 20 + 30), // 30s to 50s
      delay: 0
    };

    setLanterns(prev => [...prev, newLantern]);
    setNewMessage("");
    
    // Trigger emotion tree water event
    window.dispatchEvent(new CustomEvent("water-tree"));
  };

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col h-[600px] bg-stone-900 rounded-3xl overflow-hidden relative shadow-2xl border border-stone-800">
      {/* Sky Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0B1021] via-[#1B1B3A] to-[#2D1B36] pointer-events-none" />
      
      {/* Stars */}
      <div className="absolute inset-0 pointer-events-none opacity-50">
        {[...Array(30)].map((_, i) => (
          <div 
            key={i} 
            className="absolute bg-white rounded-full animate-pulse"
            style={{
              width: Math.random() * 3 + 1 + 'px',
              height: Math.random() * 3 + 1 + 'px',
              top: Math.random() * 100 + '%',
              left: Math.random() * 100 + '%',
              animationDuration: `${Math.random() * 3 + 2}s`
            }}
          />
        ))}
      </div>

      <div className="relative z-10 p-6 flex flex-col items-center pointer-events-none">
        <h2 className="text-3xl font-bold font-serif text-white flex items-center gap-2 drop-shadow-md">
          <Star className="w-6 h-6 text-amber-300 fill-amber-300" />
          Bầu Trời Ước Nguyện
          <Star className="w-6 h-6 text-amber-300 fill-amber-300" />
        </h2>
        <p className="text-stone-300 text-sm mt-2 font-medium drop-shadow-md">
          Viết một lời nhắn và thả trôi lên bầu trời đêm... Nhấn vào đèn lồng để đọc.
        </p>
      </div>

      {/* Floating Lanterns Container */}
      <div className="relative flex-1 w-full overflow-hidden">
        <AnimatePresence>
          {lanterns.map((lantern) => (
            <motion.div
              key={lantern.id}
              className="absolute left-full flex flex-col items-center group cursor-pointer"
              style={{ top: lantern.top }}
              initial={{ x: 100 }}
              animate={{ x: -2000 }} // Move far left past screen
              transition={{
                duration: lantern.duration,
                ease: "linear",
                repeat: Infinity,
                delay: lantern.delay
              }}
              onClick={() => setActiveLantern(lantern)}
            >
              <div className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap shadow-lg transition-transform group-hover:scale-110 ${lantern.color}`}>
                🏮 {lantern.message.length > 20 ? lantern.message.substring(0, 20) + "..." : lantern.message}
              </div>
              <div className="w-px h-8 bg-gradient-to-b from-white/30 to-transparent mt-1" />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Input Area */}
      <div className="relative z-20 p-5 bg-stone-900/80 backdrop-blur-md border-t border-stone-800">
        <form onSubmit={handleRelease} className="flex gap-3 max-w-2xl mx-auto">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Gửi một lời nhắn ẩn danh vào bầu trời..."
            maxLength={100}
            className="flex-1 px-5 py-3.5 bg-stone-800/80 border border-stone-700 text-white rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition placeholder-stone-500"
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="px-6 py-3.5 bg-amber-600 hover:bg-amber-500 disabled:bg-stone-700 disabled:text-stone-500 text-white font-bold rounded-2xl transition cursor-pointer flex items-center justify-center shadow-lg"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>

      {/* Read Modal */}
      <AnimatePresence>
        {activeLantern && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={() => setActiveLantern(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className={`p-8 rounded-3xl shadow-2xl max-w-sm w-full border border-white/20 text-center ${activeLantern.color}`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-5xl mb-4">🏮</div>
              <p className="text-lg font-serif italic leading-relaxed">
                "{activeLantern.message}"
              </p>
              <div className="mt-8 text-xs font-bold uppercase tracking-widest opacity-60">
                — Lời nhắn ẩn danh —
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
