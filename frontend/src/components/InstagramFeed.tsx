import { Instagram, ChevronLeft, ChevronRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchInstagramPosts, getImageUrl, fetchSettings } from "@/lib/api";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";

export function InstagramFeed() {
  const { data: posts } = useQuery({
    queryKey: ["instagram-posts"],
    queryFn: fetchInstagramPosts,
  });

  const { data: settings } = useQuery({
    queryKey: ["settings"],
    queryFn: fetchSettings,
  });

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start" }, [
    Autoplay({ delay: 3500, stopOnInteraction: false }),
  ]);

  if (!posts || posts.length === 0) return null;

  return (
    <section className="container-luxe py-24 md:py-32 overflow-hidden">
      <div className="text-center mb-14">
        <p className="divider-gold mb-5">{settings?.instagram_eyebrow || "@sahajanandjewellers"}</p>
        <h2 className="font-serif text-4xl md:text-5xl mb-3">{settings?.instagram_heading || "Follow Us on Instagram"}</h2>
        <p className="text-sm text-muted-foreground">{settings?.instagram_subheading || "A glimpse into our world"}</p>
      </div>

      <div className="relative group/carousel">
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex gap-2 md:gap-4">
            {posts.map((post, i) => (
              <div
                key={post._id}
                className="flex-[0_0_45%] md:flex-[0_0_28%] lg:flex-[0_0_15.5%] min-w-0"
              >
                <a
                  href={post.link}
                  target={post.link !== "#" ? "_blank" : undefined}
                  rel={post.link !== "#" ? "noopener noreferrer" : undefined}
                  className="group relative block aspect-square overflow-hidden bg-secondary shadow-soft"
                >
                  <img
                    src={getImageUrl(post.image_url)}
                    alt={`Instagram post ${i + 1}`}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-onyx/60 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                    <Instagram className="text-ivory" size={24} />
                  </div>
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Buttons */}
        <button
          onClick={() => emblaApi?.scrollPrev()}
          className="absolute -left-2 lg:-left-6 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-background border border-border shadow-card hover:bg-gold hover:text-onyx hover:border-gold transition-all flex items-center justify-center opacity-0 group-hover/carousel:opacity-100 z-10"
          aria-label="Previous"
        >
          <ChevronLeft size={18} />
        </button>
        <button
          onClick={() => emblaApi?.scrollNext()}
          className="absolute -right-2 lg:-right-6 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-background border border-border shadow-card hover:bg-gold hover:text-onyx hover:border-gold transition-all flex items-center justify-center opacity-0 group-hover/carousel:opacity-100 z-10"
          aria-label="Next"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </section>
  );
}
