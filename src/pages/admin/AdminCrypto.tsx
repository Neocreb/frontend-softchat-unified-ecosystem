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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Bitcoin,
  TrendingUp,
  AlertTriangle,
  Users,
  DollarSign,
  Activity,
  Shield,
  Eye,
  Ban,
  CheckCircle,
} from "lucide-react";

const AdminCrypto = () => {
  const [stats] = useState({
    totalTrades: 3247,
    activeTraders: 156,
    totalVolume: 2456789,
    pendingDisputes: 7,
  });

  const mockTrades = [
    {
      id: "1",
      trader: "alice_crypto",
      pair: "BTC/USD",
      amount: 0.5,
      value: 23450,
      status: "completed",
      type: "buy",
      timestamp: new Date().toISOString(),
    },
    {
      id: "2",
      trader: "crypto_king",
      pair: "ETH/USD",
      amount: 2.3,
      value: 5670,
      status: "pending",
      type: "sell",
      timestamp: new Date().toISOString(),
    },
    {
      id: "3",
      trader: "btc_hodler",
      pair: "BTC/USD",
      amount: 1.2,
      value: 56280,
      status: "disputed",
      type: "buy",
      timestamp: new Date().toISOString(),
    },
  ];

  const mockDisputes = [
    {
      id: "1",
      tradeId: "T123456",
      reporter: "alice_crypto",
      reported: "crypto_scammer",
      reason: "Payment not received",
      amount: 1250,
      status: "investigating",
      created: new Date().toISOString(),
    },
    {
      id: "2",
      tradeId: "T789012",
      reporter: "btc_trader",
      reported: "fake_seller",
      reason: "Fake proof of payment",
      amount: 3400,
      status: "pending",
      created: new Date().toISOString(),
    },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Cryptocurrency Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Monitor trades, disputes, and cryptocurrency activities
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <div className="bg-orange-500/10 p-3 rounded-full mb-4">
              <Bitcoin className="h-6 w-6 text-orange-600" />
            </div>
            <CardTitle className="text-2xl font-bold">
              {stats.totalTrades.toLocaleString()}
            </CardTitle>
            <CardDescription>Total Trades</CardDescription>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <div className="bg-blue-500/10 p-3 rounded-full mb-4">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <CardTitle className="text-2xl font-bold">
              {stats.activeTraders}
            </CardTitle>
            <CardDescription>Active Traders</CardDescription>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <div className="bg-green-500/10 p-3 rounded-full mb-4">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
            <CardTitle className="text-2xl font-bold">
              ${stats.totalVolume.toLocaleString()}
            </CardTitle>
            <CardDescription>Trading Volume</CardDescription>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <div className="bg-red-500/10 p-3 rounded-full mb-4">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <CardTitle className="text-2xl font-bold">
              {stats.pendingDisputes}
            </CardTitle>
            <CardDescription>Pending Disputes</CardDescription>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="trades" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="trades">Recent Trades</TabsTrigger>
          <TabsTrigger value="disputes">Disputes</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="trades" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Trade Monitoring</CardTitle>
              <CardDescription>
                Monitor all cryptocurrency trades and transactions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockTrades.map((trade) => (
                  <div
                    key={trade.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white">
                        ₿
                      </div>
                      <div>
                        <h3 className="font-medium">{trade.pair}</h3>
                        <p className="text-sm text-gray-600">
                          {trade.trader} • {trade.type}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-medium">
                          {trade.amount} {trade.pair.split("/")[0]}
                        </p>
                        <p className="text-sm text-gray-600">
                          ${trade.value.toLocaleString()}
                        </p>
                      </div>
                      <Badge
                        variant={
                          trade.status === "completed"
                            ? "default"
                            : trade.status === "disputed"
                              ? "destructive"
                              : "secondary"
                        }
                      >
                        {trade.status}
                      </Badge>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4" />
                        </Button>
                        {trade.status === "disputed" && (
                          <Button size="sm" variant="outline">
                            <AlertTriangle className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="disputes" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Dispute Resolution</CardTitle>
              <CardDescription>
                Manage and resolve trading disputes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockDisputes.map((dispute) => (
                  <div
                    key={dispute.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center text-white">
                        ⚠
                      </div>
                      <div>
                        <h3 className="font-medium">
                          Trade #{dispute.tradeId}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {dispute.reporter} vs {dispute.reported}
                        </p>
                        <p className="text-sm text-gray-600">
                          {dispute.reason}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-medium">
                          ${dispute.amount.toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-600">
                          {new Date(dispute.created).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge
                        variant={
                          dispute.status === "investigating"
                            ? "default"
                            : "secondary"
                        }
                      >
                        {dispute.status}
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

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Security Monitoring</CardTitle>
              <CardDescription>
                Monitor security threats and suspicious activities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Security Dashboard
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Advanced security monitoring features coming soon
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Trading Analytics</CardTitle>
              <CardDescription>
                Trading patterns and market analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Trading Analytics
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Detailed trading analytics and market insights coming soon
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminCrypto;
