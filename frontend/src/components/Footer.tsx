import { Link } from "@tanstack/react-router";
import { Instagram, Facebook, Twitter, Youtube, MapPin, Phone, Mail } from "lucide-react";

const policyLinks = [
  { slug: "exchange-policy", label: "Exchange Policy" },
  { slug: "return-refund-policy", label: "Return & Refund" },
  { slug: "privacy-policy", label: "Privacy Policy" },
  { slug: "terms-and-conditions", label: "Terms & Conditions" },
  { slug: "cancellation-policy", label: "Cancellation Policy" },
  { slug: "authenticity-policy", label: "Authenticity" },
  { slug: "buyback-policy", label: "Buyback & Resale" },
] as const;

const exploreLinks = [
  { to: "/gallery", label: "Gallery" },
  { to: "/blog", label: "Journal" },
  { to: "/about", label: "About Us" },
  { to: "/contact", label: "Contact Us" },
] as const;

export function Footer() {
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
            <h4 className="text-xs tracking-luxe text-gold mb-5">Explore</h4>
            <ul className="space-y-3 text-sm text-ivory/70">
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
            <h4 className="text-xs tracking-luxe text-gold mb-5">Policies</h4>
            <ul className="space-y-3 text-sm text-ivory/70">
              {policyLinks.map((p) => (
                <li key={p.slug}>
                  <Link
                    to="/policies/$slug"
                    params={{ slug: p.slug }}
                    className="hover:text-gold transition-colors"
                  >
                    {p.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact + Newsletter */}
          <div>
            <h4 className="text-xs tracking-luxe text-gold mb-5">Get in Touch</h4>
            <ul className="space-y-3 text-sm text-ivory/70 mb-8">
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

            <h5 className="text-xs tracking-luxe text-gold mb-3">Newsletter</h5>
            <form
              className="flex border-b border-ivory/30 focus-within:border-gold transition-colors"
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 bg-transparent py-3 text-sm placeholder:text-ivory/40 outline-none"
              />
              <button
                type="submit"
                className="text-xs tracking-luxe text-gold hover:text-ivory transition-colors px-2"
              >
                Subscribe →
              </button>
            </form>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-ivory/10 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-ivory/40 tracking-wide">
          <p>© {new Date().getFullYear()} Maison Aurum. All rights reserved.</p>
          <p>Made with care in India.</p>
        </div>
      </div>
    </footer>
  );
}
