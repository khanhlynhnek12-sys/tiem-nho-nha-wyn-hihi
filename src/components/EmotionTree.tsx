import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Droplet, Sparkles, X, Heart } from "lucide-react";

const STAGES = [
  { max: 5, icon: "🌱", label: "Mầm nhỏ", msg: "Cây cần thêm tình yêu thương để lớn lên." },
  { max: 15, icon: "🌿", label: "Nhành non", msg: "Cây đang vươn những chiếc lá đầu tiên!" },
  { max: 30, icon: "🌳", label: "Cây trưởng thành", msg: "Tán cây đã tỏa rộng che mát một góc sân." },
  { max: Infinity, icon: "🌸", label: "Hoa tình yêu", msg: "Cây đã nở những đóa hoa rực rỡ nhất! Cảm ơn bạn." }
];

export default function EmotionTree() {
  const [waterCount, setWaterCount] = useState(() => {
    if (typeof window !== "undefined") {
      return parseInt(localStorage.getItem("wyn_tree_water") || "0");
    }
    return 0;
  });
  
  const [isOpen, setIsOpen] = useState(false);
  const [isWatering, setIsWatering] = useState(false);

  useEffect(() => {
    localStorage.setItem("wyn_tree_water", waterCount.toString());
  }, [waterCount]);

  useEffect(() => {
    const handleWaterEvent = () => {
      setWaterCount(prev => prev + 1);
      
      // Small animation effect
      setIsWatering(true);
      setTimeout(() => setIsWatering(false), 1500);
    };

    window.addEventListener("water-tree", handleWaterEvent);
    return () => window.removeEventListener("water-tree", handleWaterEvent);
  }, []);

  const currentStage = STAGES.find(s => waterCount < s.max) || STAGES[STAGES.length - 1];
  const nextStage = STAGES.find(s => waterCount < s.max);
  const progress = nextStage ? (waterCount / nextStage.max) * 100 : 100;

  const handleManualWater = () => {
    setWaterCount(prev => prev + 1);
    setIsWatering(true);
    setTimeout(() => setIsWatering(false), 1500);
  };

  return (
    <div className="fixed bottom-6 left-6 z-50 flex items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="absolute bottom-16 left-0 w-64 bg-white dark:bg-stone-900 rounded-3xl shadow-2xl border border-primary-100 dark:border-stone-800 p-5 overflow-hidden origin-bottom-left"
          >
            <div className="absolute top-3 right-3 flex gap-2">
              <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-600 transition">
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <h3 className="font-serif font-bold text-slate-800 dark:text-stone-200 text-lg mb-1 flex items-center gap-1.5">
              Cây Cảm Xúc <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            </h3>
            <p className="text-xs text-slate-500 dark:text-stone-400 mb-4 leading-relaxed">
              Cây lớn lên bằng tình yêu. Mỗi lần bạn thả tim, gửi thư, cây sẽ tự động được tưới nước.
            </p>

            <div className="flex flex-col items-center justify-center p-4 bg-primary-50/30 dark:bg-stone-800/50 rounded-2xl border border-primary-100/50 dark:border-stone-700/50 relative">
              <motion.div 
                className="text-6xl mb-2 relative z-10"
                animate={isWatering ? { scale: [1, 1.1, 1], rotate: [0, -5, 5, 0] } : {}}
                transition={{ duration: 0.5 }}
              >
                {currentStage.icon}
              </motion.div>
              
              <AnimatePresence>
                {isWatering && (
                  <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 10 }}
                    exit={{ opacity: 0 }}
                    className="absolute top-2 text-sky-400"
                  >
                    <Droplet className="w-6 h-6 fill-sky-400" />
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="text-sm font-bold text-primary-600 dark:text-primary-400 mb-1">
                {currentStage.label}
              </div>
              <div className="text-[10px] text-center text-slate-500 dark:text-stone-400">
                {currentStage.msg}
              </div>
            </div>

            <div className="mt-4">
              <div className="flex justify-between text-[10px] font-bold text-slate-400 mb-1">
                <span>Cấp độ trưởng thành</span>
                <span className="text-primary-500">{waterCount} 💧</span>
              </div>
              <div className="w-full h-2 bg-slate-100 dark:bg-stone-800 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-gradient-to-r from-primary-300 to-sky-300"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>

            <button
              onClick={handleManualWater}
              className="mt-4 w-full py-2.5 bg-primary-50 dark:bg-primary-950/20 hover:bg-primary-100 dark:hover:bg-primary-950/40 text-primary-600 dark:text-primary-400 font-bold rounded-xl transition cursor-pointer border border-primary-100/50 dark:border-primary-900/50 flex items-center justify-center gap-1.5 text-xs"
            >
              <Droplet className="w-3.5 h-3.5" />
              Tưới nước (+1)
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-white dark:bg-stone-900 rounded-full shadow-lg border-2 border-primary-100 dark:border-stone-800 flex items-center justify-center text-3xl cursor-pointer relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-primary-50/30 dark:bg-stone-800/30"></div>
        <span className="relative z-10">{currentStage.icon}</span>
        
        <AnimatePresence>
          {isWatering && !isOpen && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.5, y: 0 }}
              animate={{ opacity: 1, scale: 1.5, y: -20 }}
              exit={{ opacity: 0 }}
              className="absolute text-sky-400 z-20 pointer-events-none"
            >
              <Heart className="w-5 h-5 fill-primary-400 text-primary-400" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
