import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from "@tanstack/react-query";
import { fetchProducts } from "@/lib/api";

export const Route = createFileRoute("/gallery")({
  component: GalleryPage,
  head: () => ({
    meta: [
      { title: "Gallery · Maison Aurum" },
      {
        name: "description",
        content:
          "Explore our gallery of handcrafted fine jewellery — rings, necklaces, earrings and bracelets by Maison Aurum.",
      },
      { property: "og:title", content: "Gallery · Maison Aurum" },
      {
        property: "og:description",
        content:
          "A curated visual journey through Maison Aurum's handcrafted fine jewellery.",
      },
    ],
  }),
});

function GalleryPage() {
  const { data: products = [], isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });

  if (isLoading) return <div className="py-40 text-center animate-pulse text-gold uppercase tracking-[0.3em] text-xs">Curating Gallery...</div>;

  const featured = products.slice(0, 5);
  const remaining = products.slice(5);

  return (
    <main className="pt-32 pb-24 md:pt-40 md:pb-32 bg-[#F9F8F6]">
      <div className="container-luxe">
        <header className="text-center mb-16 md:mb-24">
          <p className="text-[10px] tracking-[0.4em] text-gold uppercase mb-6 font-bold">
            Atelier Gallery
          </p>
          <h1 className="font-serif text-5xl md:text-7xl text-gray-900 mb-8">
            Moments of Brilliance
          </h1>
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mb-10" />
          <p className="text-sm md:text-base text-slate-500 max-w-2xl mx-auto leading-relaxed">
            A visual journey through our atelier and the craft behind each creation.
          </p>
        </header>

        {/* Featured Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
          {/* Main Large Image */}
          {featured[0] && (
            <div className="relative group overflow-hidden bg-white aspect-square md:aspect-auto md:row-span-2">
              <img
                src={featured[0].image}
                alt={featured[0].name}
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                <span className="text-white text-[10px] tracking-[0.5em] font-bold uppercase py-2 px-4 border border-white/40 backdrop-blur-sm">
                  View
                </span>
              </div>
            </div>
          )}

          {/* 2x2 Supporting Grid */}
          <div className="grid grid-cols-2 gap-4 lg:gap-6">
            {featured.slice(1).map((p) => (
              <div
                key={p.id}
                className="relative group overflow-hidden bg-white aspect-square shadow-sm"
              >
                <img
                  src={p.image}
                  alt={p.name}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                  <span className="text-white text-[10px] tracking-[0.5em] font-bold uppercase py-2 px-4 border border-white/40 backdrop-blur-sm">
                    View
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Remaining Gallery Items */}
        {remaining.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6 mt-4 lg:mt-6">
            {remaining.map((p) => (
              <div
                key={p.id}
                className="relative group overflow-hidden bg-white aspect-square shadow-sm"
              >
                <img
                  src={p.image}
                  alt={p.name}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                  <span className="text-white text-[10px] tracking-[0.5em] font-bold uppercase py-2 px-4 border border-white/40 backdrop-blur-sm">
                    View
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
