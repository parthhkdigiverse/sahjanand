import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Instagram, Facebook, Twitter, Youtube, MapPin, Phone, Mail, Clock } from "lucide-react";
import { fetchPolicies, fetchSettings } from "@/lib/api";

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

  const { data: settings } = useQuery({
    queryKey: ["settings"],
    queryFn: fetchSettings,
  });

  const s = settings || {
    contact_address: "Opp. Kidney Hospital, Nadiad, Gujarat, India",
    contact_phone: "+91 95123 06199",
    contact_email: "info@sahajanandjewellers.com",
    instagram_url: "#",
    facebook_url: "#",
    twitter_url: "#",
    youtube_url: "#",
  };

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
              Sahajanand <span className="text-gold italic">Jewellers</span>
            </div>
            <p className="text-sm text-ivory/60 leading-relaxed mb-6">
              Fine jewellery, made by hand. Designed to be loved for a lifetime.
            </p>
            <div className="flex gap-4 text-ivory/70">
              <a href={s.instagram_url} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="hover:text-gold transition-colors"><Instagram size={18} /></a>
              <a href={s.facebook_url} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="hover:text-gold transition-colors"><Facebook size={18} /></a>
              <a href={s.twitter_url} target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="hover:text-gold transition-colors"><Twitter size={18} /></a>
              <a href={s.youtube_url} target="_blank" rel="noopener noreferrer" aria-label="Youtube" className="hover:text-gold transition-colors"><Youtube size={18} /></a>
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
                <span>Opp. Kidney Hospital, Nadiad, Gujarat</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={14} className="text-gold shrink-0" />
                <a href="tel:+919512306199" className="hover:text-gold transition-colors">
                  +91 95123 06199
                </a>
              </li>
              <li className="flex items-center gap-2 text-[10px] tracking-wide text-ivory/50 mt-4 uppercase">
                <Clock size={14} className="text-gold shrink-0" />
                <span>Mon to Sat : 10:30 to 7:30</span>
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
          <p>© {new Date().getFullYear()} Sahajanand Jewellers. All rights reserved.</p>
          <p>Made with care in India.</p>
        </div>
      </div>
    </footer>
  );
}
