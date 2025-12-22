import "server-only";
import type { Product, User, Review } from "./types";
import { simulateDbLatency } from "./timing";

/**
 * Mock Database
 *
 * This simulates a Postgres-style data layer.
 * In production, this would be Prisma, Drizzle, or raw SQL.
 *
 * Key optimization insight:
 * - Database queries are often the slowest part of SSR
 * - Caching at the fetch layer can eliminate repeated DB hits
 * - Connection pooling and query optimization still matter
 */

// ============================================
// MOCK DATA
// ============================================

const products: Product[] = [
  {
    id: "prod_001",
    name: "Wireless Headphones Pro",
    description:
      "Premium noise-cancelling wireless headphones with 40-hour battery life.",
    price: 299.99,
    category: "Electronics",
    inStock: true,
    rating: 4.8,
    reviewCount: 1247,
    imageUrl: "/images/headphones.jpg",
  },
  {
    id: "prod_002",
    name: "Mechanical Keyboard RGB",
    description:
      "Cherry MX switches with per-key RGB lighting and hot-swap sockets.",
    price: 159.99,
    category: "Electronics",
    inStock: true,
    rating: 4.6,
    reviewCount: 892,
    imageUrl: "/images/keyboard.jpg",
  },
  {
    id: "prod_003",
    name: "Ergonomic Mouse",
    description: "Vertical design for all-day comfort. 16K DPI sensor.",
    price: 79.99,
    category: "Electronics",
    inStock: true,
    rating: 4.4,
    reviewCount: 567,
    imageUrl: "/images/mouse.jpg",
  },
  {
    id: "prod_004",
    name: '4K Monitor 32"',
    description: "IPS panel with 99% sRGB coverage and USB-C connectivity.",
    price: 549.99,
    category: "Electronics",
    inStock: false,
    rating: 4.7,
    reviewCount: 423,
    imageUrl: "/images/monitor.jpg",
  },
  {
    id: "prod_005",
    name: "Standing Desk Mat",
    description:
      "Anti-fatigue mat with massage points for standing desk users.",
    price: 89.99,
    category: "Office",
    inStock: true,
    rating: 4.3,
    reviewCount: 234,
    imageUrl: "/images/deskmat.jpg",
  },
  {
    id: "prod_006",
    name: "USB-C Hub 10-in-1",
    description: "HDMI, USB-A, SD card, ethernet, and PD charging in one hub.",
    price: 69.99,
    category: "Electronics",
    inStock: true,
    rating: 4.5,
    reviewCount: 1089,
    imageUrl: "/images/hub.jpg",
  },
];

const users: User[] = [
  {
    id: "user_001",
    name: "Alice Johnson",
    email: "alice@example.com",
    role: "admin",
    avatar: "/avatars/alice.jpg",
  },
  {
    id: "user_002",
    name: "Bob Smith",
    email: "bob@example.com",
    role: "user",
    avatar: "/avatars/bob.jpg",
  },
  {
    id: "user_003",
    name: "Carol White",
    email: "carol@example.com",
    role: "user",
    avatar: "/avatars/carol.jpg",
  },
];

const reviews: Review[] = [
  {
    id: "rev_001",
    productId: "prod_001",
    userId: "user_001",
    userName: "Alice Johnson",
    rating: 5,
    comment: "Best headphones I've ever owned!",
    createdAt: "2024-01-15T10:30:00Z",
  },
  {
    id: "rev_002",
    productId: "prod_001",
    userId: "user_002",
    userName: "Bob Smith",
    rating: 4,
    comment: "Great sound quality, slightly tight fit.",
    createdAt: "2024-01-14T14:22:00Z",
  },
  {
    id: "rev_003",
    productId: "prod_002",
    userId: "user_003",
    userName: "Carol White",
    rating: 5,
    comment: "The switches feel amazing. RGB is stunning.",
    createdAt: "2024-01-13T09:15:00Z",
  },
];

// ============================================
// DATABASE QUERIES (with simulated latency)
// ============================================

/**
 * Fetch all products
 * Default delay: 500ms to simulate realistic DB latency
 */
export async function getAllProducts(
  delayMs: number = 500,
): Promise<Product[]> {
  await simulateDbLatency(delayMs);
  return [...products];
}

/**
 * Fetch a single product by ID
 */
export async function getProductById(
  id: string,
  delayMs: number = 300,
): Promise<Product | null> {
  await simulateDbLatency(delayMs);
  return products.find((p) => p.id === id) || null;
}

/**
 * Fetch products by category
 */
export async function getProductsByCategory(
  category: string,
  delayMs: number = 400,
): Promise<Product[]> {
  await simulateDbLatency(delayMs);
  return products.filter((p) => p.category === category);
}

/**
 * Fetch featured products (top rated)
 */
export async function getFeaturedProducts(
  limit: number = 3,
  delayMs: number = 300,
): Promise<Product[]> {
  await simulateDbLatency(delayMs);
  return [...products].sort((a, b) => b.rating - a.rating).slice(0, limit);
}

/**
 * Get all users
 */
export async function getAllUsers(delayMs: number = 200): Promise<User[]> {
  await simulateDbLatency(delayMs);
  return [...users];
}

/**
 * Get user by ID
 */
export async function getUserById(
  id: string,
  delayMs: number = 150,
): Promise<User | null> {
  await simulateDbLatency(delayMs);
  return users.find((u) => u.id === id) || null;
}

/**
 * Get reviews for a product
 */
export async function getReviewsForProduct(
  productId: string,
  delayMs: number = 400,
): Promise<Review[]> {
  await simulateDbLatency(delayMs);
  return reviews.filter((r) => r.productId === productId);
}

/**
 * Add a new product (for mutation demos)
 */
export async function addProduct(
  product: Omit<Product, "id">,
): Promise<Product> {
  await simulateDbLatency(200);
  const newProduct: Product = {
    ...product,
    id: `prod_${String(products.length + 1).padStart(3, "0")}`,
  };
  products.push(newProduct);
  return newProduct;
}

/**
 * Update product stock status (for mutation demos)
 */
export async function updateProductStock(
  id: string,
  inStock: boolean,
): Promise<Product | null> {
  await simulateDbLatency(150);
  const product = products.find((p) => p.id === id);
  if (product) {
    product.inStock = inStock;
    return product;
  }
  return null;
}
