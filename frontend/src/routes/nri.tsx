import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { submitNRILead, fetchNRIPageData, getImageUrl } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ArrowRight, CheckCircle2, Send } from "lucide-react";

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

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

  return (
    <div className="bg-[#FDFCFB] text-onyx font-sans min-h-screen">
      {/* Hero Section */}
      <section ref={heroRef} className="relative h-[80vh] min-h-[600px] overflow-hidden">
        <motion.div style={{ y, opacity }} className="absolute inset-0 w-full h-full">
          <img
            src={nriData.hero_image ? getImageUrl(nriData.hero_image) : "/uploads/hero-2.jpg"}
            alt="NRI Services Hero"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-onyx/80 via-onyx/20 to-transparent" />
        </motion.div>

        <div className="absolute inset-0 flex items-center justify-center pt-24">
          <div className="container-luxe text-center text-ivory">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="block text-[11px] md:text-xs tracking-[0.4em] uppercase text-gold mb-6 font-semibold">
                {nriData.hero_eyebrow || "NRI Services"}
              </span>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif mb-8 leading-[1.1] tracking-tight">
                {nriData.hero_heading || "Global Heritage, Local Roots"}
              </h1>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Intro Section */}
      <section className="py-24 md:py-32 bg-ivory">
        <div className="container-luxe">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              className="text-3xl md:text-5xl font-serif text-onyx leading-tight"
            >
              {nriData.intro_heading}
            </motion.h2>
            
            <div className="w-1px h-16 bg-gold mx-auto" />
            
            <div className="space-y-6 text-onyx/70 text-lg leading-relaxed">
              {nriData.intro_paragraphs.map((p, i) => (
                <motion.p 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ delay: i * 0.1 }}
                >
                  {p}
                </motion.p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 md:py-32 bg-white">
        <div className="container-luxe">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative aspect-[4/5] overflow-hidden rounded-2xl"
            >
              <img 
                src={nriData.benefits_image ? getImageUrl(nriData.benefits_image) : "/uploads/insta-2.jpg"} 
                alt="NRI Benefits" 
                className="w-full h-full object-cover"
              />
            </motion.div>

            <div className="space-y-12">
              <h3 className="text-3xl md:text-4xl font-serif text-onyx">
                Exclusive Services for our Global Clients
              </h3>
              
              <div className="space-y-8">
                {nriData.benefits.map((benefit, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex gap-4 items-start"
                  >
                    <CheckCircle2 className="text-gold mt-1 shrink-0" size={24} />
                    <div>
                      <h4 className="text-lg font-serif text-onyx mb-2">{benefit.title}</h4>
                      <p className="text-onyx/60 leading-relaxed">{benefit.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="pt-8 border-t border-onyx/10"
              >
                <div className="max-w-2xl">
                   <h4 className="text-lg font-serif text-onyx mb-4">{nriData.cta_text || "Schedule a Consultation"}</h4>
                   <p className="text-onyx/60 mb-6">Our dedicated NRI desk is here to assist you with global shipping, virtual tours, and personalized styling.</p>
                </div>
              </motion.div>
            </div>
          </div>
          
          <div className="mt-20 max-w-3xl mx-auto">
            <NRIInquiryForm />
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
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-ivory p-8 md:p-12 rounded-3xl border border-gold/10 shadow-luxe"
    >
      <div className="text-center mb-10">
        <h3 className="text-2xl md:text-3xl font-serif text-onyx mb-4">Start Your Heritage Journey</h3>
        <p className="text-onyx/60">Connect with our dedicated NRI concierge for personalized assistance.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="text-[10px] uppercase tracking-widest text-onyx/40 font-bold ml-1">Full Name</Label>
            <Input 
              {...register("name", { required: "Name is required" })} 
              placeholder="John Doe"
              className={`bg-white/50 border-gold/10 focus:border-gold h-12 ${errors.name ? 'border-red-400' : ''}`}
            />
            {errors.name && <p className="text-[10px] text-red-500 font-semibold ml-1 mt-1">{errors.name.message as string}</p>}
          </div>
          <div className="space-y-2">
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
              className={`bg-white/50 border-gold/10 focus:border-gold h-12 ${errors.email ? 'border-red-400' : ''}`}
            />
            {errors.email && <p className="text-[10px] text-red-500 font-semibold ml-1 mt-1">{errors.email.message as string}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="text-[10px] uppercase tracking-widest text-onyx/40 font-bold ml-1">Phone Number</Label>
            <Input 
              {...register("phone", { required: "Phone number is required" })} 
              type="tel"
              placeholder="+1 (555) 000-0000"
              className={`bg-white/50 border-gold/10 focus:border-gold h-12 ${errors.phone ? 'border-red-400' : ''}`}
            />
            {errors.phone && <p className="text-[10px] text-red-500 font-semibold ml-1 mt-1">{errors.phone.message as string}</p>}
          </div>
          <div className="space-y-2">
            <Label className="text-[10px] uppercase tracking-widest text-onyx/40 font-bold ml-1">Country of Residence</Label>
            <Input 
              {...register("country", { required: "Country is required" })} 
              placeholder="USA, UK, Canada, etc."
              className={`bg-white/50 border-gold/10 focus:border-gold h-12 ${errors.country ? 'border-red-400' : ''}`}
            />
            {errors.country && <p className="text-[10px] text-red-500 font-semibold ml-1 mt-1">{errors.country.message as string}</p>}
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-[10px] uppercase tracking-widest text-onyx/40 font-bold ml-1">Your Requirements</Label>
          <Textarea 
            {...register("message", { required: "Please tell us about your requirements" })} 
            placeholder="Tell us about what you are looking for..."
            className={`bg-white/50 border-gold/10 focus:border-gold min-h-[120px] resize-none ${errors.message ? 'border-red-400' : ''}`}
          />
          {errors.message && <p className="text-[10px] text-red-500 font-semibold ml-1 mt-1">{errors.message.message as string}</p>}
        </div>

        <Button 
          type="submit" 
          disabled={isSubmitting}
          className="w-full bg-onyx text-ivory hover:bg-gold hover:text-onyx h-14 rounded-full text-xs tracking-[0.2em] uppercase font-bold transition-all duration-500 shadow-xl"
        >
          {isSubmitting ? "Submitting..." : "Send Inquiry"}
          <Send className="ml-2" size={16} />
        </Button>
      </form>
    </motion.div>
  );
}
