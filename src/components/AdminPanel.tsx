import React, { useState } from "react";
import { Character } from "../types";
import { Plus, Trash2, Shield, Sparkle, Globe, AlertTriangle, Check, BookOpen, MessageCircle, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface AdminPanelProps {
  characters: Character[];
  onCreateCharacter: (charData: Omit<Character, "id" | "heartsCount" | "createdAt">) => Promise<void>;
  onDeleteCharacter: (id: string) => Promise<void>;
}

const DEFAULT_CATEGORIES = [
  "Thanh mai trúc mã", "Thanh xuân trường", "Văn nhã bại hoại", "R18", "R21", 
  "Ngụy côn trùng", "Oan gia", "Vừa hận phải yêu", "Ngược luyến tàn tâm", "cổ trang", 
  "Game thủ", "Ngoài lạnh trong nóng", "Chữa lành", "Nuông chiều", "Ngọt sủng", 
  "Boy phố", "Tổng tài", "Cún con nuôi vợ từ bé", "Chiếm hữu"
];

export default function AdminPanel({ characters, onCreateCharacter, onDeleteCharacter }: AdminPanelProps) {
  const [name, setName] = useState("");
  const [categories, setCategories] = useState<string[]>(() => {
    const fromChars = characters.flatMap((c) => c.categories || []);
    return Array.from(new Set([...DEFAULT_CATEGORIES, ...fromChars]));
  });
  
  const [selectedCats, setSelectedCats] = useState<string[]>([]);
  const [newCatInput, setNewCatInput] = useState("");
  const [backstory, setBackstory] = useState("");
  const [openingMessage, setOpeningMessage] = useState("");
  const [chatLink, setChatLink] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [characterToDelete, setCharacterToDelete] = useState<Character | null>(null);

  const handleCategoryToggle = (cat: string) => {
    setSelectedCats((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const handleAddCustomCategory = (e: React.MouseEvent) => {
    e.preventDefault();
    const trimmed = newCatInput.trim();
    if (trimmed) {
      if (!categories.includes(trimmed)) {
        setCategories((prev) => [...prev, trimmed]);
      }
      if (!selectedCats.includes(trimmed)) {
        setSelectedCats((prev) => [...prev, trimmed]);
      }
      setNewCatInput("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || selectedCats.length === 0 || !backstory || !openingMessage || !chatLink) return;

    setIsSubmitting(true);
    try {
      await onCreateCharacter({
        name: name.trim(),
        categories: selectedCats,
        backstory: backstory.trim(),
        openingMessage: openingMessage.trim(),
        chatLink: chatLink.trim()
      });

      // Reset form
      setName("");
      setSelectedCats([]);
      setBackstory("");
      setOpeningMessage("");
      setChatLink("");
      setSuccessMsg("Thêm nhân vật mới thành công! Hệ thống đã gửi thông báo tự động 🎉");
      setTimeout(() => setSuccessMsg(""), 4000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-6">
      <div className="text-center mb-8">
        <span className="px-4 py-1.5 bg-pink-50 dark:bg-stone-900 text-pink-500 dark:text-pink-300 border border-pink-100 dark:border-stone-800 text-xs font-semibold rounded-full uppercase tracking-wider mb-2 inline-block shadow-xs animate-pulse">
          Bảng Quản Trị Viên
        </span>
        <h2 className="text-3xl font-bold font-serif text-slate-800 dark:text-stone-100">
          Quản Lý Nhân Vật 🛠️
        </h2>
        <p className="text-slate-500 dark:text-stone-400 text-sm mt-1">
          Tạo nhân vật mới để hiển thị toàn trang, cập nhật cốt truyện và quản lý hòn đảo nhân vật của Wyn.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Creation Form */}
        <div className="lg:col-span-7 bg-pink-50/15 dark:bg-stone-900 border border-pink-100 dark:border-stone-800 rounded-3xl p-6 shadow-md">
          <h3 className="text-lg font-bold font-serif text-slate-800 dark:text-stone-200 mb-4 flex items-center gap-1.5 border-b border-pink-100 dark:border-stone-800 pb-2">
            <Plus className="w-5 h-5 text-pink-500" />
            Tạo Nhân Vật Mới
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            {successMsg && (
              <div className="p-3 bg-teal-50 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-900 text-teal-800 dark:text-teal-400 rounded-lg text-xs font-medium">
                {successMsg}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-stone-400 mb-1">
                Tên nhân vật
              </label>
              <input
                type="text"
                placeholder="Nhập tên nhân vật..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-3 py-2.5 bg-white dark:bg-stone-800/40 border border-slate-200 dark:border-stone-700 rounded-xl text-sm text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-300 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-stone-400 mb-1.5">
                Thể loại (Chọn nhiều hoặc thêm mới) <span className="text-red-500">*</span>
              </label>
              
              {/* Custom Category Writer/Add Input */}
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  placeholder="Viết thể loại mới và thêm..."
                  value={newCatInput}
                  onChange={(e) => setNewCatInput(e.target.value)}
                  className="flex-1 px-3 py-1.5 bg-white dark:bg-stone-850 border border-slate-200 dark:border-stone-700 rounded-xl text-xs text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-300 transition"
                />
                <button
                  type="button"
                  onClick={handleAddCustomCategory}
                  className="px-3 py-1.5 bg-sky-400 hover:bg-sky-500 text-white font-semibold rounded-xl text-xs transition cursor-pointer flex items-center gap-1 shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Thêm nhãn
                </button>
              </div>

              <div className="flex flex-wrap gap-2 max-h-[140px] overflow-y-auto p-2.5 border border-pink-100 dark:border-stone-800 rounded-xl bg-slate-50/50 dark:bg-stone-950/20 custom-scrollbar">
                {categories.map((cat) => {
                  const isChecked = selectedCats.includes(cat);
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => handleCategoryToggle(cat)}
                      className={`px-3 py-1 text-xs rounded-full border transition flex items-center gap-1 cursor-pointer select-none ${
                        isChecked
                          ? "bg-pink-400 border-pink-400 text-white font-semibold"
                          : "bg-white dark:bg-stone-900 border-slate-200 dark:border-stone-700 text-slate-600 dark:text-stone-400 hover:bg-pink-50/50"
                      }`}
                    >
                      {isChecked && <Check className="w-3 h-3" />}
                      {cat}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-stone-400 mb-1">
                Cốt truyện (Backstory)
              </label>
              <textarea
                placeholder="Mô tả hoàn cảnh, xuất thân, tính cách nhân vật..."
                value={backstory}
                onChange={(e) => setBackstory(e.target.value)}
                required
                rows={3}
                className="w-full px-3 py-2.5 bg-white dark:bg-stone-800/40 border border-slate-200 dark:border-stone-700 rounded-xl text-sm text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-300 transition resize-none custom-scrollbar"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-stone-400 mb-1">
                Tin nhắn mở đầu (Opening Message)
              </label>
              <input
                type="text"
                placeholder="Câu chào đầu tiên khi người dùng bắt đầu trò chuyện..."
                value={openingMessage}
                onChange={(e) => setOpeningMessage(e.target.value)}
                required
                className="w-full px-3 py-2.5 bg-white dark:bg-stone-800/40 border border-slate-200 dark:border-stone-700 rounded-xl text-sm text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-300 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-stone-400 mb-1 flex items-center gap-1">
                <Globe className="w-3.5 h-3.5 text-slate-400" />
                Liên kết nhân vật (Character Link để chat)
              </label>
              <input
                type="url"
                placeholder="https://example.com/character-link"
                value={chatLink}
                onChange={(e) => setChatLink(e.target.value)}
                required
                className="w-full px-3 py-2.5 bg-white dark:bg-stone-800/40 border border-slate-200 dark:border-stone-700 rounded-xl text-sm text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-300 transition"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !name || selectedCats.length === 0 || !backstory || !openingMessage || !chatLink}
              className="w-full py-3 bg-pink-400 hover:bg-pink-500 disabled:opacity-50 text-white font-bold rounded-2xl shadow-sm transition cursor-pointer flex items-center justify-center gap-2 text-sm"
              id="btn-create-character"
            >
              <Plus className="w-4 h-4" />
              Tạo Hồ Sơ Nhân Vật
            </button>
          </form>
        </div>

        {/* Existing Characters List for Management */}
        <div className="lg:col-span-5 bg-sky-50/15 dark:bg-stone-900 border border-sky-100 dark:border-stone-800 rounded-3xl p-6 shadow-md">
          <h3 className="text-lg font-bold font-serif text-slate-800 dark:text-stone-200 mb-4 flex items-center gap-1.5 border-b border-sky-100 dark:border-stone-800 pb-2">
            <Trash2 className="w-5 h-5 text-red-500" />
            Danh Sách Nhân Vật ({characters.length})
          </h3>

          {characters.length === 0 ? (
            <div className="p-12 text-center bg-slate-50 dark:bg-stone-950/20 border border-dashed border-slate-200 dark:border-stone-800 rounded-2xl">
              <span className="text-3xl block mb-2">🤷‍♂️</span>
              <p className="text-slate-400 dark:text-stone-500 text-xs italic">
                Chưa có nhân vật nào trong tiệm cả.
              </p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[440px] overflow-y-auto pr-1.5 custom-scrollbar">
              {characters.map((char) => (
                <div
                  key={char.id}
                  className="flex items-center justify-between p-3.5 bg-white dark:bg-stone-950/40 border border-sky-100/50 dark:border-stone-800 rounded-2xl hover:bg-sky-50/30 transition duration-150"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-pink-50 dark:bg-pink-950/40 flex items-center justify-center text-lg">
                      👤
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-800 dark:text-stone-200">
                        {char.name}
                      </h4>
                      <p className="text-[10px] text-slate-500 dark:text-stone-500 truncate w-32">
                        {char.categories.join(", ")}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setCharacterToDelete(char)}
                    className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/20 text-stone-400 hover:text-red-500 dark:text-stone-600 transition cursor-pointer"
                    title="Xóa nhân vật"
                    id={`btn-delete-${char.id}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {characterToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white dark:bg-stone-900 border border-slate-200 dark:border-stone-800 rounded-2xl p-6 max-w-sm w-full shadow-2xl relative"
            >
              <div className="flex items-center gap-3 text-red-500 mb-4">
                <AlertTriangle className="w-6 h-6" />
                <h3 className="text-lg font-bold font-serif">Xác nhận xóa</h3>
              </div>
              <p className="text-sm text-slate-600 dark:text-stone-300 mb-6 leading-relaxed">
                Bạn có chắc chắn muốn xóa nhân vật <strong className="text-slate-800 dark:text-white">{characterToDelete.name}</strong> không? Hành động này không thể hoàn tác.
              </p>
              
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setCharacterToDelete(null)}
                  className="px-4 py-2 text-sm font-semibold text-slate-600 dark:text-stone-300 hover:bg-slate-100 dark:hover:bg-stone-800 rounded-xl transition cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    await onDeleteCharacter(characterToDelete.id);
                    setCharacterToDelete(null);
                  }}
                  className="px-4 py-2 text-sm font-bold text-white bg-red-500 hover:bg-red-600 rounded-xl transition cursor-pointer shadow-md"
                >
                  Xóa nhân vật
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
