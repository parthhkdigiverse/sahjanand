import { authenticatedFetch } from "@/services/auth";

declare const __BACKEND_PORT__: string;

const getBackendBase = () => {
  const port = typeof __BACKEND_PORT__ !== 'undefined' ? __BACKEND_PORT__ : "8002";
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    
    // For deployment on a domain (like sahjanand.hkdigiverse.com), 
    // use a relative path to let the reverse proxy (Nginx) handle the routing.
    // This solves HTTPS/Mixed content issues without needing SSL configs in the backend.
    if (hostname !== 'localhost' && !hostname.match(/^\d/)) {
      // Check if we have an explicit override from environment
      // @ts-ignore - Vite environment variable
      const envBase = import.meta.env.VITE_API_URL;
      if (envBase) return envBase;
      
      return ""; // Use relative URL
    }
    
    // For local development or IP-based access, stay with the explicit port
    const protocol = window.location.protocol;
    return `${protocol}//${hostname}:${port}`;
  }
  return `http://localhost:${port}`;
};

const getApiBase = () => `${getBackendBase()}/api`;

export const API_BASE = getApiBase();
export const BACKEND_BASE = getBackendBase();

export const getImageUrl = (path: string | undefined | null) => {
  if (!path) return undefined;
  // If it's a data URI or blob URI, return as is
  if (path.startsWith('data:') || path.startsWith('blob:')) {
    return path;
  }
  
  // If it's already a full URL pointing elsewhere, return as is
  if (path.startsWith('http') && !path.includes(BACKEND_BASE) && !path.includes('localhost')) {
    return path;
  }

  // Get the relative path
  let cleanPath = path;
  if (path.includes('/uploads/')) {
    cleanPath = path.substring(path.indexOf('/uploads/'));
  } else if (!path.startsWith('/')) {
    cleanPath = `/${path}`;
  }
  
  // Return the relative path for uploaded files
  if (cleanPath.startsWith('/uploads')) {
    return cleanPath;
  }
  
  return cleanPath;
};

export const cleanImageUrl = (url: string | undefined | null) => {
  if (!url) return "";
  if (url.includes('/uploads/')) {
    return url.substring(url.indexOf('/uploads/'));
  }
  return url;
};

export type Product = {
  id: string;
  name: string;
  category: string;
  metal: string;
  image: string;
  images?: string[];
  weight: string;
  material?: string;
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
  meta_title?: string;
  meta_description?: string;
  keywords?: string;
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
  link_type: "NONE" | "BUTTON" | "LINK";
  order: number;
};

export type OfferLead = {
  _id: string;
  name: string;
  email?: string;
  phone: string;
  offer_code: string;
  is_read: boolean;
  data?: Record<string, any>;
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

export async function subscribeNewsletter(email: string) {
  const res = await fetch(`${API_BASE}/newsletter/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  if (!res.ok) throw new Error("Failed to subscribe to newsletter");
  return res.json();
}

export async function fetchSubscribers(token: string) {
  const res = await authenticatedFetch(`${API_BASE}/newsletter/`);
  if (!res.ok) throw new Error("Failed to fetch subscribers");
  return res.json();
}

export async function deleteSubscriber(id: string, token: string) {
  const res = await authenticatedFetch(`${API_BASE}/newsletter/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete subscriber");
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
  const res = await authenticatedFetch(`${API_BASE}/gallery/settings`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update gallery settings");
  return res.json();
}

export type FormField = {
  id: string;
  name: string;
  label: string;
  type: string;
  required: boolean;
  is_constant: boolean;
};

export type SiteSettings = {
  offer_heading: string;
  offer_subheading: string;
  offer_description: string;
  offer_image?: string;
  popup_eyebrow: string;
  popup_heading: string;
  popup_description: string;
  popup_button_text: string;
  form_fields: FormField[];
  // Gold Price Settings removed
  offer_button_text: string;
  offer_footer_text: string;
  contact_address: string;
  promise_title: string;
  promise_text: string;
  contact_phone: string;
  contact_email: string;
  instagram_url: string;
  facebook_url: string;
  twitter_url: string;
  youtube_url: string;
  whatsapp_number: string;
  videocall_url?: string;
  chat_url?: string;
  instagram_eyebrow: string;
  instagram_heading: string;
  instagram_subheading: string;
  reviews_heading: string;
  reviews_subheading: string;
  testimonials_heading: string;
  testimonials_subheading: string;
  show_announcement: boolean;
  announcement_text: string;
};

export async function fetchSettings(): Promise<SiteSettings> {
  const res = await fetch(`${API_BASE}/settings/`);
  if (!res.ok) throw new Error("Failed to fetch settings");
  return res.json();
}

export async function updateSettings(data: SiteSettings, token: string) {
  const res = await authenticatedFetch(`${API_BASE}/settings/`, {
    method: "PUT",
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
  const res = await authenticatedFetch(`${API_BASE}/hero/`, {
    method: "POST",
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function updateHeroSlide(id: string, data: Partial<HeroSlide>, token: string) {
  const res = await authenticatedFetch(`${API_BASE}/hero/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function deleteHeroSlide(id: string, token: string) {
  const res = await authenticatedFetch(`${API_BASE}/hero/${id}`, {
    method: "DELETE",
  });
  return res.json();
}

// Offer Leads
export async function fetchOfferLeads(token: string): Promise<OfferLead[]> {
  const res = await authenticatedFetch(`${API_BASE}/offer-leads/`);
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
  const res = await authenticatedFetch(`${API_BASE}/offer-leads/${id}`, {
    method: "DELETE",
  });
  return res.json();
}

export async function toggleOfferLeadRead(id: string, isRead: boolean) {
  const res = await authenticatedFetch(`${API_BASE}/offer-leads/${id}/toggle-read`, {
    method: "PATCH",
    body: JSON.stringify({ is_read: isRead }),
  });
  if (!res.ok) throw new Error("Failed to toggle read status");
  return res.json();
}

export async function fetchInstagramPosts(): Promise<InstagramPost[]> {
  const res = await fetch(`${API_BASE}/instagram/`);
  if (!res.ok) return [];
  return res.json();
}

// Gold Prices removed
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
  const res = await authenticatedFetch(`${API_BASE}/offers/`, {
    method: "POST",
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function updateOffer(id: string, data: Partial<Offer>, token: string) {
  const res = await authenticatedFetch(`${API_BASE}/offers/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function deleteOffer(id: string, token: string) {
  const res = await authenticatedFetch(`${API_BASE}/offers/${id}`, {
    method: "DELETE",
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

export type ContactPageData = {
  hero_image?: string;
  hero_eyebrow: string;
  hero_heading: string;
  hero_description: string;
  boutique_address_line1: string;
  boutique_address_line2: string;
  concierge_phone: string;
  inquiries_email: string;
  opening_hours_line1: string;
  map_embed_url: string;
};

export async function fetchAboutData(): Promise<AboutData> {
  const res = await fetch(`${API_BASE}/about/`);
  if (!res.ok) throw new Error("Failed to fetch about data");
  return res.json();
}

export async function updateAboutData(data: AboutData, token: string) {
  const res = await authenticatedFetch(`${API_BASE}/about/`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update about data");
  return res.json();
}

export async function fetchContactPageData(): Promise<ContactPageData> {
  const res = await fetch(`${API_BASE}/contact-page/`);
  if (!res.ok) throw new Error("Failed to fetch contact page data");
  return res.json();
}

export async function updateContactPageData(data: ContactPageData, token: string) {
  const res = await authenticatedFetch(`${API_BASE}/contact-page/`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update contact page data");
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
  const res = await authenticatedFetch(`${API_BASE}/policies/`, {
    method: "POST",
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create policy");
  return res.json();
}

export async function updatePolicy(id: string, data: Policy, token: string) {
  const res = await authenticatedFetch(`${API_BASE}/policies/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update policy");
  return res.json();
}

export async function deletePolicy(id: string, token: string) {
  const res = await authenticatedFetch(`${API_BASE}/policies/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete policy");
  return res.json();
}
