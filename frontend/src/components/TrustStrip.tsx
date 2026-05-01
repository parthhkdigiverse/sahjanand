import { ShieldCheck, Eye, Award, RefreshCw, Shield, Gem } from "lucide-react";
import { motion } from "framer-motion";

const promises = [
  {
    icon: ShieldCheck,
    title: "Fair Price Policy*",
  },
  {
    icon: Eye,
    title: "Absolute Transparency*",
  },
  {
    icon: Award,
    title: "916 Gold Purity*",
  },
  {
    icon: RefreshCw,
    title: "100% Buyback Of Gold*",
  },
  {
    icon: Shield,
    title: "Safe Jewellery Purchase Scheme*",
  },
  {
    icon: Gem,
    title: "Karat Analyser*",
  },
];

export function TrustStrip() {
  return (
    <section className="bg-ivory relative overflow-hidden border-b border-gold/10">
      {/* Decorative vertical line that runs through the section */}
      <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-gold/20 -translate-x-1/2 hidden md:block" />

      <div className="container-luxe px-4 relative z-10 py-16 md:py-24">
        {/* Title with decorative vertical lines */}
        <div className="flex flex-col items-center mb-16 md:mb-20">
          <div className="w-[1px] h-16 bg-gold/40 mb-8" />
          <h2 className="font-serif text-3xl md:text-4xl tracking-[0.2em] md:tracking-luxe text-onyx uppercase text-center">
            Sahajanand Promises
          </h2>
          <div className="w-[1px] h-16 bg-gold/40 mt-8" />
        </div>

        {/* Promises Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-y-12 gap-x-6 md:gap-12">
          {promises.map((promise, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              className="flex flex-col items-center text-center group"
            >
              <div className="relative mb-6">
                {/* Icon Circle Container */}
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-full border border-gold/30 flex items-center justify-center bg-white shadow-soft group-hover:border-gold group-hover:shadow-luxe transition-all duration-700 relative z-10">
                  <promise.icon className="w-8 h-8 md:w-10 md:h-10 text-gold group-hover:scale-110 transition-transform duration-500 stroke-[1.5]" />
                </div>
                
                {/* Decorative outer ring */}
                <div className="absolute -inset-2 rounded-full border border-gold/5 group-hover:border-gold/20 transition-colors duration-700" />
                
                {/* Decorative glow */}
                <div className="absolute inset-0 rounded-full bg-gold/5 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              </div>
              
              <h3 className="text-[11px] md:text-xs font-medium tracking-widest text-onyx/90 uppercase leading-relaxed max-w-[140px] md:max-w-none">
                {promise.title}
              </h3>
            </motion.div>
          ))}
        </div>

        {/* Bottom vertical line */}
        <div className="flex justify-center mt-16 md:mt-20">
          <div className="w-[1px] h-16 bg-gold/40" />
        </div>
      </div>
    </section>
  );
}
