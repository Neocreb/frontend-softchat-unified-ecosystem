import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";

const HeavyAnalyticsChart: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5" />
          Heavy Analytics Chart
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg flex items-center justify-center">
          <p className="text-gray-600 dark:text-gray-400">
            This would be a heavy analytics chart component loaded lazily
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default HeavyAnalyticsChart;
