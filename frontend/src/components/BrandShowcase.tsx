import { motion, useInView } from "framer-motion";
import { Volume2, VolumeX } from "lucide-react";
import { useState, useRef, useEffect, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchSettings } from "@/lib/api";

export function BrandShowcase() {
  const { data: settings } = useQuery({
    queryKey: ["settings"],
    queryFn: fetchSettings,
    initialData: () => {
      if (typeof window === "undefined") return undefined;
      const cached = localStorage.getItem("cached_settings");
      try {
        return cached ? JSON.parse(cached) : undefined;
      } catch (e) {
        return undefined;
      }
    },
  });

  useEffect(() => {
    if (settings) {
      localStorage.setItem("cached_settings", JSON.stringify(settings));
    }
  }, [settings]);

  const [isMuted, setIsMuted] = useState(true);
  const [isReady, setIsReady] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const videoId = settings?.showcase_video_url ? getYoutubeId(settings.showcase_video_url) : "dQw4w9WgXcQ";
  const isInView = useInView(containerRef, { amount: 0.3 });
  
  const sendCommand = useCallback((command: string, args?: any[]) => {
    if (!iframeRef.current?.contentWindow || !isReady) return;
    try {
      iframeRef.current.contentWindow.postMessage(JSON.stringify({
        event: "command",
        func: command,
        args: args || [],
      }), "https://www.youtube.com");
    } catch (e) {}
  }, [isReady]);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== "https://www.youtube.com") return;
      try {
        const data = typeof event.data === "string" ? JSON.parse(event.data) : event.data;
        if (data.event === "onReady") {
          setIsReady(true);
        }
      } catch (e) {}
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  useEffect(() => {
    if (isInView) {
      sendCommand("playVideo");
    } else {
      sendCommand("pauseVideo");
    }
  }, [isInView, sendCommand, isReady]);

  useEffect(() => {
    if (isMuted) {
      sendCommand("mute");
    } else {
      sendCommand("unMute");
      sendCommand("setVolume", [100]);
    }
  }, [isMuted, sendCommand, isReady]);

  function getYoutubeId(url: string) {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|shorts\/)([^#&?]*).*/;
    const match = url.match(regExp);
    if (match && match[2].length === 11) return match[2];
    return url.length === 11 ? url : null;
  }

  const toggleMute = () => {
    setIsMuted(prev => !prev);
  };

  if (settings?.show_brand_showcase === false) return null;

  return (
    <section className="bg-ivory py-24 md:py-32 overflow-hidden border-b border-gold/10">
      <div className="container-luxe px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          
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

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="order-1 lg:order-1 relative"
          >
            <div className="absolute -top-4 -right-4 w-24 h-24 border-t border-r border-gold/40" />
            <div className="absolute -bottom-4 -left-4 w-24 h-24 border-b border-l border-gold/40" />
            
            <div 
              className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl bg-onyx group"
              ref={containerRef}
            >
              <div className="absolute inset-0 w-full h-full pointer-events-none">
                {videoId && (
                  <iframe
                    ref={iframeRef}
                    src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&controls=0&rel=0&modestbranding=1&iv_load_policy=3&enablejsapi=1&playsinline=1&showinfo=0&loop=1&playlist=${videoId}&origin=${typeof window !== 'undefined' ? encodeURIComponent(window.location.origin) : ''}`}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] scale-110 border-0"
                    allow="autoplay; encrypted-media"
                    title="Brand Showcase Video"
                  />
                )}
              </div>
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleMute();
                }}
                className="absolute top-6 right-6 h-12 w-12 rounded-full bg-onyx/60 backdrop-blur-md border border-white/20 flex items-center justify-center text-ivory hover:bg-gold hover:text-onyx transition-all z-20 shadow-xl"
              >
                {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
              </button>

              <div className="absolute inset-0 z-10 pointer-events-none" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
