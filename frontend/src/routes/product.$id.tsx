import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { products, formatINR } from "@/lib/products";
import { ProductCard } from "@/components/FeaturedProducts";
import { Heart, ShoppingBag, Truck, Shield, RefreshCcw } from "lucide-react";

export const Route = createFileRoute("/product/$id")({
  loader: ({ params }) => {
    const product = products.find((p) => p.id === params.id);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData }) => {
    const p = loaderData?.product;
    return {
      meta: [
        { title: p ? `${p.name} — Maison Aurum` : "Product — Maison Aurum" },
        { name: "description", content: p?.description ?? "" },
        { property: "og:title", content: p?.name ?? "Maison Aurum" },
        { property: "og:description", content: p?.description ?? "" },
        ...(p ? [{ property: "og:image", content: p.image }] : []),
      ],
    };
  },
  notFoundComponent: () => (
    <div className="container-luxe py-40 text-center">
      <h1 className="font-serif text-4xl mb-4">Product not found</h1>
      <Link to="/shop" className="text-gold tracking-luxe text-xs">
        ← Back to Shop
      </Link>
    </div>
  ),
  component: ProductPage,
});

function ProductPage() {
  const { product } = Route.useLoaderData();
  const [zoom, setZoom] = useState({ active: false, x: 50, y: 50 });

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    setZoom({
      active: true,
      x: ((e.clientX - r.left) / r.width) * 100,
      y: ((e.clientY - r.top) / r.height) * 100,
    });
  };

  const related = products.filter((p) => p.id !== product.id && p.category === product.category).slice(0, 4);
  const fallback = products.filter((p) => p.id !== product.id).slice(0, 4);
  const relatedFinal = related.length >= 2 ? related : fallback;

  return (
    <>
      <section className="pt-32 pb-16">
        <div className="container-luxe">
          <nav className="text-xs tracking-wide text-muted-foreground mb-8 flex items-center gap-2">
            <Link to="/" className="hover:text-gold">Home</Link>
            <span>/</span>
            <Link to="/shop" className="hover:text-gold">Shop</Link>
            <span>/</span>
            <span className="text-foreground">{product.name}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
            <div>
              <div
                className="relative aspect-[4/5] bg-secondary overflow-hidden cursor-zoom-in"
                onMouseMove={onMove}
                onMouseLeave={() => setZoom((z) => ({ ...z, active: false }))}
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-300"
                  style={{
                    transform: zoom.active ? "scale(2)" : "scale(1)",
                    transformOrigin: `${zoom.x}% ${zoom.y}%`,
                  }}
                />
              </div>
              <div className="grid grid-cols-4 gap-3 mt-4">
                {[product.image, product.image, product.image, product.image].map((src, i) => (
                  <button
                    key={i}
                    className={`aspect-square overflow-hidden bg-secondary border ${
                      i === 0 ? "border-gold" : "border-transparent hover:border-border"
                    }`}
                  >
                    <img src={src} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            <div className="lg:pt-4">
              <p className="text-xs tracking-luxe text-gold mb-4">{product.category}</p>
              <h1 className="font-serif text-4xl md:text-5xl leading-tight mb-4">{product.name}</h1>
              <p className="font-serif text-3xl mb-6">{formatINR(product.price)}</p>
              <p className="text-foreground/70 leading-relaxed mb-8">{product.description}</p>

              <div className="border-y border-border py-6 space-y-3 mb-8">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground tracking-wide">Material</span>
                  <span>{product.material}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground tracking-wide">Weight</span>
                  <span>{product.weight}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground tracking-wide">Hallmark</span>
                  <span className="text-gold">BIS Certified ✓</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  className="sheen flex-1 inline-flex items-center justify-center gap-2 py-4 bg-onyx text-ivory text-xs tracking-luxe hover:bg-gold hover:text-onyx transition-colors"
                  style={{ backgroundColor: "var(--onyx)", color: "var(--ivory)" }}
                >
                  <ShoppingBag size={15} /> Add to Cart
                </button>
                <button
                  className="sheen flex-1 inline-flex items-center justify-center gap-2 py-4 bg-gold text-onyx text-xs tracking-luxe hover:bg-onyx hover:text-ivory transition-colors"
                  style={{ color: "var(--onyx)" }}
                >
                  Buy Now →
                </button>
                <button
                  aria-label="Wishlist"
                  className="h-12 w-12 border border-border flex items-center justify-center hover:border-gold hover:text-gold transition-colors"
                >
                  <Heart size={16} />
                </button>
              </div>

              <div className="grid grid-cols-3 gap-4 mt-10 pt-8 border-t border-border text-center">
                <div>
                  <Truck className="mx-auto text-gold mb-2" size={18} />
                  <p className="text-[0.65rem] tracking-luxe text-muted-foreground">Free Shipping</p>
                </div>
                <div>
                  <Shield className="mx-auto text-gold mb-2" size={18} />
                  <p className="text-[0.65rem] tracking-luxe text-muted-foreground">Lifetime Warranty</p>
                </div>
                <div>
                  <RefreshCcw className="mx-auto text-gold mb-2" size={18} />
                  <p className="text-[0.65rem] tracking-luxe text-muted-foreground">15-Day Returns</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-secondary/40 py-24">
        <div className="container-luxe">
          <div className="text-center mb-12">
            <p className="divider-gold mb-4">You May Also Like</p>
            <h2 className="font-serif text-4xl">Related Pieces</h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-10">
            {relatedFinal.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
