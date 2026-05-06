import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchProduct, fetchProducts, fetchCategories, type Product, type Category } from "@/lib/api";
import { ProductCard } from "@/components/FeaturedProducts";
import { ChevronDown, Filter, SlidersHorizontal } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
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

  const filtered = useMemo(() => {
    let list = products.filter(
      (p: any) =>
        (cat === "All" || p.category === cat) &&
        (metal === "All" || p.metal === metal)
    );

    if (sort === "newest") {
      list = [...list].reverse();
    }
    return list;
  }, [products, cat, metal, sort]);

  const MobileFilters = () => (
    <Accordion type="multiple" defaultValue={["category", "material"]} className="w-full">
      <AccordionItem value="category" className="border-none mb-6">
        <AccordionTrigger className="hover:no-underline py-2">
          <div className="flex items-center justify-between w-full pr-4">
            <h3 className="text-[10px] tracking-widest text-gold uppercase font-bold">Category</h3>
            <span className="h-px bg-gold/20 flex-1 ml-4"></span>
          </div>
        </AccordionTrigger>
        <AccordionContent className="pt-4">
          <div className="flex flex-wrap gap-2">
            {catsLoading ? (
              <div className="flex gap-2 animate-pulse">
                {[1, 2, 3, 4].map(i => <div key={i} className="h-8 bg-gray-100 rounded-full w-20" />)}
              </div>
            ) : (
              categories.map((c) => (
                <button
                  key={c}
                  onClick={() => setCat(c)}
                  className={`text-xs py-2 px-4 transition-all duration-300 flex items-center rounded-full border ${cat === c
                      ? "bg-gold text-white border-gold"
                      : "text-muted-foreground border-gray-200 hover:border-gold hover:text-gold"
                    }`}
                >
                  {c}
                  {cat === c && <span className="ml-1.5 text-white">·</span>}
                </button>
              ))
            )}
          </div>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="material" className="border-none">
        <AccordionTrigger className="hover:no-underline py-2">
          <div className="flex items-center justify-between w-full pr-4">
            <h3 className="text-[10px] tracking-widest text-gold uppercase font-bold">Material</h3>
            <span className="h-px bg-gold/20 flex-1 ml-4"></span>
          </div>
        </AccordionTrigger>
        <AccordionContent className="pt-4">
          <div className="flex flex-wrap gap-2">
            {metals.map((m) => (
              <button
                key={m}
                onClick={() => setMetal(m)}
                className={`text-xs py-2 px-4 transition-all duration-300 flex items-center rounded-full border ${metal === m
                    ? "bg-gold text-white border-gold"
                    : "text-muted-foreground border-gray-200 hover:border-gold hover:text-gold"
                  }`}
              >
                {m}
                {metal === m && <span className="ml-1.5 text-white">·</span>}
              </button>
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );

  return (
    <>
      <section className="py-24 bg-secondary/40">
        <div className="container-luxe text-center">
          <p className="divider-gold mb-5">Our Collection</p>
          <h1 className="font-serif text-5xl md:text-6xl mb-3">Shop All Jewellery</h1>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            {filtered.length} pieces · Each one made by hand in our Mumbai studio.
          </p>
        </div>
      </section>

      <section className="container-luxe py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-12 lg:gap-16">
          {/* Mobile Filter Bar */}
          <div className="lg:hidden flex items-center justify-between gap-4 mb-4 pb-4 border-b border-gray-100">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" className="text-[10px] tracking-[0.2em] uppercase font-bold text-gold hover:text-gold hover:bg-gold/5 gap-2 px-0">
                  <Filter className="h-4 w-4" />
                  Filters
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] border-r-gold/10">
                <SheetHeader className="mb-8 border-b pb-4">
                  <SheetTitle className="font-serif text-2xl text-left">Filters</SheetTitle>
                </SheetHeader>
                <MobileFilters />
              </SheetContent>
            </Sheet>
            <p className="text-[10px] tracking-widest text-muted-foreground uppercase font-medium">{filtered.length} pieces</p>
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
