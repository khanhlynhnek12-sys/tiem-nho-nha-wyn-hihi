import React from "react";
import { motion } from "motion/react";
import { FolderHeart } from "lucide-react";
import { Character } from "../types";

interface GenreCloudProps {
  characters: Character[];
  onSelectCategory: (cat: string | null) => void;
  selectedCategory: string | null;
  onNavigateToTab: (tab: string) => void;
}

const DEFAULT_CATEGORIES = [
  "Thanh mai trúc mã", "Thanh xuân trường", "Văn nhã bại hoại", "R18", "R21", 
  "Ngụy côn trùng", "Oan gia", "Vừa hận phải yêu", "Ngược luyến tàn tâm", "cổ trang", 
  "Game thủ", "Ngoài lạnh trong nóng", "Chữa lành", "Nuông chiều", "Ngọt sủng", 
  "Boy phố", "Tổng tài", "Cún con nuôi vợ từ bé", "Chiếm hữu"
];

// Alternate between soft pink and soft blue pill styles matching our sweet theme
const PILL_GRADIENTS = [
  "from-primary-50/50 to-primary-100/30 dark:from-primary-950/20 dark:to-primary-950/20 text-primary-600 dark:text-primary-300 hover:border-primary-300 border-primary-100",
  "from-sky-50/50 to-sky-100/30 dark:from-sky-950/20 dark:to-sky-950/20 text-sky-600 dark:text-sky-300 hover:border-sky-300 border-sky-100"
];

export default function GenreCloud({ characters, onSelectCategory, selectedCategory, onNavigateToTab }: GenreCloudProps) {
  // Compute dynamic unique categories
  const categoriesList = React.useMemo(() => {
    const fromChars = characters.flatMap((c) => c.categories || []);
    return Array.from(new Set([...DEFAULT_CATEGORIES, ...fromChars]));
  }, [characters]);

  const handleCategoryClick = (cat: string) => {
    onSelectCategory(cat);
    onNavigateToTab("characters"); // Automatically switch to characters tab when category is selected!
  };

  return (
    <div className="max-w-3xl mx-auto py-6">
      <div className="text-center mb-10">
        <span className="px-4 py-1.5 bg-primary-50 dark:bg-stone-900 text-primary-500 dark:text-primary-300 border border-primary-100 dark:border-stone-800 text-xs font-semibold rounded-full uppercase tracking-wider mb-2 inline-block shadow-xs">
          Bộ Sưu Tập Thể Loại
        </span>
        <h2 className="text-3xl font-bold font-serif text-slate-800 dark:text-stone-100">
          Danh Mục Thể Loại ({categoriesList.length}) 🏷️
        </h2>
        <p className="text-slate-500 dark:text-stone-400 text-sm mt-1">
          Bấm vào thể loại bất kỳ để xem danh sách toàn bộ các nhân vật thuộc nhóm đó nhé.
        </p>
      </div>

      <div className="bg-white dark:bg-stone-900 border border-primary-100 dark:border-stone-800 rounded-3xl p-8 shadow-xs relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-primary-50/40 dark:bg-stone-950/10 rounded-bl-full flex items-center justify-center pointer-events-none">
          <FolderHeart className="w-8 h-8 text-primary-400 opacity-60" />
        </div>

        <div className="flex flex-wrap gap-3.5 justify-center relative z-10">
          {categoriesList.map((cat, idx) => {
            const isSelected = selectedCategory === cat;
            const gradClass = PILL_GRADIENTS[idx % PILL_GRADIENTS.length];

            return (
              <motion.button
                key={cat}
                onClick={() => handleCategoryClick(cat)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-4 py-2.5 rounded-2xl text-sm font-semibold transition bg-gradient-to-br border cursor-pointer ${
                  isSelected
                    ? "from-primary-450 to-sky-400 border-primary-300 text-white font-bold shadow-md"
                    : `${gradClass} shadow-xs`
                }`}
              >
                {cat}
              </motion.button>
            );
          })}
        </div>

        {selectedCategory && (
          <div className="mt-8 pt-6 border-t border-primary-100 dark:border-stone-800 text-center">
            <button
              onClick={() => {
                onSelectCategory(null);
                onNavigateToTab("characters");
              }}
              className="px-5 py-2 text-xs font-bold text-slate-500 dark:text-stone-400 hover:text-slate-800 dark:hover:text-stone-200 border border-primary-100 dark:border-stone-700 bg-primary-50/20 dark:bg-stone-800/50 rounded-xl transition cursor-pointer"
            >
              Reset bộ lọc và xem tất cả
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
