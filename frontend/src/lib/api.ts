const API_BASE = "http://localhost:8002/api";

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
