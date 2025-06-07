
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { ChevronLeft, Upload, PlusCircle, X } from "lucide-react";
import { useMarketplace } from "@/contexts/MarketplaceContext";
import { Product } from "@/types/marketplace";

const categories = [
  { id: "electronics", label: "Electronics" },
  { id: "clothing", label: "Clothing" },
  { id: "accessories", label: "Accessories" },
  { id: "footwear", label: "Footwear" },
  { id: "home", label: "Home & Kitchen" },
  { id: "beauty", label: "Beauty & Health" },
  { id: "services", label: "Services" },
  { id: "food", label: "Food & Drinks" },
  { id: "books", label: "Books & Media" },
];

// Validation schema
const productSchema = z.object({
  name: z.string().min(3, "Product name must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.coerce.number().positive("Price must be a positive number"),
  discountPrice: z.coerce.number().positive("Discount price must be a positive number").optional(),
  category: z.string().min(1, "Please select a category"),
  inStock: z.boolean().default(true),
  image: z.string().min(1, "Product image is required"),
  isNew: z.boolean().default(false),
});

const MarketplaceList = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const { createProduct, updateProduct, getProduct } = useMarketplace();
  const [isEditing, setIsEditing] = useState(false);
  const [currentProductId, setCurrentProductId] = useState<string | null>(null);
  const [productImages, setProductImages] = useState<string[]>([]);
  const [currentImage, setCurrentImage] = useState<string>("");
  
  // Initialize form
  const form = useForm<z.infer<typeof productSchema>>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      discountPrice: undefined,
      category: "",
      inStock: true,
      image: "",
      isNew: false,
    },
  });
  
  // Check for edit mode on component mount
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const editId = params.get("edit");
    
    if (editId) {
      const product = getProduct(editId);
      
      if (product) {
        setIsEditing(true);
        setCurrentProductId(editId);
        setProductImages(product.images || [product.image]);
        setCurrentImage(product.image);
        
        // Populate form values
        form.reset({
          name: product.name,
          description: product.description,
          price: product.price,
          discountPrice: product.discountPrice,
          category: product.category,
          inStock: product.inStock,
          image: product.image,
          isNew: product.isNew || false,
        });
      }
    }
  }, [location.search, getProduct]);
  
  // Handle form submission
  const onSubmit = async (data: z.infer<typeof productSchema>) => {
    try {
      // Prepare product data with all images
      const productData = {
        ...data,
        images: productImages.length > 0 ? productImages : [data.image],
      };
      
      if (isEditing && currentProductId) {
        // Update existing product
        await updateProduct(currentProductId, productData as Partial<Product>);
        toast({
          title: "Product Updated",
          description: "Your product has been updated successfully",
        });
      } else {
        // Create new product
        await createProduct(productData as any);
        toast({
          title: "Product Created",
          description: "Your product has been listed successfully",
        });
      }
      
      // Navigate back to dashboard
      navigate("/marketplace/my");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save product. Please try again",
        variant: "destructive",
      });
    }
  };
  
  // Handle image input
  const handleImageInput = (imageUrl: string) => {
    if (!imageUrl) return;
    
    // Update current image
    setCurrentImage(imageUrl);
    form.setValue("image", imageUrl);
    
    // Add to image list if not already present
    if (!productImages.includes(imageUrl)) {
      setProductImages([...productImages, imageUrl]);
    }
  };
  
  // Handle image removal
  const handleRemoveImage = (imageUrl: string) => {
    // Remove from product images
    const updatedImages = productImages.filter(img => img !== imageUrl);
    setProductImages(updatedImages);
    
    // If it was the current image, update to the first available or empty
    if (imageUrl === currentImage) {
      const newCurrentImage = updatedImages.length > 0 ? updatedImages[0] : "";
      setCurrentImage(newCurrentImage);
      form.setValue("image", newCurrentImage);
    }
  };
  
  // Set image as primary
  const handleSetPrimary = (imageUrl: string) => {
    setCurrentImage(imageUrl);
    form.setValue("image", imageUrl);
  };
  
  return (
    <div className="container py-6">
      <div className="flex items-center gap-2 mb-6">
        <Button variant="ghost" size="icon" onClick={() => navigate("/marketplace/my")}>
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold">
          {isEditing ? "Edit Product" : "List New Product"}
        </h1>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <h2 className="text-lg font-medium">Product Information</h2>
            </CardHeader>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Product Name*</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter product name" {...field} />
                        </FormControl>
                        <FormDescription>
                          Choose a clear, descriptive name for your product
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Price*</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                              <Input className="pl-7" placeholder="0.00" {...field} type="number" step="0.01" />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="discountPrice"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Sale Price (Optional)</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                              <Input className="pl-7" placeholder="0.00" {...field} type="number" step="0.01" />
                            </div>
                          </FormControl>
                          <FormDescription>
                            Leave empty if not on sale
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category*</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {categories.map(category => (
                              <SelectItem key={category.id} value={category.id}>
                                {category.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description*</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Describe your product in detail..." 
                            {...field} 
                            className="min-h-[150px]"
                          />
                        </FormControl>
                        <FormDescription>
                          Include details about features, dimensions, materials, etc.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="inStock"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center gap-2 space-y-0">
                          <FormControl>
                            <input
                              type="checkbox"
                              checked={field.value}
                              onChange={field.onChange}
                              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                            />
                          </FormControl>
                          <FormLabel className="m-0">Available for purchase</FormLabel>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="isNew"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center gap-2 space-y-0">
                          <FormControl>
                            <input
                              type="checkbox"
                              checked={field.value}
                              onChange={field.onChange}
                              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                            />
                          </FormControl>
                          <FormLabel className="m-0">Mark as new arrival</FormLabel>
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
                
                <CardFooter className="border-t bg-gray-50 flex justify-between">
                  <Button variant="outline" type="button" onClick={() => navigate("/marketplace/my")}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    {isEditing ? "Update Product" : "Create Listing"}
                  </Button>
                </CardFooter>
              </form>
            </Form>
          </Card>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <h2 className="text-lg font-medium">Product Images</h2>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image URL*</FormLabel>
                    <FormControl>
                      <div className="flex gap-2">
                        <Input 
                          placeholder="Enter image URL" 
                          value={currentImage} 
                          onChange={(e) => setCurrentImage(e.target.value)}
                        />
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={() => handleImageInput(currentImage)}
                        >
                          <PlusCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    </FormControl>
                    <FormDescription>
                      Add the URL of your product image
                    </FormDescription>
                    <FormMessage />
                    
                    {/* Hidden input for form validation */}
                    <input type="hidden" {...field} />
                  </FormItem>
                )}
              />
              
              <div>
                <Label className="mb-2 block">Image Gallery</Label>
                <div className="grid grid-cols-2 gap-2">
                  {productImages.length > 0 ? (
                    productImages.map((img, index) => (
                      <div key={index} className="relative group rounded-md overflow-hidden border">
                        <img 
                          src={img} 
                          alt={`Product ${index}`} 
                          className={`w-full h-24 object-cover ${img === currentImage ? 'ring-2 ring-blue-500' : ''}`}
                        />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          <Button 
                            type="button" 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 w-8 p-0 text-white hover:text-white hover:bg-blue-600/50"
                            onClick={() => handleSetPrimary(img)}
                          >
                            {img === currentImage ? 'Primary' : 'Set Primary'}
                          </Button>
                          <Button 
                            type="button" 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-white hover:text-white hover:bg-red-600/50"
                            onClick={() => handleRemoveImage(img)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-2 border rounded-md h-24 flex items-center justify-center bg-gray-50">
                      <div className="text-center">
                        <Upload className="h-8 w-8 text-gray-300 mx-auto mb-1" />
                        <p className="text-sm text-muted-foreground">No images added</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground mt-2">
                  You can add multiple images for your product. The first image will be used as the main product image.
                </p>
              </div>
            </CardContent>
          </Card>
          
          <div className="mt-6">
            <Card>
              <CardHeader>
                <h2 className="text-lg font-medium">Listing Preview</h2>
              </CardHeader>
              <CardContent>
                {currentImage ? (
                  <div className="border rounded-md overflow-hidden">
                    <div className="aspect-square relative">
                      <img 
                        src={currentImage} 
                        alt="Preview" 
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-3">
                      <h3 className="font-medium">
                        {form.watch("name") || "Product Name"}
                      </h3>
                      <div className="flex justify-between items-center mt-1">
                        <div>
                          {form.watch("discountPrice") ? (
                            <div className="flex items-center gap-2">
                              <span className="font-semibold">${Number(form.watch("discountPrice")).toFixed(2)}</span>
                              <span className="text-sm text-muted-foreground line-through">
                                ${Number(form.watch("price")).toFixed(2)}
                              </span>
                            </div>
                          ) : (
                            <span className="font-semibold">
                              ${Number(form.watch("price")).toFixed(2) || "0.00"}
                            </span>
                          )}
                        </div>
                        <div className="text-xs px-2 py-1 bg-gray-100 rounded-full">
                          {form.watch("category") ? 
                            categories.find(c => c.id === form.watch("category"))?.label || "Category" : 
                            "Category"
                          }
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-6 border rounded-md bg-gray-50">
                    <Upload className="h-10 w-10 text-gray-300 mx-auto mb-2" />
                    <p className="text-muted-foreground">
                      Add an image to see preview
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketplaceList;
