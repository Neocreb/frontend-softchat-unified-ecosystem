import React, { useState } from "react";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FileText,
  AlertTriangle,
  Info,
  CheckCircle,
  XCircle,
  Search,
  Filter,
  Download,
  RefreshCw,
} from "lucide-react";

const AdminLogs = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [logLevel, setLogLevel] = useState("all");

  const mockLogs = [
    {
      id: "1",
      timestamp: "2024-01-28 10:30:15",
      level: "error",
      service: "auth-service",
      message: "Failed login attempt for user: invalid_user@test.com",
      details: { ip: "192.168.1.100", userAgent: "Mozilla/5.0..." },
    },
    {
      id: "2",
      timestamp: "2024-01-28 10:29:45",
      level: "info",
      service: "marketplace",
      message: "New product listing created",
      details: { productId: "P123456", sellerId: "S789012" },
    },
    {
      id: "3",
      timestamp: "2024-01-28 10:28:30",
      level: "warning",
      service: "crypto-trading",
      message: "High trade volume detected",
      details: { pair: "BTC/USD", volume: 1000000 },
    },
    {
      id: "4",
      timestamp: "2024-01-28 10:27:12",
      level: "success",
      service: "payment",
      message: "Payment processed successfully",
      details: { amount: 299.99, transactionId: "TXN789456" },
    },
    {
      id: "5",
      timestamp: "2024-01-28 10:26:05",
      level: "error",
      service: "database",
      message: "Connection timeout to read replica",
      details: { host: "db-replica-1", timeout: "30s" },
    },
  ];

  const systemMetrics = [
    { name: "API Requests", value: "1.2M", change: "+5.2%" },
    { name: "Error Rate", value: "0.12%", change: "-0.3%" },
    { name: "Avg Response Time", value: "145ms", change: "+12ms" },
    { name: "Database Queries", value: "890K", change: "+2.1%" },
  ];

  const getLogIcon = (level: string) => {
    switch (level) {
      case "error":
        return <XCircle className="h-4 w-4 text-red-500" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      default:
        return <Info className="h-4 w-4 text-blue-500" />;
    }
  };

  const getLogBadgeVariant = (level: string) => {
    switch (level) {
      case "error":
        return "destructive";
      case "warning":
        return "secondary";
      case "success":
        return "default";
      default:
        return "outline";
    }
  };

  const filteredLogs = mockLogs.filter((log) => {
    const matchesSearch =
      log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.service.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = logLevel === "all" || log.level === logLevel;
    return matchesSearch && matchesLevel;
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            System Logs
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Monitor system activity and troubleshoot issues
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Logs
          </Button>
          <Button variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* System Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {systemMetrics.map((metric) => (
          <Card key={metric.name}>
            <CardContent className="flex flex-col items-center justify-center p-6">
              <CardTitle className="text-2xl font-bold">
                {metric.value}
              </CardTitle>
              <CardDescription>{metric.name}</CardDescription>
              <div
                className={`text-sm mt-1 ${
                  metric.change.startsWith("+") && metric.name !== "Error Rate"
                    ? "text-green-600"
                    : metric.change.startsWith("-") &&
                        metric.name === "Error Rate"
                      ? "text-green-600"
                      : "text-red-600"
                }`}
              >
                {metric.change}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content */}
      <Tabs defaultValue="recent" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="recent">Recent Logs</TabsTrigger>
          <TabsTrigger value="errors">Error Logs</TabsTrigger>
          <TabsTrigger value="audit">Audit Trail</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="recent" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>System Activity Logs</CardTitle>
                  <CardDescription>
                    Real-time system events and activities
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search logs..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-64"
                    />
                  </div>
                  <Select value={logLevel} onValueChange={setLogLevel}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Levels</SelectItem>
                      <SelectItem value="error">Error</SelectItem>
                      <SelectItem value="warning">Warning</SelectItem>
                      <SelectItem value="info">Info</SelectItem>
                      <SelectItem value="success">Success</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredLogs.map((log) => (
                  <div
                    key={log.id}
                    className="flex items-start gap-4 p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    <div className="flex-shrink-0 mt-1">
                      {getLogIcon(log.level)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant={getLogBadgeVariant(log.level)}>
                          {log.level.toUpperCase()}
                        </Badge>
                        <Badge variant="outline">{log.service}</Badge>
                        <span className="text-sm text-gray-500">
                          {log.timestamp}
                        </span>
                      </div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                        {log.message}
                      </p>
                      {log.details && (
                        <div className="text-xs text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 p-2 rounded">
                          <pre>{JSON.stringify(log.details, null, 2)}</pre>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="errors" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Error Logs</CardTitle>
              <CardDescription>
                System errors and critical issues requiring attention
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockLogs
                  .filter((log) => log.level === "error")
                  .map((log) => (
                    <div
                      key={log.id}
                      className="flex items-start gap-4 p-4 border border-red-200 rounded-lg bg-red-50 dark:bg-red-900/20"
                    >
                      <XCircle className="h-5 w-5 text-red-500 mt-1" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="destructive">ERROR</Badge>
                          <Badge variant="outline">{log.service}</Badge>
                          <span className="text-sm text-gray-500">
                            {log.timestamp}
                          </span>
                        </div>
                        <p className="text-sm font-medium mb-2">
                          {log.message}
                        </p>
                        {log.details && (
                          <div className="text-xs text-gray-600 bg-gray-100 dark:bg-gray-800 p-2 rounded">
                            <pre>{JSON.stringify(log.details, null, 2)}</pre>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audit" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Audit Trail</CardTitle>
              <CardDescription>
                Administrative actions and security events
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Audit Trail
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Detailed audit logging features coming soon
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Performance Logs</CardTitle>
              <CardDescription>
                System performance metrics and monitoring
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Performance Monitoring
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Advanced performance analytics coming soon
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminLogs;
