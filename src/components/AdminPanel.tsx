import React, { useState } from "react";
import { Character } from "../types";
import { SafeAvatar } from "./SafeAvatar";
import { Letter } from "../types";
import { Plus, Trash2, Shield, Sparkle, Globe, AlertTriangle, Check, BookOpen, MessageCircle, X, Mail, Send } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface AdminPanelProps {
  characters: Character[];
  letters: Letter[];
  onCreateCharacter: (charData: Omit<Character, "id" | "heartsCount" | "createdAt">) => Promise<void>;
  onDeleteCharacter: (id: string) => Promise<void>;
  onReplyLetter: (id: string, reply: string) => Promise<void>;
  onResetCharacterHearts: (id: string) => Promise<void>;
  onResetAllCharacterHearts: () => Promise<void>;
}

const DEFAULT_CATEGORIES = [
  "Thanh mai trúc mã", "Thanh xuân trường", "Văn nhã bại hoại", "R18", "R21", 
  "Ngụy côn trùng", "Oan gia", "Vừa hận phải yêu", "Ngược luyến tàn tâm", "cổ trang", 
  "Game thủ", "Ngoài lạnh trong nóng", "Chữa lành", "Nuông chiều", "Ngọt sủng", 
  "Boy phố", "Tổng tài", "Cún con nuôi vợ từ bé", "Chiếm hữu"
];

function resizeImageToBase64(file: File, maxWidth = 300, maxHeight = 300): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
          resolve(dataUrl);
        } else {
          resolve(event.target?.result as string);
        }
      };
      img.onerror = () => {
        reject(new Error("Không thể tải hình ảnh."));
      };
    };
    reader.onerror = (error) => reject(error);
  });
}

export default function AdminPanel({ characters, letters, onCreateCharacter, onDeleteCharacter, onReplyLetter, onResetCharacterHearts, onResetAllCharacterHearts }: AdminPanelProps) {
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
  const [imageUrl, setImageUrl] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [characterToDelete, setCharacterToDelete] = useState<Character | null>(null);

  const [replyLetterId, setReplyLetterId] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [isReplying, setIsReplying] = useState(false);

  const handleCategoryToggle = (cat: string) => {
    setSelectedCats((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const processFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Vui lòng tải lên một tệp hình ảnh hợp lệ (JPG, PNG, GIF, WEBP)!");
      return;
    }
    try {
      const base64 = await resizeImageToBase64(file);
      setImageUrl(base64);
      setPreviewUrl(base64);
    } catch (err) {
      console.error(err);
      alert("Đã xảy ra lỗi khi nén và xử lý hình ảnh.");
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      await processFile(e.target.files[0]);
    }
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
        chatLink: chatLink.trim(),
        imageUrl: imageUrl.trim() || undefined
      });

      // Reset form
      setName("");
      setSelectedCats([]);
      setBackstory("");
      setOpeningMessage("");
      setChatLink("");
      setImageUrl("");
      setPreviewUrl(null);
      setSuccessMsg("Thêm nhân vật mới thành công! Hệ thống đã gửi thông báo tự động 🎉");
      setTimeout(() => setSuccessMsg(""), 4000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReplySubmit = async (e: React.FormEvent, letterId: string) => {
    e.preventDefault();
    if (!replyContent.trim()) return;

    setIsReplying(true);
    try {
      await onReplyLetter(letterId, replyContent.trim());
      setReplyLetterId(null);
      setReplyContent("");
      setSuccessMsg("Đã trả lời thư thành công!");
      setTimeout(() => setSuccessMsg(""), 4000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsReplying(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-6">
      <div className="text-center mb-8">
        <span className="px-4 py-1.5 bg-primary-50 dark:bg-stone-900 text-primary-500 dark:text-primary-300 border border-primary-100 dark:border-stone-800 text-xs font-semibold rounded-full uppercase tracking-wider mb-2 inline-block shadow-xs animate-pulse">
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
        <div className="lg:col-span-7 bg-primary-50/15 dark:bg-stone-900 border border-primary-100 dark:border-stone-800 rounded-3xl p-6 shadow-md">
          <h3 className="text-lg font-bold font-serif text-slate-800 dark:text-stone-200 mb-4 flex items-center gap-1.5 border-b border-primary-100 dark:border-stone-800 pb-2">
            <Plus className="w-5 h-5 text-primary-500" />
            Tạo Nhân Vật Mới
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            {successMsg && (
              <div className="p-3 bg-teal-50 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-900 text-teal-800 dark:text-teal-400 rounded-lg text-xs font-medium">
                {successMsg}
              </div>
            )}

            {/* Drag and Drop Image Box */}
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-500 dark:text-stone-400">
                Hình ảnh nhân vật (Kéo & Thả hoặc Nhấp để chọn ảnh từ máy)
              </label>
              <div
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                className={`relative border-2 border-dashed rounded-2xl p-4 transition flex flex-col items-center justify-center cursor-pointer min-h-[120px] ${
                  dragActive
                    ? "border-primary-400 bg-primary-50/50 dark:bg-primary-950/20"
                    : "border-slate-200 dark:border-stone-700 hover:border-primary-300 bg-white/40 dark:bg-stone-850/20"
                }`}
              >
                <input
                  type="file"
                  accept="image/*"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={handleFileChange}
                />
                
                {previewUrl || imageUrl ? (
                  <div className="flex items-center gap-4 w-full px-2">
                    <div className="w-16 h-16 rounded-xl overflow-hidden border border-slate-100 dark:border-stone-800 bg-white dark:bg-stone-900 flex-shrink-0">
                      <img src={previewUrl || imageUrl} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-slate-800 dark:text-stone-200 truncate">
                        Đã tải ảnh nhân vật thành công!
                      </p>
                      <p className="text-[10px] text-slate-400 dark:text-stone-500 truncate mt-0.5">
                        Dữ liệu: {imageUrl.substring(0, 45)}...
                      </p>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          setImageUrl("");
                          setPreviewUrl(null);
                        }}
                        className="text-[11px] font-semibold text-red-500 hover:text-red-600 mt-1 cursor-pointer block"
                      >
                        Xóa ảnh này
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center pointer-events-none">
                    <span className="text-2xl block mb-1">🖼️</span>
                    <p className="text-xs font-medium text-slate-600 dark:text-stone-300">
                      Kéo thả ảnh của nhân vật vào đây hoặc nhấp để chọn
                    </p>
                    <p className="text-[10px] text-slate-400 dark:text-stone-500 mt-1">
                      Hỗ trợ JPG, PNG, GIF, WEBP (Tự động nén & lưu trực tiếp)
                    </p>
                  </div>
                )}
              </div>
            </div>

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
                className="w-full px-3 py-2.5 bg-white dark:bg-stone-800/40 border border-slate-200 dark:border-stone-700 rounded-xl text-sm text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-300 transition"
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

              <div className="flex flex-wrap gap-2 max-h-[140px] overflow-y-auto p-2.5 border border-primary-100 dark:border-stone-800 rounded-xl bg-slate-50/50 dark:bg-stone-950/20 custom-scrollbar">
                {categories.map((cat) => {
                  const isChecked = selectedCats.includes(cat);
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => handleCategoryToggle(cat)}
                      className={`px-3 py-1 text-xs rounded-full border transition flex items-center gap-1 cursor-pointer select-none ${
                        isChecked
                          ? "bg-primary-400 border-primary-400 text-white font-semibold"
                          : "bg-white dark:bg-stone-900 border-slate-200 dark:border-stone-700 text-slate-600 dark:text-stone-400 hover:bg-primary-50/50"
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
                className="w-full px-3 py-2.5 bg-white dark:bg-stone-800/40 border border-slate-200 dark:border-stone-700 rounded-xl text-sm text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-300 transition resize-none custom-scrollbar"
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
                className="w-full px-3 py-2.5 bg-white dark:bg-stone-800/40 border border-slate-200 dark:border-stone-700 rounded-xl text-sm text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-300 transition"
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
                className="w-full px-3 py-2.5 bg-white dark:bg-stone-800/40 border border-slate-200 dark:border-stone-700 rounded-xl text-sm text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-300 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-stone-400 mb-1 flex items-center gap-1">
                <Globe className="w-3.5 h-3.5 text-slate-400" />
                Hoặc nhập liên kết ảnh nhân vật (Nếu không kéo thả file ở trên)
              </label>
              <input
                type="url"
                placeholder={imageUrl.startsWith("data:") ? "Đã sử dụng tệp ảnh tải lên từ máy" : "https://example.com/character-image.jpg"}
                value={imageUrl.startsWith("data:") ? "" : imageUrl}
                onChange={(e) => {
                  setImageUrl(e.target.value);
                  setPreviewUrl(null);
                }}
                disabled={imageUrl.startsWith("data:")}
                className="w-full px-3 py-2.5 bg-white dark:bg-stone-800/40 border border-slate-200 dark:border-stone-700 rounded-xl text-sm text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-300 transition disabled:opacity-60 disabled:cursor-not-allowed"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !name || selectedCats.length === 0 || !backstory || !openingMessage || !chatLink}
              className="w-full py-3 bg-primary-400 hover:bg-primary-500 disabled:opacity-50 text-white font-bold rounded-2xl shadow-sm transition cursor-pointer flex items-center justify-center gap-2 text-sm"
              id="btn-create-character"
            >
              <Plus className="w-4 h-4" />
              Tạo Hồ Sơ Nhân Vật
            </button>
          </form>
        </div>

        {/* Existing Characters List for Management */}
        <div className="lg:col-span-5 bg-sky-50/15 dark:bg-stone-900 border border-sky-100 dark:border-stone-800 rounded-3xl p-6 shadow-md">
          <div className="flex items-center justify-between border-b border-sky-100 dark:border-stone-800 pb-2 mb-4">
            <h3 className="text-lg font-bold font-serif text-slate-800 dark:text-stone-200 flex items-center gap-1.5">
              <Trash2 className="w-5 h-5 text-red-500" />
              Danh Sách Nhân Vật ({characters.length})
            </h3>
            {characters.length > 0 && (
              <button
                onClick={onResetAllCharacterHearts}
                className="px-2 py-1 bg-amber-100 hover:bg-amber-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-amber-700 dark:text-amber-500 text-xs font-bold rounded-lg transition flex items-center gap-1"
                title="Reset toàn bộ tim về 0"
              >
                <span className="text-xs">🔄</span> Reset All
              </button>
            )}
          </div>

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
                    <SafeAvatar imageUrl={char.imageUrl} name={char.name} sizeClass="w-8 h-8 text-sm" roundedClass="rounded-lg" />
                    <div>
                      <h4 className="text-xs font-bold text-slate-800 dark:text-stone-200">
                        {char.name}
                      </h4>
                      <p className="text-[10px] text-slate-500 dark:text-stone-500 truncate w-32">
                        {char.categories.join(", ")}
                      </p>
                      <p className="text-[10px] text-primary-500 font-bold mt-0.5">
                        💖 {char.heartsCount} tim
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => onResetCharacterHearts(char.id)}
                      className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-stone-800 text-stone-400 hover:text-amber-500 dark:text-stone-600 transition cursor-pointer"
                      title="Reset độ thân mật (về 0)"
                    >
                      <span className="text-sm">🔄</span>
                    </button>
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
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Letters Management Section */}
      <div className="mt-8 bg-amber-50/15 dark:bg-stone-900 border border-amber-100 dark:border-stone-800 rounded-3xl p-6 shadow-md">
        <h3 className="text-lg font-bold font-serif text-slate-800 dark:text-stone-200 mb-4 flex items-center gap-1.5 border-b border-amber-100 dark:border-stone-800 pb-2">
          <Mail className="w-5 h-5 text-amber-500" />
          Hộp Thư Độc Giả ({letters.length})
        </h3>
        
        {letters.length === 0 ? (
          <div className="p-12 text-center bg-slate-50 dark:bg-stone-950/20 border border-dashed border-slate-200 dark:border-stone-800 rounded-2xl">
            <span className="text-3xl block mb-2">📭</span>
            <p className="text-slate-400 dark:text-stone-500 text-xs italic">
              Chưa có thư nào được gửi đến.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
            {letters.map((letter) => (
              <div key={letter.id} className="bg-white dark:bg-stone-950/40 p-4 border border-amber-100/50 dark:border-stone-800 rounded-2xl flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-bold text-slate-800 dark:text-stone-300">
                    👤 {letter.author}
                  </span>
                  <span className="text-[9px] text-slate-450 dark:text-stone-500">
                    {new Date(letter.createdAt).toLocaleDateString("vi-VN", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                <p className="text-sm text-slate-700 dark:text-stone-200 mb-3 font-serif flex-1">
                  {letter.content}
                </p>

                {letter.adminReply ? (
                  <div className="mt-2 p-3 bg-primary-50/50 dark:bg-stone-900 rounded-xl border border-primary-100 dark:border-stone-800">
                    <span className="text-[10px] font-bold text-primary-500 mb-1 block">👑 Admin đã trả lời:</span>
                    <p className="text-xs text-slate-700 dark:text-stone-300 italic">{letter.adminReply}</p>
                  </div>
                ) : replyLetterId === letter.id ? (
                  <form onSubmit={(e) => handleReplySubmit(e, letter.id)} className="mt-2">
                    <textarea
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                      placeholder="Nhập câu trả lời..."
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-stone-800/40 border border-slate-200 dark:border-stone-700 rounded-xl text-xs text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-300 transition resize-none custom-scrollbar mb-2"
                      rows={2}
                      required
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => { setReplyLetterId(null); setReplyContent(""); }}
                        className="px-3 py-1.5 text-[10px] font-semibold text-slate-600 dark:text-stone-400 hover:bg-slate-100 dark:hover:bg-stone-800 rounded-lg transition"
                      >
                        Hủy
                      </button>
                      <button
                        type="submit"
                        disabled={isReplying || !replyContent.trim()}
                        className="px-3 py-1.5 text-[10px] font-bold text-white bg-primary-500 hover:bg-primary-600 disabled:opacity-50 rounded-lg transition flex items-center gap-1 shadow-sm"
                      >
                        <Send className="w-3 h-3" />
                        Gửi Trả Lời
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="mt-2 pt-3 border-t border-slate-100 dark:border-stone-800 flex justify-end">
                    <button
                      onClick={() => setReplyLetterId(letter.id)}
                      className="text-[10px] font-bold text-primary-500 hover:text-primary-600 bg-primary-50 hover:bg-primary-100 dark:bg-primary-950/20 dark:hover:bg-primary-950/40 px-3 py-1.5 rounded-lg transition flex items-center gap-1"
                    >
                      <MessageCircle className="w-3 h-3" />
                      Trả lời thư
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
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
