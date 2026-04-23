import { useState } from "react";
import { X, Send, CheckCircle2, MessageSquare } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { submitContact, type ContactInquiry, type Product } from "@/lib/api";

interface InquiryModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

export function InquiryModal({ product, isOpen, onClose }: InquiryModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: `Greetings, I am captivated by the ${product.name} and would like to learn more about its bespoke details and availability.`,
  });
  const [submitted, setSubmitted] = useState(false);

  const mutation = useMutation({
    mutationFn: (data: ContactInquiry) => submitContact(data),
    onSuccess: () => {
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        onClose();
        setFormData({ name: "", email: "", phone: "", message: "" });
      }, 3000);
    },
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({
      ...formData,
      subject: `Product Inquiry: ${product.name}`,
      type: "PRODUCT",
      product_id: product.id,
      product_name: product.name,
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-onyx/80 backdrop-blur-sm animate-in fade-in duration-500"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-xl bg-ivory border border-gold/20 shadow-luxe shadow-2xl animate-in zoom-in-95 fade-in duration-500 overflow-hidden">
        {/* Accent Bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gold" />

        <button 
          onClick={onClose}
          className="absolute top-6 right-6 text-onyx/40 hover:text-gold transition-colors duration-300"
        >
          <X size={24} />
        </button>

        <div className="p-8 md:p-12">
          {submitted ? (
            <div className="py-12 text-center flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="h-20 w-20 rounded-full bg-gold/10 flex items-center justify-center mb-8">
                <CheckCircle2 size={40} className="text-gold" />
              </div>
              <h3 className="font-serif text-3xl mb-4 text-onyx">Message Sent with Elegance</h3>
              <p className="text-gray-500 text-sm tracking-wide">Our concierge will attend to your inquiry with the utmost care shortly.</p>
            </div>
          ) : (
            <>
              <div className="mb-10 text-center">
                <p className="text-[10px] tracking-[0.4em] text-gold font-bold uppercase mb-4">Concierge Inquiry</p>
                <h2 className="font-serif text-3xl md:text-4xl text-onyx mb-4">{product.name}</h2>
                <div className="h-px w-12 bg-gold/30 mx-auto" />
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] tracking-widest text-gray-500 uppercase font-bold ml-1">Your Name</label>
                    <input
                      required
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-white border border-gray-200 px-4 py-3 text-sm focus:border-gold outline-none transition-colors duration-300"
                      placeholder="E.g. Alexander Smith"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] tracking-widest text-gray-500 uppercase font-bold ml-1">Email Address</label>
                    <input
                      required
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-white border border-gray-200 px-4 py-3 text-sm focus:border-gold outline-none transition-colors duration-300"
                      placeholder="alex@example.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] tracking-widest text-gray-500 uppercase font-bold ml-1">Mobile Number</label>
                  <input
                    required
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-white border border-gray-200 px-4 py-3 text-sm focus:border-gold outline-none transition-colors duration-300"
                    placeholder="E.g. +91 98765 43210"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] tracking-widest text-gray-500 uppercase font-bold ml-1">Personal Message</label>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-white border border-gray-200 px-4 py-3 text-sm focus:border-gold outline-none transition-colors duration-300 resize-none leading-relaxed"
                  />
                </div>

                <button
                  disabled={mutation.isPending}
                  className="w-full bg-onyx text-ivory py-4 px-8 text-[11px] tracking-[0.3em] font-bold uppercase transition-all duration-500 hover:bg-gold flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  {mutation.isPending ? "Sending..." : (
                    <>
                      Send Inquiry <Send size={14} />
                    </>
                  )}
                </button>

                <p className="text-[9px] text-center text-gray-400 tracking-widest uppercase">
                  Private & Confidential · Maison Aurum Atelier
                </p>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
