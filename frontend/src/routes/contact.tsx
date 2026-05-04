import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { submitContact, fetchContactPageData, getImageUrl } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { Loader2, MapPin, Phone, Mail, Clock, ArrowRight, CheckCircle2, Calendar as CalendarIcon, MapPin as MapPinIcon } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
  const { data: contactData, isLoading } = useQuery({
    queryKey: ["contact-page"],
    queryFn: fetchContactPageData,
  });

  const [activeTab, setActiveTab] = useState("store");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    time: "",
    store: "",
    address: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      
      let type: "STORE_VISIT" | "VIDEO_CALL" | "HOME_VISIT" | "GENERAL" = "GENERAL";
      let subject = "Appointment Request";
      
      if (activeTab === "store") {
        type = "STORE_VISIT";
        subject = `Store Visit Request: ${formData.store}`;
      } else if (activeTab === "virtual") {
        type = "VIDEO_CALL";
        subject = "Virtual Call Request";
      } else if (activeTab === "home") {
        type = "HOME_VISIT";
        subject = "Home Visit Request";
      }

      await submitContact({
        name: formData.name,
        email: formData.email || "concierge@request.com", // Fallback if email is hidden in some tabs
        phone: formData.phone,
        preferred_date: `${formData.date} ${formData.time}`,
        subject: subject,
        message: formData.message || `Requested a ${type.replace("_", " ").toLowerCase()} appointment.`,
        type: type,
        store_location: formData.store,
        address: formData.address
      });
      
      setSent(true);
      setTimeout(() => {
        setSent(false);
        setFormData({
          name: "",
          email: "",
          phone: "",
          date: "",
          time: "",
          store: "",
          address: "",
          message: ""
        });
      }, 5000);
    } catch (err) {
      console.error(err);
      alert("Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-ivory/30 gap-6">
        <div className="relative">
          <div className="w-16 h-16 rounded-full border-2 border-gold/10 border-t-gold animate-spin" />
          <Loader2 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-gold animate-pulse" size={24} />
        </div>
        <p className="text-[10px] uppercase tracking-[0.4em] text-onyx/30 font-bold animate-pulse">Entering the Atelier</p>
      </div>
    );
  }

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
    <div className="bg-ivory/30 min-h-screen">
      <section className="relative h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0">
          <img 
            src={getImageUrl(contactData?.hero_image || "/assets/hero-3.jpg")} 
            alt="Sahajanand Jewellers Atelier" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-onyx/60" />
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <p className="text-gold uppercase tracking-[0.3em] text-xs font-bold mb-6 flex items-center justify-center gap-4">
            <span className="w-12 h-px bg-gold/50"></span>
            {contactData?.hero_eyebrow || ""}
            <span className="w-12 h-px bg-gold/50"></span>
          </p>
          <h1 className="font-serif text-5xl md:text-7xl text-ivory mb-6 leading-tight">
            {contactData?.hero_heading ? (
              <div dangerouslySetInnerHTML={{ __html: contactData.hero_heading.replace("Experience", '<span class="italic text-gold">Experience</span>') }} />
            ) : null}
          </h1>
          <p className="text-ivory/70 max-w-xl mx-auto font-light text-sm md:text-base">
            {contactData?.hero_description || ""}
          </p>
        </div>
      </section>

      <section className="container-luxe py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
          <div className="lg:col-span-5 space-y-12">
            <div>
              <h2 className="font-serif text-3xl md:text-4xl text-onyx mb-10">Our Atelier</h2>
              <div className="space-y-8">
                {boutiqueDetails.map(({ icon: Icon, t, l }, idx) => (
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

          <div className="lg:col-span-7">
            <div className="bg-white p-6 md:p-14 rounded-[2.5rem] shadow-luxe border border-gold/10 relative overflow-hidden">
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
                    onClick={() => {
                      setSent(false);
                      setFormData({ name: "", email: "", phone: "", date: "", time: "", store: "", address: "", message: "" });
                    }}
                    className="text-xs uppercase tracking-widest font-bold text-gold hover:text-onyx transition-colors border-b border-gold hover:border-onyx pb-1"
                  >
                    Book Another
                  </button>
                </div>
              ) : (
                <div className="relative z-10">
                  <div className="mb-10">
                    <h2 className="font-serif text-4xl md:text-5xl text-onyx mb-2">Request An Appointment</h2>
                    <p className="text-onyx/40 uppercase tracking-widest text-[10px] font-bold">Contact Us</p>
                  </div>

                  <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="bg-transparent h-auto p-0 mb-12 border-b border-onyx/5 w-full justify-start rounded-none gap-8">
                      <TabsTrigger 
                        value="store" 
                        className="bg-transparent border-b-2 border-transparent data-[state=active]:border-teal-700 data-[state=active]:bg-transparent rounded-none px-0 py-4 text-xs md:text-sm font-medium text-onyx/40 data-[state=active]:text-teal-700 transition-all"
                      >
                        Schedule Store Visit
                      </TabsTrigger>
                      <TabsTrigger 
                        value="virtual" 
                        className="bg-transparent border-b-2 border-transparent data-[state=active]:border-teal-700 data-[state=active]:bg-transparent rounded-none px-0 py-4 text-xs md:text-sm font-medium text-onyx/40 data-[state=active]:text-teal-700 transition-all"
                      >
                        Book A Virtual Call
                      </TabsTrigger>
                      <TabsTrigger 
                        value="home" 
                        className="bg-transparent border-b-2 border-transparent data-[state=active]:border-teal-700 data-[state=active]:bg-transparent rounded-none px-0 py-4 text-xs md:text-sm font-medium text-onyx/40 data-[state=active]:text-teal-700 transition-all"
                      >
                        Schedule Home Visit
                      </TabsTrigger>
                    </TabsList>

                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                        <div className="relative">
                          <input
                            required
                            type="text"
                            placeholder="Full name"
                            value={formData.name}
                            onChange={e => setFormData({...formData, name: e.target.value})}
                            className="w-full h-14 px-8 rounded-full border border-onyx/10 bg-white text-sm outline-none focus:border-teal-700 transition-all placeholder:text-onyx/20 shadow-sm"
                          />
                        </div>
                        <div className="relative">
                          <input
                            required
                            type="tel"
                            placeholder="+91 Mobile number"
                            value={formData.phone}
                            onChange={e => setFormData({...formData, phone: e.target.value})}
                            className="w-full h-14 px-8 rounded-full border border-onyx/10 bg-white text-sm outline-none focus:border-teal-700 transition-all placeholder:text-onyx/20 shadow-sm"
                          />
                        </div>

                        {activeTab === "store" && (
                          <div className="relative col-span-1 md:col-span-1">
                            <Select 
                              value={formData.store} 
                              onValueChange={(val) => setFormData({...formData, store: val})}
                            >
                              <SelectTrigger className="w-full h-14 px-8 rounded-full border-onyx/10 bg-white text-sm focus:ring-0 focus:ring-offset-0 focus:border-teal-700 transition-all shadow-sm">
                                <SelectValue placeholder="Select Store" />
                              </SelectTrigger>
                              <SelectContent className="rounded-2xl border-onyx/10 shadow-luxe">
                                <SelectItem value="Nadiad Main Store">Nadiad Main Store</SelectItem>
                                <SelectItem value="Ahmedabad Boutique">Ahmedabad Boutique</SelectItem>
                                <SelectItem value="Mumbai Experience Center">Mumbai Experience Center</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        )}

                        {activeTab === "home" && (
                          <div className="relative col-span-1 md:col-span-2">
                            <input
                              required
                              type="text"
                              placeholder="Your full address for home visit"
                              value={formData.address}
                              onChange={e => setFormData({...formData, address: e.target.value})}
                              className="w-full h-14 px-8 rounded-full border border-onyx/10 bg-white text-sm outline-none focus:border-teal-700 transition-all placeholder:text-onyx/20 shadow-sm"
                            />
                          </div>
                        )}

                        <div className="relative flex gap-4 col-span-1 md:col-span-1">
                          <div className="relative flex-1">
                            <input
                              required
                              type="datetime-local"
                              value={`${formData.date}T${formData.time}`}
                              onChange={e => {
                                const [date, time] = e.target.value.split("T");
                                setFormData({...formData, date, time});
                              }}
                              className="w-full h-14 px-8 rounded-full border border-onyx/10 bg-white text-sm outline-none focus:border-teal-700 transition-all text-onyx/60 shadow-sm"
                            />
                          </div>
                        </div>

                        {activeTab !== "home" && (
                           <div className="relative col-span-1 md:col-span-1">
                             <input
                               type="email"
                               placeholder="Email Address (Optional)"
                               value={formData.email}
                               onChange={e => setFormData({...formData, email: e.target.value})}
                               className="w-full h-14 px-8 rounded-full border border-onyx/10 bg-white text-sm outline-none focus:border-teal-700 transition-all placeholder:text-onyx/20 shadow-sm"
                             />
                           </div>
                        )}
                      </div>

                      <div className="pt-4 flex justify-start">
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="px-12 h-14 rounded-full bg-[#2C6E63] text-white font-bold text-sm tracking-wide hover:bg-[#1E4D45] transition-all shadow-xl shadow-teal-900/10 flex items-center justify-center gap-2 group disabled:opacity-50"
                        >
                          {isSubmitting ? "Submitting..." : "Submit"}
                          {!isSubmitting && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
                        </button>
                      </div>
                    </form>
                  </Tabs>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
