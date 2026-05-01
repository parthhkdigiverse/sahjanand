import { motion, useInView } from "framer-motion";
import { Play, Volume2, VolumeX } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchSettings } from "@/lib/api";

declare global {
  interface Window {
    onYouTubeIframeAPIReady: () => void;
    YT: any;
  }
}

export function BrandShowcase() {
  const { data: settings } = useQuery({
    queryKey: ["settings"],
    queryFn: fetchSettings,
  });

  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const playerRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const videoId = settings?.showcase_video_url ? getYoutubeId(settings.showcase_video_url) : "dQw4w9WgXcQ";
  const isInView = useInView(containerRef, { amount: 0.3 });

  useEffect(() => {
    if (playerRef.current && typeof playerRef.current.playVideo === "function") {
      if (isInView) {
        playerRef.current.playVideo();
      } else {
        playerRef.current.pauseVideo();
      }
    }
  }, [isInView]);

  useEffect(() => {
    if (!window.YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
    }

    const interval = setInterval(() => {
      if (window.YT && window.YT.Player) {
        initPlayer();
        clearInterval(interval);
      }
    }, 100);

    return () => {
      clearInterval(interval);
      if (playerRef.current) {
        playerRef.current.destroy();
      }
    };
  }, [videoId]);

  function initPlayer() {
    if (!videoId) return;
    
    playerRef.current = new window.YT.Player("showcase-player", {
      videoId: videoId,
      playerVars: {
        autoplay: 1,
        controls: 0,
        rel: 0,
        modestbranding: 1,
        loop: 0, // Manual loop below
        mute: 1,
        enablejsapi: 1,
        iv_load_policy: 3,
        fs: 0,
        autohide: 1,
        playsinline: 1,
      },
      events: {
        onReady: (event: any) => {
          event.target.mute();
          if (isInView) {
            event.target.playVideo();
            // Force play again after a short delay to bypass some browser blocks
            setTimeout(() => {
              if (event.target.getPlayerState() !== 1) {
                event.target.playVideo();
              }
            }, 1000);
          }
        },
        onStateChange: (event: any) => {
          if (event.data === window.YT.PlayerState.PLAYING) {
            setIsPlaying(true);
          } else if (event.data === window.YT.PlayerState.ENDED) {
            event.target.playVideo(); // Manual loop
          } else {
            setIsPlaying(false);
          }
        },
      },
    });
  }

  function getYoutubeId(url: string) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  }



  const toggleMute = () => {
    if (!playerRef.current) return;
    if (isMuted) {
      playerRef.current.unMute();
      playerRef.current.setVolume(100);
      playerRef.current.playVideo(); // Force play on unmute
      setIsMuted(false);
    } else {
      playerRef.current.mute();
      setIsMuted(true);
    }
  };

  if (settings?.show_brand_showcase === false) return null;

  return (
    <section className="bg-ivory py-24 md:py-32 overflow-hidden border-b border-gold/10">
      <div className="container-luxe px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="order-2 lg:order-2"
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="h-px w-12 bg-gold/40" />
              <span className="text-[10px] tracking-[0.4em] uppercase text-gold font-bold">
                The Heritage
              </span>
            </div>
            
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-onyx mb-8 leading-[1.1]">
              {settings?.showcase_title || "The Art of Sahajanand"}
            </h2>
            
            <p className="text-onyx/70 text-lg leading-relaxed mb-10 max-w-xl">
              {settings?.showcase_description || "Discover the journey of a thousand diamonds, meticulously crafted into timeless heirlooms. Our atelier in Nadiad preserves centuries-old techniques while embracing modern elegance."}
            </p>
          </motion.div>

          {/* Video Window */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="order-1 lg:order-1 relative"
          >
            {/* Decorative Frames */}
            <div className="absolute -top-4 -right-4 w-24 h-24 border-t border-r border-gold/40" />
            <div className="absolute -bottom-4 -left-4 w-24 h-24 border-b border-l border-gold/40" />
            
            <div 
              className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl bg-onyx group"
              ref={containerRef}
            >
              {/* YouTube Player - Scaled and cropped to hide logo/titles */}
              <div className="absolute inset-0 w-full h-full pointer-events-none">
                <div 
                  id="showcase-player" 
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] scale-110" 
                />
              </div>
              
              {/* Opaque cover that fades out only when video is actually playing */}
              {/* Note: We keep this as a permanent interaction blocker (no pointer-events-none) to hide YouTube icons */}
              <div 
                className={`absolute inset-0 z-10 transition-opacity duration-1000 bg-onyx ${isPlaying ? "opacity-0" : "opacity-100"}`}
              />

              {/* Mute/Unmute Button - Positioned top-right to match testimonials */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleMute();
                }}
                className="absolute top-6 right-6 h-12 w-12 rounded-full bg-onyx/60 backdrop-blur-md border border-white/20 flex items-center justify-center text-ivory hover:bg-gold hover:text-onyx transition-all z-20 shadow-xl"
              >
                {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
              </button>


            </div>

          </motion.div>
          
        </div>
      </div>
    </section>
  );
}
