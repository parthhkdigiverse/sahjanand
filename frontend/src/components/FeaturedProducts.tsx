import { Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import { products, formatINR, type Product } from "@/lib/products";

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  return (
    <Link
      to="/product/$id"
      params={{ id: product.id }}
      className="group block animate-fade-up"
      style={{ animationDelay: `${index * 0.06}s` }}
    >
      <div className="relative aspect-square overflow-hidden bg-secondary mb-6">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        {/* Category Tag overlay */}
        <div className="absolute top-5 left-5 bg-white/95 backdrop-blur-sm px-4 py-2 shadow-sm">
          <p className="text-[10px] tracking-[0.2em] font-bold text-gray-800 uppercase">
            {product.category}
          </p>
        </div>
      </div>
      
      <div className="text-center px-4">
        <h3 className="font-serif text-xl md:text-2xl mb-2 text-gray-800">
          {product.name}
        </h3>
        <p className="text-[11px] tracking-[0.2em] font-bold text-gold mb-4 uppercase">
          {product.price === "REQUEST" ? "Price on Request" : formatINR(product.price as number)}
        </p>
        <div className="inline-flex items-center text-[10px] tracking-[0.2em] font-bold text-gray-500 group-hover:text-gold transition-colors duration-300 uppercase">
          View Details <span className="ml-2">→</span>
        </div>
      </div>
    </Link>
  );
}

export function FeaturedProducts() {
  const featured = products.slice(0, 3);
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
          {featured.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
