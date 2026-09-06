import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Sparkles, Calendar, HelpCircle } from "lucide-react";

interface TarotCardData {
  id: string;
  name: string;
  emoji: string;
  character: string;
  message: string;
  fortune: string;
}

const TAROT_CARDS: TarotCardData[] = [
  {
    id: "1",
    name: "Lá Bài Wyn",
    emoji: "🍦",
    character: "Wyn",
    message: "Hôm nay, tớ hy vọng bạn sẽ dành ra 5 phút để mỉm cười và thưởng thức một món ngọt nhé! Tớ luôn ở đây đón chờ những chia sẻ từ bạn.",
    fortune: "Một ngày tràn đầy năng lượng tích cực và những cơ hội ngọt ngào."
  },
  {
    id: "2",
    name: "Lá Bài Nguyệt Dạ",
    emoji: "🌙",
    character: "Minh Nguyệt",
    message: "Trăng có lúc tỏ lúc mờ, lòng người cũng có lúc thăng lúc trầm. Đừng vội vã, đêm nay hãy ngủ sớm một chút nhé, tớ sẽ canh giấc cho bạn.",
    fortune: "Thời điểm thích hợp để nghỉ ngơi, suy ngẫm và phục hồi trực giác tâm hồn."
  },
  {
    id: "3",
    name: "Lá Bài Ánh Dương",
    emoji: "☀️",
    character: "Thần Thái Dương",
    message: "Mọi giông bão rồi cũng phải nhường chỗ cho ánh mặt trời rực rỡ. Hãy tự tin bước ra ngoài và đón nhận những tia nắng ấm áp hân hoan nào!",
    fortune: "Vận may rực sáng, thành công trong các quyết định nhỏ hằng ngày."
  },
  {
    id: "4",
    name: "Lá Bài Kẹo Ngọt",
    emoji: "🍬",
    character: "Tiểu Đường",
    message: "Cuộc sống đôi khi đắng chát, nhưng chỉ cần bạn giữ cho mình một tâm hồn thơ ngây, bạn sẽ luôn tìm thấy viên kẹo ngọt ẩn giấu.",
    fortune: "Sẽ có một niềm vui bất ngờ hoặc món quà nhỏ từ một người quen cũ."
  },
  {
    id: "5",
    name: "Lá Bài Tri Kỷ",
    emoji: "🧸",
    character: "Bảo Bảo",
    message: "Bạn không cô đơn đâu. Dù ngoài kia có giông bão ra sao, luôn có một góc ấm áp trong tiệm nhỏ này sẵn sàng lắng nghe mọi lời thì thầm của bạn.",
    fortune: "Mối quan hệ bạn bè, tri kỷ tiến triển tốt, nhận được sự thấu hiểu sâu sắc."
  }
];

export default function DailyTarot() {
  const [pulledCard, setPulledCard] = useState<TarotCardData | null>(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [hasPulledToday, setHasPulledToday] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const lastPullDate = localStorage.getItem("wyn_last_tarot_pull_date");
    const today = new Date().toDateString();
    if (lastPullDate === today) {
      setHasPulledToday(true);
      const savedCardId = localStorage.getItem("wyn_last_tarot_card_id");
      const savedCard = TAROT_CARDS.find(c => c.id === savedCardId);
      if (savedCard) {
        setPulledCard(savedCard);
        setIsFlipped(true);
      }
    }
  }, []);

  const handlePullCard = () => {
    if (hasPulledToday) return;

    const currentPoints = parseInt(localStorage.getItem("wyn_points") || "0", 10);
    if (currentPoints < 30) {
      setError("Bạn không đủ đá quý! Cần 30 💎 để rút quẻ chiêm tinh.");
      return;
    }

    setError("");
    const randomIndex = Math.floor(Math.random() * TAROT_CARDS.length);
    const card = TAROT_CARDS[randomIndex];
    
    setPulledCard(card);
    setIsFlipped(true);
    setHasPulledToday(true);
    
    const today = new Date().toDateString();
    localStorage.setItem("wyn_last_tarot_pull_date", today);
    localStorage.setItem("wyn_last_tarot_card_id", card.id);

    // Cost 30 points!
    window.dispatchEvent(new CustomEvent("add-points", { detail: { amount: -30 } }));
    window.dispatchEvent(new CustomEvent("water-tree"));
  };

  return (
    <div className="w-full max-w-xl mx-auto bg-white dark:bg-stone-900 border border-primary-100 dark:border-stone-800 rounded-3xl p-6 shadow-xl flex flex-col items-center">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-serif font-bold text-slate-800 dark:text-stone-100 flex items-center justify-center gap-1.5">
          Bói Bài Hằng Ngày <Sparkles className="w-5 h-5 text-amber-500 fill-amber-400" />
        </h3>
        <p className="text-xs text-slate-500 dark:text-stone-400 mt-1">
          Chi tiêu <span className="text-primary-500 font-bold">30 💎</span> để rút một lá bài ngẫu nhiên đón nhận lời nhắn bình yên hằng ngày từ các nhân vật!
        </p>
      </div>

      {error && (
        <div className="w-full text-center px-4 py-2 bg-red-50 dark:bg-red-950/20 text-red-500 dark:text-red-400 text-xs font-bold rounded-xl border border-red-200 dark:border-red-900/40">
          ⚠️ {error}
        </div>
      )}

      {/* Card area */}
      <div className="relative w-56 h-80 perspective-1000 cursor-pointer my-6" onClick={handlePullCard}>
        <motion.div
          className="w-full h-full duration-700 preserve-3d relative"
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* Card Front (Unflipped - Show beautiful card back) */}
          <div className="absolute inset-0 w-full h-full rounded-2xl bg-gradient-to-tr from-indigo-900 via-purple-900 to-primary-900 p-4 border-4 border-amber-400 shadow-2xl flex flex-col items-center justify-between backface-hidden">
            <div className="w-full h-full border border-amber-400/50 rounded-lg flex flex-col items-center justify-between p-4 text-center">
              <div className="text-2xl text-amber-300">✦</div>
              <div>
                <span className="text-5xl block animate-bounce mb-3">🔮</span>
                <p className="text-amber-300 font-serif font-semibold text-sm tracking-wide">Tiệm Nhỏ Nhà Wyn</p>
                <p className="text-amber-400/60 text-[10px] uppercase tracking-widest mt-0.5">Lời nhắn mỗi ngày</p>
              </div>
              <div className="text-2xl text-amber-300">✦</div>
            </div>
          </div>

          {/* Card Back (Flipped - Show message) */}
          <div 
            className="absolute inset-0 w-full h-full rounded-2xl bg-amber-50 dark:bg-stone-800 p-4 border-4 border-amber-400 shadow-2xl flex flex-col items-center justify-between backface-hidden"
            style={{ transform: "rotateY(180deg)", backfaceVisibility: "hidden" }}
          >
            <div className="w-full h-full border border-amber-300/40 rounded-lg flex flex-col items-center justify-between p-4 text-center overflow-y-auto">
              <div>
                <span className="text-xs font-bold text-amber-600 dark:text-amber-400 font-serif uppercase tracking-wider block">
                  {pulledCard?.name}
                </span>
                <span className="text-4xl block my-2">{pulledCard?.emoji}</span>
              </div>

              <div className="my-2">
                <p className="text-stone-800 dark:text-stone-100 text-xs italic font-serif leading-relaxed px-1">
                  "{pulledCard?.message}"
                </p>
                <p className="text-[10px] text-stone-400 dark:text-stone-500 font-bold mt-2">
                  — {pulledCard?.character}
                </p>
              </div>

              <div className="w-full border-t border-amber-200 dark:border-stone-700 pt-2 text-center">
                <p className="text-[9px] uppercase tracking-widest text-amber-600 dark:text-amber-400 font-bold">Vận Thế Hôm Nay</p>
                <p className="text-[10px] text-stone-500 dark:text-stone-300 font-medium mt-0.5 leading-snug">
                  {pulledCard?.fortune}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="mt-4 text-center">
        {hasPulledToday ? (
          <div className="flex flex-col items-center gap-1.5">
            <span className="text-emerald-500 dark:text-emerald-400 font-bold text-xs flex items-center gap-1">
              ✓ Đã rút quẻ bói hôm nay (-30 💎)
            </span>
            <p className="text-[10px] text-stone-400 dark:text-stone-500">
              Hãy quay lại vào ngày mai để đón nhận vận thế mới nhé!
            </p>
          </div>
        ) : (
          <button
            onClick={handlePullCard}
            className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-white font-bold text-xs rounded-full shadow-md transition cursor-pointer flex items-center gap-1.5"
          >
            <Sparkles className="w-4 h-4 fill-white" /> Rút quẻ chiêm tinh
          </button>
        )}
      </div>
    </div>
  );
}
