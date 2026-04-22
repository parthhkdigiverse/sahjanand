import { useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { Play, X, ChevronLeft, ChevronRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchTestimonials } from "@/lib/api";

export function VideoTestimonials() {
  const { data: testimonials = [], isLoading } = useQuery({
    queryKey: ["testimonials"],
    queryFn: fetchTestimonials,
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
        <p className="divider-gold mb-5">Our Customers</p>
        <h2 className="font-serif text-4xl md:text-5xl">Real Stories</h2>
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
                    src={t.image}
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
            className="relative w-full max-w-3xl aspect-video bg-onyx border border-ivory/10"
            style={{ backgroundColor: "var(--onyx)" }}
          >
            <img
              src={testimonials[open].image}
              alt={testimonials[open].name}
              className="absolute inset-0 h-full w-full object-cover opacity-50"
            />
            <div
              className="absolute inset-0 flex flex-col items-center justify-center text-ivory p-8"
              style={{ color: "var(--ivory)" }}
            >
              <div className="h-20 w-20 rounded-full bg-gold flex items-center justify-center mb-6 cursor-pointer hover:scale-110 transition-transform">
                <Play size={28} className="ml-1 fill-onyx text-onyx" style={{ color: "var(--onyx)" }} />
              </div>
              <p className="font-serif text-3xl text-center max-w-xl">
                "{testimonials[open].quote}"
              </p>
              <p className="mt-4 text-xs tracking-luxe text-gold">— {testimonials[open].name}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
