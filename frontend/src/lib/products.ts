import p1 from "@/assets/product-1.jpg";
import p2 from "@/assets/product-2.jpg";
import p3 from "@/assets/product-3.jpg";
import p4 from "@/assets/product-4.jpg";
import p5 from "@/assets/product-5.jpg";
import p6 from "@/assets/product-6.jpg";
import p7 from "@/assets/product-7.jpg";
import p8 from "@/assets/product-8.jpg";

export type Product = {
  id: string;
  name: string;
  price: number;
  category: "Rings" | "Necklaces" | "Earrings" | "Bracelets";
  metal: "Gold" | "Diamond" | "Silver";
  image: string;
  weight: string;
  material: string;
  description: string;
};

export const products: Product[] = [
  {
    id: "solitaire-ring",
    name: "Diamond Solitaire Ring",
    price: 184500,
    category: "Rings",
    metal: "Diamond",
    image: p1,
    weight: "3.4 g",
    material: "18K Yellow Gold · 0.85ct Diamond",
    description:
      "A classic solitaire ring set in 18K gold. Hand-finished and made to last a lifetime.",
  },
  {
    id: "twisted-pendant",
    name: "Twisted Gold Pendant",
    price: 64200,
    category: "Necklaces",
    metal: "Gold",
    image: p2,
    weight: "5.1 g",
    material: "22K Gold · 18\" chain",
    description:
      "A modern twisted gold pendant on a delicate chain. Light, elegant, and easy to wear daily.",
  },
  {
    id: "diamond-studs",
    name: "Diamond Stud Earrings",
    price: 92800,
    category: "Earrings",
    metal: "Diamond",
    image: p3,
    weight: "1.8 g (pair)",
    material: "18K Gold · 0.50ct total",
    description:
      "Two perfectly matched diamonds in a four-prong setting. The everyday earring.",
  },
  {
    id: "polished-bangle",
    name: "Polished Gold Bangle",
    price: 138000,
    category: "Bracelets",
    metal: "Gold",
    image: p4,
    weight: "12.6 g",
    material: "22K Yellow Gold",
    description:
      "A smooth, mirror-finish gold bangle. Wear it alone or stack it with your favourites.",
  },
  {
    id: "emerald-ring",
    name: "Emerald & Diamond Ring",
    price: 246000,
    category: "Rings",
    metal: "Diamond",
    image: p5,
    weight: "4.2 g",
    material: "18K Gold · 1.4ct Emerald · Diamond Halo",
    description:
      "A vivid emerald surrounded by sparkling diamonds. A bold and beautiful statement piece.",
  },
  {
    id: "diamond-bracelet",
    name: "Diamond Tennis Bracelet",
    price: 312000,
    category: "Bracelets",
    metal: "Diamond",
    image: p6,
    weight: "4.8 g",
    material: "18K Gold · 0.75ct Diamonds",
    description:
      "A continuous line of diamonds set on a slim gold band. Quietly stunning.",
  },
  {
    id: "gold-hoops",
    name: "Classic Gold Hoops",
    price: 48600,
    category: "Earrings",
    metal: "Gold",
    image: p7,
    weight: "3.2 g (pair)",
    material: "18K Gold",
    description:
      "Sleek and round, sized to flatter every face. The hoop earring, simply done right.",
  },
  {
    id: "layered-necklace",
    name: "Layered Gold Necklace",
    price: 78400,
    category: "Necklaces",
    metal: "Gold",
    image: p8,
    weight: "6.4 g",
    material: "18K Gold · Dual chain with diamond drops",
    description:
      "Two chains layered together with delicate diamond drops. The layered look, ready to wear.",
  },
];

export const formatINR = (n: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);
