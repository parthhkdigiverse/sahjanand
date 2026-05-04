import { useState, useEffect } from "react";
import { X, Send, CheckCircle2 } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { submitContact, type ContactInquiry } from "@/lib/api";

export function InteractionContactPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasShown, setHasShown] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    // Check if it was already shown in this session
    if (sessionStorage.getItem("contact_popup_shown")) {
      setHasShown(true);
      return;
    }

    const handleInteraction = () => {
      if (hasShown) return;
      
      // Small delay for better UX
      setTimeout(() => {
        setIsOpen(true);
        setHasShown(true);
        sessionStorage.setItem("contact_popup_shown", "true");
      }, 100);

      // Clean up listeners
      removeListeners();
    };

    const removeListeners = () => {
      window.removeEventListener("scroll", handleInteraction);
      window.removeEventListener("mousemove", handleInteraction);
      window.removeEventListener("touchstart", handleInteraction);
      window.removeEventListener("keydown", handleInteraction);
      window.removeEventListener("click", handleInteraction);
    };

    window.addEventListener("scroll", handleInteraction, { passive: true });
    window.addEventListener("mousemove", handleInteraction, { passive: true });
    window.addEventListener("touchstart", handleInteraction, { passive: true });
    window.addEventListener("keydown", handleInteraction, { passive: true });
    window.addEventListener("click", handleInteraction, { passive: true });

    return removeListeners;
  }, [hasShown]);

  const mutation = useMutation({
    mutationFn: (data: Omit<ContactInquiry, "type"> & { type: string }) => submitContact(data as any),
    onSuccess: () => {
      setSubmitted(true);
      setTimeout(() => {
        setIsOpen(false);
        // Reset state after closing so it doesn't show again if unmounted/remounted
        setTimeout(() => {
          setSubmitted(false);
          setFormData({ name: "", email: "", phone: "", message: "" });
        }, 500);
      }, 3000);
    },
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({
      ...formData,
      subject: `Welcome Popup Inquiry`,
      type: "GENERAL",
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-onyx/80 backdrop-blur-md animate-in fade-in duration-700"
        onClick={() => setIsOpen(false)}
      />

      {/* Modal */}
      <div className="relative w-full max-h-[95vh] overflow-y-auto md:overflow-hidden max-w-4xl bg-ivory border border-gold/20 shadow-luxe shadow-2xl animate-in zoom-in-95 fade-in duration-700 flex flex-col md:flex-row">
        {/* Accent Bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gold z-10" />

        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 z-20 text-onyx/40 hover:text-gold transition-colors duration-300 bg-white/80 backdrop-blur-sm p-2 rounded-full md:bg-transparent md:p-0"
        >
          <X size={24} />
        </button>

        {/* Image Section */}
        <div className="w-full md:w-1/2 relative bg-onyx shrink-0">
          <img 
            src="/assets/hero-1.jpg" 
            alt="Sahajanand Jewellers" 
            className="w-full h-auto object-contain md:absolute md:inset-0 md:h-full opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-onyx/80 via-transparent to-transparent pointer-events-none" />
          <div className="absolute bottom-6 md:bottom-10 left-6 md:left-10 right-6 md:right-10 pointer-events-none">
            <h3 className="font-serif text-2xl md:text-3xl text-ivory mb-1 md:mb-2">Welcome to Sahajanand</h3>
            <p className="text-ivory/80 text-xs md:text-sm font-light">Crafting timeless elegance and heirloom-quality jewellery since inception.</p>
          </div>
        </div>

        {/* Form Section */}
        <div className="w-full md:w-1/2 p-8 md:p-12 bg-ivory relative">
          {submitted ? (
            <div className="h-full flex flex-col items-center justify-center py-12 animate-in fade-in slide-in-from-bottom-4 duration-700 text-center">
              <div className="h-20 w-20 rounded-full bg-gold/10 flex items-center justify-center mb-8">
                <CheckCircle2 size={40} className="text-gold" />
              </div>
              <h3 className="font-serif text-3xl mb-4 text-onyx">Message Received</h3>
              <p className="text-gray-500 text-sm tracking-wide px-4">Our concierge will attend to your inquiry with the utmost care shortly.</p>
            </div>
          ) : (
            <div className="h-full flex flex-col justify-center">
              <div className="mb-8">
                <p className="text-[10px] tracking-[0.4em] text-gold font-bold uppercase mb-4 flex items-center gap-3">
                  <span className="w-8 h-px bg-gold/50" />
                  Connect With Us
                </p>
                <h2 className="font-serif text-3xl text-onyx mb-3">Begin Your Journey</h2>
                <p className="text-onyx/60 text-sm">Reach out to discover our latest collections or book a private viewing.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-1">
                  <label className="text-[10px] tracking-widest text-gray-500 uppercase font-bold ml-1">Your Name</label>
                  <input
                    required
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-white border border-gray-200 px-4 py-3 text-sm focus:border-gold outline-none transition-colors duration-300"
                    placeholder="Jane Doe"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1 flex flex-col justify-end">
                    <label className="text-[10px] tracking-widest text-gray-500 uppercase font-bold ml-1 truncate">Email (Optional)</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-white border border-gray-200 px-4 py-3 text-sm focus:border-gold outline-none transition-colors duration-300"
                      placeholder="jane@example.com"
                    />
                  </div>
                  <div className="space-y-1 flex flex-col justify-end">
                    <label className="text-[10px] tracking-widest text-gray-500 uppercase font-bold ml-1 truncate">Mobile Number</label>
                    <input
                      required
                      type="tel"
                      minLength={10}
                      maxLength={15}
                      pattern="^\+?[0-9]{10,15}$"
                      title="Please enter a valid phone number (10-15 digits)"
                      value={formData.phone}
                      onChange={(e) => {
                        const val = e.target.value.replace(/[^0-9+]/g, '');
                        setFormData({ ...formData, phone: val });
                      }}
                      className="w-full bg-white border border-gray-200 px-4 py-3 text-sm focus:border-gold outline-none transition-colors duration-300"
                      placeholder="+919876543210"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] tracking-widest text-gray-500 uppercase font-bold ml-1">How can we assist you?</label>
                  <textarea
                    required
                    rows={3}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-white border border-gray-200 px-4 py-3 text-sm focus:border-gold outline-none transition-colors duration-300 resize-none leading-relaxed"
                    placeholder="I am looking for..."
                  />
                </div>

                <button
                  disabled={mutation.isPending}
                  className="w-full mt-2 bg-onyx text-ivory py-4 px-8 text-[11px] tracking-[0.3em] font-bold uppercase transition-all duration-500 hover:bg-gold flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  {mutation.isPending ? "Sending..." : (
                    <>
                      Send Message <Send size={14} />
                    </>
                  )}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
