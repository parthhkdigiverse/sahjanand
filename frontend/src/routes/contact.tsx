import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { MapPin, Phone, Mail, Clock, ArrowRight, CheckCircle2 } from "lucide-react";
import { submitContact } from "@/lib/api";
import heroFallback from "@/assets/hero-3.jpg";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Us — Sahajanand Jewellers Nadiad" },
      {
        name: "description",
        content:
          "Visit our store in Nadiad or book a private appointment with our team. We'd love to hear from you.",
      },
      { property: "og:title", content: "Contact Us — Sahajanand Jewellers" },
      { property: "og:description", content: "Visit our Nadiad store or book an appointment." },
    ],
  }),
  component: Contact,
});

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      await submitContact({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        preferred_date: formData.date,
        subject: `Appointment Request: ${formData.date}`,
        message: formData.message,
        type: "GENERAL"
      });
      setSent(true);
    } catch (err) {
      console.error(err);
      alert("Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-ivory/30 min-h-screen">
      <section className="relative h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0">
          <img 
            src={heroFallback} 
            alt="Sahajanand Jewellers Atelier" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-onyx/60" />
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <p className="text-gold uppercase tracking-[0.3em] text-xs font-bold mb-6 flex items-center justify-center gap-4">
            <span className="w-12 h-px bg-gold/50"></span>
            Private Viewing
            <span className="w-12 h-px bg-gold/50"></span>
          </p>
          <h1 className="font-serif text-5xl md:text-7xl text-ivory mb-6 leading-tight">
            Experience the <br className="hidden md:block" /> Art of Craft
          </h1>
          <p className="text-ivory/70 max-w-xl mx-auto font-light text-sm md:text-base">
            Schedule a private consultation at our Nadiad boutique. Discover our collections with dedicated assistance from our master jewelers.
          </p>
        </div>
      </section>

      <section className="container-luxe py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
          <div className="lg:col-span-5 space-y-12">
            <div>
              <h2 className="font-serif text-3xl md:text-4xl text-onyx mb-10">Our Atelier</h2>
              <div className="space-y-8">
                {[
                  { icon: MapPin, t: "The Boutique", l: ["Opp. Kidney Hospital", "Nadiad, Gujarat 387001"] },
                  { icon: Phone, t: "Concierge", l: ["+91 95123 06199"] },
                  { icon: Mail, t: "Inquiries", l: ["info@sahajanandjewellers.com"] },
                  { icon: Clock, t: "Opening Hours", l: ["Mon – Sat · 10:30 – 19:30", "Sunday · Closed"] },
                ].map(({ icon: Icon, t, l }, idx) => (
                  <div key={idx} className="flex gap-6 group">
                    <div className="h-14 w-14 rounded-full border border-gold/30 bg-white shadow-sm flex items-center justify-center text-gold flex-none group-hover:scale-110 group-hover:border-gold transition-all duration-500">
                      <Icon strokeWidth={1.5} size={24} />
                    </div>
                    <div>
                      <h3 className="text-xs tracking-[0.2em] uppercase font-bold text-onyx/40 mb-2 group-hover:text-gold transition-colors">{t}</h3>
                      {l.map((line, i) => (
                        <p key={i} className="text-onyx/80 font-medium">{line}</p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-luxe bg-onyx/5">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3681.4278457630737!2d72.8614271752494!3d22.67509547941913!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395e5006d96e594d%3A0xc3f8e5c5c1f5e2ec!2sMuljibhai%20Patel%20Urological%20Hospital!5e0!3m2!1sen!2sin!4v1713876000000!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0, filter: "grayscale(0.2) contrast(1.05)" }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Sahajanand Jewellers Nadiad Location"
              ></iframe>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="bg-white p-10 md:p-14 rounded-3xl shadow-luxe border border-gold/10 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
              
              {sent ? (
                <div className="text-center py-20 relative z-10">
                  <div className="w-24 h-24 bg-gold/10 rounded-full mx-auto mb-8 flex items-center justify-center">
                    <CheckCircle2 className="text-gold w-12 h-12" strokeWidth={1.5} />
                  </div>
                  <h3 className="font-serif text-4xl text-onyx mb-4">Request Received</h3>
                  <p className="text-onyx/60 max-w-sm mx-auto mb-10 leading-relaxed">
                    Thank you for reaching out. A dedicated concierge will contact you shortly to confirm your appointment.
                  </p>
                  <button 
                    onClick={() => setSent(false)}
                    className="text-xs uppercase tracking-widest font-bold text-gold hover:text-onyx transition-colors border-b border-gold hover:border-onyx pb-1"
                  >
                    Book Another
                  </button>
                </div>
              ) : (
                <div className="relative z-10">
                  <div className="mb-10">
                    <p className="text-gold uppercase tracking-[0.2em] text-[10px] font-bold mb-3 flex items-center gap-3">
                      <span className="w-8 h-px bg-gold/50"></span>
                      RSVP
                    </p>
                    <h2 className="font-serif text-3xl md:text-4xl text-onyx">Request an Appointment</h2>
                  </div>

                  <form className="space-y-8" onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-2 relative group">
                        <label className="text-[10px] uppercase tracking-widest text-onyx/40 font-bold ml-1">Full Name *</label>
                        <input
                          required
                          type="text"
                          value={formData.name}
                          onChange={e => setFormData({...formData, name: e.target.value})}
                          className="w-full bg-transparent border-b border-onyx/10 py-3 outline-none focus:border-gold transition-colors text-onyx"
                          placeholder="Jane Doe"
                        />
                      </div>
                      <div className="space-y-2 relative group">
                        <label className="text-[10px] uppercase tracking-widest text-onyx/40 font-bold ml-1">Email Address *</label>
                        <input
                          required
                          type="email"
                          value={formData.email}
                          onChange={e => setFormData({...formData, email: e.target.value})}
                          className="w-full bg-transparent border-b border-onyx/10 py-3 outline-none focus:border-gold transition-colors text-onyx"
                          placeholder="jane@example.com"
                        />
                      </div>
                      <div className="space-y-2 relative group">
                        <label className="text-[10px] uppercase tracking-widest text-onyx/40 font-bold ml-1">Phone Number *</label>
                        <input
                          required
                          type="tel"
                          value={formData.phone}
                          onChange={e => setFormData({...formData, phone: e.target.value})}
                          className="w-full bg-transparent border-b border-onyx/10 py-3 outline-none focus:border-gold transition-colors text-onyx"
                          placeholder="+91 95123 06199"
                        />
                      </div>
                      <div className="space-y-2 relative group">
                        <label className="text-[10px] uppercase tracking-widest text-onyx/40 font-bold ml-1">Preferred Date *</label>
                        <input
                          required
                          type="date"
                          value={formData.date}
                          onChange={e => setFormData({...formData, date: e.target.value})}
                          className="w-full bg-transparent border-b border-onyx/10 py-3 outline-none focus:border-gold transition-colors text-onyx"
                        />
                      </div>
                    </div>

                    <div className="space-y-2 relative group pt-2">
                      <label className="text-[10px] uppercase tracking-widest text-onyx/40 font-bold ml-1">Specific Interests (Optional)</label>
                      <textarea
                        rows={3}
                        value={formData.message}
                        onChange={e => setFormData({...formData, message: e.target.value})}
                        className="w-full bg-transparent border-b border-onyx/10 py-3 outline-none focus:border-gold transition-colors resize-none text-onyx"
                        placeholder="I am looking for a bridal set..."
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full mt-4 py-5 bg-onyx text-ivory text-xs tracking-widest uppercase font-medium hover:bg-gold hover:text-white transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed group flex justify-center items-center gap-3"
                    >
                      {isSubmitting ? "Submitting Request..." : "Confirm Request"}
                      {!isSubmitting && <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />}
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
