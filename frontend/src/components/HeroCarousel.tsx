import { useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { fetchHeroSlides, HeroSlide } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import hero1 from "@/assets/hero-1.jpg";

export function HeroCarousel() {
  const { data: slides = [] } = useQuery({
    queryKey: ["hero-slides"],
    queryFn: fetchHeroSlides,
  });

  // Fallback slides if DB is empty
  const defaultSlides = [
    {
      image: hero1,
      eyebrow: "New Collection",
      title: "Timeless Elegance",
      subtitle: "Beautifully crafted jewellery for every occasion.",
      link_text: "Shop Now",
      link_url: "/shop"
    }
  ];

  const activeSlides = slides.length > 0 ? slides : defaultSlides;

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 5500, stopOnInteraction: false }),
  ]);
  const [selected, setSelected] = useState(0);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelected(emblaApi.selectedScrollSnap());
    onSelect();
    emblaApi.on("select", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  return (
    <section
      className="relative h-screen min-h-[640px] w-full overflow-hidden bg-onyx"
      style={{ backgroundColor: "var(--onyx)" }}
    >
      <div className="h-full" ref={emblaRef}>
        <div className="flex h-full">
          {activeSlides.map((s, i) => (
            <div key={i} className="relative h-full w-full flex-[0_0_100%]">
              <img
                src={s.image}
                alt={s.title}
                className="absolute inset-0 h-full w-full object-cover"
                loading={i === 0 ? "eager" : "lazy"}
              />
              <div className="absolute inset-0 gradient-overlay" />
              <div className="relative z-10 h-full flex items-end pb-32 md:pb-40">
                <div className="container-luxe">
                  <div
                    className="max-w-2xl text-ivory"
                    style={{ color: "var(--ivory)" }}
                  >
                    <p
                      key={`e-${selected}-${i}`}
                      className="text-xs tracking-luxe text-gold mb-5 animate-fade-up"
                      style={{ animationDelay: "0.1s" }}
                    >
                      — {s.eyebrow}
                    </p>
                    <h1
                      key={`t-${selected}-${i}`}
                      className="font-serif text-5xl md:text-7xl lg:text-8xl leading-[1.05] mb-5 animate-fade-up"
                      style={{ animationDelay: "0.2s" }}
                    >
                      {s.title}
                    </h1>
                    <p
                      key={`s-${selected}-${i}`}
                      className="text-base md:text-lg text-ivory/80 max-w-md mb-10 animate-fade-up"
                      style={{ animationDelay: "0.35s" }}
                    >
                      {s.subtitle}
                    </p>
                    <a
                      href={(s as any).link_url || "/shop"}
                      className="sheen inline-flex items-center gap-3 px-9 py-4 bg-gold text-onyx text-xs tracking-luxe hover:bg-ivory transition-colors animate-fade-up"
                      style={{ animationDelay: "0.5s", color: "var(--onyx)" }}
                    >
                      {(s as any).link_text || "Shop Now"} →
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3">
        {activeSlides.map((_, i) => (
          <button
            key={i}
            onClick={() => emblaApi?.scrollTo(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`h-[2px] transition-all duration-500 ${
              selected === i ? "w-12 bg-gold" : "w-6 bg-ivory/40"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
