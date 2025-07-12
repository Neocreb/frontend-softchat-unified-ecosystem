import React from "react";
import { MarketplaceHomepage } from "./marketplace/MarketplaceHomepage";
import EnhancedCheckoutFlow from "@/components/marketplace/EnhancedCheckoutFlow";
import OrderManagement from "@/components/marketplace/OrderManagement";
import SellerDashboard from "@/components/marketplace/SellerDashboard";
import ListProductForm from "@/components/marketplace/ListProductForm";
import { Category, Product } from "@/types/marketplace";
import { cn } from "@/lib/utils";

export default function EnhancedMarketplace() {
  const { isAuthenticated, user } = useAuth();
  const { toast } = useToast();
  const {
    products,
    categories,
    cart,
    wishlist,
    orders,
    addresses,
    paymentMethods,
    searchResults,
    isLoading,
    cartTotal,
    cartItemsCount,
    searchProducts,
    addToCart,
    addToWishlist,
    removeFromWishlist,
    createOrder,
    addAddress,
    addPaymentMethod,
    calculateShipping,
    applyPromotion,
    isInCart,
    isInWishlist,
  } = useMarketplace();

  const [activeTab, setActiveTab] = useState("browse");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [sortBy, setSortBy] = useState("relevance");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showProductModal, setShowProductModal] = useState(false);

  // Initialize with featured/trending products
  useEffect(() => {
    searchProducts("", { sortBy: "popular" });
  }, []);

  // Handle tab change with authentication check
  const handleTabChange = (tab: string) => {
    if (
      !isAuthenticated &&
      ["cart", "orders", "wishlist", "sell", "dashboard"].includes(tab)
    ) {
      toast({
        title: "Authentication required",
        description: "Please sign in to access this feature",
        variant: "destructive",
      });
      return;
    }
    setActiveTab(tab);
  };

  // Handle search
  const handleSearch = async () => {
    const filters = {
      category: selectedCategory === "all" ? undefined : selectedCategory,
      minPrice: priceRange.min ? parseFloat(priceRange.min) : undefined,
      maxPrice: priceRange.max ? parseFloat(priceRange.max) : undefined,
      sortBy: sortBy as any,
    };

    await searchProducts(searchQuery, filters);
  };

  // Handle product actions
  const handleAddToCart = (productId: string) => {
    addToCart(productId);
  };

  const handleAddToWishlist = (productId: string) => {
    if (isInWishlist(productId)) {
      removeFromWishlist(productId);
    } else {
      addToWishlist(productId);
    }
  };

  const handleViewProduct = (productId: string) => {
    const product = products.find((p) => p.id === productId);
    if (product) {
      setSelectedProduct(product);
      setShowProductModal(true);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  const getMarketplaceStats = () => {
    return {
      totalProducts: products.length,
      totalCategories: categories.length,
      totalSellers: new Set(products.map((p) => p.sellerId)).size,
      averageRating:
        products.reduce((sum, p) => sum + p.rating, 0) / products.length || 0,
    };
  };

  const stats = getMarketplaceStats();

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Marketplace</h1>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">
            Discover amazing products from trusted sellers worldwide
          </p>
        </div>

        {/* Quick Stats */}
        <div className="flex flex-wrap items-center gap-3 sm:gap-4 lg:gap-6 text-xs sm:text-sm text-gray-600">
          <div className="flex items-center gap-1 sm:gap-2">
            <Package className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
            <span className="whitespace-nowrap">
              {stats.totalProducts.toLocaleString()} products
            </span>
          </div>
          <div className="flex items-center gap-1 sm:gap-2">
            <Users className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
            <span className="whitespace-nowrap">
              {stats.totalSellers} sellers
            </span>
          </div>
          <div className="flex items-center gap-1 sm:gap-2">
            <Star className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-500 flex-shrink-0" />
            <span className="whitespace-nowrap">
              {stats.averageRating.toFixed(1)} avg rating
            </span>
          </div>
        </div>
      </div>

      {/* Cart Summary (when items in cart) */}
      {cartItemsCount > 0 && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ShoppingCart className="h-5 w-5 text-blue-600" />
                <div>
                  <span className="font-medium text-blue-900">
                    {cartItemsCount} item{cartItemsCount > 1 ? "s" : ""} in cart
                  </span>
                  <div className="text-sm text-blue-700">
                    Total: {formatPrice(cartTotal)}
                  </div>
                </div>
              </div>
              <Button
                onClick={() => setShowCheckout(true)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Checkout
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
        className="w-full"
      >
        <div className="overflow-x-auto pb-2">
          <TabsList className="min-w-max">
            <TabsTrigger value="browse">Browse</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="featured">Featured</TabsTrigger>
            {isAuthenticated && (
              <>
                <TabsTrigger value="cart" className="relative">
                  Cart
                  {cartItemsCount > 0 && (
                    <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs min-w-[20px] h-5 rounded-full flex items-center justify-center">
                      {cartItemsCount}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="wishlist">
                  Wishlist
                  {wishlist.length > 0 && (
                    <Badge variant="secondary" className="ml-2">
                      {wishlist.length}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="orders">Orders</TabsTrigger>
                <TabsTrigger value="sell">Sell</TabsTrigger>
                <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              </>
            )}
          </TabsList>
        </div>

        {/* Browse Products Tab */}
        <TabsContent value="browse" className="space-y-6">
          {/* Search and Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search products, brands, categories..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                    className="pl-10 h-12"
                  />
                </div>
                <div className="flex gap-2">
                  <Select
                    value={selectedCategory}
                    onValueChange={setSelectedCategory}
                  >
                    <SelectTrigger className="w-32 sm:w-40 lg:w-44">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-32 sm:w-40 lg:w-44">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="relevance">Relevance</SelectItem>
                      <SelectItem value="price-low">
                        Price: Low to High
                      </SelectItem>
                      <SelectItem value="price-high">
                        Price: High to Low
                      </SelectItem>
                      <SelectItem value="rating">Customer Rating</SelectItem>
                      <SelectItem value="popular">Most Popular</SelectItem>
                      <SelectItem value="recent">Newest</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    variant="outline"
                    onClick={() => setShowFilters(!showFilters)}
                  >
                    <SlidersHorizontal className="h-4 w-4 mr-2" />
                    Filters
                  </Button>
                  <div className="flex border rounded-lg">
                    <Button
                      variant={viewMode === "grid" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setViewMode("grid")}
                    >
                      <Grid className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={viewMode === "list" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setViewMode("list")}
                    >
                      <List className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button onClick={handleSearch}>Search</Button>
                </div>
              </div>

              {/* Advanced Filters */}
              {showFilters && (
                <div className="mt-4 pt-4 border-t">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Price Range
                      </label>
                      <div className="flex gap-2">
                        <Input
                          placeholder="Min"
                          type="number"
                          value={priceRange.min}
                          onChange={(e) =>
                            setPriceRange((prev) => ({
                              ...prev,
                              min: e.target.value,
                            }))
                          }
                        />
                        <Input
                          placeholder="Max"
                          type="number"
                          value={priceRange.max}
                          onChange={(e) =>
                            setPriceRange((prev) => ({
                              ...prev,
                              max: e.target.value,
                            }))
                          }
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Features
                      </label>
                      <div className="space-y-2">
                        <label className="flex items-center space-x-2">
                          <input type="checkbox" className="rounded" />
                          <span className="text-sm">Free Shipping</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input type="checkbox" className="rounded" />
                          <span className="text-sm">Express Delivery</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input type="checkbox" className="rounded" />
                          <span className="text-sm">New Items Only</span>
                        </label>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Rating
                      </label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Any rating" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="4">4+ Stars</SelectItem>
                          <SelectItem value="3">3+ Stars</SelectItem>
                          <SelectItem value="2">2+ Stars</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Trust Indicators */}
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
            <CardContent className="p-3 sm:p-4">
              <div className="grid grid-cols-2 sm:flex sm:items-center sm:justify-center gap-3 sm:gap-6 lg:gap-8 text-xs sm:text-sm text-blue-800">
                <div className="flex items-center gap-1 sm:gap-2 justify-center">
                  <Shield className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                  <span className="font-medium whitespace-nowrap">
                    Buyer Protection
                  </span>
                </div>
                <div className="flex items-center gap-1 sm:gap-2 justify-center">
                  <Truck className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                  <span className="font-medium whitespace-nowrap">
                    Fast Shipping
                  </span>
                </div>
                <div className="flex items-center gap-1 sm:gap-2 justify-center">
                  <CreditCard className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                  <span className="font-medium whitespace-nowrap">
                    Secure Payment
                  </span>
                </div>
                <div className="flex items-center gap-1 sm:gap-2 justify-center">
                  <Award className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                  <span className="font-medium whitespace-nowrap">
                    Verified Reviews
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* AI Product Recommendations */}
          <SmartContentRecommendations
            contentType="products"
            availableContent={products}
            onContentSelect={(product) => {
              handleViewProduct(product.id);
            }}
            maxItems={4}
            className="mb-6"
            layout="grid"
            showReasons={true}
          />

          {/* Products Grid/List */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array(8)
                .fill(0)
                .map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <div className="h-48 bg-gray-200 rounded-t-lg"></div>
                    <CardContent className="p-4 space-y-2">
                      <div className="h-4 bg-gray-200 rounded"></div>
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          ) : products.length > 0 ? (
            <div
              className={cn(
                viewMode === "grid"
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                  : "space-y-4",
              )}
            >
              {products.map((product) => (
                <EnhancedProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={handleAddToCart}
                  onAddToWishlist={handleAddToWishlist}
                  onViewProduct={handleViewProduct}
                  inWishlist={isInWishlist(product.id)}
                  inCart={isInCart(product.id)}
                  view={viewMode}
                />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  No products found
                </h3>
                <p className="text-gray-600">
                  Try adjusting your search terms or filters to find what you're
                  looking for.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Categories Tab */}
        <TabsContent value="categories" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <Card
                key={category.id}
                className="hover:shadow-lg transition-shadow cursor-pointer group"
              >
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    {category.image && (
                      <img
                        src={category.image}
                        alt={category.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                    )}
                    <div>
                      <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                        {category.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {category.productCount.toLocaleString()} products
                      </p>
                    </div>
                  </div>

                  {category.subcategories &&
                    category.subcategories.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-700">
                          Popular subcategories:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {category.subcategories.slice(0, 4).map((sub) => (
                            <Badge
                              key={sub.id}
                              variant="secondary"
                              className="text-xs"
                            >
                              {sub.name}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Featured Tab */}
        <TabsContent value="featured" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Featured categories, trending products, etc. */}
            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Trending Now
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {products
                    .filter((p) => p.isFeatured)
                    .slice(0, 4)
                    .map((product) => (
                      <EnhancedProductCard
                        key={product.id}
                        product={product}
                        onAddToCart={handleAddToCart}
                        onAddToWishlist={handleAddToWishlist}
                        onViewProduct={handleViewProduct}
                        inWishlist={isInWishlist(product.id)}
                        inCart={isInCart(product.id)}
                        showSellerInfo={false}
                      />
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Cart Tab */}
        <TabsContent value="cart" className="space-y-6">
          {cart.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  Your cart is empty
                </h3>
                <p className="text-gray-600 mb-4">
                  Add some products to get started!
                </p>
                <Button onClick={() => setActiveTab("browse")}>
                  Continue Shopping
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-4">
                {cart.map((item) => (
                  <Card
                    key={`${item.productId}-${JSON.stringify(item.selectedVariants)}`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-20 h-20 object-cover rounded"
                        />
                        <div className="flex-1">
                          <h3 className="font-medium">{item.product.name}</h3>
                          <p className="text-sm text-gray-600">
                            {item.product.sellerName}
                          </p>
                          {item.selectedVariants && (
                            <div className="text-sm text-gray-600">
                              {Object.entries(item.selectedVariants).map(
                                ([key, value]) => (
                                  <span key={key} className="mr-2">
                                    {key}: {value}
                                  </span>
                                ),
                              )}
                            </div>
                          )}
                          <div className="flex items-center gap-2 mt-2">
                            <Button variant="outline" size="sm">
                              -
                            </Button>
                            <span className="w-8 text-center">
                              {item.quantity}
                            </span>
                            <Button variant="outline" size="sm">
                              +
                            </Button>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">
                            {formatPrice(
                              (item.product.discountPrice ||
                                item.product.price) * item.quantity,
                            )}
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600"
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Card className="h-fit">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>{formatPrice(cartTotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping</span>
                      <span>Calculated at checkout</span>
                    </div>
                    <div className="border-t pt-2">
                      <div className="flex justify-between text-lg font-bold">
                        <span>Total</span>
                        <span>{formatPrice(cartTotal)}</span>
                      </div>
                    </div>
                  </div>
                  <Button
                    className="w-full"
                    size="lg"
                    onClick={() => setShowCheckout(true)}
                  >
                    Proceed to Checkout
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        {/* Wishlist Tab */}
        <TabsContent value="wishlist" className="space-y-6">
          {wishlist.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  Your wishlist is empty
                </h3>
                <p className="text-gray-600 mb-4">
                  Save items you love for later!
                </p>
                <Button onClick={() => setActiveTab("browse")}>
                  Start Shopping
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {wishlist.map((item) => (
                <EnhancedProductCard
                  key={item.productId}
                  product={item.product}
                  onAddToCart={handleAddToCart}
                  onAddToWishlist={handleAddToWishlist}
                  onViewProduct={handleViewProduct}
                  inWishlist={true}
                  inCart={isInCart(item.productId)}
                />
              ))}
            </div>
          )}
        </TabsContent>

        {/* Orders Tab */}
        <TabsContent value="orders" className="space-y-6">
          <OrderManagement
            orders={orders}
            userType="buyer"
            onAddReview={async (productId, rating, content) => {
              // Mock implementation
              toast({
                title: "Review added",
                description: "Thank you for your feedback!",
              });
              return {} as any;
            }}
          />
        </TabsContent>

        {/* Sell Tab */}
        <TabsContent value="sell" className="space-y-6">
          <ListProductForm
            onSuccess={() => {
              toast({
                title: "Product listed",
                description: "Your product has been successfully listed!",
              });
              setActiveTab("dashboard");
            }}
          />
        </TabsContent>

        {/* Dashboard Tab */}
        <TabsContent value="dashboard" className="space-y-6">
          <SellerDashboard />
        </TabsContent>
      </Tabs>

      {/* Checkout Modal */}
      {showCheckout && (
        <EnhancedCheckoutFlow
          cartItems={cart}
          addresses={addresses}
          paymentMethods={paymentMethods}
          onCreateOrder={createOrder}
          onAddAddress={addAddress}
          onAddPaymentMethod={addPaymentMethod}
          onApplyPromoCode={applyPromotion}
          onCalculateShipping={calculateShipping}
          onClose={() => setShowCheckout(false)}
        />
      )}

      {/* Product Modal */}
      <Dialog open={showProductModal} onOpenChange={setShowProductModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedProduct?.name}</DialogTitle>
            <DialogDescription>
              Product details and information
            </DialogDescription>
          </DialogHeader>

          {selectedProduct && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  className="w-full h-64 object-cover rounded-lg"
                />
                {selectedProduct.images &&
                  selectedProduct.images.length > 1 && (
                    <div className="flex gap-2 mt-2">
                      {selectedProduct.images.slice(0, 4).map((img, index) => (
                        <img
                          key={index}
                          src={img}
                          alt={`${selectedProduct.name} ${index + 1}`}
                          className="w-16 h-16 object-cover rounded cursor-pointer hover:opacity-80"
                        />
                      ))}
                    </div>
                  )}
              </div>

              <div className="space-y-4">
                <div>
                  <h2 className="text-2xl font-bold">{selectedProduct.name}</h2>
                  <p className="text-gray-600 mt-2">
                    {selectedProduct.description}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-3xl font-bold text-primary">
                    {formatPrice(
                      selectedProduct.discountPrice || selectedProduct.price,
                    )}
                  </span>
                  {selectedProduct.discountPrice && (
                    <span className="text-xl text-gray-500 line-through">
                      {formatPrice(selectedProduct.price)}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center">
                    {Array.from({ length: 5 }, (_, i) => (
                      <Star
                        key={i}
                        className={cn(
                          "h-4 w-4",
                          i < Math.floor(selectedProduct.rating)
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300",
                        )}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">
                    {selectedProduct.rating} ({selectedProduct.reviewCount || 0}{" "}
                    reviews)
                  </span>
                </div>

                {selectedProduct.specifications &&
                  selectedProduct.specifications.length > 0 && (
                    <div>
                      <h3 className="font-semibold mb-2">Specifications</h3>
                      <div className="space-y-1">
                        {selectedProduct.specifications.map((spec, index) => (
                          <div
                            key={index}
                            className="flex justify-between text-sm"
                          >
                            <span className="text-gray-600">{spec.name}:</span>
                            <span className="font-medium">{spec.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                <div className="flex gap-2">
                  <Button
                    className="flex-1"
                    onClick={() => handleAddToCart(selectedProduct.id)}
                    disabled={!selectedProduct.inStock}
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Add to Cart
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleAddToWishlist(selectedProduct.id)}
                  >
                    <Heart
                      className={cn(
                        "h-4 w-4",
                        isInWishlist(selectedProduct.id)
                          ? "fill-red-500 text-red-500"
                          : "",
                      )}
                    />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
