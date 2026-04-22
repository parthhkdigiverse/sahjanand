import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from "@tanstack/react-query";
import { fetchProducts } from "@/lib/api";
import { useState } from "react";
import { X, ZoomIn } from "lucide-react";

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
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  
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
            <div 
              onClick={() => setSelectedImage(featured[0].image)}
              className="relative group overflow-hidden bg-white aspect-square md:aspect-auto md:row-span-2 cursor-pointer"
            >
              <img
                src={featured[0].image}
                alt={featured[0].name}
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                <span className="text-white text-[10px] tracking-[0.5em] font-bold uppercase py-2 px-4 border border-white/40 backdrop-blur-sm flex items-center gap-2">
                  <ZoomIn size={14} /> View Details
                </span>
              </div>
            </div>
          )}

          {/* 2x2 Supporting Grid */}
          <div className="grid grid-cols-2 gap-4 lg:gap-6">
            {featured.slice(1).map((p) => (
              <div
                key={p.id}
                onClick={() => setSelectedImage(p.image)}
                className="relative group overflow-hidden bg-white aspect-square shadow-sm cursor-pointer"
              >
                <img
                  src={p.image}
                  alt={p.name}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/15 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                  <span className="text-white text-[10px] tracking-[0.5em] font-bold uppercase py-1.5 px-3 border border-white/40 backdrop-blur-sm flex items-center gap-2">
                    <ZoomIn size={12} /> View
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
                onClick={() => setSelectedImage(p.image)}
                className="relative group overflow-hidden bg-white aspect-square shadow-sm cursor-pointer"
              >
                <img
                  src={p.image}
                  alt={p.name}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/15 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                  <span className="text-white text-[10px] tracking-[0.5em] font-bold uppercase py-1.5 px-3 border border-white/40 backdrop-blur-sm flex items-center gap-2">
                    <ZoomIn size={12} /> View
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-[110] bg-onyx/95 backdrop-blur-md flex items-center justify-center p-4 md:p-12 animate-in fade-in duration-300"
          onClick={() => setSelectedImage(null)}
        >
          <button 
            className="absolute top-8 right-8 text-white/60 hover:text-gold transition-colors p-2"
            onClick={() => setSelectedImage(null)}
          >
            <X size={32} strokeWidth={1} />
          </button>
          
          <div 
            className="relative max-w-7xl max-h-full overflow-hidden shadow-2xl animate-in zoom-in-95 duration-500"
            onClick={(e) => e.stopPropagation()}
          >
            <img 
              src={selectedImage} 
              alt="Detailed View" 
              className="max-w-full max-h-[85vh] md:max-h-[90vh] object-contain border border-white/5"
            />
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-onyx/80 to-transparent">
              <p className="text-[10px] tracking-[0.4em] text-white/40 uppercase text-center font-bold">
                Maison Aurum · High Jewellery
              </p>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
