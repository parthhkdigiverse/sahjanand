import { createFileRoute } from "@tanstack/react-router";
import { HeroCarousel } from "@/components/HeroCarousel";
import { TrustStrip } from "@/components/TrustStrip";
import { LeadCapture } from "@/components/LeadCapture";
import { FeaturedProducts } from "@/components/FeaturedProducts";
import { InstagramFeed } from "@/components/InstagramFeed";
import { GoogleReviews } from "@/components/GoogleReviews";
import { VideoTestimonials } from "@/components/VideoTestimonials";
import { BrandShowcase } from "@/components/BrandShowcase";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sahajanand Jewellers — Timeless Elegance, Crafted for Every Occasion" },
      {
        name: "description",
        content:
          "Heirloom gold and diamond jewellery from Sahajanand Jewellers' atelier in Nadiad. Browse rings, necklaces, earrings and bracelets.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <>
      <HeroCarousel />
      <TrustStrip />
      <LeadCapture />
      <BrandShowcase />
      <FeaturedProducts />
      <InstagramFeed />
      <GoogleReviews />
      <VideoTestimonials />
    </>
  );
}
