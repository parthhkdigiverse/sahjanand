import { useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { Star, BadgeCheck, ChevronLeft, ChevronRight } from "lucide-react";

const reviews = [
  {
    name: "Anaya Mehra",
    initial: "A",
    rating: 5,
    text: "Beautiful ring, beautiful packaging, beautiful service. Every detail felt special.",
  },
  {
    name: "Vikram Shah",
    initial: "V",
    rating: 5,
    text: "Bought the emerald ring for my wife's birthday. The team helped me choose remotely. Top quality.",
  },
  {
    name: "Priya Iyer",
    initial: "P",
    rating: 5,
    text: "I've owned pieces from bigger brands. The finish on my bangle is in another league.",
  },
  {
    name: "Karan Bhatia",
    initial: "K",
    rating: 5,
    text: "Simple, elegant, perfect. My studs go with everything. Already planning my next buy.",
  },
  {
    name: "Riya Chopra",
    initial: "R",
    rating: 5,
    text: "Their team spent two hours helping me choose. No pressure, just real knowledge.",
  },
];

export function GoogleReviews() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start" }, [
    Autoplay({ delay: 4500 }),
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
    <section className="bg-secondary/40 py-24 md:py-32">
      <div className="container-luxe">
        <div className="text-center mb-14">
          <p className="divider-gold mb-5">Reviews</p>
          <h2 className="font-serif text-4xl md:text-5xl mb-3">What Our Customers Say</h2>
          <p className="text-sm text-muted-foreground inline-flex items-center gap-2 mt-2">
            <BadgeCheck size={14} className="text-gold" />
            4.9 / 5 · Verified by Google · 2,400+ reviews
          </p>
        </div>

        <div className="relative">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex">
              {reviews.map((r, i) => (
                <div
                  key={i}
                  className="flex-[0_0_100%] md:flex-[0_0_50%] lg:flex-[0_0_33.333%] px-3"
                >
                  <div className="bg-card p-9 h-full shadow-card border border-border">
                    <div className="flex items-center gap-4 mb-5">
                      <div
                        className="h-12 w-12 rounded-full gradient-gold flex items-center justify-center font-serif text-xl text-onyx"
                        style={{ color: "var(--onyx)" }}
                      >
                        {r.initial}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{r.name}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <div className="flex">
                            {Array.from({ length: r.rating }).map((_, k) => (
                              <Star key={k} size={12} className="fill-gold text-gold" />
                            ))}
                          </div>
                          <span className="text-[0.65rem] text-muted-foreground tracking-wide flex items-center gap-1">
                            <BadgeCheck size={11} className="text-gold" /> Google Verified
                          </span>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm leading-relaxed text-foreground/80 italic">
                      "{r.text}"
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => emblaApi?.scrollPrev()}
            className="absolute -left-2 lg:-left-6 top-1/2 -translate-y-1/2 h-11 w-11 rounded-full bg-background border border-border shadow-card hover:bg-gold hover:text-onyx hover:border-gold transition-all flex items-center justify-center"
            aria-label="Previous"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={() => emblaApi?.scrollNext()}
            className="absolute -right-2 lg:-right-6 top-1/2 -translate-y-1/2 h-11 w-11 rounded-full bg-background border border-border shadow-card hover:bg-gold hover:text-onyx hover:border-gold transition-all flex items-center justify-center"
            aria-label="Next"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </section>
  );
}
