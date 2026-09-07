import React, { useEffect, useState, useRef } from "react";
import { Character, Letter, SystemNotification } from "./types";
import { collection, onSnapshot, addDoc, deleteDoc, doc, updateDoc, increment, query, orderBy } from "firebase/firestore";
import { db } from "./lib/firebase";
import FloatingIceCreams from "./components/FloatingIceCreams";
import AudioPlayer from "./components/AudioPlayer";
import PasswordGate from "./components/PasswordGate";
import CharacterList from "./components/CharacterList";
import Rankings from "./components/Rankings";
import GachaWheel from "./components/GachaWheel";
import LetterBox from "./components/LetterBox";
import GenreCloud from "./components/GenreCloud";
import AdminPanel from "./components/AdminPanel";
import EmotionTree from "./components/EmotionTree";
import LanternSky from "./components/LanternSky";
import WeatherEffects, { WeatherMode } from "./components/WeatherEffects";
import DailyTarot from "./components/DailyTarot";
import TriviaQuiz from "./components/TriviaQuiz";
import { Award, RotateCw, Mail, FolderOpen, UserCheck, Moon, Sun, Shield, ShieldCheck, Sparkles, Bell, X, Palette, Star, CloudRain, HelpCircle, Hourglass, Smile } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

type ActiveTab = "characters" | "rankings" | "gacha" | "letters" | "genres" | "lanterns" | "tarot" | "quiz" | "admin";

export default function App() {
  const [isUnlocked, setIsUnlocked] = useState(() => {
    if (typeof window !== "undefined") {
      return sessionStorage.getItem("wyn_unlocked") === "true";
    }
    return false;
  });

  const [isAdmin, setIsAdmin] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("wyn_admin") === "true";
    }
    return false;
  });

  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminPasswordInput, setAdminPasswordInput] = useState("");
  const [adminError, setAdminError] = useState("");

  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("wyn_theme") === "dark";
    }
    return false;
  });

  const [moodTheme, setMoodTheme] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("wyn_mood") || "sweet";
    }
    return "sweet";
  });

  const [weather, setWeather] = useState<WeatherMode>(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("wyn_weather") as WeatherMode) || "none";
    }
    return "none";
  });

  // Main application data
  const [characters, setCharacters] = useState<Character[]>([]);
  const [letters, setLetters] = useState<Letter[]>([]);
  const [notifications, setNotifications] = useState<SystemNotification[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<ActiveTab>("characters");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Active toast notification
  const [toast, setToast] = useState<{ id: string; message: string } | null>(null);

  // Points system
  const [points, setPoints] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("wyn_points");
      return saved !== null ? parseInt(saved, 10) : 500;
    }
    return 500;
  });

  useEffect(() => {
    localStorage.setItem("wyn_points", points.toString());
  }, [points]);

  // Keep track of characters we already know about to avoid double-toasting
  const knownCharIds = useRef<Set<string>>(new Set());
  const isFirstLoad = useRef(true);

  // Fetch full data from Express API
  const fetchData = async () => {
    // Legacy fetch logic removed, now using Firebase
  };

  // Load favorites & initial theme on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Favorites
      const storedFavs = localStorage.getItem("wyn_favorites");
      if (storedFavs) {
        try {
          setFavorites(JSON.parse(storedFavs));
        } catch {
          setFavorites([]);
        }
      }
    }
  }, []);

  // Sync theme
  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add("dark");
      localStorage.setItem("wyn_theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("wyn_theme", "light");
    }
  }, [darkMode]);

  // Sync mood theme
  useEffect(() => {
    const root = window.document.documentElement;
    root.setAttribute("data-mood", moodTheme);
    localStorage.setItem("wyn_mood", moodTheme);
  }, [moodTheme]);

  // Listen to custom point and water events
  useEffect(() => {
    const handleAddPoints = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail && typeof customEvent.detail.amount === "number") {
        setPoints(prev => prev + customEvent.detail.amount);
      }
    };
    window.addEventListener("add-points", handleAddPoints);
    return () => window.removeEventListener("add-points", handleAddPoints);
  }, []);

  // Fetch full data from Firebase
  useEffect(() => {
    if (!isUnlocked) return;

    // Listen to characters
    const qChars = query(collection(db, "characters"), orderBy("createdAt", "desc"));
    const unsubChars = onSnapshot(qChars, (snapshot) => {
      const charsData: Character[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        charsData.push({
          id: doc.id,
          name: data.name,
          categories: data.categories || [],
          backstory: data.backstory || "",
          openingMessage: data.openingMessage || "",
          chatLink: data.chatLink || "",
          heartsCount: data.heartsCount || 0,
          createdAt: data.createdAt || new Date().toISOString(),
        });
      });
      setCharacters(charsData);
      
      // Detect new characters for notifications
      if (!isFirstLoad.current) {
        const newChars = charsData.filter((c) => !knownCharIds.current.has(c.id));
        if (newChars.length > 0) {
          // Trigger a beautiful notification toast for the most recent one
          const latest = newChars[0];
          setToast({
            id: latest.id,
            message: `🎉 Nhân vật mới "${latest.name}" vừa gia nhập tiệm nhỏ! Hãy khám phá ngay nhé.`
          });
          setTimeout(() => setToast(null), 6000);
        }
      }
      
      charsData.forEach((c) => knownCharIds.current.add(c.id));
      isFirstLoad.current = false;
    }, (error) => console.error("Error fetching characters:", error));

    // Listen to letters
    const qLetters = query(collection(db, "letters"), orderBy("createdAt", "desc"));
    const unsubLetters = onSnapshot(qLetters, (snapshot) => {
      const lettersData: Letter[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        lettersData.push({
          id: doc.id,
          author: data.author || "Người ẩn danh",
          content: data.content,
          theme: data.theme || "pink",
          createdAt: data.createdAt || new Date().toISOString(),
        });
      });
      setLetters(lettersData);
    }, (error) => console.error("Error fetching letters:", error));

    return () => {
      unsubChars();
      unsubLetters();
    };
  }, [isUnlocked]);

  const handleUnlock = () => {
    setIsUnlocked(true);
    sessionStorage.setItem("wyn_unlocked", "true");
  };

  const handleAdminToggle = () => {
    if (isAdmin) {
      // Disconnect admin
      setIsAdmin(false);
      localStorage.removeItem("wyn_admin");
      if (activeTab === "admin") {
        setActiveTab("characters");
      }
    } else {
      setShowAdminLogin(true);
      setAdminPasswordInput("");
      setAdminError("");
    }
  };

  const handleAdminLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPasswordInput === "5512") {
      setIsAdmin(true);
      localStorage.setItem("wyn_admin", "true");
      setShowAdminLogin(false);
      setActiveTab("admin"); // Auto redirect to Admin view
    } else {
      setAdminError("Mật khẩu admin chưa chính xác!");
    }
  };

  const handleMoodToggle = () => {
    const moods = ["sweet", "dark-love", "healing"];
    const currentIndex = moods.indexOf(moodTheme);
    const nextMood = moods[(currentIndex + 1) % moods.length];
    setMoodTheme(nextMood);
    
    let moodName = "";
    if (nextMood === "sweet") moodName = "Ngọt ngào (Hồng)";
    if (nextMood === "dark-love") moodName = "Hắc ám (Đỏ thẫm)";
    if (nextMood === "healing") moodName = "Chữa lành (Xanh ngọc)";
    
    setToast({ id: "mood", message: `Đã đổi giao diện sang: ${moodName}` });
    setTimeout(() => setToast(null), 3000);
  };

  const handleWeatherToggle = () => {
    const weathers: WeatherMode[] = ["none", "snow", "rain", "leaves"];
    const currentIndex = weathers.indexOf(weather);
    const nextWeather = weathers[(currentIndex + 1) % weathers.length];
    setWeather(nextWeather);
    localStorage.setItem("wyn_weather", nextWeather);

    let weatherName = "Trời quang";
    if (nextWeather === "snow") weatherName = "Tuyết rơi ❄️";
    if (nextWeather === "rain") weatherName = "Mưa bay 🌧️";
    if (nextWeather === "leaves") weatherName = "Lá rụng 🍂";

    setToast({ id: "weather", message: `Đã đổi thời tiết sang: ${weatherName}` });
    setTimeout(() => setToast(null), 3000);
  };

  // Like character handler
  const handleLikeCharacter = async (id: string) => {
    try {
      const charRef = doc(db, "characters", id);
      await updateDoc(charRef, {
        heartsCount: increment(1)
      });
      // Auto save to favorites if not already there
      if (!favorites.includes(id)) {
        const newFavs = [...favorites, id];
        setFavorites(newFavs);
        localStorage.setItem("wyn_favorites", JSON.stringify(newFavs));
      }
      
      // Trigger emotion tree growth
      window.dispatchEvent(new CustomEvent("water-tree"));
    } catch (err) {
      console.error("Error liking character:", err);
    }
  };

  // Toggle favorite manually (heart outline click)
  const handleToggleFavorite = (id: string) => {
    let newFavs;
    if (favorites.includes(id)) {
      newFavs = favorites.filter((favId) => favId !== id);
    } else {
      newFavs = [...favorites, id];
    }
    setFavorites(newFavs);
    localStorage.setItem("wyn_favorites", JSON.stringify(newFavs));
  };

  // Send new letter
  const handleSendLetter = async (author: string, content: string, theme: string) => {
    try {
      await addDoc(collection(db, "letters"), {
        author: author || "Người ẩn danh",
        content,
        theme,
        createdAt: new Date().toISOString()
      });
      
      // Trigger emotion tree growth
      window.dispatchEvent(new CustomEvent("water-tree"));
    } catch (err) {
      console.error("Error sending letter:", err);
    }
  };

  // Create character (Admin)
  const handleCreateCharacter = async (charData: Omit<Character, "id" | "heartsCount" | "createdAt">) => {
    try {
      await addDoc(collection(db, "characters"), {
        ...charData,
        heartsCount: 0,
        createdAt: new Date().toISOString()
      });
    } catch (err) {
      console.error("Error creating character:", err);
    }
  };

  // Delete character (Admin)
  const handleDeleteCharacter = async (id: string) => {
    try {
      await deleteDoc(doc(db, "characters", id));
    } catch (err) {
      console.error("Error deleting character:", err);
    }
  };

  const handleResetCharacterHearts = async (id: string) => {
    try {
      await updateDoc(doc(db, "characters", id), { heartsCount: 0 });
    } catch (err) {
      console.error("Error resetting character hearts:", err);
    }
  };

  const handleResetAllCharacterHearts = async () => {
    try {
      const promises = characters.map(char => 
        updateDoc(doc(db, "characters", char.id), { heartsCount: 0 })
      );
      await Promise.all(promises);
      setToast({ id: "reset-all", message: "Đã reset toàn bộ độ thân mật về 0." });
      setTimeout(() => setToast(null), 4000);
    } catch (err) {
      console.error("Error resetting all character hearts:", err);
    }
  };

  const handleReplyLetter = async (id: string, reply: string) => {
    try {
      await updateDoc(doc(db, "letters", id), { adminReply: reply });
    } catch (err) {
      console.error("Error replying to letter:", err);
    }
  };

  const handleGiftCharacter = async (id: string, cost: number, hearts: number, giftName: string) => {
    if (points < cost) {
      setToast({ id: "no-points", message: `Bạn không đủ điểm! Cần ${cost} điểm thưởng để tặng ${giftName}.` });
      setTimeout(() => setToast(null), 4000);
      return;
    }

    try {
      setPoints((prev) => prev - cost);
      const charRef = doc(db, "characters", id);
      await updateDoc(charRef, {
        heartsCount: increment(hearts)
      });
      setToast({ id: "gift-success", message: `Tặng ${giftName} thành công! Độ thân mật tăng thêm ${hearts} 💖` });
      setTimeout(() => setToast(null), 4000);
    } catch (err) {
      console.error("Error gifting character:", err);
    }
  };

  const handleClaimDailyPoints = () => {
    setPoints(prev => prev + 100);
    setToast({ id: "daily-points", message: `Nhận thành công 100 điểm thưởng!` });
    setTimeout(() => setToast(null), 4000);
  };

  // Unlocked screen is gated
  if (!isUnlocked) {
    return <PasswordGate onUnlock={handleUnlock} />;
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-100 via-primary-100 to-sky-100 dark:from-blue-950 dark:via-primary-950 dark:to-sky-950 transition-colors duration-300 relative flex flex-col text-stone-800 dark:text-stone-200">
      <WeatherEffects mode={weather} />
      {/* Floating Popsicles Drift Background */}
      <FloatingIceCreams />

      {/* Floating System toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, x: 50, y: -20 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, x: 50, y: -20 }}
            className="fixed top-20 right-6 z-50 max-w-sm p-4 bg-yellow-400 dark:bg-yellow-500 text-stone-950 rounded-2xl shadow-xl border border-yellow-300/50 flex items-start gap-3"
          >
            <div className="text-2xl mt-0.5">🔔</div>
            <div className="flex-1">
              <p className="text-xs font-bold uppercase tracking-wider text-stone-900/60 mb-0.5">
                Thông Báo Mới
              </p>
              <p className="text-sm font-semibold">{toast.message}</p>
            </div>
            <button
              onClick={() => setToast(null)}
              className="p-1 hover:bg-stone-950/10 rounded-lg transition"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header section */}
      <header className="relative z-10 w-full bg-white/80 dark:bg-stone-900/80 backdrop-blur-sm border-b border-primary-100 dark:border-stone-800 py-5 px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🍦</span>
            <div>
              <h1 className="text-3xl font-serif italic text-primary-400 tracking-tight flex items-center gap-1.5">
                Tiệm Nhỏ Nhà Wyn
                <Sparkles className="w-4 h-4 text-primary-400 fill-primary-300 animate-pulse" />
              </h1>
              <p className="text-xs uppercase tracking-widest text-sky-450 mt-1">
                Nơi những tâm hồn đồng điệu tìm thấy nhau
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Points display */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 rounded-full cursor-pointer hover:bg-amber-100 transition" onClick={handleClaimDailyPoints} title="Nhận thêm điểm">
              <span className="text-sm">💎</span>
              <span className="text-xs font-bold text-amber-700 dark:text-amber-500">{points} điểm</span>
            </div>

            {/* YouTube Audio Player */}
            <AudioPlayer />

            {/* Mood Theme Toggle */}
            <button
              onClick={handleMoodToggle}
              className="p-2.5 rounded-full bg-slate-50 hover:bg-primary-50 dark:bg-stone-800 dark:hover:bg-stone-700 text-primary-500 border border-slate-200 dark:border-stone-700 transition cursor-pointer flex items-center justify-center"
              title="Đổi giao diện cảm xúc"
            >
              <Palette className="w-4 h-4" />
            </button>

            {/* Weather Mode Toggle */}
            <button
              onClick={handleWeatherToggle}
              className={`p-2.5 rounded-full border transition cursor-pointer flex items-center justify-center ${
                weather !== "none" 
                  ? "bg-sky-100 dark:bg-sky-900/40 text-sky-600 dark:text-sky-400 border-sky-200 dark:border-sky-800"
                  : "bg-slate-50 hover:bg-primary-50 dark:bg-stone-800 dark:hover:bg-stone-700 text-slate-500 dark:text-stone-400 border-slate-200 dark:border-stone-700"
              }`}
              title="Đổi thời tiết (Tuyết/Mưa/Lá rơi)"
            >
              <CloudRain className="w-4 h-4" />
            </button>

            {/* Dark/Light mode toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2.5 rounded-full bg-slate-50 hover:bg-primary-50 dark:bg-stone-800 dark:hover:bg-stone-700 text-slate-700 dark:text-stone-300 border border-slate-200 dark:border-stone-700 transition cursor-pointer"
              title={darkMode ? "Bật chế độ sáng" : "Bật chế độ tối"}
              id="btn-toggle-theme"
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Admin Toggle Switch */}
            <button
              onClick={handleAdminToggle}
              className={`px-4 py-2 text-xs rounded-full font-bold border transition flex items-center gap-1.5 cursor-pointer ${
                isAdmin
                  ? "bg-primary-100 border-primary-200 text-primary-700 dark:bg-primary-950/40 dark:border-primary-900/60 dark:text-primary-400"
                  : "bg-sky-50 border-sky-100 text-sky-700 hover:bg-sky-100 dark:bg-stone-800 dark:border-stone-700 dark:text-stone-300 dark:hover:bg-stone-700"
              }`}
              id="btn-toggle-admin"
            >
              {isAdmin ? <ShieldCheck className="w-4 h-4 text-primary-500" /> : <Shield className="w-4 h-4" />}
              {isAdmin ? "Admin: Bật" : "Quản Trị"}
            </button>
          </div>
        </div>
      </header>

      {/* Main Dashboard Panel */}
      <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-4 py-8">
        {/* Bento Grid layout of the 5 Core Sections */}
        <section className="mb-12">
          <div className="text-center sm:text-left mb-6">
            <h2 className="text-lg font-bold font-serif text-slate-800 dark:text-stone-200 flex items-center justify-center sm:justify-start gap-1.5">
              <span>Khám Phá Các Góc Tiệm</span>
              <span className="text-xs font-normal text-slate-400 font-sans tracking-wide">
                (Nhấn chọn để mở từng mục)
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {/* Item 1: BXH (Rankings) */}
            <motion.div
              whileHover={{ y: -4, scale: 1.02 }}
              onClick={() => setActiveTab("rankings")}
              className={`p-6 rounded-3xl border cursor-pointer flex flex-col justify-between transition-all relative overflow-hidden ${
                activeTab === "rankings"
                  ? "bg-primary-400 border-primary-400 text-white shadow-md"
                  : "bg-primary-50/40 dark:bg-stone-900 border-primary-100/60 dark:border-stone-800 text-primary-600 dark:text-primary-350 hover:border-primary-300"
              }`}
            >
              <div className="text-3xl mb-4">🏆</div>
              <div>
                <h3 className="font-bold text-sm font-serif">Bảng Xếp Hạng</h3>
                <p className="text-[10px] opacity-75 mt-0.5 font-medium">Độ thân mật cao nhất</p>
              </div>
              <div className="absolute -right-4 -bottom-4 text-7xl opacity-5 font-serif italic pointer-events-none select-none">01</div>
            </motion.div>

            {/* Item 2: QUAY GACHA (Gacha Spin) */}
            <motion.div
              whileHover={{ y: -4, scale: 1.02 }}
              onClick={() => setActiveTab("gacha")}
              className={`p-6 rounded-3xl border cursor-pointer flex flex-col justify-between transition-all relative overflow-hidden ${
                activeTab === "gacha"
                  ? "bg-sky-400 border-sky-400 text-white shadow-md"
                  : "bg-sky-50/40 dark:bg-stone-900 border-sky-100/60 dark:border-stone-800 text-sky-600 dark:text-sky-300 hover:border-sky-300"
              }`}
            >
              <div className="text-3xl mb-4">✨</div>
              <div>
                <h3 className="font-bold text-sm font-serif">Quay Gacha</h3>
                <p className="text-[10px] opacity-75 mt-0.5 font-medium">Tìm nhân duyên</p>
              </div>
              <div className="absolute -right-2 -bottom-2 text-6xl opacity-10 pointer-events-none select-none">🎡</div>
            </motion.div>

            {/* Item 3: NƠI GỬI THƯ (Letters Box) */}
            <motion.div
              whileHover={{ y: -4, scale: 1.02 }}
              onClick={() => setActiveTab("letters")}
              className={`p-6 rounded-3xl border cursor-pointer flex flex-col justify-between transition-all relative overflow-hidden ${
                activeTab === "letters"
                  ? "bg-primary-500 border-primary-500 text-white shadow-md"
                  : "bg-primary-100/30 dark:bg-stone-900 border-primary-200/50 dark:border-stone-800 text-primary-700 dark:text-primary-300 hover:border-primary-450"
              }`}
            >
              <div className="text-3xl mb-4">✉️</div>
              <div>
                <h3 className="font-bold text-sm font-serif">Nơi Gửi Thư</h3>
                <p className="text-[10px] opacity-75 mt-0.5 font-medium">Thảo luận đẹp mắt</p>
              </div>
              <div className="absolute -right-2 -bottom-2 text-6xl opacity-10 pointer-events-none select-none">📬</div>
            </motion.div>

            {/* Item 4: THỂ LOẠI (Genres Cloud) */}
            <motion.div
              whileHover={{ y: -4, scale: 1.02 }}
              onClick={() => setActiveTab("genres")}
              className={`p-6 rounded-3xl border cursor-pointer flex flex-col justify-between transition-all relative overflow-hidden ${
                activeTab === "genres"
                  ? "bg-sky-500 border-sky-500 text-white shadow-md"
                  : "bg-sky-100/30 dark:bg-stone-900 border-sky-200/50 dark:border-stone-800 text-sky-700 dark:text-sky-300 hover:border-sky-450"
              }`}
            >
              <div className="text-3xl mb-4">🏷️</div>
              <div>
                <h3 className="font-bold text-sm font-serif">Thể Loại</h3>
                <p className="text-[10px] opacity-75 mt-0.5 font-medium">Phân loại nhãn</p>
              </div>
              <div className="absolute -right-2 -bottom-2 text-6xl opacity-10 pointer-events-none select-none">🏷️</div>
            </motion.div>

            {/* Item 5: THẺ NHÂN VẬT (Character Cards) */}
            <motion.div
              whileHover={{ y: -4, scale: 1.02 }}
              onClick={() => setActiveTab("characters")}
              className={`p-6 rounded-3xl border cursor-pointer flex flex-col justify-between transition-all relative overflow-hidden ${
                activeTab === "characters"
                  ? "bg-slate-700 dark:bg-stone-300 border-slate-700 dark:border-stone-350 text-white dark:text-stone-950 shadow-md"
                  : "bg-slate-50 dark:bg-stone-900 border-slate-200 dark:border-stone-800 text-slate-600 dark:text-stone-300 hover:border-primary-300"
              }`}
            >
              <div className="text-3xl mb-4">👤</div>
              <div>
                <h3 className="font-bold text-sm font-serif">Thẻ Nhân Vật</h3>
                <p className="text-[10px] opacity-75 mt-0.5 font-medium">Hồ sơ & Cổng chat</p>
              </div>
              <div className="absolute -right-4 -top-4 text-7xl opacity-5 pointer-events-none select-none">🎴</div>
            </motion.div>

            {/* Item 6: ĐÈN LỒNG (Lanterns) */}
            <motion.div
              whileHover={{ y: -4, scale: 1.02 }}
              onClick={() => setActiveTab("lanterns")}
              className={`p-6 rounded-3xl border cursor-pointer flex flex-col justify-between transition-all relative overflow-hidden ${
                activeTab === "lanterns"
                  ? "bg-amber-600 dark:bg-amber-500 border-amber-600 text-white shadow-md"
                  : "bg-amber-50 dark:bg-stone-900 border-amber-200/60 dark:border-stone-800 text-amber-700 dark:text-amber-300 hover:border-amber-400"
              }`}
            >
              <div className="text-3xl mb-4">🏮</div>
              <div>
                <h3 className="font-bold text-sm font-serif">Đèn Lồng</h3>
                <p className="text-[10px] opacity-75 mt-0.5 font-medium">Ước nguyện</p>
              </div>
              <div className="absolute -right-2 -bottom-2 text-6xl opacity-10 pointer-events-none select-none">🏮</div>
            </motion.div>

            {/* Item 7: BÓI BÀI (Tarot) */}
            <motion.div
              whileHover={{ y: -4, scale: 1.02 }}
              onClick={() => setActiveTab("tarot")}
              className={`p-6 rounded-3xl border cursor-pointer flex flex-col justify-between transition-all relative overflow-hidden ${
                activeTab === "tarot"
                  ? "bg-indigo-600 dark:bg-indigo-500 border-indigo-600 text-white shadow-md"
                  : "bg-indigo-50 dark:bg-stone-900 border-indigo-200/60 dark:border-stone-800 text-indigo-700 dark:text-indigo-300 hover:border-indigo-400"
              }`}
            >
              <div className="text-3xl mb-4">🔮</div>
              <div>
                <h3 className="font-bold text-sm font-serif">Bói Bài</h3>
                <p className="text-[10px] opacity-75 mt-0.5 font-medium">Thông điệp ngày</p>
              </div>
              <div className="absolute -right-2 -bottom-2 text-6xl opacity-10 pointer-events-none select-none">🔮</div>
            </motion.div>

            {/* Item 8: ĐỐ VUI (Quiz) */}
            <motion.div
              whileHover={{ y: -4, scale: 1.02 }}
              onClick={() => setActiveTab("quiz")}
              className={`p-6 rounded-3xl border cursor-pointer flex flex-col justify-between transition-all relative overflow-hidden ${
                activeTab === "quiz"
                  ? "bg-rose-600 dark:bg-rose-500 border-rose-600 text-white shadow-md"
                  : "bg-rose-50 dark:bg-stone-900 border-rose-200/60 dark:border-stone-800 text-rose-700 dark:text-rose-300 hover:border-rose-400"
              }`}
            >
              <div className="text-3xl mb-4">🧩</div>
              <div>
                <h3 className="font-bold text-sm font-serif">Đố Vui</h3>
                <p className="text-[10px] opacity-75 mt-0.5 font-medium">Nhận điểm thưởng</p>
              </div>
              <div className="absolute -right-2 -bottom-2 text-6xl opacity-10 pointer-events-none select-none">🧩</div>
            </motion.div>
          </div>
        </section>

        {/* Unlocked tab content space */}
        <section className="bg-white/40 dark:bg-stone-900/10 rounded-3xl p-2 sm:p-6 border border-[#E9E5D9] dark:border-[#524B44] shadow-xs">
          <AnimatePresence mode="wait">
            {activeTab === "tarot" && (
              <motion.div
                key="tab-tarot"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
              >
                <div className="mb-4 border-b border-stone-100 dark:border-stone-800 pb-3 px-1">
                  <h3 className="text-xl font-bold font-serif text-stone-800 dark:text-stone-100">
                    Bói Bài Chiêm Tinh Hằng Ngày
                  </h3>
                  <p className="text-xs text-stone-400 dark:text-stone-500">
                    Rút thẻ bài may mắn nhận thông điệp chữa lành từ các nhân vật và nhận thêm đá quý
                  </p>
                </div>
                <DailyTarot />
              </motion.div>
            )}

            {activeTab === "quiz" && (
              <motion.div
                key="tab-quiz"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
              >
                <div className="mb-4 border-b border-stone-100 dark:border-stone-800 pb-3 px-1">
                  <h3 className="text-xl font-bold font-serif text-stone-800 dark:text-stone-100">
                    Thử Thách Đố Vui
                  </h3>
                  <p className="text-xs text-stone-400 dark:text-stone-500">
                    Trải nghiệm đố vui kiến thức siêu đáng yêu về tiệm nhỏ để nhận điểm thưởng đá quý
                  </p>
                </div>
                <TriviaQuiz />
              </motion.div>
            )}

            {activeTab === "lanterns" && (
              <motion.div
                key="tab-lanterns"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
              >
                <div className="mb-4 border-b border-stone-100 dark:border-stone-800 pb-3 px-1">
                  <h3 className="text-xl font-bold font-serif text-stone-800 dark:text-stone-100">
                    Bầu Trời Đèn Lồng
                  </h3>
                  <p className="text-xs text-stone-400 dark:text-stone-500">
                    Nơi gửi gắm những tâm sự và điều ước của độc giả Tiệm Nhỏ Nhà Wyn
                  </p>
                </div>
                <LanternSky />
              </motion.div>
            )}

            {activeTab === "characters" && (
              <motion.div
                key="tab-chars"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
              >
                <div className="flex justify-between items-center mb-4 border-b border-stone-100 dark:border-stone-800 pb-3 px-1">
                  <div>
                    <h3 className="text-xl font-bold font-serif text-stone-800 dark:text-stone-100">
                      Hồ Sơ Thẻ Nhân Vật
                    </h3>
                    <p className="text-xs text-stone-400 dark:text-stone-500">
                      Xem thông tin chi tiết và truy cập cổng chat nhân vật
                    </p>
                  </div>
                  {isAdmin && (
                    <button
                      onClick={() => setActiveTab("admin")}
                      className="px-3 py-1 bg-amber-400 hover:bg-amber-500 text-stone-950 font-bold rounded-lg text-xs flex items-center gap-1 cursor-pointer transition"
                    >
                      <Shield className="w-3.5 h-3.5" />
                      + Thêm Nhân Vật
                    </button>
                  )}
                </div>

                <CharacterList
                  characters={characters}
                  favorites={favorites}
                  onToggleFavorite={handleToggleFavorite}
                  onLikeCharacter={handleLikeCharacter}
                  onGiftCharacter={handleGiftCharacter}
                  selectedCategory={selectedCategory}
                  onSelectCategory={setSelectedCategory}
                  points={points}
                />
              </motion.div>
            )}

            {activeTab === "rankings" && (
              <motion.div
                key="tab-rank"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
              >
                <Rankings characters={characters} onLikeCharacter={handleLikeCharacter} />
              </motion.div>
            )}

            {activeTab === "gacha" && (
              <motion.div
                key="tab-gacha"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
              >
                <GachaWheel characters={characters} onLikeCharacter={handleLikeCharacter} />
              </motion.div>
            )}

            {activeTab === "letters" && (
              <motion.div
                key="tab-letters"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
              >
                <LetterBox letters={letters} onSendLetter={handleSendLetter} />
              </motion.div>
            )}

            {activeTab === "genres" && (
              <motion.div
                key="tab-genres"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
              >
                <GenreCloud
                  characters={characters}
                  selectedCategory={selectedCategory}
                  onSelectCategory={setSelectedCategory}
                  onNavigateToTab={setActiveTab}
                />
              </motion.div>
            )}

            {activeTab === "admin" && isAdmin && (
              <motion.div
                key="tab-admin"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
              >
                <AdminPanel
                  characters={characters}
                  letters={letters}
                  onCreateCharacter={handleCreateCharacter}
                  onDeleteCharacter={handleDeleteCharacter}
                  onReplyLetter={handleReplyLetter}
                  onResetCharacterHearts={handleResetCharacterHearts}
                  onResetAllCharacterHearts={handleResetAllCharacterHearts}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </main>

      {/* Footer view */}
      <footer className="relative z-10 bg-white/50 dark:bg-stone-950/40 border-t border-stone-200/50 dark:border-stone-800/50 py-6 px-4 mt-12 text-center text-xs text-stone-400 dark:text-stone-500">
        <p className="font-semibold mb-1">© 2026 Tiệm Nhỏ Nhà Wyn. All Rights Reserved.</p>
        <p className="italic">Nền trắng tinh tế • Que kem bay bổng • Nhạc Trăng ơi Trăng à</p>
      </footer>

      {/* Admin Login Modal */}
      <AnimatePresence>
        {showAdminLogin && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-sm bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl shadow-2xl p-6 relative"
            >
              <button
                onClick={() => setShowAdminLogin(false)}
                className="absolute top-4 right-4 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 transition"
                id="btn-close-admin-login"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex justify-center mb-3">
                <div className="w-12 h-12 rounded-full bg-amber-50 dark:bg-amber-950 flex items-center justify-center border border-amber-200 dark:border-amber-900">
                  <Shield className="w-5 h-5 text-amber-500" />
                </div>
              </div>

              <h3 className="text-lg font-bold text-center text-slate-800 dark:text-stone-100 font-serif mb-1">
                Chế độ Quản trị viên
              </h3>
              <p className="text-xs text-center text-slate-400 dark:text-stone-500 mb-5">
                Nhập mật khẩu quyền lực để kích hoạt bảng điều khiển
              </p>

              <form onSubmit={handleAdminLoginSubmit} className="space-y-4">
                <input
                  type="password"
                  placeholder="Nhập mật khẩu quản trị..."
                  value={adminPasswordInput}
                  onChange={(e) => setAdminPasswordInput(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-stone-800/40 border-2 border-primary-100 dark:border-stone-700 focus:border-primary-300 dark:focus:border-primary-500 rounded-2xl text-center font-mono focus:outline-none transition text-slate-800 dark:text-white tracking-widest text-lg shadow-inner"
                  autoFocus
                  id="admin-password-input"
                />

                {adminError && (
                  <p className="text-red-500 text-[11px] text-center font-medium">
                    {adminError}
                  </p>
                )}

                <button
                  type="submit"
                  className="w-full py-3 bg-primary-400 hover:bg-primary-500 text-white font-bold rounded-2xl text-sm shadow-md transition cursor-pointer"
                  id="btn-admin-submit"
                >
                  Xác Nhận Quyền Admin
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <EmotionTree />
    </div>
  );
}
