import { useState } from "react";
import { X } from "lucide-react";
import offerImg from "@/assets/offer.jpg";
import { useQuery, useMutation } from "@tanstack/react-query";
import { fetchSettings, submitOfferLead, getImageUrl } from "@/lib/api";
import { toast } from "sonner";

export function LeadCapture() {
  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "" });

  const { data: settings } = useQuery({
    queryKey: ["settings"],
    queryFn: fetchSettings,
  });

  const leadMutation = useMutation({
    mutationFn: submitOfferLead,
    onSuccess: () => {
      setSubmitted(true);
      setTimeout(() => {
        setOpen(false);
        setSubmitted(false);
        setFormData({ name: "", email: "", phone: "" });
      }, 2500);
    },
    onError: () => toast.error("Something went wrong. Please try again."),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    leadMutation.mutate({
      ...formData,
      offer_code: "WELCOME10"
    });
  };

  return (
    <section className="container-luxe py-24 md:py-32">
      <div className="grid grid-cols-1 lg:grid-cols-2 items-stretch shadow-luxe overflow-hidden bg-card">
        {/* LEFT — offer text + CTA */}
        <div className="relative p-10 md:p-16 lg:p-20 flex flex-col justify-center">
          <p className="divider-gold mb-6">{settings?.offer_subheading || "Welcome Offer"}</p>
          <h2 className="font-serif text-4xl md:text-5xl leading-tight mb-5">
            {settings?.offer_heading ? (
              <span dangerouslySetInnerHTML={{ __html: settings.offer_heading.replace(/(10% Off)/g, '<span class="italic text-gold">$1</span>') }} />
            ) : (
              <>Get <span className="italic text-gold">10% Off</span></>
            )}
          </h2>
          <p className="text-foreground/70 max-w-md mb-10 leading-relaxed">
            {settings?.offer_description || "A small thank-you for choosing us. Share your details and we'll send your discount code straight to your inbox."}
          </p>
          <div>
            <button
              onClick={() => setOpen(true)}
              className="sheen inline-flex items-center gap-3 px-9 py-4 bg-onyx text-ivory text-xs tracking-luxe hover:bg-gold hover:text-onyx transition-colors"
              style={{
                backgroundColor: "var(--onyx)",
                color: "var(--ivory)",
              }}
            >
              {settings?.offer_button_text || "Get My Offer"} →
            </button>
            <p className="text-[0.7rem] tracking-wide text-muted-foreground mt-4">
              {settings?.offer_footer_text || "Limited time · One per customer"}
            </p>
          </div>
        </div>

        {/* RIGHT — image */}
        <div className="relative aspect-[4/5] lg:aspect-auto overflow-hidden bg-secondary">
          <img
            src={settings?.offer_image ? getImageUrl(settings.offer_image) : offerImg}
            alt="Offer"
            loading="lazy"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              if (target.src !== offerImg) target.src = offerImg;
            }}
            className="absolute inset-0 h-full w-full object-cover"
          />
        </div>
      </div>

      {/* Modal */}
      {open && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-onyx/70 backdrop-blur-sm animate-fade-up"
          onClick={() => setOpen(false)}
          style={{ animationDuration: "0.3s" }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md bg-card text-card-foreground p-10 shadow-luxe animate-fade-up"
            style={{ animationDelay: "0.1s" }}
          >
            <button
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
            >
              <X size={18} />
            </button>

            {submitted ? (
              <div className="text-center py-8">
                <div className="text-gold mx-auto mb-4 w-12 h-12 rounded-full border border-gold flex items-center justify-center">
                  ✓
                </div>
                <h3 className="font-serif text-2xl mb-2">Thank you</h3>
                <p className="text-sm text-muted-foreground">
                  Your discount code is on its way.
                </p>
              </div>
            ) : (
              <>
                <p className="divider-gold mb-5">{settings?.popup_eyebrow || "Claim Offer"}</p>
                <h3 className="font-serif text-3xl mb-2">{settings?.popup_heading || "Your 10% Discount"}</h3>
                <p className="text-sm text-muted-foreground mb-8">
                  {settings?.popup_description || "Just a few details and your code is yours."}
                </p>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="text-[0.65rem] tracking-luxe text-muted-foreground">
                      Name
                    </label>
                    <input
                      required
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      className="w-full mt-1 bg-transparent border-b border-input py-2 outline-none focus:border-gold transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-[0.65rem] tracking-luxe text-muted-foreground">
                      Phone
                    </label>
                    <input
                      required
                      type="tel"
                      value={formData.phone}
                      onChange={e => setFormData({...formData, phone: e.target.value})}
                      className="w-full mt-1 bg-transparent border-b border-input py-2 outline-none focus:border-gold transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-[0.65rem] tracking-luxe text-muted-foreground">
                      Email
                    </label>
                    <input
                      required
                      type="email"
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                      className="w-full mt-1 bg-transparent border-b border-input py-2 outline-none focus:border-gold transition-colors"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={leadMutation.isPending}
                    className="sheen w-full mt-6 py-4 bg-onyx text-ivory text-xs tracking-luxe hover:bg-gold hover:text-onyx transition-colors disabled:opacity-50"
                    style={{
                      backgroundColor: "var(--onyx)",
                      color: "var(--ivory)",
                    }}
                  >
                    {leadMutation.isPending ? "Sending..." : (settings?.popup_button_text || "Send My Code")}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
