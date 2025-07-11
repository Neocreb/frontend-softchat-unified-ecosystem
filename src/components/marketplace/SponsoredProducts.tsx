import { useNavigate } from "react-router-dom";
import ProductCard from "./ProductCard";
import { useMarketplace } from "@/contexts/MarketplaceContext";
import { useAuth } from "@/contexts/AuthContext";

interface SponsoredProductsProps {
  onAddToCart: (productId: string) => void;
  onAddToWishlist: (productId: string) => void;
  location?: "homepage" | "sidebar" | "productDetail";
  limit?: number;
}

const SponsoredProducts = ({
  onAddToCart,
  onAddToWishlist,
  location = "homepage",
  limit = 4,
}: SponsoredProductsProps) => {
  const { sponsoredProducts, setActiveProduct } = useMarketplace();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Take a random subset if we have more than the limit
  const displayProducts =
    sponsoredProducts.length > limit
      ? sponsoredProducts
          .slice()
          .sort(() => 0.5 - Math.random())
          .slice(0, limit)
      : sponsoredProducts;

  const handleViewProduct = (product: any) => {
    setActiveProduct(product);
    // TODO: Navigate to product detail page once created
    // navigate(`/marketplace/product/${product.id}`);
  };

  const handleMessageSeller = (sellerId: string, productId: string) => {
    if (!isAuthenticated) {
      navigate("/auth");
      return;
    }

    navigate("/app/chat");
  };

  if (displayProducts.length === 0) {
    return null;
  }

  if (location === "sidebar") {
    return (
      <div className="bg-amber-50 p-4 rounded-lg space-y-4">
        <h3 className="text-sm font-medium text-amber-900">
          Sponsored Products
        </h3>
        <div className="space-y-3">
          {displayProducts.slice(0, 2).map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-md overflow-hidden shadow-sm"
            >
              <ProductCard
                product={product}
                onAddToCart={onAddToCart}
                onAddToWishlist={onAddToWishlist}
                onViewProduct={handleViewProduct}
                onMessageSeller={handleMessageSeller}
                showSellerInfo={false}
                sponsored={true}
              />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (location === "productDetail") {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Sponsored Products</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {displayProducts.slice(0, 4).map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={onAddToCart}
              onAddToWishlist={onAddToWishlist}
              onViewProduct={handleViewProduct}
              onMessageSeller={handleMessageSeller}
              showSellerInfo={false}
              sponsored={true}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold">Sponsored Products</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {displayProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={onAddToCart}
            onAddToWishlist={onAddToWishlist}
            onViewProduct={handleViewProduct}
            onMessageSeller={handleMessageSeller}
            showSellerInfo={true}
            sponsored={true}
          />
        ))}
      </div>
    </section>
  );
};

export default SponsoredProducts;
