import { createFileRoute, Link } from "@tanstack/react-router";
import hero from "@/assets/hero-1.jpg";
import insta1 from "@/assets/insta-1.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Us — Maison Aurum Fine Jewellery" },
      {
        name: "description",
        content:
          "Learn about Maison Aurum — our story, our team, and the care we put into every piece of jewellery we make.",
      },
      { property: "og:title", content: "About Us — Maison Aurum" },
      { property: "og:description", content: "Fine jewellery, made by hand." },
      { property: "og:image", content: hero },
    ],
  }),
  component: About,
});

function About() {
  return (
    <>
      <section className="relative h-[70vh] min-h-[480px] overflow-hidden">
        <img src={hero} alt="Maison Aurum" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 gradient-overlay" />
        <div className="relative z-10 h-full flex items-end pb-20 container-luxe">
          <div className="text-ivory max-w-2xl" style={{ color: "var(--ivory)" }}>
            <p className="divider-gold mb-5">Our Story</p>
            <h1 className="font-serif text-5xl md:text-7xl leading-[1.05]">
              Crafted with Care
            </h1>
          </div>
        </div>
      </section>

      <section className="container-luxe py-24 grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-5">
          <p className="divider-gold mb-5">Our Studio</p>
          <h2 className="font-serif text-4xl md:text-5xl leading-tight">
            Made by hand.
            <br />
            Made to last.
          </h2>
        </div>
        <div className="lg:col-span-6 lg:col-start-7 space-y-6 text-foreground/80 leading-relaxed">
          <p>
            Maison Aurum was started in Mumbai in 1924 by a young goldsmith who
            believed jewellery should outlive its wearer. Today, four generations
            on, we still believe the same thing.
          </p>
          <p>
            We don't follow trends and we don't make in bulk. Every piece is
            finished by hand by an artisan whose name is on the certificate. A
            quiet promise between the maker, the wearer, and time.
          </p>
          <p>
            From the gold we choose to the diamonds we set, each decision serves
            one idea: what you wear today should be worth passing down tomorrow.
          </p>
        </div>
      </section>

      <section className="bg-secondary/40 py-24">
        <div className="container-luxe grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="aspect-[4/5] overflow-hidden">
            <img src={insta1} alt="Hand-crafted ring" className="h-full w-full object-cover" loading="lazy" />
          </div>
          <div>
            <p className="divider-gold mb-5">Our Promise</p>
            <h2 className="font-serif text-4xl md:text-5xl leading-tight mb-8">
              Every piece, made to last.
            </h2>
            <div className="space-y-6">
              {[
                {
                  t: "Hallmark Certified",
                  d: "Every gram of gold is tested and stamped by the Bureau of Indian Standards.",
                },
                {
                  t: "Conflict-Free Diamonds",
                  d: "All our diamonds are traced to source and certified to GIA standards.",
                },
                {
                  t: "Lifetime Service",
                  d: "Free cleaning, polishing and re-sizing — for as long as the piece is yours.",
                },
              ].map((p) => (
                <div key={p.t} className="flex gap-4">
                  <div className="text-gold text-2xl font-serif leading-none">·</div>
                  <div>
                    <h4 className="font-serif text-xl mb-1">{p.t}</h4>
                    <p className="text-sm text-foreground/70">{p.d}</p>
                  </div>
                </div>
              ))}
            </div>
            <Link
              to="/shop"
              className="sheen inline-flex items-center gap-3 mt-10 px-9 py-4 bg-onyx text-ivory text-xs tracking-luxe hover:bg-gold hover:text-onyx transition-colors"
              style={{ backgroundColor: "var(--onyx)", color: "var(--ivory)" }}
            >
              Shop the Collection →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
