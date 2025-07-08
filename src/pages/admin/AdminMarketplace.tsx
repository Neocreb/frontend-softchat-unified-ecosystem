import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ShoppingCart,
  Package,
  DollarSign,
  TrendingUp,
  Users,
  AlertTriangle,
  Search,
  Filter,
  Eye,
  Ban,
  CheckCircle,
} from "lucide-react";

const AdminMarketplace = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [stats, setStats] = useState({
    totalProducts: 1247,
    activeSellers: 89,
    totalSales: 45620,
    pendingApprovals: 23,
  });

  const mockProducts = [
    {
      id: "1",
      name: "Wireless Headphones",
      seller: "TechStore",
      price: 129.99,
      status: "active",
      sales: 45,
      category: "Electronics",
    },
    {
      id: "2",
      name: "Coffee Mug",
      seller: "HomeGoods",
      price: 15.99,
      status: "pending",
      sales: 12,
      category: "Home & Garden",
    },
    {
      id: "3",
      name: "Programming Course",
      seller: "EduTech",
      price: 99.99,
      status: "active",
      sales: 234,
      category: "Digital",
    },
  ];

  const mockSellers = [
    {
      id: "1",
      name: "TechStore",
      products: 45,
      sales: 12340,
      rating: 4.8,
      status: "verified",
    },
    {
      id: "2",
      name: "HomeGoods",
      products: 23,
      sales: 5670,
      rating: 4.5,
      status: "active",
    },
    {
      id: "3",
      name: "EduTech",
      products: 67,
      sales: 23400,
      rating: 4.9,
      status: "verified",
    },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Marketplace Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage products, sellers, and marketplace operations
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <div className="bg-blue-500/10 p-3 rounded-full mb-4">
              <Package className="h-6 w-6 text-blue-600" />
            </div>
            <CardTitle className="text-2xl font-bold">
              {stats.totalProducts.toLocaleString()}
            </CardTitle>
            <CardDescription>Total Products</CardDescription>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <div className="bg-green-500/10 p-3 rounded-full mb-4">
              <Users className="h-6 w-6 text-green-600" />
            </div>
            <CardTitle className="text-2xl font-bold">
              {stats.activeSellers}
            </CardTitle>
            <CardDescription>Active Sellers</CardDescription>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <div className="bg-yellow-500/10 p-3 rounded-full mb-4">
              <DollarSign className="h-6 w-6 text-yellow-600" />
            </div>
            <CardTitle className="text-2xl font-bold">
              ${stats.totalSales.toLocaleString()}
            </CardTitle>
            <CardDescription>Total Sales</CardDescription>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <div className="bg-red-500/10 p-3 rounded-full mb-4">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <CardTitle className="text-2xl font-bold">
              {stats.pendingApprovals}
            </CardTitle>
            <CardDescription>Pending Approvals</CardDescription>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="products" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="sellers">Sellers</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="products" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Product Management</CardTitle>
                  <CardDescription>
                    View and manage all marketplace products
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search products..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Button variant="outline">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockProducts.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                      <div>
                        <h3 className="font-medium">{product.name}</h3>
                        <p className="text-sm text-gray-600">
                          By {product.seller} • {product.category}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-medium">${product.price}</p>
                        <p className="text-sm text-gray-600">
                          {product.sales} sales
                        </p>
                      </div>
                      <Badge
                        variant={
                          product.status === "active" ? "default" : "secondary"
                        }
                      >
                        {product.status}
                      </Badge>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Ban className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sellers" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Seller Management</CardTitle>
              <CardDescription>
                Manage marketplace sellers and their performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockSellers.map((seller) => (
                  <div
                    key={seller.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium">
                        {seller.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-medium">{seller.name}</h3>
                        <p className="text-sm text-gray-600">
                          {seller.products} products • ⭐ {seller.rating}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-medium">
                          ${seller.sales.toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-600">Total sales</p>
                      </div>
                      <Badge
                        variant={
                          seller.status === "verified" ? "default" : "secondary"
                        }
                      >
                        {seller.status}
                      </Badge>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Marketplace Analytics</CardTitle>
              <CardDescription>
                Sales trends and performance metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Analytics Dashboard
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Detailed analytics and reporting features coming soon
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminMarketplace;
