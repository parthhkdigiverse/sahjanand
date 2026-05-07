import { useEffect, useRef, useState, useCallback } from "react";

declare global {
  interface Window {
    onYouTubeIframeAPIReady: () => void;
    YT: any;
  }
}

interface YouTubePlayerProps {
  videoId: string;
  isMuted?: boolean;
  isPlaying?: boolean;
  onReady?: (player: any) => void;
  onStateChange?: (event: any) => void;
  className?: string;
  style?: React.CSSProperties;
}

export function YouTubePlayer({
  videoId,
  isMuted = true,
  isPlaying = true,
  onReady,
  onStateChange,
  className,
  style,
}: YouTubePlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<any>(null);
  const [isApiReady, setIsApiReady] = useState(false);
  const [isPlayerReady, setIsPlayerReady] = useState(false);

  // Use refs to keep event handlers stable and avoid re-initializing the player
  const propsRef = useRef({ isMuted, isPlaying, onReady, onStateChange });
  useEffect(() => {
    propsRef.current = { isMuted, isPlaying, onReady, onStateChange };
  }, [isMuted, isPlaying, onReady, onStateChange]);

  // Load YouTube API
  useEffect(() => {
    if (window.YT && window.YT.Player) {
      setIsApiReady(true);
      return;
    }

    const scriptId = "youtube-api-script";
    if (!document.getElementById(scriptId)) {
      const tag = document.createElement("script");
      tag.id = scriptId;
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

      const previousOnReady = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        if (previousOnReady) previousOnReady();
        setIsApiReady(true);
      };
    } else {
      const interval = setInterval(() => {
        if (window.YT && window.YT.Player) {
          setIsApiReady(true);
          clearInterval(interval);
        }
      }, 100);
      return () => clearInterval(interval);
    }
  }, []);

  // Initialize Player
  useEffect(() => {
    if (!isApiReady || !containerRef.current || playerRef.current) return;

    playerRef.current = new window.YT.Player(containerRef.current, {
      videoId: videoId,
      playerVars: {
        autoplay: propsRef.current.isPlaying ? 1 : 0,
        controls: 0,
        showinfo: 0,
        modestbranding: 1,
        rel: 0,
        loop: 1,
        playlist: videoId,
        fs: 0,
        iv_load_policy: 3,
        disablekb: 1,
        enablejsapi: 1,
        origin: window.location.origin,
        playsinline: 1,
      },
      events: {
        onReady: (event: any) => {
          setIsPlayerReady(true);
          if (propsRef.current.isMuted) event.target.mute();
          else {
            event.target.unMute();
            event.target.setVolume(100);
          }
          if (propsRef.current.isPlaying) event.target.playVideo();
          propsRef.current.onReady?.(event.target);
        },
        onStateChange: (event: any) => {
          propsRef.current.onStateChange?.(event);
        },
      },
    });

    return () => {
      if (playerRef.current) {
        // Only destroy if the component is actually unmounting or if we need a full refresh
        // For videoId changes, we use loadVideoById instead
      }
    };
  }, [isApiReady, videoId]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
        playerRef.current = null;
      }
    };
  }, []);

  // Sync mute state
  useEffect(() => {
    if (isPlayerReady && playerRef.current && typeof playerRef.current.mute === "function") {
      if (isMuted) {
        playerRef.current.mute();
      } else {
        playerRef.current.unMute();
        playerRef.current.setVolume(100);
      }
    }
  }, [isMuted, isPlayerReady]);

  // Sync play/pause state
  useEffect(() => {
    if (isPlayerReady && playerRef.current && typeof playerRef.current.playVideo === "function") {
      if (isPlaying) {
        playerRef.current.playVideo();
      } else {
        playerRef.current.pauseVideo();
      }
    }
  }, [isPlaying, isPlayerReady]);

  // Handle videoId change without re-creating the player
  useEffect(() => {
    if (isPlayerReady && playerRef.current && typeof playerRef.current.loadVideoById === "function") {
      playerRef.current.loadVideoById({
        videoId: videoId,
        suggestedQuality: "default"
      });
    }
  }, [videoId, isPlayerReady]);

  return (
    <div className={className} style={{ ...style, position: "relative", overflow: "hidden" }}>
      <div ref={containerRef} style={{ width: "100%", height: "100%" }} />
    </div>
  );
}
