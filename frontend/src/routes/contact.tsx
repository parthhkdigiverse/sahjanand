import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { submitContact, fetchContactPageData, getImageUrl } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { Loader2, Calendar, ChevronDown, CheckCircle2, MapPin, Phone, Mail, Clock } from "lucide-react";

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

type VisitType = "STORE_VISIT" | "VIRTUAL_CALL" | "HOME_VISIT";

function Contact() {
  const { data: contactData, isLoading } = useQuery({
    queryKey: ["contact-page"],
    queryFn: fetchContactPageData,
  });

  const [visitType, setVisitType] = useState<VisitType>("STORE_VISIT");
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    store: "Nadiad Main Store",
    dateTime: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      
      const typeLabels = {
        STORE_VISIT: "Store Visit",
        VIRTUAL_CALL: "Virtual Call",
        HOME_VISIT: "Home Visit"
      };

      await submitContact({
        name: formData.name,
        email: formData.email || "no-email@provided.com",
        phone: formData.phone,
        preferred_date: formData.dateTime,
        subject: `${typeLabels[visitType]} Request`,
        message: `Visit Type: ${typeLabels[visitType]}\nStore: ${formData.store}\nDate/Time: ${formData.dateTime}\nAdditional Notes: ${formData.message}`,
        type: visitType
      });
      
      setSent(true);
      setTimeout(() => {
        setSent(false);
        setFormData({
          name: "",
          phone: "",
          email: "",
          store: "Nadiad Main Store",
          dateTime: "",
          message: ""
        });
      }, 5000);
    } catch (err) {
      console.error(err);
      alert("Failed to send request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#FDFCFB] gap-6">
        <div className="relative">
          <div className="w-16 h-16 rounded-full border-2 border-[#2D6A6A]/10 border-t-[#2D6A6A] animate-spin" />
          <Loader2 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[#2D6A6A] animate-pulse" size={24} />
        </div>
        <p className="text-[10px] uppercase tracking-[0.4em] text-onyx/30 font-bold animate-pulse">Loading Atelier</p>
      </div>
    );
  }

  const tabs: { id: VisitType; label: string }[] = [
    { id: "STORE_VISIT", label: "Schedule Store Visit" },
    { id: "VIRTUAL_CALL", label: "Book A Virtual Call" },
    { id: "HOME_VISIT", label: "Schedule Home Visit" },
  ];

  const boutiqueDetails = [
    { 
      icon: MapPin, 
      t: "The Boutique", 
      l: [
        contactData?.boutique_address_line1 || "", 
        contactData?.boutique_address_line2 || ""
      ].filter(Boolean)
    },
    { 
      icon: Phone, 
      t: "Concierge", 
      l: [contactData?.concierge_phone || ""].filter(Boolean)
    },
    { 
      icon: Mail, 
      t: "Inquiries", 
      l: [contactData?.inquiries_email || ""].filter(Boolean)
    },
    { 
      icon: Clock, 
      t: "Opening Hours", 
      l: [
        contactData?.opening_hours_line1 || ""
      ].filter(Boolean)
    },
  ];

  return (
    <div className="bg-[#FDFCFB] min-h-screen">
      {/* Hero Section - Matching the Image Precise Styling */}
      <section className="relative w-full overflow-hidden h-[70vh] min-h-[600px] flex items-center justify-center bg-onyx -mt-[var(--header-height)]">
        <div className="absolute inset-0">
          <img 
            src={getImageUrl(contactData?.hero_image || "/assets/hero-3.jpg")} 
            alt="Sahajanand Jewellers Atelier" 
            className="w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto w-full">
          <p className="text-gold uppercase tracking-[0.4em] text-xs font-bold mb-8 flex items-center justify-center gap-6">
            <span className="w-12 md:w-16 h-px bg-gold/40"></span>
            PRIVATE VIEWING
            <span className="w-12 md:w-16 h-px bg-gold/40"></span>
          </p>
          <h1 className="font-serif text-5xl md:text-8xl text-white mb-8 leading-tight tracking-tight">
            <span className="italic text-gold font-normal">Experience</span> the Art of Craft
          </h1>
          <p className="text-white/90 max-w-2xl mx-auto font-light text-base md:text-lg leading-relaxed tracking-wide">
            Schedule a private consultation at our boutique. Discover our collections with dedicated assistance from our master jewelers.
          </p>
        </div>
      </section>

      {/* Form Section - Two Column Layout with Details Beside Form */}
      <section className="container-luxe max-w-7xl mx-auto px-4 md:px-8 py-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-start">
          
          {/* Left Side: Contact Details */}
          <div className="lg:col-span-5 space-y-12 animate-in fade-in slide-in-from-left duration-700">
            <div>
              <h2 className="font-serif text-4xl text-onyx mb-10">Our Atelier</h2>
              <div className="space-y-10">
                {boutiqueDetails.map(({ icon: Icon, t, l }, idx) => (
                  <div key={idx} className="flex gap-6 group">
                    <div className="h-14 w-14 rounded-full border border-gold/30 bg-white shadow-sm flex items-center justify-center text-gold flex-none group-hover:scale-110 group-hover:border-gold transition-all duration-500">
                      <Icon strokeWidth={1.5} size={24} />
                    </div>
                    <div>
                      <h3 className="text-[10px] tracking-[0.2em] uppercase font-bold text-onyx/40 mb-2 group-hover:text-gold transition-colors">{t}</h3>
                      {l.map((line, i) => (
                        <p key={i} className="text-onyx/80 font-medium text-lg">{line}</p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-ivory/30 p-8 rounded-2xl border border-gold/10 hidden lg:block">
              <p className="text-onyx/60 leading-relaxed italic">
                "We invite you to experience the Sahajanand legacy in person, where timeless elegance meets unparalleled personal service."
              </p>
            </div>
          </div>

          {/* Right Side: Tabbed Form */}
          <div className="lg:col-span-7 flex flex-col animate-in fade-in slide-in-from-right duration-700">
            <div className="mb-12">
              <h2 className="font-serif text-5xl text-[#1A2E35] mb-4">Request An Appointment</h2>
              <p className="text-onyx/40 uppercase tracking-widest text-xs font-bold">Contact Us</p>
            </div>
            
            {sent ? (
              <div className="py-24 text-center bg-white rounded-3xl border border-gray-100 shadow-sm animate-in fade-in zoom-in duration-500">
                <div className="w-24 h-24 bg-[#2D6A6A]/10 rounded-full flex items-center justify-center mx-auto mb-8">
                  <CheckCircle2 size={48} className="text-[#2D6A6A]" />
                </div>
                <h3 className="font-serif text-4xl text-onyx mb-6">Request Received</h3>
                <p className="text-onyx/60 max-w-xs mx-auto mb-10 leading-relaxed text-lg text-center">Thank you for reaching out. Our concierge will contact you shortly.</p>
                <button 
                  onClick={() => setSent(false)}
                  className="text-[#2D6A6A] font-bold text-sm tracking-widest uppercase border-b-2 border-[#2D6A6A] pb-2 hover:text-[#1A2E35] hover:border-[#1A2E35] transition-all mx-auto"
                >
                  Book Another Session
                </button>
              </div>
            ) : (
              <div className="bg-white p-2 rounded-[2rem]">
                {/* Custom Tabs */}
                <div className="flex flex-wrap gap-x-8 gap-y-4 mb-12 border-b border-gray-100 pb-px px-4">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setVisitType(tab.id)}
                      className={`pb-6 text-sm font-semibold tracking-wide transition-all relative ${
                        visitType === tab.id 
                        ? "text-[#2D6A6A]" 
                        : "text-gray-400 hover:text-gray-600"
                      }`}
                    >
                      {tab.label}
                      {visitType === tab.id && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#2D6A6A] animate-in slide-in-from-left duration-500" />
                      )}
                    </button>
                  ))}
                </div>

                {/* Pill Shaped Form */}
                <form onSubmit={handleSubmit} className="space-y-6 px-4 pb-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="relative group">
                      <input
                        required
                        type="text"
                        placeholder="Full name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-8 py-5 rounded-full border border-gray-200 focus:border-[#2D6A6A] focus:ring-1 focus:ring-[#2D6A6A]/20 outline-none bg-white text-gray-800 placeholder:text-gray-400 transition-all text-base"
                      />
                    </div>
                    <div className="relative group">
                      <input
                        required
                        type="tel"
                        placeholder="+91 Mobile number"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-8 py-5 rounded-full border border-gray-200 focus:border-[#2D6A6A] focus:ring-1 focus:ring-[#2D6A6A]/20 outline-none bg-white text-gray-800 placeholder:text-gray-400 transition-all text-base"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="relative group">
                      <select
                        required
                        value={formData.store}
                        onChange={(e) => setFormData({ ...formData, store: e.target.value })}
                        className="w-full px-8 py-5 rounded-full border border-gray-200 focus:border-[#2D6A6A] outline-none bg-white text-gray-800 appearance-none transition-all text-base"
                      >
                        <option value="Nadiad Main Store">Select Store</option>
                        <option value="Nadiad Main Store">Nadiad Main Store</option>
                        <option value="Ahmedabad Boutique">Ahmedabad Boutique</option>
                      </select>
                      <ChevronDown size={20} className="absolute right-8 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none group-hover:text-[#2D6A6A] transition-colors" />
                    </div>
                    <div className="relative group">
                      <input
                        required
                        type="datetime-local"
                        value={formData.dateTime}
                        onChange={(e) => setFormData({ ...formData, dateTime: e.target.value })}
                        className="w-full px-8 py-5 rounded-full border border-gray-200 focus:border-[#2D6A6A] outline-none bg-white text-gray-800 transition-all text-base"
                      />
                      <Calendar size={20} className="absolute right-8 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none group-hover:text-[#2D6A6A] transition-colors" />
                    </div>
                  </div>

                  <div className="pt-6 flex justify-start">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-16 py-5 bg-[#2D6A6A] text-white rounded-full font-bold text-base hover:bg-[#1A2E35] transition-all duration-500 shadow-xl shadow-[#2D6A6A]/20 disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-1 active:translate-y-0"
                    >
                      {isSubmitting ? "Sending..." : "Submit"}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Map Section - Full Width or Contained */}
      <section className="container-luxe py-24 border-t border-gray-100">
        <div className="w-full">
          <h2 className="font-serif text-3xl text-onyx mb-10 text-center">Locate Our Boutique</h2>
          <div className="relative h-[500px] rounded-3xl overflow-hidden shadow-luxe border border-gray-100 bg-onyx/5">
            <iframe
              src={contactData?.map_embed_url || ""}
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
      </section>
    </div>
  );
}
