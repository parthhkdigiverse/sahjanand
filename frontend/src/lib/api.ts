const API_BASE = "http://localhost:8001/api";

export type Product = {
  id: string;
  name: string;
  category: string;
  metal: string;
  image: string;
  images?: string[];
  weight: string;
  material: string;
  description: string;
  features?: string[];
  featured?: boolean;
};

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

export type Review = {
  id: string;
  name: string;
  image: string;
  rating: number;
  text: string;
};

export type Testimonial = {
  image: string;
  name: string;
  quote: string;
  video_url?: string;
};

export interface Category {
  id: string;
  name: string;
  image?: string;
};

export type HeroSlide = {
  _id: string;
  image: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  link_text: string;
  link_url: string;
  order: number;
};

export type OfferLead = {
  _id: string;
  name: string;
  email: string;
  phone: string;
  offer_code: string;
  created_at: string;
};

export async function fetchProducts(): Promise<Product[]> {
  const res = await fetch(`${API_BASE}/products/`);
  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json();
}

export async function fetchProduct(id: string): Promise<Product> {
  const res = await fetch(`${API_BASE}/products/${id}`);
  if (!res.ok) throw new Error("Failed to fetch product");
  return res.json();
}

export async function fetchBlogs(): Promise<BlogPost[]> {
  const res = await fetch(`${API_BASE}/blogs/`);
  if (!res.ok) throw new Error("Failed to fetch blogs");
  return res.json();
}

export async function fetchBlog(slug: string): Promise<BlogPost> {
  const res = await fetch(`${API_BASE}/blogs/${slug}`);
  if (!res.ok) throw new Error("Failed to fetch blog");
  return res.json();
}

export type ContactInquiry = {
  name: string;
  email: string;
  subject: string;
  message: string;
  type: "GENERAL" | "PRODUCT";
  product_id?: string;
  product_name?: string;
};

export async function submitContact(data: ContactInquiry) {
  const res = await fetch(`${API_BASE}/contacts/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to submit inquiry");
  return res.json();
}

export async function fetchReviews(): Promise<Review[]> {
  const res = await fetch(`${API_BASE}/reviews/`);
  if (!res.ok) throw new Error("Failed to fetch reviews");
  return res.json();
}

export async function fetchTestimonials(): Promise<Testimonial[]> {
  const res = await fetch(`${API_BASE}/testimonials/`);
  if (!res.ok) throw new Error("Failed to fetch testimonials");
  return res.json();
}

export async function fetchCategories(): Promise<Category[]> {
  const res = await fetch(`${API_BASE}/categories/`);
  if (!res.ok) throw new Error("Failed to fetch categories");
  return res.json();
}

export type SiteSettings = {
  reviews_heading: string;
  reviews_subheading: string;
  offer_heading: string;
  offer_subheading: string;
  offer_description: string;
  offer_image?: string;
  popup_eyebrow: string;
  popup_heading: string;
  popup_description: string;
  popup_button_text: string;
};

export async function fetchSettings(): Promise<SiteSettings> {
  const res = await fetch(`${API_BASE}/settings/`);
  if (!res.ok) throw new Error("Failed to fetch settings");
  return res.json();
}

export async function updateSettings(data: SiteSettings, token: string) {
  const res = await fetch(`${API_BASE}/settings/`, {
    method: "PUT",
    headers: { 
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update settings");
  return res.json();
}

// Hero Slides
export async function fetchHeroSlides(): Promise<HeroSlide[]> {
  const res = await fetch(`${API_BASE}/hero/`);
  if (!res.ok) return [];
  return res.json();
}

export async function createHeroSlide(data: Omit<HeroSlide, "_id">, token: string) {
  const res = await fetch(`${API_BASE}/hero/`, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function updateHeroSlide(id: string, data: Partial<HeroSlide>, token: string) {
  const res = await fetch(`${API_BASE}/hero/${id}`, {
    method: "PUT",
    headers: { 
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function deleteHeroSlide(id: string, token: string) {
  const res = await fetch(`${API_BASE}/hero/${id}`, {
    method: "DELETE",
    headers: { "Authorization": `Bearer ${token}` }
  });
  return res.json();
}

// Offer Leads
export async function fetchOfferLeads(token: string): Promise<OfferLead[]> {
  const res = await fetch(`${API_BASE}/offer-leads/`, {
    headers: { "Authorization": `Bearer ${token}` }
  });
  if (!res.ok) return [];
  return res.json();
}

export async function submitOfferLead(data: Omit<OfferLead, "_id" | "created_at">) {
  const res = await fetch(`${API_BASE}/offer-leads/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function deleteOfferLead(id: string, token: string) {
  const res = await fetch(`${API_BASE}/offer-leads/${id}`, {
    method: "DELETE",
    headers: { "Authorization": `Bearer ${token}` }
  });
  return res.json();
}
