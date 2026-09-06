import { useState, useMemo } from "react";
import { Character } from "../types";
import { Search, Heart, ExternalLink, MessageCircle, Star, X, BookOpen } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface CharacterListProps {
  characters: Character[];
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  onLikeCharacter: (id: string) => void;
  selectedCategory: string | null;
  onSelectCategory: (cat: string | null) => void;
}

export default function CharacterList({
  characters,
  favorites,
  onToggleFavorite,
  onLikeCharacter,
  selectedCategory,
  onSelectCategory
}: CharacterListProps) {
  const [search, setSearch] = useState("");
  const [showOnlyFavs, setShowOnlyFavs] = useState(false);
  const [activeCharacter, setActiveCharacter] = useState<Character | null>(null);

  // Filtered characters
  const filteredCharacters = useMemo(() => {
    return characters.filter((char) => {
      const matchesSearch = char.name.toLowerCase().includes(search.toLowerCase()) || 
                            char.backstory.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = selectedCategory ? char.categories.includes(selectedCategory) : true;
      const matchesFav = showOnlyFavs ? favorites.includes(char.id) : true;
      return matchesSearch && matchesCategory && matchesFav;
    });
  }, [characters, search, selectedCategory, showOnlyFavs, favorites]);

  return (
    <div className="py-4">
      {/* Search and Filters bar */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-8 bg-gradient-to-r from-pink-50/30 to-sky-50/30 dark:bg-stone-900/50 p-4 border border-pink-100 dark:border-stone-800 rounded-3xl">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 animate-pulse" />
          <input
            type="text"
            placeholder="Tìm kiếm nhân vật..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white dark:bg-stone-900 border border-slate-200 dark:border-stone-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-300 dark:text-white transition shadow-xs"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto justify-end">
          {/* Selected category badge */}
          {selectedCategory && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-pink-50 dark:bg-pink-950/40 text-pink-500 text-xs font-semibold rounded-full border border-pink-100">
              <span>Thể loại: {selectedCategory}</span>
              <button
                onClick={() => onSelectCategory(null)}
                className="hover:text-pink-800 font-bold ml-1 transition"
                title="Xóa bộ lọc"
              >
                ×
              </button>
            </div>
          )}

          {/* Toggle Favorites */}
          <button
            onClick={() => setShowOnlyFavs(!showOnlyFavs)}
            className={`px-4 py-2 text-xs rounded-xl font-bold border transition flex items-center gap-1.5 cursor-pointer ${
              showOnlyFavs
                ? "bg-pink-400 border-pink-400 text-white hover:bg-pink-500 shadow-xs"
                : "bg-white dark:bg-stone-900 border-slate-200 dark:border-stone-700 text-slate-600 dark:text-stone-300 hover:bg-pink-50/30"
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${showOnlyFavs ? "fill-white text-white" : ""}`} />
            {showOnlyFavs ? "Đang hiện Yêu thích" : "Chỉ hiện Yêu thích"}
          </button>
        </div>
      </div>

      {/* Characters List Grid */}
      <AnimatePresence mode="popLayout">
        {filteredCharacters.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-16 text-center bg-pink-50/15 dark:bg-stone-900/30 border border-pink-100 dark:border-stone-800 rounded-3xl"
          >
            <span className="text-5xl block mb-4">🍨</span>
            <h3 className="text-lg font-bold text-slate-800 dark:text-stone-200 mb-2 font-serif">
              Không tìm thấy nhân vật nào
            </h3>
            <p className="text-slate-500 dark:text-stone-500 text-sm italic">
              {showOnlyFavs
                ? "Danh sách yêu thích cá nhân của bạn hiện đang trống."
                : "Chưa có nhân vật phù hợp với từ khóa tìm kiếm hoặc bộ lọc của bạn."}
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredCharacters.map((char) => {
              const isFav = favorites.includes(char.id);
              return (
                <motion.div
                  key={char.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  onClick={() => setActiveCharacter(char)}
                  className="bg-white dark:bg-stone-900 border border-pink-100 dark:border-stone-800 rounded-3xl p-6 shadow-xs flex flex-col justify-between hover:border-pink-200 hover:shadow-md transition relative group cursor-pointer"
                >
                  <div>
                    {/* Header of character */}
                    <div className="flex justify-between items-start gap-3 mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-sky-50 dark:bg-stone-800 rounded-2xl flex items-center justify-center text-2xl border border-sky-100 dark:border-stone-700 text-sky-500">
                          👤
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-slate-800 dark:text-stone-100 font-serif">
                            {char.name}
                          </h3>
                          <span className="text-[10px] text-slate-400 dark:text-stone-500">
                            Tạo ngày: {new Date(char.createdAt).toLocaleDateString("vi-VN")}
                          </span>
                        </div>
                      </div>

                      {/* Favorite button */}
                      <button
                        onClick={(e) => { e.stopPropagation(); onToggleFavorite(char.id); }}
                        className={`p-2 rounded-xl border transition cursor-pointer ${
                          isFav
                            ? "bg-pink-50 border-pink-100 text-pink-500 dark:bg-pink-950/30 dark:border-pink-900"
                            : "bg-slate-50 dark:bg-stone-800 border-slate-200 dark:border-stone-700 text-slate-400 hover:text-pink-500 hover:bg-pink-50/20"
                        }`}
                        title={isFav ? "Xóa khỏi Yêu thích" : "Thêm vào Yêu thích"}
                      >
                        <Star className={`w-4 h-4 ${isFav ? "fill-pink-500 text-pink-500" : ""}`} />
                      </button>
                    </div>

                    {/* Genres tag */}
                    <div className="flex flex-wrap gap-1 mb-4">
                      {char.categories.map((cat, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-0.5 bg-sky-50/60 dark:bg-stone-800/80 text-sky-700 dark:text-sky-400 text-[10px] font-medium rounded-lg border border-sky-100/60 dark:border-stone-700/60"
                        >
                          {cat}
                        </span>
                      ))}
                    </div>

                    {/* Backstory snippet */}
                    <div className="mb-4">
                      <p className="text-slate-650 dark:text-stone-300 text-sm leading-relaxed line-clamp-3">
                        {char.backstory}
                      </p>
                    </div>

                    <div className="text-center">
                      <span className="text-[10px] text-slate-400 hover:text-pink-500 transition border-b border-dashed border-slate-300 dark:border-stone-700 pb-0.5">
                        Nhấn để xem đầy đủ thông tin
                      </span>
                    </div>
                  </div>

                  {/* Footer of card */}
                  <div className="flex gap-2.5 pt-4 mt-2 border-t border-slate-100 dark:border-stone-800">
                    <button
                      onClick={(e) => { e.stopPropagation(); onLikeCharacter(char.id); }}
                      className="flex-1 py-2.5 px-3 bg-pink-50 dark:bg-pink-950/20 hover:bg-pink-100 dark:hover:bg-pink-950/40 text-pink-600 dark:text-pink-400 font-bold rounded-2xl transition cursor-pointer border border-pink-100/50 dark:border-pink-900/40 flex items-center justify-center gap-1.5 text-xs"
                    >
                      <Heart className="w-4 h-4 fill-pink-600 dark:fill-pink-400 text-pink-500" />
                      Yêu thích ({char.heartsCount})
                    </button>

                    <a
                      href={char.chatLink}
                      target="_blank"
                      referrerPolicy="no-referrer"
                      onClick={(e) => e.stopPropagation()}
                      className="flex-1 py-2.5 px-3 bg-sky-400 hover:bg-sky-500 dark:bg-stone-100 dark:hover:bg-white text-white dark:text-stone-900 font-bold rounded-2xl transition flex items-center justify-center gap-1.5 text-xs text-center shadow-xs"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      Trò chuyện ngay
                    </a>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </AnimatePresence>

      {/* Modal to view full character details */}
      <AnimatePresence>
        {activeCharacter && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs" onClick={() => setActiveCharacter(null)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-stone-900 border border-slate-200 dark:border-stone-800 rounded-3xl p-6 md:p-8 max-w-xl w-full shadow-2xl relative max-h-[85vh] overflow-y-auto custom-scrollbar"
            >
              <button
                onClick={() => setActiveCharacter(null)}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-stone-800 text-slate-400 hover:text-slate-600 dark:hover:text-stone-300 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-4 mb-6 pr-8">
                <div className="w-16 h-16 bg-sky-50 dark:bg-stone-800 rounded-2xl flex items-center justify-center text-3xl border border-sky-100 dark:border-stone-700 text-sky-500 shrink-0 shadow-sm">
                  👤
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-800 dark:text-stone-100 font-serif">
                    {activeCharacter.name}
                  </h3>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {activeCharacter.categories.map((cat, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 bg-sky-50 dark:bg-stone-800 text-sky-700 dark:text-sky-400 text-[10px] font-medium rounded-md border border-sky-100 dark:border-stone-700"
                      >
                        {cat}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-stone-500 mb-2 flex items-center gap-1.5 border-b border-slate-100 dark:border-stone-800 pb-1.5">
                    <BookOpen className="w-4 h-4" />
                    Cốt truyện nhân vật
                  </h4>
                  <p className="text-slate-700 dark:text-stone-300 text-sm leading-relaxed whitespace-pre-wrap">
                    {activeCharacter.backstory}
                  </p>
                </div>

                <div className="bg-pink-50/40 dark:bg-stone-950/40 p-5 rounded-2xl border border-pink-100/40 dark:border-stone-800/50">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-pink-500 dark:text-stone-500 mb-2 flex items-center gap-1.5">
                    <MessageCircle className="w-4 h-4 text-pink-400" />
                    Lời nhắn mở đầu
                  </h4>
                  <p className="text-slate-700 dark:text-stone-200 text-sm italic font-serif whitespace-pre-wrap">
                    &ldquo;{activeCharacter.openingMessage}&rdquo;
                  </p>
                </div>
              </div>
              
              <div className="mt-8 flex gap-3">
                <a
                  href={activeCharacter.chatLink}
                  target="_blank"
                  referrerPolicy="no-referrer"
                  className="flex-1 py-3 px-4 bg-sky-400 hover:bg-sky-500 dark:bg-stone-100 dark:hover:bg-white text-white dark:text-stone-900 font-bold rounded-2xl transition flex items-center justify-center gap-2 shadow-sm text-sm"
                >
                  <ExternalLink className="w-4 h-4" />
                  Trò chuyện cùng {activeCharacter.name}
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
