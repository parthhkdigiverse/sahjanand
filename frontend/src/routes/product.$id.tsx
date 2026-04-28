import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { fetchProduct, fetchProducts, fetchSettings, type Product } from "@/lib/api";
import { ProductCard } from "@/components/FeaturedProducts";
import { InquiryModal } from "@/components/InquiryModal";
import { Check, MessageCircle, ArrowLeft, X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/product/$id")({
  component: ProductPage,
});

function ProductPage() {
  const { id } = Route.useParams();
  const [product, setProduct] = useState<any>(null);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeImage, setActiveImage] = useState(0);
  const [zoom, setZoom] = useState({ active: false, x: 50, y: 50 });
  const [isInquiryOpen, setIsInquiryOpen] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const { data: settings } = useQuery({
    queryKey: ["settings"],
    queryFn: fetchSettings,
  });

  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
        const [p, all] = await Promise.all([fetchProduct(id), fetchProducts()]);
        setProduct(p);

        const related = all.filter((item: any) => item.id !== p.id && item.category === p.category).slice(0, 4);
        setRelatedProducts(related.length >= 2 ? related : all.filter((item: any) => item.id !== p.id).slice(0, 4));

        setError(null);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
    window.scrollTo(0, 0);
  }, [id]);

  if (isLoading) return <div className="py-40 text-center animate-pulse text-gold">Loading Excellence...</div>;
  if (error || !product) {
    return (
      <div className="container-luxe py-40 text-center">
        <h1 className="font-serif text-4xl mb-4">Product not found</h1>
        <Link to="/shop" className="text-gold tracking-luxe text-xs">
          ← Back to Shop
        </Link>
      </div>
    );
  }

  const galleryImages = product.images?.length > 0 ? product.images : [product.image];

  const handleWhatsAppInquiry = () => {
    if (!settings?.whatsapp_number) return;

    // Clean number: remove all non-digits
    const cleanNumber = settings.whatsapp_number.replace(/\D/g, "");
    const message = encodeURIComponent(`Hello Sahajanand Jewellers, I'm interested in the ${product.name} (${product.id}). Can you provide more details?`);
    window.open(`https://wa.me/${cleanNumber}?text=${message}`, "_blank");
  };

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    if (r) {
      setZoom({
        active: true,
        x: ((e.clientX - r.left) / r.width) * 100,
        y: ((e.clientY - r.top) / r.height) * 100,
      });
    }
  };

  return (
    <>
      <section className="pt-32 pb-16 lg:pt-36 lg:pb-24">
        <div className="container-luxe">
          {/* Back Button */}
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 text-[10px] tracking-[0.3em] font-bold text-gray-400 hover:text-gold transition-colors mb-12 uppercase group"
          >
            <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-1" />
            Back to Shop
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-start">
            {/* Image & Gallery Column */}
            <div className="animate-fade-in">
              <div
                className="relative aspect-square bg-secondary overflow-hidden shadow-sm mb-6 cursor-zoom-in"
                onMouseMove={onMove}
                onMouseLeave={() => setZoom((z) => ({ ...z, active: false }))}
                onClick={() => setIsLightboxOpen(true)}
              >
                <img
                  src={galleryImages[activeImage]}
                  alt={product.name}
                  className="h-full w-full object-cover transition-transform duration-200 ease-out"
                  style={{
                    transform: zoom.active ? "scale(2.5)" : "scale(1)",
                    transformOrigin: `${zoom.x}% ${zoom.y}%`,
                  }}
                />
              </div>

              {/* Thumbnail Gallery */}
              {galleryImages.length > 1 && (
                <div className="flex gap-5 mt-8">
                  {galleryImages.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImage(idx)}
                      className={`relative aspect-square w-24 lg:w-32 overflow-hidden transition-all duration-300 ${activeImage === idx
                          ? "border-[3px] border-gold ring-offset-2"
                          : "border-[3px] border-transparent hover:border-gray-200"
                        }`}
                    >
                      <img
                        src={img}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Info Column */}
            <div className="animate-fade-up">
              <p className="text-[10px] tracking-[0.4em] text-gray-500 uppercase mb-4 font-bold">
                {product.category}
              </p>
              <h1 className="font-serif text-4xl lg:text-5xl lg:leading-tight mb-4 text-gray-900">
                {product.name}
              </h1>

              <div className="flex items-center gap-6 mb-8 text-[11px] tracking-[0.2em] font-bold uppercase">
                <p className="text-gold">
                  Weight: <span className="text-gray-900 ml-1">{product.weight}</span>
                </p>
                <div className="h-3 w-[1px] bg-gray-200" />
                <p className="text-gray-400">Certified Hallmarked</p>
              </div>

              <div className="space-y-6 mb-10">
                <p className="text-gray-600 leading-relaxed max-w-xl">
                  {product.description}
                </p>

                {product.features && (
                  <ul className="space-y-3 pt-2">
                    {product.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-3 text-sm text-gray-700">
                        <Check size={14} className="text-gold" strokeWidth={3} />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-4 mb-10">
                <button
                  onClick={() => setIsInquiryOpen(true)}
                  className="flex-1 bg-gray-900 text-white py-4 px-8 text-[11px] tracking-[0.2em] font-bold uppercase transition-all hover:bg-gold hover:text-white"
                >
                  Enquire Now
                </button>
                <button
                  onClick={handleWhatsAppInquiry}
                  className="flex-1 bg-white border border-gray-300 text-gray-800 py-4 px-8 text-[11px] tracking-[0.2em] font-bold uppercase transition-all hover:bg-gray-50 flex items-center justify-center gap-2"
                >
                  <MessageCircle size={16} /> WhatsApp Inquiry
                </button>
              </div>

              <InquiryModal
                product={product}
                isOpen={isInquiryOpen}
                onClose={() => setIsInquiryOpen(false)}
              />

              {/* Atelier Promise Box */}
              <div className="bg-[#FAF9F6] border-l-[3px] border-gold p-6 lg:p-8">
                <p className="text-[9px] tracking-[0.3em] font-bold text-gold uppercase mb-2">
                  {settings?.promise_title || "Atelier Promise"}
                </p>
                <p className="text-xs text-gray-600 leading-relaxed italic text-balance">
                  {settings?.promise_text || "Every piece is hallmarked, certified and accompanied by a lifetime care service."}
                </p>
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
            {relatedProducts.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </div>
      </section>

      {isLightboxOpen && (
        <div
          className="fixed inset-0 z-[110] bg-onyx/95 backdrop-blur-md flex items-center justify-center p-4 md:p-12 animate-in fade-in duration-300"
          onClick={() => setIsLightboxOpen(false)}
        >
          <button
            className="absolute top-8 right-8 text-white/60 hover:text-gold transition-colors p-2"
            onClick={() => setIsLightboxOpen(false)}
          >
            <X size={32} strokeWidth={1} />
          </button>

          <div
            className="relative max-w-7xl max-h-full overflow-hidden shadow-2xl animate-in zoom-in-95 duration-500"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={galleryImages[activeImage]}
              alt={product.name}
              className="max-w-full max-h-[85vh] md:max-h-[90vh] object-contain border border-white/5"
            />
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-onyx/80 to-transparent">
              <p className="text-[10px] tracking-[0.4em] text-white/40 uppercase text-center font-bold">
                Sahajanand Jewellers · Atelier Series
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
