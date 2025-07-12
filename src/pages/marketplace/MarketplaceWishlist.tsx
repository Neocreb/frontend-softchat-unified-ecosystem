import React from "react";
import EnhancedWishlist from "@/components/marketplace/EnhancedWishlist";

export default function MarketplaceWishlist() {
  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
        <p className="text-gray-600 mt-2">
          Keep track of items you love and get notified about price drops.
        </p>
      </div>

      <EnhancedWishlist />
    </div>
  );
}
