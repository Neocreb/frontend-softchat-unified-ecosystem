
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNotification } from "@/hooks/use-notification";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Users, ShoppingCart, TrendingUp, Award } from "lucide-react";

const userActivityData = [
  { name: "Jan", posts: 40, comments: 24, likes: 180 },
  { name: "Feb", posts: 30, comments: 35, likes: 210 },
  { name: "Mar", posts: 45, comments: 50, likes: 250 },
  { name: "Apr", posts: 80, comments: 40, likes: 230 },
  { name: "May", posts: 65, comments: 60, likes: 280 },
  { name: "Jun", posts: 70, comments: 55, likes: 300 },
];

const userDistributionData = [
  { name: "Bronze", value: 400 },
  { name: "Silver", value: 300 },
  { name: "Gold", value: 150 },
  { name: "Platinum", value: 50 },
];

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042"];

const AdminDashboard = () => {
  const notification = useNotification();

  React.useEffect(() => {
    notification.info("Welcome to the Admin Dashboard");
  }, []);

  return (
    <div className="container py-6 space-y-6">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <div className="bg-primary/10 p-3 rounded-full mb-4">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold">1,234</CardTitle>
            <CardDescription>Total Users</CardDescription>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <div className="bg-orange-500/10 p-3 rounded-full mb-4">
              <ShoppingCart className="h-6 w-6 text-orange-500" />
            </div>
            <CardTitle className="text-2xl font-bold">256</CardTitle>
            <CardDescription>Marketplace Orders</CardDescription>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <div className="bg-green-500/10 p-3 rounded-full mb-4">
              <TrendingUp className="h-6 w-6 text-green-500" />
            </div>
            <CardTitle className="text-2xl font-bold">$24,325</CardTitle>
            <CardDescription>Trading Volume</CardDescription>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <div className="bg-yellow-500/10 p-3 rounded-full mb-4">
              <Award className="h-6 w-6 text-yellow-500" />
            </div>
            <CardTitle className="text-2xl font-bold">450K</CardTitle>
            <CardDescription>Reward Points Issued</CardDescription>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>User Activity</CardTitle>
            <CardDescription>Monthly engagement metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={userActivityData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="posts" fill="#8884d8" name="Posts" />
                  <Bar dataKey="comments" fill="#82ca9d" name="Comments" />
                  <Bar dataKey="likes" fill="#ffc658" name="Likes" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>User Distribution</CardTitle>
            <CardDescription>Users by membership level</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={userDistributionData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {userDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
