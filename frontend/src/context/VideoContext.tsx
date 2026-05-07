import React, { createContext, useContext, useState, useEffect } from "react";

interface VideoSettingsContextType {
  isMuted: boolean;
  setIsMuted: (muted: boolean) => void;
  toggleMute: () => void;
}

const VideoSettingsContext = createContext<VideoSettingsContextType | undefined>(undefined);

export function VideoSettingsProvider({ children }: { children: React.ReactNode }) {
  const [isMuted, setIsMutedState] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("video_muted");
      return saved !== null ? JSON.parse(saved) : true;
    }
    return true;
  });

  const setIsMuted = (muted: boolean) => {
    setIsMutedState(muted);
    localStorage.setItem("video_muted", JSON.stringify(muted));
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  return (
    <VideoSettingsContext.Provider value={{ isMuted, setIsMuted, toggleMute }}>
      {children}
    </VideoSettingsContext.Provider>
  );
}

export function useVideoSettings() {
  const context = useContext(VideoSettingsContext);
  if (context === undefined) {
    throw new Error("useVideoSettings must be used within a VideoSettingsProvider");
  }
  return context;
}
