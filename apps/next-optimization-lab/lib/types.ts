/**
 * Core types for the optimization lab
 * Using realistic e-commerce types that work well for demos
 */

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  inStock: boolean;
  rating: number;
  reviewCount: number;
  imageUrl: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user";
  avatar: string;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface FetchMetrics {
  fetchCount: number;
  renderTimeMs: number;
  cacheMode:
    | "no-store"
    | "force-cache"
    | "revalidate"
    | "tags"
    | "cached"
    | "deduped";
  lastUpdated: string;
  notes?: string;
}

export interface LabPageProps {
  title: string;
  description: string;
  concept: string;
  cacheMode: FetchMetrics["cacheMode"];
}
