import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FolderOpen } from "lucide-react";

const DetailedProjectView: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FolderOpen className="w-5 h-5" />
          Detailed Project View
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-96 bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg flex items-center justify-center">
          <p className="text-gray-600 dark:text-gray-400">
            This would be a detailed project management interface loaded lazily
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default DetailedProjectView;
