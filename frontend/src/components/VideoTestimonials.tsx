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

  const [open, setOpen] = useState<number | null>(null);
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start" }, [
    Autoplay({ delay: 1500, stopOnInteraction: false, stopOnMouseEnter: true }),
  ]);
  const [, setSel] = useState(0);

  useEffect(() => {
    if (!emblaApi) return;
    const f = () => setSel(emblaApi.selectedScrollSnap());
    emblaApi.on("select", f);
    return () => {
      emblaApi.off("select", f);
    };
  }, [emblaApi]);

  return (
    <section className="container-luxe py-24 md:py-32">
      <div className="text-center mb-14">
        <p className="divider-gold mb-5">{settings?.testimonials_subheading || "Our Customers"}</p>
        <h2 className="font-serif text-4xl md:text-5xl">{settings?.testimonials_heading || "Real Stories"}</h2>
      </div>

      <div className="relative">
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex">
            {testimonials.map((t, i) => (
              <div
                key={i}
                className="flex-[0_0_100%] md:flex-[0_0_50%] lg:flex-[0_0_33.333%] xl:flex-[0_0_25%] px-3"
              >
                <button
                  onClick={() => setOpen(i)}
                  className="group relative block aspect-[3/4] w-full overflow-hidden img-zoom text-left"
                >
                  <img
                    src={getImageUrl(t.image)}
                    alt={t.name}
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 gradient-overlay" />
                  <div
                    className="absolute inset-0 flex flex-col justify-between p-6 text-ivory"
                    style={{ color: "var(--ivory)" }}
                  >
                    <div className="self-end">
                      <div className="h-12 w-12 rounded-full bg-ivory/15 backdrop-blur-md border border-ivory/30 flex items-center justify-center group-hover:bg-gold group-hover:border-gold transition-colors">
                        <Play size={16} className="ml-0.5 fill-current" />
                      </div>
                    </div>
                    <div>
                      <p className="font-serif text-2xl leading-snug mb-2">"{t.quote}"</p>
                      <p className="text-[0.7rem] tracking-luxe text-ivory/80">— {t.name}</p>
                    </div>
                  </div>
                </button>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={() => emblaApi?.scrollPrev()}
          className="absolute -left-2 lg:-left-6 top-1/2 -translate-y-1/2 h-11 w-11 rounded-full bg-background border border-border shadow-card hover:bg-gold hover:text-onyx hover:border-gold transition-all flex items-center justify-center z-10"
          aria-label="Previous"
        >
          <ChevronLeft size={18} />
        </button>
        <button
          onClick={() => emblaApi?.scrollNext()}
          className="absolute -right-2 lg:-right-6 top-1/2 -translate-y-1/2 h-11 w-11 rounded-full bg-background border border-border shadow-card hover:bg-gold hover:text-onyx hover:border-gold transition-all flex items-center justify-center z-10"
          aria-label="Next"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      {open !== null && (
        <div
          className="fixed inset-0 z-[60] bg-onyx/90 backdrop-blur flex items-center justify-center p-4 animate-fade-up"
          onClick={() => setOpen(null)}
          style={{ animationDuration: "0.3s" }}
        >
          <button
            onClick={() => setOpen(null)}
            className="absolute top-6 right-6 text-ivory hover:text-gold"
            style={{ color: "var(--ivory)" }}
          >
            <X size={24} />
          </button>
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-4xl aspect-video bg-onyx border border-ivory/10 shadow-2xl overflow-hidden rounded-xl"
            style={{ backgroundColor: "var(--onyx)" }}
          >
            {testimonials[open].video_url ? (
              <iframe
                src={(() => {
                  const url = testimonials[open].video_url;
                  if (!url) return "";
                  if (url.includes("youtube.com") || url.includes("youtu.be")) {
                    const id = url.includes("v=") ? url.split("v=")[1].split("&")[0] : url.split("/").pop();
                    return `https://www.youtube.com/embed/${id}?autoplay=1`;
                  }
                  if (url.includes("vimeo.com")) {
                    const id = url.split("/").pop();
                    return `https://player.vimeo.com/video/${id}?autoplay=1`;
                  }
                  return url;
                })()}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <>
                <img
                  src={getImageUrl(testimonials[open].image)}
                  alt={testimonials[open].name}
                  className="absolute inset-0 h-full w-full object-cover opacity-30"
                />
                <div
                  className="absolute inset-0 flex flex-col items-center justify-center text-ivory p-8 md:p-16"
                  style={{ color: "var(--ivory)" }}
                >
                  <Quote size={40} className="text-gold/20 mb-8" />
                  <p className="font-serif text-2xl md:text-4xl text-center max-w-2xl leading-relaxed">
                    "{testimonials[open].quote}"
                  </p>
                  <div className="mt-8 flex flex-col items-center">
                    <div className="h-px w-12 bg-gold/50 mb-4" />
                    <p className="text-[10px] tracking-[0.4em] text-gold uppercase font-bold">{testimonials[open].name}</p>
                    <p className="text-[9px] tracking-[0.2em] text-ivory/40 uppercase mt-1">Valued Patron</p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
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
