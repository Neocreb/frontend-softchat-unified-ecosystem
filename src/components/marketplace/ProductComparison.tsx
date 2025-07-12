import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Scale,
  Star,
  DollarSign,
  Truck,
  Shield,
  Award,
  TrendingUp,
  X,
  Plus,
  Check,
  AlertCircle,
  Heart,
  ShoppingCart,
  Eye,
  BarChart3,
  Filter,
  ArrowRight,
  ArrowUpDown,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react";
import { Product } from "@/types/marketplace";
import { useMarketplace } from "@/contexts/MarketplaceContext";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

interface ComparisonData {
  products: Product[];
  criteria: ComparisonCriterion[];
  userPreferences?: {
    priceWeight: number;
    ratingWeight: number;
    reviewWeight: number;
    shippingWeight: number;
  };
}

interface ComparisonCriterion {
  id: string;
  label: string;
  type: "price" | "rating" | "boolean" | "text" | "number";
  weight: number;
  getValue: (product: Product) => any;
  format?: (value: any) => string;
  isHigherBetter?: boolean;
}

interface ProductComparisonProps {
  initialProducts?: Product[];
  maxProducts?: number;
  showAddButton?: boolean;
  onAddToCart?: (productId: string) => void;
  onAddToWishlist?: (productId: string) => void;
}

const ProductComparison = ({
  initialProducts = [],
  maxProducts = 4,
  showAddButton = true,
  onAddToCart,
  onAddToWishlist,
}: ProductComparisonProps) => {
  const [comparisonProducts, setComparisonProducts] =
    useState<Product[]>(initialProducts);
  const [isSelectDialogOpen, setIsSelectDialogOpen] = useState(false);
  const [selectedCriteria, setSelectedCriteria] = useState<string[]>([
    "price",
    "rating",
    "reviews",
    "shipping",
    "warranty",
  ]);
  const [sortBy, setSortBy] = useState<string>("overall");

  const { products } = useMarketplace();
  const { toast } = useToast();

  // Comparison criteria configuration
  const allCriteria: ComparisonCriterion[] = [
    {
      id: "price",
      label: "Price",
      type: "price",
      weight: 0.3,
      getValue: (product) => product.discountPrice || product.price,
      format: (value) => `$${value.toFixed(2)}`,
      isHigherBetter: false,
    },
    {
      id: "rating",
      label: "Rating",
      type: "rating",
      weight: 0.25,
      getValue: (product) => product.rating,
      format: (value) => `${value.toFixed(1)} ★`,
      isHigherBetter: true,
    },
    {
      id: "reviews",
      label: "Review Count",
      type: "number",
      weight: 0.15,
      getValue: (product) => product.reviewCount || 0,
      format: (value) => `${value} reviews`,
      isHigherBetter: true,
    },
    {
      id: "shipping",
      label: "Free Shipping",
      type: "boolean",
      weight: 0.1,
      getValue: (product) => product.shippingInfo?.freeShipping || false,
      format: (value) => (value ? "Yes" : "No"),
      isHigherBetter: true,
    },
    {
      id: "warranty",
      label: "Warranty",
      type: "text",
      weight: 0.05,
      getValue: (product) => product.warranty || "N/A",
      format: (value) => value,
    },
    {
      id: "brand",
      label: "Brand",
      type: "text",
      weight: 0.05,
      getValue: (product) => product.brand || "Unknown",
      format: (value) => value,
    },
    {
      id: "condition",
      label: "Condition",
      type: "text",
      weight: 0.05,
      getValue: (product) => product.condition || "new",
      format: (value) => value.charAt(0).toUpperCase() + value.slice(1),
    },
    {
      id: "stock",
      label: "In Stock",
      type: "boolean",
      weight: 0.05,
      getValue: (product) => product.inStock,
      format: (value) => (value ? "Yes" : "No"),
      isHigherBetter: true,
    },
  ];

  const activeCriteria = allCriteria.filter((criterion) =>
    selectedCriteria.includes(criterion.id),
  );

  // Calculate overall scores for each product
  const calculateOverallScore = (product: Product) => {
    let totalScore = 0;
    let totalWeight = 0;

    activeCriteria.forEach((criterion) => {
      const value = criterion.getValue(product);
      let normalizedScore = 0;

      switch (criterion.type) {
        case "price":
          // For price, lower is better - normalize against the highest price
          const prices = comparisonProducts.map((p) => criterion.getValue(p));
          const maxPrice = Math.max(...prices);
          const minPrice = Math.min(...prices);
          normalizedScore =
            maxPrice > minPrice
              ? (maxPrice - value) / (maxPrice - minPrice)
              : 1;
          break;
        case "rating":
          normalizedScore = value / 5; // Assuming 5-star rating system
          break;
        case "number":
          const numbers = comparisonProducts.map((p) => criterion.getValue(p));
          const maxNumber = Math.max(...numbers);
          normalizedScore = maxNumber > 0 ? value / maxNumber : 0;
          break;
        case "boolean":
          normalizedScore = value ? 1 : 0;
          break;
        default:
          normalizedScore = 0.5; // Neutral score for text fields
      }

      totalScore += normalizedScore * criterion.weight;
      totalWeight += criterion.weight;
    });

    return totalWeight > 0 ? (totalScore / totalWeight) * 100 : 0;
  };

  // Sort products based on selected criteria
  const sortedProducts = useMemo(() => {
    const productsWithScores = comparisonProducts.map((product) => ({
      ...product,
      overallScore: calculateOverallScore(product),
    }));

    switch (sortBy) {
      case "overall":
        return productsWithScores.sort(
          (a, b) => b.overallScore - a.overallScore,
        );
      case "price_low":
        return productsWithScores.sort(
          (a, b) => (a.discountPrice || a.price) - (b.discountPrice || b.price),
        );
      case "price_high":
        return productsWithScores.sort(
          (a, b) => (b.discountPrice || b.price) - (a.discountPrice || a.price),
        );
      case "rating":
        return productsWithScores.sort((a, b) => b.rating - a.rating);
      case "reviews":
        return productsWithScores.sort(
          (a, b) => (b.reviewCount || 0) - (a.reviewCount || 0),
        );
      default:
        return productsWithScores;
    }
  }, [comparisonProducts, selectedCriteria, sortBy]);

  const addProduct = (product: Product) => {
    if (comparisonProducts.length >= maxProducts) {
      toast({
        title: "Maximum products reached",
        description: `You can compare up to ${maxProducts} products at once`,
        variant: "destructive",
      });
      return;
    }

    if (comparisonProducts.find((p) => p.id === product.id)) {
      toast({
        title: "Product already added",
        description: "This product is already in your comparison",
        variant: "destructive",
      });
      return;
    }

    setComparisonProducts((prev) => [...prev, product]);
    setIsSelectDialogOpen(false);

    toast({
      title: "Product added",
      description: `${product.name} added to comparison`,
    });
  };

  const removeProduct = (productId: string) => {
    setComparisonProducts((prev) => prev.filter((p) => p.id !== productId));

    toast({
      title: "Product removed",
      description: "Product removed from comparison",
    });
  };

  const toggleCriterion = (criterionId: string) => {
    setSelectedCriteria((prev) =>
      prev.includes(criterionId)
        ? prev.filter((id) => id !== criterionId)
        : [...prev, criterionId],
    );
  };

  const getBestValue = (criterion: ComparisonCriterion) => {
    const values = comparisonProducts.map((product) =>
      criterion.getValue(product),
    );

    switch (criterion.type) {
      case "price":
        return Math.min(...values);
      case "rating":
      case "number":
        return Math.max(...values);
      case "boolean":
        return true;
      default:
        return null;
    }
  };

  const isValueBest = (product: Product, criterion: ComparisonCriterion) => {
    const value = criterion.getValue(product);
    const bestValue = getBestValue(criterion);
    return value === bestValue;
  };

  const renderValueCell = (
    product: Product,
    criterion: ComparisonCriterion,
  ) => {
    const value = criterion.getValue(product);
    const isBest = isValueBest(product, criterion);
    const formattedValue = criterion.format ? criterion.format(value) : value;

    return (
      <div
        className={cn(
          "flex items-center justify-center p-3 text-sm",
          isBest &&
            "bg-green-50 border border-green-200 rounded font-medium text-green-800",
        )}
      >
        {isBest && <Award className="w-4 h-4 mr-1 text-green-600" />}
        {formattedValue}
      </div>
    );
  };

  const renderProductCard = (product: Product & { overallScore: number }) => (
    <div key={product.id} className="space-y-4">
      {/* Product Header */}
      <div className="relative">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-48 object-cover rounded-lg"
        />
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-2 right-2 bg-white/80 hover:bg-white"
          onClick={() => removeProduct(product.id)}
        >
          <X className="w-4 h-4" />
        </Button>

        {/* Overall Score Badge */}
        <Badge
          className={cn(
            "absolute top-2 left-2",
            product.overallScore >= 80
              ? "bg-green-600"
              : product.overallScore >= 60
                ? "bg-yellow-600"
                : "bg-gray-600",
          )}
        >
          {product.overallScore.toFixed(0)}% Match
        </Badge>
      </div>

      {/* Product Info */}
      <div className="space-y-2">
        <h3 className="font-semibold text-sm line-clamp-2">{product.name}</h3>
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }, (_, i) => (
            <Star
              key={i}
              className={cn(
                "w-3 h-3",
                i < Math.floor(product.rating)
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-gray-300",
              )}
            />
          ))}
          <span className="text-xs text-muted-foreground ml-1">
            ({product.reviewCount || 0})
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-semibold text-lg">
            ${(product.discountPrice || product.price).toFixed(2)}
          </span>
          {product.discountPrice && (
            <span className="text-sm text-muted-foreground line-through">
              ${product.price.toFixed(2)}
            </span>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-2">
        <Button className="w-full" onClick={() => onAddToCart?.(product.id)}>
          <ShoppingCart className="w-4 h-4 mr-2" />
          Add to Cart
        </Button>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => onAddToWishlist?.(product.id)}
          >
            <Heart className="w-4 h-4 mr-1" />
            Wishlist
          </Button>
          <Button variant="outline" size="sm" className="flex-1">
            <Eye className="w-4 h-4 mr-1" />
            View
          </Button>
        </div>
      </div>
    </div>
  );

  if (comparisonProducts.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Scale className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">No products to compare</h3>
          <p className="text-muted-foreground mb-4">
            Add products to start comparing features, prices, and reviews side
            by side
          </p>
          {showAddButton && (
            <Dialog
              open={isSelectDialogOpen}
              onOpenChange={setIsSelectDialogOpen}
            >
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Products to Compare
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Select Products to Compare</DialogTitle>
                  <DialogDescription>
                    Choose up to {maxProducts} products to compare
                  </DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {products?.slice(0, 8).map((product) => (
                    <Card
                      key={product.id}
                      className="cursor-pointer hover:shadow-md"
                    >
                      <CardContent className="p-4">
                        <div className="flex gap-3">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-16 h-16 object-cover rounded"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-sm line-clamp-2">
                              {product.name}
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              $
                              {(product.discountPrice || product.price).toFixed(
                                2,
                              )}
                            </p>
                            <Button
                              size="sm"
                              className="mt-2 w-full"
                              onClick={() => addProduct(product)}
                            >
                              Add to Compare
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </DialogContent>
            </Dialog>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Scale className="w-6 h-6" />
          <h2 className="text-xl font-semibold">Product Comparison</h2>
          <Badge variant="secondary">
            {comparisonProducts.length}/{maxProducts} products
          </Badge>
        </div>

        <div className="flex items-center gap-2">
          {showAddButton && comparisonProducts.length < maxProducts && (
            <Dialog
              open={isSelectDialogOpen}
              onOpenChange={setIsSelectDialogOpen}
            >
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Product
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Add Product to Comparison</DialogTitle>
                  <DialogDescription>
                    Choose another product to compare
                  </DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {products
                    ?.filter(
                      (p) => !comparisonProducts.find((cp) => cp.id === p.id),
                    )
                    .slice(0, 8)
                    .map((product) => (
                      <Card
                        key={product.id}
                        className="cursor-pointer hover:shadow-md"
                      >
                        <CardContent className="p-4">
                          <div className="flex gap-3">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-16 h-16 object-cover rounded"
                            />
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-sm line-clamp-2">
                                {product.name}
                              </h4>
                              <p className="text-sm text-muted-foreground">
                                $
                                {(
                                  product.discountPrice || product.price
                                ).toFixed(2)}
                              </p>
                              <Button
                                size="sm"
                                className="mt-2 w-full"
                                onClick={() => addProduct(product)}
                              >
                                Add to Compare
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      <Tabs defaultValue="cards" className="w-full">
        <TabsList>
          <TabsTrigger value="cards">Card View</TabsTrigger>
          <TabsTrigger value="table">Table View</TabsTrigger>
          <TabsTrigger value="criteria">Criteria</TabsTrigger>
        </TabsList>

        <TabsContent value="cards" className="space-y-6">
          {/* Sort Options */}
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium">Sort by:</span>
            <div className="flex gap-2">
              {[
                { value: "overall", label: "Best Match" },
                { value: "price_low", label: "Price: Low to High" },
                { value: "price_high", label: "Price: High to Low" },
                { value: "rating", label: "Highest Rated" },
                { value: "reviews", label: "Most Reviews" },
              ].map((option) => (
                <Button
                  key={option.value}
                  variant={sortBy === option.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSortBy(option.value)}
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Product Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedProducts.map(renderProductCard)}
          </div>
        </TabsContent>

        <TabsContent value="table" className="space-y-6">
          {/* Comparison Table */}
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-4 font-medium">Feature</th>
                      {sortedProducts.map((product) => (
                        <th
                          key={product.id}
                          className="text-center p-4 min-w-48"
                        >
                          <div className="space-y-2">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-20 h-20 object-cover rounded mx-auto"
                            />
                            <h4 className="font-medium text-sm line-clamp-2">
                              {product.name}
                            </h4>
                            <Badge
                              className={cn(
                                product.overallScore >= 80
                                  ? "bg-green-600"
                                  : product.overallScore >= 60
                                    ? "bg-yellow-600"
                                    : "bg-gray-600",
                              )}
                            >
                              {product.overallScore.toFixed(0)}% Match
                            </Badge>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {activeCriteria.map((criterion) => (
                      <tr
                        key={criterion.id}
                        className="border-b hover:bg-muted/50"
                      >
                        <td className="p-4 font-medium">{criterion.label}</td>
                        {sortedProducts.map((product) => (
                          <td key={product.id}>
                            {renderValueCell(product, criterion)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="criteria" className="space-y-6">
          {/* Criteria Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Comparison Criteria</CardTitle>
              <p className="text-sm text-muted-foreground">
                Select which features to compare across products
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {allCriteria.map((criterion) => (
                  <div
                    key={criterion.id}
                    className="flex items-center space-x-2"
                  >
                    <Checkbox
                      id={criterion.id}
                      checked={selectedCriteria.includes(criterion.id)}
                      onCheckedChange={() => toggleCriterion(criterion.id)}
                    />
                    <label
                      htmlFor={criterion.id}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      {criterion.label}
                    </label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Scoring Explanation */}
          <Card>
            <CardHeader>
              <CardTitle>How We Calculate the Best Match</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Our matching algorithm considers multiple factors to help you
                find the best product for your needs:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeCriteria.map((criterion) => (
                  <div
                    key={criterion.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <span className="font-medium">{criterion.label}</span>
                    <Badge variant="outline">
                      {(criterion.weight * 100).toFixed(0)}% weight
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProductComparison;
