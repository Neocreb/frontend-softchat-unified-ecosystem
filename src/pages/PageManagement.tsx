import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeft,
  Settings,
  Users,
  MessageSquare,
  Store,
  BarChart3,
  Star,
  Heart,
  Save,
  Eye,
  Plus,
  Edit,
  Trash2,
  TrendingUp,
  DollarSign,
  Package,
  Building,
} from "lucide-react";

const PageManagement = () => {
  const { pageId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [pageSettings, setPageSettings] = useState({
    name: "TechCorp Solutions",
    description: "Leading provider of innovative technology solutions for modern businesses.",
    category: "Technology",
    pageType: "business",
    website: "https://techcorp.example.com",
    location: "San Francisco, CA",
    email: "contact@techcorp.example.com",
    phone: "+1 (555) 123-4567",
    hours: "Mon-Fri 9AM-6PM PST"
  });

  const [products] = useState([
    {
      id: "1",
      name: "AI Analytics Pro",
      price: 299,
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=300",
      inStock: true,
      sales: 145,
      revenue: 43255
    },
    {
      id: "2",
      name: "Cloud Infrastructure Suite",
      price: 499,
      image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=300",
      inStock: true,
      sales: 89,
      revenue: 44411
    }
  ]);

  const [followers] = useState([
    { id: "1", name: "Sarah Johnson", avatar: "https://images.unsplash.com/photo-1494790108755-2616b2bab1d3?w=100", followedAt: "2024-01-15" },
    { id: "2", name: "Mike Chen", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100", followedAt: "2024-01-14" },
    { id: "3", name: "Lisa Rodriguez", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100", followedAt: "2024-01-12" }
  ]);

  const handleSaveSettings = () => {
    toast({
      title: "Settings Saved",
      description: "Page settings have been updated successfully!"
    });
  };

  const handleAddProduct = () => {
    navigate(`/app/marketplace/list?pageId=${pageId}`);
    toast({
      title: "Add Product",
      description: "Redirecting to product listing page..."
    });
  };

  const handleEditProduct = (productId: string) => {
    navigate(`/app/marketplace/edit/${productId}`);
  };

  const handleViewAnalytics = () => {
    toast({
      title: "Analytics",
      description: "Opening detailed analytics dashboard..."
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
            <Button
              variant="ghost"
              onClick={() => navigate(`/app/pages/${pageId}`)}
              className="flex items-center gap-2 self-start"
              size="sm"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Back to Page</span>
              <span className="sm:hidden">Back</span>
            </Button>
            <div className="min-w-0 flex-1">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold flex items-center gap-2">
                <Building className="w-6 h-6 sm:w-8 sm:h-8" />
                <span className="truncate">Page Management</span>
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground">
                Manage your page settings, products, and followers
              </p>
            </div>
          </div>
        </div>

        <Tabs defaultValue="settings" className="w-full">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 mb-6">
            <TabsTrigger value="settings" className="text-xs sm:text-sm">Settings</TabsTrigger>
            <TabsTrigger value="products" className="text-xs sm:text-sm">Products</TabsTrigger>
            <TabsTrigger value="followers" className="text-xs sm:text-sm lg:inline hidden">Followers</TabsTrigger>
            <TabsTrigger value="insights" className="text-xs sm:text-sm">Insights</TabsTrigger>
            <TabsTrigger value="analytics" className="text-xs sm:text-sm">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="pageName">Page Name</Label>
                  <Input
                    id="pageName"
                    value={pageSettings.name}
                    onChange={(e) => setPageSettings(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                
                <div>
                  <Label htmlFor="pageDescription">Description</Label>
                  <Textarea
                    id="pageDescription"
                    value={pageSettings.description}
                    onChange={(e) => setPageSettings(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="pageCategory">Category</Label>
                    <select
                      id="pageCategory"
                      value={pageSettings.category}
                      onChange={(e) => setPageSettings(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full p-2 border rounded-md"
                    >
                      <option value="Technology">Technology</option>
                      <option value="Business">Business</option>
                      <option value="Entertainment">Entertainment</option>
                      <option value="Education">Education</option>
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="pageType">Page Type</Label>
                    <select
                      id="pageType"
                      value={pageSettings.pageType}
                      onChange={(e) => setPageSettings(prev => ({ ...prev, pageType: e.target.value }))}
                      className="w-full p-2 border rounded-md"
                    >
                      <option value="business">Business</option>
                      <option value="brand">Brand</option>
                      <option value="public_figure">Public Figure</option>
                      <option value="community">Community</option>
                      <option value="organization">Organization</option>
                    </select>
                  </div>
                </div>

                <Button onClick={handleSaveSettings}>
                  <Save className="w-4 h-4 mr-2" />
                  Save Settings
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="pageWebsite">Website</Label>
                    <Input
                      id="pageWebsite"
                      value={pageSettings.website}
                      onChange={(e) => setPageSettings(prev => ({ ...prev, website: e.target.value }))}
                    />
                  </div>

                  <div>
                    <Label htmlFor="pageLocation">Location</Label>
                    <Input
                      id="pageLocation"
                      value={pageSettings.location}
                      onChange={(e) => setPageSettings(prev => ({ ...prev, location: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="pageEmail">Email</Label>
                    <Input
                      id="pageEmail"
                      type="email"
                      value={pageSettings.email}
                      onChange={(e) => setPageSettings(prev => ({ ...prev, email: e.target.value }))}
                    />
                  </div>

                  <div>
                    <Label htmlFor="pagePhone">Phone</Label>
                    <Input
                      id="pagePhone"
                      value={pageSettings.phone}
                      onChange={(e) => setPageSettings(prev => ({ ...prev, phone: e.target.value }))}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="pageHours">Business Hours</Label>
                  <Input
                    id="pageHours"
                    value={pageSettings.hours}
                    onChange={(e) => setPageSettings(prev => ({ ...prev, hours: e.target.value }))}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="products" className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Products & Services</h3>
              <Button onClick={handleAddProduct}>
                <Plus className="w-4 h-4 mr-2" />
                Add Product
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
              {products.map((product) => (
                <Card key={product.id}>
                  <div className="aspect-square overflow-hidden rounded-t-lg">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="p-4">
                    <h4 className="font-semibold mb-2">{product.name}</h4>
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-lg font-bold">${product.price}</div>
                      <Badge variant={product.inStock ? "default" : "secondary"}>
                        {product.inStock ? "In Stock" : "Out of Stock"}
                      </Badge>
                    </div>
                    <div className="space-y-1 text-sm text-muted-foreground mb-3">
                      <div>Sales: {product.sales}</div>
                      <div>Revenue: ${product.revenue.toLocaleString()}</div>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => handleEditProduct(product.id)}
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {products.length === 0 && (
              <div className="text-center py-12">
                <Package className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No products yet</h3>
                <p className="text-muted-foreground mb-4">
                  Add your first product to start selling on the marketplace
                </p>
                <Button onClick={handleAddProduct}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add First Product
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="followers" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Page Followers ({followers.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {followers.map((follower) => (
                    <div key={follower.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <img
                          src={follower.avatar}
                          alt={follower.name}
                          className="w-10 h-10 rounded-full"
                        />
                        <div>
                          <h4 className="font-semibold">{follower.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            Following since {new Date(follower.followedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      
                      <Button variant="outline" size="sm">
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Message
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="insights" className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Page Views</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">12,345</div>
                    <p className="text-sm text-muted-foreground">This month</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Total Followers</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">2,567</div>
                    <p className="text-sm text-muted-foreground">+12% this month</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Post Engagement</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600">8.5%</div>
                    <p className="text-sm text-muted-foreground">Average rate</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Messages</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-orange-600">89</div>
                    <p className="text-sm text-muted-foreground">This week</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Alert>
              <TrendingUp className="h-4 w-4" />
              <AlertDescription>
                Your page performance is 23% better than similar pages in your category.
              </AlertDescription>
            </Alert>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Revenue</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">$87,666</div>
                    <p className="text-sm text-muted-foreground">Total earnings</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Orders</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">234</div>
                    <p className="text-sm text-muted-foreground">Total sales</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Conversion Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600">4.2%</div>
                    <p className="text-sm text-muted-foreground">Visitor to sale</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Detailed Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <BarChart3 className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Advanced Analytics</h3>
                  <p className="text-muted-foreground mb-4">
                    Get detailed insights about your page's performance, audience, and sales.
                  </p>
                  <Button onClick={handleViewAnalytics}>
                    <BarChart3 className="w-4 h-4 mr-2" />
                    View Full Analytics
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default PageManagement;
