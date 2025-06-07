
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Eye,
  Heart,
  MessageCircle,
  Edit,
  Trash2,
  Sparkle,
  Plus
} from "lucide-react";
import { useMarketplace } from "@/contexts/MarketplaceContext";
import { useToast } from "@/components/ui/use-toast";
import { Product, BoostOption } from "@/types/marketplace";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

const SellerDashboard = () => {
  const { 
    myListings, 
    deleteProduct, 
    boostProduct, 
    boostOptions,
    isLoading 
  } = useMarketplace();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showBoostDialog, setShowBoostDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedBoostOption, setSelectedBoostOption] = useState<string | null>(null);
  
  const handleCreateListing = () => {
    navigate('/marketplace');
    // Wait for component to render before changing tab
    setTimeout(() => {
      const listTabElement = document.querySelector('[value="list"]') as HTMLElement;
      if (listTabElement) listTabElement.click();
    }, 0);
  };
  
  const handleEditListing = (productId: string) => {
    navigate(`/marketplace/list?edit=${productId}`);
  };
  
  const handleOpenBoostDialog = (product: Product) => {
    setSelectedProduct(product);
    setShowBoostDialog(true);
  };
  
  const handleOpenDeleteDialog = (product: Product) => {
    setSelectedProduct(product);
    setShowDeleteDialog(true);
  };
  
  const handleBoost = async () => {
    if (!selectedProduct || !selectedBoostOption) return;
    
    try {
      await boostProduct(selectedProduct.id, selectedBoostOption);
      toast({
        title: "Product Boosted",
        description: "Your product will now appear in sponsored sections"
      });
      setShowBoostDialog(false);
      setSelectedBoostOption(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to boost product. Please try again",
        variant: "destructive"
      });
    }
  };
  
  const handleDelete = async () => {
    if (!selectedProduct) return;
    
    try {
      await deleteProduct(selectedProduct.id);
      toast({
        title: "Product Deleted",
        description: "Your product has been removed from the marketplace"
      });
      setShowDeleteDialog(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete product. Please try again",
        variant: "destructive"
      });
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };
  
  const isProductBoosted = (product: Product) => {
    if (!product.isSponsored || !product.boostedUntil) return false;
    
    const boostedUntil = new Date(product.boostedUntil);
    const now = new Date();
    
    return boostedUntil > now;
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Your Products</h2>
        <Button onClick={handleCreateListing} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          <span>List New Product</span>
        </Button>
      </div>
      
      {myListings.length === 0 ? (
        <Card className="bg-gray-50">
          <CardContent className="pt-6 text-center">
            <div className="py-6 space-y-4">
              <div className="mx-auto rounded-full bg-muted h-12 w-12 flex items-center justify-center">
                <Plus className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium">No Products Listed</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                You haven't listed any products yet. Create your first listing to start selling on the marketplace.
              </p>
              <Button onClick={handleCreateListing} className="mt-2">
                List Your First Product
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {myListings.map(product => (
            <Card key={product.id} className="overflow-hidden">
              <div className="relative h-40">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-full object-cover" 
                />
                <div className="absolute top-2 right-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 bg-white/70 backdrop-blur-sm hover:bg-white/90">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-more-horizontal">
                          <circle cx="12" cy="12" r="1" />
                          <circle cx="19" cy="12" r="1" />
                          <circle cx="5" cy="12" r="1" />
                        </svg>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => handleEditListing(product.id)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Listing
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleOpenBoostDialog(product)}>
                        <Sparkle className="h-4 w-4 mr-2" />
                        Boost Visibility
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={() => handleOpenDeleteDialog(product)}
                        className="text-red-500"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Listing
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                {isProductBoosted(product) && (
                  <Badge className="absolute bottom-2 right-2 bg-amber-500">
                    Boosted
                  </Badge>
                )}
              </div>
              
              <CardHeader className="pb-2">
                <div className="flex justify-between">
                  <h3 className="font-medium text-base line-clamp-1">{product.name}</h3>
                  <span className="font-semibold">
                    ${(product.discountPrice || product.price).toFixed(2)}
                  </span>
                </div>
                <p className="text-muted-foreground text-sm">
                  Listed on {formatDate(product.createdAt)}
                </p>
              </CardHeader>
              
              <CardContent className="pb-3">
                <div className="grid grid-cols-3 gap-2 text-center text-sm">
                  <div className="flex flex-col items-center">
                    <Eye className="h-4 w-4 mb-1 text-muted-foreground" />
                    <span>125 Views</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <Heart className="h-4 w-4 mb-1 text-muted-foreground" />
                    <span>14 Saves</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <MessageCircle className="h-4 w-4 mb-1 text-muted-foreground" />
                    <span>3 Inquiries</span>
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="border-t bg-gray-50 p-3 flex justify-between">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleEditListing(product.id)}
                >
                  Edit
                </Button>
                <Button 
                  size="sm"
                  onClick={() => handleOpenBoostDialog(product)}
                  className="flex items-center gap-1"
                  disabled={isProductBoosted(product)}
                >
                  <Sparkle className="h-4 w-4" />
                  {isProductBoosted(product) ? "Boosted" : "Boost"}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
      
      {/* Boost Product Dialog */}
      <Dialog open={showBoostDialog} onOpenChange={setShowBoostDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Boost Product Visibility</DialogTitle>
            <DialogDescription>
              Boosted products appear in the sponsored section across the marketplace for greater visibility.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <h4 className="text-sm font-medium mb-3">Select Boost Duration:</h4>
            <div className="space-y-3">
              {boostOptions.map((option) => (
                <Card 
                  key={option.id}
                  className={`cursor-pointer transition-all ${
                    selectedBoostOption === option.id ? 'border-blue-500 bg-blue-50' : ''
                  }`}
                  onClick={() => setSelectedBoostOption(option.id)}
                >
                  <CardContent className="p-3 flex justify-between items-center">
                    <div>
                      <h4 className="font-medium">{option.name}</h4>
                      <p className="text-sm text-muted-foreground">{option.description}</p>
                    </div>
                    <div className="text-right">
                      <span className="font-semibold text-blue-600">${option.price}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowBoostDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleBoost}
              disabled={!selectedBoostOption}
            >
              Boost Product
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Product Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Listing</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this product listing? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            {selectedProduct && (
              <div className="flex items-center gap-3">
                <div className="h-16 w-16 rounded overflow-hidden">
                  <img 
                    src={selectedProduct.image} 
                    alt={selectedProduct.name}
                    className="h-full w-full object-cover" 
                  />
                </div>
                <div>
                  <h4 className="font-medium">{selectedProduct.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    ${(selectedProduct.discountPrice || selectedProduct.price).toFixed(2)}
                  </p>
                </div>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive"
              onClick={handleDelete}
            >
              Delete Product
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SellerDashboard;
