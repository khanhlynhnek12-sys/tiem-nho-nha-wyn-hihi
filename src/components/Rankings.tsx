import { Character } from "../types";
import { Award, Heart, MessageCircle } from "lucide-react";
import { motion } from "motion/react";

interface RankingsProps {
  characters: Character[];
  onLikeCharacter: (id: string) => void;
}

export default function Rankings({ characters, onLikeCharacter }: RankingsProps) {
  // Sort characters by hearts count descending
  const sorted = [...characters].sort((a, b) => b.heartsCount - a.heartsCount);

  if (characters.length === 0) {
    return (
      <div className="p-8 text-center bg-slate-50 dark:bg-stone-900 border border-slate-200 dark:border-stone-800 rounded-2xl max-w-lg mx-auto">
        <span className="text-5xl block mb-4">🏆</span>
        <h3 className="text-lg font-bold text-slate-800 dark:text-stone-200 mb-2 font-serif">
          Bảng Xếp Hạng Đang Trống
        </h3>
        <p className="text-slate-500 dark:text-stone-400 text-sm mb-4">
          Hiện tại tiệm chưa có bất kỳ nhân vật nào được tạo để tiến hành xếp hạng.
        </p>
        <p className="text-xs text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-950/40 px-3 py-2 rounded-lg inline-block">
          💡 Hãy bật Chế độ Quản trị viên để thêm nhân vật đầu tiên!
        </p>
      </div>
    );
  }

  const top3 = sorted.slice(0, 3);
  const remaining = sorted.slice(3);

  // Re-order top3 as [2nd, 1st, 3rd] for visual podium display
  const podiumOrder = [];
  if (top3[1]) podiumOrder.push({ char: top3[1], rank: 2, height: "h-28", color: "bg-sky-50 dark:bg-sky-950/20 border-sky-200 dark:border-sky-900/40", crown: "🥈" });
  if (top3[0]) podiumOrder.push({ char: top3[0], rank: 1, height: "h-36", color: "bg-primary-50 dark:bg-primary-950/20 border-primary-300 dark:border-primary-900/60 border-2 shadow-md", crown: "👑" });
  if (top3[2]) podiumOrder.push({ char: top3[2], rank: 3, height: "h-24", color: "bg-slate-50 dark:bg-stone-900/20 border-slate-200 dark:border-stone-800/40", crown: "🥉" });

  return (
    <div className="max-w-3xl mx-auto py-6">
      <div className="text-center mb-10">
        <span className="px-4 py-1.5 bg-primary-50 dark:bg-stone-900 text-primary-500 dark:text-primary-300 border border-primary-100 dark:border-stone-800 text-xs font-semibold rounded-full uppercase tracking-wider mb-2 inline-block shadow-xs">
          Bảng Vàng Tiệm Wyn
        </span>
        <h2 className="text-3xl font-bold font-serif text-slate-800 dark:text-stone-100">
          BXH Nhân Vật Được Yêu Thích Nhất 🏆
        </h2>
        <p className="text-slate-500 dark:text-stone-400 text-sm mt-1">
          Bảng xếp hạng dựa trên tổng lượng trái tim yêu thích thực tế từ người dùng.
        </p>
      </div>

      {/* Podium for Top 3 */}
      {top3.length > 0 && (
        <div className="flex items-end justify-center gap-4 sm:gap-6 md:gap-8 mb-12 px-2">
          {podiumOrder.map(({ char, rank, height, color, crown }) => (
            <motion.div
              key={char.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: rank * 0.15 }}
              className="flex flex-col items-center flex-1 max-w-[180px]"
            >
              {/* Profile Bubble on top */}
              <div className="relative mb-3 flex flex-col items-center">
                <div className="text-2xl mb-1">{crown}</div>
                <div className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl shadow-md border-2 relative ${
                  rank === 1 ? "bg-primary-50/50 border-primary-200" : rank === 2 ? "bg-sky-50/50 border-sky-200" : "bg-slate-50 border-slate-200"
                }`}>
                  👤
                </div>
                <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full text-white font-bold text-xs flex items-center justify-center border border-white dark:border-stone-900 shadow-xs ${
                  rank === 1 ? "bg-primary-400" : rank === 2 ? "bg-sky-400" : "bg-slate-400"
                }`}>
                  {rank}
                </div>
              </div>

              {/* Character Details */}
              <div className="text-center mb-2 w-full">
                <h4 className="text-sm font-bold text-slate-800 dark:text-stone-200 truncate font-serif">
                  {char.name}
                </h4>
                <button
                  onClick={() => onLikeCharacter(char.id)}
                  className="inline-flex items-center gap-1 mt-1 text-xs text-primary-500 hover:text-primary-600 font-bold bg-primary-50 dark:bg-primary-950/30 px-2 py-0.5 rounded-full transition cursor-pointer"
                >
                  <Heart className="w-3 h-3 fill-primary-500" />
                  {char.heartsCount}
                </button>
              </div>

              {/* Podium Column Block */}
              <div
                className={`w-full ${height} ${color} border-t border-x rounded-t-3xl flex flex-col items-center justify-center shadow-xs`}
              >
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-stone-500">
                  Hạng
                </span>
                <span className="text-3xl font-black font-serif text-slate-800 dark:text-stone-300">
                  {rank}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Leaderboard list for others */}
      {remaining.length > 0 && (
        <div className="bg-white dark:bg-stone-900 border border-primary-100 dark:border-stone-800 rounded-3xl shadow-xs overflow-hidden">
          <div className="px-6 py-4 border-b border-primary-100 dark:border-stone-800 bg-sky-50/20 dark:bg-stone-900 flex justify-between items-center">
            <span className="text-xs font-bold uppercase tracking-wider text-sky-700 dark:text-sky-300">
              Nhân vật tiếp theo
            </span>
            <span className="text-xs font-semibold text-sky-750 dark:text-sky-300">
              Tổng số trái tim
            </span>
          </div>

          <div className="divide-y divide-primary-50 dark:divide-stone-800">
            {remaining.map((char, index) => (
              <div
                key={char.id}
                className="px-6 py-3.5 flex items-center justify-between hover:bg-primary-50/10 dark:hover:bg-stone-800/30 transition duration-150"
              >
                <div className="flex items-center gap-4">
                  {/* Rank Number */}
                  <span className="w-6 text-sm font-bold text-slate-500 dark:text-stone-500 font-mono text-center">
                    {index + 4}
                  </span>

                  {/* Icon */}
                  <div className="w-9 h-9 rounded-xl bg-sky-50 dark:bg-stone-800 flex items-center justify-center text-lg border border-sky-100 dark:border-stone-750">
                    👤
                  </div>

                  {/* Name and Categories */}
                  <div>
                    <h4 className="text-sm font-semibold text-slate-800 dark:text-stone-200 font-serif">
                      {char.name}
                    </h4>
                    <span className="text-[10px] text-slate-400 dark:text-stone-500 truncate block max-w-[280px]">
                      {char.categories.join(", ")}
                    </span>
                  </div>
                </div>

                {/* Like Button & Count */}
                <button
                  onClick={() => onLikeCharacter(char.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-primary-50/50 dark:bg-primary-950/20 hover:bg-primary-100/60 dark:hover:bg-primary-950/40 text-primary-600 dark:text-primary-400 rounded-xl transition font-bold text-xs border border-primary-100/50 dark:border-primary-900/30 cursor-pointer"
                >
                  <Heart className="w-3.5 h-3.5 fill-primary-500" />
                  {char.heartsCount}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
