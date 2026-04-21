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
      <div className="relative img-zoom bg-secondary aspect-[4/5] overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover"
        />
        <button
          aria-label="Add to wishlist"
          onClick={(e) => e.preventDefault()}
          className="absolute top-4 right-4 h-10 w-10 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center text-foreground/70 hover:text-gold transition-colors opacity-0 group-hover:opacity-100 duration-500"
        >
          <Heart size={16} />
        </button>
        <div className="absolute inset-x-4 bottom-4 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-500">
          <div
            className="bg-onyx text-ivory text-center py-3 text-xs tracking-luxe sheen"
            style={{ backgroundColor: "var(--onyx)", color: "var(--ivory)" }}
          >
            View Details →
          </div>
        </div>
      </div>
      <div className="pt-5 text-center">
        <p className="text-[0.65rem] tracking-luxe text-gold mb-2">{product.category}</p>
        <h3 className="font-serif text-xl mb-1">{product.name}</h3>
        <p className="text-sm text-foreground/70">{formatINR(product.price)}</p>
      </div>
    </Link>
  );
}

export function FeaturedProducts() {
  const featured = products.slice(0, 4);
  return (
    <section className="bg-secondary/40 py-24 md:py-32">
      <div className="container-luxe">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <div>
            <p className="divider-gold mb-5">Featured</p>
            <h2 className="font-serif text-4xl md:text-5xl">Best Sellers</h2>
          </div>
          <Link
            to="/shop"
            className="text-xs tracking-luxe text-foreground/70 hover:text-gold transition-colors self-start md:self-auto"
          >
            View All Products →
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-10">
          {featured.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
