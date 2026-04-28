import { Instagram } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchInstagramPosts, getImageUrl, fetchSettings } from "@/lib/api";

export function InstagramFeed() {
  const { data: posts } = useQuery({
    queryKey: ["instagram-posts"],
    queryFn: fetchInstagramPosts,
  });

  const { data: settings } = useQuery({
    queryKey: ["settings"],
    queryFn: fetchSettings,
  });

  if (!posts || posts.length === 0) return null;
  return (
    <section className="container-luxe py-24 md:py-32">
      <div className="text-center mb-14">
        <p className="divider-gold mb-5">{settings?.instagram_eyebrow || "@sahajanandjewellers"}</p>
        <h2 className="font-serif text-4xl md:text-5xl mb-3">{settings?.instagram_heading || "Follow Us on Instagram"}</h2>
        <p className="text-sm text-muted-foreground">{settings?.instagram_subheading || "A glimpse into our world"}</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 md:gap-3">
        {posts.map((post, i) => (
          <a
            key={post._id}
            href={post.link}
            target={post.link !== "#" ? "_blank" : undefined}
            rel={post.link !== "#" ? "noopener noreferrer" : undefined}
            className="group relative block aspect-square overflow-hidden bg-secondary animate-fade-up"
            style={{ animationDelay: `${i * 0.05}s` }}
          >
            <img
              src={getImageUrl(post.image_url)}
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
