import React, { useEffect, useRef, useState } from "react";
import { Music, Volume2, VolumeX, Play, Pause, Sparkles } from "lucide-react";
import { motion } from "motion/react";

declare global {
  interface Window {
    onYouTubeIframeAPIReady?: () => void;
    YT?: any;
  }
}

export default function AudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(50);
  const [isMuted, setIsMuted] = useState(false);
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const playerRef = useRef<any>(null);
  const playerContainerId = "youtube-audio-player";

  useEffect(() => {
    // 1. Load YouTube IFrame API script
    if (!window.YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
    }

    // 2. Define the callback when ready
    const initPlayer = () => {
      playerRef.current = new window.YT.Player(playerContainerId, {
        height: "0",
        width: "0",
        videoId: "UY8cbuRVfUU",
        playerVars: {
          autoplay: 0,
          loop: 1,
          playlist: "UY8cbuRVfUU",
          controls: 0,
          showinfo: 0,
          rel: 0,
        },
        events: {
          onReady: (event: any) => {
            setIsPlayerReady(true);
            event.target.setVolume(volume);
          },
          onStateChange: (event: any) => {
            // YT.PlayerState.PLAYING = 1, PAUSED = 2
            if (event.data === 1) {
              setIsPlaying(true);
            } else {
              setIsPlaying(false);
            }
          },
        },
      });
    };

    if (window.YT && window.YT.Player) {
      initPlayer();
    } else {
      window.onYouTubeIframeAPIReady = initPlayer;
    }

    return () => {
      // Cleanup is usually simple, we just leave the script since it's global
    };
  }, []);

  const handlePlayToggle = () => {
    if (!isPlayerReady || !playerRef.current) return;

    if (isPlaying) {
      playerRef.current.pauseVideo();
      setIsPlaying(false);
    } else {
      playerRef.current.playVideo();
      setIsPlaying(true);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    setVolume(val);
    if (playerRef.current && isPlayerReady) {
      playerRef.current.setVolume(val);
      if (val > 0 && isMuted) {
        playerRef.current.unMute();
        setIsMuted(false);
      }
    }
  };

  const handleMuteToggle = () => {
    if (!isPlayerReady || !playerRef.current) return;

    if (isMuted) {
      playerRef.current.unMute();
      playerRef.current.setVolume(volume);
      setIsMuted(false);
    } else {
      playerRef.current.mute();
      setIsMuted(true);
    }
  };

  return (
    <div className="relative flex items-center gap-3 px-4 py-2 bg-[#FDFCF0] dark:bg-stone-900 border border-[#E9E5D9] dark:border-stone-800 rounded-full shadow-sm">
      {/* Hidden YouTube Container */}
      <div id={playerContainerId} className="hidden" />

      {/* Rotating Vinyl / Moon disk */}
      <motion.div
        className="w-10 h-10 rounded-full bg-white dark:bg-stone-950 flex items-center justify-center border border-[#E9E5D9] dark:border-stone-900 shadow-inner overflow-hidden relative cursor-pointer"
        animate={isPlaying ? { rotate: 360 } : {}}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        onClick={handlePlayToggle}
      >
        <span className="text-xl">🌙</span>
        {isPlaying && (
          <motion.div
            className="absolute inset-0 border-2 border-[#D4A373] border-dashed rounded-full"
            animate={{ rotate: -360 }}
            transition={{ duration: 16, repeat: Infinity, ease: "linear" }}
          />
        )}
      </motion.div>

      {/* Info & Controls */}
      <div className="flex flex-col min-w-28">
        <span className="text-xs font-semibold text-[#4A443F] dark:text-stone-300 truncate w-28 flex items-center gap-1">
          Trăng ơi Trăng à
          {isPlaying && (
            <motion.span
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <Sparkles className="w-3 h-3 text-[#D4A373] fill-[#D4A373]" />
            </motion.span>
          )}
        </span>
        <span className="text-[10px] text-[#A9A294] dark:text-stone-500">
          {isPlaying ? "Đang phát..." : "Đang dừng"}
        </span>
      </div>

      <div className="flex items-center gap-2">
        {/* Play/Pause Button */}
        <button
          onClick={handlePlayToggle}
          disabled={!isPlayerReady}
          className="p-1.5 rounded-full hover:bg-[#E9E5D9] dark:hover:bg-stone-800 text-[#4A443F] dark:text-stone-400 disabled:opacity-50 transition"
          title={isPlaying ? "Dừng" : "Phát"}
          id="btn-play-music"
        >
          {isPlaying ? <Pause className="w-4 h-4 fill-[#4A443F] dark:fill-stone-400" /> : <Play className="w-4 h-4 fill-[#4A443F] dark:fill-stone-400" />}
        </button>

        {/* Mute Button */}
        <button
          onClick={handleMuteToggle}
          disabled={!isPlayerReady}
          className="p-1.5 rounded-full hover:bg-[#E9E5D9] dark:hover:bg-stone-800 text-[#4A443F] dark:text-stone-400 disabled:opacity-50 transition"
          title={isMuted ? "Bật âm" : "Tắt âm"}
          id="btn-mute-music"
        >
          {isMuted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>

        {/* Volume Slider */}
        <input
          type="range"
          min="0"
          max="100"
          value={isMuted ? 0 : volume}
          onChange={handleVolumeChange}
          disabled={!isPlayerReady}
          className="w-16 h-1 bg-[#E9E5D9] dark:bg-stone-700 rounded-lg appearance-none cursor-pointer accent-[#D4A373] disabled:opacity-50"
          id="slider-volume"
        />
      </div>
    </div>
  );
}
