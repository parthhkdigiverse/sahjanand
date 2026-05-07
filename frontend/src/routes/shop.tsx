import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchProduct, fetchProducts, fetchCategories, type Product, type Category } from "@/lib/api";
import { ProductCard } from "@/components/FeaturedProducts";
import { ChevronDown, Filter as FilterIcon, X, SlidersHorizontal, Check } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/shop")({
  head: () => ({
    meta: [
      { title: "Shop — Sahajanand Jewellers Fine Jewellery" },
      {
        name: "description",
        content: "Browse all our jewellery — rings, necklaces, earrings and bracelets in gold, diamond and silver.",
      },
      { property: "og:title", content: "Shop — Sahajanand Jewellers" },
      { property: "og:description", content: "Hand-crafted gold and diamond jewellery." },
    ],
  }),
  component: Shop,
});

const metals = ["All", "Gold", "Diamond", "Silver"] as const;
const sortOptions = [
  { v: "featured", label: "Featured" },
  { v: "newest", label: "Newest" },
] as const;

function Shop() {
  const { data: products = [], isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });

  const { data: dbCategories = [], isLoading: catsLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  const categories = useMemo(() => {
    return ["All", ...dbCategories.map(c => c.name)];
  }, [dbCategories]);

  const [cat, setCat] = useState<string>("All");
  const [metal, setMetal] = useState<(typeof metals)[number]>("All");
  const [sort, setSort] = useState<(typeof sortOptions)[number]["v"]>("featured");
  const [showMobileOptions, setShowMobileOptions] = useState(false);

  const filtered = useMemo(() => {
    let list = products.filter(
      (p: any) =>
        (cat === "All" || p.category === cat) &&
        (metal === "All" || (Array.isArray(p.metal) ? p.metal.includes(metal) : p.metal === metal))
    );

    if (sort === "newest") {
      list = [...list].reverse();
    }
    return list;
  }, [products, cat, metal, sort]);

  return (
    <>
      <section className="py-24 bg-secondary/40">
        <div className="container-luxe text-center">
          <p className="divider-gold mb-5">Our Collection</p>
          <h1 className="font-serif text-5xl md:text-6xl mb-3">Shop All Jewellery</h1>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            {filtered.length} pieces · Each one made by hand in our Studio.
          </p>
        </div>
      </section>

      <section className="container-luxe py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-12 lg:gap-16">
          
          {/* Mobile Filter Interaction */}
          <div className="lg:hidden mb-8">
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
              <Button 
                variant="ghost" 
                onClick={() => setShowMobileOptions(!showMobileOptions)}
                className={`text-[10px] tracking-[0.2em] uppercase font-bold transition-colors gap-2 px-0 ${showMobileOptions ? 'text-gold' : 'text-gray-900'}`}
              >
                {showMobileOptions ? <X className="h-4 w-4" /> : <FilterIcon className="h-4 w-4" />}
                {showMobileOptions ? "Close Filters" : "Filter"}
              </Button>
              <p className="text-[10px] tracking-widest text-muted-foreground uppercase font-medium">{filtered.length} pieces</p>
            </div>

            {showMobileOptions && (
              <div className="flex gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="flex-1 text-[10px] tracking-widest uppercase font-bold border-gold/20 text-gold h-11 rounded-none bg-white">
                      {cat === "All" ? "Category" : cat}
                      <ChevronDown className="ml-2 h-3 w-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-[calc(100vw-3rem)] rounded-none border-gold/10">
                    {categories.map((c) => (
                      <DropdownMenuItem 
                        key={c} 
                        onClick={() => setCat(c)}
                        className="py-3 px-4 text-xs tracking-wide uppercase font-medium flex items-center justify-between"
                      >
                        {c}
                        {cat === c && <Check className="h-3 w-3 text-gold" />}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="flex-1 text-[10px] tracking-widest uppercase font-bold border-gold/20 text-gold h-11 rounded-none bg-white">
                      {metal === "All" ? "Material" : metal}
                      <ChevronDown className="ml-2 h-3 w-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-[calc(100vw-3rem)] rounded-none border-gold/10">
                    {metals.map((m) => (
                      <DropdownMenuItem 
                        key={m} 
                        onClick={() => setMetal(m)}
                        className="py-3 px-4 text-xs tracking-wide uppercase font-medium flex items-center justify-between"
                      >
                        {m}
                        {metal === m && <Check className="h-3 w-3 text-gold" />}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
          </div>

          {/* Desktop Sidebar - Fixed "Old Web" Style */}
          <aside className="hidden lg:block space-y-12 lg:sticky lg:top-28 lg:self-start">
            <div>
              <h3 className="text-[10px] tracking-widest text-gold mb-6 uppercase font-bold">Category</h3>
              <ul className="space-y-4">
                {catsLoading ? (
                  <div className="space-y-3 animate-pulse">
                    {[1, 2, 3, 4].map(i => <div key={i} className="h-4 bg-gray-100 rounded w-1/2" />)}
                  </div>
                ) : (
                  categories.map((c) => (
                    <li key={c}>
                      <button
                        onClick={() => setCat(c)}
                        className={`text-sm transition-all duration-300 flex items-center group ${cat === c ? "text-foreground font-semibold" : "text-muted-foreground hover:text-foreground"
                          }`}
                      >
                        <span className="relative">
                          {c}
                          <span className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-gold transition-all duration-300 ${cat === c ? "w-full" : "group-hover:w-1/2"}`}></span>
                        </span>
                        {cat === c && <span className="ml-2 text-gold animate-in fade-in zoom-in">·</span>}
                      </button>
                    </li>
                  ))
                )}
              </ul>
            </div>

            <div>
              <h3 className="text-[10px] tracking-widest text-gold mb-6 uppercase font-bold">Material</h3>
              <ul className="space-y-4">
                {metals.map((m) => (
                  <li key={m}>
                    <button
                      onClick={() => setMetal(m)}
                      className={`text-sm transition-all duration-300 flex items-center group ${metal === m ? "text-foreground font-semibold" : "text-muted-foreground hover:text-foreground"
                        }`}
                    >
                      <span className="relative">
                        {m}
                        <span className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-gold transition-all duration-300 ${metal === m ? "w-full" : "group-hover:w-1/2"}`}></span>
                      </span>
                      {metal === m && <span className="ml-2 text-gold animate-in fade-in zoom-in">·</span>}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          {/* Product Grid */}
          <div>
            <div className="hidden lg:flex items-center justify-between mb-10 pb-6 border-b border-gray-100">
              <p className="text-xs text-gray-500 font-medium tracking-wide uppercase">Showing {filtered.length} pieces</p>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="animate-pulse bg-white aspect-[4/5] rounded shadow-sm" />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-24 bg-secondary/5 rounded-2xl border border-dashed border-gold/20">
                <p className="text-muted-foreground font-medium italic">No pieces match your current filters.</p>
                <Button 
                  variant="link" 
                  onClick={() => { setCat("All"); setMetal("All"); }} 
                  className="mt-4 text-gold font-bold uppercase tracking-widest text-[10px]"
                >
                  Clear All Filters
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
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
