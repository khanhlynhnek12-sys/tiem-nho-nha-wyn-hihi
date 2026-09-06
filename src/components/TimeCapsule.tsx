import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Hourglass, Lock, Unlock, Key, Send, Search, Sparkles } from "lucide-react";

interface TimeCapsuleData {
  id: string;
  code: string;
  author: string;
  content: string;
  createdAt: number;
  unlocksAt: number;
}

export default function TimeCapsule() {
  const [capsules, setCapsules] = useState<TimeCapsuleData[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("wyn_time_capsules");
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  const [author, setAuthor] = useState("");
  const [content, setContent] = useState("");
  const [duration, setDuration] = useState("1min"); // '1min', '1day', '1week', '1month'
  const [searchCode, setSearchCode] = useState("");
  const [foundCapsule, setFoundCapsule] = useState<TimeCapsuleData | null>(null);
  const [searchError, setSearchError] = useState("");
  const [newCode, setNewCode] = useState("");

  useEffect(() => {
    localStorage.setItem("wyn_time_capsules", JSON.stringify(capsules));
  }, [capsules]);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    let unlockTime = Date.now();
    if (duration === "1min") unlockTime += 60 * 1000;
    else if (duration === "1day") unlockTime += 24 * 60 * 60 * 1000;
    else if (duration === "1week") unlockTime += 7 * 24 * 60 * 60 * 1000;
    else if (duration === "1month") unlockTime += 30 * 24 * 60 * 60 * 1000;

    const randomSuffix = Math.floor(100000 + Math.random() * 900000);
    const code = `WYN-${randomSuffix}`;

    const newCapsule: TimeCapsuleData = {
      id: Date.now().toString(),
      code,
      author: author.trim() || "Người gửi ẩn danh",
      content: content.trim(),
      createdAt: Date.now(),
      unlocksAt: unlockTime
    };

    setCapsules(prev => [newCapsule, ...prev]);
    setNewCode(code);
    setAuthor("");
    setContent("");

    // Trigger tree watering
    window.dispatchEvent(new CustomEvent("water-tree"));
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchError("");
    setFoundCapsule(null);

    const code = searchCode.trim().toUpperCase();
    const caps = capsules.find(c => c.code === code);

    if (!caps) {
      setSearchError("Không tìm thấy hộp thư thời gian với mã khóa này.");
      return;
    }

    setFoundCapsule(caps);
  };

  const isLocked = (capsule: TimeCapsuleData) => {
    return Date.now() < capsule.unlocksAt;
  };

  const getRemainingTimeText = (unlocksAt: number) => {
    const diff = unlocksAt - Date.now();
    if (diff <= 0) return "Có thể mở";

    const seconds = Math.floor((diff / 1000) % 60);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days > 0) return `${days} ngày nữa`;
    if (hours > 0) return `${hours} giờ ${minutes} phút nữa`;
    if (minutes > 0) return `${minutes} phút ${seconds} giây nữa`;
    return `${seconds} giây nữa`;
  };

  return (
    <div className="w-full max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
      {/* Column 1: Create Capsule */}
      <div className="bg-white dark:bg-stone-900 border border-primary-100 dark:border-stone-800 rounded-3xl p-6 shadow-xl relative overflow-hidden">
        <h3 className="text-xl font-serif font-bold text-slate-800 dark:text-stone-100 mb-2 flex items-center gap-1.5">
          Gửi Thư Cho Tương Lai ⏳
        </h3>
        <p className="text-xs text-slate-500 dark:text-stone-400 mb-6 leading-relaxed">
          Hãy cất giữ những cảm xúc, mục tiêu hoặc lời hứa của ngày hôm nay vào một hộp thư thời gian bí mật. Chỉ có thể mở sau một khoảng thời gian nhất định!
        </p>

        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Tên của bạn (Tùy chọn)
            </label>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Tên hoặc biệt danh thân mật..."
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-stone-800/40 border border-slate-200 dark:border-stone-700 rounded-2xl text-xs text-slate-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-primary-400 transition"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Thời gian khóa lại
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { value: "1min", label: "1 phút" },
                { value: "1day", label: "1 ngày" },
                { value: "1week", label: "1 tuần" },
                { value: "1month", label: "1 tháng" }
              ].map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setDuration(opt.value)}
                  className={`py-2 px-1 text-[11px] font-bold rounded-xl border text-center transition cursor-pointer ${
                    duration === opt.value
                      ? "bg-primary-500 border-primary-500 text-white"
                      : "bg-slate-50 border-slate-200 text-slate-600 dark:bg-stone-800 dark:border-stone-700 dark:text-stone-300"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Nội dung gửi tương lai
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              rows={4}
              placeholder="Viết những lời thầm kín hoặc tâm nguyện gửi tới tương lai của bạn..."
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-stone-800/40 border border-slate-200 dark:border-stone-700 rounded-2xl text-xs text-slate-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-primary-400 transition resize-none leading-relaxed"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-primary-400 to-sky-400 hover:from-primary-500 hover:to-sky-500 text-white font-bold text-xs rounded-2xl shadow-md transition cursor-pointer flex items-center justify-center gap-1.5"
          >
            <Hourglass className="w-4 h-4" /> Chôn giấu thư tình cảm
          </button>
        </form>

        {/* New Capsule Code Popup */}
        <AnimatePresence>
          {newCode && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="absolute inset-0 bg-primary-500 text-white p-6 flex flex-col justify-center items-center text-center z-20"
            >
              <span className="text-5xl mb-4">🔑</span>
              <h4 className="text-xl font-bold font-serif mb-2">Hộp Thư Đã Được Chôn Giấu!</h4>
              <p className="text-xs opacity-90 max-w-xs mb-6">
                Hãy lưu lại Mã Khóa bên dưới để tìm lại hộp thư của bạn trong tương lai. Đừng chia sẻ với ai khác nhé!
              </p>
              <div className="bg-white/10 border border-white/20 px-6 py-3 rounded-2xl font-mono text-2xl font-bold tracking-widest mb-6">
                {newCode}
              </div>
              <button
                onClick={() => setNewCode("")}
                className="px-6 py-2 bg-white text-primary-600 font-bold rounded-xl text-xs shadow-md hover:bg-slate-50 transition cursor-pointer"
              >
                Tôi đã lưu mã
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Column 2: Search & Locked Capsules */}
      <div className="space-y-6">
        {/* Search Box */}
        <div className="bg-white dark:bg-stone-900 border border-primary-100 dark:border-stone-800 rounded-3xl p-6 shadow-xl">
          <h3 className="text-base font-serif font-bold text-slate-800 dark:text-stone-100 mb-4 flex items-center gap-1.5">
            <Key className="w-4 h-4 text-amber-500" /> Giải Mã Hộp Thư Thời Gian
          </h3>

          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              type="text"
              value={searchCode}
              onChange={(e) => setSearchCode(e.target.value)}
              placeholder="Nhập mã khóa (Ví dụ: WYN-123456)..."
              className="flex-1 px-4 py-2.5 bg-slate-50 dark:bg-stone-800/40 border border-slate-200 dark:border-stone-700 rounded-2xl text-xs text-slate-800 dark:text-white font-mono tracking-widest uppercase focus:outline-none"
            />
            <button
              type="submit"
              className="p-3 bg-amber-500 hover:bg-amber-600 text-white rounded-2xl transition cursor-pointer flex items-center justify-center shadow-md"
            >
              <Search className="w-4 h-4" />
            </button>
          </form>

          {searchError && (
            <p className="text-red-500 text-[10px] font-bold mt-2">{searchError}</p>
          )}

          {/* Search Result */}
          <AnimatePresence>
            {foundCapsule && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-4 p-4 rounded-2xl border border-dashed border-amber-300 dark:border-stone-700 bg-amber-50/50 dark:bg-stone-800/40 flex flex-col items-center text-center"
              >
                {isLocked(foundCapsule) ? (
                  <>
                    <Lock className="w-10 h-10 text-amber-600 mb-2" />
                    <h4 className="text-xs font-bold text-stone-800 dark:text-stone-200">Hộp Thư Vẫn Đang Khóa</h4>
                    <p className="text-[10px] text-stone-400 mt-1 leading-snug">
                      Được chôn giấu bởi <span className="font-semibold">{foundCapsule.author}</span>. Hộp thư này chỉ sẵn sàng để đọc sau:
                    </p>
                    <p className="text-xs font-bold text-amber-600 mt-2 flex items-center gap-1">
                      ⌛ {getRemainingTimeText(foundCapsule.unlocksAt)}
                    </p>
                  </>
                ) : (
                  <div className="w-full text-left">
                    <div className="flex items-center gap-1.5 mb-2 border-b border-stone-100 dark:border-stone-700 pb-2">
                      <Unlock className="w-4 h-4 text-emerald-500" />
                      <span className="text-[11px] font-bold text-emerald-500">Mở khóa thành công!</span>
                    </div>
                    <p className="text-xs text-stone-500 dark:text-stone-400 text-center mb-2 italic">
                      "Gửi tương lai của tôi..."
                    </p>
                    <div className="p-3 bg-white dark:bg-stone-900 rounded-xl border border-stone-100 dark:border-stone-800">
                      <p className="text-xs leading-relaxed text-stone-800 dark:text-stone-100 white-space-pre-line">
                        {foundCapsule.content}
                      </p>
                    </div>
                    <div className="mt-3 flex justify-between items-center text-[9px] text-stone-400">
                      <span>Người viết: {foundCapsule.author}</span>
                      <span>Chôn giấu: {new Date(foundCapsule.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* List of local capsules */}
        {capsules.length > 0 && (
          <div className="bg-white dark:bg-stone-900 border border-primary-100 dark:border-stone-800 rounded-3xl p-6 shadow-xl">
            <h3 className="text-sm font-serif font-bold text-slate-800 dark:text-stone-100 mb-4 flex items-center gap-1.5">
              Hộp Thư Của Bạn ({capsules.length})
            </h3>
            <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
              {capsules.map((cap) => (
                <div
                  key={cap.id}
                  className="p-3 rounded-2xl bg-slate-50 dark:bg-stone-800/40 border border-slate-100 dark:border-stone-700/50 flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-xs font-bold text-primary-500">{cap.code}</span>
                      <span className="text-[9px] text-stone-400">({cap.author})</span>
                    </div>
                    <p className="text-[10px] text-stone-400 mt-1">
                      {isLocked(cap) ? `Khóa: ${getRemainingTimeText(cap.unlocksAt)}` : "Đã mở khóa!"}
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setSearchCode(cap.code);
                      setFoundCapsule(cap);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-[10px] font-bold cursor-pointer transition ${
                      isLocked(cap)
                        ? "bg-slate-200 text-slate-600 dark:bg-stone-800 dark:text-stone-400 hover:bg-slate-300"
                        : "bg-emerald-500 hover:bg-emerald-600 text-white"
                    }`}
                  >
                    Xem
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
