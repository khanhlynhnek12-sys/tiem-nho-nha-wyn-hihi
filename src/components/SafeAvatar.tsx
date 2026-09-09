import React, { useState } from "react";

interface SafeAvatarProps {
  imageUrl?: string;
  name: string;
  sizeClass?: string; // e.g. "w-12 h-12 text-2xl" or "w-8 h-8 text-lg"
  fallbackEmoji?: string;
  roundedClass?: string; // e.g. "rounded-2xl" or "rounded-lg" or "rounded-full"
}

export function SafeAvatar({
  imageUrl,
  name,
  sizeClass = "w-12 h-12 text-2xl",
  fallbackEmoji = "👤",
  roundedClass = "rounded-2xl"
}: SafeAvatarProps) {
  const [hasError, setHasError] = useState(false);

  // If there is no imageUrl, or an error loading it occurred, show fallback emoji
  if (!imageUrl || hasError) {
    return (
      <div 
        className={`${sizeClass} ${roundedClass} bg-sky-50 dark:bg-stone-800/60 flex items-center justify-center border border-sky-100 dark:border-stone-700/50 text-sky-500 shrink-0 shadow-xs`}
        title={name}
      >
        {fallbackEmoji}
      </div>
    );
  }

  return (
    <div className={`${sizeClass} ${roundedClass} flex items-center justify-center border border-sky-100 dark:border-stone-700/50 overflow-hidden shrink-0 shadow-xs bg-slate-50 dark:bg-stone-900`}>
      <img
        src={imageUrl}
        alt={name}
        referrerPolicy="no-referrer"
        onError={() => {
          console.warn(`Failed to load character image for ${name}: ${imageUrl}`);
          setHasError(true);
        }}
        className="w-full h-full object-cover"
      />
    </div>
  );
}
