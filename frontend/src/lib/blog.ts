import insta1 from "@/assets/insta-1.jpg";
import insta2 from "@/assets/insta-2.jpg";
import insta3 from "@/assets/insta-3.jpg";
import insta4 from "@/assets/insta-4.jpg";
import insta5 from "@/assets/insta-5.jpg";
import insta6 from "@/assets/insta-6.jpg";

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  date: string;
  image: string;
  content: string[];
};

export const blogPosts: BlogPost[] = [
  {
    slug: "jewellery-care-tips",
    title: "Jewellery Care Tips: Keep Your Pieces Timeless",
    excerpt:
      "Simple, daily habits that help your fine jewellery shine for generations.",
    category: "Care Guide",
    readTime: "5 min read",
    date: "April 12, 2026",
    image: insta1,
    content: [
      "Fine jewellery is meant to be worn — but a little care goes a long way. Begin by storing each piece separately in a soft pouch or lined box. This prevents scratches between metals and stones.",
      "Avoid contact with perfume, lotion, and chlorine. Always put your jewellery on last when getting ready, and remove it first when returning home.",
      "For everyday cleaning, gently wipe pieces with a soft microfibre cloth. For a deeper clean, soak gold jewellery in warm water with a drop of mild soap, then dry with a lint-free cloth.",
      "Bring your jewellery in for a professional polish once a year. Our atelier offers complimentary cleaning and inspection for every piece purchased at Maison Aurum.",
    ],
  },
  {
    slug: "latest-trends-2026",
    title: "Latest Trends: What's Shining in 2026",
    excerpt:
      "From sculptural gold to coloured gemstones, the looks defining the new season.",
    category: "Trends",
    readTime: "6 min read",
    date: "April 5, 2026",
    image: insta2,
    content: [
      "This year, jewellery is bolder, more personal, and unapologetically artistic. Sculptural gold cuffs and architectural ear cuffs are taking centre stage, replacing the delicate stacking trend of the past.",
      "Coloured gemstones — emeralds, sapphires, and pink tourmalines — are returning to bridal collections. Pair a coloured stone with a classic diamond halo for a modern heirloom feel.",
      "Mixed metals are no longer a faux pas. Layering yellow gold with rose gold and a touch of platinum creates depth and character.",
      "Most importantly, meaningful pieces are winning. Initials, birthstones, and custom engravings are turning every purchase into a story worth wearing.",
    ],
  },
  {
    slug: "buying-guide",
    title: "The Buying Guide: How to Choose Fine Jewellery",
    excerpt:
      "A short, honest guide to choosing pieces you'll treasure for life.",
    category: "Guide",
    readTime: "7 min read",
    date: "March 28, 2026",
    image: insta3,
    content: [
      "Buying fine jewellery is an emotional decision — but a few simple rules help you choose with confidence. Start with purpose: is this piece for daily wear, an occasion, or a long-term investment?",
      "For daily wear, choose 18K gold. It's durable and holds gemstones securely. For investment or bridal pieces, 22K and 24K gold offer higher purity.",
      "When buying diamonds, focus on cut first — it's what gives a stone its brilliance. Carat weight matters less than how the diamond catches light.",
      "Always ask for a certificate. Every Maison Aurum piece comes with a BIS Hallmark and a detailed authenticity card listing metal, weight, and gemstone grades.",
    ],
  },
  {
    slug: "bridal-essentials",
    title: "Bridal Essentials: A Timeless Wedding Set",
    excerpt:
      "Curating a bridal jewellery wardrobe that feels personal, not predictable.",
    category: "Bridal",
    readTime: "5 min read",
    date: "March 15, 2026",
    image: insta4,
    content: [
      "A bridal jewellery set is more than ornament — it's the closing chapter of how you show up on your day. Start with one signature piece, like a statement necklace, and build outward.",
      "Choose pieces you'll wear again. A pair of diamond studs or a delicate tennis bracelet can move from your wedding day into everyday life.",
      "Consider heirloom integration. Many brides now reset family stones into modern designs, blending heritage with their own taste.",
      "Most of all, trust your instinct. The right set feels right the moment you put it on.",
    ],
  },
  {
    slug: "diamond-101",
    title: "Diamond 101: Understanding the Four Cs",
    excerpt: "A clear, jargon-free look at what really makes a diamond beautiful.",
    category: "Guide",
    readTime: "8 min read",
    date: "March 2, 2026",
    image: insta5,
    content: [
      "The Four Cs — cut, colour, clarity, and carat — are the universal language of diamonds. Understanding them helps you buy with confidence.",
      "Cut is the most important. A well-cut diamond reflects light from edge to edge, creating that signature brilliance. Skimp anywhere, but never on cut.",
      "Colour ranges from D (colourless) to Z (light yellow). For most pieces, an F to H grade looks beautifully white to the eye.",
      "Clarity refers to internal characteristics. VS1 to VS2 grades are eye-clean and excellent value. Carat is simply weight — but two diamonds of the same carat can look very different depending on cut.",
    ],
  },
  {
    slug: "gold-investment",
    title: "Gold as Investment: A Modern Perspective",
    excerpt: "Why gold jewellery remains one of the most enduring assets in India.",
    category: "Investment",
    readTime: "6 min read",
    date: "February 18, 2026",
    image: insta6,
    content: [
      "Gold has been a cornerstone of Indian wealth for centuries. Today, it remains both an emotional and a financial choice.",
      "When buying gold for investment, focus on higher karatage — 22K and 24K. They retain more value over time and are easier to liquidate.",
      "Always insist on a BIS Hallmark and a detailed invoice. These protect your purchase and help with future resale or exchange.",
      "Consider buying in stages. Adding a small gold piece every year builds a meaningful collection without straining your budget.",
    ],
  },
];

export function getBlogBySlug(slug: string) {
  return blogPosts.find((p) => p.slug === slug);
}
