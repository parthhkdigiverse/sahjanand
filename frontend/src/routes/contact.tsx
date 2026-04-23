import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { submitContact } from "@/lib/api";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Us — Maison Aurum Mumbai" },
      {
        name: "description",
        content:
          "Visit our store in Mumbai or book a private appointment with our team. We'd love to hear from you.",
      },
      { property: "og:title", content: "Contact Us — Maison Aurum" },
      { property: "og:description", content: "Visit our Mumbai store or book an appointment." },
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
    <section className="pt-32 pb-24 container-luxe">
      <div className="text-center mb-16">
        <p className="divider-gold mb-5">Get in Touch</p>
        <h1 className="font-serif text-5xl md:text-6xl mb-4">Visit Our Store</h1>
        <p className="text-sm text-muted-foreground max-w-md mx-auto">
          Walk in any day, or book a private appointment with our team.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        <div className="space-y-8">
          {[
            { icon: MapPin, t: "Address", l: ["14 Marine Drive", "Colaba, Mumbai 400001"] },
            { icon: Phone, t: "Phone", l: ["+91 22 4000 0000"] },
            { icon: Mail, t: "Email", l: ["hello@maisonaurum.com"] },
            { icon: Clock, t: "Hours", l: ["Tue – Sat · 11:00 – 19:00", "Sun & Mon · By appointment"] },
          ].map(({ icon: Icon, t, l }) => (
            <div key={t} className="flex gap-5">
              <div className="h-12 w-12 rounded-full border border-gold flex items-center justify-center text-gold flex-none">
                <Icon size={18} />
              </div>
              <div>
                <h3 className="text-xs tracking-luxe text-gold mb-2">{t}</h3>
                {l.map((line) => (
                  <p key={line} className="text-foreground/80">{line}</p>
                ))}
              </div>
            </div>
          ))}

          <div className="aspect-[4/3] bg-secondary mt-10 grid place-items-center text-muted-foreground text-xs tracking-luxe">
            [ Store Map ]
          </div>
        </div>

        <div className="bg-card border border-border p-10 shadow-card">
          {sent ? (
            <div className="text-center py-10">
              <div className="text-gold mx-auto mb-4 w-12 h-12 rounded-full border border-gold flex items-center justify-center text-xl">✓</div>
              <h3 className="font-serif text-3xl mb-2">Thank You</h3>
              <p className="text-sm text-muted-foreground">We'll get back to you within an hour.</p>
            </div>
          ) : (
            <>
              <p className="divider-gold mb-5">Book a Visit</p>
              <h2 className="font-serif text-3xl mb-8">Make an Appointment</h2>
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <label className="text-[0.65rem] tracking-luxe text-muted-foreground">Full Name</label>
                    <input
                      required
                      type="text"
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      className="w-full mt-1 bg-transparent border-b border-input py-2 outline-none focus:border-gold transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-[0.65rem] tracking-luxe text-muted-foreground">Email</label>
                    <input
                      required
                      type="email"
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                      className="w-full mt-1 bg-transparent border-b border-input py-2 outline-none focus:border-gold transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-[0.65rem] tracking-luxe text-muted-foreground">Phone</label>
                    <input
                      required
                      type="tel"
                      value={formData.phone}
                      onChange={e => setFormData({...formData, phone: e.target.value})}
                      className="w-full mt-1 bg-transparent border-b border-input py-2 outline-none focus:border-gold transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-[0.65rem] tracking-luxe text-muted-foreground">Preferred Date</label>
                    <input
                      required
                      type="date"
                      value={formData.date}
                      onChange={e => setFormData({...formData, date: e.target.value})}
                      className="w-full mt-1 bg-transparent border-b border-input py-2 outline-none focus:border-gold transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-[0.65rem] tracking-luxe text-muted-foreground">Message (optional)</label>
                    <textarea
                      rows={4}
                      value={formData.message}
                      onChange={e => setFormData({...formData, message: e.target.value})}
                      className="w-full mt-1 bg-transparent border-b border-input py-2 outline-none focus:border-gold transition-colors resize-none"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="sheen w-full mt-6 py-4 bg-onyx text-ivory text-xs tracking-luxe hover:bg-gold hover:text-onyx transition-colors disabled:opacity-50"
                  style={{ backgroundColor: "var(--onyx)", color: "var(--ivory)" }}
                >
                  {isSubmitting ? "Sending..." : "Book Appointment →"}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
