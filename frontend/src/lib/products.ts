import p1 from "@/assets/aurelia-halo-ring.png";
import p2 from "@/assets/esmeralda-emerald-pendant.png";
import p3 from "@/assets/celeste-star-earrings.png";
import p8 from "@/assets/product-8.jpg";

import p1_2 from "@/assets/aurelia-ring-2.png";
import p1_3 from "@/assets/aurelia-ring-3.png";
import p3_2 from "@/assets/celeste-earrings-2.png";
import p3_3 from "@/assets/celeste-earrings-3.png";
import p4_1 from "@/assets/gold-bangle-1.png";
import p4_2 from "@/assets/gold-bangle-2.png";
import p5_1 from "@/assets/emerald-ring-1.png";
import p5_2 from "@/assets/emerald-ring-2.png";
import p6_1 from "@/assets/diamond-bracelet-1.png";
import p6_2 from "@/assets/diamond-bracelet-2.png";
import p7_1 from "@/assets/gold-hoops-1.png";
import p2_2 from "@/assets/esmeralda-pendant-2.png";
import p2_3 from "@/assets/esmeralda-pendant-3.png";
import p2_4 from "@/assets/esmeralda-pendant-4.png";

export type Product = {
  id: string;
  name: string;
  price: number | "REQUEST";
  category: "Rings" | "Necklaces" | "Earrings" | "Bracelets";
  metal: "Gold" | "Diamond" | "Silver";
  image: string;
  images?: string[];
  weight: string;
  material: string;
  description: string;
  features?: string[];
};

export const products: Product[] = [
  {
    id: "aurelia-halo-ring",
    name: "Aurélia Halo Ring",
    price: "REQUEST",
    category: "Rings",
    metal: "Diamond",
    image: p1,
    images: [p1, p1_2, p1_3],
    weight: "3.4 g",
    material: "18K Yellow Gold · 0.85ct Diamond",
    description:
      "A classic solitaire ring set in 18K gold. Hand-finished and made to last a lifetime.",
    features: ["18K Yellow Gold", "0.85ct Diamond", "Halo Setting", "Certified Diamond", "Hand-finished"],
  },
  {
    id: "esmeralda-emerald-pendant",
    name: "Esmeralda Emerald Pendant",
    price: "REQUEST",
    category: "Necklaces",
    metal: "Gold",
    image: p2,
    images: [p2, p2_2, p2_3, p2_4],
    weight: "5.1 g",
    material: "22K Gold · 18\" chain",
    description:
      "A captivating Colombian emerald set within a frame of round brilliant diamonds, suspended on a 22K gold chain.",
    features: ["22K Gold", "Colombian Emerald", "Diamond Halo", "18 inch chain", "Gift Box included"],
  },
  {
    id: "celeste-star-earrings",
    name: "Celeste Star Earrings",
    price: "REQUEST",
    category: "Earrings",
    metal: "Diamond",
    image: p3,
    images: [p3, p3_2, p3_3],
    weight: "1.8 g (pair)",
    material: "18K Gold · 0.50ct total",
    description:
      "Two perfectly matched diamonds in a star setting. The everyday earring.",
    features: ["18K White Gold", "0.50ct Diamonds", "Star Shape", "Push-back closure", "IGI Certified"],
  },
  {
    id: "polished-bangle",
    name: "Polished Gold Bangle",
    price: "REQUEST",
    category: "Bracelets",
    metal: "Gold",
    image: p4_1,
    images: [p4_1, p4_2],
    weight: "12.6 g",
    material: "22K Yellow Gold",
    description:
      "A smooth, mirror-finish 22K gold bangle. Minimalist elegance designed to be worn alone or stacked.",
    features: ["22K Solid Gold", "Mirror Finish", "Sleek Design", "Hallmarked", "Universal Size"],
  },
  {
    id: "emerald-ring",
    name: "Emerald & Diamond Ring",
    price: 246000,
    category: "Rings",
    metal: "Diamond",
    image: p5_1,
    images: [p5_1, p5_2],
    weight: "4.2 g",
    material: "18K Gold · 1.4ct Emerald · Diamond Halo",
    description:
      "A vivid Colombian emerald surrounded by a brilliant diamond halo. A timeless statement piece with vintage charm.",
    features: ["18K Yellow Gold", "1.4ct Emerald", "Diamond Cluster", "Vintage Design", "Security Clasp"],
  },
  {
    id: "diamond-bracelet",
    name: "Diamond Tennis Bracelet",
    price: "REQUEST",
    category: "Bracelets",
    metal: "Diamond",
    image: p6_1,
    images: [p6_1, p6_2],
    weight: "4.8 g",
    material: "18K Gold · 0.75ct Diamonds",
    description:
      "A continuous line of hand-set diamonds on a slim 18K gold band. The definition of quiet luxury.",
    features: ["18K Yellow Gold", "0.75ct Brilliant Diamonds", "Slim Profile", "Hand-set", "Luxury Finishing"],
  },
  {
    id: "gold-hoops",
    name: "Classic Gold Hoops",
    price: 48600,
    category: "Earrings",
    metal: "Gold",
    image: p7_1,
    images: [p7_1],
    weight: "3.2 g (pair)",
    material: "18K Gold",
    description:
      "Refined and perfectly rounded, these polished 18K gold hoops are an essential staple for every wardrobe.",
    features: ["18K Yellow Gold", "Polished Finish", "Lightweight Comfort", "Secure Hinge", "Daily Wear"],
  },
  {
    id: "layered-necklace",
    name: "Layered Gold Necklace",
    price: 78400,
    category: "Necklaces",
    metal: "Gold",
    image: p8,
    images: [p8],
    weight: "6.4 g",
    material: "18K Gold · Dual chain with diamond drops",
    description:
      "Two delicate 18K gold chains layered together, accented with subtle diamond drops for a contemporary look.",
    features: ["18K Yellow Gold", "Dual Layered Chain", "Diamond Accents", "Adjustable Length", "Modern Style"],
  },
];

export const formatINR = (n: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);
