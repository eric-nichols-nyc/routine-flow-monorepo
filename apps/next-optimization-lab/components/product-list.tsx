import type { Product } from "@/lib/types";
import { Star, Package, PackageX } from "lucide-react";

interface ProductListProps {
  products: Product[];
  variant?: "grid" | "list";
}

/**
 * ProductList - Displays products in grid or list format
 *
 * This is a Server Component by default.
 * It receives data as props, making it easy to test different
 * fetching strategies in parent components.
 */
export function ProductList({ products, variant = "grid" }: ProductListProps) {
  if (products.length === 0) {
    return (
      <div className="text-center py-12 text-zinc-500">
        <Package className="w-12 h-12 mx-auto mb-3 opacity-50" />
        <p>No products found</p>
      </div>
    );
  }

  if (variant === "list") {
    return (
      <div className="space-y-3">
        {products.map((product) => (
          <ProductListItem key={product.id} product={product} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

function ProductCard({ product }: { product: Product }) {
  return (
    <div className="p-5 rounded-2xl bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700 transition-colors">
      {/* Product Image Placeholder */}
      <div className="aspect-square rounded-xl bg-zinc-800 mb-4 flex items-center justify-center">
        <Package className="w-12 h-12 text-zinc-600" />
      </div>

      {/* Product Info */}
      <div className="space-y-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-zinc-100 leading-tight">
            {product.name}
          </h3>
          <StockBadge inStock={product.inStock} />
        </div>

        <p className="text-sm text-zinc-500 line-clamp-2">
          {product.description}
        </p>

        <div className="flex items-center justify-between pt-2">
          <span className="text-lg font-bold text-zinc-100">
            ${product.price.toFixed(2)}
          </span>
          <RatingBadge
            rating={product.rating}
            reviewCount={product.reviewCount}
          />
        </div>
      </div>
    </div>
  );
}

function ProductListItem({ product }: { product: Product }) {
  return (
    <div className="flex items-center gap-4 p-4 rounded-xl bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700 transition-colors">
      {/* Thumbnail */}
      <div className="w-16 h-16 rounded-lg bg-zinc-800 flex items-center justify-center flex-shrink-0">
        <Package className="w-6 h-6 text-zinc-600" />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="font-medium text-zinc-100 truncate">{product.name}</h3>
          <StockBadge inStock={product.inStock} />
        </div>
        <p className="text-sm text-zinc-500 truncate">{product.description}</p>
      </div>

      {/* Price & Rating */}
      <div className="text-right flex-shrink-0">
        <p className="font-bold text-zinc-100">${product.price.toFixed(2)}</p>
        <RatingBadge
          rating={product.rating}
          reviewCount={product.reviewCount}
        />
      </div>
    </div>
  );
}

function StockBadge({ inStock }: { inStock: boolean }) {
  if (inStock) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
        <Package className="w-3 h-3" />
        In Stock
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-red-500/10 text-red-400 border border-red-500/30">
      <PackageX className="w-3 h-3" />
      Out of Stock
    </span>
  );
}

function RatingBadge({
  rating,
  reviewCount,
}: {
  rating: number;
  reviewCount: number;
}) {
  return (
    <div className="flex items-center gap-1 text-sm">
      <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
      <span className="text-zinc-300">{rating}</span>
      <span className="text-zinc-500">({reviewCount})</span>
    </div>
  );
}
