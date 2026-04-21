import { createFileRoute } from "@tanstack/react-router";
import { products } from "@/lib/products";

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
  return (
    <main className="pt-32 pb-24">
      <div className="container-luxe">
        <header className="text-center mb-16">
          <p className="text-xs tracking-luxe text-gold mb-4">OUR GALLERY</p>
          <h1 className="font-serif text-4xl md:text-5xl text-foreground">
            A Visual Journey
          </h1>
          <p className="text-muted-foreground mt-4 max-w-xl mx-auto">
            Every piece tells a story. Browse our handcrafted creations.
          </p>
        </header>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map((p) => (
            <figure
              key={p.id}
              className="group relative overflow-hidden bg-muted aspect-square"
            >
              <img
                src={p.image}
                alt={p.name}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <figcaption className="absolute inset-0 flex items-end bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-4">
                <span className="text-ivory text-sm font-serif">{p.name}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </main>
  );
}
