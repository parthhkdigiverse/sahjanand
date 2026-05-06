import { Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchProducts, type Product, getImageUrl } from "@/lib/api";
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { useEffect } from "react";
import * as React from "react";

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const imageUrl = getImageUrl(product.image);
  
  return (
    <Link
      to="/product/$id"
      params={{ id: product.id }}
      className="group block animate-fade-up bg-white h-full"
      style={{ animationDelay: `${index * 0.06}s` }}
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-[#F9F8F6]">
        {imageUrl && (
          <img
            src={imageUrl}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105"
          />
        )}
        {/* Category Tag overlay */}
        <div className="absolute top-3 left-3 md:top-4 md:left-4 bg-white/90 backdrop-blur-sm px-2.5 py-1 md:px-3 md:py-1.5 shadow-sm border border-gray-100">
          <p className="text-[8px] md:text-[9px] tracking-[0.2em] font-bold text-gray-800 uppercase">
            {product.category}
          </p>
        </div>
      </div>
      
      <div className="text-center py-6 md:py-8 px-4">
        <h3 className="font-serif text-base md:text-xl mb-2 md:mb-3 text-gray-900 line-clamp-1">
          {product.name}
        </h3>
        {/* Price hidden at user request */}
        <div className="flex items-center justify-center text-[10px] md:text-[11px] tracking-[0.2em] font-medium text-gray-500 uppercase">
          View Details <span className="ml-1.5 md:ml-2 text-xs">→</span>
        </div>
      </div>
    </Link>
  );
}

export function FeaturedProducts() {
  const { data: products } = useQuery({
    queryKey: ["featured-products"],
    queryFn: fetchProducts,
    initialData: () => {
      if (typeof window === "undefined") return undefined;
      const cached = localStorage.getItem("cached_products");
      try {
        return cached ? JSON.parse(cached) : undefined;
      } catch (e) {
        return undefined;
      }
    },
  });

  useEffect(() => {
    if (products && products.length > 0) {
      localStorage.setItem("cached_products", JSON.stringify(products));
    }
  }, [products]);

  const featured = products?.filter((p: any) => p.featured) || [];
  const isLoading = !products;

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
