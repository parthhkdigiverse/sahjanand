const API_BASE = "http://localhost:8003/api";

export type Product = {
  id: string;
  name: string;
  price: number | "REQUEST";
  category: string;
  metal: string;
  image: string;
  images?: string[];
  weight: string;
  material: string;
  description: string;
  features?: string[];
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
  name: string;
  initial: string;
  rating: number;
  text: string;
};

export type Testimonial = {
  image: string;
  name: string;
  quote: string;
  video_url?: string;
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
