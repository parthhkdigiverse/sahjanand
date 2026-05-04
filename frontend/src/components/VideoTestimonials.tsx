import { useEffect, useState, useMemo, useRef, useCallback } from "react";
import { useInView } from "framer-motion";
import useEmblaCarousel from "embla-carousel-react";
import { Volume2, VolumeX } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchTestimonials, getImageUrl, fetchSettings } from "@/lib/api";
import Autoplay from "embla-carousel-autoplay";

export function VideoTestimonials() {
  const { data: testimonials = [], isLoading } = useQuery({
    queryKey: ["testimonials"],
    queryFn: fetchTestimonials,
    initialData: () => {
      if (typeof window === "undefined") return undefined;
      const cached = localStorage.getItem("cached_testimonials");
      try {
        return cached ? JSON.parse(cached) : undefined;
      } catch (e) {
        return undefined;
      }
    },
  });
  
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
    if (testimonials && testimonials.length > 0) {
      localStorage.setItem("cached_testimonials", JSON.stringify(testimonials));
    }
  }, [testimonials]);

  useEffect(() => {
    if (settings) {
      localStorage.setItem("cached_settings", JSON.stringify(settings));
    }
  }, [settings]);

  const autoplayPlugin = useRef(
    Autoplay({ delay: 6000, stopOnInteraction: false, stopOnMouseEnter: false })
  );

  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    loop: true, 
    align: "center",
    duration: 60,
    skipSnaps: false
  }, [autoplayPlugin.current]);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { amount: 0.1 });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  
  // Refs for non-render state to avoid infinite loops
  const iframeRefs = useRef<Map<number, HTMLIFrameElement>>(new Map());
  const readyIframes = useRef<Set<number>>(new Set());

  // Handle autoplay based on visibility
  useEffect(() => {
    if (!emblaApi) return;
    const autoplay = emblaApi.plugins().autoplay;
    if (isInView) {
      autoplay?.play();
    } else {
      autoplay?.stop();
    }
  }, [isInView, emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    
    const onSelect = () => {
      const index = emblaApi.selectedScrollSnap();
      setSelectedIndex(index);
    };

    emblaApi.on("select", onSelect);
    onSelect();
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  const getYoutubeId = (url: string) => {
    if (!url) return "";
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|shorts\/)([^#&?]*).*/;
    const match = url.match(regExp);
    if (match && match[2].length === 11) return match[2];
    return url.length === 11 ? url : null;
  };

  const displayTestimonials = useMemo(() => {
    if (testimonials.length === 0) return [];
    return testimonials.length <= 5 ? [...testimonials, ...testimonials] : testimonials;
  }, [testimonials]);

  const sendCommand = useCallback((index: number, command: string, args?: any[]) => {
    const iframe = iframeRefs.current.get(index);
    if (!iframe?.contentWindow || !readyIframes.current.has(index)) return;
    
    try {
      iframe.contentWindow.postMessage(JSON.stringify({
        event: "command",
        func: command,
        args: args || [],
      }), "https://www.youtube.com");
    } catch (e) {}
  }, []);

  const toggleMute = useCallback(() => {
    setIsMuted(prev => {
      const nextMuted = !prev;
      if (nextMuted) {
        sendCommand(selectedIndex, "mute");
      } else {
        sendCommand(selectedIndex, "unMute");
        sendCommand(selectedIndex, "setVolume", [100]);
      }
      return nextMuted;
    });
  }, [selectedIndex, sendCommand]);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== "https://www.youtube.com") return;
      try {
        const data = typeof event.data === "string" ? JSON.parse(event.data) : event.data;
        
        let foundIndex = -1;
        iframeRefs.current.forEach((iframe, index) => {
          if (iframe.contentWindow === event.source) {
            foundIndex = index;
          }
        });

        if (foundIndex === -1) return;

        if (data.event === "onReady") {
          readyIframes.current.add(foundIndex);
          // Trigger initial play/mute once ready
          if (foundIndex === selectedIndex && isInView) {
            sendCommand(foundIndex, "playVideo");
            if (isMuted) sendCommand(foundIndex, "mute");
            else sendCommand(foundIndex, "unMute");
          }
        }

        if (data.event === "onStateChange") {
          if (data.info === 1) {
            emblaApi?.plugins().autoplay?.stop();
          } else if (data.info === 2 || data.info === 0) {
            if (isInView) {
              emblaApi?.plugins().autoplay?.play();
            }
            if (data.info === 0 && emblaApi) {
              emblaApi.scrollNext();
            }
          }
        }
      } catch (e) {}
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [emblaApi, isInView, selectedIndex, isMuted, sendCommand]);

  // Handle slide changes and visibility
  useEffect(() => {
    iframeRefs.current.forEach((_, index) => {
      if (index !== selectedIndex) {
        sendCommand(index, "pauseVideo");
        sendCommand(index, "mute");
      }
    });

    if (isInView) {
      sendCommand(selectedIndex, "playVideo");
      if (isMuted) {
        sendCommand(selectedIndex, "mute");
      } else {
        sendCommand(selectedIndex, "unMute");
      }
    }
  }, [selectedIndex, isInView, sendCommand, isMuted]);

  useEffect(() => {
    if (!isInView) {
      iframeRefs.current.forEach((_, index) => {
        sendCommand(index, "pauseVideo");
      });
    }
  }, [isInView, sendCommand]);

  if (isLoading) {
    return (
      <section className="container-luxe py-24 md:py-32 overflow-hidden">
        <div className="text-center mb-14">
          <div className="h-4 w-32 bg-stone/20 animate-pulse mx-auto mb-5 rounded" />
          <div className="h-10 w-64 bg-stone/20 animate-pulse mx-auto rounded" />
        </div>
        <div className="flex gap-8 justify-center max-w-5xl mx-auto px-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex-[0_0_85%] md:flex-[0_0_45%] lg:flex-[0_0_33.333%] aspect-[9/16] bg-stone/10 rounded-2xl animate-pulse" />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="container-luxe py-24 md:py-32 overflow-hidden" ref={containerRef}>
      <div className="text-center mb-14">
        <p className="divider-gold mb-5">{settings?.testimonials_subheading || "Our Customers"}</p>
        <h2 className="font-serif text-4xl md:text-5xl">{settings?.testimonials_heading || "Voices of Trust"}</h2>
      </div>

      <div className="relative max-w-5xl mx-auto">
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex">
            {displayTestimonials.map((t, i) => {
              const isCentered = selectedIndex === i;
              const videoId = getYoutubeId(t.video_url || "");

              return (
                <div
                  key={i}
                  className="flex-[0_0_85%] md:flex-[0_0_45%] lg:flex-[0_0_33.333%] px-4"
                  style={{ 
                    transition: "opacity 0.8s ease, transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
                    opacity: isCentered ? 1 : 0.3, 
                    transform: isCentered ? "scale(1)" : "scale(0.85)" 
                  }}
                >
                  <div className="relative block aspect-[9/16] w-full overflow-hidden rounded-2xl shadow-2xl bg-onyx group/card">
                    <img
                      src={getImageUrl(t.image)}
                      alt={t.name}
                      loading="lazy"
                      className="absolute inset-0 h-full w-full object-cover object-[center_25%]"
                    />

                    {t.video_url && videoId && isCentered && (
                      <div className="absolute inset-0 z-[5]">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300%] h-full">
                          <iframe
                            ref={(el) => {
                              if (el) iframeRefs.current.set(i, el);
                              else {
                                iframeRefs.current.delete(i);
                                readyIframes.current.delete(i);
                              }
                            }}
                            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&controls=0&rel=0&modestbranding=1&iv_load_policy=3&enablejsapi=1&playsinline=1&showinfo=0&loop=1&playlist=${videoId}&origin=${typeof window !== 'undefined' ? encodeURIComponent(window.location.origin) : ''}`}
                            className="w-full h-full border-0"
                            allow="autoplay; encrypted-media"
                            allowFullScreen={false}
                            title={`${t.name} testimonial video`}
                          />
                        </div>
                        
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleMute();
                          }}
                          className="absolute top-4 right-4 h-10 w-10 rounded-full bg-onyx/40 backdrop-blur-md border border-white/20 flex items-center justify-center text-ivory hover:bg-gold hover:text-onyx transition-all z-20 pointer-events-auto"
                        >
                          {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                        </button>
                        
                        <div className="absolute inset-0 z-10 pointer-events-none" />
                      </div>
                    )}
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-onyx/90 via-transparent to-transparent pointer-events-none z-[15]" />
                    
                    <div className="absolute inset-x-0 bottom-0 p-8 text-ivory text-center pointer-events-none z-[16]">
                      <Quote size={24} className="text-gold/40 mx-auto mb-4" />
                      <p className="font-serif text-xl leading-snug mb-4 line-clamp-3 italic">"{t.quote}"</p>
                      <div className="h-px w-8 bg-gold/30 mx-auto mb-3" />
                      <p className="text-[10px] tracking-[0.3em] text-gold uppercase font-bold">{t.name}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function Quote({ size, className }: { size: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C20.1216 16 21.017 16.8954 21.017 18V21C21.017 22.1046 20.1216 23 19.017 23H16.017C14.9124 23 14.017 22.1046 14.017 21ZM14.017 21H10.017V21C10.017 22.1046 9.12157 23 8.017 23H5.017C3.91243 23 3.017 22.1046 3.017 21V11C3.017 9.89543 3.91243 9 5.017 9H10.017V9C11.1216 9 12.017 9.89543 12.017 11V16C12.017 17.1046 11.1216 18 10.017 18H8.017C6.91243 18 6.017 18.8954 6.017 20V21H14.017ZM0 18V21C0 22.1046 0.89543 23 2 23H5C6.10457 23 7 22.1046 7 21V11C7 9.89543 6.10457 9 5 9H0V9C0 7.89543 0.89543 7 2 7H5C6.10457 7 7 6.10457 7 5V2C7 0.89543 6.10457 0 5 0H2C0.89543 0 0 0.89543 0 2V18Z" />
    </svg>
  );
}
