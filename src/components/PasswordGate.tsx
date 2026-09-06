import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkle, Lock, ArrowRight } from "lucide-react";

interface PasswordGateProps {
  onUnlock: () => void;
}

export default function PasswordGate({ onUnlock }: PasswordGateProps) {
  const [password, setPassword] = useState("");
  const [isCorrect, setIsCorrect] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "0712") {
      setIsCorrect(true);
      setError("");
    } else {
      setError("Mật khẩu chưa chính xác rồi, hãy thử lại nhé! 🍦");
      setPassword("");
    }
  };

  useEffect(() => {
    if (isCorrect) {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => {
              onUnlock();
            }, 500); // Small pause at 100% for impact
            return 100;
          }
          return prev + 2.5; // Increment rate
        });
      }, 30); // ~1.2s total animation time
      return () => clearInterval(interval);
    }
  }, [isCorrect, onUnlock]);

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-stone-50 dark:bg-stone-950 px-4 transition-colors duration-300 relative overflow-hidden">
      {/* Decorative ambient elements */}
      <div className="absolute inset-0 pointer-events-none opacity-20 dark:opacity-10">
        <div className="absolute top-1/4 left-1/4 text-8xl animate-bounce duration-1000">🍦</div>
        <div className="absolute bottom-1/4 right-1/4 text-8xl animate-bounce delay-300 duration-1000">🍧</div>
        <div className="absolute top-2/3 left-3/4 text-7xl animate-pulse">🍭</div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="w-full max-w-md p-8 bg-white dark:bg-stone-900 border border-[#E9E5D9] dark:border-stone-800 rounded-3xl shadow-xl relative z-10 text-center"
      >
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 rounded-full bg-[#FDFCF0] dark:bg-yellow-950/20 flex items-center justify-center border border-[#E9E5D9] dark:border-stone-850">
            <Lock className="w-6 h-6 text-[#D4A373]" />
          </div>
        </div>

        <h1 className="text-3xl font-serif italic text-[#D4A373] tracking-tight mb-2">
          Tiệm Nhỏ Nhà Wyn
        </h1>
        <p className="text-stone-500 dark:text-stone-400 text-sm mb-8">
          Vui lòng nhập cổng truy cập để khám phá tiệm nhỏ ngọt ngào nhé!
        </p>

        {!isCorrect ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <input
                type="password"
                placeholder="Nhập mật khẩu..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-white dark:bg-stone-850 border-2 border-[#E9E5D9] focus:border-[#D4A373] dark:border-stone-700 dark:focus:border-[#D4A373] rounded-2xl text-center font-mono text-lg tracking-widest focus:outline-none dark:text-white transition shadow-inner"
                id="input-password"
                autoFocus
              />
            </div>

            <AnimatePresence>
              {error && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="text-red-500 dark:text-red-400 text-xs font-medium"
                >
                  {error}
                </motion.p>
              )}
            </AnimatePresence>

            <button
              type="submit"
              className="w-full py-3 bg-[#D4A373] hover:bg-[#c39262] text-white font-bold rounded-2xl flex items-center justify-center gap-2 shadow-sm transition cursor-pointer group"
              id="btn-submit-password"
            >
              Mở Khóa Cửa
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </form>
        ) : (
          <div className="space-y-6 py-4">
            <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400 px-1 font-medium">
              <span className="flex items-center gap-1">
                <Sparkle className="w-3.5 h-3.5 text-[#D4A373] fill-[#D4A373]" />
                Mật khẩu đúng! Đang mở cửa tiệm...
              </span>
              <span>{Math.round(progress)}%</span>
            </div>

            {/* Custom Ice Cream Progress Track */}
            <div className="relative w-full h-4 bg-[#E9E5D9] dark:bg-stone-800 rounded-full border border-[#E9E5D9]/40 p-0.5 overflow-visible">
              {/* Animated Progress Bar fill */}
              <div
                className="h-full bg-[#D4A373] rounded-full transition-all duration-75"
                style={{ width: `${progress}%` }}
              />

              {/* Sliding Ice Cream Popsicle Emoji */}
              <motion.div
                className="absolute top-1/2 -translate-y-1/2 text-2xl"
                style={{ left: `calc(${progress}% - 14px)` }}
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 0.5, repeat: Infinity }}
              >
                🍦
              </motion.div>
            </div>

            <p className="text-xs text-[#A9A294] italic">
              Que kem đang di chuyển tới cuối chặng... 🍧
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
