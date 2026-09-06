import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Letter } from "../types";
import { Send, Inbox, Sparkles, X, User } from "lucide-react";

interface LetterBoxProps {
  letters: Letter[];
  onSendLetter: (author: string, content: string, theme: string) => Promise<void>;
}

const THEMES = [
  { id: "pink", name: "Hồng Ngọt Ngào", bg: "bg-pink-50 border-pink-200 text-pink-800", dot: "bg-pink-400", cardBg: "bg-pink-100/70 dark:bg-pink-950/20", text: "text-pink-900 dark:text-pink-100" },
  { id: "blue", name: "Xanh Mơ Mộng", bg: "bg-sky-50 border-sky-200 text-sky-800", dot: "bg-sky-400", cardBg: "bg-sky-100/70 dark:bg-sky-950/20", text: "text-sky-900 dark:text-sky-100" },
  { id: "green", name: "Bạc Hà Tươi Mát", bg: "bg-teal-50 border-teal-200 text-teal-800", dot: "bg-teal-400", cardBg: "bg-teal-100/70 dark:bg-teal-950/20", text: "text-teal-900 dark:text-teal-100" },
  { id: "yellow", name: "Nắng Ban Mai", bg: "bg-amber-50 border-amber-200 text-amber-800", dot: "bg-amber-400", cardBg: "bg-amber-100/70 dark:bg-amber-950/20", text: "text-amber-900 dark:text-amber-100" },
  { id: "purple", name: "Kẹo Nho Thủy Chung", bg: "bg-purple-50 border-purple-200 text-purple-800", dot: "bg-purple-400", cardBg: "bg-purple-100/70 dark:bg-purple-950/20", text: "text-purple-900 dark:text-purple-100" }
];

export default function LetterBox({ letters, onSendLetter }: LetterBoxProps) {
  const [author, setAuthor] = useState("");
  const [content, setContent] = useState("");
  const [selectedTheme, setSelectedTheme] = useState("pink");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeLetter, setActiveLetter] = useState<Letter | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsSubmitting(true);
    try {
      await onSendLetter(author.trim(), content.trim(), selectedTheme);
      setContent("");
      setAuthor("");
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getThemeDetails = (themeId: string) => {
    return THEMES.find((t) => t.id === themeId) || THEMES[0];
  };

  return (
    <div className="max-w-4xl mx-auto py-6">
      <div className="text-center mb-10">
        <span className="px-4 py-1.5 bg-pink-50 dark:bg-stone-900 text-pink-500 dark:text-pink-300 border border-pink-100 dark:border-stone-800 text-xs font-semibold rounded-full uppercase tracking-wider mb-2 inline-block shadow-xs">
          Góc Chia Sẻ & Bình Luận
        </span>
        <h2 className="text-3xl font-bold font-serif text-slate-800 dark:text-stone-100">
          Nơi Gửi Thư Đẹp Mắt ✉️
        </h2>
        <p className="text-slate-500 dark:text-stone-400 text-sm mt-1">
          Nơi lưu giữ những lời nhắn nhủ ngọt ngào, những đánh giá đóng góp cho tiệm nhỏ nhà Wyn.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Form to Write Letter */}
        <div className="md:col-span-5 bg-pink-50/15 dark:bg-stone-900 border border-pink-100 dark:border-stone-800 rounded-3xl p-6 shadow-md relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-pink-50 dark:bg-pink-950/20 rounded-bl-full flex items-center justify-center">
            <span className="text-xl -mt-4 -mr-4 text-pink-500">✏️</span>
          </div>

          <h3 className="text-lg font-bold font-serif text-slate-850 dark:text-stone-200 mb-4 flex items-center gap-1.5">
            Viết Thư Gửi Wyn
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-stone-400 mb-1 flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-slate-400" />
                Tên của bạn (Để trống nếu muốn ẩn danh)
              </label>
              <input
                type="text"
                placeholder="Nhập tên hoặc biệt danh..."
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                maxLength={30}
                className="w-full px-3 py-2 bg-white dark:bg-stone-800/40 border border-slate-200 dark:border-stone-700 rounded-xl text-sm text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-300 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-stone-400 mb-1">
                Lời nhắn gửi ngọt ngào
              </label>
              <textarea
                placeholder="Nhập nội dung thư của bạn ở đây nhé..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                maxLength={400}
                rows={4}
                required
                className="w-full px-3 py-2 bg-white dark:bg-stone-800/40 border border-slate-200 dark:border-stone-700 rounded-xl text-sm text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-300 transition resize-none custom-scrollbar"
              />
            </div>

            {/* Theme Picker */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-stone-400 mb-1.5">
                Chọn màu phong bì giấy thư
              </label>
              <div className="flex gap-2.5">
                {THEMES.map((theme) => (
                  <button
                    key={theme.id}
                    type="button"
                    onClick={() => setSelectedTheme(theme.id)}
                    className={`w-8 h-8 rounded-full border-2 ${theme.bg} flex items-center justify-center transition transform hover:scale-110 cursor-pointer ${
                      selectedTheme === theme.id ? "ring-2 ring-pink-400 dark:ring-white ring-offset-2 dark:ring-offset-stone-900 scale-105" : "border-transparent"
                    }`}
                    title={theme.name}
                  >
                    <span className={`w-3.5 h-3.5 rounded-full ${theme.dot}`} />
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !content.trim()}
              className="w-full py-2.5 bg-pink-400 hover:bg-pink-500 disabled:opacity-50 text-white font-bold rounded-2xl shadow-sm transition cursor-pointer flex items-center justify-center gap-2 text-sm"
              id="btn-send-letter"
            >
              <Send className="w-4 h-4" />
              Gửi Lá Thư Đi
            </button>
          </form>
        </div>

        {/* Display Envelope Letter Grid */}
        <div className="md:col-span-7">
          <h3 className="text-lg font-bold font-serif text-slate-800 dark:text-stone-200 mb-4 flex items-center gap-2">
            <Inbox className="w-5 h-5 text-sky-400" />
            Hòm Thư Lưu Giữ ({letters.length} bức thư)
          </h3>

          {letters.length === 0 ? (
            <div className="p-12 text-center bg-pink-50/15 dark:bg-stone-900 border border-pink-100 dark:border-stone-800 rounded-3xl">
              <span className="text-4xl block mb-3 animate-pulse">✉️</span>
              <p className="text-slate-500 dark:text-stone-400 text-sm italic">
                Hòm thư hiện đang trống trơn. Hãy là người đầu tiên viết một phong thư ngọt ngào gửi tới tiệm nhé!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[480px] overflow-y-auto pr-1.5 custom-scrollbar">
              {letters.map((letter) => {
                const details = getThemeDetails(letter.theme);
                return (
                  <motion.div
                    key={letter.id}
                    layoutId={`letter-card-${letter.id}`}
                    onClick={() => setActiveLetter(letter)}
                    className={`p-5 rounded-2xl border border-pink-100/40 dark:border-stone-800 cursor-pointer hover:shadow-md transition transform hover:-translate-y-0.5 relative overflow-hidden group ${details.cardBg}`}
                    whileHover={{ scale: 1.02 }}
                  >
                    {/* Tiny envelope flap visual */}
                    <div className="absolute top-0 inset-x-0 h-4 bg-white/20 dark:bg-black/10 origin-top transform skew-y-3 pointer-events-none group-hover:skew-y-1 transition-all" />

                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xs font-bold text-slate-800 dark:text-stone-300 flex items-center gap-1">
                        👤 {letter.author}
                      </span>
                      <span className="text-[9px] text-slate-450 dark:text-stone-500">
                        {new Date(letter.createdAt).toLocaleDateString("vi-VN", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>

                    <p className="text-slate-700 dark:text-stone-200 text-sm line-clamp-3 leading-relaxed break-words font-serif">
                      {letter.content}
                    </p>

                    {/* Wax seal simulation */}
                    <div className="absolute bottom-2 right-2 w-6 h-6 rounded-full bg-pink-400/90 dark:bg-red-650/70 border border-white flex items-center justify-center text-[10px] text-white shadow-sm font-serif">
                      ❤
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Modal to Read Full Letter */}
      <AnimatePresence>
        {activeLetter && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              className="relative w-full max-w-lg bg-white dark:bg-stone-900 border border-pink-100 dark:border-stone-800 rounded-3xl shadow-2xl p-6 overflow-hidden"
              layoutId={`letter-card-${activeLetter.id}`}
            >
              <button
                onClick={() => setActiveLetter(null)}
                className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-stone-800 text-slate-400 hover:text-slate-600 dark:hover:text-stone-300 transition"
                id="btn-close-letter-modal"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Decorative Envelope Header */}
              <div className="flex items-center gap-2 pb-3 border-b border-pink-100 dark:border-stone-800 mb-4">
                <span className="text-2xl">✉️</span>
                <div>
                  <h4 className="text-sm font-bold text-slate-850 dark:text-stone-100 font-serif">
                    Bức thư từ {activeLetter.author}
                  </h4>
                  <p className="text-[10px] text-slate-450 dark:text-stone-500">
                    Gửi lúc:{" "}
                    {new Date(activeLetter.createdAt).toLocaleString("vi-VN", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </p>
                </div>
              </div>

              {/* Styled letter paper body */}
              <div
                className={`p-6 rounded-2xl border border-pink-100/30 min-h-[160px] relative overflow-hidden ${
                  getThemeDetails(activeLetter.theme).cardBg
                }`}
              >
                {/* Lined-paper look */}
                <div className="absolute inset-0 bg-linear-to-b from-transparent via-slate-400/5 to-transparent bg-[size:100%_28px] pointer-events-none" />

                <p className="text-slate-800 dark:text-stone-100 text-sm leading-8 font-serif whitespace-pre-wrap relative z-10 break-words">
                  {activeLetter.content}
                </p>
              </div>

              <div className="mt-6 flex justify-end items-center gap-2">
                <span className="text-xs text-slate-450 italic">
                  Cảm ơn bạn đã nhắn gửi lời vàng ngọc! ✨
                </span>
                <div className="w-8 h-8 rounded-full bg-pink-400 flex items-center justify-center text-sm text-white font-serif shadow-md select-none">
                  ❤
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
