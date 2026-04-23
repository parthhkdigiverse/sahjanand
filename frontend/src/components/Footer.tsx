import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Instagram, Facebook, Twitter, Youtube, MapPin, Phone, Mail } from "lucide-react";
import { fetchPolicies } from "@/lib/api";

const exploreLinks = [
  { to: "/gallery", label: "Gallery" },
  { to: "/blog", label: "Journal" },
  { to: "/about", label: "About Us" },
  { to: "/contact", label: "Contact Us" },
] as const;

export function Footer() {
  const { data: policies } = useQuery({
    queryKey: ["policies"],
    queryFn: fetchPolicies,
  });

  return (
    <footer
      className="bg-onyx text-ivory mt-32"
      style={{ backgroundColor: "var(--onyx)", color: "var(--ivory)" }}
    >
      <div className="container-luxe py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div>
            <div className="font-serif text-2xl mb-6">
              Maison <span className="text-gold italic">Aurum</span>
            </div>
            <p className="text-sm text-ivory/60 leading-relaxed mb-6">
              Fine jewellery, made by hand. Designed to be loved for a lifetime.
            </p>
            <div className="flex gap-4 text-ivory/70">
              <a href="#" aria-label="Instagram" className="hover:text-gold transition-colors"><Instagram size={18} /></a>
              <a href="#" aria-label="Facebook" className="hover:text-gold transition-colors"><Facebook size={18} /></a>
              <a href="#" aria-label="Twitter" className="hover:text-gold transition-colors"><Twitter size={18} /></a>
              <a href="#" aria-label="Youtube" className="hover:text-gold transition-colors"><Youtube size={18} /></a>
            </div>
          </div>

          {/* Explore */}
          <div>
            <h4 className="text-xs tracking-luxe text-gold mb-5 uppercase">Explore</h4>
            <ul className="space-y-3 text-sm text-ivory/70 font-sans">
              {exploreLinks.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="hover:text-gold transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Policies */}
          <div>
            <h4 className="text-xs tracking-luxe text-gold mb-5 uppercase">Legal Documents</h4>
            <ul className="space-y-3 text-sm text-ivory/70 font-sans">
              {policies?.map((p) => (
                <li key={p.slug}>
                  <Link
                    to="/policies/$slug"
                    params={{ slug: p.slug }}
                    className="hover:text-gold transition-colors"
                  >
                    {p.title}
                  </Link>
                </li>
              ))}
              {!policies && <li className="text-xs opacity-20">Loading...</li>}
            </ul>
          </div>

          {/* Contact + Newsletter */}
          <div>
            <h4 className="text-xs tracking-luxe text-gold mb-5 uppercase">Get in Touch</h4>
            <ul className="space-y-3 text-sm text-ivory/70 mb-8 font-sans">
              <li className="flex items-start gap-2">
                <MapPin size={14} className="mt-1 text-gold shrink-0" />
                <span>14 Marine Drive, Mumbai · 400001, India</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={14} className="text-gold shrink-0" />
                <a href="tel:+912240000000" className="hover:text-gold transition-colors">
                  +91 22 4000 0000
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={14} className="text-gold shrink-0" />
                <a href="mailto:hello@maisonaurum.com" className="hover:text-gold transition-colors">
                  hello@maisonaurum.com
                </a>
              </li>
            </ul>

            <h5 className="text-[10px] tracking-widest text-ivory/40 mb-3 uppercase">Preserve our Heritage</h5>
            <form
              className="flex border-b border-ivory/10 focus-within:border-gold transition-colors py-1"
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                type="email"
                placeholder="Join the newsletter"
                className="flex-1 bg-transparent py-1 text-sm placeholder:text-ivory/20 outline-none"
              />
              <button
                type="submit"
                className="text-[10px] tracking-widest text-gold hover:text-ivory transition-colors px-2 uppercase"
              >
                Join →
              </button>
            </form>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-ivory/5 flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] text-ivory/20 tracking-[0.2em] uppercase font-sans">
          <p>© {new Date().getFullYear()} Maison Aurum. All rights reserved.</p>
          <p>Made with care in India.</p>
        </div>
      </div>
    </footer>
  );
}
