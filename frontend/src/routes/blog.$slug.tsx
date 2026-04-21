import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Calendar, Clock, ArrowLeft, ArrowRight } from "lucide-react";
import { blogPosts, getBlogBySlug } from "@/lib/blog";

export const Route = createFileRoute("/blog/$slug")({
  loader: ({ params }) => {
    const post = getBlogBySlug(params.slug);
    if (!post) throw notFound();
    return { post };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.post.title} · Maison Aurum` },
          { name: "description", content: loaderData.post.excerpt },
          { property: "og:title", content: loaderData.post.title },
          { property: "og:description", content: loaderData.post.excerpt },
          { property: "og:image", content: loaderData.post.image },
          { name: "twitter:image", content: loaderData.post.image },
        ]
      : [],
  }),
  component: BlogPost,
  notFoundComponent: () => (
    <div className="container-luxe py-32 text-center">
      <h1 className="font-serif text-4xl mb-4">Article not found</h1>
      <Link to="/blog" className="text-gold tracking-luxe text-xs">
        ← BACK TO JOURNAL
      </Link>
    </div>
  ),
  errorComponent: ({ error }) => (
    <div className="container-luxe py-32 text-center">
      <p className="text-sm text-muted-foreground">{error.message}</p>
    </div>
  ),
});

function BlogPost() {
  const { post } = Route.useLoaderData();
  const related = blogPosts.filter((p) => p.slug !== post.slug).slice(0, 3);

  return (
    <article className="pt-28 pb-24">
      {/* Hero */}
      <div className="container-luxe text-center mb-12 animate-fade-up">
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 text-xs tracking-luxe text-muted-foreground hover:text-gold mb-8"
        >
          <ArrowLeft size={14} /> JOURNAL
        </Link>
        <p className="text-xs tracking-luxe text-gold mb-5">
          {post.category.toUpperCase()}
        </p>
        <h1 className="font-serif text-4xl md:text-6xl tracking-tight max-w-3xl mx-auto leading-tight mb-6">
          {post.title}
        </h1>
        <div className="flex items-center justify-center gap-6 text-xs text-muted-foreground tracking-wide">
          <span className="flex items-center gap-1.5">
            <Calendar size={12} /> {post.date}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock size={12} /> {post.readTime}
          </span>
        </div>
      </div>

      {/* Image */}
      <div className="container-luxe mb-16 animate-fade-up">
        <div className="aspect-[16/9] overflow-hidden">
          <img
            src={post.image}
            alt={post.title}
            className="h-full w-full object-cover"
          />
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-6 animate-fade-up">
        <div className="space-y-6 text-foreground/85 leading-[1.85] text-[1.05rem]">
          {post.content.map((para: string, i: number) => (
            <p key={i} className={i === 0 ? "first-letter:font-serif first-letter:text-5xl first-letter:text-gold first-letter:float-left first-letter:mr-3 first-letter:leading-none first-letter:mt-1" : ""}>
              {para}
            </p>
          ))}
        </div>

        <div className="mt-16 pt-8 border-t border-border text-center">
          <p className="text-xs tracking-luxe text-muted-foreground mb-3">
            WRITTEN BY
          </p>
          <p className="font-serif text-xl">The Maison Aurum Atelier</p>
        </div>
      </div>

      {/* Related */}
      <section className="container-luxe mt-24">
        <div className="text-center mb-10">
          <p className="divider-gold mb-4">Continue Reading</p>
          <h2 className="font-serif text-3xl md:text-4xl">More Stories</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {related.map((p) => (
            <Link
              key={p.slug}
              to="/blog/$slug"
              params={{ slug: p.slug }}
              className="group block"
            >
              <div className="overflow-hidden img-zoom aspect-[4/5] mb-4">
                <img
                  src={p.image}
                  alt={p.title}
                  className="h-full w-full object-cover"
                />
              </div>
              <p className="text-[0.65rem] tracking-luxe text-gold mb-2">
                {p.category.toUpperCase()}
              </p>
              <h3 className="font-serif text-xl mb-3 group-hover:text-gold transition-colors">
                {p.title}
              </h3>
              <span className="text-xs tracking-luxe text-gold inline-flex items-center gap-2">
                READ <ArrowRight size={12} />
              </span>
            </Link>
          ))}
        </div>
      </section>
    </article>
  );
}
