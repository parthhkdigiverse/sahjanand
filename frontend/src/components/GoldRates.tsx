import { useEffect, useRef, useState } from "react";
import { TrendingUp, TrendingDown, Sparkles, ShieldCheck, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchGoldPrices } from "@/lib/api";

function useCountUp(target: number, duration = 1200, start = false) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!start) return;
    let raf = 0;
    const t0 = performance.now();
    const step = (t: number) => {
      const p = Math.min((t - t0) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(Math.round(target * eased));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, duration, start]);
  return value;
}

export function GoldRates() {
  const sectionRef = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);

  const { data: priceData, isLoading } = useQuery({
    queryKey: ["gold-prices"],
    queryFn: fetchGoldPrices,
    refetchInterval: 1000 * 60 * 30, // Refetch every 30 mins
  });

  useEffect(() => {
    if (!sectionRef.current) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setInView(true);
            obs.disconnect();
          }
        });
      },
      { threshold: 0.2 },
    );
    obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  const rates = priceData ? [
    {
      karat: "18K",
      price: priceData.price_18k,
      change: priceData.change,
      dir: priceData.change >= 0 ? "up" as const : "down" as const,
      purity: "75.0%",
      note: "Daily wear",
    },
    {
      karat: "22K",
      price: priceData.price_22k,
      change: priceData.change,
      dir: priceData.change >= 0 ? "up" as const : "down" as const,
      purity: "91.6%",
      note: "Bridal favourite",
      featured: true,
    },
    {
      karat: "24K",
      price: priceData.price_24k,
      change: priceData.change,
      dir: priceData.change >= 0 ? "up" as const : "down" as const,
      purity: "99.9%",
      note: "Pure investment",
    },
  ] : [];

  return (
    <section ref={sectionRef} className="relative overflow-hidden py-24 md:py-32">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[28rem] h-[28rem] gradient-gold opacity-[0.06] blur-[120px] rounded-full" />
        <div className="absolute bottom-1/4 right-1/4 w-[24rem] h-[24rem] gradient-gold opacity-[0.05] blur-[120px] rounded-full" />
      </div>

      <div className="container-luxe relative">
        <div className="text-center mb-16 animate-fade-up">
          <p className="divider-gold mb-5">Today's Rates</p>
          <h2 className="font-serif text-4xl md:text-6xl mb-4 tracking-tight">
            Daily Gold Price
          </h2>
          <p className="text-sm text-muted-foreground inline-flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Live · {today} · Per gram in INR
          </p>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="animate-spin h-10 w-10 text-gold/40" />
            <span className="text-[10px] uppercase tracking-[0.3em] text-onyx/20">Accessing Market...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {rates.map((r, i) => (
              <RateCard key={r.karat} rate={r} index={i} inView={inView} />
            ))}
          </div>
        )}

        <p className="text-center text-xs tracking-luxe text-muted-foreground mt-12 inline-flex items-center gap-2 w-full justify-center">
          <ShieldCheck size={13} className="text-gold" />
          BIS Hallmark Certified · Rates revised daily {priceData?.source === 'api' ? 'automatically' : 'at 10:00 AM IST'}
        </p>
      </div>
    </section>
  );
}

function RateCard({
  rate,
  index,
  inView,
}: {
  rate: any;
  index: number;
  inView: boolean;
}) {
  const value = useCountUp(rate.price, 1400, inView);
  const isFeatured = rate.featured;

  return (
    <div
      className="group relative animate-fade-up"
      style={{ animationDelay: `${index * 0.12}s` }}
    >
      <div className="absolute -inset-px gradient-gold opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm" />

      <div
        className={`relative bg-card border p-10 transition-all duration-500 hover:-translate-y-2 hover:shadow-luxe ${
          isFeatured
            ? "border-gold/40 shadow-luxe md:scale-[1.03]"
            : "border-border shadow-card"
        }`}
      >
        {isFeatured && (
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 gradient-gold text-[0.65rem] tracking-luxe text-onyx flex items-center gap-1.5">
            <Sparkles size={11} />
            MOST POPULAR
          </div>
        )}

        <div className="absolute top-0 right-0 w-32 h-32 gradient-gold opacity-[0.08] blur-3xl pointer-events-none transition-opacity duration-500 group-hover:opacity-20" />

        <div className="flex items-start justify-between mb-10">
          <div>
            <p className="font-serif text-6xl leading-none">
              {rate.karat}
              <span className="text-gold">.</span>
            </p>
            <p className="text-[0.7rem] tracking-luxe text-muted-foreground mt-3 uppercase">
              Purity {rate.purity}
            </p>
          </div>
          <div
            className={`flex items-center gap-1.5 text-xs font-medium tracking-wide px-3 py-1.5 rounded-full transition-transform group-hover:scale-105 ${
              rate.dir === "up"
                ? "bg-emerald-50 text-emerald-700"
                : "bg-rose-50 text-rose-700"
            }`}
          >
            {rate.dir === "up" ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
            {rate.dir === "up" ? "+" : ""}
            {rate.change}%
          </div>
        </div>

        <div className="flex items-baseline gap-2">
          <span className="text-base text-muted-foreground">₹</span>
          <span className="font-serif text-5xl md:text-6xl tracking-tight tabular-nums">
            {value.toLocaleString("en-IN")}
          </span>
          <span className="text-xs text-muted-foreground tracking-wide">/ gram</span>
        </div>

        <p className="text-xs text-muted-foreground mt-3 italic">{rate.note}</p>

        <div className="mt-10 pt-6 border-t border-border flex items-center justify-between text-xs">
          <span className="text-muted-foreground tracking-wide flex items-center gap-1.5">
            <ShieldCheck size={12} className="text-gold" />
            Hallmark Certified
          </span>
          <button className="relative text-gold tracking-luxe font-medium overflow-hidden group/btn">
            <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">
              Book Visit →
            </span>
            <span className="absolute bottom-0 left-0 w-full h-px bg-gold scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
          </button>
        </div>
      </div>
    </div>
  );
}
