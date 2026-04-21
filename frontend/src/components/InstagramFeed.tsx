import { Instagram } from "lucide-react";
import insta1 from "@/assets/insta-1.jpg";
import insta2 from "@/assets/insta-2.jpg";
import insta3 from "@/assets/insta-3.jpg";
import insta4 from "@/assets/insta-4.jpg";
import insta5 from "@/assets/insta-5.jpg";
import insta6 from "@/assets/insta-6.jpg";

const posts = [insta1, insta2, insta3, insta4, insta5, insta6];

export function InstagramFeed() {
  return (
    <section className="container-luxe py-24 md:py-32">
      <div className="text-center mb-14">
        <p className="divider-gold mb-5">@maisonaurum</p>
        <h2 className="font-serif text-4xl md:text-5xl mb-3">Follow Us on Instagram</h2>
        <p className="text-sm text-muted-foreground">A glimpse into our world</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 md:gap-3">
        {posts.map((src, i) => (
          <a
            key={i}
            href="#"
            className="group relative block aspect-square overflow-hidden bg-secondary animate-fade-up"
            style={{ animationDelay: `${i * 0.05}s` }}
          >
            <img
              src={src}
              alt={`Instagram post ${i + 1}`}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-onyx/60 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
              <Instagram className="text-ivory" size={24} />
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
