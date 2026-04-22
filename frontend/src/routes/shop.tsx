import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchProduct, fetchProducts, type Product } from "@/lib/api";
import { ProductCard } from "@/components/FeaturedProducts";
import { ChevronDown } from "lucide-react";

export const Route = createFileRoute("/shop")({
  head: () => ({
    meta: [
      { title: "Shop — Maison Aurum Fine Jewellery" },
      {
        name: "description",
        content: "Browse all our jewellery — rings, necklaces, earrings and bracelets in gold, diamond and silver.",
      },
      { property: "og:title", content: "Shop — Maison Aurum" },
      { property: "og:description", content: "Hand-crafted gold and diamond jewellery." },
    ],
  }),
  component: Shop,
});

const categories = ["All", "Rings", "Necklaces", "Earrings", "Bracelets"] as const;
const metals = ["All", "Gold", "Diamond", "Silver"] as const;
const sortOptions = [
  { v: "featured", label: "Featured" },
  { v: "price-asc", label: "Price · Low to High" },
  { v: "price-desc", label: "Price · High to Low" },
  { v: "newest", label: "Newest" },
] as const;

function Shop() {
  const { data: products = [], isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });

  const [cat, setCat] = useState<(typeof categories)[number]>("All");
  const [metal, setMetal] = useState<(typeof metals)[number]>("All");
  const [maxPrice, setMaxPrice] = useState(350000);
  const [sort, setSort] = useState<(typeof sortOptions)[number]["v"]>("featured");

  const filtered = useMemo(() => {
    let list = products.filter(
      (p: any) =>
        (cat === "All" || p.category === cat) &&
        (metal === "All" || p.metal === metal) &&
        (p.price === "REQUEST" || p.price <= maxPrice)
    );

    const getPrice = (p: any) => (p.price === "REQUEST" ? Infinity : p.price);

    if (sort === "price-asc") {
      list = [...list].sort((a, b) => getPrice(a) - getPrice(b));
    } else if (sort === "price-desc") {
      list = [...list].sort((a, b) => getPrice(b) - getPrice(a));
    } else if (sort === "newest") {
      list = [...list].reverse();
    }
    return list;
  }, [products, cat, metal, maxPrice, sort]);

  return (
    <>
      <section className="pt-32 pb-12 bg-secondary/40">
        <div className="container-luxe text-center">
          <p className="divider-gold mb-5">Our Collection</p>
          <h1 className="font-serif text-5xl md:text-6xl mb-3">Shop All Jewellery</h1>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            {filtered.length} pieces · Each one made by hand in our Mumbai studio.
          </p>
        </div>
      </section>

      <section className="container-luxe py-16">
        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-12">
          <aside className="space-y-10 lg:sticky lg:top-28 lg:self-start">
            <div>
              <h3 className="text-xs tracking-luxe text-gold mb-5">Category</h3>
              <ul className="space-y-3">
                {categories.map((c) => (
                  <li key={c}>
                    <button
                      onClick={() => setCat(c)}
                      className={`text-sm transition-colors ${
                        cat === c ? "text-foreground font-medium" : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {c}
                      {cat === c && <span className="ml-2 text-gold">·</span>}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-xs tracking-luxe text-gold mb-5">Material</h3>
              <ul className="space-y-3">
                {metals.map((m) => (
                  <li key={m}>
                    <button
                      onClick={() => setMetal(m)}
                      className={`text-sm transition-colors ${
                        metal === m ? "text-foreground font-medium" : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {m}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Price Filter hidden at user request */}
          </aside>

          <div>
            <div className="flex items-center justify-between mb-10 pb-6 border-b border-gray-100">
              <p className="text-sm text-gray-500 font-medium">Showing {filtered.length} pieces</p>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="animate-pulse bg-white aspect-square rounded shadow-sm" />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <p className="text-center py-20 text-muted-foreground">No pieces match your filters.</p>
            ) : (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
                {filtered.map((p, i) => (
                  <ProductCard key={p.id} product={p} index={i} />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
