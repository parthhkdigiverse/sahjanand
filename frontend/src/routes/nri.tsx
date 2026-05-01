import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { submitNRILead, fetchNRIPageData, getImageUrl } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ArrowRight, CheckCircle2, Send, Globe2, ShieldCheck, Truck, Video, Award } from "lucide-react";

export const Route = createFileRoute("/nri")({
  component: NRIPage,
});

function NRIPage() {
  const { data: nriData, isLoading } = useQuery({
    queryKey: ["nri-page"],
    queryFn: fetchNRIPageData,
  });

  if (isLoading || !nriData) {
    return (
      <div className="min-h-screen bg-[#FDFCFB] flex items-center justify-center">
        <div className="w-16 h-16 border-t-2 border-gold rounded-full animate-spin"></div>
      </div>
    );
  }

  return <NRIPageContent nriData={nriData} />;
}

function NRIPageContent({ nriData }: { nriData: any }) {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0.3]);

  return (
    <div className="bg-[#FDFCFB] text-onyx font-sans min-h-screen selection:bg-gold/30">
      {/* Cinematic Hero Section */}
      <section ref={heroRef} className="relative h-screen min-h-[700px] overflow-hidden flex items-center">
        <motion.div style={{ y, opacity }} className="absolute inset-0 w-full h-full">
          <img
            src={nriData.hero_image ? getImageUrl(nriData.hero_image) : "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=2000"}
            alt="NRI Services Hero"
            className="w-full h-full object-cover scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-onyx/40 via-onyx/20 to-onyx/80" />
        </motion.div>

        <div className="container-luxe relative z-10 pt-20">
          <div className="max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="inline-block px-4 py-1 border border-gold/40 rounded-full text-[10px] md:text-xs tracking-[0.4em] uppercase text-gold mb-8 font-semibold backdrop-blur-sm">
                {nriData.hero_eyebrow || "Global Heritage, Local Roots"}
              </span>
              <h1 className="text-5xl md:text-8xl font-serif text-ivory mb-10 leading-[1] tracking-tight">
                {nriData.hero_heading || "Bridging Distances with Timeless Elegance"}
              </h1>
              <p className="text-lg md:text-xl text-ivory/80 max-w-2xl leading-relaxed mb-12 font-light">
                Experience the finest Indian craftsmanship from anywhere in the world. Dedicated concierge services tailored for our global NRI family.
              </p>
              <Button 
                onClick={() => document.getElementById('inquiry-form')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-gold text-onyx hover:bg-ivory hover:text-onyx px-10 py-7 rounded-full text-xs tracking-[0.2em] uppercase font-bold transition-all duration-500 group"
              >
                Start Your Journey
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={16} />
              </Button>
            </motion.div>
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4"
        >
          <span className="text-[10px] uppercase tracking-[0.3em] text-ivory/40">Scroll</span>
          <div className="w-px h-12 bg-gradient-to-b from-gold to-transparent" />
        </motion.div>
      </section>

      {/* Trust & Heritage Strip */}
      <section className="py-16 bg-white border-b border-onyx/5">
        <div className="container-luxe">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 items-center opacity-60 grayscale hover:grayscale-0 transition-all duration-700">
             <div className="flex flex-col items-center gap-3 text-center">
                <Globe2 size={32} className="text-gold mb-2" />
                <span className="text-[10px] uppercase tracking-widest font-bold">Worldwide Shipping</span>
             </div>
             <div className="flex flex-col items-center gap-3 text-center">
                <ShieldCheck size={32} className="text-gold mb-2" />
                <span className="text-[10px] uppercase tracking-widest font-bold">Fully Insured</span>
             </div>
             <div className="flex flex-col items-center gap-3 text-center">
                <Video size={32} className="text-gold mb-2" />
                <span className="text-[10px] uppercase tracking-widest font-bold">Virtual Viewing</span>
             </div>
             <div className="flex flex-col items-center gap-3 text-center">
                <Award size={32} className="text-gold mb-2" />
                <span className="text-[10px] uppercase tracking-widest font-bold">Certified Quality</span>
             </div>
          </div>
        </div>
      </section>

      {/* Intro Section - The Story */}
      <section className="py-24 md:py-40 bg-ivory/30 overflow-hidden">
        <div className="container-luxe">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-12">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="text-4xl md:text-6xl font-serif text-onyx leading-[1.1] mb-8">
                  {nriData.intro_heading}
                </h2>
                <div className="w-20 h-1 bg-gold mb-12" />
                <div className="space-y-8 text-onyx/70 text-lg md:text-xl leading-relaxed font-light italic">
                  {nriData.intro_paragraphs.map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
              </motion.div>
            </div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl shadow-onyx/20"
            >
              <img 
                src={nriData.benefits_image ? getImageUrl(nriData.benefits_image) : "https://images.unsplash.com/photo-1589128777073-263566ae5e4d?auto=format&fit=crop&q=80&w=1200"} 
                className="w-full h-full object-cover"
                alt="Heritage Craftsmanship"
              />
              <div className="absolute inset-0 ring-1 ring-inset ring-white/20 rounded-3xl" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Benefits - Exclusive Services */}
      <section className="py-24 md:py-40 bg-white">
        <div className="container-luxe">
          <div className="text-center mb-24 max-w-3xl mx-auto">
            <span className="text-xs tracking-[0.4em] uppercase text-gold font-bold mb-6 block">The NRI Advantage</span>
            <h3 className="text-3xl md:text-5xl font-serif text-onyx mb-8">Elevating Your Experience Across Borders</h3>
            <p className="text-onyx/60 text-lg">We understand the unique needs of our global clientele and provide end-to-end support for a seamless acquisition process.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {nriData.benefits.map((benefit, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group p-10 bg-ivory/20 rounded-3xl border border-onyx/5 hover:border-gold/30 transition-all duration-500 hover:shadow-xl hover:shadow-gold/5"
              >
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mb-8 shadow-sm group-hover:bg-gold group-hover:text-onyx transition-colors duration-500">
                  <CheckCircle2 size={24} className="text-gold group-hover:text-onyx transition-colors" />
                </div>
                <h4 className="text-xl font-serif text-onyx mb-4">{benefit.title}</h4>
                <p className="text-onyx/60 leading-relaxed font-light">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA & Inquiry Form */}
      <section id="inquiry-form" className="py-24 md:py-40 bg-ivory">
        <div className="container-luxe">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
            <div className="sticky top-32">
               <motion.div
                 initial={{ opacity: 0, y: 20 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true }}
               >
                 <span className="text-xs tracking-[0.4em] uppercase text-gold font-bold mb-6 block">Personalized Concierge</span>
                 <h2 className="text-4xl md:text-6xl font-serif text-onyx mb-8">
                   {nriData.cta_text || "Consult with our Experts"}
                 </h2>
                 <p className="text-onyx/60 text-xl leading-relaxed mb-12 font-light">
                   Our dedicated NRI desk is ready to guide you through virtual tours, global logistics, and tax-efficient shopping. Start a conversation with us today.
                 </p>
                 
                 <div className="space-y-6">
                    <div className="flex items-center gap-4 p-6 bg-white rounded-2xl border border-onyx/5">
                       <Truck className="text-gold" size={24} />
                       <div>
                          <p className="text-xs uppercase tracking-widest font-bold text-onyx/40 mb-1">Global Reach</p>
                          <p className="text-onyx font-serif">Delivery to over 20+ countries</p>
                       </div>
                    </div>
                    <div className="flex items-center gap-4 p-6 bg-white rounded-2xl border border-onyx/5">
                       <ShieldCheck className="text-gold" size={24} />
                       <div>
                          <p className="text-xs uppercase tracking-widest font-bold text-onyx/40 mb-1">Guaranteed Safety</p>
                          <p className="text-onyx font-serif">100% Insured transit & returns</p>
                       </div>
                    </div>
                 </div>
               </motion.div>
            </div>
            
            <div className="relative">
              <div className="absolute -inset-4 bg-gold/5 blur-3xl rounded-full opacity-50" />
              <NRIInquiryForm />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function NRIInquiryForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      country: "",
      message: ""
    }
  });

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      await submitNRILead(data);
      toast.success("Thank you! Your inquiry has been submitted successfully.");
      reset();
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      className="bg-white p-8 md:p-14 rounded-[2.5rem] border border-onyx/5 shadow-2xl shadow-onyx/10 relative z-10"
    >
      <div className="text-center mb-12">
        <h3 className="text-2xl md:text-3xl font-serif text-onyx mb-4">Inquire Privately</h3>
        <p className="text-onyx/60 font-light">Your global journey to heritage begins here.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-3">
            <Label className="text-[10px] uppercase tracking-widest text-onyx/40 font-bold ml-1">Full Name</Label>
            <Input 
              {...register("name", { required: "Name is required" })} 
              placeholder="John Doe"
              className={`bg-ivory/30 border-onyx/5 focus:border-gold h-14 rounded-xl px-6 ${errors.name ? 'border-red-400' : ''}`}
            />
            {errors.name && <p className="text-[10px] text-red-500 font-semibold ml-1">{errors.name.message as string}</p>}
          </div>
          <div className="space-y-3">
            <Label className="text-[10px] uppercase tracking-widest text-onyx/40 font-bold ml-1">Email Address</Label>
            <Input 
              {...register("email", { 
                required: "Email is required", 
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: "Invalid email address"
                }
              })} 
              type="email"
              placeholder="john@example.com"
              className={`bg-ivory/30 border-onyx/5 focus:border-gold h-14 rounded-xl px-6 ${errors.email ? 'border-red-400' : ''}`}
            />
            {errors.email && <p className="text-[10px] text-red-500 font-semibold ml-1">{errors.email.message as string}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-3">
            <Label className="text-[10px] uppercase tracking-widest text-onyx/40 font-bold ml-1">Phone Number</Label>
            <Input 
              {...register("phone", { required: "Phone number is required" })} 
              type="tel"
              placeholder="+1 (555) 000-0000"
              className={`bg-ivory/30 border-onyx/5 focus:border-gold h-14 rounded-xl px-6 ${errors.phone ? 'border-red-400' : ''}`}
            />
            {errors.phone && <p className="text-[10px] text-red-500 font-semibold ml-1">{errors.phone.message as string}</p>}
          </div>
          <div className="space-y-3">
            <Label className="text-[10px] uppercase tracking-widest text-onyx/40 font-bold ml-1">Country of Residence</Label>
            <Input 
              {...register("country", { required: "Country is required" })} 
              placeholder="USA, UK, Canada, etc."
              className={`bg-ivory/30 border-onyx/5 focus:border-gold h-14 rounded-xl px-6 ${errors.country ? 'border-red-400' : ''}`}
            />
            {errors.country && <p className="text-[10px] text-red-500 font-semibold ml-1">{errors.country.message as string}</p>}
          </div>
        </div>

        <div className="space-y-3">
          <Label className="text-[10px] uppercase tracking-widest text-onyx/40 font-bold ml-1">How can we assist you?</Label>
          <Textarea 
            {...register("message", { required: "Please share your requirements" })} 
            placeholder="Tell us about the pieces you are interested in..."
            className={`bg-ivory/30 border-onyx/5 focus:border-gold min-h-[140px] rounded-xl px-6 py-4 resize-none ${errors.message ? 'border-red-400' : ''}`}
          />
          {errors.message && <p className="text-[10px] text-red-500 font-semibold ml-1">{errors.message.message as string}</p>}
        </div>

        <Button 
          type="submit" 
          disabled={isSubmitting}
          className="w-full bg-onyx text-ivory hover:bg-gold hover:text-onyx h-16 rounded-full text-xs tracking-[0.3em] uppercase font-bold transition-all duration-500 shadow-2xl shadow-onyx/20"
        >
          {isSubmitting ? "Processing..." : "Send Secure Inquiry"}
          <Send className="ml-3 group-hover:translate-x-1 transition-transform" size={16} />
        </Button>
        <p className="text-[9px] text-center text-onyx/30 uppercase tracking-widest">
           Your data is encrypted and handled with the utmost discretion.
        </p>
      </form>
    </motion.div>
  );
}

