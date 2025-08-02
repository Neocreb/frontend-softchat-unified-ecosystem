import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import type { Crypto } from "@/pages/CryptoMarket";
import { responsiveCharts, responsiveText, cn } from "@/utils/mobileOptimization";
import { useIsMobile } from "@/hooks/use-mobile";

interface CryptoChartProps {
  crypto: Crypto;
}

type TimeRange = "24h" | "7d" | "30d" | "90d" | "1y";

const CryptoChart = ({ crypto }: CryptoChartProps) => {
  const [timeRange, setTimeRange] = useState<TimeRange>("7d");
  const isMobile = useIsMobile();

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
      <CardHeader className="pb-2 space-y-3">
        {/* Mobile-first header layout */}
        <div className="flex flex-col space-y-3">
          {/* Crypto info section */}
          <div className="flex items-center gap-2">
            <img
              src={crypto.image}
              alt={crypto.name}
              className="h-8 w-8 sm:h-10 sm:w-10 rounded-full flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <CardTitle className={cn("truncate", responsiveText.lg)}>
                {isMobile ? crypto.symbol.toUpperCase() : `${crypto.name} (${crypto.symbol.toUpperCase()})`}
              </CardTitle>
              <div className="flex items-center gap-2 flex-wrap">
                <div className={cn("font-bold", responsiveText.xl)}>
                  ${crypto.current_price.toLocaleString()}
                </div>
                <div
                  className={cn(
                    "text-sm sm:text-base font-medium",
                    isPositiveChange ? "text-green-500" : "text-red-500"
                  )}
                >
                  {isPositiveChange ? "+" : ""}{crypto.price_change_percentage_24h.toFixed(2)}%
                </div>
              </div>
            </div>
          </div>

          {/* Time range selector - mobile optimized */}
          <Tabs value={timeRange} onValueChange={(value) => setTimeRange(value as TimeRange)}>
            <TabsList className={cn(
              "grid h-9 sm:h-10 w-full",
              isMobile ? "grid-cols-3" : "grid-cols-5"
            )}>
              {isMobile ? (
                // Show only key ranges on mobile
                <>
                  <TabsTrigger value="24h" className="px-2 py-1 text-xs sm:text-sm">24H</TabsTrigger>
                  <TabsTrigger value="7d" className="px-2 py-1 text-xs sm:text-sm">7D</TabsTrigger>
                  <TabsTrigger value="30d" className="px-2 py-1 text-xs sm:text-sm">30D</TabsTrigger>
                </>
              ) : (
                // Show all ranges on larger screens
                <>
                  <TabsTrigger value="24h" className="px-2 py-1 text-xs sm:text-sm">24H</TabsTrigger>
                  <TabsTrigger value="7d" className="px-2 py-1 text-xs sm:text-sm">7D</TabsTrigger>
                  <TabsTrigger value="30d" className="px-2 py-1 text-xs sm:text-sm">30D</TabsTrigger>
                  <TabsTrigger value="90d" className="px-2 py-1 text-xs sm:text-sm">90D</TabsTrigger>
                  <TabsTrigger value="1y" className="px-2 py-1 text-xs sm:text-sm">1Y</TabsTrigger>
                </>
              )}
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:px-6">
        <div className={cn(
          "w-full",
          responsiveCharts.base
        )}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{
                top: 5,
                right: isMobile ? 2 : 5,
                left: isMobile ? 2 : 5,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
              <XAxis
                dataKey="date"
                tick={{ fontSize: isMobile ? 10 : 12 }}
                tickLine={false}
                axisLine={false}
                minTickGap={isMobile ? 30 : 20}
                interval={isMobile ? 'preserveStartEnd' : 'preserveStart'}
              />
              <YAxis
                domain={['auto', 'auto']}
                tick={{ fontSize: isMobile ? 10 : 12 }}
                tickLine={false}
                axisLine={false}
                width={isMobile ? 45 : 60}
                tickFormatter={(value) => isMobile
                  ? `$${(value / 1000).toFixed(0)}k`
                  : `$${value.toLocaleString()}`
                }
              />
              <Tooltip
                formatter={(value: number) => [`$${value.toLocaleString()}`, 'Price']}
                labelFormatter={(label) => `Date: ${label}`}
                contentStyle={{
                  fontSize: isMobile ? '12px' : '14px',
                  padding: isMobile ? '6px' : '8px',
                }}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke={chartColor}
                strokeWidth={isMobile ? 1.5 : 2}
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
