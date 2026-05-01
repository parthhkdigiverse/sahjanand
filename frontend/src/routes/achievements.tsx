import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { fetchAchievements, getImageUrl } from "@/lib/api";
import { motion } from "framer-motion";
import heroFallback from "@/assets/hero-1.jpg";

export const Route = createFileRoute("/achievements")({
  component: Achievements,
});

function Achievements() {
  const { data: achievements, isLoading } = useQuery({
    queryKey: ["achievements"],
    queryFn: fetchAchievements,
  });

  if (isLoading) return (
    <div className="h-screen flex items-center justify-center bg-ivory/30">
      <div className="animate-pulse font-serif text-2xl text-gold tracking-widest uppercase">Sahajanand Achievements</div>
    </div>
  );

  return (
    <div className="bg-ivory/20">
      {/* Hero Section */}
      <section className="relative w-full h-[50vh] min-h-[400px] overflow-hidden bg-onyx">
        <img 
          src={heroFallback} 
          alt="Our Achievements" 
          className="absolute inset-0 w-full h-full object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-onyx/40 to-onyx/80" />
        <div className="absolute inset-0 z-10 flex items-center justify-center text-center px-4">
          <div className="max-w-3xl">
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="divider-gold mb-6 uppercase text-[10px] md:text-xs font-bold tracking-[0.3em] justify-center"
            >
              Excellence & Heritage
            </motion.p>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="font-serif text-4xl md:text-7xl text-ivory leading-[1.05]"
            >
              Our Achievements
            </motion.h1>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="w-24 h-px bg-gold/50 mx-auto mt-8"
            />
          </div>
        </div>
      </section>

      {/* Achievements List */}
      <section className="container-luxe py-24 md:py-32 space-y-32">
        {achievements && achievements.length > 0 ? (
          achievements.map((achievement, index) => (
            <motion.div 
              key={achievement._id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} gap-12 md:gap-24 items-center`}
            >
              {/* Image Column */}
              <div className="w-full md:w-1/2">
                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-luxe group">
                  <img 
                    src={getImageUrl(achievement.image)} 
                    alt={achievement.title} 
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 ring-1 ring-inset ring-gold/10 rounded-2xl pointer-events-none" />
                </div>
              </div>

              {/* Text Column */}
              <div className="w-full md:w-1/2 space-y-6 text-center md:text-left">
                <div className="space-y-2">
                  <span className="text-gold font-serif text-5xl opacity-20 block mb-2 leading-none">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <h2 className="font-serif text-3xl md:text-5xl text-onyx leading-tight">
                    {achievement.title}
                  </h2>
                </div>
                <div className="w-12 h-1 bg-gold/30 mx-auto md:mx-0" />
                <p className="text-foreground/70 text-lg leading-relaxed font-light">
                  {achievement.description}
                </p>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-gold/10 shadow-luxe">
            <p className="font-serif text-2xl text-gold italic">Our story of excellence is being written...</p>
          </div>
        )}
      </section>

      {/* Bottom CTA */}
      <section className="bg-onyx py-24 text-center">
        <div className="container-luxe">
          <h3 className="font-serif text-3xl md:text-4xl text-ivory mb-8">Want to be part of our story?</h3>
          <a 
            href="/shop" 
            className="sheen inline-flex items-center gap-3 px-10 py-4 bg-gold text-onyx text-xs font-bold tracking-[0.2em] hover:bg-ivory transition-all duration-500 shadow-luxe uppercase"
          >
            Explore the Collection →
          </a>
        </div>
      </section>
    </div>
  );
}
