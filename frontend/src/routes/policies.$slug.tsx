import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, ShieldCheck, Loader2 } from "lucide-react";
import { fetchPolicy, fetchPolicies, Policy } from "@/lib/api";

export const Route = createFileRoute("/policies/$slug")({
  component: PolicyPage,
});

function PolicyPage() {
  const { slug } = useParams({ from: "/policies/$slug" });

  const { data: policy, isLoading, error } = useQuery({
    queryKey: ["policy", slug],
    queryFn: () => fetchPolicy(slug),
  });

  const { data: allPolicies } = useQuery({
    queryKey: ["policies"],
    queryFn: fetchPolicies,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ivory">
        <Loader2 className="animate-spin h-12 w-12 text-gold/40" />
      </div>
    );
  }

  if (error || !policy) {
    return (
      <div className="container-luxe py-32 text-center bg-ivory min-h-screen pt-40">
        <h1 className="font-serif text-4xl mb-4">Policy not found</h1>
        <Link to="/" className="text-gold tracking-luxe text-xs">
          ← BACK HOME
        </Link>
      </div>
    );
  }

  const others = allPolicies?.filter((p) => p.slug !== policy.slug) || [];

  return (
    <div className="pt-28 pb-24 bg-ivory min-h-screen">
      <div className="container-luxe">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs tracking-luxe text-muted-foreground hover:text-gold mb-10 transition-colors"
        >
          <ArrowLeft size={14} /> BACK HOME
        </Link>

        <div className="grid lg:grid-cols-[280px_1fr] gap-16">
          {/* Sidebar */}
          <aside className="lg:sticky lg:top-28 self-start">
            <p className="text-xs tracking-luxe text-gold mb-5 flex items-center gap-2">
              <ShieldCheck size={13} /> POLICIES
            </p>
            <nav className="space-y-1">
              {allPolicies?.map((p) => (
                <Link
                  key={p.slug}
                  to="/policies/$slug"
                  params={{ slug: p.slug }}
                  className={`block py-2 text-sm border-l-2 pl-4 transition-all ${
                    p.slug === slug 
                      ? "border-gold text-gold" 
                      : "border-transparent text-onyx/40 hover:border-gold/30 hover:text-onyx"
                  }`}
                >
                  {p.title}
                </Link>
              ))}
            </nav>
          </aside>

          {/* Content */}
          <article className="animate-fade-up max-w-3xl">
            <p className="divider-gold mb-5">Legal Document</p>
            <h1 className="font-serif text-4xl md:text-6xl tracking-tight mb-6 text-onyx">
              {policy.title}
            </h1>
            <p className="text-lg text-onyx/60 leading-relaxed mb-12 italic font-serif">
              {policy.intro}
            </p>

            <div className="space-y-12">
              {policy.sections.map((s, i) => (
                <section key={i} className="animate-fade-up" style={{ animationDelay: `${i * 0.1}s` }}>
                  <h2 className="font-serif text-2xl md:text-3xl mb-5 flex items-baseline gap-4 text-onyx">
                    <span className="text-gold text-sm tracking-luxe opacity-40">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {s.heading}
                  </h2>
                  <ul className="space-y-4">
                    {s.body.map((line, k) => (
                      <li
                        key={k}
                        className="text-onyx/70 leading-relaxed pl-6 relative before:content-[''] before:absolute before:left-0 before:top-[0.6em] before:h-[1px] before:w-3 before:bg-gold/40"
                      >
                        {line}
                      </li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>

            <div className="mt-16 pt-12 border-t border-onyx/5 text-sm text-onyx/40">
              <p>
                For any clarifications regarding our policies, please contact our Legal Atelier at{" "}
                <a
                  href="mailto:care@maisonaurum.com"
                  className="text-gold hover:underline transition-all"
                >
                  care@maisonaurum.com
                </a>
              </p>
              <p className="mt-4 text-[10px] tracking-widest uppercase">
                Last updated: 2026 Edition
              </p>
            </div>

            {/* Continue reading */}
            {others.length > 0 && (
              <div className="mt-24">
                <p className="divider-gold mb-5">Next Reading</p>
                <div className="grid sm:grid-cols-2 gap-4">
                  {others.slice(0, 4).map((p) => (
                    <Link
                      key={p.slug}
                      to="/policies/$slug"
                      params={{ slug: p.slug }}
                      className="group block border border-onyx/5 p-6 hover:border-gold/30 hover:bg-white transition-all duration-500 shadow-sm hover:shadow-luxe bg-white/50"
                    >
                      <p className="text-[0.65rem] tracking-luxe text-gold mb-2 uppercase opacity-60">
                        POLICY
                      </p>
                      <p className="font-serif text-lg text-onyx group-hover:text-gold transition-colors">
                        {p.title} →
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </article>
        </div>
      </div>
    </div>
  );
}
