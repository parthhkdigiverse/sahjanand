import { motion } from "framer-motion";

export function LoadingScreen() {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#FDFCFB]"
      style={{ backgroundColor: "var(--background)" }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="text-center"
      >
        <div className="font-serif text-3xl md:text-5xl tracking-wide leading-none text-foreground flex flex-col items-center">
          <motion.span 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="text-[0.6em] text-[#C5A267] mb-2 font-bold"
            style={{ color: "var(--gold)" }}
          >
            SHREE
          </motion.span>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          >
            <span className="text-onyx">Sahajanand</span> <span className="text-[#C5A267] italic" style={{ color: "var(--gold)" }}>Jewellers</span>
          </motion.div>
        </div>
        
        <motion.div 
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.8, duration: 1.5, ease: "circOut" }}
          className="h-px bg-[#C5A267]/40 w-24 mx-auto mt-8 origin-center"
          style={{ backgroundColor: "var(--gold)" }}
        />
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 1 }}
          className="text-[10px] tracking-[0.4em] text-onyx/40 mt-8 uppercase font-bold"
        >
          Crafting Heritage Since 1992
        </motion.p>
      </motion.div>
      
      {/* Subtle pulsing ring */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1.2 }}
        transition={{ 
          duration: 3, 
          repeat: Infinity, 
          repeatType: "reverse", 
          ease: "easeInOut" 
        }}
        className="absolute w-64 h-64 rounded-full border border-[#C5A267]/5 pointer-events-none"
        style={{ borderColor: "var(--gold)" }}
      />
    </motion.div>
  );
}
