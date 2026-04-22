import { Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchProducts, type Product } from "@/lib/api";
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import * as React from "react";

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  return (
    <Link
      to="/product/$id"
      params={{ id: product.id }}
      className="group block animate-fade-up bg-white"
      style={{ animationDelay: `${index * 0.06}s` }}
    >
      <div className="relative aspect-square overflow-hidden bg-[#F9F8F6]">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105"
        />
        {/* Category Tag overlay */}
        <div className="absolute top-4 left-4 bg-white/95 px-3 py-1.5 shadow-sm">
          <p className="text-[9px] tracking-[0.2em] font-bold text-gray-800 uppercase">
            {product.category}
          </p>
        </div>
      </div>
      
      <div className="text-center py-8 px-4">
        <h3 className="font-serif text-lg md:text-xl mb-3 text-gray-900">
          {product.name}
        </h3>
        {/* Price hidden at user request */}
        <div className="flex items-center justify-center text-[11px] tracking-[0.2em] font-medium text-gray-500 uppercase">
          View Details <span className="ml-2 text-xs">→</span>
        </div>
      </div>
    </Link>
  );
}

export function FeaturedProducts() {
  const { data: products, isLoading } = useQuery({
    queryKey: ["featured-products"],
    queryFn: fetchProducts,
  });

  const featured = products || [];

  return (
    <section className="bg-secondary/20 py-24 md:py-32">
      <div className="container-luxe max-w-7xl">
        <div className="text-center mb-16">
          <p className="divider-gold mx-auto mb-6">Best Sellers</p>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-gray-900 mb-6">Our Finest Creations</h2>
          <Link
            to="/shop"
            className="text-[11px] tracking-[0.3em] font-bold text-gold hover:text-onyx transition-colors duration-300 uppercase"
          >
            Explore Collection
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse bg-white aspect-square rounded shadow-sm" />
            ))}
          </div>
        ) : featured.length > 3 ? (
          <div className="relative px-0">
            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
              plugins={[
                Autoplay({
                  delay: 4000,
                  stopOnInteraction: false,
                }),
              ]}
              className="w-full"
            >
              <CarouselContent className="-ml-8 md:-ml-12 lg:-ml-16">
                {featured.map((p: any, i: number) => (
                  <CarouselItem key={p.id} className="pl-8 md:pl-12 lg:pl-16 md:basis-1/2 lg:basis-1/3">
                    <ProductCard product={p} index={i} />
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
            {featured.map((p: any, i: number) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
