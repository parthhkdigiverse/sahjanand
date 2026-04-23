import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { fetchAboutData, getImageUrl } from "@/lib/api";
import heroFallback from "@/assets/hero-1.jpg";
import promiseFallback from "@/assets/insta-1.jpg";

export const Route = createFileRoute("/about")({
  component: About,
});

function About() {
  const { data: about, isLoading } = useQuery({
    queryKey: ["about-data"],
    queryFn: fetchAboutData,
  });

  if (isLoading) return <div className="h-screen flex items-center justify-center bg-ivory/30">
    <div className="animate-pulse font-serif text-2xl text-gold tracking-widest uppercase">Sahajanand Jewellers</div>
  </div>;

  const data = about || {
    hero_heading: "Crafted with Care",
    hero_eyebrow: "Our Story",
    story_heading: "Made by hand. Made to last.",
    story_eyebrow: "Our Studio",
    story_paragraphs: [],
    promise_heading: "Every piece, made to last.",
    promise_eyebrow: "Our Promise",
    promises: [],
    cta_text: "Shop the Collection",
    cta_link: "/shop"
  };

  return (
    <>
      {/* Hero Section */}
      <section className="relative h-[70vh] min-h-[480px] overflow-hidden">
        <img 
          src={data.hero_image ? getImageUrl(data.hero_image) : heroFallback} 
          alt="Sahajanand Jewellers" 
          className="absolute inset-0 h-full w-full object-cover" 
        />
        <div className="absolute inset-0 bg-onyx/40" />
        <div className="relative z-10 h-full flex items-end pb-20 container-luxe">
          <div className="text-ivory max-w-2xl">
            <p className="divider-gold mb-5">{data.hero_eyebrow}</p>
            <h1 className="font-serif text-5xl md:text-7xl leading-[1.05]">
              {data.hero_heading}
            </h1>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="container-luxe py-24 grid grid-cols-1 lg:grid-cols-12 gap-12 overflow-hidden">
        <div className="lg:col-span-5">
          <p className="divider-gold mb-5">{data.story_eyebrow}</p>
          <h2 className="font-serif text-4xl md:text-5xl leading-tight">
            {data.story_heading}
          </h2>
        </div>
        <div className="lg:col-span-6 lg:col-start-7 space-y-6 text-foreground/80 leading-relaxed">
          {data.story_paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </section>

      {/* Promise Section */}
      <section className="bg-secondary/20 py-24 border-y border-gold/5">
        <div className="container-luxe grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="aspect-[4/5] overflow-hidden rounded-2xl shadow-luxe">
            <img 
              src={data.promise_image ? getImageUrl(data.promise_image) : promiseFallback} 
              alt="Hand-crafted excellence" 
              className="h-full w-full object-cover" 
              loading="lazy" 
            />
          </div>
          <div>
            <div>
              <p className="divider-gold mb-5">{data.promise_eyebrow}</p>
              <h2 className="font-serif text-4xl md:text-5xl leading-tight mb-8 text-onyx">
                {data.promise_heading}
              </h2>
            </div>
            
            <div className="space-y-8">
              {data.promises.map((p, i) => (
                <div key={i} className="flex gap-4 group">
                  <div className="text-gold text-2xl font-serif leading-none group-hover:scale-125 transition-transform duration-500">·</div>
                  <div>
                    <h4 className="font-serif text-xl mb-1 text-onyx">{p.title}</h4>
                    <p className="text-sm text-foreground/60 leading-relaxed">{p.description}</p>
                  </div>
                </div>
              ))}
            </div>
            <div>
              <Link
                to={data.cta_link || "/shop"}
                className="sheen inline-flex items-center gap-3 mt-12 px-9 py-4 bg-onyx text-ivory text-xs tracking-luxe hover:bg-gold hover:text-onyx transition-all duration-500 shadow-luxe"
                style={{ backgroundColor: "var(--onyx)", color: "var(--ivory)" }}
              >
                {data.cta_text || "Shop the Collection"} →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
