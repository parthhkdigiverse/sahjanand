const getBackendBase = () => {
  if (typeof window !== 'undefined') {
    return `http://${window.location.hostname}:8002`;
  }
  return "http://localhost:8002";
};

const getApiBase = () => `${getBackendBase()}/api`;

export const API_BASE = getApiBase();
export const BACKEND_BASE = getBackendBase();

export const getImageUrl = (path: string) => {
  if (!path) return '';
  // If it's a full URL, data URI, or blob URI, return as is
  if (path.startsWith('http') || path.startsWith('data:') || path.startsWith('blob:')) {
    return path;
  }
  // Ensure it starts with a slash
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  
  // If it's an uploaded file or asset, prepend backend base
  if (cleanPath.startsWith('/uploads')) {
    return `${BACKEND_BASE}${cleanPath}`;
  }
  
  // Local assets are served from the frontend itself
  return cleanPath;
};

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

export type InstagramPost = {
  _id: string;
  image_url: string;
  link: string;
  order: number;
};

export type GalleryItem = {
  id: string;
  title: string;
  image: string;
  category?: string;
  description?: string;
  order?: number;
};

export type GallerySettings = {
  eyebrow: string;
  heading: string;
  subheading: string;
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
  phone?: string;
  preferred_date?: string;
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

export async function fetchGalleryItems(): Promise<GalleryItem[]> {
  const res = await fetch(`${API_BASE}/gallery/`);
  if (!res.ok) throw new Error("Failed to fetch gallery items");
  return res.json();
}

export async function fetchGallerySettings(): Promise<GallerySettings> {
  const res = await fetch(`${API_BASE}/gallery/settings`);
  if (!res.ok) throw new Error("Failed to fetch gallery settings");
  return res.json();
}

export async function updateGallerySettings(data: GallerySettings, token: string) {
  const res = await fetch(`${API_BASE}/gallery/settings`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update gallery settings");
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
  // Gold Price Settings
  gold_price_source: 'manual' | 'api';
  manual_price_24k: number;
  manual_price_22k: number;
  manual_price_18k: number;
  gold_price_api_key?: string;
  offer_button_text: string;
  offer_footer_text: string;
  contact_address: string;
  contact_phone: string;
  contact_email: string;
  instagram_url: string;
  facebook_url: string;
  twitter_url: string;
  youtube_url: string;
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

export async function fetchInstagramPosts(): Promise<InstagramPost[]> {
  const res = await fetch(`${API_BASE}/instagram/`);
  if (!res.ok) return [];
  return res.json();
}

// Gold Prices
export type GoldPriceResponse = {
  price_24k: number;
  price_22k: number;
  price_18k: number;
  change: number;
  source: string;
};

export async function fetchGoldPrices(): Promise<GoldPriceResponse> {
  const res = await fetch(`${API_BASE}/gold-prices/`);
  if (!res.ok) throw new Error("Failed to fetch gold prices");
  return res.json();
}
// Offers (Dynamic Promotions)
export type Offer = {
  _id: string;
  title: string;
  description: string;
  code: string;
  image?: string;
  is_active: boolean;
  expiry_date?: string;
  created_at: string;
};

export async function fetchOffers(): Promise<Offer[]> {
  const res = await fetch(`${API_BASE}/offers/`);
  if (!res.ok) return [];
  return res.json();
}

export async function createOffer(data: Omit<Offer, "_id" | "created_at">, token: string) {
  const res = await fetch(`${API_BASE}/offers/`, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function updateOffer(id: string, data: Partial<Offer>, token: string) {
  const res = await fetch(`${API_BASE}/offers/${id}`, {
    method: "PUT",
    headers: { 
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function deleteOffer(id: string, token: string) {
  const res = await fetch(`${API_BASE}/offers/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error("Failed to delete offer");
  return res.json();
}

// --- About Page Types & API ---
export type PromiseItem = {
  title: string;
  description: string;
};

export type AboutData = {
  hero_image?: string;
  hero_heading: string;
  hero_eyebrow: string;
  story_heading: string;
  story_eyebrow: string;
  story_paragraphs: string[];
  promise_image?: string;
  promise_heading: string;
  promise_eyebrow: string;
  promises: PromiseItem[];
  cta_text: string;
  cta_link: string;
};

export async function fetchAboutData(): Promise<AboutData> {
  const res = await fetch(`${API_BASE}/about/`);
  if (!res.ok) throw new Error("Failed to fetch about data");
  return res.json();
}

export async function updateAboutData(data: AboutData, token: string) {
  const res = await fetch(`${API_BASE}/about/`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update about data");
  return res.json();
}

// --- Policies API ---
export type PolicySection = {
  heading: string;
  body: string[];
};

export type Policy = {
  _id?: string;
  slug: string;
  title: string;
  intro: string;
  sections: PolicySection[];
};

export async function fetchPolicies(): Promise<Policy[]> {
  const res = await fetch(`${API_BASE}/policies/`);
  if (!res.ok) throw new Error("Failed to fetch policies");
  return res.json();
}

export async function fetchPolicy(slug: string): Promise<Policy> {
  const res = await fetch(`${API_BASE}/policies/${slug}`);
  if (!res.ok) throw new Error("Failed to fetch policy");
  return res.json();
}

export async function createPolicy(data: Policy, token: string) {
  const res = await fetch(`${API_BASE}/policies/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create policy");
  return res.json();
}

export async function updatePolicy(id: string, data: Policy, token: string) {
  const res = await fetch(`${API_BASE}/policies/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update policy");
  return res.json();
}

export async function deletePolicy(id: string, token: string) {
  const res = await fetch(`${API_BASE}/policies/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error("Failed to delete policy");
  return res.json();
}
