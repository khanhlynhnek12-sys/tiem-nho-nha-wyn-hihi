import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Character } from "../types";
import { Sparkles, Gift, RotateCw, Heart, MessageCircle, ExternalLink } from "lucide-react";

interface GachaWheelProps {
  characters: Character[];
  onLikeCharacter: (id: string) => void;
}

export default function GachaWheel({ characters, onLikeCharacter }: GachaWheelProps) {
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedChar, setSelectedChar] = useState<Character | null>(null);
  const [spinCount, setSpinCount] = useState(0);

  const handleSpin = () => {
    if (characters.length === 0) return;

    setIsSpinning(true);
    setSelectedChar(null);

    // Shake and spin for 2 seconds, then pick a random character
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * characters.length);
      setSelectedChar(characters[randomIndex]);
      setIsSpinning(false);
      setSpinCount((prev) => prev + 1);
    }, 2000);
  };

  if (characters.length === 0) {
    return (
      <div className="p-8 text-center bg-slate-50 dark:bg-stone-900 border border-slate-200 dark:border-stone-800 rounded-2xl max-w-lg mx-auto">
        <span className="text-5xl block mb-4">🍧</span>
        <h3 className="text-lg font-bold text-slate-800 dark:text-stone-200 mb-2 font-serif">
          Gacha Đang Trống
        </h3>
        <p className="text-slate-500 dark:text-stone-400 text-sm mb-4">
          Hiện tại tiệm chưa có bất kỳ hồ sơ nhân vật nào để quay gacha cả.
        </p>
        <p className="text-xs text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-950/40 px-3 py-2 rounded-lg inline-block">
          💡 Hãy bật Chế độ Quản trị viên để thêm nhân vật mới trước nhé!
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto flex flex-col items-center py-6">
      <div className="text-center mb-8">
        <span className="px-4 py-1.5 bg-primary-50 dark:bg-stone-900 text-primary-500 dark:text-primary-300 border border-primary-100 dark:border-stone-800 text-xs font-semibold rounded-full uppercase tracking-wider mb-2 inline-block shadow-xs">
          Vòng Quay May Mắn
        </span>
        <h2 className="text-3xl font-bold font-serif text-slate-800 dark:text-stone-100">
          Nhân Duyên Gacha 🍦
        </h2>
        <p className="text-slate-500 dark:text-stone-400 text-sm mt-1">
          Hôm nay ai sẽ là người trò chuyện cùng bạn nào? Quay ngẫu nhiên nhé!
        </p>
      </div>

      <div className="w-full flex flex-col items-center justify-center min-h-[380px] relative">
        <AnimatePresence mode="wait">
          {!selectedChar && !isSpinning && (
            <motion.div
              key="idle-box"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex flex-col items-center"
            >
              {/* Premium Floating Gacha Container */}
              <div className="relative w-44 h-44 bg-gradient-to-br from-primary-50/70 to-sky-50/70 dark:from-stone-900 dark:to-stone-800 border-2 border-primary-200 rounded-3xl flex items-center justify-center shadow-xl mb-8 group overflow-hidden">
                <motion.div
                  className="text-7xl cursor-pointer"
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  onClick={handleSpin}
                >
                  🎁
                </motion.div>
                <div className="absolute inset-0 bg-white/20 dark:bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                {/* Floating bubbles inside box */}
                <div className="absolute bottom-2 left-2 text-sm opacity-55">🍦</div>
                <div className="absolute top-2 right-2 text-sm opacity-55">🍧</div>
              </div>

              <button
                onClick={handleSpin}
                className="px-8 py-3.5 bg-primary-400 hover:bg-primary-500 text-white font-bold rounded-2xl shadow-md hover:shadow-lg transition cursor-pointer flex items-center gap-2"
                id="btn-spin-gacha"
              >
                <RotateCw className="w-4 h-4" />
                Mở Gacha Ngay
              </button>
            </motion.div>
          )}

          {isSpinning && (
            <motion.div
              key="spinning"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex flex-col items-center"
            >
              {/* Shaking animation */}
              <motion.div
                className="w-44 h-44 bg-gradient-to-br from-primary-400 to-sky-450 border-2 border-primary-300 rounded-3xl flex items-center justify-center shadow-2xl mb-8 relative"
                animate={{
                  x: [0, -12, 12, -12, 12, -8, 8, -4, 4, 0],
                  y: [0, 8, -8, 8, -8, 4, -4, 2, -2, 0],
                  rotate: [0, -10, 10, -10, 10, -5, 5, -2, 2, 0],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <span className="text-8xl">🎁</span>
                <span className="absolute text-3xl animate-ping opacity-65">✨</span>
              </motion.div>

              <div className="text-center">
                <p className="text-primary-500 font-semibold flex items-center gap-2 text-sm justify-center">
                  <RotateCw className="w-4 h-4 animate-spin" />
                  Đang pha chế duyên số...
                </p>
                <p className="text-xs text-slate-400 mt-1 italic">
                  Que kem nhân duyên đang khuấy đều... 🍨
                </p>
              </div>
            </motion.div>
          )}

          {selectedChar && !isSpinning && (
            <motion.div
              key="revealed"
              initial={{ opacity: 0, scale: 0.85, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="w-full max-w-md bg-white dark:bg-stone-900 border border-primary-100 dark:border-stone-850 rounded-3xl p-6 shadow-2xl relative overflow-hidden"
            >
              {/* Confetti & Burst decor */}
              <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-primary-400 via-white to-sky-400" />
              <div className="absolute top-3 right-3">
                <span className="px-2.5 py-1 bg-primary-50 dark:bg-stone-950 text-primary-500 dark:text-primary-300 border border-primary-100 text-[10px] font-bold rounded-full uppercase tracking-wider flex items-center gap-1 shadow-xs">
                  <Sparkles className="w-3 h-3 text-primary-400 fill-primary-300" />
                  Nhân duyên!
                </span>
              </div>

              {/* Character Profile Render */}
              <div className="flex flex-col items-center text-center mt-3">
                <div className="w-20 h-20 bg-sky-50 dark:bg-stone-800 rounded-3xl flex items-center justify-center text-4xl shadow-inner mb-4 border border-sky-100 dark:border-stone-700 relative">
                  👤
                  <span className="absolute -bottom-1 -right-1 text-xl">✨</span>
                </div>

                <h3 className="text-2xl font-bold text-slate-800 dark:text-stone-100 font-serif mb-1">
                  {selectedChar.name}
                </h3>

                {/* Categories */}
                <div className="flex flex-wrap gap-1.5 justify-center mb-4">
                  {selectedChar.categories.map((cat, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 bg-sky-50 dark:bg-stone-800 text-sky-700 dark:text-sky-300 text-xs rounded-xl border border-sky-100/60 dark:border-stone-700 font-medium"
                    >
                      {cat}
                    </span>
                  ))}
                </div>

                {/* Backstory */}
                <div className="w-full text-left bg-slate-50/60 dark:bg-stone-950/40 p-4 rounded-2xl border border-slate-200/60 dark:border-stone-800/80 mb-4 max-h-[120px] overflow-y-auto custom-scrollbar">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-stone-500 mb-1">
                    Cốt truyện (Backstory)
                  </h4>
                  <p className="text-slate-655 dark:text-stone-300 text-sm leading-relaxed">
                    {selectedChar.backstory}
                  </p>
                </div>

                {/* Opening message */}
                <div className="w-full text-left bg-primary-50/20 dark:bg-primary-950/10 p-4 rounded-2xl border border-primary-100/40 mb-5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-primary-500 mb-1 flex items-center gap-1">
                    <MessageCircle className="w-3.5 h-3.5" />
                    Lời mở đầu (Greeting)
                  </h4>
                  <p className="text-slate-700 dark:text-stone-200 text-sm italic">
                    &ldquo;{selectedChar.openingMessage}&rdquo;
                  </p>
                </div>

                {/* Buttons */}
                <div className="flex gap-2.5 w-full">
                  <button
                    onClick={() => onLikeCharacter(selectedChar.id)}
                    className="flex-1 py-3 px-4 bg-primary-50 dark:bg-primary-950/30 hover:bg-primary-100 dark:hover:bg-primary-950/50 text-primary-600 dark:text-primary-400 font-bold rounded-2xl transition cursor-pointer border border-primary-100/50 dark:border-primary-900/50 flex items-center justify-center gap-2 text-sm"
                  >
                    <Heart className="w-4 h-4 fill-primary-600 dark:fill-primary-400 text-primary-500" />
                    Yêu thích ({selectedChar.heartsCount})
                  </button>

                  <a
                    href={selectedChar.chatLink}
                    target="_blank"
                    referrerPolicy="no-referrer"
                    className="flex-1 py-3 px-4 bg-sky-400 hover:bg-sky-500 text-white font-bold rounded-2xl transition flex items-center justify-center gap-2 text-sm shadow-xs"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Trò chuyện ngay
                  </a>
                </div>

                <button
                  onClick={handleSpin}
                  className="mt-5 text-xs text-slate-500 hover:text-slate-800 dark:text-stone-500 dark:hover:text-stone-300 flex items-center gap-1 font-medium transition cursor-pointer"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                  Quay lại nhân vật khác ({spinCount} lượt quay)
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
