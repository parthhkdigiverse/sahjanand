import { createFileRoute } from "@tanstack/react-router";
import { HeroCarousel } from "@/components/HeroCarousel";
import { LeadCapture } from "@/components/LeadCapture";
import { GoldRates } from "@/components/GoldRates";
import { FeaturedProducts } from "@/components/FeaturedProducts";
import { InstagramFeed } from "@/components/InstagramFeed";
import { GoogleReviews } from "@/components/GoogleReviews";
import { VideoTestimonials } from "@/components/VideoTestimonials";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Maison Aurum — Timeless Elegance, Crafted for Every Occasion" },
      {
        name: "description",
        content:
          "Heirloom gold and diamond jewellery from Maison Aurum's atelier. Browse rings, necklaces, earrings and bracelets — and view today's gold rate.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <>
      <HeroCarousel />
      <LeadCapture />
      <GoldRates />
      <FeaturedProducts />
      <InstagramFeed />
      <GoogleReviews />
      <VideoTestimonials />
    </>
  );
}
