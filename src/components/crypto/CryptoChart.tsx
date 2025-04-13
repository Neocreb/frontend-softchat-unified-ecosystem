
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import type { Crypto } from "@/pages/CryptoMarket";

interface CryptoChartProps {
  crypto: Crypto;
}

type TimeRange = "24h" | "7d" | "30d" | "90d" | "1y";

const CryptoChart = ({ crypto }: CryptoChartProps) => {
  const [timeRange, setTimeRange] = useState<TimeRange>("7d");

  // Generate mock chart data based on current price and time range
  const generateChartData = () => {
    const data = [];
    const currentPrice = crypto.current_price;
    const priceChange = crypto.price_change_percentage_24h / 100;
    
    let numberOfPoints = 0;
    let timeFormat = "";
    
    switch (timeRange) {
      case "24h":
        numberOfPoints = 24;
        timeFormat = "HH:mm";
        break;
      case "7d":
        numberOfPoints = 7;
        timeFormat = "dd/MM";
        break;
      case "30d":
        numberOfPoints = 30;
        timeFormat = "dd/MM";
        break;
      case "90d":
        numberOfPoints = 12;
        timeFormat = "MM/yyyy";
        break;
      case "1y":
        numberOfPoints = 12;
        timeFormat = "MM/yyyy";
        break;
      default:
        numberOfPoints = 7;
        timeFormat = "dd/MM";
    }
    
    // Create a volatility factor based on the coin
    const volatilityFactor = crypto.id === "bitcoin" ? 0.05 : 
                             crypto.id === "ethereum" ? 0.08 : 0.12;

    // Generate data points with some randomness to simulate price movement
    for (let i = 0; i < numberOfPoints; i++) {
      const date = new Date();
      if (timeRange === "24h") {
        date.setHours(date.getHours() - (numberOfPoints - i));
      } else if (timeRange === "7d") {
        date.setDate(date.getDate() - (numberOfPoints - i));
      } else if (timeRange === "30d") {
        date.setDate(date.getDate() - (numberOfPoints - i) * 3);
      } else if (timeRange === "90d") {
        date.setDate(date.getDate() - (numberOfPoints - i) * 7);
      } else if (timeRange === "1y") {
        date.setMonth(date.getMonth() - (numberOfPoints - i));
      }
      
      // Create a randomized price movement with a trend based on the 24h change
      const randomFactor = 1 + (Math.random() * volatilityFactor * 2 - volatilityFactor);
      const trendFactor = 1 + (priceChange * (i / numberOfPoints));
      const price = currentPrice * randomFactor * trendFactor;
      
      data.push({
        date: date.toLocaleDateString(),
        value: price
      });
    }
    
    return data;
  };

  const chartData = generateChartData();
  
  const isPositiveChange = crypto.price_change_percentage_24h > 0;
  const chartColor = isPositiveChange ? "#10b981" : "#ef4444";

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img 
              src={crypto.image} 
              alt={crypto.name} 
              className="h-8 w-8 rounded-full"
            />
            <CardTitle className="text-xl">
              {crypto.name} ({crypto.symbol.toUpperCase()})
            </CardTitle>
            <div className="text-2xl font-bold ml-4">
              ${crypto.current_price.toLocaleString()}
            </div>
            <div 
              className={`text-sm font-medium ${
                isPositiveChange ? "text-green-500" : "text-red-500"
              }`}
            >
              {isPositiveChange ? "+" : ""}{crypto.price_change_percentage_24h.toFixed(2)}%
            </div>
          </div>
          
          <Tabs value={timeRange} onValueChange={(value) => setTimeRange(value as TimeRange)}>
            <TabsList>
              <TabsTrigger value="24h">24H</TabsTrigger>
              <TabsTrigger value="7d">7D</TabsTrigger>
              <TabsTrigger value="30d">30D</TabsTrigger>
              <TabsTrigger value="90d">90D</TabsTrigger>
              <TabsTrigger value="1y">1Y</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{
                top: 5,
                right: 5,
                left: 5,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }} 
                tickLine={false}
                axisLine={false}
                minTickGap={20}
              />
              <YAxis 
                domain={['auto', 'auto']}
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `$${value.toLocaleString()}`}
              />
              <Tooltip 
                formatter={(value: number) => [`$${value.toLocaleString()}`, 'Price']}
                labelFormatter={(label) => `Date: ${label}`}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke={chartColor}
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default CryptoChart;
