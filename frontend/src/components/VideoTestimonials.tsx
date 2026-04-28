import { useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { Play, X, ChevronLeft, ChevronRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchTestimonials, getImageUrl, fetchSettings } from "@/lib/api";

export function VideoTestimonials() {
  const { data: testimonials = [], isLoading } = useQuery({
    queryKey: ["testimonials"],
    queryFn: fetchTestimonials,
  });
  
  const { data: settings } = useQuery({
    queryKey: ["settings"],
    queryFn: fetchSettings,
  });

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { 
      loop: true, 
      align: "center",
      duration: 60, // Slower, smoother scroll
      skipSnaps: false
    }, 
    [Autoplay({ delay: 5000, stopOnInteraction: false, stopOnMouseEnter: true })]
  );
  
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [activeVideoIndex, setActiveVideoIndex] = useState<number | null>(null);

  useEffect(() => {
    if (!emblaApi) return;
    
    const onSelect = () => {
      const index = emblaApi.selectedScrollSnap();
      setSelectedIndex(index);
      
      // Clear active video immediately when scrolling starts
      setActiveVideoIndex(null);
      
      // Delay playing the video until the transition is mostly complete
      setTimeout(() => {
        setActiveVideoIndex(index);
      }, 500); 
    };

    emblaApi.on("select", onSelect);
    emblaApi.on("pointerDown", () => setActiveVideoIndex(null));
    
    onSelect();
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  const getYoutubeEmbedUrl = (url: string, autoplay: boolean = false) => {
    if (!url) return "";
    let id = "";
    if (url.includes("youtube.com") || url.includes("youtu.be")) {
      id = url.includes("v=") ? url.split("v=")[1].split("&")[0] : url.split("/").pop() || "";
      return `https://www.youtube.com/embed/${id}?autoplay=${autoplay ? 1 : 0}&mute=1&controls=0&loop=1&playlist=${id}&rel=0&modestbranding=1&iv_load_policy=3`;
    }
    if (url.includes("vimeo.com")) {
      id = url.split("/").pop() || "";
      return `https://player.vimeo.com/video/${id}?autoplay=${autoplay ? 1 : 0}&muted=1&background=1`;
    }
    return url;
  };

  // Double the slides if we have a small number, to ensure a smooth infinite loop
  const displayTestimonials = testimonials.length > 0 && testimonials.length <= 5 
    ? [...testimonials, ...testimonials] 
    : testimonials;

  return (
    <section className="container-luxe py-24 md:py-32 overflow-hidden">
      <div className="text-center mb-14">
        <p className="divider-gold mb-5">{settings?.testimonials_subheading || "Our Customers"}</p>
        <h2 className="font-serif text-4xl md:text-5xl">{settings?.testimonials_heading || "Voices of Trust"}</h2>
      </div>

      <div className="relative max-w-5xl mx-auto">
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex">
            {displayTestimonials.map((t, i) => {
              // Calculate index relative to original list for matching
              const originalIndex = i % (testimonials.length || 1);
              const isCentered = selectedIndex === i;
              const isVideoPlaying = activeVideoIndex === i;
              
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
                  <div
                    className="relative block aspect-[9/16] w-full overflow-hidden rounded-2xl shadow-2xl bg-onyx"
                  >
                    {/* Background Image (Always present for smooth transition) */}
                    <img
                      src={getImageUrl(t.image)}
                      alt={t.name}
                      loading="lazy"
                      className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${isVideoPlaying ? "opacity-0" : "opacity-100"}`}
                    />

                    {/* Video Player (Fades in when active) */}
                    {isCentered && t.video_url && (
                      <div className={`absolute inset-0 transition-opacity duration-700 ${isVideoPlaying ? "opacity-100" : "opacity-0"}`}>
                        {isVideoPlaying && (
                          <iframe
                            src={getYoutubeEmbedUrl(t.video_url, true)}
                            className="absolute inset-0 w-full h-full pointer-events-none scale-[1.05]"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          />
                        )}
                      </div>
                    )}
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-onyx/90 via-transparent to-transparent pointer-events-none" />
                    
                    <div
                      className="absolute inset-x-0 bottom-0 p-8 text-ivory text-center pointer-events-none"
                      style={{ color: "var(--ivory)" }}
                    >
                      <Quote size={24} className="text-gold/40 mx-auto mb-4" />
                      <p className="font-serif text-xl leading-snug mb-4 line-clamp-3 italic">"{t.quote}"</p>
                      <div className="h-px w-8 bg-gold/30 mx-auto mb-3" />
                      <p className="text-[10px] tracking-[0.3em] text-gold uppercase font-bold">{t.name}</p>
                    </div>

                    {!isCentered && (
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="h-14 w-14 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-ivory">
                          <Play size={20} className="ml-1 fill-current" />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <button
          onClick={() => emblaApi?.scrollPrev()}
          className="absolute left-4 lg:-left-12 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-ivory text-onyx shadow-xl hover:bg-gold hover:text-white transition-all flex items-center justify-center z-10"
          aria-label="Previous"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={() => emblaApi?.scrollNext()}
          className="absolute right-4 lg:-right-12 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-ivory text-onyx shadow-xl hover:bg-gold hover:text-white transition-all flex items-center justify-center z-10"
          aria-label="Next"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </section>
  );
}

function Quote({ size, className }: { size: number; className?: string }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="currentColor" 
      className={className}
    >
      <path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C20.1216 16 21.017 16.8954 21.017 18V21C21.017 22.1046 20.1216 23 19.017 23H16.017C14.9124 23 14.017 22.1046 14.017 21ZM14.017 21H10.017V21C10.017 22.1046 9.12157 23 8.017 23H5.017C3.91243 23 3.017 22.1046 3.017 21V11C3.017 9.89543 3.91243 9 5.017 9H10.017V9C11.1216 9 12.017 9.89543 12.017 11V16C12.017 17.1046 11.1216 18 10.017 18H8.017C6.91243 18 6.017 18.8954 6.017 20V21H14.017ZM0 18V21C0 22.1046 0.89543 23 2 23H5C6.10457 23 7 22.1046 7 21V11C7 9.89543 6.10457 9 5 9H0V9C0 7.89543 0.89543 7 2 7H5C6.10457 7 7 6.10457 7 5V2C7 0.89543 6.10457 0 5 0H2C0.89543 0 0 0.89543 0 2V18Z" />
    </svg>
  );
}
