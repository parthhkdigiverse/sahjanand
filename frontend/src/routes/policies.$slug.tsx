import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { policies, getPolicy } from "@/lib/policies";

export const Route = createFileRoute("/policies/$slug")({
  loader: ({ params }) => {
    const policy = getPolicy(params.slug);
    if (!policy) throw notFound();
    return { policy };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.policy.title} · Maison Aurum` },
          { name: "description", content: loaderData.policy.intro },
          { property: "og:title", content: loaderData.policy.title },
          { property: "og:description", content: loaderData.policy.intro },
        ]
      : [],
  }),
  component: PolicyPage,
  notFoundComponent: () => (
    <div className="container-luxe py-32 text-center">
      <h1 className="font-serif text-4xl mb-4">Policy not found</h1>
      <Link to="/" className="text-gold tracking-luxe text-xs">
        ← BACK HOME
      </Link>
    </div>
  ),
  errorComponent: ({ error }) => (
    <div className="container-luxe py-32 text-center">
      <p className="text-sm text-muted-foreground">{error.message}</p>
    </div>
  ),
});

function PolicyPage() {
  const { policy } = Route.useLoaderData();
  const others = policies.filter((p) => p.slug !== policy.slug);

  return (
    <div className="pt-28 pb-24">
      <div className="container-luxe">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs tracking-luxe text-muted-foreground hover:text-gold mb-10"
        >
          <ArrowLeft size={14} /> BACK
        </Link>

        <div className="grid lg:grid-cols-[280px_1fr] gap-16">
          {/* Sidebar */}
          <aside className="lg:sticky lg:top-28 self-start">
            <p className="text-xs tracking-luxe text-gold mb-5 flex items-center gap-2">
              <ShieldCheck size={13} /> POLICIES
            </p>
            <nav className="space-y-1">
              {policies.map((p) => (
                <Link
                  key={p.slug}
                  to="/policies/$slug"
                  params={{ slug: p.slug }}
                  className="block py-2 text-sm border-l-2 border-transparent pl-4 hover:border-gold hover:text-gold transition-all"
                  activeProps={{
                    className:
                      "block py-2 text-sm border-l-2 border-gold pl-4 text-gold",
                  }}
                >
                  {p.title}
                </Link>
              ))}
            </nav>
          </aside>

          {/* Content */}
          <article className="animate-fade-up max-w-3xl">
            <p className="divider-gold mb-5">Policy</p>
            <h1 className="font-serif text-4xl md:text-6xl tracking-tight mb-6">
              {policy.title}
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed mb-12 italic">
              {policy.intro}
            </p>

            <div className="space-y-12">
              {policy.sections.map((s: { heading: string; body: string[] }, i: number) => (
                <section key={i}>
                  <h2 className="font-serif text-2xl md:text-3xl mb-5 flex items-baseline gap-4">
                    <span className="text-gold text-sm tracking-luxe">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {s.heading}
                  </h2>
                  <ul className="space-y-3">
                    {s.body.map((line: string, k: number) => (
                      <li
                        key={k}
                        className="text-foreground/80 leading-relaxed pl-6 relative before:content-[''] before:absolute before:left-0 before:top-3 before:h-px before:w-3 before:bg-gold/40"
                      >
                        {line}
                      </li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>

            <div className="mt-16 pt-8 border-t border-border text-sm text-muted-foreground">
              <p>
                Questions? Write to{" "}
                <a
                  href="mailto:care@maisonaurum.com"
                  className="text-gold hover:underline"
                >
                  care@maisonaurum.com
                </a>{" "}
                or call <span className="text-foreground">+91 22 4000 0000</span>.
              </p>
              <p className="mt-2 text-xs tracking-wide">
                Last updated: April 2026
              </p>
            </div>

            {/* Continue reading */}
            <div className="mt-20">
              <p className="divider-gold mb-5">More Policies</p>
              <div className="grid sm:grid-cols-2 gap-4">
                {others.slice(0, 4).map((p) => (
                  <Link
                    key={p.slug}
                    to="/policies/$slug"
                    params={{ slug: p.slug }}
                    className="group block border border-border p-5 hover:border-gold transition-colors"
                  >
                    <p className="text-[0.65rem] tracking-luxe text-gold mb-2">
                      POLICY
                    </p>
                    <p className="font-serif text-lg group-hover:text-gold transition-colors">
                      {p.title} →
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          </article>
        </div>
      </div>
    </div>
  );
}
