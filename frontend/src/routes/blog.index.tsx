import { createFileRoute, Link } from '@tanstack/react-router'
import { useQuery } from "@tanstack/react-query";
import { fetchBlogs, type BlogPost, getImageUrl } from "@/lib/api";
import { Calendar, Clock, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/blog/")({
  component: BlogIndex,
  head: () => ({
    meta: [
      { title: "Journal · Maison Aurum" },
      {
        name: "description",
        content:
          "Stories, guides, and inspiration from the Maison Aurum atelier — jewellery care, trends, and timeless craft.",
      },
    ],
  }),
});

function BlogIndex() {
  const { data: blogPosts = [], isLoading } = useQuery({
    queryKey: ["blogs"],
    queryFn: fetchBlogs,
  });

  if (isLoading) return <div className="py-40 text-center animate-pulse text-gold uppercase tracking-widest text-xs">Unfolding Journal...</div>;
  if (!blogPosts.length) return <div className="py-40 text-center">No stories found yet.</div>;

  const [featured, ...rest] = blogPosts;

  return (
    <div className="pt-32 pb-24">
      <div className="container-luxe">
        <div className="text-center mb-16 animate-fade-up">
          <p className="divider-gold mb-5">Journal</p>
          <h1 className="font-serif text-5xl md:text-7xl tracking-tight mb-4">
            Stories & Guides
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Care tips, latest trends, and honest guides from our atelier.
          </p>
        </div>

        {/* Featured */}
        <Link
          to="/blog/$slug"
          params={{ slug: featured.slug }}
          className="group grid md:grid-cols-2 gap-10 mb-20 animate-fade-up"
        >
          <div className="overflow-hidden img-zoom aspect-[4/3]">
            <img
              src={getImageUrl(featured.image)}
              alt={featured.title}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="flex flex-col justify-center">
            <p className="text-xs tracking-luxe text-gold mb-4">
              FEATURED · {featured.category}
            </p>
            <h2 className="font-serif text-3xl md:text-5xl mb-5 leading-tight group-hover:text-gold transition-colors">
              {featured.title}
            </h2>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              {featured.excerpt}
            </p>
            <div className="flex items-center gap-5 text-xs text-muted-foreground tracking-wide mb-6">
              <span className="flex items-center gap-1.5">
                <Calendar size={12} /> {featured.date}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock size={12} /> {featured.readTime}
              </span>
            </div>
            <span className="text-xs tracking-luxe text-gold inline-flex items-center gap-2 group-hover:gap-3 transition-all">
              READ ARTICLE <ArrowRight size={14} />
            </span>
          </div>
        </Link>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {rest.map((post, i) => (
            <Link
              key={post.slug}
              to="/blog/$slug"
              params={{ slug: post.slug }}
              className="group block animate-fade-up"
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              <div className="overflow-hidden img-zoom aspect-[4/5] mb-5">
                <img
                  src={getImageUrl(post.image)}
                  alt={post.title}
                  className="h-full w-full object-cover"
                />
              </div>
              <p className="text-[0.65rem] tracking-luxe text-gold mb-3">
                {post.category.toUpperCase()}
              </p>
              <h3 className="font-serif text-2xl mb-3 leading-snug group-hover:text-gold transition-colors">
                {post.title}
              </h3>
              <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                {post.excerpt}
              </p>
              <div className="flex items-center gap-4 text-xs text-muted-foreground tracking-wide">
                <span className="flex items-center gap-1.5">
                  <Calendar size={11} /> {post.date}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock size={11} /> {post.readTime}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
