import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Package,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Bell,
  Eye,
  Edit,
  Activity,
  BarChart3,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

interface InventoryItem {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  sku: string;
  currentStock: number;
  reservedStock: number;
  availableStock: number;
  reorderPoint: number;
  maxStock: number;
  lastRestocked: string;
  stockMovements: StockMovement[];
  status: "in_stock" | "low_stock" | "out_of_stock" | "reorder_needed";
  location: string;
  supplier?: string;
}

interface StockMovement {
  id: string;
  type: "sale" | "restock" | "return" | "adjustment" | "reserved" | "released";
  quantity: number;
  timestamp: string;
  orderId?: string;
  note?: string;
}

interface InventoryTrackerProps {
  sellerId?: string;
}

const InventoryTracker = ({ sellerId }: InventoryTrackerProps) => {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [realTimeUpdates, setRealTimeUpdates] = useState(true);

  const { toast } = useToast();

  // Mock inventory data
  const mockInventory: InventoryItem[] = [
    {
      id: "inv_1",
      productId: "1",
      productName: "Wireless Noise Cancelling Headphones",
      productImage:
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100",
      sku: "WH-1000XM4",
      currentStock: 45,
      reservedStock: 8,
      availableStock: 37,
      reorderPoint: 20,
      maxStock: 100,
      lastRestocked: "2024-01-20T10:30:00Z",
      status: "in_stock",
      location: "Warehouse A - Section 1",
      supplier: "AudioTech Supplies",
      stockMovements: [
        {
          id: "mov_1",
          type: "sale",
          quantity: -2,
          timestamp: "2024-01-22T14:30:00Z",
          orderId: "order_123",
        },
        {
          id: "mov_2",
          type: "restock",
          quantity: 25,
          timestamp: "2024-01-20T10:30:00Z",
          note: "Regular restock from supplier",
        },
      ],
    },
    {
      id: "inv_2",
      productId: "2",
      productName: "Smart Watch Series 5",
      productImage:
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100",
      sku: "SW-S5-BLK",
      currentStock: 12,
      reservedStock: 5,
      availableStock: 7,
      reorderPoint: 15,
      maxStock: 50,
      lastRestocked: "2024-01-18T09:15:00Z",
      status: "low_stock",
      location: "Warehouse A - Section 2",
      supplier: "TechGear Pro",
      stockMovements: [
        {
          id: "mov_3",
          type: "sale",
          quantity: -3,
          timestamp: "2024-01-22T11:45:00Z",
          orderId: "order_456",
        },
      ],
    },
    {
      id: "inv_3",
      productId: "3",
      productName: "Bluetooth Speaker",
      productImage:
        "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=100",
      sku: "BS-PRO-RED",
      currentStock: 0,
      reservedStock: 0,
      availableStock: 0,
      reorderPoint: 10,
      maxStock: 30,
      lastRestocked: "2024-01-10T16:20:00Z",
      status: "out_of_stock",
      location: "Warehouse B - Section 1",
      supplier: "Sound Solutions",
      stockMovements: [
        {
          id: "mov_4",
          type: "sale",
          quantity: -1,
          timestamp: "2024-01-21T09:30:00Z",
          orderId: "order_789",
        },
      ],
    },
  ];

  useEffect(() => {
    const loadInventory = async () => {
      setLoading(true);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setInventory(mockInventory);
      setLoading(false);
    };

    loadInventory();

    // Set up real-time updates simulation
    if (realTimeUpdates) {
      const interval = setInterval(() => {
        setInventory((prev) =>
          prev.map((item) => {
            // Simulate random stock changes
            if (Math.random() < 0.1) {
              // 10% chance of change
              const change = Math.floor(Math.random() * 3) - 1; // -1, 0, or 1
              const newStock = Math.max(0, item.currentStock + change);
              const newAvailable = Math.max(0, newStock - item.reservedStock);

              let newStatus: InventoryItem["status"] = "in_stock";
              if (newStock === 0) newStatus = "out_of_stock";
              else if (newStock <= item.reorderPoint) newStatus = "low_stock";
              else if (newStock < item.reorderPoint * 1.5)
                newStatus = "reorder_needed";

              return {
                ...item,
                currentStock: newStock,
                availableStock: newAvailable,
                status: newStatus,
              };
            }
            return item;
          }),
        );
      }, 5000); // Update every 5 seconds

      return () => clearInterval(interval);
    }
  }, [realTimeUpdates]);

  const getStatusColor = (status: InventoryItem["status"]) => {
    switch (status) {
      case "in_stock":
        return "bg-green-100 text-green-800";
      case "low_stock":
        return "bg-yellow-100 text-yellow-800";
      case "out_of_stock":
        return "bg-red-100 text-red-800";
      case "reorder_needed":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: InventoryItem["status"]) => {
    switch (status) {
      case "in_stock":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "low_stock":
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case "out_of_stock":
        return <XCircle className="w-4 h-4 text-red-600" />;
      case "reorder_needed":
        return <Bell className="w-4 h-4 text-orange-600" />;
      default:
        return <Package className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStockLevel = (item: InventoryItem) => {
    return (item.currentStock / item.maxStock) * 100;
  };

  const handleUpdateStock = (itemId: string, newStock: number) => {
    setInventory((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? {
              ...item,
              currentStock: newStock,
              availableStock: Math.max(0, newStock - item.reservedStock),
              status:
                newStock === 0
                  ? "out_of_stock"
                  : newStock <= item.reorderPoint
                    ? "low_stock"
                    : "in_stock",
            }
          : item,
      ),
    );

    toast({
      title: "Stock Updated",
      description: `Inventory has been updated successfully`,
    });
  };

  const getLowStockItems = () => {
    return inventory.filter(
      (item) =>
        item.status === "low_stock" ||
        item.status === "out_of_stock" ||
        item.status === "reorder_needed",
    );
  };

  const getTotalValue = () => {
    // Mock calculation - in real app would use actual product prices
    return inventory.reduce((total, item) => total + item.currentStock * 50, 0);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded animate-pulse" />
                  <div className="h-8 bg-muted rounded animate-pulse" />
                  <div className="h-4 w-24 bg-muted rounded animate-pulse" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Real-time Toggle */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Inventory Management</h2>
          <p className="text-muted-foreground">
            Real-time stock tracking and management
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant={realTimeUpdates ? "default" : "outline"}
            onClick={() => setRealTimeUpdates(!realTimeUpdates)}
          >
            <Activity className="w-4 h-4 mr-2" />
            Live Updates {realTimeUpdates ? "ON" : "OFF"}
          </Button>
          <Button variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Items
                </p>
                <p className="text-2xl font-bold">{inventory.length}</p>
              </div>
              <Package className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Low Stock Alerts
                </p>
                <p className="text-2xl font-bold text-orange-600">
                  {getLowStockItems().length}
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Stock Value
                </p>
                <p className="text-2xl font-bold">
                  ${getTotalValue().toLocaleString()}
                </p>
              </div>
              <BarChart3 className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Out of Stock
                </p>
                <p className="text-2xl font-bold text-red-600">
                  {
                    inventory.filter((item) => item.status === "out_of_stock")
                      .length
                  }
                </p>
              </div>
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Low Stock Alerts */}
      {getLowStockItems().length > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="text-orange-800 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Stock Alerts ({getLowStockItems().length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {getLowStockItems().map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 bg-white rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={item.productImage}
                      alt={item.productName}
                      className="w-10 h-10 object-cover rounded"
                    />
                    <div>
                      <p className="font-medium text-sm">{item.productName}</p>
                      <p className="text-xs text-muted-foreground">
                        SKU: {item.sku}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className={getStatusColor(item.status)}>
                      {item.status.replace("_", " ")}
                    </Badge>
                    <span className="text-sm font-medium">
                      {item.currentStock} units
                    </span>
                    <Button size="sm">Reorder</Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Inventory Table */}
      <Card>
        <CardHeader>
          <CardTitle>Current Inventory</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Stock Level</TableHead>
                <TableHead>Available</TableHead>
                <TableHead>Reserved</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inventory.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <img
                        src={item.productImage}
                        alt={item.productName}
                        className="w-10 h-10 object-cover rounded"
                      />
                      <div>
                        <p className="font-medium text-sm">
                          {item.productName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {item.supplier}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <code className="text-xs bg-muted px-2 py-1 rounded">
                      {item.sku}
                    </code>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">
                          {item.currentStock}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          / {item.maxStock}
                        </span>
                      </div>
                      <Progress value={getStockLevel(item)} className="h-1" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">{item.availableStock}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-muted-foreground">
                      {item.reservedStock}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(item.status)}>
                      {getStatusIcon(item.status)}
                      <span className="ml-1 capitalize">
                        {item.status.replace("_", " ")}
                      </span>
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">
                      {item.location}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedItem(item)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>
                              Inventory Details: {item.productName}
                            </DialogTitle>
                            <DialogDescription>
                              Detailed view and stock movement history
                            </DialogDescription>
                          </DialogHeader>
                          {selectedItem && (
                            <div className="space-y-6">
                              {/* Item Details */}
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className="text-sm font-medium text-muted-foreground">
                                    Current Stock
                                  </label>
                                  <div className="flex items-center gap-2 mt-1">
                                    <Input
                                      type="number"
                                      value={selectedItem.currentStock}
                                      onChange={(e) => {
                                        const newStock =
                                          parseInt(e.target.value) || 0;
                                        setSelectedItem({
                                          ...selectedItem,
                                          currentStock: newStock,
                                        });
                                      }}
                                      className="w-20"
                                    />
                                    <Button
                                      size="sm"
                                      onClick={() =>
                                        handleUpdateStock(
                                          selectedItem.id,
                                          selectedItem.currentStock,
                                        )
                                      }
                                    >
                                      Update
                                    </Button>
                                  </div>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-muted-foreground">
                                    Reorder Point
                                  </label>
                                  <p className="text-lg font-semibold mt-1">
                                    {selectedItem.reorderPoint}
                                  </p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-muted-foreground">
                                    Reserved Stock
                                  </label>
                                  <p className="text-lg font-semibold mt-1">
                                    {selectedItem.reservedStock}
                                  </p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-muted-foreground">
                                    Last Restocked
                                  </label>
                                  <p className="text-sm mt-1">
                                    {new Date(
                                      selectedItem.lastRestocked,
                                    ).toLocaleDateString()}
                                  </p>
                                </div>
                              </div>

                              {/* Stock Movements */}
                              <div>
                                <h4 className="font-medium mb-3">
                                  Recent Stock Movements
                                </h4>
                                <div className="space-y-2 max-h-60 overflow-y-auto">
                                  {selectedItem.stockMovements.map(
                                    (movement) => (
                                      <div
                                        key={movement.id}
                                        className="flex items-center justify-between p-3 border rounded-lg"
                                      >
                                        <div className="flex items-center gap-3">
                                          <div
                                            className={cn(
                                              "w-2 h-2 rounded-full",
                                              movement.quantity > 0
                                                ? "bg-green-500"
                                                : "bg-red-500",
                                            )}
                                          />
                                          <div>
                                            <p className="text-sm font-medium capitalize">
                                              {movement.type}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                              {new Date(
                                                movement.timestamp,
                                              ).toLocaleString()}
                                            </p>
                                          </div>
                                        </div>
                                        <div className="text-right">
                                          <p
                                            className={cn(
                                              "font-medium",
                                              movement.quantity > 0
                                                ? "text-green-600"
                                                : "text-red-600",
                                            )}
                                          >
                                            {movement.quantity > 0 ? "+" : ""}
                                            {movement.quantity}
                                          </p>
                                          {movement.orderId && (
                                            <p className="text-xs text-muted-foreground">
                                              #{movement.orderId}
                                            </p>
                                          )}
                                        </div>
                                      </div>
                                    ),
                                  )}
                                </div>
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default InventoryTracker;
