import { motion } from "framer-motion";

const HallmarkIcon = () => (
  <svg viewBox="0 0 100 100" className="w-10 h-10 md:w-12 md:h-12 text-gold fill-none stroke-current stroke-[1.5]">
    <path d="M50 15L85 75H15L50 15Z" />
    <path d="M50 35L65 60H35L50 35Z" />
    <path d="M45 45L50 55L55 45" />
    <text x="50" y="88" textAnchor="middle" fontSize="12" fontWeight="bold" fill="currentColor" stroke="none">BIS 916</text>
  </svg>
);

const TransparencyIcon = () => (
  <svg viewBox="0 0 100 100" className="w-10 h-10 md:w-12 md:h-12 text-gold fill-none stroke-current stroke-[1.5]">
    <rect x="25" y="20" width="40" height="50" rx="2" />
    <line x1="30" y1="30" x2="60" y2="30" />
    <line x1="30" y1="40" x2="60" y2="40" />
    <line x1="30" y1="50" x2="50" y2="50" />
    <path d="M30 60 L40 60" />
    <circle cx="65" cy="65" r="15" fill="white" />
    <circle cx="65" cy="65" r="15" />
    <line x1="75" y1="75" x2="85" y2="85" />
    <text x="35" y="45" fontSize="10" fill="currentColor" stroke="none">₹</text>
  </svg>
);

const MaintenanceIcon = () => (
  <svg viewBox="0 0 100 100" className="w-10 h-10 md:w-12 md:h-12 text-gold fill-none stroke-current stroke-[1.5]">
    <circle cx="50" cy="50" r="30" />
    <path d="M50 20 A30 30 0 0 1 80 50" strokeDasharray="4 2" />
    <circle cx="50" cy="50" r="10" />
    <path d="M50 40 L50 35 M50 65 L50 60 M40 50 L35 50 M65 50 L60 50" />
    <path d="M70 70 L75 75 M75 70 L70 75" />
    <path d="M50 10 A40 40 0 0 1 90 50" strokeDasharray="5 5" />
    <path d="M50 90 A40 40 0 0 1 10 50" strokeDasharray="5 5" />
    <path d="M85 50 L95 50 L90 45" />
  </svg>
);

const DiamondsIcon = () => (
  <svg viewBox="0 0 100 100" className="w-10 h-10 md:w-12 md:h-12 text-gold fill-none stroke-current stroke-[1.5]">
    <path d="M50 20 L80 40 L50 80 L20 40 Z" />
    <path d="M20 40 L80 40 M35 40 L50 20 L65 40 M35 40 L50 80 L65 40" />
    <circle cx="75" cy="25" r="10" />
    <path d="M70 25 L75 30 L80 20" />
    <path d="M15 20 L20 25 L15 30" />
  </svg>
);

const BuybackIcon = () => (
  <svg viewBox="0 0 100 100" className="w-10 h-10 md:w-12 md:h-12 text-gold fill-none stroke-current stroke-[1.5]">
    <path d="M30 30 C30 10, 70 10, 70 30 L70 50 C70 70, 30 70, 30 50 Z" />
    <circle cx="50" cy="70" r="5" />
    <path d="M80 50 A30 30 0 1 1 20 50" strokeDasharray="5 5" />
    <path d="M15 50 L20 55 L25 50" />
    <path d="M85 50 L80 45 L75 50" />
  </svg>
);

const InsuranceIcon = () => (
  <svg viewBox="0 0 100 100" className="w-10 h-10 md:w-12 md:h-12 text-gold fill-none stroke-current stroke-[1.5]">
    <path d="M50 15 L80 25 V50 C80 70 50 85 50 85 C50 85 20 70 20 50 V25 L50 15Z" />
    <path d="M40 45 L70 65 L40 85 Z" className="opacity-0" /> {/* Spacer */}
    <path d="M40 45 L60 45 L50 65 L40 45 Z" transform="translate(0, 5) scale(0.8)" />
    <path d="M45 40 L55 40 L50 30 Z" transform="translate(0, 5) scale(0.8)" />
  </svg>
);

const PriceIcon = () => (
  <svg viewBox="0 0 100 100" className="w-10 h-10 md:w-12 md:h-12 text-gold fill-none stroke-current stroke-[1.5]">
    <path d="M20 30 L60 30 L80 50 L40 50 Z" />
    <circle cx="30" cy="40" r="3" fill="currentColor" />
    <text x="45" y="45" fontSize="14" fontWeight="bold" fill="currentColor" stroke="none">₹</text>
    <path d="M20 60 L80 60" strokeDasharray="4 2" />
  </svg>
);

const AdvancePlansIcon = () => (
  <svg viewBox="0 0 100 100" className="w-10 h-10 md:w-12 md:h-12 text-gold fill-none stroke-current stroke-[1.5]">
    <path d="M20 70 C20 60, 40 50, 60 60 L80 40 L90 50 L70 70 Z" />
    <rect x="60" y="30" width="20" height="30" transform="rotate(15, 70, 45)" />
    <circle cx="40" cy="75" r="15" strokeDasharray="3 3" />
  </svg>
);

const promises = [
  {
    icon: TransparencyIcon,
    title: "Complete Transparency",
  },
  {
    icon: HallmarkIcon,
    title: "BIS 916 Hallmarked",
  },
  {
    icon: MaintenanceIcon,
    title: "Lifetime Maintenance",
  },
  {
    icon: DiamondsIcon,
    title: "Certified Diamonds",
  },
  {
    icon: BuybackIcon,
    title: "Guaranteed Buyback",
  },
  {
    icon: InsuranceIcon,
    title: "Jewellery Insurance",
  },
  {
    icon: PriceIcon,
    title: "Fair Price Policy",
  },
  {
    icon: AdvancePlansIcon,
    title: "Jewellery Advance Plans",
  },
];

export function TrustStrip() {
  return (
    <section className="bg-ivory relative overflow-hidden py-12 md:py-16 border-b border-gold/10">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/p6.png')]" />
      </div>
      
      {/* Central gold line */}
      <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-gold/30 to-transparent -translate-x-1/2 hidden md:block" />

      <div className="container-luxe relative z-10">
        <div className="flex flex-col items-center mb-12 md:mb-16">
          <motion.div 
            initial={{ height: 0 }}
            whileInView={{ height: 40 }}
            className="w-[1px] bg-gold/50 mb-6" 
          />
          <h2 className="font-serif text-3xl md:text-4xl tracking-[0.25em] text-onyx uppercase text-center">
            Sahajanand Promises
          </h2>
          <p className="mt-2 text-gold font-serif italic text-base tracking-widest">Our commitment to excellence</p>
        </div>

        <div className="relative group">
          {/* Side Fades for horizontal scroll */}
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-ivory via-ivory/80 to-transparent z-20 pointer-events-none md:hidden" />
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-ivory via-ivory/80 to-transparent z-20 pointer-events-none md:hidden" />

          <div className="flex overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory">
            <div className="flex flex-nowrap gap-6 md:gap-8 lg:gap-4 px-4 md:px-0 mx-auto w-max lg:w-full lg:grid lg:grid-cols-8">
              {promises.map((promise, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05, duration: 0.6, ease: "easeOut" }}
                  className="flex flex-col items-center text-center group/item shrink-0 w-[180px] sm:w-[220px] lg:w-full snap-center px-4"
                >
                  <div className="relative mb-6">
                    {/* Main Icon Container */}
                    <div className="w-20 h-20 md:w-24 md:h-24 rounded-full border border-gold/20 flex items-center justify-center bg-white shadow-soft group-hover/item:border-gold group-hover/item:shadow-luxe transition-all duration-700 relative z-10">
                      <div className="scale-100 md:scale-110 transition-transform duration-500 group-hover/item:scale-105">
                        <promise.icon />
                      </div>
                    </div>
                    
                    {/* Decorative Rings */}
                    <div className="absolute -inset-3 rounded-full border border-gold/5 group-hover/item:border-gold/10 transition-colors duration-700 animate-spin-slow" style={{ animationDuration: '20s' }} />
                    <div className="absolute -inset-1.5 rounded-full border border-gold/10 group-hover/item:border-gold/30 transition-colors duration-700" />
                    
                    {/* Glow Effect */}
                    <div className="absolute inset-0 rounded-full bg-gold/10 blur-2xl opacity-0 group-hover/item:opacity-100 transition-opacity duration-700" />
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-[10px] md:text-[11px] font-serif tracking-[0.1em] text-onyx uppercase leading-relaxed h-8 flex items-center justify-center font-bold">
                      {promise.title}
                    </h3>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
