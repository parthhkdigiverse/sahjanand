import { Link } from "@tanstack/react-router";
import { Search, Menu, X, Phone } from "lucide-react";
import { useEffect, useState } from "react";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/shop", label: "Shop" },
] as const;

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      {/* Main bar */}
      <div
        className={`transition-all duration-500 border-b ${
          scrolled
            ? "bg-background/95 backdrop-blur-xl border-border/60 py-3 shadow-card"
            : "bg-background/85 backdrop-blur-md border-transparent py-5"
        }`}
      >
        <div className="container-luxe grid grid-cols-[auto_1fr_auto] md:grid-cols-3 items-center gap-4">
          {/* Left: mobile menu / desktop nav */}
          <div className="flex items-center justify-start">
            <button
              onClick={() => setOpen((v) => !v)}
              className="md:hidden text-foreground p-1 -ml-1"
              aria-label="Menu"
            >
              {open ? <X size={22} /> : <Menu size={22} />}
            </button>

            <nav className="hidden md:flex items-center gap-8 text-xs uppercase tracking-luxe text-foreground">
              {navLinks.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  className="relative py-1 hover:text-gold transition-colors after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-gold hover:after:w-full after:transition-all"
                  activeProps={{ className: "text-gold" }}
                  activeOptions={{ exact: l.to === "/" }}
                >
                  {l.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Center: logo */}
          <Link to="/" className="text-center justify-self-center">
            <div className="font-serif text-2xl md:text-3xl tracking-wide leading-none text-foreground">
              Maison <span className="text-gold italic">Aurum</span>
            </div>
            <div className="text-[0.6rem] tracking-luxe text-muted-foreground mt-1 hidden sm:block">
              FINE JEWELLERY · EST. 1948
            </div>
          </Link>

          {/* Right: nav + search */}
          <div className="flex items-center justify-end gap-6 text-foreground">
            <button
              aria-label="Search"
              className="hover:text-gold transition-colors"
            >
              <Search size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-background border-b border-border animate-fade-up">
          <nav className="container-luxe py-6 flex flex-col gap-1 text-sm uppercase tracking-luxe">
            {navLinks.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="py-3 border-b border-border/50 hover:text-gold transition-colors"
                activeProps={{ className: "text-gold" }}
                activeOptions={{ exact: l.to === "/" }}
              >
                {l.label}
              </Link>
            ))}
            <a
              href="tel:+912240000000"
              className="py-3 mt-2 text-gold flex items-center gap-2"
            >
              <Phone size={14} /> +91 22 4000 0000
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
