import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { fetchBlog, fetchBlogs, type BlogPost as BlogPostType } from "@/lib/api";
import { Calendar, Clock, ArrowLeft, ArrowRight, Share2 } from "lucide-react";

export const Route = createFileRoute("/blog/$slug")({
  component: BlogPost,
});

function BlogPost() {
  const { slug } = Route.useParams();
  const [post, setPost] = useState<BlogPostType | null>(null);
  const [related, setRelated] = useState<BlogPostType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
        const [p, all] = await Promise.all([fetchBlog(slug), fetchBlogs()]);
        setPost(p);
        setRelated(all.filter((item: any) => item.slug !== p.slug).slice(0, 3));
        setError(null);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
    window.scrollTo(0, 0);
  }, [slug]);

  if (isLoading)
    return (
      <div className="py-60 flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
        <p className="animate-pulse text-gold uppercase tracking-[0.4em] text-[10px] font-bold">Unfolding Journal...</p>
      </div>
    );

  if (error || !post) {
    return (
      <div className="container-luxe py-40 text-center">
        <p className="divider-gold mx-auto mb-8">Not Found</p>
        <h1 className="font-serif text-5xl mb-6">Article not found</h1>
        <Link 
          to="/blog" 
          className="inline-flex items-center gap-3 text-gold tracking-luxe text-[10px] font-bold hover:text-onyx transition-colors duration-300"
        >
          <ArrowLeft size={14} /> BACK TO JOURNAL
        </Link>
      </div>
    );
  }

  return (
    <article className="bg-[#F9F8F6]">
      {/* Editorial Header */}
      <header className="relative pt-32 pb-16 md:pt-48 md:pb-24">
        <div className="container-luxe max-w-4xl text-center">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2.5 text-[10px] tracking-[0.4em] text-gold hover:text-onyx transition-colors duration-500 mb-10 font-bold uppercase"
          >
            <ArrowLeft size={12} /> The Journal
          </Link>
          
          <div className="flex items-center justify-center gap-4 mb-8">
            <span className="h-px w-8 bg-gold opacity-40" />
            <p className="text-[10px] tracking-[0.4em] text-gray-500 font-bold uppercase">
              {post.category}
            </p>
            <span className="h-px w-8 bg-gold opacity-40" />
          </div>

          <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl leading-[1.1] text-gray-900 mb-10 animate-fade-up">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-[10px] tracking-widest text-muted-foreground uppercase font-medium">
            <span className="flex items-center gap-2">
              <Calendar size={12} className="text-gold" /> {post.date}
            </span>
            <span className="flex items-center gap-2">
              <Clock size={12} className="text-gold" /> {post.readTime}
            </span>
          </div>
        </div>
      </header>

      {/* Immersive Hero Image */}
      <section className="container-luxe mb-20 md:mb-32">
        <div className="aspect-[21/10] overflow-hidden shadow-luxe group">
          <img
            src={post.image}
            alt={post.title}
            className="h-full w-full object-cover transition-transform duration-[2000ms] group-hover:scale-105"
          />
        </div>
      </section>

      {/* Article Content */}
      <section className="container-luxe pb-24 md:pb-40">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_minmax(auto,768px)_1fr] gap-8">
          {/* Side spacing for desktop editorial feel */}
          <aside className="hidden lg:block sticky top-32 h-fit">
            <div className="flex flex-col gap-6 items-center">
              <p className="vertical-text text-[9px] tracking-[0.5em] text-gold font-bold uppercase opacity-60 mb-4 whitespace-nowrap">
                SHARE PASSION
              </p>
              <button className="p-3 rounded-full border border-gold/20 text-gold hover:bg-gold hover:text-white transition-all duration-300">
                <Share2 size={16} />
              </button>
            </div>
          </aside>

          <div className="prose-luxury animate-fade-up">
            <div className="space-y-10 text-slate-700 leading-[1.85] md:leading-[2.1] text-[17px] md:text-[19px]">
              {post.content.map((para: string, i: number) => (
                <p 
                  key={i} 
                  className={i === 0 ? "first-letter:text-7xl first-letter:font-serif first-letter:text-gold first-letter:float-left first-letter:mr-5 first-letter:mt-2 first-letter:leading-none" : ""}
                >
                  {para}
                </p>
              ))}
            </div>

          </div>
          
          <div className="hidden lg:block" />
        </div>
      </section>

      {/* Refined Related Stories */}
      <section className="bg-white py-24 md:py-32 border-t border-gray-100">
        <div className="container-luxe">
          <div className="text-center mb-16">
            <p className="divider-gold mx-auto mb-6">Continue Reading</p>
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl">Further Stories</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
            {related.map((p, i) => (
              <Link
                key={p.slug}
                to="/blog/$slug"
                params={{ slug: p.slug }}
                className="group block animate-fade-up"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="overflow-hidden aspect-[4/5] mb-8 bg-secondary/20 relative">
                  <img
                    src={p.image}
                    alt={p.title}
                    className="h-full w-full object-cover transition-transform duration-[1.5s] group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-onyx/0 group-hover:bg-onyx/5 transition-colors duration-700" />
                </div>
                <div className="text-center">
                  <p className="text-[9px] tracking-[0.4em] text-gold mb-4 font-bold uppercase">
                    {p.category}
                  </p>
                  <h3 className="font-serif text-2xl mb-4 group-hover:text-gold transition-colors duration-500">
                    {p.title}
                  </h3>
                  <div className="inline-flex items-center gap-2 text-[10px] tracking-[0.3em] font-bold text-gray-400 group-hover:text-gold transition-colors duration-500 uppercase">
                    Read More <ArrowRight size={14} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </article>
  );
}
